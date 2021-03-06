### 在浏览器中输入URL到页面进行渲染的过程中发生了什么？

可以参考如下图理解：（图片来自《HTTP权威指南》）

![](https://github.com/ytx1150328467/web_preview/blob/master/%E9%9D%A2%E8%AF%95%E7%9B%B8%E5%85%B3/%E9%9D%A2%E8%AF%95%E4%B8%AD%E7%9A%84%E8%A7%A3%E9%87%8A%E6%80%A7%E9%97%AE%E9%A2%98(%E6%8E%92%E5%90%8D%E4%B8%8D%E5%88%86%E5%85%88%E5%90%8E)/HTTP%E7%9B%B8%E5%85%B3%E9%9D%A2%E8%AF%95%E9%A2%98/images/2862899185-5c0d0bf5b5a52.png)

描述：

- 当用户输入`URL`后，浏览器开始解析主机名
- `DNS`进行域名解析，即 将语义化的主机名解析成`IP`地址
- 浏览器通过解析的域名获得端口号
- 浏览器根据得到的`IP`地址和端口号发起`TCP`连接
- 浏览器发起`HTTP`请求
- 浏览器读取服务器返回的响应报文
- 浏览器对返回的`HTML`进行渲染
- 浏览器断开`TCP`连接

