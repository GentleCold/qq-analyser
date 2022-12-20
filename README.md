## qq 群分析助手 (v-0.0.2)
#### 基于 electron 和 go-cqhttp
#### go-cqhttp 地址：https://github.com/Mrs4s/go-cqhttp
## 功能
* 基本
  - [x] 群，消息，存入本地 sqlite
  - [x] 选择窗口置顶
  - [x] 选择拉取群成员列表存入数据库（存在性能问题）
* 图表
  - [x] 消息频率与时间折线图
  - [x] 消息总数柱状图
* 其他
  - [x] 群消息弹幕
  - [x] 群消息分词与词频显示
* 后续
  - [ ] 消息话题分类
  - [ ] 情绪拟合
  - [ ] 加群人数预测
  - [ ] 不活跃成员
## 食用
#### 初次启动后，到目录 ```/YourApp/utils/go-cqhttp/```下
#### 打开```qrcode.png```，手机 qq 扫码登陆
#### 若显示过期，则重新启动软件，再重复上述步骤
#### 登陆一次后不用再登陆
## 配合 python
#### 软件启动后会在目录```/YourApp/utils/```生成 qq.db，若有相应 python 环境，则可使用项目中 ```py/*.ipynb```文件生成报告
## 已知问题
#### 1. 首次启动会有无法打开数据库的报错，可忽略
#### 解决办法：重新启动后即可正常创建数据库 qq.db
#### 2. go-cqhttp 会在约 10 - 20 分钟后无法上报消息
#### 解决办法：软件会间隔 15 分钟自行重启 go-cqhttp
## 开发
#### to run
```> npm run init & npm run start```
#### to build
```> npm run build```
## Licence
AGPL-3.0
