// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 10,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var createEnemies = function(gameOptions){
  var enemies = _.range(0,gameOptions.nEnemies).map(function(element){
    return {
      id: element,
      x: axes.x(Math.random()*100),
      y: axes.y(Math.random()*100)
    };
  });
  return enemies;
};

var svg = d3.select("body").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .append("g");
    // .attr("transform", "translate(32," + (height / 2) + ")");

function update(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var circleEnemy = svg.selectAll("circle.enemy")
      .data(data, function(d) { return d.id; });

  // ENTER
  // Create new elements as needed.
  circleEnemy.enter().append("circle")
      .attr("class", "enemy")
      .attr("r", "10");

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  circleEnemy.attr("cx", function(d) {return d.x});
  circleEnemy.attr("cy", function(d) {return d.y});


  // EXIT
  // Remove old elements as needed.
  circleEnemy.exit().remove();
}


var shuffleEnemies = function(enemies){
  _.each(enemies, function(enemy, index){
    enemy.x = axes.x(Math.random()*100);
    enemy.y = axes.y(Math.random()*100);
  });
  return enemies;
};

var watchout = function(){
  var enemies = createEnemies(gameOptions);
  update(enemies);

  setInterval(function(){
    update(shuffleEnemies(enemies));
  }, 1500);

};

watchout();



