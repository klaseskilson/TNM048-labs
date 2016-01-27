function map(){

    var self = this;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var csvCountries = ["Australia", "Austria", "Belgium", "Canada", "Chile", "Czech Republic",
        "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
        "Iceland", "Ireland", "Israel", "Italy", "Japan", "Korea", "Luxembourg",
        "Mexico", "Netherlands", "New Zealand", "Norway", "Poland", "Portugal",
        "Slovak Republic", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey",
        "United Kingdom", "United States", "Brazil", "Russian Federation"];
    var colors = {};
    var colorScale = d3.scale.category20()
        .domain(0, csvCountries.length);
    // assing colors by index, save with name and value from colorScale
    _(csvCountries).each(function (country, index) {
        colors[country] = colorScale(index);
    });
    // provide common colorMethod for all graphs
    self.colors = function (d, i) {
        return colors[d.Country];
    };

    //initialize tooltip
    //...

    var projection = d3.geo.mercator()
        .center([50, 60])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.topojson", function(error, world) {
        console.log(world);
        var countries = topojson.feature(world, world.objects.countries).features;

        //load summary data
        //...

        draw(countries);

    });

    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);

        //initialize a color country object
        var cc = {};

        //...

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            .style({
                fill: function (d) {
                    return self.colors({ Country: d.properties.name });
                }
            })
            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout",  function(d) {
                //...
            })
            //selection
            .on("click",  function(d) {
                //...
            });

    }

    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;


        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    //method for selecting features of other components
    function selFeature(value){
        //...
    }
}

