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
        // $('#task').append("<h3> Users busy with tasks</h3>");
        $.each(events, function (key, value) {
            if (value.type === 'task') {
                $('#task').append("<p>" + map[value.user.value] + " : " + getDateFromString(value.start_date_time).toUTCString() + " to " + getDateFromString(value.end_date_time).toUTCString() + "</p>");
            }
        });
        //$('#userInfo').append("<h3> Users busy with meeting</h3>");
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
        //var hoursBusy = 0;
        $.each(events, function (key, val) {
            console.log("Getting event details" + val.sys_id + " " + selectedEmployeeId);
            if (val.user.value === selectedEmployeeId) {


//                var start_date = getDateFromString(val.start_date_time);
//                var end_date = getDateFromString(val.end_date_time);
//                //console.log("Start Date" + val.start_date_time + " " + start_date);
//                //console.log("End Date" + val.end_date_time + " " + end_date);
//                var timeDiff = Math.abs(end_date.getTime() - start_date.getTime());
//                var diffHours = Math.ceil(timeDiff / (1000 * 3600));
//                hoursBusy = hoursBusy + diffHours;
                //console.log(diffHours);
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

        //console.log("Busy for" + hoursBusy + " hours");
//        $.each(resultSet, function (key, val) {
//            if (val.name === selectedText) {
//                $('#userInfo').append("<p>" + val.name + " is busy for " + val.hoursBusy + " hours and free for "+ (totalHours-val.hoursBusy) +" hours from March 6 to March 10.</p>");
//            }
//        });

    });
    $("#sel2").change(function () {
        var selectedText = this.options[this.selectedIndex].text;
        //alert("clicked" + selectedText);
        var s1 = '20170306T' + selectedText.replace(/:/g, '').substring(0, 6);
        var s2 = '20170307T' + selectedText.replace(/:/g, '').substring(0, 6);
        var s3 = '20170308T' + selectedText.replace(/:/g, '').substring(0, 6);
        var s4 = '20170309T' + selectedText.replace(/:/g, '').substring(0, 6);
        var s5 = '201703010T' + selectedText.replace(/:/g, '').substring(0, 6);
        var e1 = '20170306T' + selectedText.replace(/:/g, '').substring(7);
        var e2 = '20170307T' + selectedText.replace(/:/g, '').substring(7);
        var e3 = '20170308T' + selectedText.replace(/:/g, '').substring(7);
        var e4 = '20170309T' + selectedText.replace(/:/g, '').substring(7);
        var e5 = '201703010T' + selectedText.replace(/:/g, '').substring(7);
        console.log(e1);
        $.each(events, function (key, value) {
            //if(typeof value.end_date_time!='undefined' && typeof value.start_date_time!='undefined'){
                if(getDateFromString(e1)<getDateFromString(value.start_date_time) || getDateFromString(s1)>getDateFromString(value.end_date_time) 
                        ||getDateFromString(e2)<getDateFromString(value.start_date_time) || getDateFromString(s2)>getDateFromString(value.end_date_time)
                        || getDateFromString(e3)<getDateFromString(value.start_date_time) || getDateFromString(s3)>getDateFromString(value.end_date_time)
                        || getDateFromString(e4)<getDateFromString(value.start_date_time) || getDateFromString(s4)>getDateFromString(value.end_date_time)
                        || getDateFromString(e5)<getDateFromString(value.start_date_time) || getDateFromString(s5)>getDateFromString(value.end_date_time)){
                    console.log(map[value.user.value]+" is available");
                }
//            }else{
//                 console.log(map[value.user.value]+" is available");
//            }
        });
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

//function drawGraph(data) {
//    var data = data;
//    var width = 400,
//            height = 400,
//            radius = Math.min(width, height) / 2;
//
//    var color = d3.scale.ordinal()
//            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
//    var arc = d3.svg.arc()
//            .outerRadius(radius - 10)
//            .innerRadius(radius - 70);
//
//    var pie = d3.layout.pie()
//            .sort(null)
//            .value(function (d) {
//                return d.hoursBusy;
//            });
//
//    var svg = d3.select("div.panel-body").append("svg")
//            .attr("width", width)
//            .attr("height", height)
//            .append("g")
//            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//    var g = svg.selectAll(".arc")
//            .data(pie(data))
//            .enter().append("g")
//            .attr("class", "arc");
//
//    g.append("path")
//            .attr("d", arc)
//            .style("fill", function (d) {
//                return color(d.data.name);
//            });
//
//    g.append("text")
//            .attr("transform", function (d) {
//                return "translate(" + arc.centroid(d) + ")";
//            })
//            .attr("dy", ".35em")
//            .text(function (d) {
//                return d.data.name;
//            });
////});
//
//    function type(d) {
//        d.hoursBusy = +d.hoursBusy;
//        return d;
//    }
//}

