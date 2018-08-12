// D3 Scatterplot Assignment

// Define SVG area dimensions
var svgWidth = 600;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 45,
  left: 90
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  healthData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.percentPoorHealth = +data.percentPoorHealth;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.obesity)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(healthData, d => d.percentPoorHealth)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
   var circlesGroup = chartGroup.selectAll(null)
   .data(healthData)
   .enter()
   .append("g")

   circlesGroup.append("circle")
   .attr("cx", d => xLinearScale(d.obesity))
   .attr("cy", d => yLinearScale(d.percentPoorHealth))
   .attr("r", "12")
   .attr("fill", "green")
   .attr("opacity", ".5")
   
   circlesGroup.append("text")
    .text(function(d) { return d.state; })
    .attr("x", d => xLinearScale(d.obesity)-10)
    .attr("y", d => yLinearScale(d.percentPoorHealth)+4)
    .attr("font-size", 11)
    .attr("fill","white")
    ;

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([70, -20])
    .style("background-color", "lightsteelblue")   
    .html(function(d) {
      return (`${d.state}<br>${d.percentPoorHealth}% Reported Poor Health<br>${d.obesity}% Obesity`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2) - 20)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poor Health (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height - margin.top + 65})`)
    .attr("class", "axisText")
    .text("Obesity (%)");
});


