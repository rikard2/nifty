import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      settings: {
        'General': {
        },
        'Connections': [
          {
            'title': 'Connections',
            'type': 'list',
            'value': [
              {
                    'name': 'Local',
                    'group': 'trustly',
                    'url': 'postgres://127.0.0.1:5432/rikardjavelind'
                },
              {
                    'name': 'Vagrant',
                    'group': 'trustly',
                    'url': 'postgres://vagrant@192.168.56.125:5432/vagrant'
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
      filename: '~/git/privat/hej.sql',
      activeTab: {
          index: -1
      },
      tabs: []
  }
});
