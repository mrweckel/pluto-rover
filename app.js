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
  this.viewPorts = [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      eye: [0,25,15],
      subject: [0, 25, 0]
    },
    {
      left: 0.5,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      eye: [90,90,90],
      subject: [0, 0, 0]
    },
    {
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      eye: [0,0,60],
      subject: [0, 20, 0]
    }
  ];
  //These do not belong here. Need to move.
  this.liveCrystals = [];
  this.totalCrystals = 0;
  this.crystalGroups = [];
  this.numOfCrystalGroups = 1;
};

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

    this.width = 1;
    this.height = 0.5;
    this.depth = 2;
    this.name = 'Rover 4000'
}

PlutoRover.Ship.prototype = {

  build: function() {
    var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.name = this.name;

    return cube;
  }
}

PlutoRover.Crystal = function(name) {

  this.width = .25;
  this.height = .25;
  this.depth = .25;
  this.posX = null;
  this.posY = null;

  var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
  var material = new THREE.MeshLambertMaterial({opacity: 0.75, color: 0xff0000});
  var mesh =  new THREE.Mesh(cubeGeometry, material);

  mesh.name = name;

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
  },

  cloneVector: function(obj){

    var newObj = {};

    for(var key in obj){

      if(obj.hasOwnProperty(key)){

        newObj[key] = obj[key];
      }
    }

    var vector = new THREE.Vector3(newObj.x, newObj.y, newObj.z);
    return vector;
  }
}


document.addEventListener('DOMContentLoaded', init, false);

