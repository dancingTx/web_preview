## 基于淘宝弹性布局方案lib-flexible的问题研究

`lib-flexible`从某种意义上解决了移动端多端适配的问题，但同时，这种适配方案也存在着无法改变的缺陷。

`lib-flexible`在做适配的时候会修改`viewport`的`initial-scale`，导致`viewport`的`width`不等于`device-width`，使得那些根据`width`编写的`media query`不一定如预期一般执行，还有移动端Web经典的`Retina`屏问题和`1px`边框问题在`lib-flexible`下也会于通常的做法有所差异，接下来就根据问题提供一些解决办法及思路。

**1.lib-flexible不能与响应式布局兼容**

先说说响应式布局的一些基本认识：

响应式布局的表现是：网页通过CSS媒介查询判断可视区域的宽度，在不同的范围应用不同的样式，以便在不同尺寸的设备上呈现最佳的界面效果。经典的例子是，有一个商品列表页，应用响应式布局后，可能在PC端采用4列布局展示，在平板上可能采用3列布局展示，在手机上只需要1列布局展示。这种布局的最大好处在于节省人力、资源和时间，因此很多公司都喜欢采用此种方案。而响应式布局有两个必要条件：

- 1.是`viewport`的设置，`width`跟`initial-scale`要采用如下配置，保证`viewport`的宽度和`device-width`一致：

  ```html
  <meta name='viewport' content='width=device-width,initial-scale=1' />
  ```

- 2.是要利用`media query`，针对不同的`width`范围，编写不同的CSS,比如`bootstrap`:

  ```css
  @media (max-width: @screen-xs-max) { ... }
  @media (min-width: @screen-sm-min) and (max-width: @screen-sm-max) { ... }
  @media (min-width: @screen-md-min) and (max-width: @screen-md-max) { ... }
  @media (min-width: @screen-lg-min) { ... }
  ```

需要注意的是，第1个要求提到的`device-width`与`media query`里面的`device-width`属性表达的意思有些区别：第1个要求提到的`device-width`在移动设备下指的是设备的宽度，但是在PC下指的是浏览器的可视区域宽度，比如下面的网页，我把浏览器窗口缩小，然后可以看到`viewport`里尽管已经把`width`设置成了`device-width`，但是网页大小却不是我的桌面分辨率宽度(设备宽度)：

![](E:\pro\web_preview\HTML5相关\H5移动端\images\querstion\459873-20160109212430184-426453882.png)

`media query`里的`device-width`属性，始终指的是设备的宽度。所以响应式布局的媒介查询要用`width`属性，不用`device-width`属性，因为在桌面设备下，把浏览器窗口缩小的时候，`device-width`并不会发生变化，当调整浏览器窗口大小就看不到响应式的效果。

再来看看`lib-flexible`的特点：

`lib-flexible`在适配的时候会修改`viewport`的`initial-scale`,导致`viewport`的`width`不等于`device-width`。这是采用`lib-flexible`，在IPhone6+下适配后，自动添加的`viewport`设置代码：

```html
<meta name='viewport' content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no" />
```

在这个`viewport`的作用下，网页的缩放系数为`0.3333333333333333`，IPhone6+的`device-width`为`414`个不缩放的CSS像素，经过缩放后，`viewport`的`width`等于`device-width / 0.3333333333333333`，为`1241`个缩放后的CSS像素，远远大于`device-width`：

![](E:\pro\web_preview\HTML5相关\H5移动端\images\querstion\459873-20160109212432325-1240238690.png)

假如你的网页想同时使用响应式布局和`lib-flexible`,然后你写了一个媒介查询，需要在`1024px`以上的分辨率(桌面设备)呈现某个特殊样式：

```css
@media only screen and (min-width: 1024px) {
    body {
        border: 10px solid #ccc;
    }
}
```

会发现这个页面在IPhone6+下也会应用到该媒介查询的样式：

![](E:\pro\web_preview\HTML5相关\H5移动端\images\querstion\459873-20160109212433840-1706265521.png)

