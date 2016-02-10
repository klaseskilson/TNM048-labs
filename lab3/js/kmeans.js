/**
 * k means algorithm
 * @param data    - the data to analyse
 * @param k       - number of clusters
 * @return {Object}
 */
function kmeans(data, k) {
  // set initial clustering position
  var clusters = [], indices = [];
  for (var i = 0; i < k; ++i) {
    var pos = random(0, data.length);
    // make sure clusters are unique
    while (indices.indexOf(pos) !== -1) {
      pos = random(0, data.length);
    }
    // console.log(pos, data[pos]);
    indices.push(pos);
    clusters.push(_.clone(data[pos]));
  }

  // assign cluster
  var assignCluster = function () {
    console.info('Assigning clusters...');
    _(data).map(function (d) {
      var nearestValue = Infinity,
          nearestIndex = -1;
      _(clusters).forEach(function(c, i) {
        // calculate distance for each cluster
        var dist = distance(c, d);
        if (dist < nearestValue) {
          nearestValue = dist;
          nearestIndex = i;
        }
      });
      // console.log(nearestIndex);
      d.cluster = nearestIndex;
      return d;
    });
    console.info('... done!');
  };
  assignCluster();

  // move cluster centroids
  var moveCentroids = function () {
    console.info('Moving centroids...');
    _.chain(data)
      .groupBy('cluster')
      .forEach(function(group, cluster) {
        // console.log(cluster, group);
        var groupSize = group.length;
        d3.keys(group[0]).forEach(function (key) {
          if (key === 'cluster') return;
          var add = function(memo, num) { return memo + num; };
          var sum = _.chain(group)
            .pluck(key)
            .map(parseFloat)
            // sum all the floats!
            .reduce(add, 0)
            .value();
          clusters[cluster][key] = sum / groupSize;
          // console.log(cluster, key, groupSize, sum, sum / groupSize);
        });
      });
    console.info('... done!');
  };
  moveCentroids();

  // calculate total error!
  var calculateError = function () {
    var totalError = 0;

    _.chain(data)
      .groupBy('cluster')
      .forEach(function(group, cluster) {
        var clusterError = 0;
        _(group).forEach(function (d) {
          clusterError += squaredDiffSum(d, clusters[cluster]);
        });
        // console.log(cluster, clusterError);
        totalError += clusterError;
      });

    return totalError;
  };

  var oldError = calculateError(),
      newError = oldError * 0.999999,
      oldData, oldClusters,
      attempts = 0;

  // reasign cluster until it no longer gets any better
  while (newError < oldError) {
    oldError = newError;
    oldData = _.map(data, _.clone);
    oldClusters = _.map(clusters, _.clone);
    assignCluster();
    moveCentroids();
    newError = calculateError();
    console.log('Reassignment', attempts, 'Old:', oldError, 'New:', newError);
    ++attempts;
  }
  // restore old values
  clusters = oldClusters;
  data = oldData;
  console.log('Restored old clusters!');

  return data;
}

/**
 * get random value between min and max
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * calculate euqledian distance between point a & b
 */
function distance(a, b) {
  return Math.sqrt(squaredDiffSum(a, b));
}

/**
 * calculate the individually squared sum difference
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function squaredDiffSum(a, b) {
  var valA = _.values(a),
      valB = _.values(b);
  var num = Math.max(valA.length, valB.length),
      tot = 0;
  for (var i = 0; i < num; ++i) {
    var p = parseFloat(valA[i]) || 0,
        q = parseFloat(valB[i]) || 0;
    tot += Math.pow(p - q, 2);
  }
  return tot;
}
