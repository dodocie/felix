"use client"
import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"

import { BufferShader } from '../helpers/buffer'
import { frag } from './frag'

export default function Inkwash() {
  const { gl, camera } = useThree()

  const { width, height } = gl.getSize(new THREE.Vector2())
  console.log('wee', width, height)

  //分辨率
  const iResolution = new THREE.Vector3(width, height, gl.getPixelRatio())

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: iResolution },
  }
  const mainBuffer = new BufferShader(
    gl,
    camera,
    uniforms,
    frag,
    iResolution.x,
    iResolution.y
  )

  useFrame((_, delta) => {
    mainBuffer.uniforms.iTime.value += delta
    mainBuffer.render()
  })

  return <>
    <mesh>
      <planeGeometry args={[2 * width / height, 2]} />
      <meshBasicMaterial map={mainBuffer.readBuffer.texture} />
    </mesh>
  </>
}