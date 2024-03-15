'use client'
import * as THREE from 'three'
import { useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"

const mouse = new THREE.Vector2()

export default function Page() {

  return (
    <Canvas
      shadows
      // frameloop="demand"
      gl={{ antialias: true }}
      style={{ position: 'fixed', zIndex: -1, top: 0, left: 0 }}
      camera={{ position: [0, 0, 6], fov: 45, near: .1, far: 1000 }}
    >
      <Plane />
    </Canvas>
  )
}

function Plane() {
  const catTexture = useLoader(THREE.TextureLoader, '/assets/sleepy_cat.jpeg')
  const catDepthTexture = useLoader(THREE.TextureLoader, '/assets/sleepy_cat_disparity.png')

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: catTexture },
      uDepthTexture: { value: catDepthTexture },
      uMouse: { value: mouse },
      uTime: { value: 0 }
    },
    vertexShader: /*glsl*/`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /*glsl*/`
      uniform sampler2D uTexture;
      uniform sampler2D uDepthTexture;
      uniform vec2 uMouse;
      uniform float uTime;

      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(uTexture, vUv);
        vec4 depth = texture2D(uDepthTexture, vUv);
        float depthValue = depth.r;
        float x = vUv.x + (uMouse.x + sin(uTime)) * 0.01 * depthValue;
        float y = vUv.y + (uMouse.y + cos(uTime)) * 0.01 * depthValue;
        vec4 newColor = texture2D(uTexture, vec2(x, y));
        gl_FragColor = newColor;
      }
    `
  })

  useFrame((state) => {
    material.uniforms.uMouse.value = mouse

    const elapsedTime = state.clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime
  })

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)

    return () => {
      window.removeEventListener('mousemove', handler)
    }
  }, [])

  return <>
    <mesh material={material}>
      <planeGeometry args={[9.6, 5.4]} />
    </mesh>
  </>
}