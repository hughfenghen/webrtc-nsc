# 无需server创建webrtc私密连接

## 启动
1. 安装依赖：`yarn install`
2. 运行：`yarn dev`

## 使用
1. 启动后，访问`http://localhost:1234/webrtc-nsc/host.html`  
2. 点击页面首行的链接
3. 复制新打开页面answer后面的内容，粘贴到`host.html`的**应答密令**输入框中，点击**连接**按钮  
4. 查看两个页面的控制台，如果`invitee.html`页面有打印`===== onmessage:  dididi`说明传递消息成功  

## 注意事项
1. 连接双方不要使用代理