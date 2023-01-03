import * as BABYLON from "babylonjs"

let gunSound;
let enemySound;
export const playAudio = (scene) =>
{
    let ambient = new BABYLON.Sound("E1M1","assets/d-e1m1.mp3",scene,()=>{
        ambient.play();
    },{
        loop: true,
        autoplay: true,
        volume: 0.05
    })
    gunSound = new BABYLON.Sound("GunShot","assets/dspistol.wav",scene,()=>{
    },{
        loop: false,
        autoplay: false,
        volume: 0.1
    })
}

export const setEnemySound = (scene,mesh) =>
{
    enemySound = new BABYLON.Sound("EnemySound","assets/dsposact.wav",scene,()=>{
    },{
        loop: true,
        autoplay: true,
        volume: 0.7,
        refDistance: 10,
        maxDistance: 15,
    })

    enemySound.attachToMesh(mesh);
}

export const enemySoundStop = () =>
{
    enemySound.stop();
}

export const enemySoundPlay = () =>
{
    enemySound.play();
}

export const playGunShot = () =>
{
    gunSound.play();
}

