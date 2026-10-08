import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {VRMLoaderPlugin} from '@pixiv/three-vrm';
import {VRMAnimationLoaderPlugin,createVRMAnimationClip} from '@pixiv/three-vrm-animation';
import './style.css';
const $=id=>document.getElementById(id),stage=$('stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.01,2000),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.92;
scene.add(new THREE.HemisphereLight(0xfff8ef,0x857767,1.4));const key=new THREE.DirectionalLight(0xfff1df,2);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);
let vrm,mixer,action,playing=false,duration=0,face=false,height=1,focus=new THREE.Vector3(),ready=false;const clock=new THREE.Clock();const expressions=['blink','blinkLeft','blinkRight','happy','aa','oh'];
function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(stage);resize();
function view(){if(face&&vrm){vrm.humanoid.getRawBoneNode('head').getWorldPosition(controls.target);controls.target.y+=height*.025}else controls.target.copy(focus);const narrow=stage.clientWidth<600;camera.position.copy(controls.target).add(new THREE.Vector3(0,height*.04,face?height*.95:height*(narrow?2.8:2.2)));controls.update()}
function stamp(){$('stamp').value=`${(action?.time??0).toFixed(1)} / ${duration.toFixed(1)} 秒`;$('time').value=action?.time??0}
function pause(){playing=false;$('play').textContent='再生'}
function applyExpressions(){if(!vrm)return;for(const name of expressions)vrm.expressionManager.setValue(name,Number($(name).value));vrm.expressionManager.update()}
for(const name of expressions){$(name).oninput=()=>{const exclusive=name.startsWith('blink')?['blink','blinkLeft','blinkRight']:['happy','aa','oh'];for(const other of exclusive)if(other!==name)$(other).value=0;applyExpressions()}}
$('neutral').onclick=()=>{expressions.forEach(n=>$(n).value=0);applyExpressions()};
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'一時停止':'再生'};
function seek(t){if(!mixer)return;pause();mixer.setTime(t);vrm.humanoid.update();vrm.springBoneManager?.reset();applyExpressions();stamp()}
$('reset').onclick=()=>{seek(0);expressions.forEach(n=>$(n).value=0);applyExpressions();face=false;view()};$('time').oninput=()=>seek(Number($('time').value));$('spring').onchange=()=>vrm?.springBoneManager?.reset();
$('face').onclick=()=>{face=!face;$('face').textContent=face?'全身に戻る':'顔を拡大';view()};
$('ink').oninput=()=>{$('inkvalue').value=Number($('ink').value).toFixed(1);for(const m of vrm?.materials??[])if(m.isMToonMaterial&&!m.transparent)m.outlineWidthFactor=height*.0011*Number($('ink').value)};
async function load(){try{
const loader=new GLTFLoader();loader.register(p=>new VRMLoaderPlugin(p));loader.register(p=>new VRMAnimationLoaderPlugin(p));
const gltf=await loader.loadAsync(import.meta.env.BASE_URL+'models/Naruebi.vrm',p=>{$('status').textContent=p.total?`読み込み中 ${Math.round(p.loaded/p.total*100)}%`:'モデルを読み込み中…'});vrm=gltf.userData.vrm;scene.add(vrm.scene);vrm.scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(vrm.scene);height=box.getSize(new THREE.Vector3()).y;box.getCenter(focus);camera.far=height*20;camera.near=height*.001;camera.updateProjectionMatrix();controls.minDistance=height*.2;controls.maxDistance=height*6;view();
key.position.set(-height*2,height*4,height*3);key.target.position.copy(focus);scene.add(key.target);const sc=key.shadow.camera;sc.left=sc.bottom=-height*2;sc.right=sc.top=height*2;sc.near=height*.01;sc.far=height*10;sc.updateProjectionMatrix();key.shadow.bias=-.0002;
const floor=new THREE.Mesh(new THREE.CircleGeometry(height*1.2,64),new THREE.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=box.min.y;floor.receiveShadow=true;scene.add(floor);
vrm.scene.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];o.castShadow=!mats.some(m=>m.transparent);o.receiveShadow=false;for(const m of mats){for(const t of [m.map,m.shadeMultiplyTexture])if(t){t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.needsUpdate=true}if(m.isMToonMaterial){m.shadingToonyFactor=.95;m.shadingShiftFactor=-.12;if(m.transparent){m.depthWrite=false;m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;o.renderOrder=10;m.outlineWidthFactor=0}else{m.outlineWidthFactor=height*.0011;m.outlineColorFactor.set('#35221c')}}}});
$('ink').oninput();
const motion=await loader.loadAsync(import.meta.env.BASE_URL+'models/Greeting.vrma');const clip=createVRMAnimationClip(motion.userData.vrmAnimations[0],vrm);mixer=new THREE.AnimationMixer(vrm.scene);action=mixer.clipAction(clip);action.play();duration=clip.duration;$('time').max=duration;seek(0);ready=true;document.querySelectorAll('button,input').forEach(el=>el.disabled=false);$('status').textContent='VRM · 挨拶モーション · GOROman';
}catch(e){$('status').textContent='読み込みに失敗しました。再読み込みしてください。';console.error(e)}}load();
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);if(vrm){if(mixer&&playing)mixer.update(dt);vrm.humanoid.update();applyExpressions();if($('spring').checked)vrm.springBoneManager?.update(dt);for(const m of vrm.materials??[])m.update?.(dt);stamp()}controls.update();renderer.render(scene,camera)});
// Read-only state for reproducible QA; contains no local paths or private metadata.
window.viewerState=()=>({ready,playing,duration,time:action?.time??0,height,spring:$('spring').checked,expressions:Object.fromEntries(expressions.map(n=>[n,vrm?.expressionManager.getValue(n)]))});
