function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...

    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // define what is on each axis and radius
    var onXAxis = 'Employment rate',
        onYAxis = 'Water quality',
        radius = 'Life satisfaction';

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;

        //define the domain of the scatter plot axes
        // pluck data
        var xData = _(self.data).pluck(onXAxis).map(parseFloat),
            yData = _(self.data).pluck(onYAxis).map(parseFloat);
        // get min/max values
        var xMin = _(xData).min() - 10,
            xMax = _(xData).max() + 10,
            yMin = _(yData).min() - 10,
            yMax = _(yData).max() + 10;
        // set domain
        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);

        draw();
    });

    function draw()
    {
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            // append title and move it
            .text(onXAxis)
            .attr("text-anchor", "middle")
            .attr("x", width / 2);

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            // append title and move it
            .text(onYAxis)
            .attr("text-anchor", "middle")
            // since it is rotated, change the x value and make it negative
            .attr("x", - height / 2);

        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            .attr("cx", function (d) {
                return x(d[onXAxis]);
            })
            .attr("cy", function (d) {
                return y(d[onYAxis]);
            })
            .attr("r", function (d) {
                return 5;
                // return d[radius];
            })
            .style({
                fill: map.colors,
                stroke: map.colors
            })
            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout", function(d) {
                //...
            })
            .on("click",  function(d) {
                //...
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




