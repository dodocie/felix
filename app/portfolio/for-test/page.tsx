'use client'

import { Canvas } from '@react-three/fiber'

const Scene = () => {

  return (
    <>
      <Canvas>
        <spotLight color="#b107db" position={[5, -10, 5]} intensity={0.8} />
        <ambientLight color="#ffffff" position={[5, -10, 5]} intensity={2} />
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4]} />
          {/* 材质 */}
          <meshPhongMaterial color="#fff" specular="#61dafb" shininess={10} />
        </mesh>
      </Canvas>
    </>
  )
}

export default Scene
