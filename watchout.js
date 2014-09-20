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

var player = {
  x: axes.x(50),
  y: axes.y(50)
};

var svg = d3.select("body").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .append("g");

    // .attr("transform", "translate(32," + (height / 2) + ")");
var playerUpdate = function (data) {
  var circlePlayer = svg.selectAll('circle.player').data(data);

  circlePlayer.enter().append('circle')
    .attr('class', 'player')
    .attr('fill', 'red')
    .attr("r", "10")
    .call(drag);

  circlePlayer.attr('cy', function(d) { return d.y });
  circlePlayer.attr('cx', function(d) { return d.x });
}
var enemyUpdate = function (data) {

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
  // var drag = d3.behavior.drag()
  //     on.('drag',function(d, i){
  //     player.x = d3.event.x;
  //     player.y = d3.event.y;
  //     console.log("watchout!",player.x, player.y);
  //     playerUpdate(player);
    // }
// var drag = d3.behavior.drag()
//     .on('drag',function(d, i)
//     debugger;
//     console.log("d",d);
//     d.x = d3.event.dx;
//     d.y = d3.event.dy;
//     // d.x = d3.mouse(this)[0];
//     // d.y = d3.mouse(this)[1]; // is dy right?

//     d3.select(this).attr('cy', function(d) { return d.y });
//     d3.select(this).attr('cx', function(d) { return d.x });
//     console.log("watchout!",d.x, d.y);
//   });
//
var dragMove = function(){
  console.log('here');
  debugger;
  console.log(this);
  //d.x += d3.event.dx;
  //d.y += d3.event.dy;
  // d3.select(this)
  //   .attr('cx', d.x)
  //   .attr('cy', d.y);
};

var drag = d3.behavior.drag()
    .on('drag', dragMove);

// var player = {
//   id:'player',
//   x:axes.x(50),
//   y:axes.y(50)
// };

var watchout = function(){
  var enemies = createEnemies(gameOptions);
  enemyUpdate(enemies);
// {"x": axes.x(50), "y": axes.y(50)}
  var circlePlayer = svg.selectAll('circle.player')
    .data([{"x":50, "y":50}])
    .enter().append('circle')
    .attr('class', 'player')
    .attr('fill', 'red')
    .attr("r", "10")
    .attr("cx", axes.x(50))
    .attr("cy", axes.y(50));

  d3.selectAll('circle.player').call(drag);

  // playerUpdate(player);
  setInterval(function(){
    enemyUpdate(shuffleEnemies(enemies));
  }, 1500);

};

watchout();



