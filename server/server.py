from __future__ import unicode_literals, print_function
import zerorpc, os

import sys, csv, ast, os, logging, uuid, datetime, time, psycopg2, sqlite3, re
#import sqlparse
import simplejson as json
from threading import Lock, Thread
from multiprocessing import Queue
from collections import defaultdict
from collections import OrderedDict
from itsdangerous import Serializer

class NiftyAPI(object):
    def __init__(self):
        print("__INIT__")
        self.home_dir = os.path.expanduser('~/.pghoffserver')
        self.config = self.load_config()

    def load_config(self):
        config = dict()
        try:
            with open(self.home_dir + '/config.json') as json_data_file:
                config = json.load(json_data_file, object_pairs_hook=OrderedDict)
        except Exception as e:
            print("Load config exception", e)

        return config

    def boat(self, sentence):
        return "I'm on a fucking boat! " + sentence
    def listservers(self):
        connections = self.config['connections']

        return connections

server = zerorpc.Server(NiftyAPI())
server.bind("tcp://0.0.0.0:4242")
server.run()