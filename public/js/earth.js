define(['three'], function (three) {
  function Earth(scene) {
    this.scene = scene;
    this.mass = 5.97219e24;  // measured in kgs
    this.radius = 6378.1;
    this.G = 6.67e-11;
    
    this.geometry = new THREE.SphereGeometry(this.radius, 128, 128);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.translateZ(1.5e5);
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
    
    var tangentVector = new THREE.Vector3(1, 0, 0);
    var xVector = earth.lookVector.add(tangentVector).normalize();
    console.log(xVector);
    this.mesh.translateOnAxis(xVector, 1000);
  };
  
  return Earth;
});
