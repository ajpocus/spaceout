define(['three'], function (three) {
    function Ship(scene) {
        this.scene = scene;
        var geometry = new THREE.Geometry();
    
        // back face
        geometry.vertices.push( new THREE.Vector3( 0, 2, 0 ) );
        geometry.vertices.push( new THREE.Vector3( -2, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3(  2, 0, 0 ) );
        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        
        // bottom face
        geometry.vertices.push( new THREE.Vector3( 0, 0, -3 ) );
        geometry.faces.push( new THREE.Face3( 2, 3, 1 ) );
        
        // top-left face
        geometry.faces.push( new THREE.Face3( 1, 0, 3 ) );
        
        // top-right face
        geometry.faces.push( new THREE.Face3( 3, 0, 2) )
        geometry.computeBoundingSphere();
        this.geometry = geometry;
        
        var material = new THREE.MeshLambertMaterial( { color: 0x0000cc } );
        this.material = material;
        var ship = new THREE.Mesh( geometry, material );
        
        scene.add( ship );
        this.mesh = ship;
    }
    
    return Ship;
});