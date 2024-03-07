---
title: 第一个3D小游戏踩坑记录
date: 2024-02-02 16:32:22
description: 
tags:
  - threejs
  - react-three
  - zustand
  - game
---

使用以下3个包开发threejs：3D小游戏，遇到了一些坑😤。

```json
"@react-three/drei": "^9.88.11",
"@react-three/fiber": "^8.15.15",
"@react-three/rapier": "^1.2.1",
```

1. chrome浏览器切换标签页再切回去再切标签再切回去，页面场景【消失】、【可见】现象交替出现。

2. 使用微信的截屏快捷键然后esc退出，场景【消失】。

3. `applyImpulse(impulse, false)` 和 `applyTorqueImpulse(torque, false)` 失效，有时出现，无规律。

4. 使用lerp线性位移做相机跟随初始动画，在半途卡住，像是遇到障碍物又努力继续前进，停顿几秒后开始抖动才最终到达目标位置。而threejs的第一人称视角相机控制器是随着鼠标或键盘事件移动。但把前文提到的运动镜头初始动画去掉后，问题1、2、3就无法复现了。

5. 名为`chevrotain`的包相关的报错
> ./node_modules/chevrotain/lib_esm/api_esm.mjs
> Attempted import error: '../lib/src/api.js' does not contain a default export (imported as 'mod').

>Import trace for requested module:
>
>./node_modules/chevrotain/lib_esm/api_esm.mjs
>
>./node_modules/@react-three/rapier/node_modules/three-stdlib/loaders/VRMLLoader.js
>
>./node_modules/@react-three/rapier/node_modules/three-stdlib/index.js
>
>./node_modules/@react-three/rapier/dist/react-three-rapier.esm.js
>
>./app/portfolio/level-game/page.tsx

观察👆🏻log，讲得很清楚，是`@react-three/rapier`的依赖`three-stdlib`的依赖，无法去掉有问题的chevrotain。先试试降级版本，换`@react-three/rapier@0.9`，问题解决了。但是另外一个问题出现了，`contentlayer`的依赖`@shikijs`又在build时候报错：
>✘ [ERROR] TypeError: Cannot use 'in' operator to search for 'themes' in txt
>    at codeToTokens (file:///vercel/path0/node_modules/@shikijs/core/dist/index.mjs:731:18)
>    at codeToHast (file:///vercel/path0/node_modules/@shikijs/core/dist/index.mjs:984:53)

6. 7个月没更新的`"next-contentlayer": "^0.3.4",`包。项目使用了这个包，所以无法更新nextjs版本到14。

7. 墙壁阴影有很大的锯齿，像是在墙头安装了防盗铁刺一样。

8. 开发模式下，nextjs版本(13.4.5)，标注了`'use client'`且引入`react-three`任意包的函数式组件，在更新任意dom元素时，热更新卡死，页面无响应。浏览器后退再前进，页面无响应。

9. restart后，有时会出现页面卡死，应该是执行周期的问题，`react-three/fiber`获取`document`失败。

10. 同样代码，在使用vite脚手架起的react-ts项目中，以上问题基本不存在了。遗留问题有： `useKeyboardControls`在页面打开后如果停留几秒后才发生键盘事件，那么这两个方法 `applyImpulse` and `applyTorqueImpulse` 就无法成功让物体移动。
` @react-three/drei `使用的最新版本[9.97.0], 在超过(大概)3秒没有键盘事件被触发，物体就会进入睡眠状态，需要手动唤醒。

有的问题已解决，而有的问题目前无解。

顺带提一句，设置了md预览快捷键 cmd + ctrl + k。默认的快捷键真不好按。

### 踩坑

R3F的文档太烂了！有些示例代码并没有随着依赖包的更新而更新，从而未按预期运行，最后只好跳到其类型声明文件临时抱佛脚查看api。

#### 1. 模型动画
使用threejs现有的模型动画，复制粘贴其github的示例代码。

```ts
  if (prevAction !== action) {
    prevAction.fadeOut(.2)
  }
  action
    .reset() //不加reset 第二次就不跳
    .setEffectiveTimeScale( .5 ) //影响动画速度。1为正常速度。
    .setEffectiveWeight(actionMap[action][1])
    .play()
```
在新动作直接加reset，长按键盘会在起始状态，松开才开始做动作。但是不加reset，第二次动作就失效。所以要判断如何加reset。
//前一个动作stop太快，就会导致松开键盘时跳跃很快就停止。

#### 2. 物理世界

陷阱类游戏，假设有个道具【致命射线】，拥有【角色触碰就死翘翘】特性。它需要不受外力影响，由业务逻辑控制随机移动。如何设置物体类型和碰撞模式？以`@react-three/rapier`为例：

碰撞类型`RigidBodyAutoCollider`可以是字符串字面量类型 "ball"、"cuboid"、"hull" 或 "trimesh" 中的任何一个。

"ball"：球形碰撞体，通常用于球体模拟。

"cuboid"：长方体碰撞体，也称为盒子碰撞体，通常用于方形或长方形物体模拟。

"hull"：凸包碰撞体，表示一个物体的凸包形状，可以更加精确地匹配物体的形状。

"trimesh"：三角网格碰撞体，通常用于复杂形状的物体模拟，比如地形或不规则形状。

物体类型`RigidBodyTypeString`有 "fixed" | "dynamic" | "kinematicPosition" | "kinematicVelocity" 这几个值。

Fixed（固定）：如果激光射线只是一个静态的装饰物，不需要移动或者与其他物体产生物理交互，可以使用固定类型（fixed）。固定类型的刚体不会受到外力的影响，也不会对其他物体产生影响，因此适合用于静止的场景装饰物。

Dynamic（动态）：如果激光射线需要与其他物体产生碰撞、推动或击打等物理交互，并且需要受到外部力的影响，可以使用动态类型（dynamic）。动态类型的刚体会受到物理引擎的力和碰撞影响，因此适合用于需要物理交互的物体，例如击打或推动其他物体。

KinematicPosition（运动位置） 或 KinematicVelocity（运动速度）：如果激光射线的运动由游戏逻辑控制，不受物理引擎的影响，可以使用运动位置（kinematicPosition）或运动速度（kinematicVelocity）类型。这两种类型的刚体不受外力的影响，但可以通过代码直接控制其位置或速度，适合用于需要精确控制运动的物体，例如角色控制器、特殊类型的武器等。

物体类型设置为`KinematicPosition`是最合适的。

但现在遇到一个问题。角色死是死了，但一直抖。在错误的方向摸索了2个小时，猛然醒悟：因为动画默认loop是2000+，所以角色在循环播放死亡动画【倒是可以用来模拟鞭尸效果🤔】。

其中一个错误方向是raycaster， 再用lineSegments，使raycaster可见。但raycaster主要是用来做鼠标拾取功能，业务场景明显不太匹配，虽然官网有类似的不响应鼠标的🌰，但太过费劲。这就是不看文档直接问ChatGPT的下场，随时被忽悠得团团转。而最后解决方案不过是一条代码：

```ts
  actions.Death.loop = THREE.LoopOnce
  actions.Death.clampWhenFinished = true
```

再微调一下身首分离的残肢位置，看起来更像是被射线分割了。AH!