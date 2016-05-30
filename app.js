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

PlutoRover.Scene = function() {
  return new THREE.Scene();
};

PlutoRover.Scene.prototype = {};

PlutoRover.CameraSettings = function(width, height) {
  this.aspectRatio = width / height;
  this.fov = 60;
  this.nearPlane = 1;
  this.farPlane = 10000;
}

PlutoRover.CameraSettings.prototype = {};


PlutoRover.PerspectiveCamera = function(settings) {
  return new THREE.PerspectiveCamera(settings);
}


PlutoRover.Fog = function(){
  return new THREE.Fog(0x000000);
}

PlutoRover.Fog.prototype = {};

PlutoRover.Renderer = function() {

  return new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
};

PlutoRover.Renderer.prototype = {};

PlutoRover.Planet = function(groundColor) {

  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  var mat = new THREE.MeshPhongMaterial({
    color: groundColor,
    transparent: true,
    opacity: 0.8,
    shading: THREE.FlatShading
  });

  this.mesh = new THREE.Mesh(geom, mat);

  this.mesh.receiveShadow = true;
};

PlutoRover.Planet.prototype = {

  moveWaves: function() {

    var verts = this.mesh.geometry.vertices;
    var length = verts.length;

    for(var i=0; i<1; i++){

      var v = verts[i];

      var vprops = this.waves[i];

      v.x = vprops.x + Math.cos(vprops.angle) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.angle) * vprops.amp;

      vprops.angle += vprops.speed;
    }

    this.mesh.geometry.verticesNeedUpdate=true;

    PlutoRover.Planet.mesh.rotation.z += .005;
  }
};

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
  },

  createPlanet: function(planet, scene) {
    var pluto = planet;

    // pluto.mesh.position.y = -600;

    scene.add(pluto.mesh);

    console.log(pluto, scene);
  }
}


document.addEventListener('DOMContentLoaded', init, false);

function init() {

  var Settings       = new PlutoRover.Settings();
  var Color          = new PlutoRover.Colors();
  var Scene          = new PlutoRover.Scene();
  var CameraSettings = new PlutoRover.CameraSettings(Settings.screenWidth, Settings.screenHeight);
  var Camera         = new PlutoRover.PerspectiveCamera(CameraSettings);
  var Fog            = new PlutoRover.Fog();
  var Controller     = new PlutoRover.Controller();
  var Renderer       = new PlutoRover.Renderer();
  var Pluto          = new PlutoRover.Planet(Color.slate);

  Controller.setCameraPosition(Camera, 0, 200, 100);

  Renderer.setSize(Settings.width, Settings.height);
  Renderer.shadowMap.enabled = true;


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
  Controller.createPlanet(new PlutoRover.Planet(Color.Slate), Scene);


  Settings.container.appendChild(Renderer.domElement);

  //event Handlers
  Settings.win.addEventListener('resize', Controller.handleWindowResize(Renderer, Camera, Settings.win), false);



}
