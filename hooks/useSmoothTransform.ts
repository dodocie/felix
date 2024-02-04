import { MotionValue, SpringOptions, useSpring, useTransform } from "framer-motion"

export function useSmoothTransform(value: MotionValue<unknown>, springOptions: SpringOptions | undefined, transformer: (input: unknown) => any) {
  return useSpring(useTransform(value, transformer), springOptions)
}
