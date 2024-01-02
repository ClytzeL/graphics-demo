import * as THREE from 'three'

export default class Fade extends THREE.Group{
    private mesh: THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;
    private startTime:number;
    constructor(){
        super();
        this.startTime = Date.now();
        const material = new THREE.ShaderMaterial({
            uniforms:{
                cat:{ value: new THREE.TextureLoader().load('/images/cat.jpeg') },
                child:{ value: new THREE.TextureLoader().load('/images/child.jpeg') },
                progress:{ value:0}
            },
            vertexShader:`
              varying vec2 vUv;
              void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader:`
              varying vec2 vUv;
              uniform sampler2D cat;
              uniform sampler2D child;
              uniform float progress;
              void main(){
                float dis = length(vUv-0.5);
                float speed = (pow(2.0,0.5) - dis) / pow(2.0,0.5);
                gl_FragColor = mix(texture2D(cat,vUv),texture2D(child,vUv),clamp(smoothstep(0.7,1.0,speed) + progress,0.25,1.0));
                // gl_FragColor = mix(texture2D(cat,vUv),texture2D(child,vUv),0.0);
              }
            `
        });
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(8,5),material);
        this.add(this.mesh);
    }
    public update(): void {
        const progress = (Date.now() - this.startTime) / 1000;
        if(progress <=2){
            this.mesh.material.uniforms.progress.value = progress;
        }
    }
}