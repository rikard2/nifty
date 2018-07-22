import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      config: {
          connectionGroups: {
              'trustly': {}
          },
          connections: {
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
               'serverrequest': [
                   {
                       'type': 'json'
                   }
               ],
               'orderid': [
                   {
                       'connection': 'trustly',
                       'query': `
                            SELECT OrderSteps.OrderStepID, OrderSteps.Datestamp, OrderStepTypes.Name
                            FROM OrderSteps
                            JOIN OrderStepTypes ON OrderSteps.OrderStepTypeID = OrderStepTypes.OrderStepTypeID
                            WHERE OrderSteps.OrderID = $ID$
                            ORDER BY OrderSteps.Datestamp;
                       `
                   }
               ]
          }
      },
      filename: '~/git/privat/hej.sql',
      activeTab: {
          index: 0
      },
      tabs: [
          {
              name: 'woho.sql',
              active: true,
              type: 'sql',
              viewstate: {
                  result: {
                      loading: true,
                      selected: 1,
                      resultsets: [
                          {
                              label: 'Messages',
                              resultset: false,
                              messages: [{
                                  text: 'whatever'
                              }]
                          },
                          {
                              label: 'Result #',
                              resultset: true,
                              columns: [{
                                  label: 'Nr',
                                  width: 60
                              },
                              {
                                  label: 'Name',
                                  width: 300
                              }],
                              rows:
                              Array.apply(null, {length: 5}).map(Number.call, Number).map(i => {
                                  return [i, 'Jeff Brown']
                              })
                          }
                      ]
                  }
              }
          }
      ]
  }
});
