from apps.family.models import QuestionFamily
from .utils import *


def check_itii_answers(family_list):
	try:
		question_id = QuestionFamily.objects.get(code_name='itii').id
	except QuestionFamily.DoesNotExist:
		raise Exception("Pas de question labellisée 'itii' dans le questionnaire famille")
	question_value = 0
	new_family_list = []
	for f in family_list:
		try:
			f_ans = [ans for ans in f['family'].answerfamily_set.all() if ans.question.id==question_id][0]
			if f_ans.answer == question_value:
				new_family_list.append(f)
		except IndexError:
			# the family didn't answered this question
			pass
	return new_family_list



def itii_algorithm():
	"""Relaunch the main algorithm but for itii only"""

	# get the questionnary
	print('Get questions...')
	question_list = get_question_list()
	coeff_list = np.array([q['coeff'] for q in question_list], dtype=int)

	# get the members list with their answers for each question
	print('Get 1A itii answers...')
	itii_list = get_member1A_list(question_list, itii=True)

	# get the family who have said yes to itii question
	print('Get family answers...')
	member2A_list, family_list = get_member2A_list(question_list)
	family_list = check_itii_answers(family_list)
	
	# count difference of number of members per family
	print('Calculate the deltas...')
	placed_1A = MembershipFamily.objects.filter(role='1A', group__year=scholar_year()).prefetch_related('group')
	for f in family_list:
		nb_1A = len([m for m in placed_1A if m.group==f['family']])
		nb_2A = f['nb']
		f['delta'] = nb_1A - nb_2A
	
	# match the correct number : we add families and priorize the little ones
	family_list.sort(key=lambda f: f['nb'])
	family_list.sort(key=lambda f: f['delta'])
	# duplicate families
	while len(itii_list) > len(family_list):
		family_list += family_list
	# delete family "en trop"
	if len(itii_list) < len(family_list):
		family_list = family_list[:len(itii_list)]

	# Solve the matching problem
	itii_result_list = solveProblem(itii_list, family_list, coeff_list)

	# saving in database
	print('Saving...')
	save(itii_result_list)

	print('Done!')
	return itii_list, member2A_list, family_list



def reset_itii():
	"""Reset the decision of the algorithm"""
	print('Deleting...')
	m_list = MembershipFamily.objects.filter(
		role='1A', 
		group__year=scholar_year(), 
		student__faculty='Iti')
	for m in m_list:
		m.group = None
		m.save()
	print('Deleted!')
