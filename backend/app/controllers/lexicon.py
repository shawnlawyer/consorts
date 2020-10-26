from flask import request, jsonify, abort
import nltk
from nltk.corpus import wordnet
from nltk.tokenize import TweetTokenizer

import urllib.parse
WORDNET2UNITAGPOS =  {'n':'NOUN','v':'VERB','a':'ADJ','r':'ADV'}
UNITAG2WORDNETPOS =  {'NOUN':'n','VERB':'v','ADJ':'a','ADV':'r'}

def get_text_variations_action(text=None):
    """Get variations for text

    :param text: text to get variations for
    :type text: string

    """

    if not text:

        data = request.get_json()

        text = str(data.get('text'))

        if not text:

            abort(422)

    response = {
        "input": text,
        "success": True,
        "results": [text_variations(line) for line in text.split('\n')]
    }

    return jsonify(response)

def get_synsets_action(words=[]):
    """Get synsets for a word

    :param words: List of word to get a synsets for
    :type words: list

    """

    if not words:

        data = request.get_json().get('data', {})

        words = str(data.get('words'))

        if not words:

            abort(422)

    results = {}
    _synsets = []
    for word in words:
        if word:
            word = urllib.parse.unquote_plus(word)
        if word.lower() not in _synsets:
            _synsets.append(word.lower())
            results[word] = synsets(word)

    response = {
        "input": words,
        "success": True,
        "results": results
    }

    return response

def get_definations_action(words=[]):
    """Get definations for  words

    :param word: String to get a synsets for a word
    :type word: string

    """

    if not words:

        data = request.get_json().get('data', {})

        words = str(data.get('words'))

        if not words:

            abort(422)

    results = {}
    synsets_log = []
    for word in words:
        if word:
            word = urllib.parse.unquote_plus(word)
        if word.lower() not in synsets_log:
            synsets_log.append(word.lower())
            _synsets = []
            #for synset in :
            #if synset['word'] == word:
            #    _synsets.append(synset)
            results[word] = synsets(word)

    response = {
        "input": words,
        "success": True,
        "results": results
    }

    return response

def tags(text, lang='eng'):
    """Processes a sequence of words, and attaches a part of speech tag to each word

    :param text:
    :param lang:
    :return: nltk.pos_tag
    """

    tokenizer = TweetTokenizer()
    text = tokenizer.tokenize(text)
    return nltk.pos_tag(text, lang=lang, tagset='universal')

def synsets(word, pos=None, lang="eng"):
    """Get synsets for a word

    :param word: String to get a synsets for a word
    :type word: string

    """

    results = []

    synsets = wordnet.synsets(word, pos=pos, lang=lang)
    for synset in synsets:

        synset_name = synset.name()
        lexname = synset.lexname()
        defination = synset.definition()
        examples = synset.examples()
        offset = synset.offset()
        pos = synset.pos()

        synonoms = synset.lemma_names()
        synonom = word
        if synonoms:
            synonoms = synset.lemma_names()
            synonom = synonoms[0]

        root_hypernyms = []
        for _synset in synset.root_hypernyms():
            root_hypernyms += _synset.lemma_names()

        member_holonyms = []
        for _synset in synset.member_holonyms():
            member_holonyms += _synset.lemma_names()

        hypernyms = []
        for _synset in synset.hypernyms():
            hypernyms += _synset.lemma_names()

        antonyms = []
        for lemma in synset.lemmas():
            antonyms = [antonym.name() for antonym in lemma.antonyms()]

        result = {
            'name': synset_name,
            'lexname': lexname,
            'defination': defination,
            'examples': examples,
            'offset': offset,
            'pos': pos,
            'word': synonom,
            'synonoms': synonoms,
            'antonyms': antonyms,
            'hypernyms': hypernyms,
            'member_holonyms': member_holonyms,
            'root_hypernyms': root_hypernyms
        }

        results.append(result)

    response = {
        "word": word,
        "results": results
    }

    return response


def text_variations(text):
    """Processes a sequence of words, and attaches a part of speech tag to each word

    :param uuid:
    :return: JSON
    """

    results = []
    for tag in tags(text.strip()):
        _results = []
        #_results.append(tag[1])
        if tag[1] in UNITAG2WORDNETPOS:
            _synsets = synsets(tag[0], UNITAG2WORDNETPOS[tag[1]])
            for synset in _synsets.get('results', []):
                #_results.append(synset['word'])
                _results += synset.get('synonoms', [])
                _results += synset.get('hypernyms', [])
                _results = [text.replace('_', ' ') for text in list(set(_results))]


        results.append([tag[0], _results])

    return results
