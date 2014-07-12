var  util      = require('util')
  ,  _         = require('underscore');



/*
   dP""b8  dP"Yb  88b 88 88b 88 888888  dP""b8 888888 88  dP"Yb  88b 88
  dP   `" dP   Yb 88Yb88 88Yb88 88__   dP   `"   88   88 dP   Yb 88Yb88
  Yb      Yb   dP 88 Y88 88 Y88 88""   Yb        88   88 Yb   dP 88 Y88
   YboodP  YbodP  88  Y8 88  Y8 888888  YboodP   88   88  YbodP  88  Y8
*/
var Connection = function(id, vertex, cost) {
  this.id     = id;
  this.vertex = vertex;
  this.cost   = cost || 0;
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
  if (typeof neighbor === "object" && typeof neighbor.getId !== "undefined") {
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
  this.properties  = {};
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

Graph.prototype.getProp = function(property) {
  return this.properties[property];
};

Graph.prototype.setProp = function(property, value) {
  this.properties[property] = value;
};

Graph.prototype.allNodesSet = function(property, value) {
  var traversed    = true
    , numNotSet    = 0
    , nodesVisited = []
    , property     = property || 'color'
    , value        = value    || 'gray';

  _.each(this.vertList, function(v) {
    if (v.getProp(property) !== value) {
      traversed = false;
    }
  });

  return traversed;
}

/*
  8888b.  888888 .dP"Y8      dP""b8 88""Yb    db    88""Yb 88  88
   8I  Yb 88__   `Ybo."     dP   `" 88__dP   dPYb   88__dP 88  88
   8I  dY 88""   o.`Y8b     Yb  "88 88"Yb   dP__Yb  88"""  888888
  8888Y"  88     8bodP'      YboodP 88  Yb dP""""Yb 88     88  88
*/
function DFSGraph() {
  this.graph = new Graph();
  this.time  = 0;
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

// Return the nodes in decreasing order of finish time
DFSGraph.prototype.getTopological = function() {
  var sortList = [];
  if (Object.keys(this.vertexList).length === 0)
    return sortList;

  _.each(this.vertexList, function(vertex) {
    sortList.push([vertex.getProp('finish'), vertex]);
  });

  sortList.sort(function(a, b) {
    if (a[0] > b[0])
      return 1;
    if (a[0] < b[0])
      return -1;
    return 0;
  });

  return sortList;
};


exports.Graph      = Graph;
exports.Vertex     = Vertex;
exports.Connection = Connection;
exports.DFSGraph   = DFSGraph;