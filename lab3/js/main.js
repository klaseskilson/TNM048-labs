var area1;
var map1;

d3.csv("data/data.csv", function (data) {
	// add {cluster: 0} to every data entry
	data = _.map(data, function (d) {
		return _.extend(d, { cluster: 0 });
	});
    area1 = new area(data);
    map1 = new map(data);
});
