// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 10,
  padding: 20
};

var createEnemies = function(gameOptions){
  var enemies = _.range(0,gameOptions.nEnemies).map(function(element){
    return {
      id: element,
      x: Math.random()*gameOptions.width,
      y: Math.random()*gameOptions.height,
      radius: 10,
      oldX: 0,
      oldY: 0
    };
  });
  return enemies;
};

var svg = d3.select("body").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .append("g");

var enemyUpdate = function (data) {
  // DATA JOIN
  // Join new data with old elements, if any.
  var circleEnemy = svg.selectAll("circle.enemy")
      .data(data, function(d) { return d.id; });

  // ENTER
  // Create new elements as needed.
  circleEnemy.enter().append("circle")
      .attr("class", "enemy")
      .attr("r", "10")
      .attr('cx', function(d){return d.x})
      .attr('cy', function(d){return d.y});

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  circleEnemy.transition().duration(1000)
      .tween('collision', tweenCollisionCheck);

    shuffleEnemies(data);

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

var tweenCollisionCheck = function(d){
  var enemy = d3.select(this);

  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy')),
    r: parseFloat(enemy.attr('r'))
  };

  var endPos = {
    x: d.x,
    y: d.y
  };

  return function(t){

    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x)*t,
      y: startPos.y + (endPos.y - startPos.y)*t
    };
    var distance;
    distance = Math.sqrt((Math.pow((player.x - enemyNextPos.x),2)) + (Math.pow((player.y - enemyNextPos.y),2)));
    if ((player.radius + d.radius) > distance ) {
      console.log(distance, d.id, t);
      collision();
    }


    enemy.attr('cx', enemyNextPos.x);
    enemy.attr('cy', enemyNextPos.y);
  };

};

var shuffleEnemies = function(enemies){
  _.each(enemies, function(enemy, index){
    enemy.x = Math.random()*gameOptions.width;
    enemy.y = Math.random()*gameOptions.height;
  });
  return enemies;
};

var dragMove = function(d){
  d.x = d3.event.x;
  d.y = d3.event.y;
  d3.select(this)
    .attr('cx', d.x)
    .attr('cy', d.y);
    // collisionCheck(enemies,d)
};

var drag = d3.behavior.drag()
    .on('drag', dragMove);

var player = {
  id:'player',
  radius: 10,
  x: gameOptions.width / 2,
  y: gameOptions.height / 2
};

var enemies = createEnemies(gameOptions);
var watchout = function(){

  var circlePlayer = svg.selectAll('circle.player')
    .data([player])
    .enter().append('circle')
    .attr('class', 'player')
    .attr('fill', 'red')
    .attr("r", "10")
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y});

  d3.selectAll('circle.player').call(drag);
  enemyUpdate(enemies);

  setInterval(function(){
    enemyUpdate(enemies); // shuffleEnemies(enemies)
    scoreboard.currentScore++;
    d3.selectAll('div.scoreboard div')
    .select('span')
    .data([scoreboard.highScore,scoreboard.currentScore,scoreboard.collisions])
    .text(function(d){return d;});
  }, 1000);

};

watchout();



