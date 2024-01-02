import * as THREE from 'three'
import { Global } from '@/utils/Global';
import ChangedPlanes from '../changed-planes';
import CheckerBoard from '../checkerboard';
import CircleOnPlane from '../circleOnPlane';
import Fade from '../fade';

export default class Stage {
    private renderer:THREE.WebGLRenderer;
    private scene:THREE.Scene;
    private camera:THREE.PerspectiveCamera;
    private changedPlanes: ChangedPlanes;
    private checkerBoard: CheckerBoard;
    private circleOnPlane: CircleOnPlane;
    private fade: Fade;
    constructor(canvas:HTMLCanvasElement){
        this.renderer = new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
        this.renderer.setClearColor( 0x6a6a6a, 1 )
        this.renderer.outputColorSpace = "";
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1,1000);
        this.camera.position.set(0,0,10);
        this.camera.lookAt(0,0,-1);
        this.scene.add(this.camera);
        const directionalLight = new THREE.DirectionalLight(0xffffff,0.75);
        this.scene.add(directionalLight);
        const ambientLight = new THREE.AmbientLight(0xffffff,0.75);
        this.scene.add(ambientLight);

        Global.camera = this.camera;
        Global.renderer = this.renderer;
        Global.scene = this.scene;

        // this.changedPlanes = new ChangedPlanes();
        // this.changedPlanes.position.set(0,2,0);
        // this.scene.add(this.changedPlanes);

        // this.checkerBoard = new CheckerBoard();
        // this.scene.add(this.checkerBoard);

        // this.circleOnPlane = new CircleOnPlane(8,5);
        // this.scene.add(this.circleOnPlane);

        this.fade = new Fade();
        this.scene.add(this.fade);

    }
    public start(){
        this.renderer.setAnimationLoop(this.render.bind(this))
    }
    private render(){
        // this.changedPlanes.update();
        // this.checkerBoard.update();
        this.fade.update();
        Global.updateCallBacks();
        this.renderer.render(this.scene,this.camera);
    }
}