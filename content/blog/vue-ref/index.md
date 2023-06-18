---
title: vue3源码 ☞ ref/toRefs
date: 2021-04-03 16:56
description: 
tags:
  - vue3源码
  - ref钩子
---

今天在项目里对vant的弹窗组件popup又包了一层作为子组件Child，以实现弹窗的定制化。
父组件Father传递数据到Child。

```typescript
interface Props {
  showDialog: Boolean
}
```
props是一个proxy对象。子组件可以用computed计算属性对props.showDialog进行转换。

```typescript
const visible = computed({
  get: ()=>props.showDialog,
  set: newVal=>{
    context.emit('toggleStatus', newVal)
  }
})
```

但今天主要是为了看看 ref 干了什么。接下来会分成两部分：
1. 在setup这个钩子里面的ref
2. DOM节点的ref属性
#### 一、在setup这个钩子里面的ref

```javascript
setup(props, context){
  const {showDialog} = toRefs(props)
  const visible = ref(showDialog)
  watch(()=>visible.value, newVal=>{
    context.emit('toggleStatus', newVal)
  })
  return {
    visible,
  }
}
```
对象结构会使之失去响应性，而`toRefs`包裹的对象可以避免这一点。
子组件创建`visible`变量，用来控制`popup`组件是否显示。
用`ref`接收`showDailog`属性，返回一个响应式且可变的`ref`对象。再通过监测`visible.value`值的变化，触发父组件`showDialog`更新值。嗯，看起来好像保持了对源头的响应式连接了！我的子组件肯定可以接收到Father的更新了！

但这样做有个问题。控制台很快报出⚠️

> reactivity.esm-bundler.js:336 Set operation on key "showDialog" failed: target is readonly.


`toRefs`文档原文：
> 将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref)。

那么，`showDailog`是怎么变成ref对象的呢？

`toRefs`方法遍历其参数`object`，给`object`的每个值加上`__v_isRef = true`属性：

```typescript
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```
`__v_isRef`标记该对象为ref对象。
接下来看看ref方法的功能。

