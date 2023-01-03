export function PlayerMovement(Player,playerAnim,isMoving,vector)
{
       if(isMoving)
    {
        if(Math.round(BABYLON.Vector3.DistanceSquared(Player.position,vector))>0)
        {
            Player.movePOV(0,0,-0.1);
            playerAnim[1].play(true);
            playerAnim[0].stop();
        }
        else
        {
            isMoving = false;
            playerAnim[0].play(true);
            playerAnim[1].stop();
        }
    }
}

export function SettingCamera(scene,canvas,camLookAt)
{
    const camera = new BABYLON.ArcRotateCamera("cam",Math.PI/2,Math.PI/2.5,10,new BABYLON.Vector3(0,10,0),scene);
    camera.attachControl(canvas,true);
    camera.upperBetaLimit = Math.PI/2.2;
    camera.lowerBetaLimit = 0.7;
    camera.inputs.remove(camera.inputs.attached.mousewheel);
    camera.setTarget(camLookAt);
}

export function CreateReticle(scene,impact)
{
    impact = BABYLON.Mesh.CreatePlane("impact", 1, scene,true);
    impact.material = new BABYLON.StandardMaterial("impactMat", scene);
    impact.material.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/XFsmeNR.png", scene);
    impact.material.diffuseTexture.hasAlpha = true;
    impact.position = new BABYLON.Vector3(0, -1.7, 0);
    impact.rotation.x = Math.PI / 2;
    impact.isPickable = false;
    return impact;
}