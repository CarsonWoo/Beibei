// pages/WordChallenge/ChallengeDetail/ChallengeDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    billdetail_Data:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var token = app.globalData.token
    var HOST = app.globalData.HOST
    if (token) {
      console.log(token)
      this.loadData(token)
    } else {
      // console.log(token)
      this.getToken()
    }    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


    




    var user_challenge_detail = {

      user_challenge_detail_info:
        [
          {
            "challenge_period": "8",
            "challenge_time": "2018-8-23\t\t\t\t\t17:50:30",
            "challenge_reward":"30.88"
          },
          {
            "challenge_period": "7",
            "challenge_time": "2018-8-23\t\t\t\t\t17:50:30",
            "challenge_reward": "15.88"
          },
          {
            "challenge_period": "6",
            "challenge_time": "2018-8-23\t\t\t\t\t17:50:30",
            "challenge_reward": "10.88"
          },
          {
            "challenge_period": "5",
            "challenge_time": "2018-8-23\t\t\t\t\t17:50:30",
            "challenge_reward": "5.88"
          },
          {
            "challenge_period": "1",
            "challenge_time": "2018-8-23\t\t\t\t\t17:50:30",
            "challenge_reward": "0.88"
          }
        ],
    }
    this.setData(user_challenge_detail);
  },




  loadData:function(){

    //账单明细接口

    var token = app.globalData.token
    wx.request({
      url: app.globalData.HOST + "/various/show_user_bill.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        console.log(res.data.data[0])


        if (res.data.status == 200) {

          var billdetail_Data = res.data.data


          //添加+-号
          for (var j = 0; j < billdetail_Data.length; j++) {      
            var bill = billdetail_Data[j]
          if(bill.bill>=0){
            var new_bill = "+" + String(bill.bill)
          }
          billdetail_Data[j].bill = new_bill
          } 
          this.setData({
            billdetail_Data : billdetail_Data,
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
                console.log(res.data)
                var token = res.data.data
                console.log("token = " + token)
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



                if (res.data.status == 200) {

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

                  
                }
                else {
                  console.log("登录失败" + res.data.msg)
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

  }
})