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
        cleaned.rowCount = res.rowCount;
        return cleaned;
    }

    async queryAsync(alias, query) {
        var state = this.vm.$store.state;

        var conf = this.config['connections'][alias];
        if (!conf) throw('No available config');

        var client = state.connections[alias];

        if (!client) {
            client = state.connections[alias] = new Client({
                connectionString: conf.url
            });
            console.log('connecting');
            try {
                client.connect();
            } catch(err) {
                connect.err('Failed connect', err);
            }
            console.log('connecting...done');
        }

        var result = await this.clientQuery(client, query);
        return result;
    }
    async clientQuery(client, query) {
        var dis = this;
        console.log('before prom');
        return new Promise((resolve, reject) => {
            var notices = [];
            console.log('2');
            client.on('notice', function(notice, b) {
                var n = {
                    severity: notice.severity,
                    text: notice.message
                };
                notices.push(n);
                console.log('notice', n);
            });
            console.log('3');

            client.query(query, (err, res) => {
                console.log('4');
                if (err) {
                    console.error('rejecting', err);
                    return reject(err);
                }
                var result = { resultsets: [] };
                if (Array.isArray(res)) {
                    result.resultsets = res.map((r) => {
                        notices.push({
                            severity: r.command,
                            count: r.rowCount
                        });
                        return dis.cleanResult(r);
                    });
                } else {
                    result.resultsets.push(dis.cleanResult.apply(dis, [res]));
                    notices.push({
                        severity: res.command,
                        count: res.rowCount
                    });
                }
                result.notices = notices;
                resolve(result);
            });
        });
    }
    query(alias, query) {
        var conf = this.config['connections'][alias];
        if (!conf) {
            throw('NO_AVAILABLE_CONFIG');
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
                            notices.push({
                                type: r.command,
                                count: r.rowCount
                            })
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
