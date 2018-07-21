from __future__ import unicode_literals, print_function
from datetime import date, datetime
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
        self.connections = {}

    def load_config(self):
        config = dict()
        try:
            with open(self.home_dir + '/config.json') as json_data_file:
                config = json.load(json_data_file, object_pairs_hook=OrderedDict)
        except Exception as e:
            print("Load config exception", e)

        return config

    def listservers(self):
        return self.config['connections']

    def get_type(self, oid):
        mp = {
            '16': 'BOOL',
            '20': 'INTEGER',
            '23': 'SHORT',
            '25': 'TEXT',
            '1184': 'TIMESTAMP_TZ',
            '1700': 'NUMERIC',
            '1043': 'TEXT', # varchar
            '1082': 'DATE'
        }
        return mp.get(str(oid))

    def json_serial(self, obj):
        """JSON serializer for objects not serializable by default json code"""

        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        raise TypeError ("Type %s not serializable" % type(obj))


    def query(self, alias):
        conn = self.connections.get(alias)
        print('server', conn)
        cur = conn.cursor()
        cur.execute("SELECT * FROM Users")

        rows = cur.fetchall()
        #print(cur.description);

        columns = [{ 'name': desc[0], 'type': self.get_type(desc[1]), 'type_code': desc[1] } for desc in cur.description]
        #for c in rows[0]:
        #    print(c)
        #    print('\n')
        x = []
        for r in rows:
            y = []
            for c in r:
                print(type(c))
                if (type(c) == datetime.datetime):
                    y.append(str( c.utcnow() ))
                else:
                    y.append(c)
            x.append(y)
        #print(json.dumps(x))
        #return { 'rows': x, 'columns': columns }
        return json.dumps(x)

    def connect_server(self, alias, authkey=None):
        server = self.config['connections'].get(alias, None)
        if not server:
            return {'alias': alias, 'success':False, 'errormessage':'Unknown alias.' + alias}
        if self.connections.get(alias):
            return {'alias': alias, 'success':False, 'errormessage':'Already connected to server.'}

        print('server', server['url'])
        conn = psycopg2.connect(server['url'])
        self.connections[alias] = conn

        return {'alias': alias, 'success':True, 'color': self.config['connections'][alias].get('color'), 'errormessage':None}

server = zerorpc.Server(NiftyAPI())
server.bind("tcp://0.0.0.0:4242")
server.run()