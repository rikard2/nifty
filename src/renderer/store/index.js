import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
                      resultsets: [
                          {
                              label: 'Messages'
                          },
                          {
                              label: 'Result #',
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
                                  return [i, 'Jeff Brown', 'Tomte']
                              })
                          }
                      ]
                  }
              }
          }
      ]
  }
});
