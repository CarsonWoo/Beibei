// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // flag: 1,
    type: 0,
    storage: false,
    isShowDialog: false,
    alert_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = app.globalData.token
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    if (token) {
      console.log(token)
      this.loadData(token)
    } else {
      // console.log(token)
      this.getToken()
    }
  },

  onDrawProgress: function() {
    var ctx = wx.createCanvasContext('progress-canvas')
    ctx.setStrokeStyle("#edeff3")
    // ctx.setStrokeStyle("black")
    ctx.setLineWidth(1.5)
    ctx.setLineCap("round")

    // ctx.beginPath()
    ctx.beginPath()

    ctx.moveTo(39, 194)

    ctx.arc(120, 120, 110, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.moveTo(54, 187)

    ctx.arc(120, 120, 95, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.moveTo(54, 187)

    ctx.quadraticCurveTo(55, 200, 40, 197)

    ctx.moveTo(186, 187)

    ctx.quadraticCurveTo(185, 200, 200, 197)

    ctx.stroke()

    ctx.setLineWidth(1)
    ctx.setStrokeStyle("#5ee1c9")
    ctx.beginPath()

    ctx.moveTo(46.5, 190.5)

    ctx.arc(120, 120, 102.5, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.stroke()

    ctx.setLineWidth(4)
    ctx.setStrokeStyle("#5ee1c9")
    ctx.beginPath()

    ctx.moveTo(44.5, 188.5)

    var progress = this.data.learned_word / this.data.plan_number

    // console.log(progress)

    ctx.arc(120, 120, 102.5, 0.75 * Math.PI, (0.75 + 1.5 * progress) * Math.PI, false)

    ctx.stroke()

    ctx.beginPath()

    ctx.moveTo(90, 70)

    ctx.setFontSize(15)
    ctx.setFillStyle("black")
    ctx.fillText("已背单词", 90, 70)

    ctx.fill()

    ctx.beginPath()

    ctx.moveTo(50, 150)

    var length = this.data.learned_word.toString().length
    // console.log(length)

    ctx.setFontSize(60)
    ctx.setFillStyle("#5ee2c9")
    //还需要对font-size进行转换
    ctx.fillText(this.data.learned_word.toString(), 120 - length / 2 * 60 * 0.6, 150)

    ctx.fill()

    ctx.draw()
  },

  onPrizeTap: function(event) {
    wx.navigateTo({
      url: 'prize/prize?level=' + this.data.level,
    })
  },

  onPlanTap: function(event) {
    wx.navigateTo({
      url: '../user/plan/plan',
    })
  },

  onStartTap: function(event) {
    console.log(event)
    wx.navigateTo({
      url: 'word/word?level=' + this.data.level,
    })
  },

  onJoinTap: function() {
    wx.navigateTo({
      url: '../word/word',
    })
  },

  onShareTap: function() {
    console.log("onShare")
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    // this.onShareAppMessage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.loadData()
    // this.onDrawProgress()
    this.setData({
      storage: wx.getStorageSync('currentPointer')
    })
  },

  onFeedsClick: function(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'feed/feed?id=' + id,
    })
  },

  loadData: function(token) {
    wx.request({
      url: app.globalData.HOST + "/home/home_page_info.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {
          // console.log("in")
          let homeData = data.data
          let flag = homeData.flag
          let learned_word = homeData.learned_word
          let insist_days = homeData.insist_days
          let rest_days = homeData.rest_days
          let level = homeData.level
          let plan_number = homeData.plan_number
          let feeds = homeData.feeds

          var portraits = homeData.head_user_portrait
          let whether_template = parseInt(homeData.whether_template)
          wx.setStorage({
            key: 'whether_template',
            data: whether_template,
          })

          this.setData({
            flag: flag,
            learned_word: learned_word,
            insist_days: insist_days,
            rest_days: rest_days,
            level: level,
            plan_number: plan_number,
            feeds: feeds,
            user_default_portrait_1: portraits[0],
            user_default_portrait_2: portraits[3],
            user_default_portrait_3: portraits[5],
            whether_reminder: parseInt(homeData.whether_reminder)
          })
          this.onDrawProgress()
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
    // console.log(app.globalData.HOST + "/home/home_page_info.do")
  },

  getToken: function() {
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
                console.log(res.data)
                var token = res.data.data
                // console.log("token = " + token)
                // this.globalData.token = token
                wx.setStorage({
                  key: 'token',
                  data: token,
                })
                app.globalData.token = token
                this.loadData(token)
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

  onCanvasTap: function(event) {
    wx.navigateTo({
      url: 'word_list/word_list',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // console.log("onRefresh");
    this.loadData(app.globalData.token)
    setTimeout(this.stopPullDownRefresh, 500)
  },

  stopPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log("onShare")
    if (res != undefined) {
      if (res.form != undefined) {
        if (res.form == 'button') {
          console.log(res.target)
        }
      }
    }
    // console.log(res)
    return {
      title: '我正在背呗背单词赢奖品，快来跟我一起背~',
      path: '/pages/home/home',
      imageUrl: 'https://file.ourbeibei.com/l_e/common/brother.jpg',
      success: (res) => {
        //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
        //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
        //获取用户设备信息
        wx.getSystemInfo({
          success: (d) => {
            console.log(d)
            //判断是Android还是IOS
            if (d.platform == 'android') {
              wx.getShareInfo({
                shareTicket: res.shareTickets,
                success: (info) => {
                  //记录打卡
                  if (this.data.level == 1) {
                    this.doSignWork()
                  }
                },
                fail: (info) => {
                  if (this.data.level == 1) {
                    wx.showModal({
                      title: '提示',
                      content: '分享到好友无效噢',
                      showCancel: false
                    })
                  }

                }
              })
            }
            if (d.platform == 'ios') {
              if (res.shareTickets != undefined) {
                console.log("分享到群")
                wx.getShareInfo({
                  shareTicket: res.shareTickets,
                  success: (info) => {
                    //打卡
                    if (this.data.level == 1) {
                      this.doSignWork()
                    }
                  }
                })
              } else {
                //分享到个人
                if (this.data.learned_word == 1) {
                  wx.showModal({
                    title: '提示',
                    content: '分享到好友无效噢',
                    showCancel: false
                  })
                }

              }
            }
          },
        })
      },
      fail: (res) => {
        console.log(res)
      }
    }
  },

  doSignWork: function() {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/home/clock_in.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            level: this.data.level + 1
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  onCloseDialog: function(event) {
    this.setData({
      isShowDialog: false
    })

  },

  onMoneyTap: function(event) {
    this.setData({
      isShowDialog: true,
      alert_type: 1
    })
    setTimeout(this.onCloseDialog, 1500)
  },

  onEventTap: function(event) {
    this.setData({
      isShowDialog: true,
      alert_type: 2
    })
  },

  toWebView: function(event) {
    this.onCloseDialog()
    wx.navigateTo({
      url: '../discover/web/web',
    })
  },

  onFishTap: function(event) {
    this.setData({
      isShowDialog: true,
      alert_type: 3
    })
  },

  onSubmitAppoint: function(event) {
    this.onCloseDialog()
    //预约提醒
    let token = app.globalData.token
    let HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/appointment_to_remind.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            whether_reminder: 1
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  onPostChance: function(event) {
    // console.log(event.detail.formId)
    let form_id = event.detail.formId
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/collect_form_id.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        form_id: form_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log("success")
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  }
})