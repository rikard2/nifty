import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        connections: {},
        settings: {
            'General': {
            },
            'Connections': [
                {
                    'title': 'Connections',
                    'type': 'list',
                    'value': [
                        {
                            'name': 'Vagrant',
                            'group': 'trustly',
                            'url': 'postgres://vagrant@192.168.56.125:5432/vagrant'
                        },
                        {
                            'name': 'Local',
                            'group': 'trustly',
                            'url': 'postgres://127.0.0.1:5432/rikardjavelind'
                        }
                    ]
                }
            ],
            'Folders': [
                {
                    'title': 'Connections',
                    'type': 'list',
                    'value': [
                        {
                            'name': 'Vagrant',
                            'group': 'trustly',
                            'url': 'postgres://vagrant@192.168.56.125:5432/vagrant'
                        }
                    ]
                }
            ]
        },
        config: {
            connectionGroups: {
                'trustly': {}
            },
            connections: {
                'local': {
                    'name': 'Local',
                    'group': 'trustly',
                    'url': 'postgres://127.0.0.1:5432/rikardjavelind'
                },
                'vagrant': {
                    'name': 'Vagrant',
                    'group': 'trustly',
                    'url': 'postgres://vagrant@192.168.56.125:5432/vagrant'
                }
            },
            lookups: {
                'userid':
                [{
                    'connection': 'trustly',
                    'query': 'SELECT * FROM Users WHERE UserID IN ($IDS$)'
                }],
                'serverrequest': [{ 'type': 'json' }],
                'clientresponse': [{ 'type': 'json' }],
                'serverstate': [{ 'type': 'json' }],
                'hostid': [{
                    query: `
                    SELECT *
                    FROM Hosts
                    WHERE Hosts.HostID IN ($IDS$);
                    `
                }],
                'workerstatusid': [
                    {
                        query: `
                        SELECT *
                        FROM WorkerStatuses
                        ORDER BY WorkerStatusID = $ID$ DESC, WorkerStatusID
                        `
                    }
                ],
                'ordertypeid': [
                    {
                        query: `
                        SELECT *
                        FROM WorkerTypes
                        ORDER BY WorkerTypeID = $ID$ DESC, WorkerTypeID
                        `
                    }
                ],
                'orderid': [
                    {
                        'connection': 'trustly',
                        'name': 'Order Steps',
                        'query': `
                        SELECT OrderSteps.OrderStepID, OrderSteps.Datestamp, WorkerTypes.Name AS WorkerType, OrderStepTypes.Name
                        FROM OrderSteps
                        JOIN OrderStepTypes ON OrderSteps.OrderStepTypeID = OrderStepTypes.OrderStepTypeID
                        JOIN WorkerTypes ON WorkerTypes.WorkerTypeID = OrderStepTypes.OrderTypeID
                        WHERE OrderSteps.OrderID = $ID$
                        ORDER BY OrderSteps.Datestamp;
                        `
                    },
                    {
                        'connection': 'trustly',
                        'name': 'Order info',
                        'query': `
                        SELECT Orders.OrderID, Users.UserID
                        FROM Orders
                        JOIN Users ON Users.UserID = Orders.UserID
                        WHERE OrderID = $ID$;
                        `
                    }
                ]
            }
        },
        filename: '',
        activeTab: {
            index: -1
        },
        tabs: [],
        query: {},
        newQuery: function(connection) {
            var key = require('uniqid')();

            Vue.set(this.query, key, {
                error: false,
                result: {
                    selected: null,
                    resultsets: {},
                    executing: true
                }
            });

            return key;
        },
        tab: {},
        selectTab: function(key) {
            Vue.set(this, 'selectedTabKey', key);
        },
        closeTab: function(key) {
            this.selectPreviousTab();
            Vue.delete(this.tab, key);
            if (Object.keys(this.tab) == 0) {
                this.selectTab(null);
            }
        },
        selectPreviousTab: function() {
            if (this.selectedTabKey) {
                var keys = Object.keys(this.tab);
                var index = keys.indexOf(this.selectedTabKey);
                if (index !== -1) {
                    if (index === 0 && keys.length > 0) {
                        this.selectTab(keys[keys.length - 1]);
                    } else {
                        this.selectTab(keys[index - 1]);
                    }
                } else {
                    this.selectTab(keys.length > 0 ? keys[0] : null);
                }
            }
        },
        selectNextTab: function() {
            if (this.selectedTabKey) {
                var keys = Object.keys(this.tab);
                var index = keys.indexOf(this.selectedTabKey);
                if (index !== -1) {
                    if (index === keys.length - 1 && keys.length > 0) {
                        this.selectTab(keys[0]);
                    } else {
                        this.selectTab(keys[index + 1]);
                    }
                } else {
                    this.selectTab(keys.length > 0 ? keys[0] : null);
                }
            }
        },
        newTab: function(params) {
            params = Object.assign({
                name: 'Untitled',
                type: 'sql',
                viewstate: {
                }
            }, params);

            var key = require('uniqid')();
            Vue.set(this.tab, key, params);

            var keys = Object.keys(this.tab);
            if (keys.length === 1) {
                this.selectTab(keys[0]);
            }

            return key;
        }
    }
});
