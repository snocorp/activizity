/*! activizity v0.0.0 - MIT license */

;(function (global) {
'use strict';
function moduleDefinition(_, d3, moment) {

// ---------------------------------------------------------------------------

/**
 * @param {}
 * @return {}
 * @api public
 */

function activizity(options) {
  options = options || {};
  _.defaults(options, {
    containerSelector: '#activizity',
    data: function(callback) { callback(null,{}); },
    dateFormat: 'YYYY-MM-DD',
    displayDateFormat: 'D MMM YYYY',
    displayMonthFormat: 'MMM YYYY',
    locale: 'en-ca'
  });

  moment.locale(options.locale);

  options.data(function(error, data) {
    if (error) {
      console.log(error);
      return;
    }

    var dates = _.keys(data).sort();
    if (dates.length === 0) {
      console.log('No dates provided');
      return;
    }

    var currentMonth = moment(dates[0], options.dateFormat);
    var projects =
      // make the list unique
      _.uniq(
        // flatten the arrays of project keys
        _.flatten(
          // get the project keys from the entries
          _.map(
            //pluck the entries from the user info
            _.pluck(
              //flatten the arrays of user info
              _.flatten(
                _.map(
                  // get the values from the days: the userId->userInfo map
                  _.values(data),
                  function(users) {
                    //get the values from the users: the userInfo
                    return _.values(users);
                  }
                )
              ), 'entries'
            ),
            function(entries) { return _.keys(entries); }
          )
        )
      );

    var weekdaysShort = moment.weekdaysShort();
    weekdaysShort.unshift('');

    var calendar = d3.select(options.containerSelector)
      .append('div')
      .attr('class', 'activity-calendar');
    var header = calendar.append('div')
      .attr('class', 'activity-header');
    header.append('h3')
      .attr('class', 'current-month')
      .text(currentMonth.format(options.displayMonthFormat));
    var projectList = header.append('dl')
      .attr('class', 'project-key');
    projectList.selectAll('dd')
      .data(projects)
      .enter().append('dd')
      .attr('class', function(p) { return p; })
      .text(function(p) { return '#' + p; });
    var daysList = header.append('ul')
      .attr('class', 'days');
    daysList.selectAll('li')
      .data(weekdaysShort)
      .enter().append('li')
      .text(function(w) { return w; });

    calendar.append('div')
      .attr('class', 'activity-intervals');
  });
}

/**
 * Expose activizity
 */

return activizity;

// ---------------------------------------------------------------------------

} if (typeof exports === 'object') {
    // node export
    module.exports = moduleDefinition(require('lodash'), require('d3'), require('moment'));
} else if (typeof define === 'function' && define.amd) {
    // amd anonymous module registration
    define(['lodash', 'd3', 'moment'], moduleDefinition);
} else {
    // browser global
    global.activizity = moduleDefinition(_, d3, moment);
}}(this));
