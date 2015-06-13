require.config({
  paths: {
    activizity: '../../activizity',
    d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3",
    lodash: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash",
    moment: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales"
  }
});

require(['activizity'], function(activizity) {
  'use strict';

  activizity({
    data: function(callback) {
      callback(null,{
        '2015-06-12': {
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
        '2015-06-11': {
          '10002': {
            'name': 'Jonathan Clarkin',
            'entries': {
              'vacation': {
                'minutes': 480
              }
            }
          }
        },
        '2015-06-10': {
        },
        '2015-06-09': {
        },
        '2015-06-08': {
        }
      });
    }
  });
});
