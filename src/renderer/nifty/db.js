const { Client } = require('pg')

export class DB {
    vm = null;
    config = {};

    constructor(vm) {
        this.vm = vm;
        this.config = vm.$store.state.config;
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

    formatRow(row, column) {
        return row;
    }
    cleanResult(res) {
        var dis = this;
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
                return dis.formatRow(r[c.name], c);
            });
        });
        return cleaned;
    }

    async queryAsync(alias, query) {
        var conf = this.config['connections'][alias];
        if (!conf) throw('No available config');

        var client = new Client({
            connectionString: conf.url
        });
        client.connect();
        var result = await this.clientQuery(client, query);
        return result;
    }
    async clientQuery(client, query) {
        var dis = this;
        return new Promise((resolve, reject) => {
            client.query(query, (err, res) => {
                if (err) return reject(err);

                var result = { resultsets: [] };
                if (Array.isArray(res)) {
                    result.resultsets = res.map((r) => {
                        return dis.cleanResult(r);
                    });
                } else {
                    result.resultsets.push(dis.cleanResult.apply(dis, [res]));
                }
                resolve(result);
            });
        });
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
                    reject(err);
                } else {
                    var result = {};
                    result.resultsets = [];
                    if (Array.isArray(res)) {
                        result.resultsets = res.map((r) => {
                            return dis.cleanResult(r);
                        });
                    } else {
                        result.resultsets.push(dis.cleanResult.apply(dis, [res]));
                    }
                    fulfill(result);
                }
            });
        });
    }
}