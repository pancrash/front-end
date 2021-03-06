## WeChat_mp
---
### 点开小程序的瞬间加载流程
1. 微信客户端初始化宿主环境
2. 小程序代码包
   - 本地缓存
   - 网络下载
3. 实例化APP
   - 派发 onLaunch 事件
4. 进入小程序

### 页面生命周期函数
- 页面初次加载时 onLoad
  - 监听页面加载
  - 页面加载时触发
  - 一个页面在被销毁之前只会调用一次
  - 可以在其参数中获取打开当前页面路径中的参数
- 页面初次渲染完成时 onReady
  - 监听页面初次渲染完成时
  - 页面初次渲染完成时触发
  - 一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
- 页面显示时 onShow
  - 监听页面显示
  - 页面显示/切入前台时触发
- 页面不可见时 onHide
  - 监听页面隐藏
  - 页面隐藏/切入后台时触发
- 页面卸载时 onUnload
  - 监听页面卸载
  - 页面卸载时触发

### 页面事件函数
- 用户下拉动作 onPullDownRefresh
  - 监听用户下拉动作，下拉刷新时间等
  - 需在 app.json 的 window 选项中或页面配置中开启enablePullDownRefresh
  - 可通过 wx.startPullDownRefresh 手动触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
- 用户上拉触底事件 onReachBottom
  - 页面上拉触底的处理函数
  - 可以在 app.json 的 window 选项中或页面配置中设置触发距离 onReachBottomDistance
  - 再触发距离内滑动期间，该事件只会触发一次
- 页面滚动 onPageScroll
  - 监听用户滑动页面事件，参数为 Object, 包含 scrollTop 字段，表示页面在垂直方向已滚动的距离（单位px）
- 用户转发 onShareAppMessage
  - 只有定义了此事件处理函数，右上角菜单才会显示"转发"按钮
  - 在用户点击转发按钮的时候会调用，此事件需要return一个Object，包含title和path两个字段，用于自定义转发内容