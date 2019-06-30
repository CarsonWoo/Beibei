// pages/WordChallenge/Rule/Rule.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    rule_image: '/images/challenge_rule.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var token = app.globalData.token
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

    console.log(this.data.share_msg)

    var msg = this.data.share_msg

    var img_url = '/images/image_share.png'

    if (msg.search("跟我一起") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/NoChallenge.jpg'
    }

    if (msg.search("已在背呗") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/Challenging.jpg'
    }

    if (msg.search("我已成功") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/ChallengeSccessed.jpg'
    }

    console.log(img_url)

    if (res.form) {
      if (res.form == 'button') {
        console.log(res.target)
      }
    }
    return {
      title: this.data.msg,
      path: 'page/tabBar/home/home?InviterUserId=' + this.data.share_user_id,
      imageUrl: img_url,
    }

  }
})