import nltk
# nltk.download('wordnet')
from nltk.corpus import wordnet
import random

def getAnt(word):
    antonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            if l.antonyms():
                antonyms.append(l.antonyms()[0].name())
    if(len(antonyms) > 0):
        return antonyms[random.randint(0,len(antonyms)-1)]
    return word


def getSyn(word):
    synonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            synonyms.append(l.name())
    if(len(synonyms) > 0):
        return synonyms[random.randint(0,len(synonyms)-1)]
    return word
