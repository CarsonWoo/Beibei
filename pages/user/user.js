// pages/user/user.js
var lists = []
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // user_portrait: app.globalData.userInfo.avatarUrl,
    isShowDialog: false,
    longpress: false,
    have_plan: [],
  },

  onAddPlanTap: function () {
    // console.log("onAddPlanTap");
    wx.navigateTo({
      url: 'plan/plan',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
    if (app.globalData.userInfo) {
      this.setData({
        user_portrait: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
      })
    }
  },

  loadData: function(token) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    wx.request({
      url: HOST + "/user/my_info.do",
      method: 'POST',
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          if (this.data.user_portrait) {
            this.setData({
              insist_day: data.insist_day,
              learned_word: data.learned_word,
              remaining_words: data.remaining_words,
            })
          } else {
            this.setData({
              insist_day: data.insist_day,
              learned_word: data.learned_word,
              remaining_words: data.remaining_words,
              user_portrait: data.portrait,
              nickName: data.username
            })
          }
        } else {
          if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
            this.getToken()
          }
        }
        
      },
      fail: (res) => {
        console.log("fail")
        console.log(res)
      }
    })

    wx.request({
      url: HOST + "/user/get_my_plan.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          var planData = res.data.data
          this.setData({
            have_plan: planData.have_plan,
            selectedPlan: planData.selected_plan,
          })
        } else {
          if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
            this.getToken()
          }
        }
      },
      fail: (res) => {
        console.log("plan failed")
        console.log(res)
      }
    })
  },

  onSettingTap: function (event) {
    console.log('onsetting')
    wx.navigateTo({
      url: 'setting/setting',
    })
  },

  onEditPlan: function (event) {
    // console.log("onLongPress")
    console.log(event)
    let plan = event.currentTarget.dataset.plan
    let selectedPlan = this.data.selectedPlan
    var alert_type = 0
    var learned_word = event.currentTarget.dataset.learned_word
    if (plan == selectedPlan) {
      //假设选中的计划为正在学习中的计划 提示用户是否重置
      alert_type = 1
    } else {
      //否则提示用户是否删除
      alert_type = 0
    }
    this.setData({
      alert_type: alert_type,
      isShowDialog: true,
      learned_word: learned_word,
      longpress: true,
      tmpSelected: event.currentTarget.id
    })
  },

  onCancelDialog: function (event) {
    this.setData({
      isShowDialog: false,
      longpress: false,
    })
  },

  onConfirmEditDialog: function (event) {
    // var id = event.currentTarget.id
    var alert_type = this.data.alert_type
    var idx = event.currentTarget.dataset.plan
    var plan = this.data.have_plan[idx].plan
    console.log(plan)
    if (alert_type == 1) {
      //执行重置
    } else {
      //执行删除
      var HOST = app.globalData.HOST
      var token = app.globalData.token
      wx.request({
        url: HOST + '/user/delete_plan.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data: {
          plan: plan
        },
        success: (res) => {
          if (res.data.status == 200) {
            let plans = this.data.have_plan
            plans.splice(idx, 1)
            this.setData({
              have_plan: plans,
              isShowDialog: false,
              longpress: false,
            })
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
    this.setData({
      isShowDialog: false
    })
  },

  onChangePlan: function (event) {
    let plan = event.currentTarget.dataset.plan
    let selectedPlan = this.data.selectedPlan
    var alert_type = 0
    if (plan == selectedPlan) {
      alert_type = 1
    }
    this.setData({
      tmpSelected: event.currentTarget.id,
      alert_type: alert_type,
      isShowDialog: true,
    })
  },

  onConfirmChange: function(event) {
    // console.log(event)
    var idx = event.currentTarget.dataset.plan
    var plan = this.data.have_plan[idx].plan
    var alert_type = this.data.alert_type
    console.log(plan)
    this.setData({
      isShowDialog: false,
      longpress: false,
    })
    if (alert_type == 1) {
      
    } else {
      //执行更改计划
      var HOST = app.globalData.HOST
      var token = app.globalData.token
      wx.request({
        url: HOST + '/user/decide_selected_plan.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data: {
          plan: plan
        },
        success: (res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '请求中',
              icon: 'loading',
              duration: 800
            })
            this.loadData()
          }
        },
        fail: (res) => {

        }
      })
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
    this.loadData()
    setTimeout(this.stopRefresh, 500)
  },

  stopRefresh: function() {
    wx.stopPullDownRefresh()
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

  },
  getToken: function () {

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
  },
})