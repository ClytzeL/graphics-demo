import * as THREE from 'three';

export default class ChangedPlanes extends THREE.Group {
  private startColor: THREE.Color;
  private endColor: THREE.Color;
  private currentTime: number;
  private duration: number;
  private shaderMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private basicMesh: THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private shaderStartFlag: boolean;
  private useColor=new THREE.Color();
  constructor() {
    super();
    this.startColor = new THREE.Color(0xffffff);
    this.endColor = new THREE.Color(0xff0000);
    this.currentTime = Date.now();
    this.duration = 1000;
    this.shaderStartFlag = false;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const basicMaterial = new THREE.MeshBasicMaterial({color:this.startColor});
    this.basicMesh = new THREE.Mesh(geometry,basicMaterial);
    this.basicMesh.position.set(-1,0,0);
    this.add(this.basicMesh);

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms:{
            'color' : { value : this.startColor }
        },
        vertexShader:
            `
            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader:
            `
            uniform vec3 color;
            
            void main(){
                gl_FragColor = vec4(color, 1.0);
            }`
    })
    this.shaderMesh = new THREE.Mesh(geometry, shaderMaterial);
    this.shaderMesh.position.set(1, 0, 0);
    this.add(this.shaderMesh)
  }
  public update(): void {
    const elapsed = Date.now() - this.currentTime;
    const progress = elapsed/this.duration % 1;
    this.useColor.copy(this.startColor).lerp(this.endColor,progress);
    this.basicMesh.material.color= this.useColor;
    if(this.shaderStartFlag){
      this.shaderMesh.material.uniforms.color.value = this.useColor;
    }
    this.shaderStartFlag= elapsed >= this.duration;
  } 
}