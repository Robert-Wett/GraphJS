var  util = require('util')
  ,  _    = require('underscore');


/*
   dP""b8  dP"Yb  88b 88 88b 88 888888  dP""b8 888888 88  dP"Yb  88b 88 
  dP   `" dP   Yb 88Yb88 88Yb88 88__   dP   `"   88   88 dP   Yb 88Yb88 
  Yb      Yb   dP 88 Y88 88 Y88 88""   Yb        88   88 Yb   dP 88 Y88 
   YboodP  YbodP  88  Y8 88  Y8 888888  YboodP   88   88  YbodP  88  Y8 
*/

var Connection = function(id, vertex, cost) {
  this.id = id;
  this.vertex = vertex;
  this.cost = cost || 0;
};

/**
 * These are short-cuts to the connection's vertex's class methods.
 * Has to be a better way to do this...
 */
Connection.prototype.getWeight = function(neighbor) {
  return this.vertex.getWeight(neighbor);
};

Connection.prototype.getId = function() {
  return this.vertex.getId();
};

Connection.prototype.getConnections = function() {
  return _.values(this.vertex.connectedTo);
};

Connection.prototype.getProp = function(property) {
  if (!_.has(this.vertex.props, property))
    return -1;
  return this.vertex.props[property];
};

Connection.prototype.setProp = function(property, value) {
  if (!property)
    return;
  this.vertex.props[property] = value;
};


/*
  Yb    dP 888888 88""Yb 888888 888888 Yb  dP 
   Yb  dP  88__   88__dP   88   88__    YbdP  
    YbdP   88""   88"Yb    88   88""    dPYb  
     YP    888888 88  Yb   88   888888 dP  Yb 
*/

var Vertex = function(id, connectedTo, color) {
  this.id          = id;
  this.connectedTo = {};
  // Container for any properties for this vertex.
  this.props       = {};
  // Default the `color` property to `white` to denote that the
  // node was not traversed in any way.
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
  // a Vertex object was passed
  if (typeof neighbor === "object") {
    return this.connectedTo[neighbor.getId()];
  }

  // The ID was passed
  if (typeof neighbor === "number") {
    return this.connectedTo[neighbor];
  }

  // ERR
  return -1;
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



/*
   dP""b8 88""Yb    db    88""Yb 88  88 
  dP   `" 88__dP   dPYb   88__dP 88  88 
  Yb  "88 88"Yb   dP__Yb  88"""  888888 
   YboodP 88  Yb dP""""Yb 88     88  88 
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
  888888 Yb  dP 888888 88""Yb  dP""b8 88 .dP"Y8 888888 .dP"Y8 
  88__    YbdP  88__   88__dP dP   `" 88 `Ybo." 88__   `Ybo." 
  88""    dPYb  88""   88"Yb  Yb      88 o.`Y8b 88""   o.`Y8b 
  888888 dP  Yb 888888 88  Yb  YboodP 88 8bodP' 888888 8bodP' 
*/

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
    _.each(vert.getConnections(), function(connection) {
      console.log(util.format("%s ~> %s // weight: %s",
                              vert.getId(),
                              connection.getId(),
                              connection.cost));
    });
  });
}
else if (_.contains(["2", "bfs"], process.argv[2])) {

  var fs          = require('fs')
    , seedWord    = process.argv[4] || 'FOOL'
    , startWord   = process.argv[3] || 'SAGE'
    , bucketLists
    , seedVertex
    , startVertex
    , blGraph;

  if (seedWord.length !== startWord.length) {
    seedWord  = 'FOOL';
    startWord = 'SAGE';
  }
  else {
    seedWord  = seedWord.toUpperCase();
    startWord = startWord.toUpperCase();
  }

  bucketLists  = buildBucketLists(buildDictArray());
  blGraph      = buildBucketListsGraph(bucketLists);
  seedVertex   = blGraph.getVertex(seedWord);
  startVertex  = blGraph.getVertex(startWord);

  breadthFirstSearch(blGraph, seedVertex);
  console.log(util.format("\nWord Ladder: %s to %s", startWord, seedWord));
  traverse(startVertex);
}
else if (_.contains(["3", "dfs"], process.argv[2])) {
  console.log("Welcome to flavor country.");
}


/*
  88  88 888888 88     88""Yb 888888 88""Yb     8b    d8 888888 888888 88  88  dP"Yb  8888b.  .dP"Y8 
  88  88 88__   88     88__dP 88__   88__dP     88b  d88 88__     88   88  88 dP   Yb  8I  Yb `Ybo." 
  888888 88""   88  .o 88"""  88""   88"Yb      88YbdP88 88""     88   888888 Yb   dP  8I  dY o.`Y8b 
  88  88 888888 88ood8 88     888888 88  Yb     88 YY 88 888888   88   88  88  YbodP  8888Y"  8bodP' 
*/

function knightGraph(boardSize) {
  var newPositions
    , nodeId
    , nid;

  ktGraph = new Graph();
  _.each(_.range(boardSize), function(row) {
    _.each(_.range(boardSize), function(col) {
      nodeId       = posToNodeId(row, col, boardSize);
      newPositions = genLegalMoves(row, col, boardSize);
      _.each(newPositions, function(pos) {
        nid = posToNodeId(pos[0], pos[1], boardSize);
        ktGraph.addEdge(nodeId, nid);
      });
    });
  });

}

function posToNodeId(row, col, boardSize) {
  // TODO
}

function genLegalMoves(x, y, boardSize) {
  // TODO
}

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