var  util = require('util')
  ,  _    = require('underscore');

var Connection = function(id, vertex, cost) {
  this.id = id;
  this.vertex = vertex;
  this.cost = cost || 0;
}

/*
                  __           
 _   _____  _____/ /____  _  __
| | / / _ \/ ___/ __/ _ \| |/_/
| |/ /  __/ /  / /_/  __/>  <  
|___/\___/_/   \__/\___/_/|_|  
                               
*/

var Vertex = function(id, connectedTo, color) {
  this.id          = id;
  this.connectedTo = {};
  // Container for any properties for this vertex.
  this.props       = {};
  this.props['color'] = color || 'white';
};

Vertex.prototype.addNeighbor = function(connection) {
  this.connectedTo[connection.id] = connection;
};

Vertex.prototype.getConnections = function() {
  return _.values(this.connectedTo);
};


Vertex.prototype.getId = function() {
  return this.id;
};

Vertex.prototype.getWeight = function(neighbor) {
  return this.connectedTo[JSON.stringify(neighbor)];
};

Vertex.prototype.getProp = function(property) {
  if (!_.has(this.props, property))
    return -1;
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
    , connection
    , cost = cost || 0;

  if (!this.contains(f)) {
    nearestVert = this.addVertex(f);
  }

  if (!this.contains(t)) {
    nearestVert = this.addVertex(t);
  }

  connection = new Connection(t, this.vertList[t], cost);
  this.vertList[f].addNeighbor(connection);
};

Graph.prototype.getVertices = function() {
  return this.vertList;
};

/*
.----..-.  .-..----..----.  .---. .-. .----..----. .----.
| {_   \ \/ / | {_  | {}  }/  ___}| |{ {__  | {_  { {__  
| {__  / /\ \ | {__ | .-. \\     }| |.-._} }| {__ .-._} }
`----'`-'  `-'`----'`-' `-' `---' `-'`----' `----'`----' 
*/

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

  _.each(g.getVertices(), function(vert) {
    _.each(vert.getConnections(), function(connectedVert) {
      console.log(util.format("Edge: ( %s , %s ), with cost %s",
                              vert.getId(),
                              connectedVert.vertex.getId(),
                              connectedVert.cost));
    });
  });
}
else if (process.argv[2] === "2") {

  var fs          = require('fs')
    , seedWord    = process.argv[4] || 'FOOL'
    , startWord   = process.argv[3] || 'SAGE'
    , bucketLists
    , seedVertex
    , startVertex 
    , g;

  if (seedWord.length !== startWord.length) {
    seedWord = 'FOOL';
    startWord = 'SAGE';
  }

  bucketLists  = buildBucketLists(buildDictArray());
  g            = buildBucketListsGraph(bucketLists);
  seedVertex   = g.getVertex(seedWord);
  startVertex  = g.getVertex(startWord);

  breadthFirstSearch(g, seedVertex);
  console.log(util.format("\nWord Ladder: %s to %s", startWord, seedWord));
  traverse(startVertex);
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

function breadthFirstSearch(g, start) {
  var queue = []
    , currentVert;

  start.setProp('distance', 0);
  start.setProp('prev', null);
  queue.push(start);
  while (queue.length > 0) {
    currentVert = queue.shift();
    _.each(currentVert.getConnections(), function(vert) {
      vert = vert.vertex;
      if (vert.getProp('color') === 'white') {
        vert.setProp('color', 'gray');
        vert.setProp('distance', + currentVert.getProp('distance') + 1);
        vert.setProp('prev', currentVert);
        queue.push(vert);
      }
    });
    currentVert.setProp('color', 'black');
  }
}

function traverse(vertex) {
  var curNode = vertex
    , output = "";
  while (!!curNode) {
    output += curNode.getId() + ' -> ';
    curNode = curNode.getProp('prev');
  }
  console.log(output.substring(0, output.length -4)+"\n");
}