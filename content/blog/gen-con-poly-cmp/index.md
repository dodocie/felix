---
title: 泛型&条件类型在多态组件中的应用
date: 2023-03-15 15:21:22
description: 多态组件如何建立约束关系呢？
tags:
  - typescript
  - 泛型
  - 条件类型
  - 多态组件
  - vue
---

### 一个简单的多态组件

```typescript
 const cmp = ({ tag, children, ...props }) => {
  const component = tag || 'span'
  return <component {...props}>{children}<component/>
}
```

在这个例子中，cmp在调用时可根据不同场景传入各自的htmlTag和对应的props。这就是一个多态组件，在不同的上下文环境中表现出不同的行为，提高组件的可配置性和可复用性，可避免重复代码的出现。

现在，让我们来思考一个问题：如何保证我们在调用这个组件的时候传入正确的参数？比如，当参数 tag的值是`button`，也就是`button`标签, 那么，当我们传入一个属性`href`，我们如何得到一个错误提示告诉你`href`不是`button`标签的属性？

### 业务场景

在实际的业务中，动态的数据类型和动态组件以及组件的扩展并不鲜见。比如你有多个不同类型的数据，你希望以相同的方式展示；或者你在运行时才能确定期望渲染哪个组件；又或者你想扩展你的组件，使之行为根据不同的数据类型动态展示。

这时候，多态组件或许是你的最佳方案。多态组件是一种把一个组件的多种形态抽象为一个单一组件的技术。这样，当需要扩展功能时，只需要向该组件中添加新的形态即可。

### 分配typescript类型约束

回到前文提出的问题：如何对一个多态组件进行类型检查，避免类型错误？比如tag限定为原生html标签，props各个属性映射为对应的element各个属性。当你给tag的值写了个typo，或者props属性有不能分配给tag的情况，都会得到错误提示。

这就需要为tag分配你期望的多种类型，并且在tag和props之间建立约束关系。泛型正是为此而生。

TypeScript 中的泛型是用来解决类型不确定的问题的特殊语法。泛型允许我们在定义一个函数、类或接口时不指定具体类型，并在使用这个函数、类或接口时指定具体类型。

一个简单的泛型函数🌰：

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("hello");  // 输出类型得到'string'
```

那么，如果给一个灵活的多态组件添加了泛型，定义时便无需指定具体类型，使用时可以根据分配的类型得到期望的结果。

假设现在需要为html标签及其属性创建约束。HTMLElementTagNameMap 是typescript内建类型，源码类似这样：

```typescript
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "area": HTMLAreaElement;
  //...以下省略
}
```

给组件的参数tag分配这些tagName，获取所有的tags类型：

```typescript
type Tags = keyof HTMLElementTagNameMap
```

获取htmlTag对应的element属性keys：

```typescript
type TagElementKeys<T extends Tags> = keyof HTMLElementTagNameMap[T]
```

这样当T的参数为a标签，`TagElementKeys<'a'>`就能得到`HTMLAnchorElement`的所有属性。

通过上面两个步骤，我们有了`Tags`及其对应的元素属性类型`TagElementKeys`，下一步，我们要实现二者之间的约束关系。

```typescript
 type OptionalElementAttrs<T extends Tags> = {
   [k in TagElementKeys<T>]?: HTMLElementTagNameMap[T][k]
 }
 type HtmlSection<T extends Tags> = {
  tag: T
} & OptionalElementAttrs<T>
```

Vue 提供了一个 `h()` 函数用于创建 vnodes。这是一种约定俗成的实现虚拟DOM的方式，用JavaScript来生成html标记语言。它的第一参数是必填的，可以是html标签，也可以是自定义组件。类型HtmlSection 分配给多态组件的参数` {tag, ...props}`。 

```typescript
const PolymorphicComponent = <T extends Tags>({
  tag,
  child,
  ...props
}: {child?: string | VNode} & HtmlSection<T>) => {

  const component = tag || 'span'
  return h(component, props, child)
}
```

通过以上步骤，我们初步实现了一个具有类型约束的多态组件，支持传入html标签和属性以便动态渲染，并且能在使用时得到期望的错误提示和结果。

### 实际业务中可能的数据类型

在实际业务中，调用一个动态组件，参数必然是复杂多样的，如果只有单一类型的参数，实际上也不需要多态组件。考虑一个场景，有一个几百篇文章的列表，点击某一篇文章可以查看文章全部内容。文章可能有标题、副标题和段落。段落有可能是string、带有副标题的段落、图片等等。数据结构类似这样：

```typescript
interface Article {
  title: string
  contents: (string | Content)[]
}
type Content = {
  tag: string
  className: string
  //...其它html属性略
}
```

除了title，我们把副标题和段落都放到contents这个数组里面。content存放的数据比较多样，但基本有规律可循，因此考虑用多态组件来实现。我们为数组元素分配了 `string | Content` 类型。其中，tag 是 html 标签，className是样式名称，还有其它的html属性。下一步，我们来改造一下这个Section类型，使其符合类型约束的需要。文章有副标题 h5 & img 两种内容，还记得前文提到的 `HtmlSection` 类型吗？更新的 Article类型像这样：

```typescript
interface Article {
  title: string
  contents: (string | HtmlSection<'h5'> | HtmlSection<'img'>)[]
}
```

以后要是增加了别的类型，再扩充进去目测也很方便。但是这还不够。代码上，一串长长的并集列表看起来不会像葡萄🍇那样诱人。如果再多绕几圈多嵌套几层，反而会像裹脚布「我发誓我没说redux」。来试试看吧，同志们，让我们创建一个工具类型，用来生成所要的并集。

### 条件类型

接下来的内容会涉及到：extends 条件类型的推断算法、推迟解析条件类型；协变量和逆变量。

###### 一个简单的条件类型

如果T'不能分配给U'条件类型，则将条件类型解析为Y。

```typescript
T extends U ? X : Y
```

现在，看一个ts手册的例子，在条件类型中应用推断类型获取数组元素的类型, `infer` 关键字用来声明一个待推断的类型变量。

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type
```

