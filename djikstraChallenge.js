var fs         = require('fs')
  , _          = require('underscore')
  , Graph      = require('./src/graph.js').Graph
  , Vertex     = require('./src/graph.js').Vertex
  , Connection = require('./src/graph.js').Connection;


var parseInput = function(path, callback) {
  var boardSize
    , boardDef
    , nodePath
    , boardArray = []
    , filePath   = path || './input.txt'
    , g          = new Graph()
    , alpha      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  fs.readFile(filePath, function (err, data) {
    if (err) console.log(err);

    boardDef  = String(data).split("\n");
    boardSize = +boardDef.splice(0, 1);
    nodePath  = boardDef.splice(-1, 1);
    _.each(boardDef, function(row, idx) {
      boardDef[idx] = row.split(',');
    });

    _.each(_.range(boardSize), function(row) {
      _.each(_.range(boardSize), function(col) {
        var rowName = alpha[row];
        var colName = alpha[col];
        var weight  = +boardDef[row][col];
        if (rowName !== colName && weight !== -1) {
          g.addEdge(rowName, colName, weight);
        }
      });
    });

    callback(g);
  });
}

function buildBoard(boardData, g) {
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

parseInput("./largeinput.txt", function(g) {
  _.each(g.vertList, function(vert) {
    console.log("\nId: ", vert.getId());
    _.each(vert.getConnections(), function(con) {
      console.log("Connected to", con.getId(), "with cost of ", con.cost);
    });
  });
});