---
title: 解决问题与创造美
subtitle: 个人博客网站的总结回顾
date: 2023-06-20 20:21:22
description: SSR的魅力与SEO加持：提升博客性能与可见性的利器
tags:
  - Nextjs
  - Vercel
  - mantine
  - 个人博客
---

伴随着颈椎疼痛的困扰，此时的我不敢轻易扭动脖子，宛如一只梗着脖子的傻猫。好在个人博客网站基本搭建完毕，尽管下一个任务紧迫，但它没有任何盈利点。唉，着什么急嘛，是不是有点傻。现在，只需简单总结一下，就能稍微松口气了。

### 为什么是Next.js和vercel？
首先是这样最简单，从[基友](https://pengtikui.cn/)的劳动成果中扒拉了整个技术架构。在此基础上，我又做了一些页面的功能的扩展，比如全文模糊搜索、继续阅读、文章目录等。【叉腰】

服务器渲染（SSR）可以给博客带来超棒的性能和超棒的SEO优化。它会让页面加载速度变得超快，还能让搜索引擎更好地抓取和索引博客内容。（但现在还不能搜到我的文章ε=(´ο｀*)))）

Vercel作为部署平台。它简单易用，超快速而且靠谱。最重要的是，它能跟Next.js完美结合，让我轻轻松松地将我的应用程序部署到全球分布式网络上。它还提供自动化的CI/CD流程，让我可以专注于撰写博客内容，而不用花费太多时间和精力在繁琐的部署和服务器配置上。

赞美基友！

### UI设计的灵感来源

#### 页面布局
首页的布局基本照抄nextjs框架的样本页。在立项前，就已经决定要打造成一个具有响应式布局，以及支持切换浅色模式和深色模式的网站，让移动端和PC端读者都能有良好的阅读体验。首页的内容并不需要太多，所以我们采用了一屏设计，页面不需要滚动就能展示完整的内容。顶部和底部被设计为功能区域。顶部有搜索按钮和阅读模式切换按钮，底部则包含了三个菜单，分别作为专栏文章和其他项目的链接入口。

对于专栏文章列表页的布局，首先需要考虑两个主要模块：专栏标题和描述，文章列表的标题和发布时间。在PC端，按2:3比例左右分栏，移动端按2:8比例上下分栏。顶部和首页类似有漂亮的手绘按钮点缀页面，还有一只正在专注工作的傻猫增添趣味。

文章内容页的布局设计采用主流的设计，基本上在每个教程文档都能看见这样的布局方式。而布局是类似的，怎样才能做得好看点呢？如何用颜色+透明度、字号+行高的奇妙组合创造美的魔术？对于个人网站：按自己喜欢的来。

#### 关于颜色
浅色模式的颜色来源于我的=月白色的瓷碗，和瓷碗里的黄米汤圆。降低一点饱和度，调成目前主流的莫兰迪色系，给人一种温柔的感觉。我喜欢性格温和的人，希望自己也变得温柔一些。深色模式中，很多网站都呈现出超棒的视觉效果，我个人最喜欢tailwind的配色。

#### 图标
图标来源于阿里iconfont的手绘风格。个人网站，喜欢就用。

### 问题和解决方案

1. 浅色和深色模式转换的解决方案，哪个最方便快捷？

    在设计我的博客网站时，我尝试了Mantine的themeColor和MantineProvider的theme，它们确实很方便。但Tailwind CSS在简单快捷方面略胜一筹。在某个className加上前缀 `dark:`，比如`dark:bg-slate-900`, 表示`bg-slate-900`在深色模式下生效。具体如何配置和使用可以参考tailwind官网，这里不做赘述。
    
2. 老大难useEffect。

当我需要使用useEffect监听事件时，有时候我只想在特定的状态下执行某些操作，而不希望随着状态的变化而不停地更新。这时，我会使用一个小技巧：对于那个状态，我会创建一个ref值，就像是一块“不会变形的金属”。这样，我可以在useEffect中使用这个ref值作为判断依据，而不会受到状态的干扰。

3. Tailwind SVG 样式未生效

tailwind支持处理SVG图标的样式，比如你可以这样写一个svg的颜色：

```html
<svg class="fill-blue-500 ..."> <!-- ... --> </svg>

<svg class="stroke-blue-500 ..."> <!-- ... --> </svg>
```

可是，对于我下载的那些手绘图标，上述方法却不起作用，包括stroke属性也无效。我猜测可能与图标的path路径有关。脑海中浮现出一个解决方案：使用全局provider来传递主题色作为参数，并将其赋值给`fill`属性。但是，我实在太懒了，不想采用那么繁琐的方式，也不想依赖市面上已有的状态管理方案。

而`fill`属性接受的值是颜色，同样可以使用`currentColor`，它会继承最近祖先元素的颜色，类似于`inherit`的效果。当`fill`属性不存在或为空字符串时，默认会被填充为黑色。然而，这些手绘图标似乎并不理会tailwind针对svg的className属性，反而继承了更上一级的颜色。既然如此，那解决方案就是在引用这些图标的组件中指定颜色。

4. sticky不粘了。
通常，我们知道，英文文档的中文翻译总有一些令人困惑的小问题。但这一次，是mdn的中文文档略胜一筹。例如，在stick相关文档中：
> This value always creates a new [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context). Note that a sticky element "sticks" to its nearest ancestor that has a "scrolling mechanism" (created when `overflow` is `hidden`, `scroll`, `auto`, or `overlay`), even if that ancestor isn't the nearest actually scrolling ancestor.

> 注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的 `overflow` 是 `hidden`、`scroll`、`auto` 或 `overlay` 时），即便这个祖先不是最近的真实可滚动祖先。

中文文档明确多了这一句话：
> 这有效地抑制了任何“sticky”行为（详情见 [Github issue on W3C CSSWG](https://github.com/w3c/csswg-drafts/issues/865)）。

如果不看这句话，中英文文档都会让人以为是要在overflow有这些值的时候才生效。然而事实却完全相反。在我去掉藏在 `body` 中的`overflow-x:hidden`后, sticky终于能按预期触发了。

以上。
