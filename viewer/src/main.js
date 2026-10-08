import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {MToonMaterial} from '@pixiv/three-vrm';
import './style.css';
const $=id=>document.getElementById(id),stage=$('stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.01,200),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.92;controls.minDistance=.15;
scene.add(new THREE.HemisphereLight(0xfff8ef,0x857767,1.8));const key=new THREE.DirectionalLight(0xfff1df,2.4);key.position.set(-3,6,5);scene.add(key);
let mixer,clip,action,model,playing=false,duration=0,face=false,focus=new THREE.Vector3(),height=1;const originals=[],toons=[],outlines=[];
const clock=new THREE.Clock();
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(stage);resize();
function view(){controls.target.copy(focus).add(new THREE.Vector3(0,face?height*.29:0,0));camera.position.copy(controls.target).add(new THREE.Vector3(0,face?height*.04:height*.09,face?height*.68:height*2.2));controls.update()}
function mode(){const toon=document.querySelector('input[name=look]:checked').value==='toon';originals.forEach(({mesh,material},i)=>mesh.material=toon?toons[i]:material);outlines.forEach(o=>o.visible=toon);$('ink').disabled=!toon}
function stamp(){const t=action?.time??0;$('stamp').value=`${t.toFixed(1)} / ${duration.toFixed(1)} 秒`;if(!scrubbing)$('time').value=t}
let scrubbing=false;
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'一時停止':'再生'};
$('reset').onclick=()=>{playing=false;$('play').textContent='再生';mixer.setTime(0);stamp()};
$('time').oninput=()=>{scrubbing=true;playing=false;$('play').textContent='再生';mixer.setTime(Number($('time').value));stamp();scrubbing=false};
$('face').onclick=()=>{face=!face;$('face').textContent=face?'全身に戻る':'顔を拡大';view()};
document.querySelectorAll('[name=look]').forEach(el=>el.onchange=mode);
$('ink').oninput=()=>{$('inkvalue').value=Number($('ink').value).toFixed(1);outlines.forEach(o=>{const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.outlineWidthFactor=height*.0013*Number($('ink').value))})};
const loader=new GLTFLoader();loader.load(import.meta.env.BASE_URL+'models/Naruebi.glb',g=>{
model=g.scene;scene.add(model);const box=new THREE.Box3().setFromObject(model);height=box.getSize(new THREE.Vector3()).y;box.getCenter(focus);view();controls.maxDistance=height*6;
const meshes=[];model.traverse(o=>{if(o.isMesh)meshes.push(o)});
for(const mesh of meshes){const original=mesh.material;const make=m=>{if(m.map){m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();m.map.minFilter=THREE.LinearMipmapLinearFilter;m.map.magFilter=THREE.LinearFilter}return new MToonMaterial({color:m.color.clone(),map:m.map,shadeColorFactor:m.color.clone().multiplyScalar(.68),shadeMultiplyTexture:m.map,shadingToonyFactor:1,shadingShiftFactor:-.1,giEqualizationFactor:.75,normalMap:m.normalMap,emissive:m.emissive?.clone()??new THREE.Color(0),emissiveMap:m.emissiveMap,side:m.side,transparent:m.transparent,opacity:m.opacity,depthWrite:m.depthWrite,alphaTest:m.alphaTest})};const toon=Array.isArray(original)?original.map(make):make(original);originals.push({mesh,material:original});toons.push(toon);
const outline=mesh.clone(false);outline.material=(Array.isArray(toon)?toon:[toon]).map(m=>{const o=m.clone();o.isOutline=true;o.side=THREE.BackSide;o.outlineWidthMode='worldCoordinates';o.outlineWidthFactor=height*.0013;o.outlineColorFactor.set('#35221c');o.outlineLightingMixFactor=0;return o});if(!Array.isArray(toon))outline.material=outline.material[0];if(mesh.isSkinnedMesh){outline.skeleton=mesh.skeleton;outline.bindMatrix.copy(mesh.bindMatrix);outline.bindMatrixInverse.copy(mesh.bindMatrixInverse)}outline.renderOrder=1;mesh.parent.add(outline);outlines.push(outline)}
mode();clip=g.animations[0];if(clip){mixer=new THREE.AnimationMixer(model);action=mixer.clipAction(clip);action.play();duration=clip.duration;$('time').max=duration;$('play').disabled=false;$('reset').disabled=false;$('time').disabled=false;mixer.setTime(0);stamp()}$('status').textContent='公開GLB · 挨拶モーション';
},p=>{$('status').textContent=p.total?`読み込み中 ${Math.round(p.loaded/p.total*100)}%`:'モデルを読み込み中…'},e=>{$('status').textContent='モデルを読み込めませんでした。再読み込みしてください。';console.error(e)});
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);if(mixer&&playing){mixer.update(dt);stamp()}controls.update();renderer.render(scene,camera)});
