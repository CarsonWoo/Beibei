// pages/discover/book_sign_up/book_sign_up.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_page: 1,
    scaleAnim: {},
    reScaleAnim: {},
    introduction_image_list: ['https://file.ourbeibei.com/l_e/static/images/reading_info_pic_1.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_2.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_3.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_4.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_5.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_6.png',
      'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_7.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_8.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_9.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_10.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_11.png', 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_12.png',
      'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_13.png'
    ],
    //分开是为了使其能在上面作图
    reading_info_pic_15: 'https://file.ourbeibei.com/l_e/static/images/reading_info_pic_15.png',
    is_helping:false,//助力状态中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    if (options.is_reserved != undefined) {
      this.setData({
        is_reserved: options.is_reserved == 'true'
      })
    }

    let platform = wx.getSystemInfoSync().platform

    if (platform == 'ios') {
      this.setData({
        platform:'ios'
      })
    }

    wx.getStorageSync("is_reading")

    this.loadImg()

    this.loadData()
    // var enrollment = options.enrollment
    // this.setData({
    //   enrollment: enrollment
    // })
  },

  loadImg: function() {
    wx.request({
      url: app.globalData.HOST + '/various/showReadClassIntroductionPic.do',
      method: 'POST',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          console.log(res.data.data)
          this.setData({
            comment_imgs: res.data.data
          })
          // this.setData({
          //   reading_info_pic_7: 
          // })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  loadData: function() {
    var token = wx.getStorageSync('token')
    var HOST = app.globalData.HOST

    wx.request({
      url: HOST + '/various/showReadClass.do',
      method: 'POST',
      header: {
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          // console.log(res)
          var data = res.data.data
          var series = data.series
          var book_list = []
          if (series) {
            for (let i = 0; i < series.length; i++) {
              var obj = new Object()
              obj.list_title = series[i][0].name
              obj.demand = series[i][0].word_number_need
              obj.series_id = series[i][0].series_id
              var books = []
              for (let j = 0; j < series[i].length; j++) {
                var subObj = new Object()
                subObj.title = series[i][j].book_name
                subObj.img = series[i][j].pic
                books.push(subObj)
              }
              obj.books = books
              book_list.push(obj)
            }
          }
          let st = data.st
          if (st) {
            st = data.st.split("/")[1] + '月' + data.st.split("/")[2].split(" ")[0] + '日'
          } else {
            st = '暂无'
          }

          let signType = data.type != undefined ? data.type : ''
          this.setData({
            // series: data.series,
            st: st,
            periods: data.periods != undefined ? data.periods : '0',
            people: data.people != undefined ? data.people : '0',
            book_list: book_list,
            signType: signType
          })
          // this.drawCanvas()
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken('loadData')
        }
      },
      fail: (res) => {

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
    this.drawCanvas()
    const anim = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })

    this.scaleAnim = anim

    anim.scale3d(1.05, 1.05, 1).step()

    var reScaleAnim = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })

    reScaleAnim.scale3d(1, 1, 1).step()

    this.setData({
      scaleAnim: anim.export(),
      reScaleAnim: reScaleAnim.export()
    })
  },

  drawCanvas: function() {
    var canvasCtx = wx.createCanvasContext('course_canvas')
    canvasCtx.setStrokeStyle("#ffffff")
    canvasCtx.setFillStyle("#ffffff")
    canvasCtx.setLineCap("round")
    canvasCtx.setLineJoin("round")
    //width:260px height:50px
    canvasCtx.moveTo(80, 3)
    canvasCtx.lineTo(2, 3)
    canvasCtx.lineTo(2, 47)
    canvasCtx.lineTo(258, 47)
    canvasCtx.lineTo(258, 3)
    canvasCtx.lineTo(180, 3)
    canvasCtx.setFontSize(13)
    var period = this.data.periods
    if (parseInt(period) < 10) {
      period = '0' + period
    }
    canvasCtx.fillText("第" + period + "期", 110, 11)
    canvasCtx.stroke()

    canvasCtx.setFontSize(12)
    canvasCtx.fillText("开课时间" + this.data.st, 80, 31)

    canvasCtx.stroke()
    canvasCtx.draw()
  },

  onPageSelect: function(e) {
    var page = e.currentTarget.dataset.page
    this.setData({
      select_page: parseInt(page)
    })
  },

  onSelectBook: function(e) {
    // console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      select: index
    })
  },

  selectSignPage: function(e) {
    this.setData({
      select_page: 2
    })
  },

  showSignDialog: function(e) {
    // console.log('test')
    this.setData({
      show_sign_dialog: true
    })
  },

  cancelDialog: function(e) {
    this.setData({
      show_sign_dialog: false
    })
  },

  stopPageScroll: function() {

  },

  onSignTap: function(e) {
    wx.showLoading({
      title: '请求数据中...',
    })
    // console.log(e)
    // var payType = e.currentTarget.dataset.paytype
    console.log(this.data.book_list)
    let series_id = this.data.book_list[this.data.select].series_id
    //原价支付
    wx.request({
      url: app.globalData.HOST + '/various/readChallengePay.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      data: {
        series_id: series_id
      },
      success: (res) => {
        wx.hideLoading()
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
                success: () => {
                  wx.reLaunch({
                    url: '../../../tabBar/discover/discover',
                  })
                }
              })
            },
            fail: (res) => {
              console.log("支付失败\n" + res)
            }
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken('onSignTap')
        } else {
          wx.showModal({
            title: 'error',
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定'
          })
        }
      },
      fail: (res) => {
        console.log('访问失败\n' + res)
      }
    })

  },

  onAssistTap: function(e) {
    wx.showLoading({
      title: '请求数据中...',
    })
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    var series_id = this.data.book_list[this.data.select].series_id
    wx.request({
      url: HOST + '/various/readChallengeHelpPay.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        series_id: series_id
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status == 200) {
          console.log(res)
          let payment = res.data.data
          let user_id = payment.user_id
          let book_series_id = payment.series_id
          wx.setStorageSync('book_user_id', user_id)
          wx.setStorageSync('book_series_id', book_series_id)
          console.log('got user id storage')
          console.log(user_id)
          console.log(wx.getStorageSync('book_user_id'))
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
              var pages = getCurrentPages()
              //拿到发现页对象
              let formerPage = pages[pages.length - 2]
              console.log(formerPage)
              formerPage.loadData()

              wx.redirectTo({
                url: 'book_sign_assist?user_id=' + user_id + '&series_id=' + book_series_id,
              })

            },
            fail: (res) => {
              console.log("支付失败\n" + res)
            }
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken('onAssistTap')
        } else {
          wx.showModal({
            title: 'error',
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定'
          })
        }
      },
      fail: (res) => {
        console.log('访问失败' + res)
      }
    })
    // wx.navigateTo({
    //   url: 'book_sign_assist',
    // })
  },

  onAppoint: function(e) {
    if (this.data.is_reserved == false) {
      var HOST = app.globalData.HOST
      var token = app.globalData.token
      var series_id = this.data.book_list[this.data.select].series_id
      wx.request({
        url: HOST + '/various/reservedReadClass.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data: {
          series_id: series_id
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '预约成功',
              duration: 2000,
              success: (res) => {

                wx.reLaunch({
                  url: '../../../tabBar/discover/discover',
                })

              }
            })
          } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
            this.getToken('onAppoint')
          }
        },
        fail: (res) => {
          console.log('预约访问失败\n' + res)
        }
      })
    }
  },

  getToken: function(action) {
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
                  if (action == 'loadData') {
                    this.loadData()
                  } else if (action == 'onSignTap') {
                    this.onSignTap()
                  } else if (action == 'onAssistTap') {
                    this.onAssistTap()
                  } else if (action == 'onAppoint') {
                    this.onAppoint()
                  }
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
                if (action == 'loadData') {
                  this.loadData()
                } else if (action == 'onSignTap') {
                  this.onSignTap()
                } else if (action == 'onAssistTap') {
                  this.onAssistTap()
                } else if (action == 'onAppoint') {
                  this.onAppoint()
                }
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
    return {
      title: '【语境阅读】每天五分钟，名著收囊中',
      path: 'page/tabBar/discover/discover',
      imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_sign.jpg'
    }
  }
})