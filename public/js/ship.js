define(['three', 'OBJLoader'], function (three, OBJLoader) {
  function Ship(scene) {
    this.scene = scene;
    this.mass = 5e4;  // kgs
    this.velocity = 0;
    var ship = this;
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
		loader.load('spaceship.obj', function (object) {
			scene.add(object);
			ship.mesh = object;
			
			scene.camera.add(object);
      object.position.set(0, -2, -12);
		});
  }
  
  Ship.prototype.update = function () {
    var controls = this.scene.controls,
      pitchObject = controls.pitchObject,
      yawObject = controls.yawObject;
    
    // gradually degrade the velocity of the ship
    if (this.velocity > 0) {
      this.velocity -= 0.005;
    }
    
    // this.mesh.rotation.z = yawObject.rotation.y;
  };
  
  return Ship;
});
