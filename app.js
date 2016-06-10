'use strict';

var PlutoRover = {};

PlutoRover.Settings = function() {
  this.doc = document;
  this.win = window;
  this.screenWidth = window.screen.availWidth;
  this.screenHeight = window.screen.availHeight;
  this.container = this.doc.getElementById('pluto');
  this.step = 0;
  this.devMode = false;
}

PlutoRover.Settings.prototype = {

  setDevEnvironment: function(scene){

    console.log('Development Mode is ON');

    //AXES for dev
    // show axes in the screen
    var axes = new THREE.AxisHelper(50);
    scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(100, 40);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    //Move camera to dev environment
    // moveCamera;
    }
};

PlutoRover.Colors = function() {
  this.royal    = 0x4359C1;
  this.slate    = 0x5B63BC;
  this.navy     = 0x293675;
  this.pastel   = 0x7E89C1;
  this.midnight = 0x171E42;
};

PlutoRover.Colors.prototype = {};

PlutoRover.Lights = function() {
  this.hemisphereLight = new THREE.HemisphereLight(0x000000, 0x3F3F3F, .9);//Color 1, Color 2, Intensity
  this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);//Color, Intensity

  this.shadowLight.position.set(150, 350, 350);

  this.shadowLight.castShadow = true;

  this.shadowLight.shadow.camera.left = -400;
  this.shadowLight.shadow.camera.right = 400;
  this.shadowLight.shadow.camera.top = 400;
  this.shadowLight.shadow.camera.bottom = -400;
  this.shadowLight.shadow.camera.near = 1;
  this.shadowLight.shadow.camera.far = 1000;

  Scene.add(this.hemisphereLight);
  Scene.add(this.shadowLight);

};

PlutoRover.Lights.prototype = {

};

PlutoRover.CameraSettings = function(width, height) {
  this.aspectRatio = width / height;
  this.fov = 60;
  this.nearPlane = 1;
  this.farPlane = 10000;
}

PlutoRover.CameraSettings.prototype = {};

PlutoRover.Planet = function() {

  this.radius = 26;
  this.widthSegments = 100;
  this.heightSegments = 100;
  this.textureImage = 'pluto-2.jpg';
  this.bump = 'pluto-2.jpg';
  this.geom = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
};

PlutoRover.Planet.prototype = {

  createTextureMesh: function() {

    var filePath = '/images/';

    var texture  = new THREE.TextureLoader().load(filePath + this.textureImage);//load main texture

    var material = new THREE.MeshPhongMaterial();
    material.map = texture;

    var bump = new THREE.TextureLoader().load(filePath + this.bump);
    material.bumpMap = bump;
    material.bumpScale = 0.9;

    var mesh =  new THREE.Mesh(this.geom, material);
    mesh.shading = THREE.Shading;

    return mesh;
  },

  createPhongMesh: function() {

    var material = new THREE.MeshPhongMaterial({opacity: 0.5, color: 0x7E89C1});
    var mesh =  new THREE.Mesh(this.geom, material);
    mesh.shading = THREE.Shading;

    return mesh;
  },

  createLambertMesh: function() {

    var material = new THREE.MeshLambertMaterial({opacity: 0.5, color: 0x7E89C1, wireframe: true});
    var mesh =  new THREE.Mesh(this.geom, material);
    mesh.shading = THREE.Shading;

    return mesh;
  }
}

PlutoRover.Hills = function() {

}

