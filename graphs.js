var  util = require('util')
  ,  _    = require('underscore')

/*
                  __           
 _   _____  _____/ /____  _  __
| | / / _ \/ ___/ __/ _ \| |/_/
| |/ /  __/ /  / /_/  __/>  <  
|___/\___/_/   \__/\___/_/|_|  
                               
*/

var Vertex = function(id, connectedTo) {
  this.id = id;
  this.connectedTo = {};
};

Vertex.prototype.addNeighbor = function(neighbor, weight) {
  this.connectedTo[neighbor.id] = weight;
};

Vertex.prototype.toString = function() {
  var _string = this.id + ' connected to '
    , connected = [];

  _.map(this.connectedTo, function(entry) {
    _string += " " + entry;
  });

  return _string;
};

Vertex.prototype.getConnections = function() {
  return _.keys(this.connectedTo);
};

Vertex.prototype.getId = function() {
  return this.id;
};

Vertex.prototype.getWeight = function(neighbor) {
  return this.connectedTo[neighbor];
};


/*                         __  
   ____ __________ _____  / /_ 
  / __ `/ ___/ __ `/ __ \/ __ \
 / /_/ / /  / /_/ / /_/ / / / /
 \__, /_/   \__,_/ .___/_/ /_/ 
/____/          /_/            
*/

var Graph = function() {
  this.vertList = {};
  this.numVertices = 0;
};

Graph.prototype.addVertex = function(key) {
  this.numVertices++;
  var newVertex = new Vertex(key);
  this.vertList[key] = newVertex;
  return newVertex;
};

Graph.prototype.getVertex = function(key) {
  return this.vertList[key];
};

Graph.prototype.contains = function(key) {
  return !!this.vertList[key];
};

Graph.prototype.addEdge = function(f, t, cost) {
  var nearestVert
  ,   cost = cost || 0;

  if (!this.contains(f)) {
    nearestVert = this.addVertex(f);
    //console.log(nearestVert);
  }

  if (!this.contains(t)) {
    nearestVert = this.addVertex(t);
    //console.log(nearestVert);
  }

  this.vertList[f].addNeighbor(this.vertList[t], cost);
};

Graph.prototype.getVertices = function() {
  var returnArray = [];
  for (var key in this.vertList) {
    returnArray.push(key);
  }
  return returnArray;
};


if (process.argv[2] === "1") {
  var g = new Graph();
  _.map([0, 1, 2, 3, 4, 5], function(num) {
    g.addVertex(num);
  });
  g.addEdge(0,1,5);
  g.addEdge(0,5,2);
  g.addEdge(1,2,4);
  g.addEdge(2,3,9);
  g.addEdge(3,4,7);
  g.addEdge(3,5,3);
  g.addEdge(4,0,1);
  g.addEdge(5,4,8);
  g.addEdge(5,2,1);

  console.log(">>   g.addEdge(0,1,5);");
  console.log(">>   g.addEdge(0,5,2);");
  console.log(">>   g.addEdge(1,2,4);");
  console.log(">>   g.addEdge(2,3,9);");
  console.log(">>   g.addEdge(3,4,7);");
  console.log(">>   g.addEdge(3,5,3);");
  console.log(">>   g.addEdge(4,0,1);");
  console.log(">>   g.addEdge(5,4,8);");
  console.log(">>   g.addEdge(5,2,1);");

  _.map(g.vertList, function(vert) {
    _.map(vert.getConnections(), function(v) {
      console.log(util.format("( %s , %s )", vert.getId(), v));
    });
  });
}
else if (process.argv[2] === "2") {

  var fs = require('fs')
    , lines
    , dictArray = [];

  lines = fs.readFileSync('./reduced-brit-a-z.txt', 'utf8').split('\n');
  _.map(lines, function(line) {
    dictArray.push(line.trim().toUpperCase());
  });

  function buildGraph(wordBank) {
    var d = {}
      , g = new Graph()
      , wLen
      , bucket;

    _.each(wordBank, function(word) {
      _.each(word.split(""), function(c, idx) {
        bucket = word.slice(0, idx) + '_' + word.slice((idx+1), word.length);
        if (!!d[bucket]) {
          d[bucket].push(word);
        }
        else {
          d[bucket] = [word];
        }
      });
    });

    _.each(Object.keys(d), function(_bucket) {
      _.each(d[_bucket], function(word1) {
        _.each(d[_bucket], function(word2) {
          if (word1 !== word2) {
            g.addEdge(word1, word2);
          }
        });
      });
    });

    return g;
  }

  var myGraph = buildGraph(dictArray);
}