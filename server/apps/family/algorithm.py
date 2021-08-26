from .models import *
from .utils import *

import numpy as np
import random


def get_question_list():
	question_list = QuestionMember.objects.all().values('id', 'coeff', 'equivalent')
	return question_list


def get_answer(member:MembershipFamily, question):
	'''Get the answer to a question for a member'''
	answers = member.answermember_set.filter(question=question['id'])

	if answers.count() == 1:
		# ordinary question case
		ans = answers.first().answer
		if member.role == '2A+' and question['equivalent'] is not None:
			# we check if we have to penderate with a family question
			f_ans = AnswerFamily.objects.get(
				family = member.group,
				question = question['equivalent'],
			)
			f_ans_value = f_ans.answer
			quota = f_ans.question.quota/100
			ans = (1-quota)*ans + quota*f_ans_value
		return ans
	
	elif answers.count() == 0:
		# case of no answer to this question
		if member.role == '2A+' and question['equivalent'] is not None:
			# ordinary case : it is an only-family question (quota=100)
			# or if he didn't answer we take the family answer
			f_ans = AnswerFamily.objects.get(
				family = member.group,
				question = question['equivalent'],
			)
			return f_ans.answer
		else:
			return None
	
	else:
		# bug case : a member must not have two answers for the same question
		raise Exception(f'User {member.student} has multiple answers for the {question.id} question')


def get_answers(member:MembershipFamily, question_list):
	answers = []
	for question in question_list:
		answers.append(get_answer(member, question))
	return answers


def loveScore(answersA, answersB, question_list):
	"""Calcule le loveScore entre deux élèves"""
	somme = 0
	somme_coeff = 0
	for i in range(len(question_list)):
		if answersA[i] and answersB[i]:
			somme += np.abs(answersA[i]-answersB[i]) * question_list[i]['coeff']
			somme_coeff += question_list[i]['coeff']
	return somme/somme_coeff
		