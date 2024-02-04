import { useEffect } from 'react'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const gui = new GUI()

export function useGUI() {
  useEffect(() => {
    return () => {
      gui.destroy()
    }
  }, [])

  return {
    gui
  }
}