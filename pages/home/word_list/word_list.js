// pages/home/word_list/word_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedPage: 1,
    word_list: [],
    firstPage: 1,
    secondPage: 1,
    thirdPage: 1,
  },

  onSelectPage: function(event) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      selectedPage: event.currentTarget.id,
    })

    // console.log(event.currentTarget.id)

    var page = event.currentTarget.id
    console.log(page)

    switch (parseInt(page)) {
      case 1:
        console.log("in 1")
        this.data.firstPage = 1
        this.requestForPage(this.data.firstPage, 15, '/home/reciting_words.do')
        break
      case 2:
        console.log("in 2")
        this.data.secondPage = 1
        this.requestForPage(this.data.secondPage, 15, '/home/mastered_words.do')
        break
      case 3:
        console.log("in 3")
        this.data.thirdPage = 1
        this.requestForPage(this.data.thirdPage, 10, '/home/not_memorizing_words.do')
        break
      default:
        console.log("in default")
        break
    }
  },

  requestForPage: function(page, size, url) {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    url = HOST + url
    console.log(url)
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        page: page,
        size: size
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res)
          this.setData({
            word_list: res.data.data
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.requestForPage(this.data.firstPage, 15, '/home/reciting_words.do')
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
  onShareAppMessage: function() {

  }
})