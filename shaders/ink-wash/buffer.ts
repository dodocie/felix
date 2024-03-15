import * as THREE from 'three'
import { ThreeHelper } from '@/ThreeHelper'
import { BufferShader } from '../helpers/buffer'
import { frag } from './frag'

export function init(helper: ThreeHelper) {
  helper.camera.position.set(0, 0, 2)
  helper.renderFrame()
  // helper.controls.dispose()
  helper.camera.remove()

  const { width, height } = helper.renderer.getSize(new THREE.Vector2())
  console.log('www--', width, height)
  //分辨率
  const iResolution = new THREE.Vector3(width, height, helper.renderer.getPixelRatio())

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: iResolution },
  }
  const mainBuffer = new BufferShader(
    helper.renderer,
    helper.camera,
    uniforms,
    frag,
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
    mainBuffer.uniforms.iTime.value += delta
    mainBuffer.render()
  })
}