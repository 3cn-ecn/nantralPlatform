from .utils import *


def itii_algorithm():
	"""Relaunch the main algorithm but for itii only"""

	# get the questionnary
	print('Get questions...')
	question_list = get_question_list()
	coeff_list = np.array([q['coeff'] for q in question_list], dtype=int)

	# get the members list with their answers for each question
	print('Get 1A itii answers...')
	member1A_list = get_member1A_list(question_list, itii=True)
	print('Get family answers...')
	_, family_list = get_member2A_list(question_list)
    
	# Solve the matching problem
	member1A_list = solveProblem(member1A_list, member2A_list_plus, coeff_list)

	# saving in database
	print('Saving...')
	save(member1A_list)

	print('Done!')
	return member1A_list, member2A_list, family_list