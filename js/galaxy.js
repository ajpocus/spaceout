define(['three', 'ship', 'controls'], function(three, Ship, Controls) {
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
        
        ship.mesh.position.z = -10;
        camera.lookAt(ship.mesh.position);
        
        var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
        pointLight.position.set(5, 10, 0);
        scene.add(pointLight);
        
        camera.lookAt(ship.mesh.position);
        
        var render = function () {
    		requestAnimationFrame(render);

    		renderer.render(scene, camera);
    	};
    
    	render();
    }
    
    return Galaxy;
    
});