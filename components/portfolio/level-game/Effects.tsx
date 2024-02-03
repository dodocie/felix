import { EffectComposer, DepthOfField, SSR } from "@react-three/postprocessing"

export default function Effects() {
  return <EffectComposer>
    <SSR
      intensity={.45}
      // exponent={1}
      // distance={10}
      // fade={10}
      // roughnessFade={1}
      // blend={.95}
      // correction={1}
      // correctionRadius={1}
      // blur={0}
      // blurKernel={1}
      blurSharpness={10}
      thickness={10}
      ior={.45}
      maxRoughness={1}
      maxDepthDifference={10}
      jitter={.75}
      jitterRough={.2}
      // steps={40}
      // refineSteps={5}
      // missedRays={true}
      // useNormalMap={true}
      USE_ROUGHNESSMAP={true}
      USE_NORMALMAP={true}
      // resolutionScale={1}
      // velocityResolutionScale={1}
    />
    <DepthOfField
      focusDistance={.01}
      focalLength={.2}
      bokehScale={3}
    />
  </EffectComposer>
}