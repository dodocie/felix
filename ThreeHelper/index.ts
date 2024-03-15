
import * as THREE from "three"
import { BaseEnvironment } from "./utils/BaseEnvironment"

/**
 * 继承的类构造函数参数类型[数组]
 */
type InheritClassParams = ConstructorParameters<typeof BaseEnvironment>

export class ThreeHelper extends BaseEnvironment {
    frameHandle: number = 0
    framing: boolean = false
    protected _animation: VoidFunction = () => { }
    clock = new THREE.Clock()
    static instance: ThreeHelper
    runAnimate = true

    constructor(params: InheritClassParams[0]) {
        super(params)
        if (ThreeHelper.instance) return ThreeHelper.instance
        ThreeHelper.instance = this
    }

    /**
     * 向环境中添加物体
     */
    add(...object: THREE.Object3D<THREE.Object3DEventMap>[]) {
        this.scene.add(...object)
    }

    /**
     * 镜头自动旋转
     */
    autoRotate() {
        if (this.controls) {
            this.controls.autoRotate = true
            this.controls.enableRotate = true
        }
    }

    /**
     * 设置每帧渲染执行的操作
     */
    animation(call: VoidFunction) {
        this._animation = call
    }

    /**
     * 逐帧渲染
     */
    renderFrame() {
        this.frameHandle = requestAnimationFrame(() => this.renderFrame())
        this.controls?.update()
        this.runAnimate && this._animation()
        this.render()
    }

    /**
     *  停止逐帧渲染
     */
    stopFrame() {
        cancelAnimationFrame(this.frameHandle)
        this.frameHandle = 0
    }
}
