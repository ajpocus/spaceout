define(['three', 'movement', 'ship'], function (three, Movement, Ship) {
  function Enemy(galaxy) {
    this.galaxy = galaxy;
    this.scene = this.galaxy.scene;
    var enemy = this;
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
		loader.load('spaceship.obj', function (object) {
		  object.scale.set(3, 3, 3);
			enemy.scene.add(object);
			enemy.body = object;
			enemy.mesh = object;
			enemy.body.translateZ(4000);
		});
  }
  
  Movement.call(Enemy.prototype);
  
  Enemy.prototype.update = function () {
    var enemy = this;
    var player = enemy.galaxy.controls.body;
    var playerPos = player.position;
    
    enemy.body.lookAt(playerPos);
    var zDiff = Math.abs(enemy.position.z - playerPos.z);
    
    if (zDiff > 100) {
      enemy.body.translateZ(10);
    }
    
    this.updateMovement();
  };
  
  return Enemy;
});