PlutoRover.Hills.prototype = {

  createHill: function() {

    var radius = this.randomGenerator();
    var widthSegments  = 100;
    var heightSegments = 100;

    console.log(radius);

    var geom = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    var mat  = new THREE.MeshLambertMaterial({color: 0x7E89C1});

    var mesh = new THREE.Mesh(geom, mat);

    return mesh;
  },

  randomGenerator: function() {
    var min = 5;
    var max = 10;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

PlutoRover.Ship = function() {

    this.width = 8;
    this.height = 4;
    this.depth = 16;
}

PlutoRover.Ship.prototype = {

  build: function() {
    var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    return cube;
  }
}

PlutoRover.Crystal = function() {

  this.width = 4;
  this.height = 4;
  this.depth = 4;
  this.posX = null;
  this.posY = null;

  var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
  var material = new THREE.MeshLambertMaterial({opacity: 0.5, color: 0xff0000, wireframe: true});
  var mesh =  new THREE.Mesh(this.geom, material);

  return mesh;
}

PlutoRover.Crystal.prototype = {

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

    var width = window.screen.availWidth;
    var height = window.screen.availHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  },

  render: function(renderer, scene, camera) {
    requestAnimationFrame(this.render);
    renderer.render(scene, camera);
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

  //add keyboard event listeners
  window.addEventListener('keydown', handleKeyboardRequest, false);
  window.addEventListener('keyup', returnToCenter, false);

  // Set main camera angle
  var vector = new THREE.Vector3(0, 40, 0);
  Controller.setCameraPosition(Camera, 0, 0, 30);

  console.log(Camera);

  //for debug purposes
  var camGuideGeom = new THREE.SphereGeometry(2);
  var camGuideMesh = new THREE.Mesh(camGuideGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
  camGuideMesh.position.copy(vector);
  Scene.add(camGuideMesh);

  //set camera point
  Camera.lookAt(vector);

  //set renderer
  var Renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  Renderer.setSize(Settings.screenWidth, Settings.screenHeight);
  Renderer.shadowMap.enabled = true;

  //Lights
  //NEEDS TO BE MOVED
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

  //Hills
  var hills = new PlutoRover.Hills;
  var hill_01 = hills.createHill();
  console.log(hill_01);

  hill_01.position.x = -10;
  hill_01.position.y =  20;
  hill_01.position.z = -200;

  Scene.add(hill_01);

  //Planet
  var Pluto = new PlutoRover.Planet().createLambertMesh();

  // position the sphere
  Pluto.position.x = 0;
  Pluto.position.y = 0;
  Pluto.position.z = 0;

  Pluto.rotation.y = 0.5;

  // add the sphere to the scene
  // Scene.add(Pluto);

  //Add Crystals
  var Crystal = new PlutoRover.Crystal();
  console.log(Crystal);
  // Scene.add(Crystal);

  var group = new THREE.Group();
  group.add(Pluto);

  Scene.add(group);
  console.log(group);

  //Ship
  var Ship = new PlutoRover.Ship().build();

  Ship.position.x = 0;
  Ship.position.y = 30;
  Ship.position.z = 10;

  Ship.rotation.x = 45;

  Scene.add(Ship);

   //Development Mode
  Settings.devMode = true;

  if(Settings.devMode === true){
    Settings.setDevEnvironment(Scene);
  }

  Settings.container.appendChild(Renderer.domElement);

  //TEMP event handler location
  function handleKeyboardRequest(e) {
    console.log(e);
    switch(e.keyCode) {
      case 39:
        console.log('you are flying right');

        if(Camera.rotation.z >= .4){
          Camera.rotation.z === .4;
          Ship.position.x === 5;
          Ship.rotation.y === .05;
          Ship.rotation.z === .2;
        } else {

          createjs.Tween.get(Ship.position).to({x: Ship.position.x+1},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y+.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z-.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z+.05},100);
        }
        break;
      case 37:
        console.log('you are flying left');
        if(Camera.rotation.z <= -.4){
          Camera.rotation.z === -.4;
          Ship.position.x === -5;
          Ship.rotation.y === -.05;
          Camera.rotation.z === -.4;
        } else {
          createjs.Tween.get(Ship.position).to({x: Ship.position.x-1},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y-.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z+.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z-.05},100);
        }
         break;
      case 38:
        console.log('you are flying down');
        break;
      case 40:
        console.log('you are flying up');
        break;
      default:
        break;
    }
  }

  function returnToCenter(){

    createjs.Tween.get(Ship.position).to({x: 0}  ,500);
    createjs.Tween.get(Ship.rotation).to({y: 0}  ,500);
    createjs.Tween.get(Ship.rotation).to({z: 0}  ,500);
    createjs.Tween.get(Camera.rotation).to({z: 0},500);
  }

  //Render scene loop
  render();

  function render() {
      Pluto.rotation.x = Settings.step += 0.01;

      // render using requestAnimationFrame
      requestAnimationFrame(render);
      Renderer.render(Scene, Camera);
  }



  //event Handlers
  Settings.win.addEventListener('resize', Controller.handleWindowResize(Renderer, Camera, Settings.win), false);
}


//to do
// create flight pattern for Ship
// group together objects
//create points

