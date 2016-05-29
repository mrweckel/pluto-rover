'use strict';

var PlutoRover = {};

PlutoRover.colors = function() {
  this.royal    = 0x4359C1;
  this.slate    = 0x5B63BC;
  this.navy     = 0x293675;
  this.pastel   = 0x7E89C1
  this.midnight = 0x171E42;
};

PlutoRover.colors.prototype = {

};

PlutoRover.Scene = function() {
  this.height = window.innerHeight;
  this.width  = window.innerWidth;
  this.scene  = new THREE.Scene();
  this.fog    = new THREE.Fog(0x000000);


};

PlutoRover.Scene.prototype = {

  create = function() {

  }
};

PlutoRover.Camera = function(width, height) {
  this.aspectRatio = width / height;
  this.fov = 60;
  this.nearPlane = 1;
  this.farPlane = 10000;
  this.camera = new THREE.PerspectiveCamera (
    this.fov,
    this.aspectRatio,
    this.nearPlane,
    this.farPlane
  );
};

PlutoRover.Camera.prototype = {

  setInitialPosition: function() {
    this.position.x = 0;
    this.position.z = 200;
    this.position.y = 100;
  }
}

PlutoRover.Renderer = function() {
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
}

PlutoRover.Renderer.prototype = {

}

PlutoRover.renderer =

PlutoRover.Controller = function() {
  // this.scene = scene;
  // this.lights = lights;
  // this.rover = rover;
  // this.landscape = landscape;
  // this.space = space;
}

PlutoRover.Controller = {

  loop: function() {

  }
}


document.addEventListener('DOMContentLoaded', init, false);

function init(){

  var Color = new PlutoRover.colors;
  var Controller = new PlutoRover.controller;
}
