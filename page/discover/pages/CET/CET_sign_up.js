const app = getApp()
// page/discover/pages/CET/CET_sign_up.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_urls: ['https://file.ourbeibei.com/l_e/static/images/bg_cet_1.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_2.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_3.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_4.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_5.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_6.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_7.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_8.png', 'https://file.ourbeibei.com/l_e/static/images/bg_cet_9.png', ],
    vidx: 0,
    isShowDialog: false,
    translateAnimation: '',
    isHidden: true,
    platform:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = wx.getStorageSync('token')
    let inviter = options.inviter
    //将开发工具也视为ios端方便测试
    let platform = wx.getSystemInfoSync().platform
    if(platform=='ios'||platform=='devtools'){
      this.setData({
        platform:'ios'
      })
    }else{
      this.setData({
        platform: 'android'
      })
    }
    if (inviter != null && inviter != undefined) {
      this.setData({
        inviter: inviter
      })
    }
    this.loadData(token)
  },

  loadData: function(token) {
    let HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/liveCourseApplicationPage.do',
      method: 'POST',
      header: {
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          let rawData = res.data.data
          console.log(rawData)
          let st = rawData.st
          st = st.split(' ')[0]
          let dates = st.split('/')
          st = dates[1] + '月' + dates[2] + '日'
          let et = rawData.et
          et = et.split(' ')[0]
          dates = et.split('/')
          et = dates[1] + '月' + dates[2] + '日'
          let people = rawData.people
          let status = rawData.status
          let virtualUser = rawData.virtualUser
          let user_id = rawData.user_id
          this.setData({
            st: st,
            et: et,
            people: people,
            status: status,
            virtualUser: virtualUser,
            user_id: user_id
          })
          this.setTransformAnim()
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      }
    })
  },

  getToken: function() {
    wx.login({
      success: (res) => {
        let code = res.code
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

            if (res.data.status == 200) {
              var token = res.data.data
              console.log("login_success" + res.data.msg)
              console.log("token = " + token)
              wx.setStorageSync('token', token)
              app.globalData.token = token
              this.loadData(token)
            } else {
              console.log("login_fail" + res.data)
            }
          },
          fail: (res) => {
            console.log("request Fail")
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

  setTransformAnim: function() {
    setInterval(() => {
      this.setData({
        vidx: (this.data.vidx + 1) % this.data.virtualUser.length
      })
    }, 5000)
  },

  onOriginPay: function(e) {
    let platform = wx.getSystemInfoSync().platform
    if (platform == 'ios'||platform=='devtools') {
      this.setData({
        show_sign_dialog: true
      })
    } else {
      let inviter = this.data.inviter != undefined ? this.data.inviter : 'no'
      wx.request({
        url: app.globalData.HOST + '/various/liveCoursePay.do',
        method: 'POST',
        header: {
          'token': wx.getStorageSync('token'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: inviter
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            let data = res.data.data
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: (r) => {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 600
                })
                wx.redirectTo({
                  url: 'CET_sign_success?types=origin&studentId=' + data.studentId,
                })
              },
              fail: () => {
                this.setData({
                  isShowDialog: true,
                  pay_type: 'origin'
                })
              }
            })
          }
        },
        fail: (res) => {
          console.log("request fail")
        }
      })
    }

  },

  onAssistPay: function(e) {
    let platform = wx.getSystemInfoSync().platform
    if (platform == 'ios'||platform=='devtools') {
      this.setData({
        show_sign_dialog: true
      })
    } else {
      let inviter = this.data.inviter != undefined ? this.data.inviter : 'no'
      wx.request({
        url: app.globalData.HOST + '/various/liveCoursePayHelp.do',
        method: 'POST',
        header: {
          'token': wx.getStorageSync('token'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: inviter
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            let data = res.data.data
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: (r) => {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 600
                })
                wx.redirectTo({
                  url: 'CET_sign_success?types=assist&studentId=' + data.studentId,
                })
              },
              fail: () => {
                this.setData({
                  isShowDialog: true,
                  pay_type: 'assist'
                })
              }
            })
          }
        },
        fail: (res) => {
          console.log("request fail")
        }
      })
    }
  },

  onRepay: function(e) {
    this.setData({
      isShowDialog: false
    })
    if (this.data.pay_type == 'assist') {
      this.onAssistPay()
    } else {
      this.onOriginPay()
    }
  },

  onTeacherTap: function(e) {
    // this.setData({
    //   isShowDialog: false
    // })
    wx.navigateTo({
      url: 'CET_teacher',
    })
  },

  onCloseDialog: function(e) {
    this.setData({
      isShowDialog: false
    })
  },

  onHomeTap: function(e) {
    if (this.data.isHidden == true) {
      let anim = wx.createAnimation({
        timingFunction: 'ease-out'
      })
      anim.translateX(100).step({
        duration: 300
      })
      anim.translateX(75).translateX(90).translateX(75).step({
        duration: 500
      })
      this.setData({
        isHidden: false,
        translateAnimation: anim.export()
      })
    } else {
      wx.reLaunch({
        url: '../../../tabBar/home/home',
      })
    }
  },

  onLeadBtnTap(){
    if (this.data.platform == 'ios') {
      this.setData({
        show_sign_dialog: true
      })
    } 
  },

  stopPageScroll: function(e) {

  },

  cancelDialog: function(e) {
    this.setData({
      show_sign_dialog: false
    })
  },

  onCourseTap: function(e) {
    wx.redirectTo({
      url: 'CET_sign_success?types=origin&studentId=2' + this.data.user_id,
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

  onPageScroll: function(event) {
    if (this.data.inviter != undefined) {
      if (this.data.isHidden == false) {
        // 在显示中
        let anim = wx.createAnimation({
          timingFunction: 'linear'
        })
        anim.translateX(0).step({
          duration: 500
        })
        this.setData({
          translateAnimation: anim.export(),
          isHidden: true
        })
      }
    }
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
      title: '过四六级，来这里就对了。',
      imageUrl: '',
      path: 'page/discover/pages/CET/CET_sign_up?inviter=' + this.data.user_id
    }
  }
})