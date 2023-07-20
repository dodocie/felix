---
title: 不喜欢vue2的十大理由
date: 2022-06-03 20:43
description: 
tags:
  - vue2源码
  - elementUI
---

先说结论：我喜欢vue3，不怎么喜欢vue2。至于底下有没有10个理由，不重要。只要你有轻微代码洁癖，或许会和我有一些共鸣。

> 面试的时候如果能让我将vue2喷它个酣畅淋漓，或许我就不会发抖了。

## 难过的日常开发

mixin混入维护难。一不小心就会命名冲突，如果多个mixin被应用于多个组件，那么其依赖关系就会变成一团乱麻。

vue源码本身用flow做静态类型检查，对于ts则不太友好。在[vue2里面使用ts的写法很繁琐](https://v2.cn.vuejs.org/v2/guide/typescript.html)，收益远远低于付出，纯粹给自己找麻烦。

template模板用到的变量或者方法必须挂载到组件实例上。如果变量不需要响应式，即使用了freeze包裹该变量，也只是避免了深度响应式检查，属性本身还在响应式队列中。

以上是笔者在日常开发中的感受。接下来我们来聊聊源码中不讨人喜欢的部分。

## 源码

Object.defineProperty缺陷，这个八股每个vuer都会背，我就不展开了，懒。

内联事件函数提取。每次重新渲染时，会生成一个新的函数。js无法区分是同一个函数，子组件每次都会重新渲染。这一点，3.x做了改进，生成的函数会被cache，之后每次都重用同一个函数。说到这，顺便提一下react的useCallback。react的组件内的函数也会有这个问题，每次渲染都会创建一个新的函数实例。如果是从props传递的函数，dan的文章推荐在父组件用useCallback生一个新函数再传递，以此作为缓存。所以问题来了，为什么不推荐给每一个方法都包一遍呢？既然这种缓存的方式是有效提高性能的，react为什么不在源码级别直接做这种处理呢？

2.x每个组件实例都会有一个对应的虚拟DOM，在渲染时创建。更新会就会创建新的DOM树。这种针对一整个组件的diff，就会受模板大小影响。3.x在虚拟DOM节点上添加分区块标志，用来跟踪动态节点。比如最常见的修改样式`PatchFlag.CLASS`，`PatchFlag.STYLE`，表示节点只需要修改class或style。

静态模板内容提取不够细致。静态模板的内容不会变，那么在编译阶段提取出来，后面不用做diff，直接复用。但是，如果一个元素内部的任意深度的有任意动态内容，那就不会被提取出来做静态化。关于这一点，vue3是怎么做的？比如元素的属性是静态的，那就提取属性。后面diff的时候发现了提取，就直接去对比元素的children，元素本身就可以跳过比对。

slot的动态数据更新，2.x里，父组件先更新，生成新的slots内容，然后子组件跟着更新，触发了两个组件更新。3.x把所有的slots 跟 scope slot 一样统一生成为一个lazy函数，传给子组件，由子组件来决定什么时候调用。这样就更精确了，组件依赖谁很清楚，动态数据依赖的是子组件，于是只需要更新子组件。

源码怎么处理是源码的事，日常开发基本无感知，你很难说因为源码而不喜欢某个框架，毕竟很容易被挑刺，你行你上啊。

## bug是谁的

父组件`Order.vue`中，有一个表格数据多功能多，其中有一个大的功能块，就叫`wrap`吧，`wrap`必须放到table-column提供的slots里面。前面提到2.x的diff受到模板大小影响，为了提高性能，也为了维护省事和以后可能的方便复用，我们把`wrap`独立出去，再在slot内引入作为子组件。

现在好了，交互事件确实发生了，有`console.log`为证，但是this.xx = xxx后，xx没按预期变成xxx。

各种摸索调查后，elementUI的table组件如果给某一个column设置了fix，elementUI就会创建两个`tableBody`和`tableHeader`实例。header我们先不管。打开vue-devTool你就会看到两个`ElTableBody`，打开Chrome的Elements你会看到两个`table`节点。怎么创建的？真实情况真是出乎意料地简单粗暴，满满理工直男的糙汉子魅力，叫人又爱又恨。

```html
  <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
   >
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
           width: bodyWidth
        }">
      </table-body>
       <!-- <div>无关代码省略</div> -->
<div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed"
      ref="fixedWrapper"
     >
       <!-- <div>无关代码继续省略</div> -->
   <div
        class="el-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth
          }">
        </table-body>
        <!-- <div>无关代码持续省略</div> -->
      </div> 
```


人们可能会说，又不好给人源码改了，两个实例就两个呗，又不是不能用。

可这种情况就不好用了。

在slot子组件`wrap`的`mounted`生命周期打印`this`，可以看到有两条记录，拥有不相等的_uid比如`uidA`和`uidB`，其它属性和值全部一致。在`wrap`里定义的`methods`，大部分指向`uidB`，只有table表格的`selection-change`事件this指向`uidA`，事件触发后可能无法得到预期的执行结果。

又是table。怎么每次都有你。为什么每次都是你。

## bug歼灭战

我们知道vue2中，实例中的methods都被bind过this，这样搞不清this是谁的小菜鸟们从此烦恼少少，头发多多（尤雨溪真是，又帅又贴心），而bind过的this无法再改变。那怎么会混乱呢？中间曲折反复的调查过程简单概括为：

1. 发现只有select相关的emit事件this不对。
2. 发现这几个emit都在一个Watcher里面，用了Vue.extend扩展。
3. Vue.extend创建子组件实例，this没搞特殊。
4. 灵机一动。oh，html有两个table。

element用一个多余的table固定覆盖一部分原来的table，达到固定左边某个列的效果。为什么是这三个事件有问题不是因为它们单独在watcher里extend，而是因为它们的事件target都在多余的table上。

早期sticky兼容性有限，或许这就是`element2.x`采用那种多写一个table方式的原因。

但我们不需要考虑几年不升版本的客户，我们可以勇敢地使用`sticky`来做这个固定列或固定行。

还有一个办法，slots的内容不再单独抽为子组件`wrap`，这样就算有两个实例，就算事件target不一样，this依然指向唯一的父组件。

## 题外话
这个bug产生的原因大部分在于element table的设计上，实际上和`vue2`源码没啥关系。