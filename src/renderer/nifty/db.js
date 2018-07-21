const { Client } = require('pg')

export class DB {
    config = {
        "connections": {
            "Vagrant": {
                "user": "vagrant",
                "host": "192.168.56.125",
                "port": 5432,
                "database": "vagrant",
                "requiresauthkey": "False",
                "url": "postgres://vagrant@192.168.56.125:5432/vagrant",
            }
        }
    }

    constructor() {
        console.log('Load DB', this.config);
        //this.client = new ZeroRPCClient();
    }

    list_servers() {
        return this.config.connections;
    }

    connect() {
        const client = new Client();
        return client.connect()
          .then(() => console.log('connected'))
          .catch(e => console.error('connection error', err.stack))
    }

    cleanResult(res) {
        var cleaned = {};
        var types = {
            '16': 'BOOL',
            '20': 'INTEGER',
            '23': 'SHORT',
            '25': 'TEXT',
            '1184': 'TIMESTAMP_TZ',
            '1700': 'NUMERIC',
            '1043': 'TEXT',
            '1082': 'DATE'
        };
        cleaned.columns = res.fields.map(function(f) {
            return {
                index: f.columnID,
                type: types[f.dataTypeID],
                label: f.name,
                name: f.name,
                width: 100,
                size: f.dataTypeSize
            };
        });
        cleaned.rows = res.rows.map(function(r) {
            return cleaned.columns.map(function(c) {
                return r[c.name];
            });
        });
        return cleaned;
    }

    query(alias, query) {
        var conf = this.config['connections'][alias];
        if (!conf) {
            throw('No available config');
        }

        var client = new Client({
            connectionString: conf.url
        });
        client.connect();
        var dis = this;
        return new Promise(function(fulfill, reject) {
            client.query(query, (err, res) => {
                if (err) {
                    console.log('err', err);
                    reject(err);
                } else {
                    var result = {};
                    result.resultsets = [];
                    if (Array.isArray(res)) {
                        result.resultsets = res.map((r) => {
                            return dis.cleanResult(r);
                        });
                    } else {
                        result.resultsets.push(dis.cleanResult(res));
                    }
                    fulfill(result);
                }
            });
        });
    }
}