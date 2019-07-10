### 谈谈你对MVVM开发模式的理解

MVVM是基于MVC模式衍生出来的前端框架模式，主要分为Model、View、ViewModel三者。

**Model**代表数据模型，数据和业务逻辑主要在Model层中定义；

**View**代表UI视图层，主要负责数据的展示；

**ViewModel**是MVVM框架模式的核心层，类似于MVC中的Controler层，它主要负责监听**Model**中数据的变化并且控制视图的更新，处理用户交互操作；**Model**和**View**并无直接关联，而是通过**ViewModel**来进行联系，**Model**和**ViewModel**之间有着双向数据绑定的联系。因此当**Model**中的数据改变时会触发**View**层的刷新，**View**中由于用户交互操作而改变的数据也会在**Model**中同步。

这种模式实现了**Model**和**View**的数据自动同步，因此开发者只需要专注对数据的维护操作即可，而不需要自己操作**DOM**

事实上来说，Vue主要是通过观察者模式对数据进行监听，当初始化Vue后，发布者会通知订阅者对数据进行Watcher，当数据被监听到后，将收集起来的被监听的subs数据进行循环遍历，并将每个数据利用Object.defineProperty()进行getter和setter设置。

**Vue数据绑定的简易实现**

__响应式系统__

首先，我们定义一个简单的cb函数，这个函数用来模拟视图更新，调用它即代表更新视图，内部可以是一些更新视图的方法。

```js
function CallBack(value) {
    console.log('视图更新~',value)
}
```

然后定义一个defineReactive，这个方法通过Object.defineProperty来实现对对象的【响应式】化，入参是一个obj（需要绑定的对象）、key（obj的某一个属性），val（具体的值）。经过defineReactive处理以后，我们的obj的key属性在【读】的时候会触发getter方法，而在该属性被【写】的时候则会触发setter方法。

```js
function defineReactive(obj,key,value){
    Object.defineProperty(obj,key,{
        enumerable: true,
        configurable: true,
        get:()=>{
            return value
        },
        set:(newVal)=>{
            if(value === newVal) return
            CallBack(newVal)
        }
    })
}
```

当然这是不够的，我们需要在上面再封装一层observer。这个函数传入一个value（需要【响应式】化的对象），通过便利所有属性的方式对该对象上的每一个属性都通过defineReactive处理。

```js
function Observer(value){
    if(!value || typeof value !== 'object' || value === null) return 
    Object.keys(value).forEach(key=>{
        defineReactive(value,key,value[key])
    })
}
```

最后，让我们用Observer来封装一个Vue。

在Vue的构造函数中，对options的data进行处理，这里的data想必大家已经很熟悉，就是平时我们在写的Vue项目中组件中的data属性（实际上是一个函数，这里当作是一个对象来简单处理）。

```js
class Vue {
    constructor(options){
        this._data = options.data
        Observer(this._data)
    }
}
```

这样我们只要new 一个Vue 对象，就会将data中的数据进行【响应式】化。如果我们对data的属性进行如下操作，就会触发CallBack()方法来实现更新视图。

```js
let vm = new Vue({
    data:{
        name:'leo'
    }
})
vm._data.name = 'xxx' // output: 视图更新~ xxx
```

__依赖收集__

- **订阅者 Dep**

  首先我们来实现一个订阅者Dep，它主要的任务是用来存放Watcher观察者对象。

  ```js
  class Dep {
      constructor(){
          this.subs = []
      }
      addSubs(sub){
          this.subs.push(sub)
      }
      notify(){
          if (this.subs) {
              this.subs.forEach(sub=>{
                  sub.update()
              })
          }
      }
  }
  ```

  为了便于理解我们只实现了添加的部分代码，主要是两件事情：

  - 用addSubs方法可以在目前的Dep对象中增加一个Watcher的订阅操作；
  - 用notify方法通知目前Dep对象的subs中的所有Watcher对象触发更新操作。

- **观察者 Watcher **

  ```js
  class Watcher {
      construtor() {
          Dep.target = this
      }
      update(){
          console.log('Watcher update')
      }
  }
  Dep.target = null
  ```

- **依赖收集**

  接下来修改一下defineReactive以及Vue 的构造函数，来完成依赖收集。

  我们在闭包中增加了一个Dep类的对象，用来收集Watcher对象。在对象被【读】的时候，会触发getter函数把当前的Watcher对象（存放在Dep.target中)收集到Dep类中去。之后如果当该对象被【写】的时候，则会触发setter方法，通知Dep类调用notify来触发所有Watcher对象的update方法更新对应视图。

  ```js
  function defineReactive(obj,key,value){
      const dep = new Dep()
      Object.defineProperty(obj,key,{
          enumerable: true,
          configurable: true,
          get:()=>{
              dep.addSubs(Dep.target)
              return value
          },
          set:(newVal)=>{
              if(value === newVal) return
              dep.notify()
          }
      })
  }
  class Vue {
      constructor(options){
          this._data = options.data
          Observer(this._data)
          new Watcher()
      }
  }
  let vm = new Vue({
      data:{
          name:'leo'
      }
  })
  console.log(vm._data.name)
  vm._data.name = 'xxx' // output: Watcher update
  ```

**小结**

首先在Observer的过程中会注册get方法，该方法用来进行**【依赖收集】**。在它的闭包中会有一个Dep对象，该对象用来存放Watcher对象的实例。其实，**【依赖收集】**的过程就是把Watcher实例存放在对应的Dep对象中去。get方法可以让当前的Watcher对象（Dep.target）存放到它的subs中（addSubs)方法，在数据变化时，set会调用Dep对象的notify方法通知它内部所有的Watcher对象进行视图更新。

这是Object.defineProperty的set/get方法处理的事情，那么**【依赖收集】**的前提条件还有两个：

- 触发get方法；
- 新建一个Watcher对象。

这个我们在Vue的构造类中处理。新建一个Watcher对象只需要new出来，这时候Dep.target已经指向了这个new出来的watcher对象来。而触发get方法也很简单，实际上只要把render function 进行渲染，使其中的依赖对象能够被【读取】，这里通过调用属性值的方法，读取name的值来触发get进行【依赖收集】。