var  util = require('util')
  ,  _    = require('underscore');

/*
                  __           
 _   _____  _____/ /____  _  __
| | / / _ \/ ___/ __/ _ \| |/_/
| |/ /  __/ /  / /_/  __/>  <  
|___/\___/_/   \__/\___/_/|_|  
                               
*/

var Vertex = function(id, connectedTo) {
  this.id          = id;
  this.connectedTo = {};
  // Container for any properties for this vertex.
  this.props       = {};
};

Vertex.prototype.addNeighborV1 = function(neighbor, weight) {
  this.connectedTo[neighbor.id] = weight;
};

Vertex.prototype.addNeighbor = function(neighbor, weight) {
  this.connectedTo[neighbor] = weight;
};

Vertex.prototype.toString = function() {
  var _string   = this.id + ' connected to '
    , connected = [];

  _.map(this.connectedTo, function(entry) {
    _string += " " + entry;
  });

  return _string;
};

Vertex.prototype.getConnectionsV1 = function() {
  return _.keys(this.connectedTo);
  //return this.connectedTo;
};

Vertex.prototype.getConnections = function() {
  return this.connectedTo;
};

Vertex.prototype.getId = function() {
  return this.id;
};

Vertex.prototype.getWeight = function(neighbor) {
  return this.connectedTo[neighbor];
};

Vertex.prototype.getProp = function(property) {
  return this.props[property];
};

Vertex.prototype.setProp = function(property, value) {
  if (!property)
    return;
  this.props[property] = value;
};


/*                         __  
   ____ __________ _____  / /_ 
  / __ `/ ___/ __ `/ __ \/ __ \
 / /_/ / /  / /_/ / /_/ / / / /
 \__, /_/   \__,_/ .___/_/ /_/ 
/____/          /_/            
*/

var Graph = function() {
  this.vertList    = {};
  this.numVertices = 0;
};

Graph.prototype.addVertex = function(key) {
  var newVertex      = new Vertex(key);
  this.vertList[key] = newVertex;
  this.numVertices++;
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
  }

  if (!this.contains(t)) {
    nearestVert = this.addVertex(t);
  }

  this.vertList[f].addNeighbor(this.vertList[t], cost);
};

Graph.prototype.getVerticesV1 = function() {
  return _.keys(this.vertList);
};

Graph.prototype.getVertices = function() {
  return this.vertList;
};


function breadthFirstSearch(g, start) {
  var queue = []
    , currentVert;

  start.setProp('distance', 0);
  start.setProp('prev', null);
  queue.push(start);
  while (queue.length > 0) {
    currentVert = queue.shift();
    //todo
  }
}

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

  console.log(">> g.addEdge(0,1,5);");
  console.log(">> g.addEdge(0,5,2);");
  console.log(">> g.addEdge(1,2,4);");
  console.log(">> g.addEdge(2,3,9);");
  console.log(">> g.addEdge(3,4,7);");
  console.log(">> g.addEdge(3,5,3);");
  console.log(">> g.addEdge(4,0,1);");
  console.log(">> g.addEdge(5,4,8);");
  console.log(">> g.addEdge(5,2,1);");

  _.map(g.vertList, function(vert) {
    _.map(vert.getConnections(), function(v, k) {
      console.log(util.format("( %s , %s )", vert.getId(), v));
    });
  });
}
else if (process.argv[2] === "2") {

  var fs = require('fs')
    , bucketLists
    , g;

  bucketLists = buildBucketLists(buildDictArray());
  g           = buildBucketListsGraph(bucketLists);
}

/*
    __         __                                  __  __              __    
   / /_  ___  / /___  ___  _____   ____ ___  ___  / /_/ /_  ____  ____/ /____
  / __ \/ _ \/ / __ \/ _ \/ ___/  / __ `__ \/ _ \/ __/ __ \/ __ \/ __  / ___/
 / / / /  __/ / /_/ /  __/ /     / / / / / /  __/ /_/ / / / /_/ / /_/ (__  ) 
/_/ /_/\___/_/ .___/\___/_/     /_/ /_/ /_/\___/\__/_/ /_/\____/\__,_/____/  
            /_/                                                              
*/

/**
 * Construct an array of words from a text file delimited with newlines.
 * @param  {[String]} filePath [Absolute/Relative path to the text file with the word bank.]
 * @return {[Array]}           [Array with all entries, in uppercase]
 */
function buildDictArray(filePath) {
  var dictArray = []
    , filePath  = filePath || './reduced-brit-a-z.txt'
    , lines;

  lines = fs.readFileSync(filePath, 'utf8').split('\n');
  _.map(lines, function(line) {
    dictArray.push(line.trim().toUpperCase());
  });

  return dictArray;
}

function buildBucketLists(wordBank) {
  var d = {}
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

  return d;
}

function buildBucketListsGraph(bucketList) {
  var g = new Graph();

  _.each(Object.keys(bucketList), function(bucket) {
    _.each(bucketList[bucket], function(word1) {
      _.each(bucketList[bucket], function(word2) {
        if (word1 !== word2) {
          g.addEdge(word1, word2);
        }
      });
    });
  });

  return g;
}