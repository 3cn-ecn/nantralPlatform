# this is the first version of the algorithm !
# it was made to use datas from a csv file, 
# extracted from a google form
# feel free to use it if a year you can't use 
# nantral platform anymore

import logging
logging.basicConfig(level=logging.DEBUG)

import sys
sys.setrecursionlimit(99999)

import numpy as np
import csv
import copy
import random
from pprint import pprint
from difflib import SequenceMatcher

# Compare two strings and return a float representing similarities.
def similar(a, b):
	res = SequenceMatcher(None, a, b).ratio()

COLUMN_ID_NAME = 1
FILE_FIRST_YEAR = 'answers-fillots.csv'
FILE_FIRST_YEAR_EN = 'answers-fillots-en.csv'
FILE_SECOND_YEAR = 'answers-parrains.csv'
FILE_FAMILIES = 'answers-familles.csv'

DICT_LOVELIKE = {
	"J'adore": 0,
	"J'apprÃ©cie": 1,
	"IndiffÃ©rent/Je n'aime pas": 2,

	"I love": 0,
	"I like": 1,
	"No interest/I don't like": 2
}

DICT_YESNO = {
	'Oui': 0, 'oui': 0,
	'Non': 1, 'non': 1,

	'Yes': 0, 
	'No': 1
}

DICT_DRINK = {
	'Pas du tout': 0,
	'Quelques verres': 1,
	'BourrÃ©': 2,
	'Un peu trop': 3,
	'Vers l\'infini et l\'au-delà' : 4,

	'I don\'t drink': 0,
	'a few drinks': 1,
	'Drunk': 2,
	'Too many drinks': 3,
	'The answer above too many drinks': 4
}

DICT_DRINK_FAMILY = {
	'On ne boit pas une goutte': 0,
	'Quelques verres': 1,
	'BourrÃ©': 2,
	'On boit un peu trop': 3,
	'Vers l\'infini et l\'au-delà' : 4
}

DICT_PARTY = {
	'Jamais': 0,
	'Une fois par mois': 1,
	'Une fois par semaine': 2,
	'Plusieurs fois par semaine': 3, 
	'Une fois par jour (ou plus)': 4,

	'Never': 0,
	'Once a month': 1,
	'Once a week': 2,
	'Several times a week': 3,
	'Never get tired': 4
}

DICT_PARTY_FAMILY = {
	'Jamais': 0,
	'Une fois par mois': 1,
	'Une fois par semaine': 2,
	'Plusieurs fois par semaine': 3, 
	'Une fois par jour (ou plus)': 4
}

DICT_FUMETTE = {
	'Non': 0,
	'Occasionnelement': 1,
	'RÃ©guliÃ¨rement': 2,

	'No': 0,
	'Sometimes': 1,
	'Often': 2
}

# Déclaration des questions
questions = [
	None, # Horodateur
	None, # Prénom NOM
	None # 1 à 10
]
questions += [DICT_YESNO] * 3 # BDE/BDA/BDS
questions += [DICT_LOVELIKE] * 10 # Musique
questions += [DICT_LOVELIKE] * 8 # Art
questions += [DICT_LOVELIKE] * 11 # Sport
questions += [DICT_LOVELIKE] * 5 # Avec tes potes
questions += [DICT_DRINK] # Boisson
questions += [DICT_PARTY] # Fréquence de sortie
questions += [DICT_LOVELIKE] * 4 # Type de soirée
questions += [DICT_FUMETTE] # Fumette
#print(questions)

questions_family = [
	None, # Horodateur
	None, None, None, None, None, None, None, # Members
	None, # Family name
	DICT_PARTY_FAMILY, 
	DICT_DRINK_FAMILY,
]

# Déclaration des coefficients
coeffs = [0, 0, 0]
coeffs += [2] * 3 # BDE/BDA/BDS
coeffs += [1] * 10 # Musique
coeffs += [1] * 8 # Art
coeffs += [3] * 11 #Sport
coeffs += [2] * 5 # Avec tes potes
coeffs += [0] #alcool (pas compté individuellement mais avec la famille seulement)
coeffs += [14] # Fréquence de sortie
coeffs += [4] * 4 # Type de soirée
coeffs += [10] # Fumette

questionsCoeff = np.array(coeffs, dtype=int)

