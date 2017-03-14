/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    var totalHours = 40;
    console.log("Hello world");
    // page is now ready, initialize the calendar...
    var map = {};
    var userAvailability = {};
    var users;
    var events;
    var selectedEmployeeId;
    var selectedEmployeeEvents = [];
    var resultSet = [];
    var maxBusyPerson;
    var minBusyPerson;
    $.getJSON('JS/users.json', function (data) {
        console.log("getting json");
        users = data.result;
        $.each(data.result, function (key, val) {
            console.log(val.name);
            $(".form-control1").append("<option value=\"" + val.sys_id + "\">" + val.name + "</option>");
            map[val.sys_id] = val.name;
            userAvailability[val.sys_id] = true;
        });
    });

    $.getJSON('JS/resource_event.json', function (data) {
        console.log("getting event json");
        events = data.result;
        $.each(data.result, function (key, val) {
            console.log("Event id" + val.sys_id);
        });
        events.sort(function (a, b) {
            return getDateFromString(b.start_date_time).getTime() - getDateFromString(a.start_date_time).getTime();
        });
        getResultSet();
        $.each(users, function (key, value) {
            var userName = value.name;
            $.each(resultSet, function (key, val) {
                if (val.name === userName) {
                    $('#userInfo').append("<p>" + val.name + " is busy for " + val.hoursBusy + " hours and free for " + (totalHours - val.hoursBusy) + " hours from March 6 to March 10.</p>");
                }
            });
        });
        $('#userInfo').append("<h4>Max busy: " + maxBusyPerson + " </h4>");
        $('#userInfo').append("<h4>Min busy: " + minBusyPerson + " </h4>");

        $.each(events, function (key, value) {
            if (value.type === 'task') {
                $('#task').append("<p>" + map[value.user.value] + " : " + getDateFromString(value.start_date_time).toUTCString() + " to " + getDateFromString(value.end_date_time).toUTCString() + "</p>");
            }
        });

        $.each(events, function (key, value) {
            if (value.type === 'meeting') {
                $('#meeting').append("<p>" + map[value.user.value] + " : " + getDateFromString(value.start_date_time).toUTCString() + " to " + getDateFromString(value.end_date_time).toUTCString() + "</p>");
            }
        });

    });

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultDate: '2017-03-06',
        defaultView: 'month',
        editable: true,
        events: selectedEmployeeEvents,
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [1, 2, 3, 4, 5], // Monday - Thursday

            start: '08:00', // a start time (10am in this example)
            end: '17:00', // an end time (6pm in this example)
        }


    });

    $("#sel1").change(function () {
        $('#calendar').fullCalendar('removeEvents');
        console.log("dropdown");
        selectedEmployeeId = this.value;
        var selectedText = this.options[this.selectedIndex].text;
        console.log(selectedEmployeeId + " & " + selectedText);

        $.each(events, function (key, val) {
            console.log("Getting event details" + val.sys_id + " " + selectedEmployeeId);
            if (val.user.value === selectedEmployeeId) {



                var color;
                if (val.type === 'task') {
                    color = '#d4f442';
                } else {
                    color = '#41f4f1';
                }
                var obj = {title: val.name, start: val.start_date_time, end: val.end_date_time, color: color};
                selectedEmployeeEvents.push(obj);
                $('#calendar').fullCalendar('renderEvent', obj, false);

            }

        });
        console.log(JSON.stringify(resultSet));



    });
    $("#sel2").change(function () {
        var selectedText = this.options[this.selectedIndex].text;
        selectedText = selectedText.replace(/:/g, '');
        var selectedStart = selectedText.replace(/:/g, '').substring(0, 6);
        var selectedEnd = selectedText.replace(/:g/, '').substring(7);
        $.each(events, function (key, value) {
            var selectedStartString = value.start_date_time.substring(0, 9) + selectedStart;
            var selectedEndString = value.end_date_time.substring(0, 9) + selectedEnd;
            var selectedStartDate = getDateFromString(selectedStartString);
            var selectedEndDate = getDateFromString(selectedEndString);
            var eventStartDate = getDateFromString(value.start_date_time);
            var eventEndDate = getDateFromString(value.end_date_time);
            console.log(selectedStartDate + " " + selectedEndDate + " " + eventStartDate + " " + eventEndDate);
            if (userAvailability[value.user.value] && (selectedStartDate >= eventEndDate || selectedEndDate <= eventStartDate)) {
                userAvailability[value.user.value] = true;
            } else {
                userAvailability[value.user.value] = false;
            }


        });
        console.log(JSON.stringify(userAvailability));
        var value;
        var availUsers = '';
        Object.keys(userAvailability).forEach(function (key) {
            value = userAvailability[key];
            if (value === true) {
                if (availUsers.length == 0) {
                    availUsers = map[key];
                } else {
                    availUsers = availUsers + " , " + map[key];
                }
            }
            //reset
            userAvailability[key] = true;
        });
        if (availUsers.length > 0) {
            $(".avail").text("Available people for this recurring task: " + availUsers);
        } else {
            $(".avail").text("Available people for this recurring task: None ");
        }
        //console.log(JSON.stringify(userAvailability));
    });
    /* Utility function to generate date from given input datetime string */
    function getDateFromString(date) {
        var dateString = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 11) + ":" + date.substring(11, 13) + ":" + date.substring(13, 15) + "Z";
        console.log(dateString);
        return new Date(dateString);
    }

    function getResultSet() {
        var maxBusy = -Infinity;
        var minBusy = Infinity;
        $.each(users, function (key, val) {
            console.log(val.name);
            var currentUser = val.sys_id;
            var hoursBusy = 0;
            var taskType;
            var start_date;

            $.each(events, function (key, val) {
                if (val.user.value === currentUser) {
                    start_date = getDateFromString(val.start_date_time);
                    var end_date = getDateFromString(val.end_date_time);
                    var timeDiff = Math.abs(end_date.getTime() - start_date.getTime());
                    var diffHours = Math.ceil(timeDiff / (1000 * 3600));
                    hoursBusy = hoursBusy + diffHours;
                    taskType = val.type;

                }
            });
            console.log(val.name + " is busy for " + hoursBusy);
            var obj = {name: val.name, hoursBusy: hoursBusy, type: taskType, startDate: start_date};
            resultSet.push(obj);
            if (hoursBusy > maxBusy) {
                maxBusy = hoursBusy;
                maxBusyPerson = val.name;
            } else if (hoursBusy === maxBusy) {
                maxBusyPerson = maxBusyPerson + "," + val.name;
            }
            if (hoursBusy < minBusy) {
                minBusy = hoursBusy;
                minBusyPerson = val.name;
            } else if (hoursBusy === minBusy) {
                minBusyPerson = minBusyPerson + "," + val.name;
            }
        });
        console.log("Max busy:" + maxBusyPerson);
        console.log("Min busy:" + minBusyPerson);
        //drawGraph(resultSet);
        resultSet.sort(function (a, b) {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
        console.log(JSON.stringify(resultSet));
    }



});

