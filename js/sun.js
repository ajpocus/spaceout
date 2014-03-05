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
  
  Sun.prototype.updateGravity = function updateGravity(objects) {
    var sun = this;
    
    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      if (!object.mass) {
        object.mass = 1000;
      }
      
      var mesh = sun.mesh;
      var mesh2 = object.mesh;
      var x2 = Math.pow((mesh.position.x - mesh2.position.x), 2);
      var y2 = Math.pow((mesh.position.y - mesh2.position.y), 2);
      var z2 = Math.pow((mesh.position.z - mesh2.position.z), 2);
      var dist2 = Math.sqrt(x2 + y2 + z2);
      var force = (sun.G * sun.mass * object.mass) / dist2;
      
      var acceleration = force / object.mass;
      
      if (object.velocity < 400) {    
        object.velocity += acceleration;
      }
      
      object.mesh.lookAt(sun.mesh.position);
      object.mesh.translateZ(object.velocity);
    }
  };
  
  return Sun;
});

