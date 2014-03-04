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
  
  return Asteroid;
});

