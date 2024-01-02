import * as THREE from 'three';

export default class CircleOnPlane extends THREE.Group{
    private width: number;
    private height: number;
    private mesh: THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;

    constructor(width:number,height:number){
        super();
        this.width=width;
        this.height=height;
        const geometry = new THREE.PlaneGeometry(width,height);
        const material = new THREE.ShaderMaterial({
            uniforms:{
                width: { value: this.width },
                height: { value: this.height }
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
              uniform float width;
              uniform float height;
              void main(){
                vec2 vUv1 = vec2(vUv.x * width - width * .5,vUv.y * height - height * .5);
                float r = min(width,height) * 0.5;
                float len = length(vUv1);
                // float progress = mix(smoothstep(0.0,r,len),1.0,step(r,len));
                gl_FragColor = mix(vec4(0.0,0.0,0.0,1.0),vec4(1.0,1.0,1.0,1.0),smoothstep(0.0,r,len));
                gl_FragColor = mix(vec4(0.0,0.0,0.0,1.0),vec4(1.0,1.0,1.0,1.0),len/r);
                // gl_FragColor = vec4(vec3(length((vUv - .5) * normalize(vec2(width, height))) * 4.),1.0);
                gl_FragColor = vec4(vec3(length((vUv - .5) * vec2(width/height, 1.)) * 2.0),1.0);
              }
            `
        });
        this.mesh = new THREE.Mesh(geometry,material);
        this.add(this.mesh);
    }
}