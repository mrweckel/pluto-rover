'use strict';

var PlutoRover = {};

PlutoRover.Settings = function() {
  this.devMode = false;
  this.doc = document;
  this.win = window;
  this.screenWidth = window.screen.availWidth;
  this.screenHeight = window.screen.availHeight;
  this.container = this.doc.getElementById('pluto');
  this.step = 0;
  //setting the multiple views for devmode
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
  this.intersectableObjects = [];
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
    },

    degreesToRadians: function(deg) {
      return deg * (MATH.PI/180);
    },

    getRandom: function(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
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

PlutoRover.Gameplay = function() {
  this.score = 0;
  this.lives = 3;
  this.health = 100;
  this.timer = 0;
}

PlutoRover.Gameplay.prototype = {

  newGame: function() {
    this._resetStats();
  },

  _resetStats: function() {
    this.score = 0;
    this.lives = 3;
    this.health = 100;
    this.timer = 0;
  }
}

PlutoRover.Lights = function() {
  this.hemisphereLight = new THREE.HemisphereLight(0x000000, 0x3F3F3F, 0.9);//Color 1, Color 2, Intensity
  this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);//Color, Intensity

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
};

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
};

PlutoRover.Hills = function() {

};

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
};

PlutoRover.Ship = function() {

    this.width = 1;
    this.height = 0.5;
    this.depth = 2;
    this.name = 'Rover 4000';
};

PlutoRover.Ship.prototype = {

  build: function() {
    var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.name = this.name;

    return cube;
  }
};

PlutoRover.CrystalMaster = function(parent, settings) {

  this.parent = parent;
  this.appSettings = settings;

  this.liveCrystals = [];
  this.totalCrystals = 0;
  this.crystalGroups = [];
  this.numOfCrystalGroups = this.crystalGroups.length;
  this.crystalQuadrants = [0,45,90,135,180,225,270,315];
  this.currentDegree = null;
};


PlutoRover.CrystalMaster.prototype = {

  createGroup: function() {

    var group = new THREE.Group();
    group.name = 'crystal-group-' + this.numOfCrystalGroups;
    group.quadrant = this.appSettings.getRandom(this.crystalQuadrants); // this is a problem
    this.currentDegree = group.quadrant;


    var index = this.crystalQuadrants.indexOf(group.quadrant);
    this.crystalQuadrants.splice(index, 1); //once quadrant is selected, remove from possibilities

    this.crystalGroups.push(group);
    this.parent.add(group);

    return group;
  },

  setChildPosition: function(crystal, positionFromSibling) {

    var xPos;
    var that = this;

    //Makes sure that crystals are not placed outside of the ships x flight radius
    var min = -4;
    var max = 4;

    if (positionFromSibling === null) {
      //return random integer in between the min and max values;

      xPos = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log('setting first pos');
    } else {
      //This is all f'd. There has to be a better way to do this.
      xPos = positionFromSibling;
      this.currentDegree += 0.05;
      xPos -= 0.25;
      console.log('setting sibling pos');
      console.log(this.currentDegree, xPos);
    }

    console.log(crystal.position.x);

    //26 is hardcoded planet radius. Needs to change and 0.5 is so it isn't exactly on the planets surface
    var distFromPlanetCenter = 26 + 0.25; //aka hypotenuse

    crystal.position.x = xPos;
    crystal.position.y = Math.sin(that.currentDegree) * distFromPlanetCenter;
    crystal.position.z = Math.cos(that.currentDegree) * distFromPlanetCenter;
  }
};

PlutoRover.Crystal = function(name) {

  this.width  = 0.25;
  this.height = 0.25;
  this.depth  = 0.25;
  this.posX   = null;
  this.posY   = null;

  var cubeGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
  var material = new THREE.MeshLambertMaterial({opacity: 0.75, color: 0xff0000});
  var mesh =  new THREE.Mesh(cubeGeometry, material);

  //set mesh(crystal) properties
  mesh.name = name;
  mesh.first = true;

  return mesh;
};

PlutoRover.Crystal.prototype = {
};

PlutoRover.Controller = function() {

};

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
};


document.addEventListener('DOMContentLoaded', init, false);

