define(['three', 'ship'], function(three, Ship) {
    function Galaxy() {
        var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    
        // set some camera attributes
        var FOV = 90,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000,
            ANGLE = 45;
            
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
        
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( WIDTH, HEIGHT );
        document.body.appendChild( renderer.domElement );
        
        var ship = new Ship(scene);
        
        camera.position.x = 0;
        camera.position.y = 8;
        camera.position.z = 5;
        camera.lookAt(ship.mesh.position);
        
        var ambientLight = new THREE.AmbientLight( 0x000044 );
        scene.add(ambientLight);
        
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add( directionalLight );
        
        var render = function () {
    		requestAnimationFrame(render);
    
    		renderer.render(scene, camera);
    	};
    
    	render();
    }
    
    return Galaxy;
    
});