function init() {

  var Settings   = new PlutoRover.Settings();
  var Color      = new PlutoRover.Colors();

  var Scene      = new THREE.Scene();
  var Fog        = new THREE.Fog(0x000000);;
  var Controller = new PlutoRover.Controller();

  var Cameras = []; //hold cameras created. Will be multiple if in devmode


  //add keyboard event listeners
  window.addEventListener('keydown', handleKeyboardRequest, false);
  // window.addEventListener('keyup', returnToCenter, false);

  // Check if in dev mode
  if(Settings.devMode !== true){

  //Set Camera
    var CamSettings = new PlutoRover.CameraSettings(Settings.screenWidth, Settings.screenHeight);
    var Camera = new THREE.PerspectiveCamera(CamSettings.fov, CamSettings.aspectRatio, CamSettings.nearPlane, CamSettings.farPlane);

    var vector = new THREE.Vector3(0, 25, 0);
    Controller.setCameraPosition(Camera, 0, 25, 17);

    Camera.lookAt(vector);

  } else {

    Settings.setDevEnvironment(Scene);

    for(var i = 0; i < Settings.viewPorts.length; i++) {

      var view = Settings.viewPorts[i];
      var settings = new PlutoRover.CameraSettings(Settings.screenWidth, Settings.screenHeight);
      var camera = new THREE.PerspectiveCamera(settings.fov, settings.aspectRatio, settings.nearPlane, settings.farPlane);

      camera.position.x = view.eye[0];
      camera.position.y = view.eye[1];
      camera.position.z = view.eye[2];

      var s = view.subject;
      var vector = new THREE.Vector3(s[0], s[1], s[2]);

      camera.lookAt(vector);

      Cameras.push(camera); //make camera available outside loop
    }
  }

  //for debug purposes
  var camGuideGeom = new THREE.SphereGeometry(2);
  var camGuideMesh = new THREE.Mesh(camGuideGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
  camGuideMesh.position.copy(vector);
  Scene.add(camGuideMesh);

  //set camera point

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

  Crystal.name = 'Crystal-01';
  Crystal.position.x = -4;
  Crystal.position.y = 22.516;
  Crystal.position.z = 13;

  var intersectable = [Crystal];

  var mainGroup = new THREE.Group();
  mainGroup.add(Pluto);
  mainGroup.add(Crystal);

  Scene.add(mainGroup);

  //Ship
  var Ship = new PlutoRover.Ship().build();

  Ship.position.x = 0;
  Ship.position.y = 24.5;
  Ship.position.z = 11;

  Ship.rotation.x = .25;

  Scene.add(Ship);

  //  //Development Mode

  // if(Settings.devMode === true){
  //   Settings.setDevEnvironment(Scene);
  // }

  Settings.container.appendChild(Renderer.domElement);

  //TEMP event handler location
  function handleKeyboardRequest(e) {

    switch(e.keyCode) {

      case 39:
        if(Camera.rotation.z >= .3){
          Camera.rotation.z === .4;
          Ship.position.x === 1.5;
          Ship.rotation.y === .05;
          Ship.rotation.z === .2;
        } else {

          createjs.Tween.get(Ship.position).to({x: Ship.position.x+.5},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y+.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z-.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z+.05},100);
        }
        break;

      case 37:
        if(Camera.rotation.z <= -.3){
          Camera.rotation.z === -.4;
          Ship.position.x === -1.5;
          Ship.rotation.y === -.05;
          Camera.rotation.z === -.4;
        } else {
          createjs.Tween.get(Ship.position).to({x: Ship.position.x-.5},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y-.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z+.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z-.05},100);
        }
         break;
      case 38:
        break;
      case 40:
        break;
      default:
        break;
    }
  }

  // 1- Add crystals in groups of four, just slightly off its x and z axis.
  // 2- Going to have to work out an equation here that accounts for the round surface to make placing the crystals easier.
  var crystalGroup = new THREE.Group();
  crystalGroup.name = 'crystal-group-' + Settings.numOfCrystalGroups;
  mainGroup.add(crystalGroup);

  var currentCrystalXPos;
  var currentCrystalYPos = 25;
  var currentCrystalZPos = 10;

  var firstCrystalInGroup = true;

  function spawnCrystal() {

    Settings.totalCrystals ++;
    var nextNumber = Settings.totalCrystals;
    var crystalName = 'crystal-' + nextNumber;

    var newCrystal = new PlutoRover.Crystal(crystalName);

    //set min and max x positioning. Needs to be moved
    var min = -4;
    var max = 4;

    if(firstCrystalInGroup){
      console.log('here ?')
      currentCrystalXPos = Math.floor(Math.random() * (max - min + 1)) + min;
      newCrystal.position.x = currentCrystalXPos;
      newCrystal.position.y = currentCrystalYPos;
      newCrystal.position.z = currentCrystalZPos;
    } else {
      currentCrystalXPos -= .5;
      currentCrystalYPos += .1;
      currentCrystalZPos -= 1;
      newCrystal.position.x = currentCrystalXPos;
      newCrystal.position.y = currentCrystalYPos;
      newCrystal.position.z = currentCrystalZPos;
    }

    if(crystalGroup.children.length < 4) {
      crystalGroup.add(newCrystal);
      firstCrystalInGroup = false;
      console.log(crystalGroup);
    } else {
      mainGroup.add(crystalGroup);
      Settings.numOfCrystalGroups++;
      crystalGroup = new THREE.Group();
      crystalGroup.name = 'crystal-group-' + Settings.numOfCrystalGroups;
      firstCrystalInGroup = true;
      // clearInterval(interval);
    }
  }

  // var interval = setInterval(function() {
  //   spawnCrystal();
  // }, 500);


  function returnToCenter(){

    createjs.Tween.get(Ship.position).to({x: 0}  ,500);
    createjs.Tween.get(Ship.rotation).to({y: 0}  ,500);
    createjs.Tween.get(Ship.rotation).to({z: 0}  ,500);
    createjs.Tween.get(Camera.rotation).to({z: 0},500);
  }

  function animate() {

    update();
    render();

    requestAnimationFrame(animate);
  }

  var test = 0


  function update() {

    //Collision detection taken from http://stemkoski.github.io/Three.js/Collision-Detection.html

    //Need to understand raycasting more
    var originPoint = Controller.cloneVector(Ship.position);
    var verticesLength = Ship.geometry.vertices.length;

    for(var i = 0; i < verticesLength; i++) {

      var localVertex = Controller.cloneVector(Ship.geometry.vertices[i]);//why clone?
      var globalVertex = localVertex.applyMatrix4(Ship.matrix);
      var directionVector = globalVertex.sub(Ship.position);
      directionVector.parent = Crystal;

      var ray = new THREE.Raycaster(originPoint, Controller.cloneVector(directionVector));
      var collisionResults = ray.intersectObjects(intersectable);
      if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){

        var capturedObj = Scene.getObjectByName(Crystal.name);

        mainGroup.remove(capturedObj);
      }
    }
  }


  function render() {

      mainGroup.rotation.x = Settings.step += 0.01;

      if(Settings.devMode != true){

        //Only one camera in primary mode
        Renderer.render(Scene, Camera);
      } else {

        for(var i = 0; i < Cameras.length; i++){

          var view = Settings.viewPorts[i];
          var camera = Cameras[i];
          var windowWidth = Settings.screenWidth;
          var windowHeight = Settings.screenHeight;

          var left = Math.floor(windowWidth * view.left);
          var bottom = Math.floor(windowHeight * view.bottom);
          var width = Math.floor(windowWidth * view.width);
          var height = Math.floor(windowHeight * view.height);
          Renderer.setViewport(left, bottom, width, height);
          Renderer.setScissor(left, bottom, width, height);
          Renderer.setScissorTest(true);

          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          Renderer.render(Scene, camera);
        }
      }
  }


  //Render scene loop
  animate();



  //event Handlers
  // Settings.win.addEventListener('resize', Controller.handleWindowResize(Renderer, Camera, Settings.win), false);
}