class Student:
	def __init__(self, studentId, name, answers):
		self.id = studentId
		self.name = name
		self.answers = answers
		self.family = None

	def __repr__(self):
		return 'Student(%d, %s)' % (self.id, self.name)

	def setFamily(self, family):
		self.family = family

class Family(list):
	def __init__(self, name, id):
		super().__init__(self)
		self.name = name
		self.id = id

def readlineAnswers(line, questions):
	"""
	Permet de convertir une ligne du fichier CSV en un tableau numpy des réponses.
	line : liste de chaînes de caractères correspondant à une série de réponse
	"""

	#decouper la ligne : 
	#print(line)
	#line_cut = line[0].split('","')
	#line_cut.insert(0,"decalage")
	#line_cut[-1] = line_cut[-1][0:len(line_cut[-1])-1]
	answers = np.zeros(len(questions), dtype=float)

	for i, question in enumerate(questions):
		print("answers")

		if question is not None:
			#print(i)
			print(line)
			answer_str = line[i]
			answers[i] = question[answer_str]
			print(answers)
	#print(answers)

	return answers

	
	
def loveScore(answersA, answersB, coeffs=questionsCoeff):
	res = np.sum(np.abs(answersA - answersB) * coeffs)
	return res

def readFamilies(filepath, students):
	families = []

	with open(filepath, 'r', newline='') as csvfile:
		reader = csv.reader(csvfile, delimiter=',', quotechar='"')

		next(reader)
		id_neg = 1
		for i, row in enumerate(reader):
			f = Family(row[8], i+1) # Create family from name COLONNE 8 CORRESPOND A LA REPONSE NOM DE FAMILLE APRES LES 7 NOMS DES PARRAINS
			#print(type(Family(row[7], i+1)))
			#print(row[0])
			#print(type(f))
			#print(f.name)
			f.answers = readlineAnswers(row, questions_family)

			numberToDuplicate = 0 # Per family, number of persons who did not answer to the individual form.
			for i in range(6):
				personName = row[i+1].strip().lower()

				if not personName:
					continue

				found = False
				for student in students:
					if student.name.lower().strip() == personName:
						f.append(student)
						student.setFamily(f)

						student.answers[-1] = (2*student.answers[-1] + f.answers[-2])/3
						student.answers[-2] = (2*student.answers[-2] + f.answers[-1])/3

						found = True
						break
							 
				if not found:
					logging.debug('%s not found in students' % personName)
					numberToDuplicate += 1

			print(f.name, numberToDuplicate)
			# Replace persons who did not answers to the individual form by someone who answered
			if numberToDuplicate:
				random.shuffle(f)

				for i in range(numberToDuplicate):
					s = f[i]
					s = Student(-1, s.name, s.answers)
					s.setFamily(f)

					f.append(s)
					students.append(s)

			families.append(f)

	return families

def readAnswers(filepath):
	students = []

	with open(filepath, 'r', newline='') as csvfile:
		reader = csv.reader(csvfile, delimiter=',', quotechar='"')
	
		next(reader) # skip first row
		for studentId, row in enumerate(reader):
			print(row)
			#row_cut = row[0].split(",")
			answers = readlineAnswers(row, questions)
			personName = row[COLUMN_ID_NAME].strip()
			s = Student(studentId, personName, answers)

			students.append(s)
			#print(answers)

	return students
	


# -- Read files --
logging.debug('Lecture fichier fillots')
students_firstYear = readAnswers(FILE_FIRST_YEAR)
print("ei1 ok")
students_firstYear += readAnswers(FILE_FIRST_YEAR_EN)

random.shuffle(students_firstYear)

logging.debug('Lecture fichier parrains')
students_secondYear = readAnswers(FILE_SECOND_YEAR)

logging.debug('Lecture fichier famille')
families = readFamilies(FILE_FAMILIES, students_secondYear)
# -- --

# -- Make sure both lists have the same lenght --
delta_len = len(students_firstYear) - len(students_secondYear)
if delta_len > 0: # more first year than second year
	# Duplicate some secondYear in big families ?? SMALL FAMILIES ? (sans le reverse=true)
	families.sort(key=len) #families.sort(key=len, reverse=True)

	for i in range(delta_len):
		f = families[i % len(families)]
		
		s = copy.copy(random.choice(f)) # choose a student and copies it
		
		# Duplicate a second year student
		f.append(s)
		students_secondYear.append(s)  

elif delta_len < 0:
	# Remove some second year students (not implemented)
	raise NotImplementedError
