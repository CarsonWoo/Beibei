// page/discover/pages/CET/CET_teacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qr_code: 'https://file.ourbeibei.com/l_e/static/images/cet_teacher_qr_code.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  drawCanvas: function () {
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

  downloadImage: function (e) {
    let that = this;
    let image_teacher = 'https://file.ourbeibei.com/l_e/static/images/cet_teacher_qr_code.png'
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
                fail: () => {
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
      title: '过四六级，来这里就对了。',
      imageUrl: '',
      path: 'page/tabBar/home/home'
    }
  }
})