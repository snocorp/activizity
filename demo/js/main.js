require.config({
  paths: {
    activizity: '../../activizity',
    d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3",
    lodash: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash",
    moment: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment"
  }
});

require(['activizity'], function(activizity) {
  'use strict';

  var a = activizity();
});
