var  util      = require('util')
  , Graph      = require('./src/graph.js').Graph
  , Vertex     = require('./src/graph.js').Vertex
  , Connection = require('./src/graph.js').Connection
  ,  _         = require('underscore');


/*
  8888b.  888888 .dP"Y8      dP""b8 88""Yb    db    88""Yb 88  88 
   8I  Yb 88__   `Ybo."     dP   `" 88__dP   dPYb   88__dP 88  88 
   8I  dY 88""   o.`Y8b     Yb  "88 88"Yb   dP__Yb  88"""  888888 
  8888Y"  88     8bodP'      YboodP 88  Yb dP""""Yb 88     88  88 
*/
function DFSGraph() {
  this.graph = new Graph();
  this.time     = 0;
}

DFSGraph.prototype.dfs = function() {
  _.each(this.graph.vertexList, function(aVertex) {
    aVertex.setProp('color', 'white');
    aVertex.setProp('prev', -1);
  });

  _.each(this.graph.vertexList, function(aVertex) {
    if (aVertex.getProp('color') === 'white') {
      dfsvisit(aVertex);
    }
  });
};

DFSGraph.prototype.dfsvisit = function(startVertex) {
  startVertex.setProp('color', 'white');
  self.time++;
  startVertex.setProp('discovery', self.time);
  _.each(startVertex.getConnections(), function(nextVertex) {
    if (nextVertex.getProp('color') === 'white') {
      nextVertex.setProp('prev', startVertex);
      dfsvisit(nextVertex);
    }
  });
  startVertex.setProp('color', 'black');
  self.time++;
  startVertex.setProp('finish', self.time);
};




/*
  88  88 888888 88     88""Yb 888888 88""Yb     8b    d8 888888 888888 88  88  dP"Yb  8888b.  .dP"Y8 
  88  88 88__   88     88__dP 88__   88__dP     88b  d88 88__     88   88  88 dP   Yb  8I  Yb `Ybo." 
  888888 88""   88  .o 88"""  88""   88"Yb      88YbdP88 88""     88   888888 Yb   dP  8I  dY o.`Y8b 
  88  88 888888 88ood8 88     888888 88  Yb     88 YY 88 888888   88   88  88  YbodP  8888Y"  8bodP' 
*/


/*
    __         _       __    __          __                  
   / /______  (_)___ _/ /_  / /______   / /_____  __  _______
  / //_/ __ \/ / __ `/ __ \/ __/ ___/  / __/ __ \/ / / / ___/
 / ,< / / / / / /_/ / / / / /_(__  )  / /_/ /_/ / /_/ / /    
/_/|_/_/ /_/_/\__, /_/ /_/\__/____/   \__/\____/\__,_/_/     
             /____/                                          
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

  return ktGraph;
}

/**
 * DFS Algorithm for the `Knight's Tour` problem.
 * @param  {Number}   n       Current depth in the search tree
 * @param  {Array}    path    List of vertices visited to this point
 * @param  {Vertex}   u       Vertex in the graph we wish to explore
 * @param  {Number}   limit   Number of nodes int he path
 * @return {Boolean}         `true` if a successful tour
 */
function knightTour(n, path, u, limit) {
  var nbrList
    , done = false
    , i    = 0;

  u.setProp('color', 'gray');
  path.push(u);
  if (n < limit) {
    nbrList = u.getConnections();
    for (i; i < nbrList.length && !done; i++) {
      if (nbrList[i].getProp('color') === 'white') {
        done = knightTour(n+1, path, nbrList[i], limit);
      }
    }
    if (!done) {
      path.shift();
      u.setProp('color', 'white');
    }
  }
  else {
    done = true;
  }

  return done;
}

function orderByAvail(node) {
  var resList = []
    , retList = []
    , c       = 0
    , w;

  _.each(node.getConnections(), function(v) {
    if (v.getProp('color') === 'white') {
      _.each(v.getConnections(), function(w) {
        if (w.getProp('color') === 'white') c++;
      });
      resList.push([c, v]);
    }
  });

  resList.sort(function(a, b) {
    if (a[0] > b[0])
      return 1;
    if (a[0] < b[0])
      return -1;
    return 0;
  });

  _.each(resList, function(entry) {
    retList.push(entry[0]);
  });

  return retList;
}


function posToNodeId(row, col, boardSize) {
  return row + (col * boardSize);
}

function genLegalMoves(x, y, boardSize) {
  var newMoves    = []
    , newX
    , newY
    , i
    , moveOffsets = [[-1,-2], [-1,2], [-2,-1], [-2,1],
                     [ 1,-2], [ 1,2], [ 2,-1], [ 2,1]];

  _.each(moveOffsets, function(coord) {
    newX = x + coord[0];
    newY = y + coord[1];
    if (legalCoord(newX, boardSize) && legalCoord(newY, boardSize)) {
      // Array instead of Tuple
      newMoves.push([newX, newY]);
    }
  });

  return newMoves;
}

function legalCoord(x, boardSize) {
  return x >= 0 && x < boardSize;
}


/*
                          __   __          __    __         
 _      ______  _________/ /  / /___ _____/ /___/ /__  _____
| | /| / / __ \/ ___/ __  /  / / __ `/ __  / __  / _ \/ ___/
| |/ |/ / /_/ / /  / /_/ /  / / /_/ / /_/ / /_/ /  __/ /    
|__/|__/\____/_/   \__,_/  /_/\__,_/\__,_/\__,_/\___/_/     
                                                            
*/

/**
 * Construct an array of words from a text file delimited with newlines.
 * @param  {String} filePath  Absolute/Relative path to the text file with the word bank.
 * @return {Array}            Array with all entries, in uppercase.
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





/*
  888888 Yb  dP 888888 88""Yb  dP""b8 88 .dP"Y8 888888 .dP"Y8 
  88__    YbdP  88__   88__dP dP   `" 88 `Ybo." 88__   `Ybo." 
  88""    dPYb  88""   88"Yb  Yb      88 o.`Y8b 88""   o.`Y8b 
  888888 dP  Yb 888888 88  Yb  YboodP 88 8bodP' 888888 8bodP' 
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
  var g = knightGraph(8);
}

