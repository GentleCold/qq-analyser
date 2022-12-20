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
#### 初次启动后，到安装根目录 ```/YourApp/utils/go-cqhttp/```下
#### 打开图片，手机 qq 扫码登陆
#### 若显示过期，则重新打开
#### 登陆一次后不用再登陆
## 开发
#### to run
```> npm run init & npm run start```
#### to build
```> npm run build```
## Licence
AGPL-3.0
