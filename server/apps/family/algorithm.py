import numpy as np
import random
from matching.games import StableMarriage
from datetime import date

import sys
sys.setrecursionlimit(150000)

from .models import Family, MembershipFamily, QuestionMember


def vectisnan(vect:np.ndarray) -> bool:
	"""Return True if all elements are NaN, else False."""
	return np.prod(np.isnan(vect)) == 1

def vecthasnan(vect:np.ndarray) -> bool:
	"""Return True if the vect has a NaN, else False."""
	return np.sum(np.isnan(vect)) > 0


def get_question_list():
	"""Get the questions as a list of dicts, with keys id, coeff 
	and if there is an equivalent question for families, and then 
	defines the NAN_VECT constant."""
	question_list = QuestionMember.objects.all().values('id', 'coeff', 'equivalent', 'code_name')
	return question_list


def get_answer(member:MembershipFamily, question):
	'''Get the answer to a question for a member'''
	answers = [ans for ans in member.answermember_set.all() if ans.question.id==question['id']]

	if len(answers) == 1:
		# ordinary question case
		ans = answers[0].answer
		if member.role == '2A+' and question['equivalent'] is not None:
			# we check if we have to penderate with a family question
			try: 
				f_ans = [ans for ans in member.group.answerfamily_set.all() if ans.question.id==question['equivalent']][0]
				f_ans_value = f_ans.answer
				quota = f_ans.question.quota/100
				ans = (1-quota)*ans + quota*f_ans_value
			except IndexError:
				raise Exception(f'La famille {member.group} n\'a pas répondu aux questions.')
		return ans
	
	elif len(answers) == 0:
		# case of no answer to this question
		if member.role == '2A+' and question['equivalent'] is not None:
			# ordinary case : it is an only-family question (quota=100)
			# or if he didn't answer we take the family answer
			try: 
				f_ans = [ans for ans in member.group.answerfamily_set.all() if ans.question.id==question['equivalent']][0]
			except IndexError:
				raise Exception(f'La famille {member.group} n\'a pas répondu aux questions.')
			return f_ans.answer
		else:
			return np.nan
	
	else:
		# bug case : a member must not have two answers for the same question
		raise Exception(f'User {member.student} has multiple answers for the {question.id} question')


def get_answers(member:MembershipFamily, question_list):
	"""Get all the answers to the question_list for a member"""
	answers = []
	for question in question_list:
		answer = get_answer(member, question)
		answers.append(answer)
	return np.array(answers)



def get_member1A_list(question_list):
	"""Get the list of 1A students with their answers"""
	data = MembershipFamily.objects.filter(role='1A', group__isnull=True).prefetch_related(
		'answermember_set__question', 'group__answerfamily_set__question')
	member1A_list = []
	for membership in data:
		answers = get_answers(membership, question_list)
		if not vectisnan(answers):
			member1A_list.append({
				'member': membership,
				'answers': answers
			})
	return member1A_list


def get_member2A_list(question_list):
	"""Get the list of 2A+ students with their answers"""

	# add all membershipFamily students
	data = MembershipFamily.objects.filter(role='2A+', group__year=date.today().year).prefetch_related(
		'answermember_set__question', 'group__answerfamily_set__question')
	member2A_list = []
	for membership in data:
		member2A_list.append({
			'member': membership,
			'answers': get_answers(membership, question_list),
			'family': membership.group,
		})
	
	# calculate the average answer for each family
	family_list = get_family_list(member2A_list)

	# fill the blank for members who do not responded with family answers
	for m in member2A_list:
		if vecthasnan(m['answers']):
			# we search the family answers of this member
			fam_answers = [f for f in family_list if f['family']==m['family']][0]['answers']
			if vectisnan(m['answers']):
				m['answers'] = fam_answers
			else:
				for i in range(m['answers'].size):
					m['answers'][i] = fam_answers[i]

	# add the non_subscribed_members
	for family in family_list:
		if family['family'].non_subscribed_members:
			m_list = family['family'].non_subscribed_members.split(',')
			for m in m_list:
				member2A_list.append({
					'member': m,
					'answers': family['answers'],
					'family': family['family'],
				})
	
	return member2A_list, family_list



