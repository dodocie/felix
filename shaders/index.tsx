'use client'
import * as THREE from 'three'
import { ReactNode, useEffect, useRef } from 'react'
import { Canvas } from "@react-three/fiber"

import { ThreeHelper } from '@/ThreeHelper'
import { init } from './ink-wash/buffer'

interface Props {
  children: ReactNode
}

/**
 * 使用这种R3F的方式，颜色变浅了，无法抗锯齿，
*/
export default function ShaderContainer({children} : Props) {
  return <>
    <Canvas
      //@ts-ignore
      // size={{ width: window.innerWidth * Math.min(window.devicePixelRatio, 2), height: window.innerHeight * Math.min(window.devicePixelRatio, 2) }}
      gl={{ antialias: true, outputColorSpace: THREE.SRGBColorSpace, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 0, 2], fov: 45, aspect: window.innerWidth / window.innerHeight }}
    >
      {children}
    </Canvas>
  </>
}

export function ShaderContainer2() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if(ref.current) {

      const helper = new ThreeHelper({
        antialias: true,
        canvas: ref.current
      })
      init(helper)
      helper.listenResize()

      return () => {
        helper.clearScene()
        helper.stopFrame()
        helper.removeResizeListen()
        helper.removeKeyBoardListen()
      }
    }
  }, [])

  return <>
    <canvas ref={ref} style={{width: '100vw', height: '100vh'}}/>
  </>
}