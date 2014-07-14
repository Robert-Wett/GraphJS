var util       = require('util')
  , Graph      = require('./src/graph.js').Graph
  , Vertex     = require('./src/graph.js').Vertex
  , Connection = require('./src/graph.js').Connection
  , BinaryHeap = require('./src/binheap.js').BinaryHeap
  ,  _         = require('underscore');



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
 * @param  {Number}   limit   Number of nodes in the path
 * @return {Boolean}         `true` if a successful tour
 */
function knightTour(n, path, u, limit) {
  var nbrList
    , done
    , i = 0;

  u.setProp('color', 'gray');
  path.push(u);
  if (u.getProp('visited') === -1) {
    u.setProp('visited', 1);
  } else {
    u.setProp('visited', u.getProp('visited') + 1);
  }

  console.log(util.format("%s Checking out Node %s",
                          Array(n+1).join(">"),
                          u.getId()));
  if (n < limit) {
    done = false;
    nbrList = orderByAvail(u);
    for (i; i < nbrList.length && !done; i++) {
      if (nbrList[i].getProp('color') === 'white') {
        done = knightTour(n+1, path, nbrList[i], limit);
      }
    }
    if (!done) {
      path.pop();
      u.setProp('color', 'white');
    }
  }
  else {
    done = true;
  }

  return done;
}

function knightTourBrute(n, path, u, limit) {
  var nbrList
    , done
    , i = 0;

  u.setProp('color', 'gray');
  path.push(u);
  if (u.getProp('visited') === -1) {
    u.setProp('visited', 1);
  } else {
    u.setProp('visited', u.getProp('visited') + 1);
  }

  console.log(util.format("%s Checking out Node %s",
                          Array(n+1).join(">"),
                          u.getId()));
  if (n < limit) {
    done = false;
    /**
     * This is the single difference between the brute force
     * method and the normal method, which uses Warnsdorff’s Algo
     * to pick nodes that have the least amount of edges first.
     */
    //nbrList = orderByAvail(u);
    nbrList = u.getConnections();
    for (i; i < nbrList.length && !done; i++) {
      if (nbrList[i].getProp('color') === 'white') {
        done = knightTourBrute(n+1, path, nbrList[i], limit);
      }
    }
    if (!done) {
      path.pop();
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
    , c
    , w;

  _.each(node.getConnections(), function(v) {
    if (v.getProp('color') === 'white') {
      c = 0;
      _.each(v.getConnections(), function(w) {
        if (w.getProp('color') === 'white')
          c++;
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
    retList.push(entry[1]);
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
 * @param  {String} filePath  Absolute/Relative path to the text file with the
 *                            word bank.
 * @return {Array}            Array with all entries, in uppercase.
 */
function buildDictArray(filePath) {
  var dictArray = []
    , filePath  = filePath || './data/reduced-brit-a-z.txt'
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

  bucketLists = buildBucketLists(buildDictArray());
  blGraph     = buildBucketListsGraph(bucketLists);
  seedVertex  = blGraph.getVertex(seedWord);
  startVertex = blGraph.getVertex(startWord);

  breadthFirstSearch(blGraph, seedVertex);
  console.log(util.format("\nWord Ladder: %s to %s", startWord, seedWord));
  traverse(startVertex);
}
else if (_.contains(["3", "dfs"], process.argv[2])) {
  /**
   * Changing this so that we can pass an object with
   * params defined so we don't have to worry about ordinal stuffs
   *
   * Example CLI:
   * <code>node graphs.js 3 '{"search":"smart", "size":"8", "limit":"63", "start":"4"}'</code>
   * <code>node graphs.js 3 '{"search":"brute", "size":"4"}'</code>
   * <code>node graphs.js dfs '{"search":"smart", "size":"10"}'</code>
   * <code>node graphs.js dfs '{"search":"brute", "size":"6"}'</code>
   */
  var args        = JSON.parse(process.argv[3] || '{}')
    , searchType  = args.search || "smart"
    , boardSize   = args.size   || 8
    , limit       = args.limit  || (boardSize * boardSize) - 1
    , startVertex = args.start  || 0
    , testSwitch  = args.test   || false
    , visits      = 0
    , g           = knightGraph(boardSize);

  if (searchType === "brute") {
    knightTourBrute(0, [], g.getVertex(startVertex), limit);
  }
  else {
    knightTour(0, [], g.getVertex(startVertex), limit);
  }

  _.each(g.vertList, function(vertex) {
    console.log(util.format("Vertex (%s) was visited %s times",
                            vertex.getId(),
                            vertex.getProp('visited')));
    visits += vertex.getProp('visited');
  });

  console.log(util.format("There were a total of %s moves taken", visits));
  if (g.allNodesSet('color', 'gray')) {
    console.log("Successfully traversed");
  } else {
    console.log("Limit was reached before full traversal!");
  }
}
/*
from pythonds.graphs import PriorityQueue, Graph, Vertex
def dijkstra(aGraph,start):
    pq = PriorityQueue()
    start.setDistance(0)
    pq.buildHeap([(v.getDistance(),v) for v in aGraph])
    while not pq.isEmpty():
        currentVert = pq.delMin()
        for nextVert in currentVert.getConnections():
            newDist = currentVert.getDistance() \
                    + currentVert.getWeight(nextVert)
            if newDist < nextVert.getDistance():
                nextVert.setDistance( newDist )
                nextVert.setPred(currentVert)
                pq.decreaseKey(nextVert,newDist)
*/
else {

}




































