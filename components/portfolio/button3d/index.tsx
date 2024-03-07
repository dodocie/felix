import { Suspense, useState } from "react"
import { motion, MotionConfig, useMotionValue } from "framer-motion"
import useMeasure from "react-use-measure"

import { Shapes, transition } from "@/components/portfolio/button3d/Shape"

import styles from './index.module.css'

export default function Page() {
  const [ref, bounds] = useMeasure({ scroll: false })
  const [isHover, setIsHover] = useState(false)
  const [isPress, setIsPress] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const resetMousePosition = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <MotionConfig transition={transition}>
      <motion.button
        ref={ref}
        initial={false}
        animate={isHover ? "hover" : "rest"}
        className={styles.button}
        whileTap="press"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.5 },
          press: { scale: 1.4 }
        }}
        onHoverStart={() => {
          resetMousePosition()
          setIsHover(true)
        }}
        onHoverEnd={() => {
          resetMousePosition()
          setIsHover(false)
        }}
        onTapStart={() => setIsPress(true)}
        onTap={() => setIsPress(false)}
        onTapCancel={() => setIsPress(false)}
        onPointerMove={(e) => {
          mouseX.set(e.clientX - bounds.x - bounds.width / 2)
          mouseY.set(e.clientY - bounds.y - bounds.height / 2)
        }}
      >
        <motion.div
          className={styles.shapes}
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 }
          }}
        >
          <div className={`${styles.pink} ${styles.blush}`} />
          <div className={`${styles.blue} ${styles.blush}`} />
          <div className={styles.container}>
            <Suspense fallback={null}>
              <Shapes
                isHover={isHover}
                isPress={isPress}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            </Suspense>
          </div>
        </motion.div>
        <motion.div
          variants={{ hover: { scale: 0.85 }, press: { scale: 1.1 } }}
          className={styles.label}
        >
          RESTART
        </motion.div>
      </motion.button>
    </MotionConfig>
  )
}