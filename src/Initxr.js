import { playerCollider, Shooting, switchCamera } from "./script";

let Shot = false;
let xr;

export let xrCamera;

export const createXRExperience = async (gunMesh,scene) => {
    xr = await scene.createDefaultXRExperienceAsync();
    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
      playerCollider.parent = xr.baseExperience.camera;
      playerCollider.position = new BABYLON.Vector3(0,0,0);
    });
    const webXRInput = await xr.input;
    const featuresManager = xr.baseExperience.featuresManager;
    
    switchCamera(xr.baseExperience.camera)

    const teleportation = featuresManager.enableFeature(
      BABYLON.WebXRFeatureName.TELEPORTATION,
      "stable",
      {
        xrInput: xr.input,
        floorMeshes: [scene.getMeshByName("navmesh")],
        forceHandedness: "left",
        timeToTeleport: 2000,
        //useMainComponentOnly: true,
      }
    );
    xr.pointerSelection = xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRControllerPointerSelection, 'latest',{
      xrInput: xr.input,
      enablePointerSelectionOnAllControllers: false,
      preferredHandedness: 'left',
      disableSwitchOnClick: true,
      maxPointerDistance: 2
  })
  
    teleportation.parabolicRayEnabled = true;
    teleportation.parabolicCheckRadius = 5;
  

    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
        if (motionController.handness === "left") {
          const xr_ids = motionController.getComponentIds();
          let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
          triggerComponent.onButtonStateChangedObservable.add(() => {
            if (triggerComponent.pressed) {
            } else {
            }
          });       
        }
        if (motionController.handness === "right") {
          motionController.onModelLoadedObservable.add(() => {
            motionController.rootMesh = gunMesh;
          });
          const xr_ids = motionController.getComponentIds();
          let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
          triggerComponent.onButtonStateChangedObservable.add(() => {
            if (triggerComponent.pressed) {
              
              if(Shot == false)
              {
                //flash.isVisible = true;
                Shooting();
                Shot = true;
              }
            } else {
              //flash.isVisible = false;
              Shot = false;
            }
          });
        }
      });
    });
  };

  export const endLevel = async() =>{
     await xr.baseExperience.exitXRAsync()
     location.assign("https://i.kym-cdn.com/photos/images/facebook/000/900/804/439.png");
     //"https://www.youtube.com/watch?v=-ZGlaAxB7nI"
  }

