// pages/user/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageData: 'https://file.ourbeibei.com/l_e/common/JiaNan.png',
    input_text: '',
    text_area_text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onStarTap: function (event) {
    var id = event.currentTarget.id
    this.setData({
      select: id
    })
  },

  onSubmitTap: function (event) {
    var area = this.data.text_area_text
    var input = this.data.input_text
    if (area == undefined || area.length == 0 || this.data.select == undefined || input.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先填写完整资料噢',
        showCancel: false
      })
    } else {
      // console.log(area)
      // console.log(input)

      var token = app.globalData.token
      var HOST = app.globalData.HOST


      wx.request({
        url: HOST + '/various/advice.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data: {
          advice: area,
          level: this.data.select,
          contact: input
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            wx.showToast({
              title: '提交成功',
              duration: 800,
              complete: (res) => {
                setTimeout(() => {
                  wx.navigateBack({

                  })
                }, 800)
              }
            })
          } else {
            //传不成功
            wx.showToast({
              title: '提交成功',
              duration: 800,
              complete: (res) => {
                setTimeout(() => {
                  wx.navigateBack({

                  })
                }, 800)
              }
            })
          }
        }
      })
    }
  },


  AreaInputListener: function (event) {
    this.setData({
      text_area_text: event.detail.value
    })
  },

  InputListener: function (event) {
    this.setData({
      input_text: event.detail.value
    })
  },

  onFocusArea: function (event) {
    this.setData({
      focus_area: true
    })
  },

  onFocusInput: function (event) {
    this.setData({
      focus_input: true
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
    var share_texts = app.globalData.share_texts
    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]
    var share_text = share_texts[choose_number]

    return {

      title: share_text,
      path: 'page/tabBar/home/home',
      imageUrl: share_img,

    }

  },

  saveImg: function () {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {

              //下载保存网络图片
              wx.downloadFile({
                url: 'https://file.ourbeibei.com/l_e/common/JiaNan.png',
                success: function (res) {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                      wx.showToast({
                        title: '已保存至相册'
                      })
                    },
                    fail() {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                    }
                  })
                }
              })
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          //下载保存网络图片
          wx.downloadFile({
            url: 'https://file.ourbeibei.com/l_e/common/JiaNan.png',
            success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  wx.showToast({
                    title: '已保存至相册',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail() {
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
})