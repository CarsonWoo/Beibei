// pages/user/wallet/wallet.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    total_cash :0,

    withdrawing_cash:0,

    is_show_mask:false,

    is_show_remind_view:false,

    is_withdrawing:false,

  },

  stopPageScroll: function (e) {
  },

  OnCloseView: function (event) {
    wx.showTabBar({})
    this.setData({

      is_show_mask: false,

      is_show_remind_view: false,

    })
  },

  ToBill:function(){
    wx.navigateTo({
      url: 'BillDetail/BillDetail',
    })

  },

  ToAlipay: function () {

    if (this.data.total_cash<5){
      this.setData({
        is_show_mask: true,
        is_show_remind_view: true,
      })
    }

    else{
    wx.navigateTo({
      url: 'alipay/alipay?cash_back_number='+ this.data.total_cash,
    })
    }

  },

  ToWechatPay: function () {

    if(this.data.total_cash<5){
      this.setData({
        is_show_mask: true,
        is_show_remind_view:true,
      })
    }

    else{
    wx.navigateTo({
      url: 'wechat_pay/wechat_pay?cash_back_number=' + this.data.total_cash,
    })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadData()

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
    var share_texts = app.globalData.share_texts
    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]
    var share_text = share_texts[choose_number]

    return {

      title: share_text,
      path: 'page/tabBar/home/home',
      imageUrl: share_img,

    }

  }
,

  loadData: function () {
    var token = app.globalData.token
    console.log("token = " + token)
    var host = app.globalData.HOST
    wx.request({
      url: host + "/user/my_wallet.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {

          var total_cash = res.data.data.bill

          var whether_withdrawing = res.data.data.whether_withdrawing

          var money = res.data.data.money

          this.setData({
            total_cash: total_cash,
            withdrawing_cash: money
          })

          if (whether_withdrawing == 1){

            this.setData({

              is_withdrawing: true,

            })
          }



        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }

      },
      fail: (res) => {
        console.log("fail")
        console.log(res)
      }
    })
  },


getToken: function() {

  wx.login({
    success: (res) => {
      var code = res.code
      wx.getUserInfo({
        success: (res_user) => {
          // var token = null
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
                // console.log("token = " + token)
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
}




})