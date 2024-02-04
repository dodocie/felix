'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import { useGLTF, KeyboardControls, Float, Text, Sky, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'
import { RigidBody, Physics, CuboidCollider, RigidBodyApi } from "@react-three/rapier"

import { DirectionalLight } from "@/components/lights/DirectionalLight"
import Player from "@/components/portfolio/level-game/Player"
import Interface from "@/components/portfolio/level-game/Interface"
// import Effects from "@/components/portfolio/level-game/Effects"
import CloudSky from "@/components/portfolio/clouds"

import { useLevelGameStore } from '@/store/useGame'
import { useLava } from "@/hooks/useLava"

// THREE.ColorManagement.legacyMode = false

/**
 * ToDos：障碍物更逼真一些，关卡再多几个，障碍物间距会变
 * 【参考地下城真实的斧头】
 * a boost key?
 * 结束撒花
 * 不同难度等级
 * 音效和粒子
 * 闯关可以是弹珠，或别的
 * 激光射线一挨就挂
 * 
*/

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const ringGeometry = new THREE.RingGeometry(1.5, 2, 16)
const coneGeometry = new THREE.ConeGeometry(1.5, .4, 16, 1, true)

//反射需要在比较深的颜色里可见。
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen', metalness: 0, roughness: 0 })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow', metalness: 0, roughness: 0 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orange', metalness: 0, roughness: 1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey', metalness: 0, roughness: 0 })

export default async function Page() {
  const blockCount = useLevelGameStore(state => state.blockCount)
  const blockSeed = useLevelGameStore(state => state.blockSeed)

  return <div className="h-screen w-full">
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [2.5, 4, 6], fov: 45, near: .1, far: 200 }}
      >
        {/* <StatsGl /> */}
        <Sky />
        <Physics>
          {/* interpolate={false} colliders={false} */}
          <Level count={blockCount} seed={blockSeed} />
          <Player />
        </Physics>
        {/* <Effects /> */}
        <CloudSky />
        <DirectionalLight />
        {/* <OrbitControls makeDefault /> */}
      </Canvas>
      <Interface />
    </KeyboardControls>
  </div>
}

