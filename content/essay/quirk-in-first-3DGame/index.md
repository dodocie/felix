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

8. 开发模式下，nextjs版本(13.4.5)，标注了`'use client'`且引入`react-three`任意包的函数式组件，在更新任意dom元素时，热更新卡死，页面无响应。

9. restart后，有时会出现页面卡死，或开始游戏后数据有更新，但物体不动。盲猜`@react-three/rapier@0.9`这个物理库有问题。迟早换了它。

有的问题已解决，而有的问题目前无解。