```typescript
export function ref(value?: unknown) {
  return createRef(value)
}

function createRef(rawValue: unknown, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

ref接收的`showDailog`，当判断是一个ref对象时，返回它自己。当弹窗组件被关闭，`visible`被直接赋值为false，实际上就是在挑战props的readonly属性。控制台警告，并且拒绝执行你的赋值操作。

既然如此，那就给`visible`初始化为`false`，再监测`showDialog`触发`visible`即可。

```typescript
const visible = ref(false)
const toggle = (newVal: boolean)=>(visible.value=newVal)
watch(()=>showDialog.value, newVal=>{
  toggle(newVal)
})
watch(()=>visible.value, newVal=>{
  console.log('visible=------', visible)
  context.emit('toggleStatus', newVal)
})
```

问题还没结束。如果是ref函数接收的参数不是ref对象呢？换句话说，`new RefImpl(rawValue, shallow)`的作用是什么？

```typescript
class RefImpl<T> {
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T, public readonly _shallow = false) {
    this._value = _shallow ? _rawValue : convert(_rawValue)
  }

  get value() {
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```
主要看`set value(newVal)`这个方法。ref方法并没有传递`shallow`参数，`convert`方法将这个值转换为一个响应式的proxy对象。
```typescript
const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val
```

#### DOM节点的ref属性

考虑一个问题，VUE3的`ref`是怎么做到获取DOM元素的？

比如一个DOM节点，绑定了`ref='schedule'`
```html
<div ref="schedule"></div>
```
接下来，在setup里面，我们要创建一个`ref`对象，别忘了把这个ref对象return出去。

```typescript
setup(){
  const schedule = ref<HTMLDIVELEMENT | null>(null)
  return {
    schedule
  }
}
```
这样，我们就可以在`onMounted`生命周期获取到这个DOM节点。

```typescript
onMounted(() => {
  console.log(schedule)
})
```
这一切不禁让习惯了`this.$refs.schedule`一把梭的笔者陷入了沉思。怎么做到的？为什么要这样做？是不是有点反直觉？接下来，让我们走进源码康一康。

第一步，先从项目入口`main.ts`开始找:
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```
我们要去找`createApp`
```typescript
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)
  //..以下省略
}

function ensureRenderer() {
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}

export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```
`baseCreateRenderer`方法中，暴露了createApp方法：

```typescript
//...略
return {
  render,
  hydrate,
  createApp: createAppAPI(render, hydrate)
}
```

`createAppAPI`暴露`app`, 拥有`mount`方法。在`mount`方法里执行`render`函数，`render`函数接收两个参数，第一个参数`vnode`如果不是null，再执行`patch`函数：
```typescript
patch(container._vnode || null, vnode, container)
```
在`runtime-core>renderer.ts` `L452`，找到了`patch`函数的定义。在这里，终于找到了目的地。`n2` 是patch 函数的第二个参数 vnode
```typescript
const { type, ref, shapeFlag } = n2
//...省略上千行的switch
// set ref
if (ref != null && parentComponent) {
  setRef(ref, n1 && n1.ref, parentSuspense, n2)
}
```
接下来，就来看看`setRef`
```typescript
if (isString(ref)) {
  const doSet = () => {
    refs[ref] = value
 if (hasOwn(setupState, ref)) {
      setupState[ref] = value
 }
}
```
如果`ref`是字符串，判断`setup`暴露的`setupState`里是否有这个`ref对象`，如果有，将`value`赋值给ref。而这value，就是vnode.el。

```typescript
value = vnode.el
```

再来看看`setupState`。

```typescript
const { i: owner, r: ref } = rawRef
const setupState = owner.setupState
```
rawRef 是 setRef 方法的第一个参数：
```
export const setRef = (
  rawRef: VNodeNormalizedRef,
  oldRawRef: VNodeNormalizedRef | null,
  parentSuspense: SuspenseBoundary | null,
  vnode: VNode | null
)=>{
  //...
}
```
在vnode.ts L305，可以看到VNode的属性 ref为`VNodeNormalizedRef`类型，如果props存在，调用`normalizeRef`

```typescript
const normalizeRef = ({ ref }: VNodeProps): VNodeNormalizedRefAtom | null => {
  return (ref != null
 ? isString(ref) || isRef(ref) || isFunction(ref)
      ? { i: currentRenderingInstance, r: ref }
      : ref
    : null) as any
}
```
`VNodeProps`是VNode节点的`props`对象数组，在编译DOM节点时创建。在`compile-core>src>parse.ts`文件，找到了这个方法。

```typescript
export function baseParse(
  content: string,
  options: ParserOptions = {}
): RootNode {
  const context = createParserContext(content, options)
  const start = getCursor(context)
  return createRoot(
    parseChildren(context, TextModes.DATA, []),
    getSelection(context, start)
  )
}
```
当dom节点绑定了`ref`属性，在编译时，baseCompile方法里，传进了两个参数：`template` 和 `options`。判断`template`如果为字符串，则对模板进行词法分析，生成AST抽象语法树成。在这个过程`baseParse>parseChildren>parseElement>parseTag>parseAttrs>parseAttr`中，`parseAttr`生成一个包含`name=ref`的对象，`parseAttrs`方法将这个对象push到`props`数组里面。
接下来，对AST进行转换。再调用`transform`方法，第一个参数是`ast`，第二个参数扩展`baseCompile`的第二个参数`options`，包括各个节点属性类型对应的transform方法。其中有一个`transformElement`方法，这个方法将props转换成带有`type、loc、properties`等参数的对象，并给`node`添加了`codegenNode`属性。

```typescript
node.codegenNode = createVNodeCall(
  context,
  vnodeTag,
  vnodeProps,
  vnodeChildren,
  vnodePatchFlag,
  vnodeDynamicProps,
  vnodeDirectives,
  !!shouldUseBlock,
  false /* disableTracking */,
  node.loc
)
```
这个属性对应的值，将在`generate`阶段帮助优化。`generate`方法将ast生成可执行的js代码。

最后，总结一下。`ref`涉及到了模板编译、运行时和响应式的部分源码。模板编译将`ref`推进VNode的`props`属性数组中。运行时找到setupState上对应的`ref`响应式对象，赋值为该DOM节点。
