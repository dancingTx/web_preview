### 生命周期钩子函数

**beforeCreate/created**

在`beforeCreate`钩子函数调用的时候，是获取不到`props`或者`data`中的数据的，因为这些数据的初始化都在`initState`中。

然后会执行`created`钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没有被挂载，所以是看不到的。

**beforeMount/mounted**

接下来会先执行`beforeMount`钩子函数，开始创建VDOM，最后执行`mounted`钩子，并将VDOM渲染为真实DOM并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。

**beforeUpdate/updated**

接下俩是数据更新时会调用的钩子函数`beforeUpdate`和`updated`，这两个钩子函数没什么好说的，就是分别在数据更新前和更新后会调用。

**activated/deactivated**

另外还有`keep-alive`独有的生命周期，分别是`activated`和`deactivated`。用`keep-alive`包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行`deactivated`钩子函数，命中缓存渲染后会执行`activated`钩子函数。

**beforeDestroy/destroyed**

最后就是销毁组件的钩子函数`beforeDestroy`和`destroyed`。前者适合移除事件、定时器等，否则可能会引起内存泄漏的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的`destroyed`钩子函数。