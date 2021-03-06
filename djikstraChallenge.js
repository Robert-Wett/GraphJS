var fs         = require('fs')
  , _          = require('underscore')
  , Graph      = require('./src/graph.js').Graph
  , Vertex     = require('./src/graph.js').Vertex
  , Connection = require('./src/graph.js').Connection
  , BinaryHeap = require("./src/binheap.js").BinaryHeap;

var buildGraphFromInput = function(path, callback) {
  var filePath = path || './input.txt'
    , g        = new Graph()
    , alpha    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    , boardSize
    , boardDef
    , nodePath
    , rowName
    , colName
    , weight;

  fs.readFile(filePath, function (err, data) {
    if (err) console.log(err);

    boardDef  =  String(data).split("\n");
    boardSize = +boardDef.splice(0, 1);
    nodePath  =  boardDef.splice(-1, 1);

    // Add the start/end nodes as properties to the graph
    g.setProp('start', nodePath[0]);
    g.setProp('end',   nodePath[1]);

    _.each(boardDef, function(row, idx) {
      boardDef[idx] = row.split(',');
    });

    _.each(_.range(boardSize), function(row) {
      _.each(_.range(boardSize), function(col) {
        rowName =  alpha[row];
        colName =  alpha[col];
        weight  = +boardDef[row][col];

        if (rowName !== colName && weight !== -1) {
          g.addEdge(rowName, colName, weight);
        }
      });
    });

    callback(g);
  });
}

function djikstra(graph, start) {
  var currentVert
    , newDist;

  var pq = new BinHeap(function(element) {
    return element.getProp('cost');
  });

  // Build the heap
  _.each(graph.vertList, function(vert) {
    pq.push(vert);
  });

  while (pq.size() > 0) {
    currentVert = pq.pop();
    start.setProp('distance', 0);

    _.each(currentVert.getConnections(), function(nextVert) {
      newDist = currentVert.getProp('distance') + currentVert.getProp('cost');
      if (newDist < nextVert.getProp('distance')) {
        nextVert.setProp('cost', newDist);
        nextVert.setProp('prev', currentVert);
      }
    });
  }
}


buildGraphFromInput("./data/largeinput.txt", function(g) {
  djikstra(g, g.getVertex(g.getProp('start')));
});

/*
// Non-callback implementation
function parseInputText(path) {
  var graph;
  path = path || './input.txt';

  fs.readFile(path, function(err, data) {
    if (err) throw new Error(err);

    graph = buildGraph(data);
  });
}

function buildGraph(boardData, g) {
  var  boardDef  = String(boardData).split("\n")
    ,  boardSize = +boardDef.splice(0, 1)
    ,  nodePath  = boardDef.splice(-1, 1)
    ,  alpha     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ,  graph     = g || new Graph()
    ,  rowName
    ,  colName
    ,  weight;

  _.each(boardDef, function(row, idx) {
    boardDef[idx] = row.split(',');
  });

  _.each(_.range(boardSize), function(row) {
    _.each(_.range(boardSize), function(col) {
      rowName = alpha[row];
      colName = alpha[col];
      weight  = +boardDef[row][col];
      if (rowName !== colName && weight !== -1) {
        graph.addEdge(rowName, colName, weight);
      }
    });
  });

  return graph;
}
*/