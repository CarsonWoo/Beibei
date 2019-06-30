//app.js
const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log(options)

    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })
    // this.getToken()
    wx.checkSession({
      success: (res) => {
        console.log(res)
        var storage = wx.getStorageSync('token')
        this.globalData.token = storage || null
      },
      fail: (res) => {
        console.log(res)
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        } else {
          //未授权
          // wx.redirectTo({
          //   url: '../index/index',
          // })
        }
      }
    })
  },
  getToken: function () {
    // 登录
  },
  globalData: {
    userInfo: null,
    appid: 'wx915c7b2ebc140ee6',
    token: null,
    HOST: 'https://www.ourbeibei.com',
    FTP_ICON_HOST: 'https://file.ourbeibei.com/l_e/static/mini_program_icons/',
    code: null,
    // HOST: 'http://47.102.152.102:8080',

    //-----1.1----------
    //群聊邀请者的id
    InviterUserId: 'no',
    //朋友圈邀请者的id
    PyqInviterUserId: 'no',
    //我的id
    MyUserId: 'no',

    //是否需要观看激励视频
    isneedvideoAd: true,

    //首页场景参数
    onload_options:{},

    share_imgs : new Array(
//第一次换的分享图
"https://file.ourbeibei.com/l_e/share_pic/share_img1.png", "https://file.ourbeibei.com/l_e/share_pic/share_img2.png", "https://file.ourbeibei.com/l_e/share_pic/share_img3.png", "https://file.ourbeibei.com/l_e/share_pic/share_img4.png", "https://file.ourbeibei.com/l_e/share_pic/share_img5.png", "https://file.ourbeibei.com/l_e/share_pic/share_img6.png", "https://file.ourbeibei.com/l_e/share_pic/share_img7.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img8.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img9.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img10.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img11.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img12.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img13.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img14.png",
//第二次加的图
"https://file.ourbeibei.com/l_e/share_pic/share_img15.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img16.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img17.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img18.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img19.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img20.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img21.png",
"https://file.ourbeibei.com/l_e/share_pic/share_img22.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img23.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img24.png", 
//第三次加的图
"https://file.ourbeibei.com/l_e/share_pic/share_img25.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img26.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img27.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img28.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img29.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img30.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img31.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img32.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img33.png", 
"https://file.ourbeibei.com/l_e/share_pic/share_img34.png", 
// //情人节分享专用图
// "https://file.ourbeibei.com/l_e/share_pic/share_img_520.png", 


),

    share_texts: new Array
      (
      //第一次换的分享文案
      "小呗老师大讲堂-《累成狗系列1》", 
      "小呗老师大讲堂-《就你会装系列1》",
      "小呗老师大讲堂-《累成狗系列1》",
      "小呗老师大讲堂-《累成狗系列1》",
      "小呗老师大讲堂-《累成狗系列2》", 
      "小呗老师大讲堂-《就你会装系列1》", 
      "你的前任给你送来一份礼物！",
      "爱上你，我情非得已",
      "你的女神给你发来一段私密语音！",
      "你的前任给你送来一份礼物！",
      "慎入，背单词还能看欧巴", 
      "你家里人知道背呗吗",
      "没想到你是这样的背呗",
      "邀请你加入同城交友群",
      //第二次加的文案
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《就你会装系列1》",
      "小呗老师大讲堂-《就你会装系列1》",
      "小呗老师大讲堂-《就你会装系列1》",
      "小呗老师大讲堂-《单词拯救者系列》",
      "小呗老师大讲堂-《就你会装系列1》",
      //第三次加的文案
      "管他（它）是啥呢？进来\"盘\"就对了！",
      "点击领取英语高分喷雾！",
      "A和C哪一个是苹果呀~",
      "明天开始，这些新制度将开始实行，天哪？！",
      "点击查看2019全国十大热字",
      "快来围观世纪大战！！！",
      "想知道你的那个他（她）什么时候到来吗？进来就对了！",
      "听说有个人一天背了10000个单词，是你吗？",
      "点击查看2019年度运势！",
      "点击领取小呗老师送出的新春大红包！！！",
      // //情人节文案
      // "我能想到最浪漫的事",
      ),

  }

})