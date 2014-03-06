define(['three', 'ConvexGeometry'], function (three, ConvexGeometry) {
  function Asteroid(scene) {
    this.scene = scene;
    
    points = [];
		for ( var i = 0; i < 30; i ++ ) {
			points.push(randomPointInSphere(24));
		}
    
    this.geometry = new THREE.ConvexGeometry( points );
    this.material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0x202020, specular: 0x303030, shininess: 10, shading: THREE.FlatShading } );
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		scene.add( this.mesh );
    
    function randomPointInSphere( radius ) {
      return new THREE.Vector3(
          ( Math.random() - 0.5 ) * 2 * radius,
          ( Math.random() - 0.5 ) * 2 * radius,
          ( Math.random() - 0.5 ) * 2 * radius
      );
	  }
  }
  
  Asteroid.generateField = function generateField(scene) {
    this.asteroids = [];
    var p = 0;
    
    for (var i = 0; i > -300; i -= 3) {
      var asteroid = new Asteroid(scene);
      var pos = Asteroid.getRandomPosition();
      
      asteroid.mesh.position.x = pos.x;
      asteroid.mesh.position.y = pos.y;
      asteroid.mesh.position.z = i;
      
      this.asteroids[p] = asteroid;
      p++;
    }
  };
  
  Asteroid.updateField = function updateField(scene) {
    for (var i = 0; i < this.asteroids.length; i++) {
      var asteroid = this.asteroids[i];
      asteroid.mesh.translateZ(1.0);
      
      if (asteroid.mesh.position.z > 0) {
        scene.remove(asteroid.mesh);
        asteroid = new Asteroid(scene);
        var pos = Asteroid.getRandomPosition();
        
        asteroid.mesh.position.x = pos.x;
        asteroid.mesh.position.y = pos.y;
        asteroid.mesh.position.z = -300;
        
        scene.add(asteroid.mesh);
        this.asteroids[i] = asteroid;
      }
    }
  };
  
  Asteroid.getRandomPosition = function getRandomPosition() {
    var minX = -100,
          maxX = 100,
          minY = -100,
          maxY = 100,
          minZ = -10,
          maxZ = -1000;
        
    var pos = {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
      z: Math.random() * (maxZ - minZ) + minZ
    };
    
    return pos;
  };
  
  return Asteroid;
});

