### 谈谈你对MVVM开发模式的理解

**MVVM是什么？**

MVVM模式，顾名思义即 Model-View-ViewModel 模式。它萌芽于2005年微软推出的基于Windows的用户界面框架WPF，前端最早的MVVM框架knockout在2010年发布。

- Model层：对应数据层的域模型，他主要做域模型的同步。通过Ajax/fetch等API完成客户端与服务端业务Model的同步。在层间关系里，它主要用于抽象出ViewModel中视图的Model。

- View层：作为视图模板存在，在MVVM里，整个View是一个动态模板。除了定义结构、布局外，它展示的是ViewModel层的数据和状态。View层不负责处理状态，View层做的是`数据绑定的声明、指令的声明、事件绑定的声明`。

- ViewModel层：把View需要的层数据暴露，并对View层的数据绑定声明、指令生命、事件绑定声明负责，也就是处理View层的具体业务逻辑。ViewModel底层会做好绑定属性的监听。当ViewModel中数据变化，View层会得到更新；而当View中声明了数据的双向绑定(通常是表单元素)，框架也会监听View层(表单)值的变化。一旦值变化，View层绑定的ViewModel中的数据也会得到自动更新。
![](https://github.com/dancingTx/web_preview/blob/master/%E9%9D%A2%E8%AF%95%E7%9B%B8%E5%85%B3/%E9%9D%A2%E8%AF%95%E4%B8%AD%E7%9A%84%E8%A7%A3%E9%87%8A%E6%80%A7%E9%97%AE%E9%A2%98(%E6%8E%92%E5%90%8D%E4%B8%8D%E5%88%86%E5%85%88%E5%90%8E)/Vue%E9%9D%A2%E8%AF%95%E9%A2%98/images/16c498ca0de66530.jpg)

**MVVM的优缺点**

**优点**

- 分离视图(View)和模型(Model)，降低代码耦合度，提高视图或者逻辑的重要性：比如视图(View)可以独立于Model变化和修改，一个ViewModel可以绑定不同的View上，当View变化的时候Model不可以不变，当Model变化的时候View也可以不变。你可以把一些视图逻辑放在一个ViewModel里面，让很多View宠用这段视图逻辑。
- 提高可测试性：ViewModel的存在可以帮助开发者更好的编写测试代码。
- 自动更新dom：利用双向绑定，数据更新后视图自动更新，让开发者从频繁的手动操作dom中解放出来。

**缺点**

- Bug很难调试：因为使用双向绑定模式，当你看见界面发生异常时，有可能是你的View的代码有Bug，也可能是Model的代码有问题。数据绑定使得一个位置的Bug被快速传递到了别的位置，要定位原始出现问题的地方变得不再容易。另外，数据绑定的声明是指令式的写在View的模板中的，这些内容没有办法去打断点debug。
- 一个大的模块中Model也会很大，虽然使用方便，也很容易保证数据的一致性，但是当长时间持有，不释放内存会造成极大的内存浪费。
- 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高。

