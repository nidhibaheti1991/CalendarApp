/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



//var width = 960,
//    height = 500,
//    radius = Math.min(width, height) / 2;
//
//var color = d3.scale.ordinal()
//    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
//var arc = d3.svg.arc()
//    .outerRadius(radius - 10)
//    .innerRadius(radius - 70);
//
//var pie = d3.layout.pie()
//    .sort(null)
//    .value(function(d) { return d.population; });
//
//var svg = d3.select("body").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//  .append("g")
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//var data = [
//  {age: "A", population: 12},
//  {age: "B", population: 122},
//  {age: "C", population: 321}
//];
//
//  var g = svg.selectAll(".arc")
//      .data(pie(data))
//    .enter().append("g")
//      .attr("class", "arc");
//
//  g.append("path")
//      .attr("d", arc)
//      .style("fill", function(d) { return color(d.data.age); });
//
//  g.append("text")
//      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//      .attr("dy", ".35em")
//      .text(function(d) { return d.data.age; });
////});
//
//function type(d) {
//  d.population = +d.population;
//  return d;
//}
