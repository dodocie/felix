---
title: 令人又爱又恨的R3F
date: 2024-03-15 16:10:22
description: R3F sucks
tags:
  - @react-three/fiber
  - 
---

`R3F`是`@react-three/fiber`的简称，对`threejs`做了进一步封装，从[官网的文档](https://pmnd.rs/)——不要对官网抱有期待——可以看到其配套有`@react-three/drei`和`@react-three/spring`等。这些工具库虽然有一些学习成本，但熟练之后，省略了很多开发工作，开发者摸鱼的时间更多了。

其优点先略过不提。今天只想吐槽。

今天从[shadertoy资源库](https://www.shadertoy.com/)扒拉了一个水墨风格山水画，发现了两个暂时不知道如何解决的问题：抗锯齿失效、颜色渲染失真。

分别在以下项目环境做了对比了原生`html`标签 `<canvas>` 和`R3F`提供的 `<Canvas>`组件：
- Nextjs 13+ 
- Vite + React 
- Vite + Vue

`R3F`提供的`<Canvas>`组件，不需要为画布`Size`烦恼，因为画布宽高并没有暴露接口设置，而样式宽高会继承其父组件宽高。一般我们会设置canvas的width和height属性为实际需要显示的两倍大小来保证清晰度。然而即便设置了`antilias`为`true`，又尝试将`dpr`属性设置为2，`R3F`依旧没有对此做处理。

如果在子组件使用useThree狗子返回的`gl`属性重新设置setSize？

此外，和颜色相关的属性配置如下：
-   outputColorSpace = THREE.SRGBColorSpace
-   toneMapping = THREE.ACESFilmicToneMapping | THREE.CineonToneMapping
尝试以上方法，无法解决颜色渲染变浅的问题。像是给场景加了一个强度为10的环境光一样变白。

