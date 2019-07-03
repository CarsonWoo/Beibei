// pages/home/feed/feed.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:0,
    scrollviewheight:0,
  },

  onLikeTap: function (event) {
    // app = getApp()
    var anim = wx.createAnimation({
      
    })

    anim.backgroundColor("transparent").scale3d(0.8, 0.8, 0.8).scale3d(0.5, 0.5, 0.5).scale3d(0.8, 0.8, 0.8).step({duration: 170})
    // anim..step({
    //   duration:300
    // })
    anim.backgroundColor("#5ee2c9").scale3d(1, 1, 1).step({duration:170})
    // anim..step({duration:200})
    // anim.scale3d(1, 1, 1).rotateZ(0).step({duration: 400})

    this.setData({
      animation: anim.export()
    })

    console.log("tap")
    console.log(this.data.id)
    wx.request({
      url: app.globalData.HOST + '/home/like_feeds.do',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      method: 'POST',
      data: {
        id: this.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: '点赞成功',
            duration: 800
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

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
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData()
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var location = options.location
    this.setData({
      id: id
    })
    if (location != null && location != undefined) {
      this.setData({
        location: location
      })
    }
    this.loadData()
  },

  loadData: function() {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/home/article_detail.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        id: this.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          console.log(data)
          this.setData({
            author_portrait: data.author_portrait,
            pic: data.pic,
            title: data.title,
            author_username: data.author_username,
            order: data.order,
            likes: data.likes
          })
          var data = res.data.data
          var that = this
          for (var i = 0; i < data.order.length-1;i++){
            wx.getImageInfo({
              src: data.order[i + 1].pic,
              success: function (res) {
                var scrollviewheight = that.data.scrollviewheight+res.height/1.5
                // console.log(res.height)
                that.setData({
                  scrollviewheight:scrollviewheight
                })
                console.log(scrollviewheight)
              }
            })
          }
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
    var location = this.data.location
    if (location != null && location != undefined) {
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: location,
          duration: 500
        })
      }, 300)
    }
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

  // 监听页面滑动
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    var location = e.scrollTop
    this.setData({
      location: location,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var share_imgs = app.globalData.share_imgs
    var share_texts = app.globalData.share_texts
    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]
    var share_text = share_texts[choose_number]
    return {
      title: this.data.title,
      path: 'page/tabBar/home/home?action=onFeedsTap'+'&feed_id=' + this.data.id + '&feed_location=' + this.data.location,
      // imageUrl: share_img,
    }

  }
})