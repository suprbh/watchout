// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 1,
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
      radius: 10,
      oldX: 0,
      oldY: 0
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

  // debugger;
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
  // startPosX = circleEnemy.attr("cx")
  // startPosY = circleEnemy.attr("cy")
  //debugger;
  circleEnemy.transition().duration(3000)
    // .attr("cx", function(d) {return d.x})
    // .attr("cy", function(d) {return d.y});
    // .tween('collision', function(endData){
    //   //interpolate x and y coordinates
    //   //invoke collisionCheck
    //   var enemy = {
    //     x: endData.x,
    //     y: endData.y
    //   };
    //   tweenCollisionCheck(enemy,player);
    // });
     .tween('collision', tweenCollisionCheck);
    //collisionCheck(data,player);
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
  debugger;
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
  // console.log('enemy', d.id);
  // console.log('start', startPos, 'end', endPos);
  // var counter = 0;
  // debugger;
  var i = d3.interpolate(startPos.x, endPos.x);
  var j = d3.interpolate(startPos.y, endPos.y);

  return function(t){
    debugger;
    console.log('enemy', d.id);
    console.log('startPos, endPos inside return fn', startPos, endPos);
    // counter++;
    // if (counter > 10) {
    //    debugger;
    // }

    var distance;
    distance = Math.sqrt((Math.pow((player.x - i(t)),2)) + (Math.pow((player.y - j(t)),2)));
    if ((player.radius + d.radius) > distance ) {
      console.log(distance);
      collision();
    }

    enemyNextPos = {
      x: i(t),
      y: j(t)
    };


    enemy.attr('cx', enemyNextPos.x);
    enemy.attr('cy', enemyNextPos.y);
  };

};

var collisionCheck = function(enemies,player){
  // debugger;
  var distance = 0;
  _.each(enemies,function(enemy){
    distance = Math.sqrt((Math.pow((player.x - enemy.x),2)) + (Math.pow((player.y - enemy.y),2)));
    if ((player.radius + enemy.radius) > distance ) {
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
    enemy.oldX = enemy.x;
    enemy.oldY = enemy.y;
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
    // collisionCheck(enemies,d)
};

var drag = d3.behavior.drag()
    .on('drag', dragMove);

var player = {
  id:'player',
  x:axes.x(50),
  y:axes.y(50),
  radius: 10
};

var enemies = createEnemies(gameOptions);
var watchout = function(){
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
  enemyUpdate(enemies);
  // setInterval(function(){
  //   // collisionCheck(enemies,player);
  // },10);
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



