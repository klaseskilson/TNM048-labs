function map(data) {

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    //Sets the colormap
    var colors = d3.scale.category20().domain(0, 4);

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");
    var points;

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = { type: "FeatureCollection", features: geoFormat(data) };

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    // filter functions that should return true if given datum is within range
    var filters = {
        magnitude: function () { return true; },
        time: function () { return true; },
        filter: function () {
            filteredData = [];
            points.each(function (d) {
                var hide = !filters.magnitude(d) || !filters.time(d);
                d3.select(this).classed('hidden', hide);
                if (!hide) {
                    filteredData.push(d);
                }
            });
        }
    };
    // the filtered data
    var filterdData = data;

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            data.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [d.lon, d.lat]
                },
                properties: d,
            });
        });
        return data;
    }

    //Draws the map and the points
    function draw (countries) {
        //draw map
        var country = g.selectAll(".country").data(countries)
            .enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .style('stroke-width', 1)
            .style("fill", "lightgray")
            .style("stroke", "white");

        //draw point
        points = g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .classed("point", true)
            .attr("d", path);
    }

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        $('#slider-value').text(value);
        filters.magnitude = function (d) {
            return parseFloat(d.properties.mag) >= parseFloat(value);
        };
        filters.filter();
    }

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        if (value[0].getTime() === value[1].getTime()) {
            filters.time = function () {
                return true;
            };
        } else {
            filters.time = function (d) {
                var time = format.parse(d.properties.time);
                return time > value[0] && time < value[1];
            };
        }
        filters.filter();
    };

    //Calls k-means function and changes the color of the points
    this.cluster = function () {
        var k = $('#k').val();
        colors.domain(0, k);
        // reset colors
        _(data).map(function (entry) {
            entry.cluster = null;
            return entry;
        });
        var cluster = kmeans(filteredData, k, k * 10);
        // assign new colors
        points.each(function (d) {
            d3.select(this).style("fill", colors(d.properties.cluster));
        });
    };

    //Zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value.place + " / Depth: " + value.depth +
            " / Magnitude: " + value.mag + "&nbsp;";
    }

}
