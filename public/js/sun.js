define(['three'], function (three) {
  function Sun(scene) {
    this.scene = scene;
    this.mass = 1.9891e9;  // measured in kgs
    this.radius = 2000;
    this.G = 6.67e-11;
    
    this.geometry = new THREE.SphereGeometry(this.radius, 128, 128);
    this.material = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position = this.mesh.position;
    this.scene.add(pointLight);
    
    this.scene.add(this.mesh);
  }
  
  Sun.prototype.updateGravity = function updateGravity(object, ship, earth) {
    var sun = this;
    
    var shipForce = sun.getForce(ship);
    var acceleration = shipForce / ship.mass;
    
    if (ship.velocity < 400) {    
      ship.velocity += acceleration;
    }
    
    var sunVector = new THREE.Vector3(0, 0, 0);
    var pos = ship.mesh.position;
    var objectVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    var lookVector = new THREE.Vector3().addVectors(sunVector, objectVector).normalize();
    
    object.yawObject.translateOnAxis(lookVector, ship.velocity);
    
    var earthForce = sun.getForce(earth);
    var acceleration = earthForce / earth.mass;
    
    if (earth.velocity < 400) {    
      earth.velocity += acceleration;
    }
    
    pos = earth.mesh.position;
    objectVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    lookVector = new THREE.Vector3().subVectors(sunVector, objectVector).normalize();

    earth.mesh.translateOnAxis(lookVector, earth.velocity);
    earth.lookVector = lookVector;
  };
  
  Sun.prototype.getForce = function getForce(object) {
    var mesh = this.mesh;
    var mesh2 = object.mesh;
    var x2 = Math.pow((mesh.position.x - mesh2.position.x), 2);
    var y2 = Math.pow((mesh.position.y - mesh2.position.y), 2);
    var z2 = Math.pow((mesh.position.z - mesh2.position.z), 2);
    var dist2 = Math.sqrt(x2 + y2 + z2);
    var force = (this.G * this.mass * object.mass) / dist2;
    return force;
  };
  
  return Sun;
});

