import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      filename: '~/git/privat/hej.sql',
      activeTab: {
          name: 'wtf',
          type: 'sql',
          viewstate: { content: '', resultsets: [] }
      },
      tabs: [
          {
              name: 'tomte',
              active: true,
              type: 'sql',
              viewstate: {
                  content: 'SELECT * FROM Users',
                  resultsets: [
                      {
                          columns: [
                              {
                                  label: 'Nr',
                                  width: 60
                              },
                              {
                                  label: 'First Name',
                                  width: 200
                              },
                              {
                                  label: 'Last Name',
                                  width: 200
                              },
                              {
                                  label: 'Mark zuckerberg is a bitch',
                                  width: 200
                              },
                              {
                                  label: 'Weeeeeeeeeoooo',
                                  width: 200
                              }
                          ],
                          rows:
                              Array.apply(null, {length: 3}).map(Number.call, Number).map(i => {
                                  return [i, 'Jeff Brown', 'Tomte', 'asddasdsa iadsjdklsaj adsljk ads', 'asdlhdaslk asdlk daslkjadsk ljadsk alsd']
                              })
                      },
                      {
                          columns: [
                              {
                                  label: 'Nr',
                                  width: 60
                              },
                              {
                                  label: 'First Name',
                                  width: 200
                              },
                              {
                                  label: 'Last Name',
                                  width: 200
                              },
                              {
                                  label: 'Mark zuckerberg is a bitch',
                                  width: 200
                              },
                              {
                                  label: 'Weeeeeeeeeoooo',
                                  width: 200
                              }
                          ],
                          rows:
                              Array.apply(null, {length: 50000}).map(Number.call, Number).map(i => {
                                  return [i, 'Jeff Brown', 'Tomte', 'asddasdsa iadsjdklsaj adsljk ads', 'asdlhdaslk asdlk daslkjadsk ljadsk alsd']
                              })
                      }
                  ]
              }
          },
          {
              name: 'wtf',
              active: true,
              type: 'sql',
              viewstate: {
                  content: `SELECT *
FROM Users
WHERE UserID = 23`,
                  resultsets: [
                      {
                          columns: [
                              {
                                  label: 'Nr',
                                  width: 60
                              },
                              {
                                  label: 'First Name',
                                  width: 200
                              },
                              {
                                  label: 'Last Name',
                                  width: 200
                              },
                              {
                                  label: 'Mark zuckerberg is a bitch',
                                  width: 200
                              },
                              {
                                  label: 'Weeeeeeeeeoooo',
                                  width: 200
                              }
                          ],
                          rows:
                              Array.apply(null, {length: 50000}).map(Number.call, Number).map(i => {
                                  return [i, 'Jeff Brown', 'Tomte', 'asddasdsa iadsjdklsaj adsljk ads', 'asdlhdaslk asdlk daslkjadsk ljadsk alsd']
                              })
                      }
                  ]
              }
          },
          {
              name: 'Settings',
              active: false,
              type: 'settings',
              viewstate: {
              }
          }
      ]
  }
})
