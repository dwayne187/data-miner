'use strict'

var moment = require('moment');
const utils = require('../utils/data.js');

exports.averageAge = function (jiraData, startDate, endDate) {


  var dateRange = utils.datesInRange(startDate, endDate);

  // pre-process jira data to reduce
  var issues = jiraData.map(issue => {
    var iss = {};
    iss.created = issue.Created.substring(0, 10);
    iss.resolved = utils.resolvedDate(issue);
    return iss;
  });

  // get relevant issues at each date point in range
  var dataset = {};
  dateRange.forEach(date => {

    // get all unresolved & open issues that exist on this date
    var relevantIssues = issues.filter(iss => {
      var relevant = ((iss.created <= date) && !(utils.resolvedNow(iss, date)));
      return relevant;
    });
    var numIssues = relevantIssues.length; // get number of issues

    // get age of each issue & derive average age of issues
    if (relevantIssues && relevantIssues.length > 1) {
      dataset[date] = relevantIssues.map(iss => {
        var created = moment(iss.created).add(12, 'hours'); // hack as date 1 hour off
        var current = moment(date).add(12, 'hours'); // hack as date 1 hour off
        return current.diff(created, 'days');
      }).reduce((a, b) => {
        return a + b;
      }) / numIssues;
    } else if (relevantIssues && relevantIssues.length === 1) {
      dataset[date] = relevantIssues.map(iss => {
        var created = moment(iss.created).add(12, 'hours'); // hack as date 1 hour off
        var current = moment(date).add(12, 'hours'); // hack as date 1 hour off
        return current.diff(created, 'days');
      }) / numIssues;
    } else {
      dataset[date] = 0;
    }
  });
  return dataset;
};