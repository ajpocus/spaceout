define(['three'], function (three) {
  function Earth(scene) {
    this.scene = scene;
    this.mass = 5.97219e24;  // measured in kgs
    this.radius = 6378.1;
    this.G = 6.67e-11;
    
    this.geometry = new THREE.SphereGeometry(this.radius, 128, 128);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.translateZ(1.5e8);
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position = this.mesh.position;
    this.scene.add(pointLight);
    
    this.scene.add(this.mesh);
    
    this.velocity = 0;
  }
  
  Earth.prototype.update = function update() {
    var earth = this;
    
    if (!earth.lookVector) {
      earth.lookVector = new THREE.Vector3(0, 0, -1);
    }
    
    var lookVector = earth.lookVector;
    var upVector = new THREE.Vector3(0, 1, 0);
    var tangentVector = lookVector.cross(upVector);
    this.mesh.translateOnAxis(tangentVector, 1000);
  };
  
  return Earth;
});
