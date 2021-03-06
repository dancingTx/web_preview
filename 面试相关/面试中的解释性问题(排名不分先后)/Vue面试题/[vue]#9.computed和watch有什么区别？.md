### computed和watch有什么区别?

**computed**

- `computed`是计算属性，顾名思义，用来计算值的属性，它更多的用于计算大量数值的场景。
- `computed`具有缓存特性，`computed`的值在`getter`执行后是会缓存起来的，只有在它所依赖的属性值改变后，下一次获取`computed`的值时才会重新调用对应的`getter`来计算。
- `computed`是用于计算比较消耗性能的计算场景。

**watch**

- `watch`更多的是起到`观察`的作用，类似于某些数据的监听回调，用于观察`props $emit`或者本组件的值，当数据变化时来执行回调进行后续操作。
- 无缓存特性，页面重新渲染时值不会变化也不会执行。

**小结**

- 当我们要进行数值计算，特别是大量数值计算时，并且依赖于其他数据，那么把这个数据设计为`computed`，如不存在大量计算计算的情况下，其实，`methods`完全可以代替`computed`。
- 如果你需要在某个数据变化时监听到改变，并进行一些操作，使用`watch`可能会更加适合。

