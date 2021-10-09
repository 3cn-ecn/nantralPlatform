from apps.family.models import QuestionFamily
from .utils import *


def check_itii_answers(family_list, question_list):
	question_id = QuestionFamily.objects.get(code_name='Itii').id
	question_value = 0
	new_family_list = []
	for f in family_list:
		f_ans = [ans for ans in f.answerfamily_set.all() if ans.question.id==question_id][0]
		if f_ans.answer == question_value:
			new_family_list.append(f)
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
	_, family_list = get_member2A_list(question_list)
	family_list = check_itii_answers(family_list, question_list)
	
	# count difference of number of members per family
	print('Calculate the deltas...')
	placed_1A = MembershipFamily.objects.filter(role='1A', group__year=scholar_year()).prefetch_related('group')
	for f in family_list:
		nb_1A = len([m for m in placed_1A if m.group==f['family']])
		nb_2A = f['nb']
		f['delta'] = nb_1A - nb_2A
	
	# math the correct number : we add families and priorize the little ones
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
	return itii_list, family_list


