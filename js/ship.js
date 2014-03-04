define(['three'], function (three) {
    function Ship(scene) {
        this.scene = scene;
        var geometry = new THREE.Geometry();
    
        // back face
        geometry.vertices.push( new THREE.Vector3( -5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3(  5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 5, 0 ) );
        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        
        // bottom face
        geometry.vertices.push( new THREE.Vector3(  5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, -10 ) );
        geometry.vertices.push( new THREE.Vector3( -5, 0, 0 ) );
        geometry.faces.push( new THREE.Face3( 3, 4, 5 ) );
        
        // top-left face
        geometry.vertices.push( new THREE.Vector3( -5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 5, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, -10 ) );
        geometry.faces.push( new THREE.Face3( 6, 7, 8 ) );
        
        // top-right face
        geometry.vertices.push( new THREE.Vector3( 5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, -10 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 5, 0 ) );
        geometry.faces.push( new THREE.Face3( 9, 10, 11 ) );
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        this.geometry = geometry;
        
        var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0x0000cc, specular: 0x2020cc, shininess: 10, shading: THREE.FlatShading } );
        this.material = material;
        var ship = new THREE.Mesh( geometry, material );
        
        scene.add( ship );
        this.mesh = ship;
    }
    
    return Ship;
});
