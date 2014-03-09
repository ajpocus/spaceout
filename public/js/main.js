AM = null;

require.config({
  shim: {
    'socketio': {
      exports: 'io'
    }
  },
  paths: {
    socketio: '../socket.io/socket.io'
  }
});

require(['jquery.min', 'three', 'ship', 'galaxy'], function ($, three, Ship, Galaxy) {
    var galaxy = new Galaxy();
});
