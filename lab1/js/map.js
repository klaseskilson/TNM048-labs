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
    self.colors = {
        "Australia": "#1f78b4",
        "Austria": "#b2df8a",
        "Belgium": "#33a02c",
        "Canada": "#fb9a99",
        "Chile": "#e31a1c",
        "Czech Republic": "#fdbf6f",
        "Denmark": "#ff7f00",
        "Estonia": "#cab2d6",
        "Finland": "#6a3d9a",
        "France": "#ffff99",
        "Germany": "#b15928",
        "Greece": "#a6cee3",
        "Hungary": "#a50026",
        "Iceland": "#d73027",
        "Ireland": "#f46d43",
        "Israel": "#fdae61",
        "Italy": "#fee08b",
        "Japan": "#ffffbf",
        "Korea": "#d9ef8b",
        "Luxembourg": "#a6d96a",
        "Mexico": "#66bd63",
        "Netherlands": "#1a9850",
        "New Zealand": "#006837",
        "Norway": "#9e0142",
        "Poland": "#d53e4f",
        "Portugal": "#f46d43",
        "Slovak Republic": "#fdae61",
        "Slovenia": "#fee08b",
        "Spain": "#ffffbf",
        "Sweden": "#e6f598",
        "Switzerland": "#abdda4",
        "Turkey": "#66c2a5",
        "United Kingdom": "#3288bd",
        "United States": "#5e4fa2",
        "Brazil": "#a50026",
        "Russian Federation": "#d73027"
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
            .attr("style", function (d) {
                return "fill: " + self.colors[d.properties.name];
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

