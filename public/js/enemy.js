define(['three', 'movement', 'ship'], function (three, Movement, Ship) {
  function Enemy(galaxy) {
    this.galaxy = galaxy;
    this.scene = this.galaxy.scene;
    var enemy = this;
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
		loader.load('spaceship.obj', function (object) {
			enemy.scene.add(object);
			enemy.mesh = object;
			enemy.body = enemy.mesh;
			enemy.body.translateZ(4000);
		});
  }
  
  Movement.call(Enemy.prototype);
  
  Enemy.prototype.update = function () {
    this.updateMovement();
  };
  
  return Enemy;
});