import * as BABYLON from "babylonjs"
import * as GUI from "babylonjs-gui"
import {  Plane, Vector3, WebXRMotionControllerTeleportation } from "babylonjs";
import "babylonjs-loaders"
import { LoadEnemy } from "./EnemyLoad";
import { createXRExperience, MuzzleFlash} from "./Initxr";
import { enemySoundStop, playAudio, playGunShot } from "./Audio";


const canvas = document.getElementById("renderCanvas")
const engine = new BABYLON.Engine(canvas)
var scene = new BABYLON.Scene(engine);
let navmesh = null;
let teleportation = null;
let VrRay;
let VrRayHelper;
export let LocalAdvTex = null;
  //Camera
  export var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0,2,0), scene);

  export const switchCamera =(xrCam) =>{
    camera = xrCam;
  }
  camera.attachControl(canvas, true);
  camera.ellipsoid.y = 2;
  //camera.applyGravity = true;
  //camera.checkCollisions = true;
  camera.speed = 0.2;

  export let playerCollider = new BABYLON.MeshBuilder.CreateBox(
    "playerCollider",
    scene
  );
  playerCollider.scaling.set(0.5, 0.5, 0.5);
  playerCollider.metadata = {health: 100};
  //playerCollider.collision = true;

var createScene = async function () {
  playAudio(scene)

  //Light
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;



  BABYLON.SceneLoader.ImportMeshAsync("","assets/DoomGun.glb","",scene,).then((weaponMesh) =>{
    gun = weaponMesh.meshes[0];
    console.log(weaponMesh)
    makeHealth(gun)
    weaponMesh.transformNodes.forEach(element => {
          if(element.name == "SpawnPoint")
          {
            VrRay = new BABYLON.Ray();
            VrRayHelper = new BABYLON.RayHelper(VrRay);
            
            let dir = new BABYLON.Vector3(0, -1, 0);
            let rayOrigin = new BABYLON.Vector3.Zero();
            let length = 500;
          
            VrRayHelper.attachToMesh(element, dir, rayOrigin, length);
            VrRayHelper.show(scene);
          
          }
    });
  });

  const makeHealth =(gunMesh) =>{
    let HealthUI = BABYLON.MeshBuilder.CreatePlane(
      "PlayerHealthUI_VR",
      {
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      },
      scene
    );
    HealthUI.isPickable = false;
    HealthUI.parent = gunMesh;
    HealthUI.position = new BABYLON.Vector3(0, -0.1, 0);
    HealthUI.rotation = new BABYLON.Vector3(0, Math.PI, Math.PI);
    HealthUI.scaling = new BABYLON.Vector3(0.5, 0.25, 0.25);
    HealthUI.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  
    console.log(HealthUI);
  
    LocalAdvTex = GUI.AdvancedDynamicTexture.CreateForMesh(
      HealthUI,
      500,
      150,
      false,
      null,
      true
    );
  
    const healthBarBG = new GUI.Rectangle("PlayerHealthBarBG_VR");
    healthBarBG.background = "White";
    healthBarBG.height = "25%";
    healthBarBG.width = "100%";
    healthBarBG.verticalAlignment = 0;
    healthBarBG.cornerRadius = 20;
    healthBarBG.thickness = 3;
    LocalAdvTex.addControl(healthBarBG);
  
    const healthBar = new GUI.Rectangle("HealthBar");
    healthBarBG.addControl(healthBar);
    healthBar.horizontalAlignment = 0;
    healthBar.background = "Green";
    healthBar.cornerRadius = 20;
  }


  //Level
  BABYLON.SceneLoader.ImportMeshAsync("","assets/Doom.glb","",scene).then((LoadedMeshes) => {
          LoadedMeshes.meshes.forEach(element => {
            if(element.name == "navmesh")
            {
              element.isVisible = false;
            }
              element.checkCollisions = true;
          });
          createXRExperience(gun,scene);
                
    })

       let gun = null;

  LoadEnemy(scene);
};

export const Shooting = () =>{
  playGunShot();
  let pickResult = scene.pickWithRay(VrRay);
    if(pickResult.hit){
      if(pickResult.pickedMesh.name.includes("Zombie"))
        {
          pickResult.pickedMesh.metadata.health -= 10;
          console.log(pickResult.pickedMesh.metadata.health)
          if(pickResult.pickedMesh.metadata.health <= 0)
          {
            pickResult.pickedMesh.metadata.isAlive = false;
            console.log(pickResult.pickedMesh)
            scene.removeMesh(pickResult.pickedMesh)
          }
        }
        console.log(pickResult.pickedMesh.name);
    }
}

createScene()
//scene.debugLayer.show();
  

engine.runRenderLoop(() => {
  scene.render();
});