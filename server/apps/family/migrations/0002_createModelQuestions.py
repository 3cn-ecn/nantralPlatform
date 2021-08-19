# Generated by Django 3.2.4 on 2021-08-08 12:28

from django.db import migrations
from apps.family.models import *

def create_questions(apps, schema_editor):

    ### PAGE 1
    p1 = QuestionPage.objects.create(
        order=1, 
        name="Pour commencer...", 
        name_en="To begin with...",
    )
    q1 = QuestionMember.objects.create(
        code_name="Nombre", 
        label="Choisis un chiffre entre 1 et 10",
        label_en="Choose a number between 1 and 10",
        page=p1,
        coeff=0,
        order=4,
    )
    q1.option_set.create(value=1, text="1", text_en="1")
    q1.option_set.create(value=2, text="2", text_en="2")
    q1.option_set.create(value=3, text="3", text_en="3")
    q1.option_set.create(value=4, text="4", text_en="4")
    q1.option_set.create(value=5, text="5", text_en="5")
    q1.option_set.create(value=6, text="6", text_en="6")
    q1.option_set.create(value=7, text="7", text_en="7")
    q1.option_set.create(value=8, text="8", text_en="8")
    q1.option_set.create(value=9, text="9", text_en="9")
    q1.option_set.create(value=10, text="10", text_en="10")
    q2 = QuestionMember.objects.create(
        code_name="Genre",
        label="À quel genre t'identifies-tu ?",
        label_en="What gender do you identify with?",
        page=p1,
        coeff=0,
        order=1,
    )
    q2.option_set.create(value=0, text="Masculin", text_en="Male")
    q2.option_set.create(value=1, text="Féminin", text_en="Female")
    q2.option_set.create(value=2, text="Autre", text_en="Other")
    q3 = QuestionMember.objects.create(
        code_name='International',
        label="Es-tu un·e élève étranger·ère ?",
        label_en="Are you a foreign student?",
        page=p1,
        coeff=0,
        order=2,
    )
    q3.option_set.create(value=0, text="Oui", text_en="Yes")
    q3.option_set.create(value=1, text="Non", text_en="No")
    q4 = QuestionMember.objects.create(
        code_name='ITII',
        label="Es-tu un·e étudiant·e en ITII ?",
        label_en="Are you an ITII student?",
        page=p1,
        coeff=0,
        order=3,
    )
    q4.option_set.create(value=0, text="Oui", text_en="Yes")
    q4.option_set.create(value=1, text="Non", text_en="No")

    ### PAGE 2
    details1A="Pour ne jamais être à court de sujets de discussion, voici quelques questions à propos de tes goûts.",
    details1A_en="Here are some questions about your tastes, so that you can always have something to talk about",
    p2 = QuestionPage.objects.create(
        order=2,
        name="Tes goûts",
        name_en="Your tastes",
        details1A=details1A,
        details1A_en=details1A_en,
        details2A=details1A,
        details2A_en=details1A_en,
    )
    # question 1
    q1 = GroupQuestion.objects.create(
        code_name='BDX',
        label = "Es-tu susceptible de lister :",
        label_en = "Do you plan to join a group of student in order to be part of one of those associations ?",
        page=p2,
        coeff=2,
        order=1,
    )
    q1.option_set.create(value=0, text="Oui", text_en="Yes")
    q1.option_set.create(value=1, text="Non", text_en="No")
    q1.questionmember_set.create(label='BDE')
    q1.questionmember_set.create(label='BDA')
    q1.questionmember_set.create(label='BDS')
    # question 2
    q2 = GroupQuestion.objects.create(
        code_name='Musique',
        label="Quels sont tes goûts musicaux ?",
        label_en="What are your musical tastes?",
        page=p2,
        coeff=1,
        order=2,
    )
    q2.option_set.create(value=0, text="J'adore", text_en="I love")
    q2.option_set.create(value=1, text="J'apprécie", text_en="I like")
    q2.option_set.create(value=2, text="Indifférent/Je n'aime pas", text_en="No interest/I don't like")
    q2.questionmember_set.create(label="Rock")
    q2.questionmember_set.create(label="Métal", label_en="Metal")
    q2.questionmember_set.create(label="Electro posé", label_en="Electro soft")
    q2.questionmember_set.create(label="Electro hard", label_en="Electro hard")
    q2.questionmember_set.create(label="Rap")
    q2.questionmember_set.create(label="Pop")
    q2.questionmember_set.create(label="Musique française", label_en="French music")
    q2.questionmember_set.create(label="Musique classique", label_en="Classical music")
    q2.questionmember_set.create(label="Jazz")
    q2.questionmember_set.create(label="Kpop")
    # question 3
    q3 = GroupQuestion.objects.create(
        code_name="Arts",
        label="En terme artistique, quels sont tes goûts ?",
        label_en="What are your artistic tastes?",
        page=p2,
        coeff=1,
        order=3,
    )
    q3.option_set.create(value=0, text="J'adore", text_en="I love")
    q3.option_set.create(value=1, text="J'apprécie", text_en="I like")
    q3.option_set.create(value=2, text="Indifférent/Je n'aime pas", text_en="No interest/I don't like")
    q3.questionmember_set.create(label="Peinture", label_en="Painting")
    q3.questionmember_set.create(label="Littérature", label_en="Literature")
    q3.questionmember_set.create(label="Sculpture", label_en="Sculpture")
    q3.questionmember_set.create(label="Danse", label_en="Dance")
    q3.questionmember_set.create(label="Musique", label_en="Music")
    q3.questionmember_set.create(label="Théâtre", label_en="Drama")
    q3.questionmember_set.create(label="Cinéma", label_en="Cinema")
    q3.questionmember_set.create(label="Graphisme", label_en="Drawing/graphic design")
    q4 = GroupQuestion.objects.create(
        code_name="Sports",
        label="Et sportivement ?",
        label_en="And what about sports?",
        page=p2,
        coeff=1,
        order=4,
    )
    q4.option_set.create(value=0, text="J'adore", text_en="I love")
    q4.option_set.create(value=1, text="J'apprécie", text_en="I like")
    q4.option_set.create(value=2, text="Indifférent/Je n'aime pas", text_en="No interest/I don't like")
    q4.questionmember_set.create(label="Rugby", label_en="Rugby")
    q4.questionmember_set.create(label="Hand", label_en="Hand")
    q4.questionmember_set.create(label="Foot", label_en="Football")
    q4.questionmember_set.create(label="Tennis", label_en="Tennis")
    q4.questionmember_set.create(label="Aviron", label_en="Rowing")
    q4.questionmember_set.create(label="Volley", label_en="Volley")
    q4.questionmember_set.create(label="Sports de combat", label_en="Fighting sports")
    q4.questionmember_set.create(label="Danse", label_en="Dance")
    q4.questionmember_set.create(label="Athlétisme", label_en="Athetics")

    ### PAGE 3
    p3 = QuestionPage.objects.create(
        order=3,
        name="Soirées",
        name_en="Parties",
    )
    # question 1
    q1 = GroupQuestion.objects.create(
        code_name="Avec tes potes",
        label="Avec des potes, tu aimes faire :",
        label_en='With your friends, you like to :',
        page=p3,
        coeff=2,
        order=1,
    )
    q1.option_set.create(value=0, text="J'adore", text_en="I love")
    q1.option_set.create(value=1, text="J'apprécie", text_en="I like")
    q1.option_set.create(value=2, text="Indifférent/Je n'aime pas", text_en="No interest/I don't like")
    q3.questionmember_set.create(label="Du sport", label_en="Practise sport")
    q3.questionmember_set.create(label="Aller au ciné", label_en="Go to the cinema")
    q3.questionmember_set.create(label="Des sorties culturelles", label_en="Cultural activities")
    q3.questionmember_set.create(label="Jouer aux jeux vidéos/de société", label_en="Play board or video games")
    q3.questionmember_set.create(label="Regarder un match", label_en="Watch a match")
    # question 2
    q2 = QuestionMember.objects.create(
        code_name = "Alcool",
        label="En soirée, comment comptes-tu boire :",
        label_en="How much do you drink during a party?",
        page=p3,
        coeff=14,
        order=2,
    )
    q2.option_set.create(value=0, text="Pas du tout", text_en="I don't drink")
    q2.option_set.create(value=1, text="Quelques verres", text_en="A few drinks")
    q2.option_set.create(value=2, text="Pas mal de verres", text_en="More drinks")
    q2.option_set.create(value=3, text="Bourré", text_en="Drunk")
    q2.option_set.create(value=4, text="Trop bien", text_en="Too many drinks")
    q2.option_set.create(value=5, text="Beaucoup trop", text_en="The answer above too many drinks")
    # question 3
    q3 = QuestionMember.objects.create(
        code_name="Fréquence de sortie",
        label="A quelle fréquence comptes-tu sortir :",
        label_en = "How often do you think you'll go out?",
        page=p3,
        coeff=14,
        order=3,
    )
    q3.option_set.create(value=0, text="Jamais", text_en="Never")
    q3.option_set.create(value=1, text="Une fois par mois", text_en="Once a month")
    q3.option_set.create(value=2, text="Une fois par semaine", text_en="Once a week")
    q3.option_set.create(value=3, text="Plusieurs fois par semaine", text_en="Several times a week")
    q3.option_set.create(value=4, text="Une fois par jour (ou plus)", text_en="Once a day (or more)")
    # question 4
    q4 = GroupQuestion.objects.create(
        code_name="Type de soirée",
        label="Quel(s) type(s) de soirées affectionnes-tu ?",
        label_en='Which type of party do you like?',
        page=p3,
        coeff=4,
        order=4,
    )
    q4.option_set.create(value=0, text="J'adore", text_en="I love")
    q4.option_set.create(value=1, text="J'apprécie", text_en="I like")
    q4.option_set.create(value=2, text="Indifférent/Je n'aime pas", text_en="No interest/I don't like")
    q4.questionmember_set.create(label="Dans un bar", label_en="In a bar")
    q4.questionmember_set.create(label="Tranquille dans un appart", label_en="Relax in an apartment")
    q4.questionmember_set.create(label="Grosse soirée dans un appart", label_en="Big party in an apartment")
    q4.questionmember_set.create(label="En boîte", label_en="In a nightclub")
    # question 5
    q5 = QuestionMember.objects.create(
        code_name="Fumette",
        label="Tu fumes autre chose que du tabac ?",
        label_en = "Do you smoke something that is not tobacco?",
        page=p3,
        coeff=10,
        order=5,
    )
    q5.option_set.create(value=0, text="Non", text_en="No")
    q5.option_set.create(value=1, text="Occasionnellement", text_en="Sometimes")
    q5.option_set.create(value=2, text="Régulièrement", text_en="Often")

    # QUESTIONS FAMILLES
    # question 1
    f1 = QuestionFamily.objects.create(
        label="Fréquence des soirées", 
        label_en="Party Frequency",
        order=1,
        equivalent=q3,
        quota=33,
    )
    f1.option_set.create(value=0, text="Jamais", text_en="Never")
    f1.option_set.create(value=1, text="Une fois par mois", text_en="Once a month")
    f1.option_set.create(value=2, text="Une fois par semaine", text_en="Once a week")
    f1.option_set.create(value=3, text="Plusieurs fois par semaine", text_en="Several times a week")
    f1.option_set.create(value=4, text="Une fois par jour (ou plus)", text_en="Once a day (or more)")
    # question 2
    f2 = QuestionFamily.objects.create(
        code_name = "Alcool",
        label="En termes d'alcool, où se situe la famille ? (en moyenne, à peu près)",
        label_en = "Which quantity of alcohol does the family drink? (in average)",
        order=2,
        equivalent=q2,
        quota=100,
    )
    f2.option_set.create(value=0, text="Pas du tout", text_en="I don't drink")
    f2.option_set.create(value=1, text="Quelques verres", text_en="A few drinks")
    f2.option_set.create(value=2, text="Pas mal de verres", text_en="More drinks")
    f2.option_set.create(value=3, text="Bourré", text_en="Drunk")
    f2.option_set.create(value=4, text="Trop bien", text_en="Too many drinks")
    f2.option_set.create(value=5, text="Beaucoup trop", text_en="The answer above too many drinks")
    # question 3
    f3 = QuestionFamily.objects.create(
        code_name="Parrainages Games",
        label="Etes-vous chauds pour les <i>Parrainages Games</i> ? (le samedi)",
        label_en="Do you want to participate to the Mentoring Games? (on Saturday)",
        order=3,
        quota=0,
    )
    f3.option_set.create(value=0, text="Oui", text_en="Yes")
    f3.option_set.create(value=1, text="Non", text_en="No")



class Migration(migrations.Migration):

    dependencies = [
        ('family', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_questions)
    ]