function init() {

  var Settings   = new PlutoRover.Settings();
  var Color      = new PlutoRover.Colors();

  var Scene      = new THREE.Scene();
  var Fog        = new THREE.Fog(0x000000);
  var Controller = new PlutoRover.Controller();

  var Cameras = []; //hold cameras created. Will be multiple if in devmode

  var mainGroup = new THREE.Group(); //The Parent of all 3JS objects. This is a bad way to do it. Needs to change

  //Crystals are the points the user collects.
  var CrystalMaster = new PlutoRover.CrystalMaster(mainGroup, Settings);


  //add keyboard event listeners
  window.addEventListener('keydown', handleKeyboardRequest, false);
  // window.addEventListener('keyup', returnToCenter, false);

  // Check if in dev mode
  var vector;
  if(Settings.devMode !== true){

  //Set Camera
    var CamSettings = new PlutoRover.CameraSettings(Settings.screenWidth, Settings.screenHeight);
    var Camera = new THREE.PerspectiveCamera(CamSettings.fov, CamSettings.aspectRatio, CamSettings.nearPlane, CamSettings.farPlane);

    vector = new THREE.Vector3(0, 26, 0);
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
      vector = new THREE.Vector3(s[0], s[1], s[2]);

      camera.lookAt(vector);

      Cameras.push(camera); //make camera available outside loop
    }
  }

  //for debug purposes
  var camGuideGeom = new THREE.SphereGeometry(0.5);
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
  var hemisphereLight = new THREE.HemisphereLight(0x000000, 0x3F3F3F, 0.9);//Color 1, Color 2, Intensity
  var shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);//Color, Intensity

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
  // var hills = new PlutoRover.Hills();
  // var hill_01 = hills.createHill();

  // hill_01.position.x = -10;
  // hill_01.position.y =  20;
  // hill_01.position.z = -200;

  // Scene.add(hill_01);

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

  Settings.intersectableObjects.push(Crystal);

  mainGroup.add(Pluto);
  mainGroup.add(Crystal);

  Scene.add(mainGroup);

  //Ship
  var Ship = new PlutoRover.Ship().build();

  Ship.position.x = 0;
  Ship.position.y = Math.sin(89.15) * 26.15;
  Ship.position.z = Math.cos(89.15) * 26.15;

  // Ship.position.x = 0;
  // Ship.position.y = 24.5;
  // Ship.position.z = 11;

  Ship.rotation.x = 0.25;

  Scene.add(Ship);

  //  //Development Mode

  // if(Settings.devMode === true){
  //   Settings.setDevEnvironment(Scene);
  // }

  Settings.container.appendChild(Renderer.domElement);

  //TEMP event handler location
  function handleKeyboardRequest(e) {

    switch(e.keyCode) {

      case 39: //right
        if(Camera.rotation.z <= 0.3){
          createjs.Tween.get(Ship.position).to({x: Ship.position.x + 0.5},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y + 0.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z - 0.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z + 0.05},100);
        }
        break;

      case 37: //left
        if(Camera.rotation.z >= -0.3){
          createjs.Tween.get(Ship.position).to({x: Ship.position.x - 0.5},100);
          createjs.Tween.get(Ship.rotation).to({y: Ship.rotation.y - 0.01},100);
          createjs.Tween.get(Ship.rotation).to({z: Ship.rotation.z + 0.025},100);
          createjs.Tween.get(Camera.rotation).to({z: Camera.rotation.z - 0.05},100);
        }
        break;

      // case 38: //up
      //   createjs.Tween.get(Ship.position).to({y: Ship.position.y - 0.1},100);
      //   createjs.Tween.get(Ship.rotation).to({x: Ship.rotation.x - 0.05},100);
      //   break;

      // case 40: //down
      //   createjs.Tween.get(Ship.position).to({y: Ship.position.y + 0.1},100);
      //   createjs.Tween.get(Ship.rotation).to({x: Ship.rotation.x + 0.05},100);
      //   break;

      default:
        break;
    }
  }

  // 1- This needs proper equations for placing objects on the surface of a sphere
  // 2- Also needs major clean up
  var crystalGroup = CrystalMaster.createGroup();
  var firstGroup = true;
  var firstSiblingXPos;

  function spawnCrystal() {

    CrystalMaster.totalCrystals ++;
    var nextNumber = CrystalMaster.totalCrystals;
    var crystalName = 'crystal-' + nextNumber;

    var newCrystal = new PlutoRover.Crystal(crystalName);
    Settings.intersectableObjects.push(newCrystal);

    //yeesh
    //first crystal overall
    if(CrystalMaster.numOfCrystalGroups === 0) {

      CrystalMaster.numOfCrystalGroups++;
      crystalGroup.add(newCrystal);
      CrystalMaster.setChildPosition(newCrystal, null);
      firstSiblingXPos = newCrystal.position.x;

    //every subsequent first crystal in a group
    } else if(crystalGroup.children.length > 3) {

      crystalGroup = CrystalMaster.createGroup();
      CrystalMaster.numOfCrystalGroups++;
      crystalGroup.add(newCrystal);
      CrystalMaster.setChildPosition(newCrystal, null);
      firstSiblingXPos = newCrystal.position.x;

    } else {

      crystalGroup.add(newCrystal);
      CrystalMaster.setChildPosition(newCrystal, firstSiblingXPos );
    }

  }

  var interval;
  setTimeout(function(){
    interval = setInterval(function() {
      spawnCrystal();
    }, 500);
  },1000);



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

  var test = 0;


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
      var collisionResults = ray.intersectObjects(Settings.intersectableObjects);
      if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){

        var capturedObj = collisionResults[0].object;
        var capturedObjGroup = capturedObj.parent;
        if(capturedObj !== null && capturedObjGroup !== null){
          console.log(capturedObjGroup);
          capturedObjGroup.remove(capturedObj);
        }
      }
    }
  }


  function render() {

      mainGroup.rotation.x = Settings.step += 0.015;

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



//Trig notes

// SOHCAHTOA

// sin = opp/hypotenuse
// cos = adj/hypotenuse
// tan = opp/adj

// MODEL

// |\
// | \
// |  \
// |___\