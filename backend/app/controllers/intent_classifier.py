from envs import env
import os
from tensorflow.keras.models import Sequential, load_model, save_model
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD
from tensorflow.python.keras.backend import set_session
import tensorflow as tf
import nltk
from nltk.stem.lancaster import LancasterStemmer
from pandas import DataFrame
import numpy as np
import pickle
import random
from app.models import Agent, Module, Intent


tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
tf.compat.v1.disable_eager_execution()

class Classifier(object):

    def __init__(self, db_model, error_threshold=0.25):

        self.db_model = db_model
        self.model = None
        self.error_threshold = error_threshold
        self.stemmer = None
        self.graph = None
        self.session = None

    def setup(self):

        if self.stemmer is None:
            self.stemmer = LancasterStemmer()

        self.graph = tf.compat.v1.get_default_graph()
        self.session = tf.compat.v1.Session()
        set_session(self.session)
        self.load()

    def load(self):
        data_path = os.path.join(
            env('MODULE_STORAGE_PATH'),
            "{}.pkl".format(self.db_model.uuid)

        )
        model_path = os.path.join(
            env('MODULE_STORAGE_PATH'),
            "{}.h5".format(self.db_model.uuid)

        )
        data = pickle.load(open(data_path, "rb"))
        self.vocabulary = data['vocabulary']
        self.classes = data['classes']
        self.model = load_model(model_path)
        self.model._make_predict_function()

    def prepare_input(self, raw_input):

        input = [0]*len(self.vocabulary)
        words = nltk.word_tokenize(raw_input)
        for word in [self.stemmer.stem(word.lower()) for word in words]:
            if word in self.vocabulary:
                input[self.vocabulary.index(word)] = 1

        return np.array(input, dtype=list)

    def classify(self, input):

        if self.model is None:
            self.setup()

        with self.graph.as_default():
            set_session(self.session)
            results = self.model.predict(
                DataFrame([(self.prepare_input(input))], dtype=float, index=['input'])
            )[0]
            et = self.error_threshold
            results = [[i, r] for i, r in enumerate(results) if r > et]
            results.sort(key=lambda x: x[1])

        return results

    def build(self):

        builder = ClassifierBuilder(self.db_model)
        builder.build()


class ClassifierBuilder(object):

    def __init__(self, db_model):

        self.db_model = db_model
        self.vocabulary = []
        self.classes = []
        self.documents = []
        self.ignore_tokens = ['?']
        self.model = None
        self.training_x = []
        self.training_y = []
        self.stemmer = LancasterStemmer()

    def build(self):

        self.setup_vocabulary_classes_documents()
        self.setup_training_data()
        self.fit()
        self.save_data_file()
        self.save_model_file()

    def setup_vocabulary_classes_documents(self):

        modules = [model for model in self.db_model.modules]
        intents = {}
        for module in modules:
            for intent in module.intents:
                classification = 'not_found' if module.is_noise else intent.uuid
                if intent.patterns:
                    intents[classification] = {"patterns": []}
                    for pattern in intent.patterns:
                        intents[classification]['patterns'].append(pattern.text)
        voc = []
        classes = []
        documents = []

        for intent_classifier in intents:
            intent = intents[intent_classifier]
            for pattern in intent['patterns']:
                tokens = nltk.word_tokenize(pattern)
                voc.extend(tokens)
                documents.append((tokens, intent_classifier))
                if intent_classifier not in classes:
                    classes.append(intent_classifier)

        voc = [self.stemmer.stem(w.lower()) for w in voc if w not in self.ignore_tokens]
        self.vocabulary = sorted(list(set(voc)))
        self.classes = sorted(list(set(classes)))
        self.documents = documents

    def setup_training_data(self):

        data = []
        for document in self.documents:
            x = [0]*len(self.vocabulary)
            for word in [self.stemmer.stem(word.lower()) for word in document[0]]:
                if word in self.vocabulary:
                    x[self.vocabulary.index(word)] = 1

            y = [0] * len(self.classes)
            y[self.classes.index(document[1])] = 1
            data.append([x, y])

        random.shuffle(data)
        data = np.array(data, dtype=list)
        self.training_x = list(data[:, 0])
        self.training_y = list(data[:, 1])

    def fit(self):

        self.model = Sequential()
        self.model.add(
            Dense(
                128,
                input_shape=(len(self.training_x[0]),),
                activation='relu'
            )
        )
        self.model.add(Dropout(0.5))
        self.model.add(Dense(64, activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(
            Dense(len(self.training_y[0]), activation='softmax')
        )

        sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
        self.model.compile(
            loss='categorical_crossentropy',
            optimizer=sgd,
            metrics=['accuracy']
        )

        self.model.fit(
            np.array(self.training_x),
            np.array(self.training_y),
            epochs=1000,
            batch_size=5,
            verbose=0
        )

    def save_data_file(self):
        data_path = os.path.join(
            env('MODULE_STORAGE_PATH'),
            "{}.pkl".format(self.db_model.uuid)

        )
        with open(data_path, "wb") as dataFile:
            pickle.dump(
                {'vocabulary': self.vocabulary, 'classes': self.classes},
                dataFile
            )

    def save_model_file(self):
        model_path = os.path.join(
            env('MODULE_STORAGE_PATH'),
            "{}.h5".format(self.db_model.uuid)

        )
        save_model(
            self.model,
            model_path,
            True
        )