> 在这里，我们使用 `infer` 关键字以声明方式引入一个名为 `Item` 的新泛型类型变量，而不是指定如何在 true 分支中检索元素类型 `T`。 这使我们不必考虑如何挖掘和探索我们感兴趣的类型的结构。我们可以用关键字 infer 写一些辅助工具类型，以获取我们想要的类型。

手册的这一段文档使我怀疑我有点阅读障碍，比法律条文还要生涩。没关系，不重要。记住`infer`的妙用： `T`可推断 `U`收集候选类型。那么，如果extends条件不是数组，而是一个对象，会发生什么？

```typescript
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type Result = Foo<{a: string, b: number}>
```

我们可以看到，`Result` 是一个联合类型：`string | number`。对于给定的infer类型变量，推断出*候选类型*的位置不同，将得到不同的结果类型。如果从协变量位置，则推断结果是这些*候选者*的并集【U的并集】。如果从逆变量位置，结果便是这些*候选者*的交集【U的交集】。否则，类型推断就是never。

###### 插播：协变和逆变的白话介绍

协变量：子类型可以分配给父类型【更具体的类型可以分配给更宽泛的类型】。

逆变量：与协变量相反。

双向协变：可互相分配。不在本文讨论范围中（或者等我整明白了再水一篇）。

让我们来做点微小的扩展工作。目标是使用工具自动获取包括但不仅限于 `HtmlSection<'h5'> | HtmlSection<'img'>`联合类型。

已知：Tags、HtmlSection。创建一个映射关系大概这样：

```typescript
type Section = {
  [k in Tags]: HtmlSection<k>
}
```

前面提到，在协变量位置推断候选类型，可以得到候选类型的并集。想要得到 `HtmlSection<k>`的并集，答案呼之欲出：

```typescript
type GenUnions<T> = T extends { [k in Tags]: infer U } ? U : never
```

现在，我们可以把那一大串换成辅助工具得到的联合类型。

```typescript
type HtmlGenericUnions = GenUnions<Section>
interface RawArticle {
  title: string,
  contents: (string | HtmlGenericUnions)[],
}
```

大功告成！撒花✿✿ヽ(°▽°)ノ✿
让我们来看看完整的代码。

###  字太多直接看完整代码 *°ºO* 

```typescript
 import { h, type VNode } from 'vue'
 
 type Tags = keyof HTMLElementTagNameMap
 type TagElementKeys<T extends Tags> = keyof HTMLElementTagNameMap[T]
 type OptionalElementAttrs<T extends Tags> = {
   [k in TagElementKeys<T>]?: HTMLElementTagNameMap[T][k]
 }
 type HtmlSection<T extends Tags> = {
   tag: T
 } & OptionalElementAttrs<T>
 
 const PolymorphicComponent = <T extends Tags>({
   tag,
   child,
   ...props
 }: {child?: string | VNode} & HtmlSection<T>) => {
 
   const component = tag || 'span'
   return h(component, props, child)
 }
         
 export interface RawArticle {
   title: string,
   contents: (string | HtmlGenericUnions)[],
 }
 
 type Section = {
   [k in Tags]
 /** 协变位置，同一类型变量的多个候选推断联合类型 */
 type GenUnions<T> = T extends { [k in Tags]: infer U } ? U : never
 type HtmlGenericUnions = GenUnions<Section>        
```

* * *

### 一点题外话

在.tsx文件像这样👇🏻写泛型箭头函数，可能会得到意外的报错提示。
```typescript
    const foo = <T>(x: T) => x  
    //这里会报错：
    //JSX 元素“T”没有相应的结束标记。ts(17008) 
    //找不到T
    //意外的标记。你是想使用 `{'>'}` 还是 `>`?ts(1382)
```
这是由于 tsx 无法区别等号后面的箭头是html标签还是泛型。

有两个解决办法，如果非得写箭头函数的话：
```typescript
    /** 加个逗号，表示这是个泛型 */

    const foo = <T,>(x: T) => x

    /** 指定foo2为泛型函数 */
    const foo2: <T>(arg: T) => T = (arg) => arg
```

也可以这样活用extends：

```typescript
const foo4 = <T extends unknown>(x: T) => x
```

如果你的函数式组件泛型刚好需要extends 某个类型，这种方式可以说是恰到好处恰如其分的。

当然，还可以不写箭头函数：

```typescript
 function foo3<T>(x: T): T { return x }
```

到这里，本文基本结束了。
それじゃ, farewell.

全文结束🔚 