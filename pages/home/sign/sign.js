// pages/home/sign/sign.js
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
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // onSignTap: function(event) {
  //   console.log(event.detail.formId)
  //   let form_id = event.detail.formId
  //   var token = app.globalData.token
  //   var HOST = app.globalData.HOST
  //   wx.request({
  //     url: HOST + '/various/collect_form_id.do',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'token': token
  //     },
  //     data: {
  //       form_id: form_id
  //     },
  //     success: (res) => {
  //       if (res.data.status == 200) {
  //         console.log("success")
  //       } else {
  //         console.log(res)
  //       }
  //     },
  //     fail: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },

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
    if (this.data.requestToSign) {
      var pages = getCurrentPages()
      let beforePage = pages[0]
      beforePage.loadData(app.globalData.token)
      beforePage.doSignWork()
    }
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
  onShareAppMessage: function (res) {
    if (res.form) {
      if (res.form == 'button') {
        console.log(res.target)
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
                  // this.doSignWork()
                  this.setData({
                    requestToSign: true
                  })
                  wx.navigateBack({
                    
                  })
                },
                fail: (info) => {
                  wx.showModal({
                    title: '提示',
                    content: '分享到好友无效噢',
                    showCancel: false
                  })
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
                    // this.doSignWork()
                    this.setData({
                      requestToSign: true
                    })
                    wx.navigateBack({
                      
                    })
                  }
                })
              } else {
                //分享到个人
                wx.showModal({
                  title: '提示',
                  content: '分享到好友无效噢',
                  showCancel: false
                })
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

  doSignWork: function () {
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
          wx.reLaunch({
            url: '../home',
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
})