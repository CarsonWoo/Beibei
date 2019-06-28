// pages/discover/book/book_sign_assist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // var token = app.globalData.token
    if (options.user_id != undefined) {
      this.setData({
        user_id: options.user_id
      })
    }
    if (options.series_id != undefined) {
      this.setData({
        series_id: options.series_id
      })
    }
    if (this.data.user_id == undefined) {
      this.setData({
        user_id: wx.getStorageSync('book_user_id')
      })
    }
    if (this.data.series_id == undefined) {
      this.setData({
        series_id: wx.getStorageSync('book_series_id')
      })
    }
    var token = app.globalData.token
    console.log(app.globalData.HOST)
    wx.request({
      url: app.globalData.HOST + '/various/get_read_class_help_info.do',
      method: 'POST',
      header: {
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          console.log(res)
          var data = res.data.data
          this.setData({
            user_info: data.user_info,
            series_id: data.series_id
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken(options)
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  getToken: function(options) {
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
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData(options)

                } else {
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
                // console.log("test point")
                var token = res.data.data
                wx.setStorage({
                  key: 'token',
                  data: token,
                })
                app.globalData.token = token
                this.loadData()
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onPayOrigin: function(e) {
    let series_id = wx.getStorageSync('book_series_id')
    let HOST = app.globalData.HOST
    let token = app.globalData.token
    //原价支付
    wx.request({
      url: app.globalData.HOST + '/various/readChallengeHelpPaySecond.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      data: {
        series_id: series_id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          let payment = res.data.data
          wx.requestPayment({
            timeStamp: payment.timeStamp,
            nonceStr: payment.nonceStr,
            package: payment.package,
            signType: payment.signType,
            paySign: payment.paySign,
            success: (res) => {
              console.log(res)
              wx.showToast({
                title: '支付成功',
              })

              wx.reLaunch({
                url: '../../../tabBar/discover/discover',
              })
            },
            fail: (res) => {
              console.log("支付失败\n" + res)
            }
          })
        }
      },
      fail: (res) => {
        console.log('访问失败\n' + res)
      }
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
    if (res.from == 'button') {
      //点击助力
      return {
        title: '众人拾柴火焰高，帮我助力领课程！',
        path: 'page/tabBar/discover/discover?series_id=' + this.data.series_id + '&user_id=' + this.data.user_id,
        imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_assist.jpg'
      }
    } else {
      //右上角分享则不一样 到时要改
      return {
        title: '众人拾柴火焰高，帮我助力领课程！',
        path: 'page/tabBar/discover/discover?series_id=' + this.data.series_id + '&user_id=' + this.data.user_id,
        imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_assist.jpg'
      }
    }
  }
})