究其原因：IPhone6+下的网页由于`lib-flexible`的作用，导致页面的`width`与实际物理分辨率的宽相等，也就是`1241`个像素，完全达到了该媒介查询的范围。

所以，在使用`lib-flexible`的项目里很难再实现响应式布局，要是有人有这种综合两者一起使用的想法，可得注意了。实际上，这两种方案本质性的东西就不相同，使用场景也不相同。响应式布局的目的是一套代码，能够在手机平板和PC上都有良好的表现，适用于网站类项目，而`lib-flexible`解决的是手机端网页适配的问题，压根不会去关心平板和PC的表现，适用于`web app`类项目。

**2.1px边框在`lib-flexible`下如何处理**

`web app`有时候会设计出一些特别细的线条或者边框，如果我们直接通过CSS设置边框为`1px`:

```css
border:1px solid #ccc;
```

结果会发现这种边框在手机中看起来的效果，会显得特别粗，之所以会出现这种结果，原因也很简单，因为目前市场大部分手机的分辨率较高，一个CSS像素，比如，上述代码为`1px`，可能相当于`2`个甚至是`3`个物理分辨率像素，而不像PC端，一个CSS像素，始终等于 `1`个物理分辨率像素，所以手机里看到的`1px`会比实际的粗。

为了解决这个问题，你可能会想到用`0.5px`来代替`1px`，不过这个解决不了问题，而且带小数的像素在不同的浏览器下表现不尽相同，要尽量避免。

那么通常来说在`web app`下显示`1px`的做法是怎么样的呢？在`weui`源码中有一个较好的办法，值得分享：

```css
//这是一个mixin，用来设置顶部的边框，其它方向的代码没有贴出
.setTopLine(@c: #C7C7C7) {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid @c;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}

//应用举例
.weui_cell {
    // onepx
    position: relative;
    &:before {
        .setTopLine(@weuiCellBorderColor);
    }
}
```

这个办法并不是利用`border`属性来显示边框，而是利用了伪类和`transform`，最妙的是这个`transform`，`0.5px`办不到的事情，它却可以办到。

由于`lib-flexible`在适配的时候，会缩放网页，导致CSS代码中的`1px`等于物理分辨率的`1px`，这样子这个`1px`边框的问题在经过`lib-flexible`适配的设备下就很好解决了，直接应用`border:1px solid xxx`即可。但是**lib-flexible目前只适配了IPhone设备，安卓设备压根没做适配**。

![](E:\pro\web_preview\HTML5相关\H5移动端\images\querstion\459873-20160109212435231-1310836847.png)

通过源码可以看出，Android设备的`dpr`全部设置为`1`，因此也导致了在Android设备下，`1px`的边框问题依然存在。所以为了`lib-flexible`的项目里解决掉`1px`问题，就需要综合上述两种做法：

```css
.setTopLine(@c: #C7C7C7) {
  & {
    position: relative;
  }

  &:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid @c;
  }

  [data-dpr="1"] &:before {
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
}
/*照着这个可以再写setBottomLine等相关mixin*/
```

通过两种方案的混合，经过测试，在`devicePixelRatio`为`3`的`meilan note`上，显示出的线条非常细腻，看起来比较舒服，IPhone上的表现也很不错，以下是`meilan note`测试截图：

![](E:\pro\web_preview\HTML5相关\H5移动端\images\querstion\459873-20160109212436075-1504512633.jpg)

第一根线是上面的`mixin`效果；第二根线是直接使用`border:1px solid xxx;`的效果。

以上提到的`1px`边框的做法有三个缺陷，在使用时需要注意：

- 他会占用掉`before`伪类
- 没办法做圆角
- 很难实现多条边框，除非嵌套，或者再利用上`after`伪类

尽管如此，以上做法还算是比较有用的做法，因为这种细线边框属于比较特殊的设计要求，并不是每处边框都需要做成这样，在开发`web app`的时候用这个方法保证特殊线条的设计要求，其它的边线，我觉得直接用`border`并没有关系，你可以直接用你的手机打开`bootstrap`的官方页面，看它里面的按钮边框，效果都还不错。