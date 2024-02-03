import { useLevelGameStore } from "@/store/useGame"
import { useKeyboardControls } from "@react-three/drei"
import { addEffect } from "@react-three/fiber"
import { useEffect, useRef } from "react"


export default function Interface() {
  const time = useRef<HTMLDivElement>(null)

  const forward = useKeyboardControls(state => state.forward)

  const phase = useLevelGameStore(state => state.phase)
  const restart = useLevelGameStore(state => state.restart)

  useEffect(() => {
    const unsubscribe = addEffect(
      () => {
        if(!time.current) return

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

        time.current.textContent = elapsedTime.toFixed(2)
      }
    )

    return unsubscribe
  }, [])

  return <>
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <div ref={time} className="time absolute left-0 top-10 w-full text-white text-3xl bg-slate-900/10 pt-1 text-center">0.00</div>
      {
        phase === 'end' && <div
          className="restart flex justify-center px-2.5 absolute top-2/3 left-0 w-full text-7xl text-white bg-slate-900/10 pointer-events-none cursor-pointer"
          onClick={restart}
        >再来一把</div>
      }

      {/* controls ToDo：需要给各个key加一个active效果 */}
      <div className="controls">
        <div className="raw">
          <div className="key">w</div>
        </div>
        <div className="raw">
          <div className="key">a</div>
          <div className="key">s</div>
          <div className="key">d</div>
        </div>
        <div className="raw">
          <div className="key large">space</div>
        </div>
      </div>
    </div>
  </>
}