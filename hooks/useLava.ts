import * as THREE from 'three'

import { vertex, fragment } from '@/shaders/lava'

export function useLava() {
  const textureLoader = new THREE.TextureLoader()
  const cloudTexture = textureLoader.load('/assets/cloud.png')
  const lavaTexture = textureLoader.load('/assets/swamp.jpeg')
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping
  lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping
  lavaTexture.colorSpace = THREE.SRGBColorSpace

  const uniforms = {
    'fogDensity': { value: 0.001 },
    'fogColor': { value: new THREE.Vector3(1.0, 1.0, 1.0) },
    'time': { value: 1.0 },
    'uvScale': { value: new THREE.Vector2(1.0, 1.0) },
    'texture1': { value: cloudTexture },
    'texture2': { value: lavaTexture }
  }

  const lavaMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment
  })

  return {
    lavaMaterial
  }
}
