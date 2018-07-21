var promise = require('promise');

export class ZeroRPCClient {
    constructor() {
        //this.client = new zerorpc.Client();
        //client.connect('tcp://127.0.0.1:4242');
    }

    get(name, parameters) {
        /*parameters = parameters || [];

        return new Promise(function (fulfill, reject) {
            var callback = function(error, res, more) {
                fulfill(res);
            };
            this.client.invoke.apply(this, [ name ].concat(parameters), callback);
        });*/
    }
}