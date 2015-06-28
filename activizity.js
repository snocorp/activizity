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
    displayShortDateFormat: 'D MMM',
    displayMonthFormat: 'MMM YYYY',
    locale: 'en-ca'
  });

  moment.locale(options.locale);

  options.data(function(error, data) {
    if (error) {
      console.log(error);
      return;
    }

    var dates = _.keys(data).sort().reverse();
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
    var colors = colorArray(projects.length);
    var months =
      _.uniq(
        _.map(_.keys(data), function(date) {
          return moment(date, options.dateFormat).format('YYYY-MM');
        })
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
    var sidebar = calendar.append('div')
      .attr('class', 'activity-sidebar');
    var projectList = sidebar.append('dl')
      .attr('class', 'project-key');
    var project = projectList.selectAll('dd')
      .data(projects)
      .enter().append('dd')
      .attr('class', function(p) { return p; });
    project.append('span')
      .attr('class', 'key-chip')
      .attr('style', function(p, index) {
        return 'background-color: hsla('+colors[index].h+','+colors[index].s+'%,'+colors[index].l+'%,0.4);';
      });
    project.append('span')
      .text(function(p) { return '#' + p; });
    var daysList = header.append('ul')
      .attr('class', 'days');
    daysList.selectAll('li')
      .data(weekdaysShort)
      .enter().append('li')
      .text(function(w) { return w; });

    var intervals = calendar.append('div')
      .attr('class', 'activity-intervals');
    intervals.append('svg')
      .attr('class', 'defs-container')
      .append('defs');
    var monthBlocks = intervals.selectAll('div')
      .data(months);
    var monthBlock = monthBlocks.enter().append('div')
      .attr('class', 'month-block')
      .attr('data-month-interval', function(month) { return month; });
      // .attr('style', function(month) {
      //   var firstWeek = moment(month, 'YYYY-MM').startOf('month').week();
      //   var lastWeek = moment(month, 'YYYY-MM').endOf('month').week();
      //   var weeks = lastWeek - firstWeek;
      //
      //   return 'height:' + (160 * weeks) + 'px;';
      // });
    var monthChart = monthBlock.append('svg')
      .attr('class', 'month-chart')
      // .attr('height', function(month) {
      //   var firstWeek = moment(month, 'YYYY-MM').startOf('month').week();
      //   var lastWeek = moment(month, 'YYYY-MM').endOf('month').week();
      //   var weeks = lastWeek - firstWeek;
      //
      //   return 160 * weeks;
      // })
      // .attr('width', '825')
      .attr('viewBox', function(month) {
        var firstWeek = moment(month, 'YYYY-MM').startOf('month').week();
        var lastWeek = moment(month, 'YYYY-MM').endOf('month').week();
        var weeks = lastWeek - firstWeek;

        return '0 0 825 ' + (160 * weeks);
      })
      .attr('preserveAspectRatio', 'xMinYMin meet');
    monthChart.append('rect')
      .attr('class', 'summary-fill')
      .attr('translate', '(0,0)')
      .attr('width', '150')
      .attr('height', function(month) {
        var firstWeek = moment(month, 'YYYY-MM').startOf('month').week();
        var lastWeek = moment(month, 'YYYY-MM').endOf('month').week();
        var weeks = lastWeek - firstWeek;

        return 160 * weeks;
      });
    var weeksGroup = monthChart.append('g')
      .attr('transform', "translate(16, 0)");
    var week = weeksGroup.selectAll('g')
      .data(function(month) {
        var weeks = [];
        var firstWeek = moment(month, 'YYYY-MM').startOf('month').week();
        var lastWeek = moment(month, 'YYYY-MM').endOf('month').week();
        for (var i = lastWeek; i >= firstWeek; i--) {
          weeks.push({
            month: month,
            week: i
          });
        }
        return weeks;
      })
      .enter().append('g')
      .attr('class', 'week')
      .attr('transform', function(week, index) {
        return 'translate(0, ' + (160 * index) + ')';
      });
    week.append('line')
      .attr('class', 'week-shelf')
      .attr('x1', '151')
      .attr('y1', '132')
      .attr('x2', '789')
      .attr('y2', '132');
    var weekSummary = week.append('g')
      .attr('class', 'week-summaries')
      .attr('transform', 'translate(0, 34)');
    weekSummary.append('text')
      .attr('class', 'date-range')
      .attr('transform', 'translate(0, 0)')
      .text(function(w) {
        var d1 = moment(w.month, 'YYYY-MM').week(w.week),
          d2 = moment(d1).add(6, 'days');
        if (d2.month() > d1.month()) {
          d2 = moment(d1).endOf('month');
        }
        return d1.format('MMM D') + '-' + d2.format('D');
      });
  });
}

function colorArray(n) {
  var i, colors = [], y = 0.5, u, v, phi;
  for(i = 0; i < 360; i += 360 / n) {
    colors.push({
      h: i,
      s: 90 + Math.random() * 10,
      l: 50 + Math.random() * 10
    });
  }

  return colors;
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
