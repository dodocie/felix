import { useLevelGameStore } from "@/store/useGame"
import { useKeyboardControls } from "@react-three/drei"
import { addEffect } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"

import Button3d from '@/components/portfolio/button3d'
import Stopwatch from '@/components/portfolio/stopwatch'

import styles from './interface.module.css'

export default function Interface() {
  const [time, setTime] = useState('00:00')

  const forward = useKeyboardControls(state => state.forward)
  const backward = useKeyboardControls(state => state.backward)
  const leftward = useKeyboardControls(state => state.leftward)
  const rightward = useKeyboardControls(state => state.rightward)
  const jump = useKeyboardControls(state => state.jump)

  const phase = useLevelGameStore(state => state.phase)
  const restart = useLevelGameStore(state => state.restart)

  useEffect(() => {
    const unsubscribe = addEffect(
      () => {

        //为什么这里不用上面的phase？因为不用phase依赖，不希望在phase变的时候一直注册addEffect事件，函数只在第一次渲染时注册，phase变量不会变。。
        //这里正是需要以非响应的方式来访问响应变量
        const state = useLevelGameStore.getState()

        let elapsedTime = 0
        if (state.phase === 'playing') {
          elapsedTime = Date.now() - state.startTime
        } else if (state.phase === 'end') {
          elapsedTime = state.endTime - state.startTime
        }

        elapsedTime /= 1000

        setTime(elapsedTime.toFixed(2))
      }
    )

    return unsubscribe
  }, [])

  return <>
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col justify-around">
      <div className="time w-60 mx-auto flex items-center text-sky-50 text-3xl pointer-events-none">
        <Stopwatch time={time} />
      </div>
      {
        <div
          className={`restart ${phase === 'end' ? 'visible' : 'invisible'} mx-auto relative z-10`}
          onClick={restart}
        >
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <path d="M512.000427 384a35.968 35.968 0 0 0 36.010666-36.010667V36.010667a35.968 35.968 0 1 0-72.021333 0v311.978666c0 19.925333 16.128 36.010667 36.010667 36.010667z"
             fill="#fff" opacity=".65"></path>
            <path d="M512.000427 1024c-69.12 0-136.192-13.482667-199.296-40.192a510.293333 510.293333 0 0 1-162.688-109.824A510.293333 510.293333 0 0 1 0.000427 512c0-81.28 18.517333-159.104 55.04-231.210667a516.352 516.352 0 0 1 147.2-176.469333 35.968 35.968 0 0 1 43.52 57.173333 444.501333 444.501333 0 0 0-126.464 151.722667A436.309333 436.309333 0 0 0 72.02176 512a439.338667 439.338667 0 0 0 128.896 311.210667A437.717333 437.717333 0 0 0 512.000427 951.978667a439.338667 439.338667 0 0 0 311.210666-128.896A437.717333 437.717333 0 0 0 951.979093 512c0-69.888-15.872-136.704-47.274666-198.613333a443.562667 443.562667 0 0 0-126.506667-151.68 35.882667 35.882667 0 0 1-6.826667-50.389334 35.882667 35.882667 0 0 1 50.432-6.826666 518.613333 518.613333 0 0 1 147.2 176.512c36.48 72.106667 54.997333 149.76 54.997334 231.210666a508.757333 508.757333 0 0 1-150.016 361.813334A511.104 511.104 0 0 1 512.000427 1024z"
             fill="#fff" opacity=".65"></path>
          </svg>
        </div>
      }

      <div className={`${styles.controls} w-1/5 mx-auto pointer-events-none`}>
        <div className={`${styles.raw} mb-2 grid grid-cols-1`}>
          <div className={`key ${forward ? styles.active : ''} h-12 text-white flex justify-center items-center bg-white/20`}>w</div>
        </div>
        <div className={`${styles.raw} mb-2 grid gap-2 grid-cols-3`}>
          <div className={`key ${leftward ? styles.active : ''} h-12 text-white flex justify-center items-center bg-white/20`}>a</div>
          <div className={`key ${backward ? styles.active : ''} h-12 text-white flex justify-center items-center bg-white/20`}>s</div>
          <div className={`key ${rightward ? styles.active : ''} h-12 text-white flex justify-center items-center bg-white/20`}>d</div>
        </div>
        <div className={`${styles.raw} mb-2 grid grid-cols-1`}>
          <div className={`key ${jump ? styles.active : ''} h-12 text-white flex justify-center items-center bg-white/20 large`}>space</div>
        </div>
      </div>
    </div>
  </>
}