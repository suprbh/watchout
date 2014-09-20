// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
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
      y: axes.y(Math.random()*100),
      radius: 10
    };
  });
  return enemies;
};

var player = {
  x: axes.x(50),
  y: axes.y(50)
};

// var scoreUpdate = d3.selectAll('div.scoreboard div')
//   .select('span')
//   .data([scoreboard.highScore,scoreboard.currentScore,scoreboard.collisions])
//   .text(function(d){return d;});

var svg = d3.select("body").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .append("g");

    // .attr("transform", "translate(32," + (height / 2) + ")");
// var playerUpdate = function (data) {
//   var circlePlayer = svg.selectAll('circle.player').data(data);

//   circlePlayer.enter().append('circle')
//     .attr('class', 'player')
//     .attr('fill', 'red')
//     .attr("r", "10")
//     .call(drag);

//   circlePlayer.attr('cy', function(d) { return d.y });
//   circlePlayer.attr('cx', function(d) { return d.x });
// }
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
  circleEnemy.transition().duration(2500)
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y})
    .tween('collision', function(endData){
      //interpolate x and y coordinates
      //invoke collisionCheck
      var enemy = {
        x: endData.x,
        y: endData.y
      };
      tweenCollisionCheck(enemy,player);
    });

  // EXIT
  // Remove old elements as needed.
  circleEnemy.exit().remove();
}

var scoreboard = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

var collision = function(){
  scoreboard.collisions++;
  if(scoreboard.currentScore > scoreboard.highScore) {
    scoreboard.highScore = scoreboard.currentScore;
  }
  scoreboard.currentScore = 0;
};

var tweenCollisionCheck = function(enemy,player){
  var distance;
  distance = Math.sqrt((Math.pow((player.x - enemy.x),2)) + (Math.pow((player.y - enemy.y),2)));
  if ( (player.radius + enemy.radius) > distance ) {
    console.log(distance);
    collision();
  }
};

var collisionCheck = function(enemies,player){
  var distance = 0;
  _.each(enemies,function(enemy){
    distance = Math.sqrt((Math.pow((player.x - enemy.x),2)) + (Math.pow((player.y - enemy.y),2)));
    if ( (player.radius + enemy.radius) > distance ) {
      collision();
    }
  })
};
// collission detection function
//  calculate distance between player and enemy (sqrt of (player.x^2 - enemy.x^2) + (player.y^2 - enemy.y^2))
//  if player radius + enemy radius is greater than distance, then COLLISON
//  else, nothing happens

var shuffleEnemies = function(enemies){
  _.each(enemies, function(enemy, index){
    enemy.x = axes.x(Math.random()*100);
    enemy.y = axes.y(Math.random()*100);
  });
  return enemies;
};

var dragMove = function(d){
  d.x = d3.event.x;
  d.y = d3.event.y;
  d3.select(this)
    .attr('cx', d.x)
    .attr('cy', d.y);
};

var drag = d3.behavior.drag()
    .on('drag', dragMove);

var player = {
  id:'player',
  x:axes.x(50),
  y:axes.y(50),
  radius: 10
};

var watchout = function(){
  var enemies = createEnemies(gameOptions);
  enemyUpdate(enemies);
// {"x": axes.x(50), "y": axes.y(50)}
  var circlePlayer = svg.selectAll('circle.player')
    .data([player])
    .enter().append('circle')
    .attr('class', 'player')
    .attr('fill', 'red')
    .attr("r", "10")
    .attr("cx", axes.x(50))
    .attr("cy", axes.y(50));

  d3.selectAll('circle.player').call(drag);
  setInterval(function(){
    collisionCheck(enemies,player);
  },10);
  setInterval(function(){
    enemyUpdate(shuffleEnemies(enemies));
    scoreboard.currentScore++;
    d3.selectAll('div.scoreboard div')
    .select('span')
    .data([scoreboard.highScore,scoreboard.currentScore,scoreboard.collisions])
    .text(function(d){return d;});
  }, 1500);

};

watchout();



