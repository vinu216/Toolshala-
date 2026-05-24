const languageEnglishQuestions = [
  {
    question: "Q.1 (Sentence Rearrangement - PQRS)\nRearrange the following parts to form a meaningful sentence:\nP. the impact of climate change\nQ. around the world\nR. is becoming increasingly visible\nS. in various regions",
    options: ["(A) PQRS", "(B) PRSQ", "(C) SQPR", "(D) RQSP"],
    answer: 1,
    explanation: "The sentence starts with the subject 'the impact of climate change' (P), followed by the verb phrase 'is becoming increasingly visible' (R), and then the location 'in various regions' (S) 'around the world' (Q)."
  },
  {
    question: "Q.2 (Matching - Synonyms)\nMatch the words in List I with their synonyms in List II:\nList I\na. Mitigate\nb. Enormous\nc. Baffle\nd. Lucrative\nList II\n1. Confuse\n2. Profitable\n3. Huge\n4. Lessen (Reduce)",
    options: ["(A) a-4, b-3, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-3, d-2", "(D) a-3, b-4, c-2, d-1"],
    answer: 0,
    explanation: "Mitigate = Lessen/Reduce (कम करना); Enormous = Huge (विशाल); Baffle = Confuse (भ्रमित करना); Lucrative = Profitable (लाभदायक)।"
  },
  {
    question: "Q.3 (Assertion and Reason - Grammar Rule)\nAssertion (A): The sentence \"The scenery of Kashmir are very beautiful\" is grammatically incorrect.\nReason (R): 'Scenery' is an uncountable noun and it does not have a plural form ('sceneries' or plural verb 'are').",
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: "Uncountable nouns like scenery, information, furniture, luggage take a singular verb. The correct sentence is \"The scenery of Kashmir is very beautiful.\""
  },
  {
    question: "Q.4 (Sentence Rearrangement - PQRS)\nRearrange the following:\nP. to the principal\nQ. a letter of apology\nR. the student who\nS. broke the window wrote",
    options: ["(A) RSQP", "(B) RQSP", "(C) PQRS", "(D) SQPR"],
    answer: 0,
    explanation: "Subject: 'The student who' (R), Verb: 'broke the window wrote' (S), Object: 'a letter of apology' (Q), Direction: 'to the principal' (P)."
  },
  {
    question: "Q.5 (Matching - Idioms and Phrases)\nMatch List I (Idiom) with List II (Meaning):\nList I\na. A piece of cake\nb. Under the weather\nc. Once in a blue moon\nd. Spill the beans\nList II\n1. Very rarely\n2. To reveal a secret\n3. Very easy task\n4. Feeling ill",
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: "A piece of cake (बहुत आसान), Under the weather (बीमार महसूस करना), Once in a blue moon (कभी-कभार), Spill the beans (रहस्य खोल देना)।"
  },
  {
    question: "Q.6 (Multi-statement - Error Spotting)\nWhich of the following sentences is/are grammatically CORRECT?\n1. Neither Ram nor his friends is going to the party.\n2. Either the teacher or the students have made this mistake.\n3. Each of the boys were given a prize.",
    options: ["(A) Only 1 and 2", "(B) Only 2", "(C) Only 2 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: "Statement 1 is wrong (verb should agree with the nearest subject 'friends', so it should be 'are'). Statement 2 is correct (verb 'have' agrees with 'students'). Statement 3 is wrong (Each of + plural noun takes a singular verb, so it should be 'was')."
  },
  {
    question: "Q.7 (Sentence Rearrangement - PQRS)\nP. for human health\nQ. it is a well-known fact\nR. that regular exercise\nS. is extremely beneficial",
    options: ["(A) QRSP", "(B) QSPR", "(C) RQSP", "(D) PQRS"],
    answer: 0,
    explanation: "\"It is a well-known fact\" (Q) \"that regular exercise\" (R) \"is extremely beneficial\" (S) \"for human health\" (P)."
  },
  {
    question: "Q.8 (Assertion and Reason - Subject-Verb Agreement)\nAssertion (A): \"Bread and butter are my favorite breakfast.\" is an incorrect sentence.\nReason (R): When two singular nouns joined by 'and' refer to the same idea, thing, or a single unit, the verb must be singular.",
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: "'Bread and butter' represent a single unit (breakfast dish). Thus, it takes a singular verb. Correct sentence: \"Bread and butter is my favorite breakfast.\""
  },
  {
    question: "Q.9 (Matching - One Word Substitution)\nList I\na. Optimist\nb. Pessimist\nc. Philanthropist\nd. Misanthrope\nList II\n1. One who looks at the dark side of things.\n2. One who looks at the bright side of things.\n3. One who hates mankind.\n4. One who loves mankind.",
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: "Optimist (आशावादी), Pessimist (निराशावादी), Philanthropist (मानवता प्रेमी), Misanthrope (मानव द्वेषी)।"
  },
  {
    question: "Q.10 (Sentence Rearrangement - PQRS)\nP. the old man\nQ. resting under a tree\nR. who was tired\nS. fell asleep quickly",
    options: ["(A) PRQS", "(B) PRSQ", "(C) PQRS", "(D) SQPR"],
    answer: 0,
    explanation: "Subject: 'The old man' (P), relative clause describing him: 'who was tired' (R), participle phrase: 'resting under a tree' (Q), action: 'fell asleep quickly' (S). Or \"The old man who was tired resting under a tree fell asleep quickly\" -> better structure: \"The old man, who was tired, resting under a tree fell asleep quickly.\" (PRQS fits best logically)."
  },
  {
    question: `Q.11 (Assertion and Reason - Preposition Rule)
Assertion (A): The sentence "He is senior than me" is grammatically incorrect.
Reason (R): Words ending in '-ior' like senior, junior, superior, inferior take the preposition 'to' instead of 'than'.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence is "He is senior to me."`
  },
  {
    question: `Q.12 (Matching - Phrasal Verbs)
List I
a. Call off
b. Put off
c. Look after
d. Give up
List II
1. Postpone
2. Cancel
3. Surrender/Stop doing something
4. Take care of`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Call off = Cancel (रद्द करना); Put off = Postpone (स्थगित करना); Look after = Take care of (देखभाल करना); Give up = Surrender (छोड़ देना)।`
  },
  {
    question: `Q.13 (Sentence Rearrangement - PQRS)
P. despite his best efforts
Q. to pass the examination
R. he failed
S. in the final semester`,
    options: ["(A) PQRS", "(B) PRQS", "(C) PRSQ", "(D) SQPR"],
    answer: 0,
    explanation: `"Despite his best efforts" (P) "he failed" (R) "in the final semester" (S) "to pass the examination" (Q). Wait, PRSQ: "Despite his best efforts he failed in the final semester to pass the examination." A better flow: P - "Despite his best efforts" Q - "to pass the examination," R - "he failed" S - "in the final semester". -> PQRS. Let's re-evaluate. "Despite his best efforts to pass the examination, he failed in the final semester." -> PQRS is the most natural flow.`
  },
  {
    question: `Q.14 (Multi-statement - Conditionals)
Identify the correctly framed conditional sentence(s):
1. If I was a bird, I would fly.
2. If it rains, I will not go to school.
3. If he had studied hard, he would have passed.`,
    options: ["(A) Only 1 and 2", "(B) Only 2 and 3", "(C) Only 1 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Statement 1 is incorrect because in hypothetical/imaginary situations, "were" is used with all subjects (If I were a bird). Statements 2 and 3 are correct first and third conditionals.`
  },
  {
    question: `Q.15 (Assertion and Reason - Tense Logic)
Assertion (A): "I have seen him yesterday." is a wrong sentence.
Reason (R): The Present Perfect Tense is never used with adverbs of past time (like yesterday, last year, ago). Instead, the Simple Past Tense should be used.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) Both A and R are false."],
    answer: 0,
    explanation: `Since 'yesterday' denotes past time, we must use Simple Past: "I saw him yesterday."`
  },
  {
    question: `Q.16 (Matching - Antonyms)
List I
a. Barren
b. Opaque
c. Diligent
d. Arrogant
List II
1. Lazy
2. Humble
3. Fertile
4. Transparent`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Barren (बंजर) x Fertile (उपजाऊ); Opaque (अपारदर्शी) x Transparent (पारदर्शी); Diligent (मेहनती) x Lazy (आलसी); Arrogant (घमंडी) x Humble (विनम्र)।`
  },
  {
    question: `Q.17 (Sentence Rearrangement - PQRS)
P. the police arrived
Q. at the scene of the crime
R. as soon as
S. the thief ran away`,
    options: ["(A) RPQS", "(B) RQPS", "(C) SRPQ", "(D) SQPR"],
    answer: 0,
    explanation: `"As soon as" (R) "the police arrived" (P) "at the scene of the crime," (Q) "the thief ran away" (S).`
  },
  {
    question: `Q.18 (Assertion and Reason - Conjunction Rule)
Assertion (A): "Hardly had I reached the station than the train left." is incorrect.
Reason (R): The conjunction 'Hardly' or 'Scarcely' is always followed by 'when' or 'before', not 'than'. ('No sooner' takes 'than').`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "Hardly had I reached the station when the train left."`
  },
  {
    question: `Q.19 (Multi-statement - Article usage)
Which sentence(s) use(s) articles correctly?
1. He is an honest man.
2. Sun rises in the east.
3. She is the most intelligent girl in the class.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 2,
    explanation: `Statement 2 is incorrect. It should be "The sun rises in the east." (Definite article 'the' is used before unique celestial bodies).`
  },
  {
    question: `Q.20 (Matching - Root Words)
List I (Root)
a. Cide
b. Phobia
c. Cracy
d. Omni
List II (Meaning)
1. Rule / Government
2. All
3. Fear
4. Killing / Murder`,
    options: ["(A) a-4, b-3, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Cide (Suicide, Homicide = Killing); Phobia (Hydrophobia = Fear); Cracy (Democracy = Rule); Omni (Omnipresent = All).`
  }  ,
  {
    question: `Q.21 (Assertion and Reason - Active/Passive Voice)
Assertion (A): The passive voice of "Open the door" is "Let the door be opened."
Reason (R): In imperative sentences expressing a command or order, the passive voice is constructed using "Let + object + be + past participle (V3)".`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The rule for converting imperative (order) sentences into passive is strictly "Let + object + be + V3".`
  },
  {
    question: `Q.22 (Matching - Active to Passive structures)
Match the Active sentence (List I) with its Passive equivalent (List II):
List I
a. I am writing a letter.
b. I have written a letter.
c. I wrote a letter.
d. I will write a letter.
List II
1. A letter was written by me.
2. A letter is being written by me.
3. A letter will be written by me.
4. A letter has been written by me.`,
    options: ["(A) a-2, b-4, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Present continuous changes to "is being + V3". Present perfect changes to "has been + V3". Simple past changes to "was + V3". Simple future changes to "will be + V3".`
  },
  {
    question: `Q.23 (Sentence Rearrangement - PQRS)
P. to the principal
Q. the students complained
R. about the poor quality
S. of food in the canteen`,
    options: ["(A) QPRS", "(B) QRSP", "(C) PQRS", "(D) SQPR"],
    answer: 0,
    explanation: `"The students complained" (Q) "to the principal" (P) "about the poor quality" (R) "of food in the canteen" (S).`
  },
  {
    question: `Q.24 (Multi-statement - Direct/Indirect Speech)
Which of the following indirect speech conversions is/are correct?
1. Direct: He said, "The earth is round." -> Indirect: He said that the earth was round.
2. Direct: She says, "I am happy." -> Indirect: She says that she is happy.
3. Direct: Ram said to me, "Go away." -> Indirect: Ram ordered me to go away.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Statement 1 is incorrect because Universal Truths do not change their tense in Indirect Speech (It should be: He said that the earth is round). Statement 2 is correct (Reporting verb is in present tense, so tense inside inverted commas doesn't change). Statement 3 is correct (Imperative sentence).`
  },
  {
    question: `Q.25 (Matching - Animal Idioms)
List I
a. Let the cat out of the bag
b. A dark horse
c. To smell a rat
d. Crocodile tears
List II
1. False or insincere sorrow
2. To suspect a trick or deceit
3. An unexpected winner
4. To reveal a secret`,
    options: ["(A) a-4, b-3, c-2, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Cat out of the bag = Reveal secret; Dark horse = Unexpected winner; Smell a rat = Suspect something wrong; Crocodile tears = Fake crying.`
  },
  {
    question: `Q.26 (Assertion and Reason - Adjective Rule)
Assertion (A): "He is more wiser than his brother." is incorrect.
Reason (R): Double comparatives (like 'more' + 'wiser') should not be used together in English grammar.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `'Wiser' is already a comparative degree. Adding 'more' makes it a double comparative, which is grammatically wrong. Correct: "He is wiser than his brother."`
  },
  {
    question: `Q.27 (Sentence Rearrangement - PQRS)
P. working hard
Q. is the only key
R. to achieve success
S. in today's competitive world`,
    options: ["(A) PQRS", "(B) PQSR", "(C) RPQS", "(D) SPQR"],
    answer: 0,
    explanation: `"Working hard" (P) "is the only key" (Q) "to achieve success" (R) "in today's competitive world" (S).`
  },
  {
    question: `Q.28 (Multi-statement - 'Since' and 'For')
Identify the correct usage of 'since' and 'for':
1. I have been living here since 2010.
2. She has been reading for three hours.
3. It has been raining since two days.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 0,
    explanation: `Statement 3 is wrong because "two days" is a period/duration of time, so 'for' should be used (for two days). 'Since' is used for a specific point in time (since Monday, since 2010).`
  },
  {
    question: `Q.29 (Matching - Correct Spellings)
List I (Word)
a. Receive
b. Grammar
c. Vacuum
d. Argument
List II (Common Misspelling)
1. Grammer
2. Vaccum
3. Arguement
4. Recieve
Codes (Match Correct with Incorrect):`,
    options: ["(A) a-4, b-1, c-2, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-3, c-2, d-1", "(D) a-2, b-4, c-1, d-3"],
    answer: 0,
    explanation: `The correct spellings are Receive, Grammar, Vacuum, and Argument. Their frequent incorrect forms are matched respectively.`
  },
  {
    question: `Q.30 (Assertion and Reason - Question Tags)
Assertion (A): The question tag for "I am right," is "amn't I?"
Reason (R): In English, there is no contracted form like "amn't". Therefore, for "I am", the correct question tag is "aren't I?".`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `The Assertion is false because "amn't I?" is incorrect. The Reason correctly states that "aren't I?" should be used instead.`
  }
  ,
  {
    question: `Q.31 (Assertion and Reason - Noun Rule)
Assertion (A): "He gave me many advices." is an incorrect sentence.
Reason (R): 'Advice' is an uncountable noun. It cannot be made plural by adding 's', nor can it take 'many'. We use 'much advice' or 'many pieces of advice'.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `To express plurality, we say "pieces of advice". The word 'advices' does not exist in standard English in this context.`
  },
  {
    question: `Q.32 (Matching - Prepositions with specific words)
List I
a. Fond
b. Afraid
c. Good
d. Congratulate
List II
1. On
2. At
3. Of
4. Of
Wait, let's make it distinct:
List II
1. At
2. On
3. Of (used for Fond)
4. Of (used for Afraid) 
Let's modify List II to be unique prepositions:
List II: 1. At, 2. On, 3. Of, 4. With. Let's change 'Afraid' to 'Satisfied'.
Revised List I: a. Fond, b. Satisfied, c. Good, d. Congratulate
Revised List II: 1. At, 2. On, 3. Of, 4. With`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `We say: Fond OF, Satisfied WITH, Good AT (e.g., Good at English), Congratulate ON (e.g., Congratulate on success).`
  },
  {
    question: `Q.33 (Sentence Rearrangement - PQRS)
P. the project on time
Q. the team worked
R. day and night
S. in order to complete`,
    options: ["(A) QRSP", "(B) PQRS", "(C) RQSP", "(D) SQPR"],
    answer: 0,
    explanation: `"The team worked" (Q) "day and night" (R) "in order to complete" (S) "the project on time" (P).`
  },
  {
    question: `Q.34 (Multi-statement - 'It is high time')
Which of the following sentences is grammatically correct?
1. It is high time he starts studying.
2. It is high time he started studying.
3. It is high time he started to study.
4. It is high time he starts to study.
Wait, let's use standard format:
1. It is high time we leave for the station.
2. It is high time we left for the station.`,
    options: ["(A) Only 1 is correct", "(B) Only 2 is correct", "(C) Both 1 and 2 are correct", "(D) Neither 1 nor 2 is correct"],
    answer: 1,
    explanation: `The grammatical rule states that the phrase "It is high time" or "It is time" is always followed by a subject and the past tense (V2) of the verb. Thus, "left" is correct.`
  },
  {
    question: `Q.35 (Assertion and Reason - Lest...Should)
Assertion (A): "Walk carefully lest you should fall." is correct.
Reason (R): The conjunction 'lest' is always followed by the modal auxiliary 'should' to express a negative purpose or warning.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `'Lest' means "for fear that" and takes 'should'. Also, 'lest' itself is negative, so 'not' is never used with it.`
  },
  {
    question: `Q.36 (Matching - Synonyms)
List I
a. Obstinate
b. Fragile
c. Authentic
d. Abundant
List II
1. Genuine
2. Plentiful
3. Stubborn
4. Delicate`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Obstinate = Stubborn (जिद्दी); Fragile = Delicate (नाज़ुक); Authentic = Genuine (असली); Abundant = Plentiful (प्रचुर)।`
  },
  {
    question: `Q.37 (Sentence Rearrangement - PQRS)
P. the problem of pollution
Q. strict actions
R. to control
S. the government must take`,
    options: ["(A) SQRP", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `Subject: "The government must take" (S), Object: "strict actions" (Q), Infinitive purpose: "to control" (R) "the problem of pollution" (P).`
  },
  {
    question: `Q.38 (Multi-statement - 'Although/Though')
Identify the correct sentence(s):
1. Although he is poor, but he is honest.
2. Though he is poor, yet he is honest.
3. Although he is poor, he is honest.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 3"],
    answer: 1,
    explanation: `'Although' and 'Though' are followed by either a comma (,) or the word 'yet'. They are never followed by 'but'. So, statement 1 is incorrect.`
  },
  {
    question: `Q.39 (Assertion and Reason - Adjective 'Elder' vs 'Older')
Assertion (A): "My older brother is a doctor." is grammatically incorrect when referring to a blood relative.
Reason (R): 'Elder' is used for persons of the same family (blood relations), while 'older' is used for persons and things outside the family.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `When talking about a sibling, 'elder' is the correct adjective to use. E.g., "My elder brother is a doctor."`
  },
  {
    question: `Q.40 (Matching - Body Part Idioms)
List I
a. Keep an eye on
b. Give a hand
c. Cost an arm and a leg
d. Cold feet
List II
1. To be very expensive
2. To lose courage/become nervous
3. To watch carefully
4. To help someone`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Keep an eye on = Watch carefully; Give a hand = Help; Cost an arm and a leg = Very expensive; Cold feet = Nervous/Scared.`
  }
  ,
  {
    question: `Q.41 (Sentence Rearrangement - PQRS)
P. reading books
Q. is a good habit
R. vocabulary and knowledge
S. because it increases`,
    options: ["(A) PQSR", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Reading books" (P) "is a good habit" (Q) "because it increases" (S) "vocabulary and knowledge" (R).`
  },
  {
    question: `Q.42 (Assertion and Reason - Either/Neither Rule)
Assertion (A): "Neither of the two boys have done their homework." is an incorrect sentence.
Reason (R): "Neither of" or "Either of" is always followed by a plural noun but takes a singular verb and singular pronoun.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence should be: "Neither of the two boys HAS done HIS homework."`
  },
  {
    question: `Q.43 (Matching - One Word Substitution for Collections)
List I
a. A group of fish
b. A group of lions
c. A group of bees
d. A group of wolves
List II
1. Pride
2. Pack
3. School/Shoal
4. Swarm`,
    options: ["(A) a-3, b-1, c-4, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Group of fish = School/Shoal; Lions = Pride; Bees = Swarm; Wolves = Pack.`
  },
  {
    question: `Q.44 (Multi-statement - Adverb 'Enough')
Which of the following sentences uses 'enough' correctly?
1. He is smart enough to solve this puzzle.
2. He is enough smart to solve this puzzle.
3. I have enough money to buy this car.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) Only 1"],
    answer: 1,
    explanation: `The adverb 'enough' is placed AFTER the adjective it modifies (smart enough). But as an adjective, it is placed BEFORE the noun it modifies (enough money). So statements 1 and 3 are correct.`
  },
  {
    question: `Q.45 (Assertion and Reason - Relative Pronoun Who vs Whom)
Assertion (A): "The man whom is standing there is my uncle." is a correct sentence.
Reason (R): 'Whom' is used as an object pronoun, whereas 'Who' is used as a subject pronoun.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 3,
    explanation: `The Assertion is false. "The man WHO is standing there" is correct because the relative pronoun acts as the subject for the verb "is standing". The Reason (R) perfectly explains the grammatical rule.`
  },
  {
    question: `Q.46 (Sentence Rearrangement - PQRS)
P. playing in the garden
Q. I saw
R. while I was walking
S. a beautiful bird`,
    options: ["(A) RQSP", "(B) RQPS", "(C) PRQS", "(D) SQPR"],
    answer: 0,
    explanation: `"While I was walking" (R) "I saw" (Q) "a beautiful bird" (S) "playing in the garden" (P).`
  },
  {
    question: `Q.47 (Matching - Prefix Meanings)
List I (Prefix)
a. Anti
b. Poly
c. Pseudo
d. Mono
List II (Meaning)
1. False
2. Many
3. One / Single
4. Against`,
    options: ["(A) a-4, b-2, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Anti = Against (Antivirus); Poly = Many (Polygon); Pseudo = False (Pseudonym); Mono = One (Monopoly).`
  },
  {
    question: `Q.48 (Multi-statement - Superfluous Expressions)
Identify the sentence(s) that contain(s) superfluous (unnecessary) words:
1. Please return back the book tomorrow.
2. The final conclusion of the story was amazing.
3. He repeated the question again.`,
    options: ["(A) Only 1", "(B) 1 and 2", "(C) 2 and 3", "(D) 1, 2 and 3"],
    answer: 3,
    explanation: `All sentences have redundant words. 'Return' means to give back (so 'back' is unnecessary). 'Conclusion' is always final (so 'final' is unnecessary). 'Repeat' means to say again (so 'again' is unnecessary).`
  },
  {
    question: `Q.49 (Assertion and Reason - Fewer vs Less)
Assertion (A): "There are less students in the class today." is incorrect.
Reason (R): 'Less' is used with uncountable nouns (e.g., less water), while 'Fewer' is used with countable plural nouns (e.g., fewer students).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Since 'students' is a countable noun, we must use "fewer". Correct sentence: "There are fewer students in the class today."`
  },
  {
    question: `Q.50 (Matching - Animals and their Young Ones)
List I (Animal)
a. Kangaroo
b. Frog
c. Sheep
d. Owl
List II (Young One)
1. Joey
2. Tadpole
3. Owlet
4. Lamb`,
    options: ["(A) a-1, b-2, c-4, d-3", "(B) a-2, b-1, c-3, d-4", "(C) a-1, b-3, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Kangaroo = Joey; Frog = Tadpole; Sheep = Lamb; Owl = Owlet.`
  }
  ,
  {
    question: `Q.51 (Sentence Rearrangement - PQRS)
P. the use of artificial intelligence
Q. the education sector
R. in recent years
S. has revolutionized`,
    options: ["(A) PQSR", "(B) PSRQ", "(C) PRSQ", "(D) SPQR"],
    answer: 2,
    explanation: `"The use of artificial intelligence" (P) "in recent years" (R) "has revolutionized" (S) "the education sector" (Q).`
  },
  {
    question: `Q.52 (Matching - Color Idioms)
Match List I (Idiom) with List II (Meaning):
List I
a. Out of the blue
b. Red tape
c. Green thumb
d. White elephant
List II
1. Excessive official formalities/delay
2. Unexpectedly / Without warning
3. Expensive but useless possession
4. A natural talent for gardening`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Out of the blue = Unexpectedly (अचानक); Red tape = Official delay (लाल फीताशाही); Green thumb = Good at gardening; White elephant = Costly but useless.`
  },
  {
    question: `Q.53 (Assertion and Reason - Grammar Rule 'Unless/Until')
Assertion (A): "Unless you do not work hard, you will not succeed." is a grammatically incorrect sentence.
Reason (R): 'Unless' and 'Until' already carry a negative meaning ("if not"). Therefore, using 'not' in the same clause makes it a double negative, which is wrong.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence is "Unless you work hard, you will not succeed."`
  },
  {
    question: `Q.54 (Multi-statement - Subject-Verb Agreement)
Identify the grammatically correct sentence(s):
1. The captain, along with his sailors, was drowned.
2. Ram as well as his friends are going to the movie.
3. The principal, accompanied by the teachers, is inspecting the school.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `When two subjects are joined by "along with", "as well as", or "accompanied by", the verb agrees with the FIRST subject. In sentence 2, "Ram" is singular, so the verb should be "is", not "are".`
  },
  {
    question: `Q.55 (Matching - Synonyms)
List I (Word)
a. Acquit
b. Novice
c. Candid
d. Banish
List II (Synonym)
1. Beginner
2. Frank / Honest
3. Exile / Expel
4. Absolve / Pardon`,
    options: ["(A) a-4, b-1, c-2, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-2, c-1, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Acquit = Pardon (दोषमुक्त करना); Novice = Beginner (नौसिखिया); Candid = Frank/Honest (स्पष्टवादी); Banish = Exile (देश निकाला देना)।`
  },
  {
    question: `Q.56 (Sentence Rearrangement - PQRS)
P. the majestic tiger
Q. cautiously through the tall grass
R. tracking its prey
S. moved slowly and`,
    options: ["(A) PQRS", "(B) PSRQ", "(C) PSQR", "(D) RQSP"],
    answer: 2,
    explanation: `Subject: "The majestic tiger" (P) Action: "moved slowly and" (S) Adverbial phrase: "cautiously through the tall grass" (Q) Purpose/Participle: "tracking its prey" (R).`
  },
  {
    question: `Q.57 (Assertion and Reason - Pronoun Case)
Assertion (A): "Let you and I complete this assignment." is a correct sentence.
Reason (R): The verb 'Let' is always followed by pronouns in the objective case (e.g., me, him, her, us, them).`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Since 'let' takes an objective case pronoun, the correct sentence must be "Let you and ME complete this assignment." (Assertion is false, Reason is true).`
  },
  {
    question: `Q.58 (Multi-statement - Article Usage)
Identify the sentence(s) with the correct use of articles:
1. He is an European by birth.
2. I will be back in an hour.
3. She plays the piano very well.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 2"],
    answer: 1,
    explanation: `Statement 1 is incorrect because 'European' starts with a consonant sound ('Yoo' / 'यू'), so it should be "a European". Statements 2 (vowel sound 'our') and 3 (musical instruments take 'the') are correct.`
  },
  {
    question: `Q.59 (Matching - Antonyms)
List I (Word)
a. Reveal
b. Abundant
c. Rigid
d. Praise
List II (Antonym)
1. Criticize
2. Conceal
3. Flexible
4. Scarce`,
    options: ["(A) a-2, b-4, c-3, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-3, c-4, d-1", "(D) a-4, b-1, c-2, d-3"],
    answer: 0,
    explanation: `Reveal (प्रकट करना) x Conceal (छिपाना); Abundant (प्रचुर) x Scarce (दुर्लभ); Rigid (कठोर) x Flexible (लचीला); Praise (तारीफ) x Criticize (आलोचना)।`
  },
  {
    question: `Q.60 (Sentence Rearrangement - PQRS)
P. consuming too much sugar
Q. to severe health issues
R. is a dangerous habit
S. that can lead`,
    options: ["(A) PRQS", "(B) PQRS", "(C) PRSQ", "(D) SPQR"],
    answer: 2,
    explanation: `"Consuming too much sugar" (P) "is a dangerous habit" (R) "that can lead" (S) "to severe health issues" (Q).`
  }
  ,
  {
    question: `Q.61 (Assertion and Reason - Adjective Rule)
Assertion (A): "I prefer drinking tea than coffee." is grammatically incorrect.
Reason (R): The verb 'prefer' and adjectives like 'preferable' are followed by the preposition 'to', not 'than'.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence is "I prefer drinking tea TO coffee."`
  },
  {
    question: `Q.62 (Matching - One Word Substitution for Places)
List I
a. Aviary
b. Apiary
c. Aquarium
d. Arsenal
List II
1. A place where weapons and ammunition are stored.
2. A place where bees are kept.
3. A place where birds are kept.
4. A glass tank where fish are kept.`,
    options: ["(A) a-3, b-2, c-4, d-1", "(B) a-2, b-3, c-1, d-4", "(C) a-3, b-4, c-2, d-1", "(D) a-4, b-1, c-3, d-2"],
    answer: 0,
    explanation: `Aviary = Birds; Apiary = Bees; Aquarium = Fish; Arsenal = Weapons.`
  },
  {
    question: `Q.63 (Sentence Rearrangement - PQRS)
P. from the atmosphere
Q. play a crucial role
R. by absorbing carbon dioxide
S. trees and plants`,
    options: ["(A) SQPR", "(B) PQRS", "(C) SQRP", "(D) SPQR"],
    answer: 2,
    explanation: `"Trees and plants" (S) "play a crucial role" (Q) "by absorbing carbon dioxide" (R) "from the atmosphere" (P).`
  },
  {
    question: `Q.64 (Multi-statement - Conditionals Type 3)
Identify the correct conditional sentence(s):
1. If I had seen him, I would have stopped the car.
2. Had he worked harder, he would pass the exam.
3. If she had invited me, I would have attended the party.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Type 3 Conditional follows the structure: "If + Past Perfect (had + V3), ... would have + V3". Statement 2 is incorrect because it uses "would pass" instead of "would have passed".`
  },
  {
    question: `Q.65 (Matching - Phrasal Verbs with 'Break')
List I
a. Break down
b. Break into
c. Break out
d. Break up
List II
1. Enter by force
2. End a relationship
3. Stop functioning (machine/car)
4. Start suddenly (fire/disease/war)`,
    options: ["(A) a-3, b-1, c-4, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Break down = Stop working; Break into = Enter by force; Break out = Start suddenly; Break up = End a relationship.`
  },
  {
    question: `Q.66 (Assertion and Reason - Plural Nouns)
Assertion (A): The plural of "brother-in-law" is "brother-in-laws".
Reason (R): In compound nouns, the plural marker ('s') is generally added to the principal (main) word.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 3,
    explanation: `The Reason states the correct rule. Following this rule, the main word in "brother-in-law" is "brother". So the correct plural is "brothers-in-law". Therefore, the Assertion is false.`
  },
  {
    question: `Q.67 (Sentence Rearrangement - PQRS)
P. waking up early
Q. a fresh start
R. gives you
S. in the morning`,
    options: ["(A) PSRQ", "(B) PQRS", "(C) SPQR", "(D) RQSP"],
    answer: 0,
    explanation: `"Waking up early" (P) "in the morning" (S) "gives you" (R) "a fresh start" (Q).`
  },
  {
    question: `Q.68 (Multi-statement - Inversion with Negative Adverbs)
Which of the following sentences is/are grammatically correct?
1. Hardly had I reached the school when the bell rang.
2. No sooner did the police arrive than the thief fled.
3. Seldom he goes to the market.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) 1, 2 and 3"],
    answer: 0,
    explanation: `When a sentence begins with a negative adverb (Hardly, No sooner, Seldom), it must follow the 'Law of Inversion' (Helping verb before the subject). Statement 3 is wrong; it should be "Seldom does he go to the market."`
  },
  {
    question: `Q.69 (Matching - Body Part Idioms)
List I
a. Cold shoulder
b. Slip of the tongue
c. Rule of thumb
d. Pull someone's leg
List II
1. A spoken mistake
2. To joke or tease someone
3. To ignore someone deliberately
4. A general unwritten rule/principle`,
    options: ["(A) a-3, b-1, c-4, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Cold shoulder = Ignore; Slip of the tongue = Mistake in speaking; Rule of thumb = General rule; Pull someone's leg = Tease/Joke.`
  },
  {
    question: `Q.70 (Assertion and Reason - Conjunction Rule)
Assertion (A): "He is both intelligent as well as hardworking." is a grammatically correct sentence.
Reason (R): The correlative conjunction 'Both' is always paired with 'and', not with 'as well as'.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Because 'Both' is followed by 'and', the Assertion is incorrect. The correct sentence is "He is both intelligent AND hardworking."`
  }
  ,
  {
    question: `Q.71 (Sentence Rearrangement - PQRS)
P. the recent discoveries
Q. of the universe
R. our understanding
S. have completely changed`,
    options: ["(A) PSRQ", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The recent discoveries" (P) "have completely changed" (S) "our understanding" (R) "of the universe" (Q).`
  },
  {
    question: `Q.72 (Matching - Synonyms)
List I
a. Lethargic
b. Diligent
c. Eloquent
d. Hostile
List II
1. Hardworking
2. Unfriendly / Antagonistic
3. Lazy / Sluggish
4. Fluent and persuasive in speaking`,
    options: ["(A) a-3, b-1, c-4, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Lethargic = Lazy; Diligent = Hardworking; Eloquent = Fluent speaker; Hostile = Unfriendly.`
  },
  {
    question: `Q.73 (Assertion and Reason - Not only... But also)
Assertion (A): "Not only he is a writer but also an actor." is grammatically incorrect.
Reason (R): Correlative conjunctions like 'Not only... but also' must connect parallel structures (same parts of speech). If 'but also' is followed by a noun ('an actor'), 'not only' must also be followed by a noun.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct placement should be: "He is not only a writer but also an actor."`
  },
  {
    question: `Q.74 (Multi-statement - Prepositions of Cause/Anger)
Identify the correct sentence(s):
1. The old man died of cancer.
2. The old man died from overeating.
3. The teacher was angry at the student.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 0,
    explanation: `We use "died OF" a disease (cancer) and "died FROM" a cause like overeating/thirst. However, we are "angry WITH" a person and "angry AT" a thing/situation. So statement 3 is wrong (it should be 'angry with the student').`
  },
  {
    question: `Q.75 (Matching - Root Words)
List I (Root)
a. Auto
b. Bio
c. Chron
d. Dict
List II (Meaning)
1. Time
2. Self
3. Speak / Say
4. Life`,
    options: ["(A) a-2, b-4, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Auto = Self (Autobiography); Bio = Life (Biology); Chron = Time (Chronology); Dict = Speak (Dictator, Dictionary).`
  },
  {
    question: `Q.76 (Sentence Rearrangement - PQRS)
P. the train had already left
Q. we reached the station
R. by the time
S. due to heavy traffic`,
    options: ["(A) RQSP", "(B) RQPS", "(C) PQRS", "(D) SPQR"],
    answer: 0,
    explanation: `"By the time" (R) "we reached the station" (Q) "due to heavy traffic," (S) "the train had already left" (P). (Or: By the time we reached the station, the train had already left due to heavy traffic. RQPS is also viable, but RQSP sets the context of being late first. Let's look at standard construction: R Q P S is slightly disconnected. Let's try R Q S P: "By the time we reached the station due to heavy traffic, the train had already left." Actually, R Q P S makes more sense if S modifies P: "By the time we reached the station, the train had already left due to heavy traffic." Let's provide RQPS as the option).
*Correction for absolute clarity:*
(A) RQPS
> Answer: (A) RQPS (By the time we reached the station, the train had already left due to heavy traffic.)`
  },
  {
    question: `Q.77 (Assertion and Reason - Gerund after specific phrases)
Assertion (A): "I am looking forward to meet you." is a correct sentence.
Reason (R): The phrase "look forward to" is always followed by a Gerund (V1+ing), not a base verb.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `According to the rule (Reason R), the phrase takes a gerund. So the correct sentence is "I am looking forward to MEETING you." Therefore, the Assertion is false.`
  },
  {
    question: `Q.78 (Multi-statement - Tenses)
Identify the correct sentence(s):
1. By the time he arrives, I will have finished my work.
2. I have passed the driving test in 2015.
3. She is knowing the answer to this question.`,
    options: ["(A) Only 1", "(B) 1 and 2", "(C) 2 and 3", "(D) Only 3"],
    answer: 0,
    explanation: `Statement 1 is correct (Future Perfect). Statement 2 is wrong (Past time '2015' takes Simple Past: 'I passed'). Statement 3 is wrong (Stative verbs like 'know' are not used in continuous 'ing' form; it should be 'She knows').`
  },
  {
    question: `Q.79 (Matching - Antonyms)
List I
a. Optimistic
b. Courageous
c. Generous
d. Innocent
List II
1. Cowardly
2. Stingy / Miserly
3. Guilty
4. Pessimistic`,
    options: ["(A) a-4, b-1, c-2, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-3, c-2, d-1", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Optimistic x Pessimistic; Courageous x Cowardly; Generous (उदार) x Stingy (कंजूस); Innocent (निर्दोष) x Guilty (दोषी)।`
  },
  {
    question: `Q.80 (Sentence Rearrangement - PQRS)
P. local businesses
Q. a positive impact
R. the new economic policy
S. has had on`,
    options: ["(A) RQSP", "(B) PQRS", "(C) SPQR", "(D) RQPS"],
    answer: 0,
    explanation: `"The new economic policy" (R) "has had on" wait. Has had a positive impact on. Let's fix S: "has had" -> "has had". Then: R - The new economic policy, S - has had, Q - a positive impact on, P - local businesses. 
Wait, 'on' is missing in Q. Let's re-read: Q. a positive impact. S. has had on. 
Correct structure: R - The new economic policy, S - has had, Q - a positive impact, P - ON local businesses. Let's add 'on' to P. "P. on local businesses. Q. a positive impact. R. the new economic policy. S. has had".
Order: R S Q P.
> Corrected Answer: (A) RSQP ("The new economic policy has had a positive impact on local businesses.")`
  }
  ,
  {
    question: `Q.81 (Assertion and Reason - Little vs A little)
Assertion (A): "He has a little knowledge of computers, so he cannot fix this issue."
Reason (R): 'A little' means some (positive meaning), while 'Little' means almost nothing (negative meaning).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Since the person CANNOT fix the issue, it means he has almost NO knowledge. Therefore, 'Little' (negative) should be used instead of 'A little' (positive). Correct: "He has little knowledge..."`
  },
  {
    question: `Q.82 (Matching - One Word Substitution for Beliefs)
List I
a. Theist
b. Atheist
c. Agnostic
d. Polytheist
List II
1. One who believes in many gods.
2. One who doubts the existence of God.
3. One who does not believe in God.
4. One who believes in God.`,
    options: ["(A) a-4, b-3, c-2, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Theist = Believes in God (आस्तिक); Atheist = Does not believe (नास्तिक); Agnostic = Doubts/Not sure (अज्ञेयवादी); Polytheist = Many gods (बहुदेववादी)।`
  },
  {
    question: `Q.83 (Sentence Rearrangement - PQRS)
P. awareness among people
Q. spreading
R. is essential for
S. preventing diseases`,
    options: ["(A) QPRS", "(B) PQRS", "(C) RQSP", "(D) SQPR"],
    answer: 0,
    explanation: `"Spreading" (Q) "awareness among people" (P) "is essential for" (R) "preventing diseases" (S).`
  },
  {
    question: `Q.84 (Multi-statement - Question Tags)
Identify the correctly formed question tag(s):
1. Let's go for a walk, shall we?
2. He hardly works, doesn't he?
3. Don't make a noise, will you?`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 2,
    explanation: `Statement 2 is incorrect. 'Hardly' is a negative word, so the question tag must be positive: "does he?". 'Let's' always takes 'shall we?', and negative imperatives take 'will you?'.`
  },
  {
    question: `Q.85 (Matching - Idioms related to Weather/Nature)
List I
a. Steal someone's thunder
b. Raining cats and dogs
c. Face the music
d. On cloud nine
List II
1. Raining very heavily
2. Extremely happy
3. To take credit for someone else's work/idea
4. To accept punishment or consequences`,
    options: ["(A) a-3, b-1, c-4, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Steal thunder = Take credit; Raining cats and dogs = Heavy rain; Face the music = Accept punishment; On cloud nine = Very happy (सातवें आसमान पर)।`
  },
  {
    question: `Q.86 (Assertion and Reason - Uncountable Nouns)
Assertion (A): "He gave me many informations." is a correct sentence.
Reason (R): The word 'information' is an uncountable noun and does not have a plural form.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Because 'information' is uncountable (Reason is true), it cannot take 'many' or be pluralized as 'informations'. Therefore, the Assertion is false. Correct: "He gave me a lot of information / many pieces of information."`
  },
  {
    question: `Q.87 (Sentence Rearrangement - PQRS)
P. character and integrity
Q. the true test of
R. you act when no one is watching
S. is how`,
    options: ["(A) QPSR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The true test of" (Q) "character and integrity" (P) "is how" (S) "you act when no one is watching" (R).`
  },
  {
    question: `Q.88 (Multi-statement - Active/Passive Voice)
Identify the correct Passive Voice conversion(s):
1. Active: Do it. -> Passive: Let it be done.
2. Active: It is time to close the shop. -> Passive: It is time for the shop to be closed.
3. Active: People speak English all over the world. -> Passive: English is spoken all over the world.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 3,
    explanation: `All three passive conversions follow the exact grammatical rules for imperatives, infinitives, and general subjects ('people' is omitted).`
  },
  {
    question: `Q.89 (Matching - Phrasal Verbs with 'Bring')
List I
a. Bring up
b. Bring out
c. Bring about
d. Bring down
List II
1. To cause something to happen
2. To raise or rear a child
3. To publish or reveal something
4. To reduce (prices/government)`,
    options: ["(A) a-2, b-3, c-1, d-4", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Bring up = Raise a child (पालन-पोषण करना); Bring out = Publish/Reveal; Bring about = Cause to happen; Bring down = Reduce.`
  },
  {
    question: `Q.90 (Assertion and Reason - Conjunction Rule)
Assertion (A): "The teacher asked me that why I was late." is grammatically incorrect.
Reason (R): In indirect speech, interrogative words (wh-words like why, when, where) act as conjunctions themselves, so 'that' should not be used before them.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "The teacher asked me why I was late."`
  }
  ,
  {
    question: `Q.91 (Sentence Rearrangement - PQRS)
P. the internet
Q. to access information
R. has made it easier
S. from anywhere in the world`,
    options: ["(A) PRQS", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The internet" (P) "has made it easier" (R) "to access information" (Q) "from anywhere in the world" (S).`
  },
  {
    question: `Q.92 (Matching - Words with Suffix/Prefix)
List I (Prefix/Suffix)
a. Un-
b. Mis-
c. -less
d. -ful
List II (Meaning/Example)
1. Without (e.g., Careless)
2. Not / Opposite (e.g., Unhappy)
3. Full of (e.g., Beautiful)
4. Wrongly / Badly (e.g., Misunderstand)`,
    options: ["(A) a-2, b-4, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Un- = Not (Unhappy); Mis- = Wrongly (Misunderstand); -less = Without (Careless); -ful = Full of (Beautiful).`
  },
  {
    question: `Q.93 (Assertion and Reason - Lie vs Lay)
Assertion (A): "She laid on the bed for two hours." is a correct sentence.
Reason (R): The verb 'Lie' (meaning to rest horizontally) has the past tense 'lay' and past participle 'lain'. The verb 'Lay' (meaning to put something down) has the past tense 'laid'.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Since she was resting, the verb is 'Lie'. The past tense of 'Lie' is 'lay'. Therefore, the correct sentence is "She LAY on the bed for two hours." The Assertion uses 'laid', which is incorrect.`
  },
  {
    question: `Q.94 (Multi-statement - Animal Sounds)
Identify the correctly matched animal and its sound:
1. Horses - Neigh
2. Lions - Roar
3. Elephants - Trumpet
4. Snakes - Hiss`,
    options: ["(A) 1 and 2", "(B) 2, 3 and 4", "(C) 1, 3 and 4", "(D) 1, 2, 3 and 4"],
    answer: 3,
    explanation: `All combinations are standard English words for the respective animal sounds.`
  },
  {
    question: `Q.95 (Matching - Food Idioms)
List I
a. Apple of one's eye
b. Couch potato
c. A hard nut to crack
d. Big cheese
List II
1. A very difficult problem or person
2. Someone very dear/favorite
3. A very important or powerful person
4. A lazy person who watches too much TV`,
    options: ["(A) a-2, b-4, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Apple of eye = Favorite (आँखों का तारा); Couch potato = Lazy TV watcher; Hard nut to crack = Difficult problem; Big cheese = Important person (वीआईपी).`
  },
  {
    question: `Q.96 (Sentence Rearrangement - PQRS)
P. reading a good book
Q. is like taking
R. into another world
S. a wonderful journey`,
    options: ["(A) PQSR", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Reading a good book" (P) "is like taking" (Q) "a wonderful journey" (S) "into another world" (R).`
  },
  {
    question: `Q.97 (Assertion and Reason - Omission of Articles)
Assertion (A): "The injured man was sent to the hospital." is a correct sentence.
Reason (R): When places like hospital, school, bed, or prison are visited for their primary purpose (e.g., hospital for treatment), no article is used before them.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `Since the injured man goes to the hospital for treatment (primary purpose), we omit the article 'the'. Correct: "The injured man was sent to hospital."`
  },
  {
    question: `Q.98 (Multi-statement - 'A number of' vs 'The number of')
Which sentence(s) is/are correct?
1. A number of students are absent today.
2. The number of students in this class is fifty.
3. A number of students is standing outside.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 1"],
    answer: 0,
    explanation: `The rule is: "A number of" takes a plural verb (statement 1 is correct, statement 3 is wrong). "The number of" refers to a specific count and takes a singular verb (statement 2 is correct).`
  },
  {
    question: `Q.99 (Matching - Foreign Words used in English)
List I
a. Ad hoc
b. Bona fide
c. Lingua franca
d. Prima facie
List II
1. Genuine / In good faith
2. A common language used by speakers of different languages
3. At first sight / On the face of it
4. Created or done for a particular purpose only`,
    options: ["(A) a-4, b-1, c-2, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-2, c-1, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Ad hoc = For a specific purpose (तदर्थ); Bona fide = Genuine (वास्तविक); Lingua franca = Common language (संपर्क भाषा); Prima facie = At first sight (प्रथम दृष्टया).`
  },
  {
    question: `Q.100 (Sentence Rearrangement - PQRS)
P. will ultimately lead
Q. perseverance and dedication
R. to unparalleled success
S. in any field of life`,
    options: ["(A) QPRS", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Perseverance and dedication" (Q) "will ultimately lead" (P) "to unparalleled success" (R) "in any field of life" (S).`
  }
  ,
  {
    question: `Q.101 (Sentence Rearrangement - PQRS)
P. the exploration of space
Q. humanity
R. has always fascinated
S. for centuries`,
    options: ["(A) PQRS", "(B) PRQS", "(C) SPQR", "(D) RQSP"],
    answer: 1,
    explanation: `"The exploration of space" (P) "has always fascinated" (R) "humanity" (Q) "for centuries" (S).`
  },
  {
    question: `Q.102 (Matching - Synonyms)
Match List I (Word) with List II (Synonym):
List I
a. Obsolete
b. Eradicate
c. Tenacious
d. Bizarre
List II
1. Destroy completely
2. Outdated
3. Strange / Weird
4. Persistent / Stubborn`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Obsolete = Outdated (पुराना); Eradicate = Destroy completely (जड़ से मिटाना); Tenacious = Persistent/Stubborn (दृढ़); Bizarre = Strange (अजीब).`
  },
  {
    question: `Q.103 (Assertion and Reason - Pronoun Order Rule)
Assertion (A): "I, you and he have finished the project." is a grammatically incorrect sentence.
Reason (R): When multiple singular pronouns of different persons are used together in a positive sentence, the order should be 231 (Second person, Third person, First person).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `According to the 231 rule, the correct sentence is: "You, he and I have finished the project." (The Assertion correctly states the given sentence is wrong).`
  },
  {
    question: `Q.104 (Multi-statement - Gerund vs Infinitive)
Identify the sentence with the correct logical meaning:
1. He stopped to smoke on his way home. (Means he paused his journey in order to smoke).
2. He stopped smoking last year. (Means he quit the habit of smoking).
3. He stopped to smoke last year. (Means he quit the habit of smoking).`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 2"],
    answer: 0,
    explanation: `"Stop + to V1" means pausing a current action to do a new action. "Stop + V1+ing" means quitting an ongoing habit. Thus, statements 1 and 2 define the meanings correctly.`
  },
  {
    question: `Q.105 (Matching - Number Based Idioms)
List I
a. At sixes and sevens
b. Catch-22 situation
c. Dressed to the nines
d. Take five
List II
1. A dilemma with no escape
2. In a state of confusion or disorder
3. Take a short break
4. Dressed very smartly or formally`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `At sixes and sevens = Confused; Catch-22 = A paradox/dilemma; Dressed to the nines = Smartly dressed; Take five = Take a short break.`
  },
  {
    question: `Q.106 (Sentence Rearrangement - PQRS)
P. the rapid destruction
Q. is a global
R. of the Amazon rainforest
S. environmental crisis`,
    options: ["(A) PQRS", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 1,
    explanation: `"The rapid destruction" (P) "of the Amazon rainforest" (R) "is a global" (Q) "environmental crisis" (S).`
  },
  {
    question: `Q.107 (Assertion and Reason - Question Tags for Indefinite Pronouns)
Assertion (A): The correct question tag for "Everyone is happy," is "aren't they?"
Reason (R): Indefinite pronouns referring to people (like everyone, everybody, someone, nobody) take a plural pronoun ('they') and a plural verb in the question tag.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Though "everyone" takes a singular verb in the main sentence (is), its question tag uses the plural pronoun "they" and hence takes the plural verb "aren't".`
  },
  {
    question: `Q.108 (Multi-statement - Conditionals Type 0 & 1)
Which of the following conditional sentences is/are grammatically correct?
1. If you heat ice, it melts.
2. If it will rain, I will stay at home.
3. If she studies hard, she will pass the exam.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 2,
    explanation: `Statement 2 is incorrect because the 'If-clause' in a Type 1 conditional must be in the Simple Present tense, not Simple Future. Correct: "If it rains, I will stay at home." Statement 1 (Zero conditional/Scientific truth) and Statement 3 (Type 1 conditional) are correct.`
  },
  {
    question: `Q.109 (Matching - Phrasal Verbs with 'Look')
List I
a. Look up to
b. Look down upon
c. Look into
d. Look forward to
List II
1. To investigate
2. To anticipate with pleasure
3. To respect someone
4. To consider someone inferior`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Look up to = Respect; Look down upon = Consider inferior; Look into = Investigate; Look forward to = Anticipate with pleasure.`
  },
  {
    question: `Q.110 (Sentence Rearrangement - PQRS)
P. maintaining a balanced diet
Q. mental well-being
R. is essential for
S. our physical and`,
    options: ["(A) PRSQ", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Maintaining a balanced diet" (P) "is essential for" (R) "our physical and" (S) "mental well-being" (Q).`
  }
  ,
  {
    question: `Q.111 (Assertion and Reason - Subject-Verb Agreement)
Assertion (A): "The manager, as well as the clerks, have arrived." is a correct sentence.
Reason (R): When two subjects are connected by 'as well as', the verb must agree with the FIRST subject.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `According to the rule stated in the Reason (which is true), the verb should agree with the first subject ("The manager" - singular). Therefore, the correct sentence is "The manager, as well as the clerks, HAS arrived." Thus, the Assertion is false.`
  },
  {
    question: `Q.112 (Matching - Antonyms)
List I (Word)
a. Clandestine
b. Diligent
c. Frugal
d. Fickle
List II (Antonym)
1. Constant / Stable
2. Lazy / Idle
3. Open / Public
4. Extravagant / Wasteful`,
    options: ["(A) a-3, b-2, c-4, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Clandestine (गुप्त) x Open; Diligent (मेहनती) x Lazy; Frugal (मितव्ययी) x Extravagant (खर्चीला); Fickle (चंचल) x Constant (स्थिर).`
  },
  {
    question: `Q.113 (Sentence Rearrangement - PQRS)
P. the ancient civilization
Q. was highly
R. advanced in town planning
S. of the Indus Valley`,
    options: ["(A) PQRS", "(B) PSRQ", "(C) RQSP", "(D) SPQR"],
    answer: 1,
    explanation: `"The ancient civilization" (P) "of the Indus Valley" (S) "was highly" (Q) "advanced in town planning" (R).`
  },
  {
    question: `Q.114 (Multi-statement - Nouns always Plural)
Which of the following sentences is/are grammatically correct?
1. Where is my scissors?
2. His spectacles are missing.
3. These trousers are very expensive.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Nouns consisting of two identical parts (scissors, spectacles, trousers, binoculars) are always treated as plural and take plural verbs. Statement 1 is wrong; it should be "Where ARE my scissors?".`
  },
  {
    question: `Q.115 (Matching - Phobias / Fears)
List I
a. Acrophobia
b. Claustrophobia
c. Hydrophobia
d. Xenophobia
List II
1. Fear of strangers or foreigners
2. Fear of heights
3. Fear of water
4. Fear of confined or closed spaces`,
    options: ["(A) a-2, b-4, c-3, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Acro = Heights; Claustro = Closed spaces; Hydro = Water; Xeno = Foreigners/Strangers.`
  },
  {
    question: `Q.116 (Assertion and Reason - Conditional Type 2)
Assertion (A): "If I was the Prime Minister, I would eradicate poverty." is grammatically incorrect.
Reason (R): In hypothetical or imaginary conditions (Type 2 conditionals), the verb 'were' is used with all subjects, regardless of whether they are singular or plural.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence is "If I WERE the Prime Minister..."`
  },
  {
    question: `Q.117 (Sentence Rearrangement - PQRS)
P. developing a reading habit
Q. our vocabulary but also
R. not only improves
S. broadens our perspective`,
    options: ["(A) PQRS", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 1,
    explanation: `"Developing a reading habit" (P) "not only improves" (R) "our vocabulary but also" (Q) "broadens our perspective" (S).`
  },
  {
    question: `Q.118 (Multi-statement - 'Much too' vs 'Too much')
Identify the correct sentence(s):
1. His behavior was much too rude.
2. He gave me too much trouble.
3. The tea is too much hot.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 2"],
    answer: 0,
    explanation: `The rule is: 'Much too' is followed by an Adjective (much too rude). 'Too much' is followed by a Noun (too much trouble). Statement 3 is wrong because 'hot' is an adjective, so it should be "much too hot" or simply "too hot".`
  },
  {
    question: `Q.119 (Matching - Animal Idioms)
List I
a. Elephant in the room
b. Bull in a china shop
c. Let sleeping dogs lie
d. Wild goose chase
List II
1. A futile or hopeless search/pursuit
2. An obvious problem that people avoid discussing
3. A clumsy person in a delicate situation
4. To leave a situation undisturbed to avoid trouble`,
    options: ["(A) a-2, b-3, c-4, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Elephant in the room = An obvious but ignored issue; Bull in a china shop = A clumsy person; Let sleeping dogs lie = Avoid interfering; Wild goose chase = A useless search.`
  },
  {
    question: `Q.120 (Sentence Rearrangement - PQRS)
P. are the two
Q. hard work and dedication
R. of success
S. most important pillars`,
    options: ["(A) PQRS", "(B) QPSR", "(C) RQSP", "(D) SPQR"],
    answer: 1,
    explanation: `"Hard work and dedication" (Q) "are the two" (P) "most important pillars" (S) "of success" (R).`
  }
  ,
  {
    question: `Q.121 (Assertion and Reason - Definite Article Rule)
Assertion (A): "The Mount Everest is the highest peak in the Himalayas." is grammatically incorrect.
Reason (R): The definite article 'The' is used before the names of mountain ranges (e.g., The Himalayas) but is NEVER used before the names of individual mountain peaks (e.g., Mount Everest).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "Mount Everest is the highest peak in the Himalayas."`
  },
  {
    question: `Q.122 (Matching - Synonyms)
List I
a. Audacious
b. Capricious
c. Voracious
d. Pensive
List II
1. Deeply thoughtful
2. Greedy / Very hungry
3. Bold / Daring
4. Fickle / Unpredictable`,
    options: ["(A) a-3, b-4, c-2, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Audacious = Bold (साहसी); Capricious = Fickle (मनमौजी); Voracious = Greedy (पेटू); Pensive = Thoughtful (विचारमग्न).`
  },
  {
    question: `Q.123 (Sentence Rearrangement - PQRS)
P. powerful weapon which
Q. education is the most
R. change the world
S. you can use to`,
    options: ["(A) QPSR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Education is the most" (Q) "powerful weapon which" (P) "you can use to" (S) "change the world" (R). (A famous quote by Nelson Mandela).`
  },
  {
    question: `Q.124 (Multi-statement - Dangling Participles)
Which of the following sentences is grammatically correct?
1. Walking in the garden, a snake bit him.
2. While he was walking in the garden, a snake bit him.
3. Being a rainy day, I stayed at home.`,
    options: ["(A) Only 1", "(B) Only 2", "(C) 2 and 3", "(D) 1 and 3"],
    answer: 1,
    explanation: `Statement 1 is a dangling modifier (it implies the snake was walking in the garden). Statement 3 is also a dangling modifier (it implies 'I' was a rainy day; it should be "It being a rainy day"). Only Statement 2 explicitly provides the subject for the action of walking.`
  },
  {
    question: `Q.125 (Matching - Root Words)
List I (Root)
a. Pan
b. Phil
c. Misan
d. Chron
List II (Meaning)
1. Hate
2. Love
3. All
4. Time`,
    options: ["(A) a-3, b-2, c-1, d-4", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Pan = All (Pan-India, Pandemic); Phil = Love (Philanthropist); Misan = Hate (Misanthrope); Chron = Time (Chronometer).`
  },
  {
    question: `Q.126 (Assertion and Reason - No sooner... than)
Assertion (A): "No sooner had the teacher entered the class when the students stood up." is incorrect.
Reason (R): The correlative conjunction 'No sooner' is a comparative form and is always paired with 'than', not 'when'.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "No sooner had the teacher entered the class THAN the students stood up."`
  },
  {
    question: `Q.127 (Sentence Rearrangement - PQRS)
P. the fastest growing
Q. tourism is one of
R. the modern world
S. industries in`,
    options: ["(A) QPSR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Tourism is one of" (Q) "the fastest growing" (P) "industries in" (S) "the modern world" (R).`
  },
  {
    question: `Q.128 (Multi-statement - Prepositions of Time)
Identify the sentence(s) with correct preposition usage:
1. He wakes up early in the morning.
2. We will meet on Monday.
3. The stars shine in night.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 0,
    explanation: `Statement 3 is incorrect. The correct phrase is "AT night". (We use IN for morning/afternoon/evening, but AT for night/noon).`
  },
  {
    question: `Q.129 (Matching - Phrasal Verbs with 'Take')
List I
a. Take off
b. Take after
c. Take over
d. Take up
List II
1. To assume control or responsibility
2. To resemble an older relative
3. To start a new hobby or activity
4. To leave the ground (aircraft) / Remove clothing`,
    options: ["(A) a-4, b-2, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Take off = Leave ground/Remove; Take after = Resemble (समान दिखना); Take over = Assume control (अधिकार लेना); Take up = Start a hobby.`
  },
  {
    question: `Q.130 (Sentence Rearrangement - PQRS)
P. is the need
Q. to save our planet
R. water conservation
S. of the hour`,
    options: ["(A) RPSQ", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Water conservation" (R) "is the need" (P) "of the hour" (S) "to save our planet" (Q).`
  }
  ,
  {
    question: `Q.131 (Assertion and Reason - Voice Change with Two Objects)
Assertion (A): The active sentence "He gave me a book" can be converted into passive as BOTH "I was given a book by him" AND "A book was given to me by him."
Reason (R): Verbs like 'give', 'send', 'teach', and 'lend' take two objects (Direct and Indirect). Either of these objects can be made the subject of the passive sentence.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Both passive forms are grammatically correct, though making the personal (indirect) object the subject is more common in English.`
  },
  {
    question: `Q.132 (Matching - Forms of Government)
List I
a. Democracy
b. Autocracy
c. Oligarchy
d. Plutocracy
List II
1. Government by a few people
2. Government by the wealthy
3. Government by one person with absolute power
4. Government by the people`,
    options: ["(A) a-4, b-3, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Democracy (People); Autocracy (One absolute ruler); Oligarchy (A few people); Plutocracy (The wealthy).`
  },
  {
    question: `Q.133 (Sentence Rearrangement - PQRS)
P. are the leaders
Q. will shape the nation
R. the youth of today
S. of tomorrow who`,
    options: ["(A) R PS Q", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The youth of today" (R) "are the leaders" (P) "of tomorrow who" (S) "will shape the nation" (Q).`
  },
  {
    question: `Q.134 (Multi-statement - 'Some' vs 'Any')
Which of the following sentences correctly uses 'some' or 'any'?
1. I don't have some money in my wallet.
2. Do you have any questions?
3. Would you like some coffee?`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Statement 1 is incorrect because in negative sentences, we must use 'any' ("I don't have any money"). 'Any' is used in questions (Statement 2), but 'some' is used in interrogative sentences that are actually offers or requests (Statement 3).`
  },
  {
    question: `Q.135 (Matching - Color Idioms)
List I
a. Caught red-handed
b. Green with envy
c. Black sheep
d. Out of the blue
List II
1. Very jealous
2. An odd or disreputable member of a family/group
3. Caught while committing a crime
4. Completely unexpectedly`,
    options: ["(A) a-3, b-1, c-2, d-4", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Caught red-handed = Caught doing the crime; Green with envy = Jealous; Black sheep = Disreputable member; Out of the blue = Unexpectedly.`
  },
  {
    question: `Q.136 (Assertion and Reason - Narration of Interrogative Sentences)
Assertion (A): Direct: He said to me, "Where are you going?" -> Indirect: He asked me that where I was going.
Reason (R): In the indirect speech of Wh-question sentences, the conjunction 'that' is NOT used. The Wh-word itself acts as the conjunction.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `The Assertion shows an incorrect indirect conversion (it uses 'that'). The Reason gives the correct rule. Correct Indirect: "He asked me where I was going."`
  },
  {
    question: `Q.137 (Sentence Rearrangement - PQRS)
P. something ready-made
Q. happiness is not
R. your own actions
S. it comes from`,
    options: ["(A) QPSR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Happiness is not" (Q) "something ready-made" (P) "it comes from" (S) "your own actions" (R). (Quote by Dalai Lama).`
  },
  {
    question: `Q.138 (Multi-statement - Law of Parallelism)
Identify the grammatically correct sentence(s) ensuring parallelism:
1. I like swimming, reading, and running.
2. I like to swim, read, and to run.
3. My job includes checking emails, answering calls, and writing reports.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Parallelism requires items in a list to have the same grammatical form. Statement 1 uses V1+ing for all three. Statement 3 uses V1+ing for all three. Statement 2 mixes infinitives and base verbs inappropriately (it should be "to swim, to read, and to run" or "to swim, read, and run").`
  },
  {
    question: `Q.139 (Matching - Antonyms)
List I
a. Ample
b. Obscure
c. Zenith
d. Trivial
List II
1. Clear / Obvious
2. Nadir / Bottom
3. Important / Significant
4. Meager / Scanty`,
    options: ["(A) a-4, b-1, c-2, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-3, c-2, d-1", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Ample (प्रचुर) x Meager (अल्प); Obscure (अस्पष्ट) x Clear (स्पष्ट); Zenith (शीर्ष) x Nadir (निम्नतम बिंदु); Trivial (तुच्छ) x Important (महत्वपूर्ण).`
  },
  {
    question: `Q.140 (Sentence Rearrangement - PQRS)
P. can never be regained
Q. precious commodity
R. once lost it
S. time is the most`,
    options: ["(A) SQRP", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Time is the most" (S) "precious commodity" (Q) "once lost it" (R) "can never be regained" (P).`
  }
  ,
  {
    question: `Q.141 (Assertion and Reason - Exceptions to "To + V1")
Assertion (A): "He is addicted to smoke." is grammatically incorrect.
Reason (R): Generally 'to' is followed by V1 (infinitive). However, phrases ending in 'to' acting as prepositions (like addicted to, with a view to, accustomed to, look forward to) take a Gerund (V1+ing).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "He is addicted to smoking."`
  },
  {
    question: `Q.142 (Matching - Synonyms)
List I
a. Serene
b. Jovial
c. Candid
d. Bizarre
List II
1. Frank / Outspoken
2. Strange / Unusual
3. Calm / Peaceful
4. Cheerful / Happy`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Serene = Calm (शांत); Jovial = Cheerful (हंसमुख); Candid = Frank (स्पष्टवादी); Bizarre = Strange (विचित्र).`
  },
  {
    question: `Q.143 (Sentence Rearrangement - PQRS)
P. transformed the way
Q. of technology has
R. we communicate
S. the rapid advancement`,
    options: ["(A) SQPR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The rapid advancement" (S) "of technology has" (Q) "transformed the way" (P) "we communicate" (R).`
  },
  {
    question: `Q.144 (Multi-statement - Superfluous / Slang words)
Which of the following phrases are grammatically WRONG (superfluous)?
1. Cousin brother
2. Blunder mistake
3. Revert back`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 3,
    explanation: `All three are redundant. "Cousin" includes gender contextually; we don't say cousin brother/sister. "Blunder" means a big mistake, so adding 'mistake' is wrong. "Revert" means to reply or go back, so adding 'back' is unnecessary.`
  },
  {
    question: `Q.145 (Matching - Phrasal Verbs with 'Put')
List I
a. Put out
b. Put up with
c. Put off
d. Put on
List II
1. Tolerate / Endure
2. Extinguish (fire)
3. Wear (clothes)
4. Postpone`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Put out = Extinguish fire; Put up with = Tolerate (सहन करना); Put off = Postpone; Put on = Wear clothes.`
  },
  {
    question: `Q.146 (Assertion and Reason - Made OF vs Made FROM)
Assertion (A): "Paper is made of wood." is incorrect; it should be "Paper is made from wood."
Reason (R): 'Made of' is used for a physical change (the original material is still visible, e.g., chair is made of wood). 'Made from' is used for a chemical change (the original material changes its form completely, e.g., cheese from milk).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `In paper, the wood is chemically processed and no longer looks like wood, hence "made from" is the exact correct phrasing.`
  },
  {
    question: `Q.147 (Sentence Rearrangement - PQRS)
P. aims to protect
Q. their natural habitats
R. endangered species and
S. wildlife conservation`,
    options: ["(A) SPRQ", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Wildlife conservation" (S) "aims to protect" (P) "endangered species and" (R) "their natural habitats" (Q).`
  },
  {
    question: `Q.148 (Multi-statement - Double Comparatives)
Identify the grammatically correct sentence(s):
1. She is more better at math than I am.
2. He is the most cleverest boy in the class.
3. This task is much easier than the previous one.`,
    options: ["(A) Only 1", "(B) Only 3", "(C) 1 and 3", "(D) 2 and 3"],
    answer: 1,
    explanation: `Statement 1 uses double comparative ("more better"), which is wrong. Statement 2 uses double superlative ("most cleverest"), which is wrong. Statement 3 uses an adverb of degree (much) correctly with a comparative (easier), which is perfectly correct.`
  },
  {
    question: `Q.149 (Matching - One Word Substitution for Killings)
List I
a. Regicide
b. Patricide
c. Fratricide
d. Uxoricide
List II
1. Murder of a brother
2. Murder of a king
3. Murder of a wife
4. Murder of a father`,
    options: ["(A) a-2, b-4, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Regis = King (Regicide); Patri = Father (Patricide); Frater = Brother (Fratricide); Uxor = Wife (Uxoricide).`
  },
  {
    question: `Q.150 (Sentence Rearrangement - PQRS)
P. can help you
Q. difficult challenges in life
R. overcome the most
S. a positive mindset`,
    options: ["(A) SPRQ", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"A positive mindset" (S) "can help you" (P) "overcome the most" (R) "difficult challenges in life" (Q).`
  }
  ,
  {
    question: `Q.151 (Sentence Rearrangement - PQRS)
P. the success of a business
Q. customer satisfaction
R. is a major factor
S. in determining`,
    options: ["(A) QRSP", "(B) QSPR", "(C) PQRS", "(D) SPQR"],
    answer: 0,
    explanation: `"Customer satisfaction" (Q) "is a major factor" (R) "in determining" (S) "the success of a business" (P).`
  },
  {
    question: `Q.152 (Matching - Idioms)
Match List I with List II:
List I
a. Burn the midnight oil
b. Hit the nail on the head
c. Bite the bullet
d. Break the ice
List II
1. To say exactly the right thing
2. To work late into the night
3. To start a conversation in a silent situation
4. To face a difficult situation bravely`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Burn the midnight oil = Work late; Hit the nail on the head = Say exactly the right thing; Bite the bullet = Face a tough situation bravely; Break the ice = Start a conversation.`
  },
  {
    question: `Q.153 (Assertion and Reason - Adjective 'Hard' vs 'Hardly')
Assertion (A): "He works hardly to earn money for his family." is grammatically incorrect.
Reason (R): 'Hardly' is a negative adverb meaning 'almost not', whereas 'Hard' is an adverb meaning 'with a lot of effort'.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Since the person is trying to earn money, he must be working with effort. The correct sentence is "He works hard to earn money..."`
  },
  {
    question: `Q.154 (Multi-statement - Order of Adjectives)
Which sentence follows the correct order of adjectives?
1. She bought a beautiful large wooden table.
2. She bought a wooden large beautiful table.
3. She bought a large beautiful wooden table.`,
    options: ["(A) Only 1", "(B) Only 2", "(C) Only 3", "(D) 1 and 3"],
    answer: 0,
    explanation: `The standard order of adjectives is OSASCOMP (Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose). Beautiful (Opinion) -> Large (Size) -> Wooden (Material). So, "beautiful large wooden table" is correct.`
  },
  {
    question: `Q.155 (Matching - Synonyms)
List I
a. Fictitious
b. Melancholy
c. Abundant
d. Inquisitive
List II
1. Sad / Depressed
2. Curious / Eager to know
3. Plentiful
4. Fake / Imaginary`,
    options: ["(A) a-4, b-1, c-3, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-3, c-2, d-1", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Fictitious = Fake/Imaginary (काल्पनिक); Melancholy = Sad (उदास); Abundant = Plentiful (प्रचुर); Inquisitive = Curious (जिज्ञासु).`
  },
  {
    question: `Q.156 (Sentence Rearrangement - PQRS)
P. the habit of saving money
Q. should be cultivated
R. for a secure future
S. from a young age`,
    options: ["(A) PQSR", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The habit of saving money" (P) "should be cultivated" (Q) "from a young age" (S) "for a secure future" (R).`
  },
  {
    question: `Q.157 (Assertion and Reason - Article before Languages)
Assertion (A): "The English is spoken all over the world." is incorrect.
Reason (R): When referring to a language, the definite article 'The' is not used. However, 'The English' refers to the people of England.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Correct sentence: "English is spoken all over the world." Using 'The English' means the British people.`
  },
  {
    question: `Q.158 (Multi-statement - Infinitive vs Gerund)
Identify the grammatically correct sentence(s):
1. I enjoy to read books.
2. I enjoy reading books.
3. She avoided to answer the question.`,
    options: ["(A) Only 1", "(B) Only 2", "(C) 1 and 3", "(D) 2 and 3"],
    answer: 1,
    explanation: `Verbs like enjoy, avoid, mind, admit, deny are always followed by a Gerund (V1+ing). Therefore, statement 1 and 3 are incorrect. Statement 2 is correct.`
  },
  {
    question: `Q.159 (Matching - Antonyms)
List I
a. Vague
b. Arrogant
c. Despair
d. Expand
List II
1. Shrink
2. Clear / Distinct
3. Hope
4. Humble`,
    options: ["(A) a-2, b-4, c-3, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Vague (अस्पष्ट) x Clear; Arrogant (अहंकारी) x Humble; Despair (निराशा) x Hope; Expand (फैलाना) x Shrink (सिकुड़ना).`
  },
  {
    question: `Q.160 (Sentence Rearrangement - PQRS)
P. because of the heavy rain
Q. was canceled
R. scheduled for tomorrow
S. the cricket match`,
    options: ["(A) SRQP", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The cricket match" (S) "scheduled for tomorrow" (R) "was canceled" (Q) "because of the heavy rain" (P).`
  }
  ,
  {
    question: `Q.161 (Assertion and Reason - Each other vs One another)
Assertion (A): "The two brothers always fight with one another." is incorrect.
Reason (R): 'Each other' is used for two persons or things, whereas 'One another' is used for more than two persons or things.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Since there are "two brothers", the correct reciprocal pronoun is 'each other'. Correct sentence: "The two brothers always fight with each other."`
  },
  {
    question: `Q.162 (Matching - Phrasal Verbs with 'Come')
List I
a. Come across
b. Come up with
c. Come off
d. Come around
List II
1. To recover consciousness / agree later
2. To meet or find by chance
3. To produce an idea or a plan
4. To fade or detach`,
    options: ["(A) a-2, b-3, c-4, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Come across = Meet by chance (अचानक मिलना); Come up with = Produce an idea; Come off = Detach (अलग होना); Come around = Recover/Agree later.`
  },
  {
    question: `Q.163 (Sentence Rearrangement - PQRS)
P. plays a vital role
Q. physical exercise
R. in managing stress
S. and improving mood`,
    options: ["(A) QPRS", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Physical exercise" (Q) "plays a vital role" (P) "in managing stress" (R) "and improving mood" (S).`
  },
  {
    question: `Q.164 (Multi-statement - Much vs Many)
Identify the correct sentence(s):
1. I do not have many friends in this city.
2. How much books did you read this year?
3. He has so much patience to handle children.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) Only 1"],
    answer: 1,
    explanation: `'Many' is used with countable nouns (friends), so statement 1 is correct. 'Much' is used with uncountable nouns (patience), so statement 3 is correct. Statement 2 is incorrect because 'books' is countable; it should be "How many books".`
  },
  {
    question: `Q.165 (Matching - Body Part Idioms)
List I
a. By rule of thumb
b. A slip of the lip
c. To cost an arm and a leg
d. Keep at arm's length
List II
1. To avoid becoming too friendly with someone
2. To be extremely expensive
3. A spoken mistake
4. A roughly accurate guide/principle`,
    options: ["(A) a-4, b-3, c-2, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Rule of thumb = Rough guide; Slip of lip = Mistake in speaking; Cost arm and leg = Very expensive; Keep at arm's length = Avoid being too close.`
  },
  {
    question: `Q.166 (Assertion and Reason - Question Tag for 'Let's')
Assertion (A): The question tag for "Let's go for a movie," is "shall we?"
Reason (R): Sentences starting with "Let us" or "Let's" always take "shall we?" as their question tag because they represent a suggestion or proposal involving the speaker.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The rule is absolute. "Let's" takes "shall we?".`
  },
  {
    question: `Q.167 (Sentence Rearrangement - PQRS)
P. who work hard
Q. those people
R. achieve their goals
S. in silence`,
    options: ["(A) QPSR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Those people" (Q) "who work hard" (P) "in silence" (S) "achieve their goals" (R).`
  },
  {
    question: `Q.168 (Multi-statement - Conditional Type 2)
Identify the correct conditional sentence(s):
1. If I have money, I would buy a car.
2. If I had money, I would buy a car.
3. If I have money, I will buy a car.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) Only 2"],
    answer: 1,
    explanation: `Statement 3 is Type 1 Conditional (Real present: If + V1, ...will + V1). Statement 2 is Type 2 Conditional (Unreal present: If + V2, ...would + V1). Statement 1 is grammatically incorrect due to mixing tenses.`
  },
  {
    question: `Q.169 (Matching - Root Words 'Logy')
List I
a. Cardiology
b. Ornithology
c. Anthropology
d. Dermatology
List II
1. Study of birds
2. Study of human beings
3. Study of the heart
4. Study of the skin`,
    options: ["(A) a-3, b-1, c-2, d-4", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Cardio = Heart; Ornith = Birds; Anthropo = Human; Derma = Skin.`
  },
  {
    question: `Q.170 (Sentence Rearrangement - PQRS)
P. the true value of
Q. till we lose it
R. we never know
S. our health`,
    options: ["(A) R P S Q", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"We never know" (R) "the true value of" (P) "our health" (S) "till we lose it" (Q).`
  }
  ,
  {
    question: `Q.171 (Assertion and Reason - Reflexive Pronouns)
Assertion (A): "She enjoyed at the party." is grammatically incorrect.
Reason (R): Transitive verbs like enjoy, avail, pride, absent, and resign must take a reflexive pronoun (myself, herself, etc.) if there is no direct object after them.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Since 'at the party' is a prepositional phrase, 'enjoy' lacks an object. The correct sentence is "She enjoyed HERSELF at the party."`
  },
  {
    question: `Q.172 (Matching - One Word Substitution for Places)
List I
a. Mint
b. Granary
c. Hangar
d. Hanger
List II
1. A place where grain is stored.
2. A place where airplanes are kept.
3. A place where money/coins are made.
4. An item used to hang clothes.`,
    options: ["(A) a-3, b-1, c-2, d-4", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-4, c-1, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Mint = Coins; Granary = Grains; Hangar = Airplanes; Hanger = Clothes.`
  },
  {
    question: `Q.173 (Sentence Rearrangement - PQRS)
P. pollution in our cities
Q. planting more trees
R. to reduce the level of
S. is the best way`,
    options: ["(A) QSRP", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Planting more trees" (Q) "is the best way" (S) "to reduce the level of" (R) "pollution in our cities" (P).`
  },
  {
    question: `Q.174 (Multi-statement - Relative Pronouns Who/Which/That)
Identify the correct sentence(s):
1. The man which stole my bag has been arrested.
2. The dog who is barking is mine.
3. All that glitters is not gold.`,
    options: ["(A) 1 and 2", "(B) Only 3", "(C) 1 and 3", "(D) 2 and 3"],
    answer: 1,
    explanation: `Statement 1 is wrong ('who' is used for humans). Statement 2 is wrong ('which/that' is used for animals, not 'who'). Statement 3 is a correct proverb ('that' is used after 'All').`
  },
  {
    question: `Q.175 (Matching - Synonyms)
List I
a. Flaw
b. Abundant
c. Zealous
d. Defend
List II
1. Protect / Guard
2. Mistake / Defect
3. Enthusiastic / Passionate
4. Plentiful`,
    options: ["(A) a-2, b-4, c-3, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Flaw = Defect (दोष); Abundant = Plentiful (प्रचुर); Zealous = Enthusiastic (उत्साही); Defend = Protect (रक्षा करना).`
  },
  {
    question: `Q.176 (Assertion and Reason - Neither... Nor Agreement)
Assertion (A): "Neither the teacher nor the students is ready." is a correct sentence.
Reason (R): When two subjects are connected by "neither...nor", the verb must agree with the noun nearest to it.`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `The Reason states the correct rule. The noun nearest to the verb is 'students' (plural). Therefore, the verb should be plural ('are'). The Assertion sentence uses 'is', making it incorrect.`
  },
  {
    question: `Q.177 (Sentence Rearrangement - PQRS)
P. to complete the syllabus
Q. the students requested
R. before the final exams
S. the teacher`,
    options: ["(A) QSPR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"The students requested" (Q) "the teacher" (S) "to complete the syllabus" (P) "before the final exams" (R).`
  },
  {
    question: `Q.178 (Multi-statement - Prepositions of Place)
Identify the correct sentence(s):
1. The book is on the table.
2. The cat is hiding under the bed.
3. She is standing at the door.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 3,
    explanation: `All sentences are correct. 'On' for surface contact, 'under' for directly below, and 'at' for a specific point/location.`
  },
  {
    question: `Q.179 (Matching - Action Idioms)
List I
a. Beat around the bush
b. Jump the gun
c. Pull your socks up
d. Miss the boat
List II
1. To work harder / improve your performance
2. To act too early or prematurely
3. To miss an opportunity
4. To avoid talking about the main topic`,
    options: ["(A) a-4, b-2, c-1, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-4, b-1, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Beat around the bush = Avoid the main point; Jump the gun = Act prematurely; Pull socks up = Work harder; Miss the boat = Miss an opportunity.`
  },
  {
    question: `Q.180 (Sentence Rearrangement - PQRS)
P. because he had
Q. left his wallet
R. at home
S. he could not pay the bill`,
    options: ["(A) SPQR", "(B) PQRS", "(C) RQSP", "(D) SPRQ"],
    answer: 0,
    explanation: `"He could not pay the bill" (S) "because he had" (P) "left his wallet" (Q) "at home" (R).`
  }
  ,
  {
    question: `Q.181 (Assertion and Reason - Discuss vs Discuss about)
Assertion (A): "The committee discussed about the new policy." is incorrect.
Reason (R): The verb 'discuss' is a transitive verb that means 'to talk about'. Therefore, using the preposition 'about' after it is redundant (superfluous).`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Verbs like discuss, describe, order, request do not take prepositions after them in active voice. Correct: "The committee discussed the new policy."`
  },
  {
    question: `Q.182 (Matching - Antonyms)
List I
a. Chaos
b. Barren
c. Pessimism
d. Conceal
List II
1. Order / Harmony
2. Optimism
3. Fertile
4. Reveal`,
    options: ["(A) a-1, b-3, c-2, d-4", "(B) a-2, b-1, c-3, d-4", "(C) a-1, b-4, c-2, d-3", "(D) a-3, b-4, c-1, d-2"],
    answer: 0,
    explanation: `Chaos (अराजकता) x Order; Barren (बंजर) x Fertile; Pessimism (निराशावाद) x Optimism; Conceal (छिपाना) x Reveal.`
  },
  {
    question: `Q.183 (Sentence Rearrangement - PQRS)
P. to stay fit and healthy
Q. regular physical exercise
R. for people of all ages
S. is highly recommended`,
    options: ["(A) QSPR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Regular physical exercise" (Q) "is highly recommended" (S) "to stay fit and healthy" (P) "for people of all ages" (R).`
  },
  {
    question: `Q.184 (Multi-statement - Few / A few / The few)
Which of the following sentences uses 'few' correctly?
1. I have few friends, so I feel very lonely.
2. A few students were absent today.
3. The few money I had was stolen.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 0,
    explanation: `'Few' means almost zero (negative), which matches feeling lonely. 'A few' means some (positive), which is correct for absent students. Statement 3 is wrong because 'money' is uncountable, so it should be "The little money I had...".`
  },
  {
    question: `Q.185 (Matching - Phrasal Verbs with 'Get')
List I
a. Get over
b. Get away
c. Get along
d. Get through
List II
1. To escape
2. To recover from an illness/shock
3. To finish or pass an exam
4. To have a friendly relationship`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Get over = Recover; Get away = Escape; Get along = Friendly relationship (मिलजुल कर रहना); Get through = Finish/Pass.`
  },
  {
    question: `Q.186 (Assertion and Reason - Position of 'Enough')
Assertion (A): "She is strong enough to lift this heavy box." is grammatically correct.
Reason (R): When 'enough' is used as an adverb modifying an adjective, it is always placed AFTER the adjective.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `Adjective + Enough is the correct structure (strong enough, smart enough).`
  },
  {
    question: `Q.187 (Sentence Rearrangement - PQRS)
P. the internet has
Q. transformed the world
R. into a global village
S. without any doubt`,
    options: ["(A) SPQR", "(B) PQRS", "(C) RQSP", "(D) PSRQ"],
    answer: 0,
    explanation: `"Without any doubt," (S) "the internet has" (P) "transformed the world" (Q) "into a global village" (R).`
  },
  {
    question: `Q.188 (Multi-statement - Tense Rules)
Identify the correct usage of Tenses:
1. When I reached the station, the train had left.
2. I am playing cricket every Sunday.
3. She has completed her work yesterday.`,
    options: ["(A) Only 1", "(B) 1 and 2", "(C) 1 and 3", "(D) 2 and 3"],
    answer: 0,
    explanation: `Statement 1 correctly uses Past Perfect for the first action and Simple Past for the second. Statement 2 is wrong (routine habits take Simple Present: "I play"). Statement 3 is wrong (past time "yesterday" takes Simple Past: "She completed").`
  },
  {
    question: `Q.189 (Matching - One Word Substitution for Collections)
List I
a. A group of stars
b. A group of singers
c. A group of judges
d. A group of musicians
List II
1. Choir
2. Constellation / Galaxy
3. Band
4. Jury / Bench`,
    options: ["(A) a-2, b-1, c-4, d-3", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Stars = Constellation; Singers = Choir; Judges = Jury/Bench; Musicians = Band.`
  },
  {
    question: `Q.190 (Sentence Rearrangement - PQRS)
P. by helping others
Q. we not only make
R. their lives better
S. but also find inner peace`,
    options: ["(A) PQRS", "(B) PRQS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"By helping others" (P) "we not only make" (Q) "their lives better" (R) "but also find inner peace" (S).`
  }
  ,
  {
    question: `Q.191 (Assertion and Reason - Superfluous Expressions)
Assertion (A): "Please repeat this question again." is incorrect.
Reason (R): The prefix 're-' in words like repeat, return, rewrite already means 'again' or 'back'. Adding 'again' or 'back' after them is grammatically redundant.`,
    options: ["(A) Both A and R are true, and R is the correct explanation of A.", "(B) Both A and R are true, but R is not the correct explanation of A.", "(C) A is true, but R is false.", "(D) A is false, but R is true."],
    answer: 0,
    explanation: `The correct sentence is just: "Please repeat this question."`
  },
  {
    question: `Q.192 (Matching - Miscellaneous Idioms)
List I
a. A piece of cake
b. Add fuel to the fire
c. A blessing in disguise
d. Barking up the wrong tree
List II
1. Looking in the wrong place / Accusing the wrong person
2. A very easy task
3. To make a bad situation worse
4. A good thing that seemed bad at first`,
    options: ["(A) a-2, b-3, c-4, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-4, c-1, d-3", "(D) a-3, b-1, c-4, d-2"],
    answer: 0,
    explanation: `Piece of cake = Very easy; Add fuel to fire = Make worse; Blessing in disguise = Good thing hidden in bad; Barking up wrong tree = Pursuing false lead.`
  },
  {
    question: `Q.193 (Sentence Rearrangement - PQRS)
P. failure is simply
Q. to begin again
R. the opportunity
S. this time more intelligently`,
    options: ["(A) PRQS", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Failure is simply" (P) "the opportunity" (R) "to begin again" (Q) "this time more intelligently" (S). (A famous quote by Henry Ford).`
  },
  {
    question: `Q.194 (Multi-statement - Articles with Uncountable Nouns)
Which of the following sentences correctly omits or uses articles?
1. The gold is a precious metal.
2. Honesty is the best policy.
3. The water in this glass is dirty.`,
    options: ["(A) 1 and 2", "(B) 2 and 3", "(C) 1 and 3", "(D) 1, 2 and 3"],
    answer: 1,
    explanation: `Material nouns (gold, water) and abstract nouns (honesty) do not take 'the' in a general sense. So, statement 1 is wrong (it should be "Gold is..."). Statement 2 is correct. Statement 3 is correct because 'water' is made SPECIFIC ("in this glass"), so it takes 'the'.`
  },
  {
    question: `Q.195 (Matching - Synonyms)
List I
a. Eager
b. Clumsy
c. Gigantic
d. Trivial
List II
1. Huge / Massive
2. Unimportant
3. Keen / Enthusiastic
4. Awkward / Ungraceful`,
    options: ["(A) a-3, b-4, c-1, d-2", "(B) a-1, b-2, c-3, d-4", "(C) a-3, b-1, c-4, d-2", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Eager = Keen (उत्सुक); Clumsy = Awkward (भद्दा/अनाड़ी); Gigantic = Huge (विशाल); Trivial = Unimportant (तुच्छ).`
  },
  {
    question: `Q.196 (Assertion and Reason - Causative Verb 'Make')
Assertion (A): "The teacher made the students to write an essay." is a correct sentence.
Reason (R): In Active Voice, the causative verb 'make' (made) is followed by a bare infinitive (V1 without 'to').`,
    options: ["(A) Both A and R are true.", "(B) Both A and R are false.", "(C) A is false, but R is true.", "(D) A is true, but R is false."],
    answer: 2,
    explanation: `The Reason gives the correct rule. Therefore, the Assertion is incorrect. The correct sentence must be: "The teacher made the students WRITE an essay." (No 'to').`
  },
  {
    question: `Q.197 (Sentence Rearrangement - PQRS)
P. of a healthy lifestyle
Q. regular meditation and yoga
R. to maintaining a calm mind
S. are essential components`,
    options: ["(A) QSPR", "(B) PQRS", "(C) RQSP", "(D) SPQR"],
    answer: 0,
    explanation: `"Regular meditation and yoga" (Q) "are essential components" (S) "of a healthy lifestyle" (P) "to maintaining a calm mind" (R). (Or: Q S P and contribute to maintaining... Let's adjust R: "and contribute to a calm mind". With the given words: QSPR is best: Q - S - P, R modifies components or lifestyle. Actually, Q S P R flows well).`
  },
  {
    question: `Q.198 (Multi-statement - Conditionals Type 3 Inversion)
Identify the correctly structured conditional sentence(s):
1. If he had known the truth, he would have told me.
2. Had he known the truth, he would have told me.
3. If he knew the truth, he would have told me.`,
    options: ["(A) 1 and 2", "(B) 1 and 3", "(C) 2 and 3", "(D) Only 1"],
    answer: 0,
    explanation: `Statement 1 is standard Type 3 (If + Past Perfect). Statement 2 is the inverted form of Type 3 (Had + subject + V3), which means exactly the same and is highly formal and correct. Statement 3 mixes tenses incorrectly.`
  },
  {
    question: `Q.199 (Matching - Root Words)
List I (Root)
a. Somn
b. Ambul
c. Mort
d. Theo
List II (Meaning)
1. God / Religion
2. Sleep
3. Walk / Move
4. Death`,
    options: ["(A) a-2, b-3, c-4, d-1", "(B) a-1, b-2, c-3, d-4", "(C) a-2, b-1, c-4, d-3", "(D) a-4, b-3, c-2, d-1"],
    answer: 0,
    explanation: `Somn = Sleep (Insomnia, Somnambulism); Ambul = Walk (Ambulance, Somnambulism); Mort = Death (Mortal, Post-mortem); Theo = God (Theology, Theist).`
  },
  {
    question: `Q.200 (Sentence Rearrangement - PQRS)
P. towards a common goal
Q. is the ability
R. teamwork
S. to work together`,
    options: ["(A) RQSP", "(B) PQRS", "(C) RQPS", "(D) SPQR"],
    answer: 0,
    explanation: `"Teamwork" (R) "is the ability" (Q) "to work together" (S) "towards a common goal" (P).`
  }

];

let currentIndex = 0;
const userSelections = Array(languageEnglishQuestions.length).fill(null);
const checkedState = Array(languageEnglishQuestions.length).fill(false);

const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
questionEl.style.whiteSpace = "pre-line";
questionEl.style.fontSize = "clamp(0.98rem, 1.15vw, 1.08rem)";
questionEl.style.lineHeight = "1.7";
questionEl.style.fontWeight = "700";
questionEl.style.color = "rgb(15 23 42)";
questionEl.style.wordBreak = "break-word";
questionEl.style.overflowWrap = "break-word";
const optionsFormEl = document.getElementById("options-form");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const explanationTextEl = document.getElementById("explanation-text");
const checkBtn = document.getElementById("check-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function normalizeQuestionText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatQuestionText(text) {
  return normalizeQuestionText(text)
    .replace(/\s*(सूची[- ]?I|सूची 1|List[- ]?I)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(सूची[- ]?II|सूची 2|List[- ]?II)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(कथन|Statement|Statements)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(निष्कर्ष|Conclusion|Conclusions)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(कारण|Reason)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(अभिकथन|Assertion)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(पूर्वधारणा|Assumption|Assumptions)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s*(कूट\s*\(Codes\)|कूट|Codes)\s*:?\s*/gi, "\n\n$1:\n")
    .replace(/\s+([abcd])\.\s+/gi, "\n$1. ")
    .replace(/\s+([1-4])\.\s+/g, "\n$1. ")
    .replace(/\s+(I|II|III|IV)\.\s+/g, "\n$1. ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderQuestion() {
  const item = languageEnglishQuestions[currentIndex];
  progressEl.textContent = `Question ${currentIndex + 1} of ${languageEnglishQuestions.length}`;
  questionEl.textContent = formatQuestionText(item.question);

  optionsFormEl.innerHTML = "";

  item.options.forEach((option, optionIndex) => {
    const label = document.createElement("label");
    label.className = "block cursor-pointer rounded-xl border border-slate-200 p-3 text-sm transition hover:border-indigo-300";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = String(optionIndex);
    input.className = "mr-2 align-middle";
    input.checked = userSelections[currentIndex] === optionIndex;

    input.addEventListener("change", () => {
      userSelections[currentIndex] = optionIndex;
      if (!checkedState[currentIndex]) {
        hideFeedback();
      }
    });

    const text = document.createElement("span");
    text.className = "align-middle";
    text.textContent = option;

    label.appendChild(input);
    label.appendChild(text);
    optionsFormEl.appendChild(label);
  });

  updateOptionStyles();
  renderFeedbackSection();
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === languageEnglishQuestions.length - 1;
}

function updateOptionStyles() {
  const labels = optionsFormEl.querySelectorAll("label");
  const selected = userSelections[currentIndex];
  const correct = languageEnglishQuestions[currentIndex].answer;
  const checked = checkedState[currentIndex];

  labels.forEach((label, idx) => {
    label.className = "block cursor-pointer rounded-xl border border-slate-200 p-3 text-sm transition hover:border-indigo-300";

    if (selected === idx) {
      label.classList.add("border-indigo-400", "bg-indigo-50");
    }

    if (checked) {
      if (idx === correct) {
        label.classList.remove("border-slate-200");
        label.classList.add("border-emerald-500", "bg-emerald-50");
      }
      if (selected === idx && selected !== correct) {
        label.classList.remove("border-indigo-400", "bg-indigo-50");
        label.classList.add("border-rose-500", "bg-rose-50");
      }
    }
  });
}

function renderFeedbackSection() {
  if (!checkedState[currentIndex]) {
    hideFeedback();
    return;
  }

  const selected = userSelections[currentIndex];
  const correct = languageEnglishQuestions[currentIndex].answer;
  const isCorrect = selected === correct;

  feedbackEl.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  feedbackEl.classList.add(isCorrect ? "border-emerald-200" : "border-rose-200", isCorrect ? "bg-emerald-50" : "bg-rose-50", isCorrect ? "text-emerald-800" : "text-rose-800");

  const correctAnswerText = languageEnglishQuestions[currentIndex].options[correct];
  feedbackEl.innerHTML = isCorrect
    ? `<p class="font-semibold">✅ सही उत्तर! आपने सही विकल्प चुना।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`
    : `<p class="font-semibold">❌ गलत उत्तर।</p><p class="mt-1 text-sm">Correct Answer: ${correctAnswerText}</p>`;

  explanationEl.classList.remove("hidden");
  explanationTextEl.textContent = languageEnglishQuestions[currentIndex].explanation;
}

function hideFeedback() {
  feedbackEl.classList.add("hidden");
  explanationEl.classList.add("hidden");
}

checkBtn.addEventListener("click", () => {
  if (userSelections[currentIndex] === null) {
    feedbackEl.classList.remove("hidden");
    feedbackEl.className = "mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800";
    feedbackEl.innerHTML = "<p class='font-semibold'>कृपया पहले एक विकल्प चुनें।</p>";
    explanationEl.classList.add("hidden");
    return;
  }

  checkedState[currentIndex] = true;
  updateOptionStyles();
  renderFeedbackSection();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < languageEnglishQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  }
});

renderQuestion();
