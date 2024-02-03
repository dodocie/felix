import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export const DirectionalLight = () => {
  const light = useRef<THREE.DirectionalLight>(null)
  useFrame((state) => {
    if(!light.current) return

    //视角前进，阴影算法跟进没那么快，所以手动更新light。再减去4，让光前移一点，扔掉身后的光和阴影，节约性能
    light.current.position.z = state.camera.position.z + 1 - 4

    /**
     * 当场景里的物体位置旋转size改变，threejs会更新这些物体matrix。光虽然在场景里，但光的target不在场景。
     * 所以一个选择是在frame外头把target加入到场景，另外一种是在这里手动更新matrix。
    */
    light.current.target.position.z = state.camera.position.z - 4
    light.current.target.updateMatrixWorld()
  })

  return <>
    <directionalLight
      ref={light}
      castShadow
      position={[4, 4, 1]}
      intensity={1.5}
      shadow-mapsize={[1024, 1024]}
      shadow-camera-near={1}
      shadow-camera-far={10}
      shadow-camera-top={10}
      shadow-camera-right={10}
      shadow-camera-bottom={-10}
      shadow-camera-left={-10}
    />
    <ambientLight intensity={.5} />
  </>
}