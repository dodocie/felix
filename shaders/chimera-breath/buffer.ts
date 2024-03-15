import * as THREE from 'three'
import { ThreeHelper } from '@/ThreeHelper'
import { BufferShader } from '../helpers/buffer'

import { common } from './common'
import { buffA } from './bufferA'
import { buffD } from './bufferD'

export async function init(helper: ThreeHelper) {
  helper.camera.position.set(0, 0, 2)
  helper.renderFrame()
  helper.controls.dispose()
  helper.camera.remove()

  const { width, height } = helper.renderer.getSize(new THREE.Vector2())

  /**
   * x, y 鼠标位置
   * z 鼠标是否按下状态
   * w 点击事件触发时为1，其余为0
   */
  const iMouse = new THREE.Vector4()
  const handler = (e: MouseEvent) => {
    iMouse.x = e.pageX
    iMouse.y = window.innerHeight - e.pageY
  }
  document.addEventListener('mousedown', e => {

    iMouse.z = 2
    iMouse.w = 2

    document.addEventListener('mouseup', () => {
      iMouse.z = 0
      iMouse.w = 0
      document.removeEventListener('mousemove', handler)
    })
    document.addEventListener('mousemove', handler)
  })

  /**
   * x, y canvas 宽高
   * z renderer 像素比
   */
  const iResolution = new THREE.Vector3(width, height, helper.renderer.getPixelRatio())


  const uniformFrag = /*glsl*/`
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec4 iMouse;
  uniform float iFrame;
  uniform sampler2D iChannel0;
  `

  const bufferAFrag = /*glsl*/`
  ${uniformFrag}
  ${common}
  ${buffA}
  `

  const bufferDFrag = /*glsl*/`
  ${uniformFrag}
  uniform sampler2D iChannel1;

  ${common}
  ${buffD}
  `

  const mainFrag = /*glsl*/`
  ${uniformFrag}
  void main(){
    vec4 col = textureLod(iChannel0, gl_FragCoord.xy/iResolution.xy, 0.);
    if (gl_FragCoord.y < 1. || gl_FragCoord.y >= (iResolution.y-1.))
      col = vec4(0);
    gl_FragColor = col;
  }
  `

  const mainUniforms = {
    iResolution: { value: iResolution },
    iChannel0: { value: null },
    iChannel1: { value: null },
  }
  const uniforms = {
    iTime: { value: 0 },
    iFrame: { value: 0 },
    iMouse: { value: iMouse },
    ...mainUniforms
  }
  const bufferA = new BufferShader(
    helper.renderer,
    helper.camera,
    uniforms,
    bufferAFrag,
    iResolution.x,
    iResolution.y
  )
  const bufferB = new BufferShader(
    helper.renderer,
    helper.camera,
    uniforms,
    bufferAFrag,
    iResolution.x,
    iResolution.y
  )
  const bufferC = new BufferShader(
    helper.renderer,
    helper.camera,
    uniforms,
    bufferAFrag,
    iResolution.x,
    iResolution.y
  )

  const bufferD = new BufferShader(
    helper.renderer,
    helper.camera,
    uniforms,
    bufferDFrag,
    iResolution.x,
    iResolution.y
  )
  const mainBuffer = new BufferShader(
    helper.renderer,
    helper.camera,
    mainUniforms,
    mainFrag,
    iResolution.x,
    iResolution.y
  )

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2 * width / height, 2),
    new THREE.MeshBasicMaterial({ map: mainBuffer.readBuffer.texture })
  )

  helper.add(plane)

  helper.animation(() => {
    const delta = helper.clock.getDelta()

    bufferA.uniforms.iChannel0.value = bufferC.readBuffer.texture
    bufferA.uniforms.iFrame.value++
    bufferA.uniforms.iTime.value += delta
    bufferA.render()

    bufferB.uniforms.iChannel0.value = bufferA.readBuffer.texture
    bufferB.uniforms.iFrame.value++
    bufferB.uniforms.iTime.value += delta
    bufferB.render()

    bufferC.uniforms.iChannel0.value = bufferB.readBuffer.texture
    bufferC.uniforms.iFrame.value++
    bufferC.uniforms.iTime.value += delta
    bufferC.render()

    bufferD.uniforms.iChannel0.value = bufferA.readBuffer.texture
    bufferD.uniforms.iChannel1.value = bufferD.readBuffer.texture
    bufferD.uniforms.iFrame.value++
    bufferD.uniforms.iTime.value += delta
    bufferD.render()

    mainBuffer.uniforms.iChannel0.value = bufferD.readBuffer.texture
    mainBuffer.render()
  })
}
