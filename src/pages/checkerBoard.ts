import * as THREE from 'three'

export default class CheckerBoard extends THREE.Group{
    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    private mesh1: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    private mesh2: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    private mesh3: THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;
    private tile:number;
    private startTime:number;
    // private clock:THREE.Clock;
    constructor(){
        super()
        this.tile=2;
        // this.clock = new THREE.Clock();
        this.startTime = Date.now();
        const geometry = new THREE.PlaneGeometry(2,2);
        const material = new THREE.ShaderMaterial({
            vertexShader:`
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader:`
                varying vec2 vUv;
                void main(){
                    float color = floor(2.0 * vUv.x);
                    gl_FragColor = vec4(vec3(color),1.0);
                }
            `
        });
        this.mesh = new THREE.Mesh(geometry,material);
        this.mesh.position.set(-4,4,0);
        this.add(this.mesh);

        const material1 = new THREE.ShaderMaterial({
            vertexShader:`
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            // fragmentShader:`
            //     varying vec2 vUv;
            //     void main(){
            //         float colorX = floor(2.0 * vUv.x);
            //         float colorY = floor(2.0 * vUv.y);
            //         int color = 1 - int(colorX)^int(colorY);
            //         gl_FragColor = vec4(vec3(color),1.0);
            //     }
            // `
            // fragmentShader:`
            //     varying vec2 vUv;
            //     void main(){   
            //         vec2 vUv1 = floor(2.0 * vUv);
            //         int color = 1 - int(vUv1.x)^int(vUv1.y);
            //         gl_FragColor = vec4(vec3(color),1.0);
            //     }
            // `
            fragmentShader:`
                varying vec2 vUv;
                void main(){
                    float colorX = floor(2.0 * vUv.x);
                    float colorY = floor(2.0 * vUv.y);
                    float color = 1.0 - abs(colorX - colorY);
                    gl_FragColor = vec4(vec3(color),1.0);
                }
            `
        })
        this.mesh1 = new THREE.Mesh(geometry,material1);
        this.mesh1.position.set(0,4,0)
        this.add(this.mesh1);
        const material2 = new THREE.ShaderMaterial({
            uniforms:{
                tile:{ value:this.tile}
            },
            vertexShader:`
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader:`
                uniform float tile;
                varying vec2 vUv;
                // 使用 mod 函数计算行列值之和的奇偶性，并使用 mix 函数计算黑白颜色
                vec4 getColor(float x,float y){
                    float modValue = mod(x+y,2.0);
                    return mix(vec4(1.0,1.0,1.0,1.0),vec4(0.0,0.0,0.0,1.0),modValue);
                }
                void main(){
                    // 将纹理坐标乘上tile值，得到当前格子的坐标;
                    vec2 uv = vUv * tile;
                    // 取整数部分，得到当前格子所在的行列值
                    float x = floor(uv.x);
                    float y = floor(uv.y);

                    gl_FragColor = getColor(x,y);
                }
            `
        });
        this.mesh2 = new THREE.Mesh(geometry,material2);
        this.mesh2.position.set(4,4,0);
        this.add(this.mesh2);

        const geometry1 = new THREE.PlaneGeometry(10,2);
        const material3 = new THREE.ShaderMaterial({
            uniforms:{
                progress:{ value: 0}
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
              uniform float progress;
              void main(){
                float val = step(vUv.x,progress);
                vec4 color = mix(vec4(0.0,0.0,0.0,1.0),vec4(1.0,1.0,1.0,1.0),val);
                gl_FragColor = color;
              }
            `
        });
        this.mesh3 = new THREE.Mesh(geometry1,material3);
        this.add(this.mesh3);
    }
    public update():void{
        const gap = (Date.now() - this.startTime) / 1000;
        this.mesh3.material.uniforms.progress.value = gap;
        // 每1秒变化
        if(gap >=1){
            this.startTime = Date.now();
            this.tile = (this.tile + 1) % 10;
            this.mesh2.material.uniforms.tile.value = this.tile;
        }
        // const delta = this.clock.getDelta();
        // console.log(delta)
        // if(delta>=1.0){
        //     // this.clock.start();
        //     this.tile = (this.tile + 1) % 10;
        //     this.mesh2.material.uniforms.tile.value = this.tile;
        // }
    }
}