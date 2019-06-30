// pages/WordChallenge/MyInvitation/MyInvitation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_reward : 0,

    is_have_invitition:true ,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var token = app.globalData.token

    if (token) {
      console.log(token)
      this.loadData(token)
    } else {
      // console.log(token)
      this.getToken()
    }
  },

  loadData: function (token) {



    //邀请链接参数
    wx.request({
      url: app.globalData.HOST + "/various/show_invite_link_inner.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {

          var share_msg = data.data.msg
          var share_user_id = data.data.user_id

          console.log(share_msg)
          console.log(share_user_id)

          this.setData({

            share_msg: share_msg,
            share_user_id: share_user_id

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

     wx.request({
       url: app.globalData.HOST + "/various/my_invite_word_challenge.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {

          //用户本人挑战打卡排行
          let my_invite_Data = data.data
          let total_reward = my_invite_Data.total_reward
          var invite_list = my_invite_Data.invite_list
          // var invite_list = [
          //   {
          //     "msg": "正在挑战中",
          //     "portrait": "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELicutBZ39TRUibhz9xxWhEVNbkXXVPlcUXb6pDUoCpZDA8YUI9uGXxVpd6wibHOnNRPJSOtfeZEM2Tw/132",
          //     "username": "段陈"
          //   },
          //   {
          //     "msg": "正在挑战中",
          //     "portrait": "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELicutBZ39TRUibhz9xxWhEVNbkXXVPlcUXb6pDUoCpZDA8YUI9uGXxVpd6wibHOnNRPJSOtfeZEM2Tw/132",
          //     "username": "段陈"
          //   }
          // ]

          if(invite_list == false){
            this.setData({
              is_have_invitition:false
            })
          }

          else{
            this.setData({
              is_have_invitition:true
            })
          }

          for (var i = 0, l = invite_list.length; i < l; i++) {

            console.log(invite_list[i].msg)

            var key = 'number'
            var value = ' '

            if (invite_list[i].msg.search("获得")!=-1){

              var str1 = invite_list[i].msg.substring(2, 0)
              var str2 = invite_list[i].msg.substring(invite_list[i].msg.length, 2)
              value = str2
            }
            invite_list[i][key] = value;
          }
          console.log(invite_list)
          this.setData({

            total_reward: total_reward,
            invite_list : invite_list

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

                if (res.data.status == 200) {
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

    console.log(this.data.share_msg)

    var msg = this.data.share_msg

    var img_url = '/images/image_share.png'

    if (msg.search("跟我一起") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/NoChallenge.jpg'
    }

    if (msg.search("已在背呗") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/Challenging.jpg'
    }

    if (msg.search("我已成功") != -1) {
      this.setData({
        mas: msg
      })
      img_url = 'https://file.ourbeibei.com/l_e/common/ChallengeSccessed.jpg'
    }

    console.log(img_url)

    if (res.form) {
      if (res.form == 'button') {
        console.log(res.target)
      }
    }
    return {
      title: this.data.msg,
      path: 'page/tabBar/home/home?InviterUserId=' + this.data.share_user_id,
      imageUrl: img_url,
    }

  }
})