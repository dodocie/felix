import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'


interface LevelGame {
  blockCount: number
  blockSeed: number

  phase: string
  start: () => void
  restart: () => void
  end: () => void

  startTime: number,
  endTime: number,
}

export const useLevelGameStore = create(
  subscribeWithSelector<LevelGame>(
    set => ({
      blockCount: 5,
      blockSeed: 0,//一个粗略的seed。在restart时改变
      increaseBlock: () => set((state: { blockCount: number }) => ({ blockCount: state.blockCount + 1 })),
      removeAllBlocks: () => set({ blockCount: 0 }),

      /**
       * Time, 时间在下面phase状态改变时设置。
      */
      startTime: 0,
      endTime: 0,

      /**
       * Phase
      */
      phase: 'ready',
      start: () => set(
        (state: { phase: string }) => state.phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {}
      ),
      restart: () => set(
        (state: { phase: string }) => state.phase === 'playing' || state.phase === 'end' ? { phase: 'ready' } : {}
      ),
      end: () => set(
        (state: { phase: string }) => state.phase === 'playing' ? { phase: 'end', endTime: Date.now() } : {}
      ),
    })
  )
)