function Level({ count = 5, types = [BlockSpinner, BlockAxe, BlockLava, BlockLimbo], seed = 0 }) {
  const { camera, gl } = useThree()
  useEffect(() => {
    return () => {
      camera?.clear()
      gl.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const blockGroup = useMemo(() => {
    const blocks = []
    for (let i = 0; i < count; i++) {
      blocks.push(types[Math.floor(Math.random() * types.length)])
    }
    return blocks

    // 使用粗略的seed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, types, seed])

  return <>
    <BlockStart position={[0, 0, 0]} />
    {blockGroup.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)}
    <BlockEnd position={[0, 0, - (count + 1) * 4]} />
    <Bounds length={count + 2} />
  </>
}

function BlockStart({ position = [0, 0, 0] }: { position?: [x: number, y: number, z: number] }) {
  return <group position={position}>
    <Float floatIntensity={.25} rotationIntensity={.25}>
      {/* text的材质是meshStandardMaterial，所以颜色会比较暗 */}
      <Text
        // font="xxx.woff"
        scale={.5}
        maxWidth={.25}
        lineHeight={.75}
        textAlign="right"
        position={[.75, .65, -1]}
        rotation={[0, -.25, 0]}
      >
        Marble Race
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </Float>
    <mesh
      geometry={boxGeometry}
      material={floor1Material}
      position={[0, -0.1, 0]}
      scale={[4, .2, 4]}
      receiveShadow
    />
  </group>
}
function BlockEnd({ position = [0, 0, 0] }: { position?: [x: number, y: number, z: number] }) {
  const hamburger = useGLTF('/assets/gltf/hamburger.glb')
  hamburger.scene.children.forEach(mesh => {
    mesh.castShadow = true
  })

  return <group position={position}>
    <Text
      // font="xxx.woff"
      scale={.5}
      position={[0, 2.25, 2]}
    >
      FINISH
      <meshBasicMaterial toneMapped={false} />
    </Text>
    <mesh
      geometry={boxGeometry}
      material={floor1Material}
      position={[0, -0.1, 0]}
      scale={[4, .2, 4]}
      receiveShadow
    />
    <RigidBody type="fixed" colliders="hull" position={[0, .25, 0]}>
      <primitive object={hamburger.scene} scale={.2} restitution={.2} friction={0} />
    </RigidBody>
  </group>
}

function Bounds({ length = 1 }) {
  return <>
    <RigidBody type="fixed" restitution={.2} friction={0}>
      <mesh
        position={[2.15, .75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[.3, 1.5, 4 * length]}
        castShadow
      />
      <mesh
        position={[-2.15, .75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[0, .75, -(length * 4) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, .3]}
        receiveShadow
      />
      {/* 0.9版本没有ringCollider，暂时无法模拟陷入沼泽。 */}
      <CuboidCollider args={[2, .1, length * 2]} position={[0, -.1, -(length * 2) + 2]} restitution={.2} friction={1} />
    </RigidBody>

  </>
}


/**
 * Traps
*/
function BlockSpinner({ position = [0, 0, 0] }: { position?: [x: number, y: number, z: number] }) {
  const [speed] = useState(() => (Math.random() + .2) * (Math.random() < .5 ? -1 : 1))

  const updateFunction = (time: number, obstacle: RigidBodyApi) => {
    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
    obstacle.setNextKinematicRotation(rotation)
  }

  return <Trap position={position} updateFunction={updateFunction} />
}
function BlockLimbo({ position = [0, 0, 0] }: { position?: [x: number, y: number, z: number] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  const updateFunction = (time: number, obstacle: RigidBodyApi) => {
    const y = Math.sin(time + timeOffset) + 1.15
    obstacle.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
  }

  return <Trap position={position} updateFunction={updateFunction} />
}

function BlockAxe({ position = [0, 0, 0] }: { position?: [x: number, y: number, z: number] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  const updateFunction = (time: number, obstacle: RigidBodyApi) => {
    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + .75, z: position[2] })
  }

  return <Trap position={position} rigidScale={[1.5, 1.5, .3]} updateFunction={updateFunction} />
}

interface TrapProps {
  position?: [number, number, number]
  rigidScale?: [number, number, number]
  scale?: [number, number, number]
  updateFunction: (time: number, obstacle: RigidBodyApi) => void
}

function Trap({ position = [0, 0, 0], scale = [4, .2, 4], rigidScale = [3.5, .3, .3], updateFunction }: TrapProps) {
  const obstacle = useRef<RigidBodyApi>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    updateFunction(time, obstacle.current!)
  })

  return <group position={position}>
    <mesh
      geometry={boxGeometry}
      material={floor2Material}
      position={[0, -0.1, 0]}
      scale={scale}
      receiveShadow
    />
    <RigidBody ref={obstacle} type="kinematicPosition" position={[0, .3, 0]} restitution={.2} friction={0} >
      <mesh
        geometry={boxGeometry}
        material={obstacleMaterial}
        scale={rigidScale}
        castShadow
        receiveShadow
      />
    </RigidBody>

  </group>
}

function BlockLava({ position = [0, 0, 0] }: Omit<TrapProps, 'updateFunction'>) {
  const obstacle = useRef<RigidBodyApi>(null)
  const { lavaMaterial } = useLava()
  lavaMaterial.side = THREE.BackSide

  useFrame((_, delta) => {
    lavaMaterial.uniforms.time.value += delta * .5
  })

  return <group position={position}>
    <RigidBody
      type="kinematicPosition"
      mass={1}
      restitution={0.2}
      friction={0}
    >
      <mesh
        geometry={ringGeometry}
        material={floor2Material}
        rotation={[-Math.PI / 2, 0, -Math.PI / 4]}
        position={[0, -0.01, 0]}
        receiveShadow
      />
    </RigidBody>

    <RigidBody
      ref={obstacle}
      type="kinematicPosition"
      position={[0, -.21, 0]}
      mass={1}
      restitution={0}
      friction={1}
      linearDamping={0.6}  // 增加线性阻尼
      angularDamping={0.6}  // 增加角阻尼
    // onIntersectionEnter={}
    >
      <mesh
        geometry={coneGeometry}
        material={lavaMaterial}
        receiveShadow
        rotation={[0, Math.PI / 4, Math.PI]}
      />
    </RigidBody>
  </group>
}