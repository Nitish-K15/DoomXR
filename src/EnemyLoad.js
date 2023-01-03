import * as BABYLON from "babylonjs"
import { enemySoundPlay, enemySoundStop, playGunShot, setEnemySound } from "./Audio";
import { endLevel } from "./Initxr";
import { camera, LocalAdvTex, playerCollider } from "./script";

let textures = [];

export const LoadEnemy=(scene) =>{
    let enemy = new BABYLON.MeshBuilder.CreatePlane("Zombie",{size: 3},scene);
    enemy.isVisible = false;
    enemy.isPickable = false;

    for( let i = 0;i<12;i++)
    {
        textures[i] = new BABYLON.Texture("assets/sprite_0"+i+".png",scene);
    }

    SpawnEnemy(scene,enemy,new BABYLON.Vector3(74.923,-6.441,-14.795));
    SpawnEnemy(scene,enemy,new BABYLON.Vector3(107.893,-6.441,40.227));
    SpawnEnemy(scene,enemy,new BABYLON.Vector3(178.125,-4.675,64.007));
    SpawnEnemy(scene,enemy,new BABYLON.Vector3(219.992,-7.603,37.444));
    SpawnEnemy(scene,enemy,new BABYLON.Vector3(231.879,-8.219,5.502));
    SpawnEnemy(scene,enemy,new BABYLON.Vector3(235.137,-8.219,-75.066));
}

export const SpawnEnemy=(scene,enemy,startingPosition) =>{

    let enemy1 = enemy.clone("Zombie");
    enemy1.isVisible = true;
    enemy1.metadata = {health: 100,isAlive: true};
    enemy1.position = startingPosition
    enemy1.isPickable = true;
    let mat = new BABYLON.StandardMaterial("test",scene);
    mat.emissiveTexture = textures[0]
    mat.diffuseTexture = textures[0];
    mat.diffuseTexture.hasAlpha = true; 
    mat.backFaceCulling = false;
    enemy1.material = mat;
    
    setEnemySound(scene,enemy1)

    let VrRay = new BABYLON.Ray();
    let VrRayHelper = new BABYLON.RayHelper(VrRay);
    
    let dir = new BABYLON.Vector3(0, 0.1, 1);
    let rayOrigin = new BABYLON.Vector3.Zero();
    let length = 500;
    let canShoot = false;
    let temp = 4;
    
    movement(mat,canShoot,enemy1,temp,VrRay,scene)

    VrRayHelper.attachToMesh(enemy1, dir, rayOrigin, length);
    //VrRayHelper.show(scene,new BABYLON.Color3.Red);
}




const movement =(mat,canShoot,enemy1,temp,VrRay,scene) =>{
    setTimeout(() => {
        if(enemy1 && enemy1.metadata.isAlive){
            enemy1.lookAt(new BABYLON.Vector3(camera.position.x,enemy1.position.y,camera.position.z));
            if(BABYLON.Vector3.DistanceSquared(camera.position,enemy1.position) <100)
            {
                canShoot = true;  
            }
            else
            {
                canShoot = false; 
            }
            if(canShoot)
            {
                let pickResult = scene.pickWithRay(VrRay);
                
                if(pickResult.hit)
                {
                    playGunShot();
                    if(pickResult.pickedMesh.name == "playerCollider")
                       {
                        let num = Math.random()
                        if(num > 0.5)
                        {
                            pickResult.pickedMesh.metadata.health -= 10;
                            const healthBar = LocalAdvTex.getChildren()[0].children[0].children[0];
                            healthBar.width = `${pickResult.pickedMesh.metadata.health}%`;
                            if(pickResult.pickedMesh.metadata.health <= 40)
                            {
                                healthBar.background = "Red";
                            }
                            console.log(pickResult.pickedMesh.metadata.health); 
                            if(pickResult.pickedMesh.metadata.health <=0)
                            {
                                endLevel();
                            }  
                        }
                       } 
                }
                mat.emissiveTexture = textures[temp];
                mat.diffuseTexture = textures[temp];
                mat.diffuseTexture.hasAlpha = true;
                temp++;
                if(temp == 6)
                {
                    temp = 4;
                } 
    
            }
            else
            {
                mat.emissiveTexture = textures[0];
                mat.diffuseTexture = textures[0];
                mat.diffuseTexture.hasAlpha = true;
            }
                movement(mat,canShoot,enemy1,temp,VrRay,scene);
        }
          
    },200)
}