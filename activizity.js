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
    months = _.map(months, function(formatted) {
      var firstWeek = moment(formatted+'-01', 'YYYY-MM-DD').startOf('month').week(),
        lastWeek = moment(formatted+'-01', 'YYYY-MM-DD').endOf('month').week(),
        week, weeks = [], i, j, d1 = moment(formatted, 'YYYY-MM'), d2;

      for (i = lastWeek; i >= firstWeek; i--) {
        week = {
          month: formatted,
          week: i,
          days: []
        };

        if (i === firstWeek) {
          d1.date(1);
        } else {
          d1.week(i).day(0);
        }
        d2 = moment(d1);
        j = 1;
        while (j <= 7 && d2.month() === d1.month()) {
          week.days.push(moment(d2));
          j++;
          d2.add(1, 'days');
        }
        weeks.push(week);
      }
      return {
        formatted: formatted,
        firstWeek: firstWeek,
        lastWeek: lastWeek,
        weeks
      };
    });
    var dateTotals = _.mapValues(data, function(users) {
      return _.reduce(users, function(result, user) {
        return result + _.reduce(_.values(user.entries), function(result2, entry) {
          return result2 + entry.minutes;
        }, 0);
      }, 0);
    });
    var maxDateTotal = _.max(_.values(dateTotals));

    var weekdaysShort = moment.weekdaysShort();
    weekdaysShort.unshift('');

    var dayWidth = 90.75;

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
      .attr('data-month-interval', function(month) { return month.formatted; });
    var monthChart = monthBlock.append('svg')
      .attr('class', 'month-chart')
      .attr('viewBox', function(month) {
        return '0 0 825 ' + (160 * month.weeks.length);
      })
      .attr('preserveAspectRatio', 'xMinYMin meet');
    monthChart.append('rect')
      .attr('class', 'summary-fill')
      .attr('translate', '(0,0)')
      .attr('width', '150')
      .attr('height', function(month) {
        return 160 * month.weeks.length;
      });
    var weeksGroup = monthChart.append('g')
      .attr('transform', "translate(16, 0)");
    var week = weeksGroup.selectAll('g')
      .data(function(month) {
        return month.weeks;
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
        var d1 = w.days[0],
          d2 = w.days[w.days.length - 1];

        return d1.format('MMM D') + (d2.isAfter(d1) ? '-' + d2.format('D') : '');
      });
    weekSummary.append('text')
      .attr('class', 'week-total-primary')
      .attr('transform', 'translate(-2, 34)')
      .text(function(w) {
        var minutes = 0,
          hours,
          handleUser = function(u) {
            if (u.entries) {
              _.each(u.entries, function(e, key) {
                minutes += e.minutes;
              });
            }
          };
        _.each(w.days, function(d) {
          var users = data[d.format(options.dateFormat)];
          if (users) {
            _.each(users, handleUser);
          }
        });

        hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;

        return hours + 'h ' + minutes + 'm';
      });
    var dayWrap = week.selectAll('g.day-wrap')
      .data(function(w) {
        return w.days;
      })
      .enter().append('g')
      .attr('class', 'day-wrap')
      .attr('transform', function(d, index) {
        return 'translate(' + (173.75 + index * dayWidth) + ', 40)';
      });
    dayWrap.append('line')
      .attr('class', 'week-shelf-connection')
      .attr('x1', (dayWidth/2))
      .attr('y1', '92')
      .attr('x2', (dayWidth/2))
      .attr('y2', '28');
    dayWrap.append('circle')
      .attr('class', 'activity activity-type-wrapper')
      .attr('cx', (dayWidth/2))
      .attr('cy', '28')
      .attr('r', function(d) {
        var dateFormatted = d.format(options.dateFormat), total = 0;
        if (_.has(dateTotals, dateFormatted)) {
          total = dateTotals[dateFormatted];
        }
        return 38 * total / maxDateTotal;
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
