function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2],
        position = pcDiv.offset();

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};


    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    // initialize tooltip
    var tooltip = d3.select("body").append("div")
        .classed("tt", true);

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {
        self.data = data;

        // Extract the list of self.dimensions and create a scale for each.
        var keys = _(d3.keys(data[0])).without('Country');
        x.domain(self.dimensions = keys.filter(function(d) {
            var vals = _(self.data).pluck(d).map(parseFloat);
            return [(y[d] = d3.scale.linear()
                // extract min/max values for this key
                .domain(d3.extent(vals))
                .range([height, 0]))];
        }));

        draw();
    });

    function draw(){
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path
            .data(self.data)
            .enter().append("path")
            .on("click", function (d) {
                sp1.selectDot(d.Country);
                self.selectLine(d.Country);
                map.selectCountry(d.Country);
            })
            .attr("d", path)
            .style({
                stroke: map.colors
            })
            .on("mousemove", function (d) {
                tooltip
                    .html(d.Country)
                    .transition()
                    .duration(100)
                    .style({
                        "left": d3.event.pageX + 10 + "px",
                        "top": d3.event.pageY + "px",
                        "opacity": 0.9
                    });
            })
            .on("mouseout", function () {
                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(self.dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            });

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(self.dimensions.map(function(p) {
            return [x(p), y[p](d[p])];
        }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush () {
        var actives = self.dimensions.filter(function (p) { return !y[p].brush.empty(); }),
            extents = actives.map(function (p) { return y[p].brush.extent(); });
        var selected = [];
        foreground.style("display", function(d) {
            var within = actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            });
            if (within) {
                selected.push(d.Country);
                return null;
            }
            return "none";
        });
        sp1.fadeDots(selected);
    }

    //method for selecting the pololyne from other components
    this.selectLine = function(value){
        foreground.each(function (d, i) {
            if (d.Country === value) {
                var path = d3.select(this);
                path.classed('selected', !path.classed('selected'));
            }
        });
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}
