import { RigidBodyApi, RigidBody, useRapier } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from 'three'

import { useLevelGameStore } from "@/store/useGame"

export default function Player() {
  const body = useRef<RigidBodyApi>(null)

  const [subscribeKeys, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world.raw()
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 0, 0)) //镜头初始位置
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  const start = useLevelGameStore(state => state.start)
  const end = useLevelGameStore(state => state.end)
  const restart = useLevelGameStore(state => state.restart)
  const blockCount = useLevelGameStore(state => state.blockCount)

  const jump = () => {
    if (!body.current) return

    const origin = body.current.translation()
    origin.y -= .31

    //光线追踪方向
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = rapierWorld.castRay(ray, 10, true)

    if (hit!.toi < .15) {//如果这个值太大，说明球离地面太远，不准继续跳
      body.current.applyImpulse({ x: 0, y: .5, z: 0 }, false)
    }
  }

  const reset = () => {
    if (!body.current) return
    console.log('reset--')
    body.current.setTranslation({ x: 0, y: 1, z: 0 }, false)
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, false)
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, false)
  }

  useEffect(() => {
    const unsubscribePhase = useLevelGameStore.subscribe(
      state => state.phase,
      phase => {
        if (phase === 'ready') {
          reset()
        }
      }
    )

    const unsubscribeJump = subscribeKeys(
      state => state.jump,
      value => {
        value && jump()
      }
    )

    const unsubscribeAny = subscribeKeys(
      //任何订阅的key被按下时都会触发  
      state => start()
    )

    //本地HMR时，player组件代码如果有改动，组件会被销毁并重建，但传给subscribeKeys的函数会被重复调用，这样就导致跳的高度 * 2
    //组件销毁时，取消订阅事件
    return () => {
      console.log('取消订阅---')
      unsubscribeJump()
      unsubscribeAny()
      unsubscribePhase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state, delta) => {//不在每一帧响应jump，不然如果一直按space空格，物体就一直往空中窜
    if (!body.current) return

    /**
     * controls
    */
    const { forward, backward, leftward, rightward } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = .6 * delta
    const torqueStrength = .2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    /**
     * @param wakeUp - should the rigid-body be automatically woken-up? 是否自动唤醒。物理引擎通过休眠提高性能。
    */
  //  console.log(impulse)
  //  console.log(torque)
    body.current.applyImpulse(impulse, false)
    body.current.applyTorqueImpulse(torque, false)

    const bodyPosition = body.current.translation()
    // console.log('bodyPosition', bodyPosition)

    /**
     * camera
    */
    const cameraPosition = new THREE.Vector3()
    const cameraTarget = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraTarget.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += .65
    cameraTarget.y += .25

    //使用delta，消除设备pixelratio差异造成的速度差异
    smoothedCameraPosition.lerp(cameraPosition, 3 * delta)
    smoothedCameraTarget.lerp(cameraPosition, 3 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    /**
     * Phases
    */
    if (bodyPosition.z < - (blockCount * 4 + 2)) {
      end()
    }
    if (bodyPosition.y < - 4) {
      restart()
    }
  })
  return <>
    <RigidBody ref={body} colliders='ball' position={[0, 1, 0]} restitution={.2} friction={1}>
      <mesh castShadow>
        <icosahedronGeometry args={[.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  </>
}