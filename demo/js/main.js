require.config({
  paths: {
    activizity: '../../activizity',
    d3: [
      "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3",
      "/bower_components/d3/d3"
    ],
    lodash: [
      "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash",
      "/bower_components/lodash/lodash"
    ],
    moment: [
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales",
      "/bower_components/moment/min/moment-with-locales"
    ]
  }
});

require(['activizity'], function(activizity) {
  'use strict';

  activizity({
    data: function(callback) {
      callback(null,{
        '2015-06-02': {
          '10001': {
            'name': 'Dave Sewell',
            'entries': {
              'overhead': {
                'minutes': 180,
                'comments': ['convention prep']
              },
              'fsapp': {
                'minutes': 300,
                'comments': ['investigation into barcode issue, notifications']
              }
            }
          },
          '10002': {
            'name': 'Jonathan Clarkin',
            'entries': {
              'vacation': {
                'minutes': 480
              }
            }
          }
        },
        '2015-06-01': {
          '10002': {
            'name': 'Jonathan Clarkin',
            'entries': {
              'vacation': {
                'minutes': 480
              }
            }
          }
        },
        '2015-05-31': {
        },
        '2015-05-30': {
        },
        '2015-05-29': {
        }
      });
    }
  });
});
