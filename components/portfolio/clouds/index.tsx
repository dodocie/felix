import * as THREE from "three"
import { Clouds, Cloud } from "@react-three/drei"
import { useControls } from 'leva'
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

const config = {
  seed: 1,
  segments: 20,
  volume: 1,
  opacity: .5,
  growth: 4, 
  speed: .3,
}
const [x, y, z] = [6, 1, 1]

export default function CloudSky() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if(!ref.current) return
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 8) / 4
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime / 8) / 2
  })

  return (
    <>
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud {...config} bounds={[x, y, z]} color='#fff' seed={2} position={[15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z]} color="#fff" seed={3} position={[-15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z]} color="#fff" seed={4} position={[0, 0, -12]} />
          <Cloud {...config} bounds={[x, y, z]} color="#fff" seed={5} position={[0, 0, 12]} />
          <Cloud concentrate="outside" growth={100} color="#fff" opacity={0.8} seed={0.3} bounds={200} volume={200} />
        </Clouds>
      </group>
    </>
  )
}
