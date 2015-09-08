//Bubble Chart Implementation
  var sampleData = [{
  "x": 80,
  "y": 80,
  "Description":"Boston"
},
                  {
  "x": 130,
  "y": 130,
     "Description":"Dallas"
},
                  {
  "x": 180,
  "y": 180,
  "Description":"NewYork"
},
                       {
  "x": 280,
  "y": 280,
  "Description":"West Virginia"
},
                    {
  "x": 230,
  "y": 230,
  "Description":"Newark"
}];

var rangeSelection=[d3.min(sampleData, function (d) {
                            return (d.x);
                        }),
                        d3.max(sampleData, function (d) {
                            return d.x;
                        })];

var vis = d3.select("#motionBubbleChart");
var xRange = d3.scale.linear().range(rangeSelection).domain(rangeSelection);

var yRange = d3.scale.linear().range(rangeSelection).domain(rangeSelection);
     
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

function repeatcircle(){d3.select(this).transition()
.duration(5000)
  .attr("cx",function(d){return d.x+50;})
  .transition()
.duration(5000)
  .attr("cx",function(d){return d.x-50;})
                      .each("end",repeatcircle)}
                      //.attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; })
                            
var circles = vis.selectAll("circle").data(sampleData);
    circles
        .enter()
        .insert("circle")
        .attr("cx", function (d) { return xRange (d.x); })
        .attr("cy",function (d) { return yRange (d.y);})
        .attr("r", 10)
        .style("fill", "red")
        .on("mouseover", function(d) {
              tooltip.text(d.Description);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

circles.transition()
.attr("cx",function(d){return d.x+50;})
.duration(5000) 
.transition()
.duration(5000)
.attr("cx",function(d){return d.x-50;})
.each("end",repeatcircle);
  
    //Bar Chart Implementation

    var w = 500,
        h = 100;

    var svg = d3.select("#bchart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
  
    d3.json("bar_sample.json", function(json) {
  
      var data = json.items;
  
      var max_n = 0;
      for (var d in data) {
        max_n = Math.max(data[d].n, max_n);
      }
    
      var dx = w / max_n;
      var dy = h / data.length;
  
      // bars
      var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {return "bar " + d.label;})
        .attr("x", function(d, i) {return 0;})
        .attr("y", function(d, i) {return dy*i;})
        .attr("width", function(d, i) {return dx*d.n})
        .attr("height", dy);
  
      // labels
      var text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 5)
        .attr("y", function(d, i) {return dy*i + 15;})
        .text( function(d) {return d.label + " (" + d.n  + ")";})
        .attr("font-size", "15px")
        .style("font-weight", "bold");
    });

//PIE CHART

 var canvasWidth = 300, //width
      canvasHeight = 300,   //height
      outerRadius = 100,   //radius
      color = d3.scale.category20(); //builtin range of colors

    var dataSet = 
      [
          { "State": 'Boston', "count": 10 }, 
          { "State": 'Phoneix', "count": 20 },
          { "State": 'Newjersey',"count": 30 },
          { "State": 'Dalllas', "count": 40 }
        ];
    
    var vis = d3.select("#pieChart")
      .append("svg:svg") //create the SVG element inside the <body>
        .data([dataSet]) //associate our data with the document
        .attr("width", canvasWidth) //set the width of the canvas
        .attr("height", canvasHeight) //set the height of the canvas
        .append("svg:g") //make a group to hold our pie chart
          .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")") // relocate center of pie to 'outerRadius,outerRadius'

    // This will create <path> elements for us using arc data...
    var arc = d3.svg.arc()
      .outerRadius(outerRadius);

    var pie = d3.layout.pie() //this will create arc data for us given a list of values
      .value(function(d) { return d.count; }) // Binding each value to the pie
      .sort( function(d) { return null; } );

    // Select all <g> elements with class slice (there aren't any yet)
    var arcs = vis.selectAll("g.slice")
      // Associate the generated pie data (an array of arcs, each having startAngle,
      // endAngle and value properties) 
      .data(pie)
      // This will create <g> elements for every "extra" data element that should be associated
      // with a selection. The result is creating a <g> for every object in the data array
      .enter()
      // Create a group to hold each slice (we will have a <path> and a <text>
      // element associated with each slice)
      .append("svg:g")
      .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
      //set the color for each slice to be chosen from the color function defined above
      .attr("fill", function(d, i) { return color(i); } )
      //this creates the actual SVG path using the associated data (pie) with the arc drawing function
      .attr("d", arc);

    // Add a legendLabel to each arc slice...
    arcs.append("svg:text")
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius + 50; // Set Outer Coordinate
        d.innerRadius = outerRadius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "Purple")
      .style("font", "bold 12px Arial")
      .text(function(d, i) { return dataSet[i].State; }); //get the label from our original data array

    // Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius; // Set Outer Coordinate
        d.innerRadius = outerRadius/2; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .style("fill", "White")
      .style("font", "bold 12px Arial")
      .text(function(d) { return d.data.count; });

    // Computes the angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }
