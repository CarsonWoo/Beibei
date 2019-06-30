// pages/home/sign/sign.js
const app = getApp()
const monthStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
Page({

  /**
   * 页面的初始数据
   */
  data: {

    is_sign: false,
    total_days:0,
    disabled: true,
    raw_QRUrl: '',
    QRUrl: '',
    portrait_image: '',
    screenWidth: 0,
    screenHeight: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showShareMenu({
      withShareTicket: true
    })

    // this.getCalendar(clock_list)

    // console.log(weekList)

    this.loadData(wx.getStorageSync('token'))
    
    // this.getToken()
  },

  getCalendar(clock_list) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    //获取当前月份总天数
    var days = new Date(year, month + 1, 0).getDate();
    //获取当前月份第一日开始在周几
    var startDay = new Date(year, month, 1).getDay();
    // console.log(year)
    // console.log(month)
    // console.log(days)
    // console.log(startDay)

    //计算行数
    let rows = parseInt((days + startDay) / 7);
    // console.log(rows)
    if ((days + startDay) % 7 != 0) {
      //还有余
      rows = rows + 1
    }

    var weekList = []

    for (let i = 0, dayNum = 1; i < rows; i++) {
      var list = []
      if (i == 0) {
        for (let j = 1; j <= 7; j++) {
          if (j >= startDay) {
            if (clock_list.indexOf(dayNum) != -1) {
              //表示已打卡
              list[j - 1] = '*'
            } else {
              list[j - 1] = dayNum
            }
            dayNum = dayNum + 1
          } else {
            list[j - 1] = ''
          }
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNum <= days) {
            if (clock_list.indexOf(dayNum) != -1) {
              list[j] = '*'
            } else {
              list[j] = dayNum
            }
            dayNum = dayNum + 1
          } else {
            list[j] = ''
          }

        }
      }
      weekList.push(list)
    }

    this.setData({
      year: year,
      month: monthStr[month],
      weekList: weekList,
    })
  },

  loadData: function(token) {

    //获取当期挑战状态
    wx.request({
      url: app.globalData.HOST + "/home/home_page_info.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {
          let word_challenge_status = data.data.word_challenge_status
          let whether_clock_in = data.data.whether_clock_in
          let level = data.data.level
          let insist_day = data.data.insist_days + 1 
          let word_number = data.data.learned_word
          if (level == 2 || level == 3){
              this.setData({
                is_sign: true,
              })
          }
          this.setData({
            word_challenge_status: word_challenge_status,
            whether_clock_in: whether_clock_in,
            insist_day: insist_day,
            word_number: word_number,
            disabled:false,
          })

          if (whether_clock_in == 1) {
            wx.reLaunch({
              url: '../../../tabBar/home/home',
            })
          }

          if(word_challenge_status == 2 ){
            //邀请链接参数
            var token = app.globalData.token
            wx.request({
              url: app.globalData.HOST + "/various/show_invite_link_inner.do",
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
              },
              success: (res) => {
                var that = this;
                console.log(res.data)
                var data = res.data
                if (data.status == 200) {
                  var challenge_insist_day = data.data.insist_day
                  if (challenge_insist_day != undefined) {
                    that.setData({
                      challenge_insist_day: challenge_insist_day,
                    })
                  }
                } else {
                  if (data.status == 400 && data.msg == '身份认证错误！') {
                    that.getToken()
                  }
                }
              },
              fail: (res) => {
                console.log(res)
              }
            }) 
          }
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })


    wx.request({
      url: app.globalData.HOST + "/home/clock_history.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 400 && data.msg == '身份认证错误！') {
          this.getToken()
        } else if (data.status == 200) {

          let clock_list = data.data[0]

          var total_days = 0

          for (var key in data.data) {
            total_days = total_days + data.data[key].length
            }

          if(total_days!= undefined &&total_days!=0){
            this.setData({
              total_days: total_days
            })
          }
         
          console.log(clock_list)

          if(clock_list == undefined){
            clock_list = []
          }
          this.setData({
            clock_list: clock_list
          })
          this.getCalendar(clock_list)
        }
      },
      fail: (res) => {

      }
    })
  },

  getToken: function() {
    wx.login({
      success: (res) => {
        var code = res.code
        console.log(res)
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

                if(res.data.status == 200){
                  console.log(res.data)
                  var token = res.data.data
                  // console.log("token = " + token)
                  // this.globalData.token = token
                  // wx.setStorage({
                  //   key: 'token',
                  //   data: token,
                  // })
                  // app.globalData.token = token
                  this.loadData(token)
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
                // wx.setStorage({
                //   key: 'token',
                //   data: token,
                // })
                // app.globalData.token = token
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

  // onSignTap: function(event) {
  //   console.log(event.detail.formId)
  //   let form_id = event.detail.formId
  //   var token = app.globalData.token
  //   var HOST = app.globalData.HOST
  //   wx.request({
  //     url: HOST + '/various/collect_form_id.do',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'token': token
  //     },
  //     data: {
  //       form_id: form_id
  //     },
  //     success: (res) => {
  //       if (res.data.status == 200) {
  //         console.log("success")
  //       } else {
  //         console.log(res)
  //       }
  //     },
  //     fail: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },

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
    // if (this.data.requestToSign) {
    //   var pages = getCurrentPages()
    //   let beforePage = pages[0]
    //   beforePage.loadData(app.globalData.token)
    //   beforePage.doSignWork()
    // }
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
  onShareAppMessage: function(res) {

    if (this.data.insist_day != undefined && this.data.word_number != undefined) {
    
    // var share_imgs = app.globalData.share_imgs
    // var share_texts = app.globalData.share_texts
    // var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    // var share_img = share_imgs[choose_number]
    // var share_text = share_texts[choose_number]


    //打卡分享图 
    var num_share_imgs = 30
    var share_imgs = new Array()
    for(var i=0;i<num_share_imgs;i++){
      var share_img = "https://file.ourbeibei.com/l_e/share_pic/sign_share_img" + String(i+1) + ".png"
      share_imgs[i] = share_img
    }

    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]

    let share_insist_day = this.data.insist_day
    let share_word_number = this.data.word_number
    var share_text = '我在背呗已经学习了' + String(share_insist_day) + '天，掌握' + String(share_word_number) + '个单词'

    if (this.data.is_sign == false) {
      console.log("今日未打卡，正在打卡中...")
      this.doSignWork()
    }

    return {

      title: share_text,
      path: 'page/tabBar/home/home',
      imageUrl: share_img,


      // success: (res) => {
      //   console.log('--- 转发成功回调 ---', res);
      //   console.log('--- shareTickets ---', res.shareTickets);
      //   if (this.data.is_sign == false) {
      //     this.doSignWork()
      //   }
      // },
      // fail: (res) => {
      //   if (this.data.is_sign == false) {
      //     wx.showModal({
      //       title: '提示',
      //       content: '分享失败了噢...成功分享赢奖品~',
      //     })
      //   }
      // }

      // success: (res) => {
      //   //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
      //   //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
      //   //获取用户设备信息
      //   wx.getSystemInfo({
      //     success: (d) => {
      //       console.log(d)
      //       //判断是Android还是IOS
      //       if (d.platform == 'android') {
      //         wx.getShareInfo({
      //           shareTicket: res.shareTickets,
      //           success: (info) => {
      //             //记录打卡
      //             // this.doSignWork()
      //             this.setData({
      //               requestToSign: true
      //             })
      //             wx.navigateBack({

      //             })
      //           },
      //           fail: (info) => {
      //             wx.showModal({
      //               title: '提示',
      //               content: '分享到好友无效噢',
      //               showCancel: false
      //             })
      //           }
      //         })
      //       }
      //       if (d.platform == 'ios') {
      //         if (res.shareTickets != undefined) {
      //           console.log("分享到群")
      //           wx.getShareInfo({
      //             shareTicket: res.shareTickets,
      //             success: (info) => {
      //               //打卡
      //               // this.doSignWork()
      //               this.setData({
      //                 requestToSign: true
      //               })
      //               wx.navigateBack({

      //               })
      //             }
      //           })
      //         } else {
      //           //分享到个人
      //           wx.showModal({
      //             title: '提示',
      //             content: '分享到好友无效噢',
      //             showCancel: false
      //           })
      //         }
      //       }
      //     },
      //   })
      // },
      // fail: (res) => {
      //   console.log(res)
      // }
    }
    }
  },

  onFeedScroll: function() {
    wx.reLaunch({
      url: '../../../tabBar/home/home?action=onFeedScroll' + '&isHide=' + 100,
    })
  },


  onPostChance: function (event) {
    // console.log(event.detail.formId)
    let form_id = event.detail.formId
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/collect_form_id.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        form_id: form_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log("success")
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  doSignWork: function() {
    console.log("开始打卡")
    var token = app.globalData.token
    var HOST = app.globalData.HOST
      wx.request({
        url: HOST + '/home/clock_in.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log("打卡成功")
            setTimeout(function () {
              this.change_is_sign
            }, 350)
            this.loadData(token)
            var beforePage = getCurrentPages()[0]
            beforePage.loadData(app.globalData.token)
          }
          else {
            console.log("打卡失败")
            console.log(res.data.msg)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2400,
            })
          }

        },
        fail: (res) => {
          console.log(res)
        }
      })
  },


  change_is_sign:function(){
    this.setData({
      is_sign: true
    })
  }
})