def get_family_list(member2A_list):
	"""return a list of families with the average answer
	based of all his members who completed the form"""
	family_list = []
	for fam in Family.objects.filter(year=date.today().year):
		answers_list = np.array([m['answers'] for m in member2A_list if m['family']==fam])
		answers_mean = np.nanmean(answers_list, axis=0)
		if answers_mean is np.nan: raise Exception(f'Family {fam.name} has no members')
		if vectisnan(answers_mean): raise Exception(f'Members of {fam.name} have no answers')
		family_list.append({
			'family': fam,
			'answers': answers_mean,
			'nb': fam.count_members2A(),
		})
	return family_list



def loveScore(answersA, answersB, coeff_list):
	"""Calculate the lovescore between two students.
	The lower the score is, the best it is."""

	somme = np.nansum(np.abs(answersA - answersB) * coeff_list)
	somme_coeff = np.sum((1-np.isnan(answersA+answersB)) * coeff_list)

	if somme_coeff:
		# if we can calculate the score
		return somme/somme_coeff
	else:
		# if one of the students has not answered to any coefficiented question
		return np.inf


def make_same_length(member1A_list, member2A_list, family_list):
	'''Add or delete 2A students so as to have the same number
	than 1A students'''

	def lenFamily(family):
		return family['nb']

	delta_len = len(member1A_list) - len(member2A_list)

	if delta_len > 0: # more first year than second year
		# we add fake members in each family, one by one, 
		# the more little first with the mean answer of the family
		family_list.sort(key=lenFamily)
		i = 0
		n = len(family_list)
		while delta_len - i > 0:
			member2A_list.append({
				'member': f'Fake member {i}',
				'answers': family_list[i % n]['answers'],
				'family': family_list[i % n]['family'],
			})
			i += 1

	elif delta_len < 0: # more second year than first year
		# Remove random second year students, in big families first
		family_list.sort(key=lenFamily, reverse=True)
		i = 0
		n = len(family_list)
		while delta_len + i < 0:
			index_members = [
				j for j in range(len(member2A_list)) 
				if member2A_list[j]['family']==family_list[i % n]['family']
			]
			try:
				index = random.choice(index_members)
			except IndexError:
				raise Exception("Erreur : pas encore assez de 1A pour faire tourner l'algo.")
			member2A_list = np.delete(member2A_list, index)
			i += 1
	
	return member2A_list



def prevent_lonelyness(member1A_list, member2A_list, family_list, q_id, q_val, q_name, coeff_list):
	"""Empêcher de créer des familles avec des personnes seules du point de vue
	d'un critère : femmes, étudiants étrangers..."""

	# on regarde pour chaque membre le critère
	for m in member1A_list:
		m[q_name] = m['answers'][q_id] == q_val
	for m in member2A_list:
		m[q_name] = m['answers'][q_id] == q_val
	# on compte le nombre de personnes avec ce critère par famille
	for f in family_list:
		f['nb_critery_1A'] = len([m for m in member1A_list if m[q_name] and m['family']==f['family']])
		f['nb_critery_2A'] = len([m for m in member2A_list if m[q_name] and m['family']==f['family']])
	# on cherche les familles avec une personne seule pour le critère
	for f in family_list:
		if f['nb_critery_1A'] == 1 and f['nb_critery_2A'] == 0:
			# on récupère le membre seul dans la famille et son id
			lonely_member_id = [
				i 
				for i in range(len(member1A_list)) 
				if member1A_list[i][q_name] and member1A_list[i]['family']==f['family']
			][0]
			lonely_member = member1A_list[lonely_member_id]
			# on sélectionne les membres dans une famille qui ont déjà un membre
			# avec ce critère où on peut rajouter le membre seul
			candidate_member_list = []
			for g in family_list:
				if g!=f and (g['nb_critery_1A']>=1 or g['nb_critery_2A']>=1):
					members = [m for m in member1A_list if not m[q_name] and m['family']==g['family']]
					candidate_member_list += members
			# si il y a des membres avec qui échanger
			if candidate_member_list:
				# on cherche le membre candidat avec le score le plus proche
				candidate_member = min(
					candidate_member_list, 
					key=lambda m: loveScore(m['answers'], lonely_member['answer'], coeff_list)
				)
				# on récupère l'index du candidat dans la liste member1A_list
				candidate_member_id = [i for i in range(len(member1A_list)) if member1A_list[i]==candidate_member][0]
				candidate_family_id = [i for i in range(len(family_list)) if family_list[i]['family']==candidate_member['family']][0]
				# on échange les familles
				member1A_list[lonely_member_id]['family'] = family_list[candidate_family_id]['family']
				member1A_list[candidate_member_id]['family'] = f['family']
				# on met à jour le nb de personnes avec critère dans ces familles
				f['nb_critery_1A'] -= 1
				family_list[candidate_family_id]['nb_critery_1A'] += 1
	return member1A_list



