import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { KeyBoardListener } from "./KeyBoardListener"

interface ISetCamera {
    fov?: number
    aspect?: number
    near?: number
    far?: number
}

type IProps = THREE.WebGLRendererParameters & {
    /**
     * 是否限制渲染像素 过大开销容易卡顿
     * 默认限制最大为 2
     * 若不限制则采用设备的最大像素比
     */
    limitPixelRatio?: boolean
}

/**
 * 初始化 scene camera renderer
 */
export class BaseEnvironment extends KeyBoardListener {
    /** */
    renderRequested = false
    limitPixelRatio

    renderer!: THREE.WebGLRenderer
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera()
    lights: THREE.Light[] = []
    scene = new THREE.Scene()
    controls!: OrbitControls
    canvas: IProps['canvas']
    pmremGenerator

    constructor(params: IProps) {
        super()
        this.canvas = params.canvas
        this.initRenderer(params)
        this.limitPixelRatio = params.limitPixelRatio
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.initScene()
    }

    setCamera = (params: Partial<ISetCamera>) => {
        Object.assign(this.camera, params)
    }

    protected initScene() {
        this.orbitControls()
    }

    /**
     * 设置背景 十六进制颜色
     */
    setBackground(color: THREE.Color) {
        this.scene.background = new THREE.Color(color)
    }

    /**
     * 添加辅助坐标
     */
    addAxis(length?: number) {
        const axes = new THREE.AxesHelper(length || 1000)
        this.scene.add(axes)
    }

    /**
     * 添加控制器
     */
    orbitControls() {
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        )
        this.controls = controls as unknown as OrbitControls
        controls.addEventListener('change', () => {
            this.render()
        })
    }

    /**
     * 控制镜头缩放等级
     */
    zoom(min: number, max: number) {
        this.controls.minZoom = min
        this.controls.maxZoom = max
    }

    /**
     * 镜头移动距离限制
     */
    distance(min: number, max: number) {
        this.controls.minDistance = min
        this.controls.maxDistance = max
    }

    /**
     * 镜头垂直方向旋转角度 默认 0-180 即 angle(0,Math.PI)
     */
    angle(min: number, max: number) {
        this.controls.minPolarAngle = min
        this.controls.maxPolarAngle = max
    }

    /**
     * 根据新的父元素尺寸 重置相关参数
     */
    protected resetLayout() {
        const width = window.innerWidth
        const height = window.innerHeight
        this.renderer.clear()//?

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        const windowPix = window.devicePixelRatio
        const pixelRatio = this.limitPixelRatio
            ? windowPix
            : Math.min(windowPix, 2)
        this.renderer.setPixelRatio(pixelRatio)

        this.requestRenderIfNotRequested()
    }

    requestRenderIfNotRequested() {
        if (!this.renderRequested) {
            this.renderRequested = true
            this.render()//requestanimation在helper中。。。
        }
      }

    /**
     * 保证this指向
     */
    protected selfResetLayout = () => this.resetLayout.call(this)

    /**
     * 添加resize监听
     */
    listenResize() {
        window.addEventListener('resize', this.selfResetLayout)
    }

    removeResizeListen() {
        window.removeEventListener('resize', this.selfResetLayout)
    }

    /**
     * 清除scene中的物体 ToDo：应该有更好的方式
     */
    protected clearChildren(obj: THREE.Object3D<THREE.Object3DEventMap>) {
        while (obj.children.length > 0) {
            obj.clear()
        }
        //@ts-ignore
        if (obj.isMesh){
            //@ts-ignore
            obj.geometry.dispose()
            //@ts-ignore
            if (Array.isArray(obj.material)) {
                //@ts-ignore
                obj.material.forEach((m: THREE.Material) => m.dispose())
            } else{
                //@ts-ignore
                obj.material.dispose()
            }
        }

    }

    /**
     * 清除画布中的元素 用于热更新后显示新画布元素
     */
    clearScene() {
        this.scene.traverse(child => {
            this.clearChildren(child)
            this.scene.remove(child)
        })
        this.scene.environment?.dispose()
        this.renderer.clear()
        this.scene.clear()
    }

    render() {
        this.renderRequested = false
        if (resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight
            this.camera.updateProjectionMatrix()
          }
        this.renderer.render(this.scene, this.camera)
    }

    computeCanvasSize() {
        const canvas = this.renderer.domElement
        const { clientWidth, clientHeight } = canvas
        return [clientWidth, clientHeight]
    }

    protected initRenderer(parameters?: IProps) {
        this.renderer = new THREE.WebGLRenderer(parameters)
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.resetLayout()
        return this.renderer
    }

    /**
     * 将背景设置成透明
     */
    transparentBackGround() {
        this.renderer.setClearColor(0x000000, 0)
    }

    /**
     * @description: 设置背景颜色透明度
     * @param {number} alpha 0-透明 1-不透明
     */
    setBackGroundAlpha(alpha: number) {
        this.renderer.setClearColor(0x000000, alpha)
    }
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }