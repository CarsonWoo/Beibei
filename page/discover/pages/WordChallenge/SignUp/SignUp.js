// pages/WordChallenge/SignUp/SignUp.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  //报名单词挑战
  showSignDialog: function (e) {
    // console.log('test')
    this.setData({
      show_sign_dialog: true
    })
  },

  cancelDialog: function (e) {
    this.setData({
      show_sign_dialog: false
    })
  },


  stopPageScroll: function () {

  },


  //报名单词挑战
  SignUpChallenge:function(){  

    var token = app.globalData.token

    var host = app.globalData.HOST

    var user_id = 'no'

    if (app.globalData.InviterUserId != undefined && app.globalData.InviterUserId != 'no'){
      user_id = app.globalData.InviterUserId
      console.log("通过群链接分享报名,分享者id为" + user_id)
    }

    if (app.globalData.PyqInviterUserId != undefined && app.globalData.PyqInviterUserId !='no'){
      user_id = app.globalData.InviterUserId
      console.log("通过朋友圈扫码报名，分享者id为"+user_id)
    }

    console.log("用户id："+user_id)

    //点击报名
    wx.request({
      url: host +"/various/wordChallengePay.do",

      data: {
        user_id:user_id
      },

      method: "POST",

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token // 默认值
      },

      success(res) {

        console.log("调用支付接口，返回数据为")
        console.log(res.data)

        if(res.data.status == 200){

        // 调用微信支付api
        wx.requestPayment({

          timeStamp: String(res.data.data.timeStamp),//记住，这边的timeStamp一定要是字符串类型的，不然会报错
          nonceStr: String(res.data.data.nonceStr),
          package: String(res.data.data.package),
          signType: 'MD5',
          paySign: String(res.data.data.paySign),
          success: function (event) {
            // success   
            console.log(event);
            console.log("支付成功")
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                console.log('haha');
                setTimeout(function () {
                  we: wx.redirectTo({
                    url: '../WaitingChallenge/WaitingChallenge',
                  })
                }, 2000)
              }
            });
          },
          fail: function (error) {
            // fail   
            console.log("支付失败")
            console.log(error)

          },
          complete: function () {
            // complete   
            console.log("pay complete")
          }
        });
        }
        else{
          console.log(res.data)
        }

      },
      fail: (res) => {
        console.log("fail")
        console.log(res)

      }
    })

  },

  ToRule:function(){

    we:wx.navigateTo({
      url: '../Rule/Rule',
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },
  ToIntvitionRank:function(){

    we: wx.navigateTo({
      url: '../InvitationRank/InvitationRank',
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })

  },

  // StartChallenge:function{




  // }

  //     ToInvite:function{


  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var token = app.globalData.token

    let platform = wx.getSystemInfoSync().platform

    console.log('platform' + platform)

    if(platform == 'ios'){
      this.setData({
        platform: 'ios'
      })
    }
    if (token) {
      console.log(token)
      this.loadData(token)
    } else {
      // console.log(token)
      this.getToken()
    }



  },





//阿拉伯数字转中文

   SectionToChinese:function (section){

    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while(section > 0){
      var v = section % 10;
       if (v === 0) {
         if (!zero) {
             zero = true;
              chnStr = chnNumChar[v] + chnStr;
          }
        } else {
             zero = false;
             strIns = chnNumChar[v];
             strIns += chnUnitChar[unitPos];
             chnStr = strIns + chnStr;
              }   
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
    },





  loadData: function (token) {

  wx.request({
    url: app.globalData.HOST + "/various/show_word_challenge.do",
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'token': token
    },
    success: (res) => {
      console.log(res.data)

      var people = 0;

      var data = res.data
      if (data.status == 200) {

        //用户本人挑战打卡排行
        var word_challenge_Data = data.data
        var st = word_challenge_Data.st
        var periods = word_challenge_Data.periods
        var et = word_challenge_Data.et

        if(word_challenge_Data.people){

          people = word_challenge_Data.people

        }

        // periods = this.SectionToChinese(periods)

        console.log(periods)

        //日期格式转换
        var da = st;
        da = new Date(da);
        var year = da.getFullYear() + '年';
        var month = da.getMonth() + 1 + '月';
        var date = da.getDate() + '日';
        st = [year, month, date].join('');
        st = '开始时间: ' + st

        //日期格式转换
        var da = et;
        da = new Date(da);
        var year = da.getFullYear() + '年';
        var month = da.getMonth() + 1 + '月';
        var date = da.getDate() + '日';
        et = [year, month, date].join('');
        et = '结束时间: ' + et

        console.log(st)
        console.log(et)

        this.setData({

          st: st,
          periods: periods,
          people: people,
          et: et,

        })

      } else {
        if (data.status == 400 && data.msg == '身份认证错误！') {
          this.getToken()
        }
      }
    },
    fail: (res) => {
      console.log(res)
    }
  })

    //邀请链接参数
    wx.request({
      url: app.globalData.HOST + "/various/show_invite_link_inner.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {

          var share_msg = data.data.msg
          var share_user_id = data.data.user_id

          console.log(share_msg)
          console.log(share_user_id)

          this.setData({

            share_msg: share_msg,
            share_user_id: share_user_id

          })

        } else {
          if (data.status == 400 && data.msg == '身份认证错误！') {
            this.getToken()
          }
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },




//重新获取token
  getToken: function () {
    wx.login({
      success: (res) => {
        var code = res.code
        wx.getUserInfo({
          success: (res_user) => {
            // var token = null
            // console.log("in")
            wx.request({
              url: app.globalData.HOST + '/user/wx_login.do',
              data: {
                code: code,
                username: res_user.userInfo.nickName,
                gender: res_user.userInfo.gender,
                portrait: res_user.userInfo.avatarUrl
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {

                if (res.data.status == 200) {

                  console.log(res.data)
                  var token = res.data.data
                  console.log("token = " + token)
                  // this.globalData.token = token
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData(token)
                  
                }
                else {
                  console.log("登录失败" + res.data.msg)
                }

              },
              fail: (res) => {
                console.log("request fail")
              }
            })
            // this.globalData.token = token
          },
          fail: () => {
            // var token = null
            wx.request({
              url: app.globalData.HOST + '/user/wx_login.do',
              data: {
                code: code,
                username: null,
                gender: null,
                portrait: null
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {
                console.log(res.data)
                console.log("test point")
                var token = res.data.data
                // console.log(token)
                // console.log(this)
                // this.globalData.token = token
                wx.setStorage({
                  key: 'token',
                  data: token,
                })
                app.globalData.token = token
                this.loadData(token)
              },
              fail: (res) => {
                console.log("getUserInfo Fail && request Fail")
              }
            })
            // console.log(token)
            // this.globalData.token = token
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var share_imgs = app.globalData.share_imgs
    var choose_img_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_img_number]
    var share_texts = new Array
      (
      "点这里，不仅可以学好英语，还能瓜分奖金",
      "学习太枯燥，进来边学习边赚钱!",
      "知识就是金钱",
      "这一次，让毅力战胜懒惰！！",
      "我正在背单词赢奖金，送你一个名额，有钱一起赚",
      )
    var choose_text_number = parseInt(Math.random() * share_texts.length, 10)
    var share_text = String(share_texts[choose_text_number])
    return {
      title: share_text,
      path: 'page/tabBar/home/home?InviterUserId=' + this.data.share_user_id,
      imageUrl: 'https://file.ourbeibei.com/l_e/common/NoChallenge.jpg' ,
    }

    // console.log(this.data.share_msg)
    // var msg = this.data.share_msg
    // var img_url = '/images/image_share.png'
    // if (msg.search("跟我一起") != -1) {
    //   this.setData({
    //     mas: msg
    //   })
    //   img_url = 'https://file.ourbeibei.com/l_e/common/NoChallenge.jpg'
    // }
    // if (msg.search("已在背呗") != -1) {
    //   this.setData({
    //     mas: msg
    //   })
    //   img_url = 'https://file.ourbeibei.com/l_e/common/Challenging.jpg'
    // }
    // if (msg.search("我已成功") != -1) {
    //   this.setData({
    //     mas: msg
    //   })
    //   img_url = 'https://file.ourbeibei.com/l_e/common/ChallengeSccessed.jpg'
    // }
    // console.log(img_url)
    // return {
    //   title: "十万火急，需要你的一次助力！！！",
    //   path: 'pages/home/home?InviterUserId=' + this.data.share_user_id,
    //   imageUrl: 'https://file.ourbeibei.com/l_e/common/Challenging.jpg',
    // }

  }

})