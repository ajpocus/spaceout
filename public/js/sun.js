define(['three', 'gravity'], function (three, Gravity) {
  function Sun(galaxy) {
    this.galaxy = galaxy;
    this.scene = this.galaxy.scene;
    this.mass = 1.9891e12;  // measured in kgs
    this.radius = 2000;
    this.G = 6.67e-11;
    
    this.geometry = new THREE.SphereGeometry(this.radius, 128, 128);
    this.material = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position = this.mesh.position;
    this.scene.add(pointLight);
    
    this.scene.add(this.mesh);
    
    // mixins
    var ship = galaxy.controls.yawObject;
    Sun.satellites = [ ship ];
  }
  
  
  Gravity.call(Sun.prototype, { satellites: Sun.satellites });
  
  Sun.prototype.update = function () {
    this.updateGravity();
  };
  
  Sun.dist2 = function (pos1, pos2) {
    var x2 = Math.pow((pos1.x - pos2.x), 2);
    var y2 = Math.pow((pos1.y - pos2.y), 2);
    var z2 = Math.pow((pos1.z - pos2.z), 2);
    var dist2 = Math.sqrt(x2 + y2 + z2);
    return dist2;
  };
  
  Sun.prototype.getForce = function getForce(object) {
    var mesh = this.mesh;
    var mesh2 = object.mesh;
    
    var dist2 = Sun.dist2(mesh.position, mesh2, position);
    var force = (this.G * this.mass * object.mass) / dist2;
    return force;
  };
  
  return Sun;
});

