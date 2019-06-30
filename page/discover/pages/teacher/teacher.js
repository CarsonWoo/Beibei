// pages/discover/teacher/teacher.js
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
    this.loadData()
  },

  loadData: function() {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/showSelectReadClassTeacher.do',
      method: 'POST',
      header: {
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status == 200) {
          let st = res.data.data.st
          let et = res.data.data.et
          st = st.split(" ")[0]
          et = et.split(" ")[0]
          this.setData({
            image_teacher: res.data.data.qr_code,
            et: et,
            st: st,
            class_name: res.data.data.name
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {
        console.log('访问失败' + '\n' + res)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.drawCanvas()
  },

  drawCanvas: function() {
    var canvasCtx = wx.createCanvasContext('download_image')
    canvasCtx.setStrokeStyle("#5ee1c9")
    canvasCtx.setLineJoin("round")
    canvasCtx.setLineCap("round")
    canvasCtx.moveTo(6, 4)
    canvasCtx.lineTo(10, 4)
    canvasCtx.lineTo(10, 10)
    canvasCtx.lineTo(14, 10)
    canvasCtx.lineTo(8, 14)
    canvasCtx.lineTo(2, 10)
    canvasCtx.lineTo(6, 10)
    canvasCtx.lineTo(6, 4)
    canvasCtx.moveTo(1, 15)
    canvasCtx.lineTo(15, 15)

    canvasCtx.stroke()
    canvasCtx.draw()
  },

  downloadImage: function(e) {
    let that = this;
    let image_teacher = this.data.image_teacher
    image_teacher = image_teacher.replace('http://47.107.62.22', 'https://file.ourbeibei.com')
    console.log(image_teacher)
    wx.showLoading({
      title: '下载中',
    })
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success: (res) => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {

              //下载保存网络图片
              wx.downloadFile({
                url: image_teacher,
                success: (res) => {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                      wx.hideLoading()
                      wx.showToast({
                        title: '已保存至相册'
                      })
                    },
                    fail: () => {
                      wx.hideLoading()
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                    }
                  })
                }
              })
            },
            fail: () => {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              this.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          //下载保存网络图片
          wx.downloadFile({
            url: image_teacher,
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '已保存至相册',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail:() => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      }
    })
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
    return {
      title: '【语境阅读】每天五分钟，名著收囊中',
      path: 'page/tabBar/discover/discover',
      imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_sign.jpg'
    }
  }
})