def main_algorithm():
	# get the questionnary
	print('Get questions...')
	question_list = get_question_list()
	coeff_list = np.array([q['coeff'] for q in question_list], dtype=int)

	# get the members list with their answers for each question
	print('Get 1A answers...')
	member1A_list = get_member1A_list(question_list)
	print('Get 2A answers...')
	member2A_list, family_list = get_member2A_list(question_list)

	# Add or delete 2A members so as to have the same length as 1A members
	print('Checking the length...')
	member2A_list_plus = make_same_length(member1A_list, member2A_list, family_list)

	# randomize lists in order to avoid unwanted effects
	print('Randomize lists...')
	random.shuffle(member1A_list)
	random.shuffle(member2A_list_plus)

	# creating the dicts
	print('Creating the dicts for solving...')
	N = len(member1A_list)
	firstYear_prefs = {}
	secondYear_prefs = {}
	for i in range(N):
		firstYear_prefs[i] = sorted(
			range(N), 
			key=lambda n: loveScore(member2A_list_plus[n]['answers'], member1A_list[i]['answers'], coeff_list)
		)
		secondYear_prefs[i] = sorted(
			range(N), 
			key=lambda n: loveScore(member2A_list_plus[i]['answers'], member1A_list[n]['answers'], coeff_list)
		)
	
	# make the marriage and solve the problem! Les 1A sont privilégiés dans leurs préférences
	print('Solving...')
	game = StableMarriage.create_from_dictionaries(
		firstYear_prefs, secondYear_prefs
	)
	dict_solved = game.solve()

	# get the family for each 1A
	print('Add families to 1A members')
	for player_1A, player_2A in dict_solved.items():
		id_1A = player_1A.name
		id_2A = player_2A.name
		member1A_list[id_1A]['family'] = member2A_list_plus[id_2A]['family']
	
	# prevent lonely girls
	print("checking that no girl is alone")
	question_id = [i for i in range(len(question_list)) if question_list[i]['code_name']=='Genre'][0]
	question_value = 1
	member1A_list = prevent_lonelyness(member1A_list, member2A_list, family_list, question_id, question_value, 'genre', coeff_list)

	# prevent lonely foreign students
	print("Checking that no international student is alone")
	question_id = [i for i in range(len(question_list)) if question_list[i]['code_name']=='International'][0]
	question_value = 0
	member1A_list = prevent_lonelyness(member1A_list, member2A_list, family_list, question_id, question_value, 'inter', coeff_list)
	
	print('Done!')
	return member1A_list, member2A_list, family_list



def save(member1A_list):
	'''Save the families for 1A students in the database'''
	print('Saving...')
	for member1A in member1A_list:
		member1A['member'].group = member1A['family']
		member1A['member'].save()
	print('Saved!')
	


def reset():
	"""Reset the decision of the algorithm"""
	print('Deleting...')
	for m in MembershipFamily.objects.filter(role='1A', group__year=date.today().year):
		m.group = None
		m.save()
	print('Deleted!')


