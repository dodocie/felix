import * as THREE from 'three'

export class BufferShader {
  scene = new THREE.Scene()
  readBuffer: THREE.WebGLRenderTarget<THREE.Texture>
  writeBuffer: THREE.WebGLRenderTarget<THREE.Texture>

  constructor(
    public renderer: THREE.WebGLRenderer,
    public camera: THREE.Camera,
    public uniforms: THREE.ShaderMaterial['uniforms'],
    public fragment: string,

    width: number,
    height: number
  ) {
    this.readBuffer = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    })
    this.writeBuffer = this.readBuffer.clone()

    this.createMesh()
  }

  swapBuffers() {// examples/jsm/postprocessing/EffectComposer.js - EffectComposer - swapBuffers
    const tmp = this.readBuffer
    this.readBuffer = this.writeBuffer
    this.writeBuffer = tmp
  }

  render() {
    this.renderer.setRenderTarget(this.writeBuffer)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(null)
    this.swapBuffers()
  }

  createMesh() {
    this.scene.add(new THREE.Mesh(
      //ToDo: 优化
      new THREE.PlaneGeometry(2 * this.readBuffer.width/this.readBuffer.height, 2),
      new THREE.ShaderMaterial({
        vertexShader: /*glsl*/`
          void main() {
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
        fragmentShader: this.fragment,
        uniforms: this.uniforms
      })
    ))
  }
}