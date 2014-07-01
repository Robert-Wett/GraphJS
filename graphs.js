/*
                  __           
 _   _____  _____/ /____  _  __
| | / / _ \/ ___/ __/ _ \| |/_/
| |/ /  __/ /  / /_/  __/>  <  
|___/\___/_/   \__/\___/_/|_|  
                               
*/

var vertex = function(id, connectedTo) {
  this.id = id;
  connectedTo = {};
};

vertex.prototype.addNeighbor = function(neighbor, weight) {
  this.connectedTo[neighbor] = weight;
};

vertex.prototype.toString = function() {
  return this.id + ' connected to ' + _.map(connectedTo, function(entry) { return entry.id; });
};

vertex.prototype.getConnections = function() {
  return Object.keys(this.connectedTo);
};

vertex.prototype.getId = function() {
  return self.id;
};

vertex.prototype.getWeight = function(neighbor) {
  return this.connectedTo[neighbor];
};


/*                         __  
   ____ __________ _____  / /_ 
  / __ `/ ___/ __ `/ __ \/ __ \
 / /_/ / /  / /_/ / /_/ / / / /
 \__, /_/   \__,_/ .___/_/ /_/ 
/____/          /_/            
*/

var graph = function() {
  this.vertList = {};
  this.numVertices = 0;
};

graph.prototype.addVertex = function(key) {
  this.numVertices++;
  var newVertex = new Vertex(key);
  this.vertList[key] = newVertex;
  return newVertex;
};

graph.prototype.getVertex = function(key) {
  return this.vertList[key];
};

graph.prototype.contains = function(vert) {
  return _.contains(vertList, vert);
};