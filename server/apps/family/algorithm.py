import numpy as np
import random
from matching.games import StableMarriage
from datetime import date

from .models import Family, MembershipFamily, QuestionMember, AnswerFamily


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
	question_list = QuestionMember.objects.all().values('id', 'coeff', 'equivalent')
	return question_list


def get_answer(member:MembershipFamily, question):
	'''Get the answer to a question for a member'''
	answers = [ans for ans in member.answermember_set.all() if ans.question.id==question['id']]

	if len(answers) == 1:
		# ordinary question case
		ans = answers[0].answer
		if member.role == '2A+' and question['equivalent'] is not None:
			# we check if we have to penderate with a family question
			f_ans = [ans for ans in member.group.answerfamily_set.all() if ans.question.id==question['equivalent']][0]
			f_ans_value = f_ans.answer
			quota = f_ans.question.quota/100
			ans = (1-quota)*ans + quota*f_ans_value
		return ans
	
	elif len(answers) == 0:
		# case of no answer to this question
		if member.role == '2A+' and question['equivalent'] is not None:
			# ordinary case : it is an only-family question (quota=100)
			# or if he didn't answer we take the family answer
			f_ans = [ans for ans in member.group.answerfamily_set.all() if ans.question.id==question['equivalent']][0]
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
		return somme/somme_coeff
	else:
		raise Exception('One of the students has no answers')


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
			index = random.choice(index_members)
			member2A_list = np.delete(member2A_list, index)
			i += 1
	
	return member2A_list



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

	# Make sure both lists have the same lenght
	print('Checking the length...')
	member2A_list = make_same_length(member1A_list, member2A_list, family_list)

	# randomize lists in order to avoid unwanted effects
	print('Randomize lists...')
	random.shuffle(member1A_list)
	random.shuffle(member2A_list)

	# creating the dicts
	print('Creating the dicts for solving...')
	N = len(member1A_list)
	firstYear_prefs = {}
	secondYear_prefs = {}
	for i in range(N):
		firstYear_prefs[i] = sorted(
			range(N), 
			key=lambda n: loveScore(member2A_list[n]['answers'], member1A_list[i]['answers'], coeff_list)
		)
		secondYear_prefs[i] = sorted(
			range(N), 
			key=lambda n: loveScore(member2A_list[i]['answers'], member1A_list[n]['answers'], coeff_list)
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
		member1A_list[id_1A]['family'] = member2A_list[id_2A]['family']
	
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