# -- --

# -- Randomize lists in order to avoid unwanted effects --
random.shuffle(families)
random.shuffle(students_secondYear)
# -- --

N = len(students_firstYear)

# -- Create preferences lists based on loveScore --
logging.debug('Création du classement pour chaque étudiant')
# Etabli pour chaque première année, la liste ordonnée de ses préférences parmi les deuxièmes années
firstYear_prefs = {}
secondYear_prefs = {}
for i in range(N):
	
	firstYear_prefs[i] = sorted(
		range(N), 
		key=lambda n: loveScore(students_secondYear[n].answers, students_firstYear[i].answers)
	)
	secondYear_prefs[i] = sorted(
		range(N), 
		key=lambda n: loveScore(students_secondYear[i].answers, students_firstYear[n].answers)
	)

# -- --

# -- Solve the problem --
from matching.games import StableMarriage

game = StableMarriage.create_from_dictionaries(
	firstYear_prefs, secondYear_prefs
)
dict_solved = game.solve()
# -- --

families_solved = {}
orphans = {}

f = open('out.log', 'w')

for fillot_id, parrain_id in dict_solved.items():
	fillot = students_firstYear[fillot_id.name]
	parrain = students_secondYear[parrain_id.name]

	fillot.parrain = parrain
	parrain.fillot = fillot

	out_str = parrain.name + ' + ' + fillot.name + ' : ' + str(loveScore(fillot.answers, parrain.answers))
	#print(out_str)
	f.write(out_str + '\n')

	if parrain.family is None: # pas de famille pour le parrain
		orphans[parrain] = fillot
	else:
		familyName = parrain.family.name
		
		if familyName not in families_solved.keys():
			families_solved[familyName] = []
	
		families_solved[familyName].append(fillot)


f.close()

families.sort(key=lambda e: e.name)


out_str_1 = '<p><a href="/html/ei1.html">Voir la liste des etudiants EI1</a></p><h1>Liste des EI1 par famille</h1>' # EI2, présentation des familles
out_str_2 = out_str_1

"""
links = {}
with open('liens-photos.csv', 'r') as csvfile:
	reader = csv.reader(csvfile, delimiter=';', quotechar='"')
	next(reader)
	for row in reader:
		print(row[1])
		print(row[2])
		links[row[1]] = row[2]
"""

for family in families:
	out_str_1 += '<h2>%s (numero %d)</h2>' % (family.name.strip(), family.id)
	out_str_2 += '<h2>Famille numero %d</h2>' % family.id
	#print(out_str_1)
	#print(out_str_2)
	"""
	s = ' - <a href="%s" target="_blank">Voir les indices</a>' % links[family.name]
	out_str_1 += s
	out_str_2 += s
	
	out_str_1 += '<ul>'
	out_str_2 += '<ul>'
	"""
	for parrain in family:
		li = '<li>%s</li>' % parrain.fillot.name

		out_str_1 += li
		out_str_2 += li
	
	out_str_1 += '</ul>'
	out_str_2 += '</ul>'


table = []
for student in students_firstYear:
	
	f = student.parrain.family
	table.append((student.name, f.id))  #, links[f.name]

table.sort(key=lambda e: e[0])    #tri par familles
print(table)


out_str_3 = '<a href="/html/familles.html">Voir la liste des familles</a><p> </p><table><tr><th>Prenom NOM</th><th>Famille n°</th></tr>'

for name, fId in table:
#for name, fId, fLink in table:
	#out_str_3 += '<tr><td>%s</td><td><a href="%s" target="_blank">%d</a></td></tr>' % (name, fLink, fId)

	out_str_3 += '<tr><td>%s</td><td><a href="tests" target="_blank">%d</a></td></tr>' % (name, fId)

out_str_3 += '</table>'

HTML_TEMPLATE = """<!DOCTYPE html><html>
<head><meta charset="utf-8"><title></title></head>
<body>%s</body></html>"""

with open('b83b63ef41a40e68.html', 'w') as f:
	f.write(HTML_TEMPLATE % out_str_1)

with open('familles.html', 'w') as f:
	f.write(HTML_TEMPLATE % out_str_2)

with open('ei1.html', 'w') as f:
	f.write(HTML_TEMPLATE % out_str_3)


for fId, family in enumerate(families):
	s = str(fId) + ',' + family.name 

	print(s)