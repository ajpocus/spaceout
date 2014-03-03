var gl;

$(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
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
    
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    var ship = new THREE.Mesh( geometry, material );
    scene.add( ship );
    
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 5;
    
    var render = function () {
		requestAnimationFrame(render);

		renderer.render(scene, camera);
	};

	render();
});