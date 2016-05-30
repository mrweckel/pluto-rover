'use strict';

var PlutoRover = {};

PlutoRover.Settings = function() {
  this.doc = document;
  this.win = window;
  this.screenWidth = window.screen.availWidth;
  this.screenHeight = window.screen.availHeight;
  this.container = this.doc.getElementById('pluto');
}

PlutoRover.Settings.prototype = {
};

PlutoRover.Colors = function() {
  this.royal    = 0x4359C1;
  this.slate    = 0x5B63BC;
  this.navy     = 0x293675;
  this.pastel   = 0x7E89C1
  this.midnight = 0x171E42;
};

PlutoRover.Colors.prototype = {};

PlutoRover.CameraSettings = function(width, height) {
  this.aspectRatio = width / height;
  this.fov = 60;
  this.nearPlane = 1;
  this.farPlane = 10000;
}

PlutoRover.CameraSettings.prototype = {};

PlutoRover.Planet = function(s) {

  // create a sphere
  var sphereGeometry = new THREE.SphereGeometry(50, 20, 20);
  var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
  return new THREE.Mesh(sphereGeometry, sphereMaterial);
};

PlutoRover.Planet.prototype = {

}

PlutoRover.Controller = function() {

}

PlutoRover.Controller.prototype = {

  setCameraPosition: function(camera, xPos, yPos, zPos){

    camera.position.x = xPos;
    camera.position.z = zPos;
    camera.position.y = yPos;
  },

  handleWindowResize: function(renderer, camera, window) {

    console.log('resizing');
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}


document.addEventListener('DOMContentLoaded', init, false);

function init() {

  var Settings   = new PlutoRover.Settings();
  var Color      = new PlutoRover.Colors();

  var Scene      = new THREE.Scene();
  var Fog        = new THREE.Fog(0x000000);;
  var Controller = new PlutoRover.Controller();

  //Set Camera
  var CamSettings = new PlutoRover.CameraSettings(Settings.screenWidth, Settings.screenHeight);
  var Camera = new THREE.PerspectiveCamera(CamSettings.fov, CamSettings.aspectRatio, CamSettings.nearPlane, CamSettings.farPlane);
  Controller.setCameraPosition(Camera, 60, 40, -30);
  Camera.lookAt(Scene.position, 0);

  var Renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  Renderer.setSize(Settings.screenWidth, Settings.screenHeight);
  Renderer.shadowMap.enabled = true;

  console.log(Renderer);

  //Lights
  var hemisphereLight = new THREE.HemisphereLight(0x000000, 0x3F3F3F, .9);//Color 1, Color 2, Intensity
  var shadowLight = new THREE.DirectionalLight(0xffffff, .9);//Color, Intensity

  shadowLight.position.set(150, 350, 350);

  shadowLight.castShadow = true;

  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  Scene.add(hemisphereLight);
  Scene.add(shadowLight);

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;


  //Planet
  var Pluto = new PlutoRover.Planet(Scene);

  // position the sphere
  Pluto.position.x = 10;
  Pluto.position.y = -40;
  Pluto.position.z = 20;

  // add the sphere to the scene
  Scene.add(Pluto);


  Settings.container.appendChild(Renderer.domElement);
  Renderer.render(Scene, Camera);

  //event Handlers
  Settings.win.addEventListener('resize', Controller.handleWindowResize(Renderer, Camera, Settings.win), false);



}




//OLD

// PlutoRover.Planet = function(groundColor) {

//   var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
//   geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

//   var mat = new THREE.MeshPhongMaterial({
//     color: groundColor,
//     transparent: true,
//     opacity: 0.8,
//     shading: THREE.FlatShading
//   });

//   this.mesh = new THREE.Mesh(geom, mat);

//   this.mesh.receiveShadow = true;
// };

// PlutoRover.Planet.prototype = {

//   moveWaves: function() {

//     var verts = this.mesh.geometry.vertices;
//     var length = verts.length;

//     for(var i=0; i<1; i++){

//       var v = verts[i];

//       var vprops = this.waves[i];

//       v.x = vprops.x + Math.cos(vprops.angle) * vprops.amp;
//       v.y = vprops.y + Math.sin(vprops.angle) * vprops.amp;

//       vprops.angle += vprops.speed;
//     }

//     this.mesh.geometry.verticesNeedUpdate=true;

//     PlutoRover.Planet.mesh.rotation.z += .005;
//   }
// };
