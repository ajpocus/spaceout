define(['three'], function (three) {
  function Sun(scene) {
    this.scene = scene;
    
    this.geometry = new THREE.SphereGeometry(60, 32, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position = this.mesh.position;
    this.scene.add(pointLight);
    
    this.scene.add(this.mesh);
  }
  
  return Sun;
});

