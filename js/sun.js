define(['three'], function (three) {
  function Sun(scene) {
    this.scene = scene;
    this.mass = 1.9891e9;  // measured in kgs
    this.G = 6.67e-11;
    
    this.geometry = new THREE.SphereGeometry(60, 32, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position = this.mesh.position;
    this.scene.add(pointLight);
    
    this.scene.add(this.mesh);
  }
  
  Sun.prototype.updateGravity = function updateGravity(object, ship) {
    var sun = this;
    
    ship.mass = 5000;
    if (!ship.velocity) { ship.velocity = 0; }

    var mesh = sun.mesh;
    var mesh2 = ship.mesh;
    var x2 = Math.pow((mesh.position.x - mesh2.position.x), 2);
    var y2 = Math.pow((mesh.position.y - mesh2.position.y), 2);
    var z2 = Math.pow((mesh.position.z - mesh2.position.z), 2);
    var dist2 = Math.sqrt(x2 + y2 + z2);
    var force = (sun.G * sun.mass * ship.mass) / dist2;
    
    var acceleration = force / ship.mass;
    
    if (ship.velocity < 400) {    
      ship.velocity += acceleration;
    }
    
    var sunVector = new THREE.Vector3(0, 0, 0);
    var pos = ship.mesh.position;
    var objectVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    var lookVector = new THREE.Vector3().addVectors(sunVector, objectVector).normalize();
    
    console.log(lookVector);
  
    object.yawObject.translateOnAxis(lookVector, ship.velocity);
  };
  
  return Sun;
});

