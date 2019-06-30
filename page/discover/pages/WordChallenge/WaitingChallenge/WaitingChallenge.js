// pages/WordChallenge/WaitingChallenge/WaitingChallenge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    img_touchFish: '/images/bg_sign.png',
    wait_days:0,
    is_have_rank: true,
    msg:'我在背呗背单词参加挑战，快来跟我一起挑战吧',
    // background_image: '/images/Invitation_card.png',
    msg: '我在背呗背单词参加挑战，快来跟我一起挑战吧',
    raw_QRUrl: '',
    QRUrl: '',
    portrait_image: '',
    screenWidth: 0,
    screenHeight: 0,

  },

  ToRule: function () {

    we: wx.navigateTo({
      url: '../Rule/Rule',
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },

  ToMyInvite: function () {

    we: wx.navigateTo({
      url: '../MyInvitation/MyInvitation',
    })
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


//判断当前是第几期，如果是第一期排行榜放置占位图
    wx.request({
      url: app.globalData.HOST + "/various/show_word_challenge.do",
      method: 'POST',
      header: {
        'content-type': '/various/show_word_challenge.do',
        'token': token
      },
      success: (res) => {

        console.log(res.data)

        var data = res.data

        if (data.status == 200) {

          var word_challenge_Data = data.data

          var periods = word_challenge_Data.periods
          console.log("当前挑战期数为："+periods)
          if(periods == 1){
            this.setData({
              is_have_rank: false,
            })
          }
          //挑战开始时间
          var start_time = new Date(word_challenge_Data.st).valueOf();
          //获取当前时间
          var now_time = (new Date()).valueOf(); 
          var wait_days = (start_time - now_time)/1000/60/60/24
          // console.log(wait_days)
          wait_days = Math.ceil(wait_days)
          this.setData({
            wait_days:wait_days,
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
          // console.log(share_msg)
          // console.log(share_user_id)
          this.setData({
            share_msg:share_msg,
            share_user_id:share_user_id
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
      url: app.globalData.HOST + "/various/show_word_challenge.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)

        var data = res.data
        if (data.status == 200) {

          // 拿到挑战报名人数
          var word_challenge_Data = data.data

          var people = word_challenge_Data.people

          this.setData({

            people: people,

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
      url: app.globalData.HOST + "/various/show_invite_reward_rank.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)

        var data = res.data
        if (data.status == 200) {

          //用户本人邀请打卡排行
          let invite_rank_Data = data.data
          let username = invite_rank_Data.username
          let portrait = invite_rank_Data.portrait
          var user_rank = invite_rank_Data.user_rank
          let invite_reward = invite_rank_Data.invite_reward

          var total_rank = invite_rank_Data.total_rank



          // //重新排名
          // var new_rank = 1
          // if (total_rank != undefined) {
          //   for (var i = 1, l = total_rank.length; i < l; i++) {
          //     if (total_rank[i].invite_reward == total_rank[i - 1].invite_reward) {
          //       total_rank[i].user_rank = total_rank[i - 1].user_rank
          //     }
          //     if (total_rank[i].invite_reward < total_rank[i - 1].invite_reward) {
          //       new_rank = new_rank + 1
          //       total_rank[i].user_rank = new_rank
          //     }
          //   }
          // }
          // for (var i = 0, l = total_rank.length; i < l; i++) {
          //   if (total_rank[i].invite_reward == invite_rank_Data.invite_reward) {
          //     user_rank = total_rank[i].user_rank
          //   }
          // }

          this.setData({

            portrait: portrait,
            user_rank: user_rank,
            username: username,
            invite_reward: invite_reward,

            total_rank: total_rank

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

    wx.reLaunch({
      url: '../../../../tabBar/home/home',
    })

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
  onShareAppMessage: function (res) {

    console.log(this.data.share_msg) 

    var msg = this.data.share_msg

    var img_url = '/images/image_share.png'

    if (msg.search("跟我一起") != -1 ){

      this.setData({
        mas:msg
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
  },





  //---------------------------------生成图片保存本地相册-------------------------------



  shareTopyq: function () {
    wx.showLoading({
      title: '保存中...'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3500)
    this.loadShareData()
    // this.getQR()
    // this.drawImg()
    // this.saveImg()
  },

  loadShareData: function () {
    let that = this;
    var token = app.globalData.token

    // if (token) {
    //   console.log(token)
    //   that.loadData(token)
    // } else {
    //   // console.log(token)
    //   that.getToken()
    // }

    wx.getSystemInfo({
      success: res => {
        console.log(res);
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
        });
      }
    });

    //天数词数
    const monthStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    wx.request({
      url: app.globalData.HOST + "/home/home_page_info.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        // console.log(res.data)
        var data = res.data
        if (data.status == 200) {
          let insist_day = data.data.insist_days
          let word_number = data.data.learned_word
          this.setData({
            insist_day: insist_day,
            word_number: word_number,
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })

    //历史打卡信息
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
          if (total_days != undefined && total_days != 0) {
            this.setData({
              total_days: total_days
            })
          }
          console.log(clock_list)

          if (clock_list == undefined) {
            clock_list = []
          }
          this.setData({
            clock_list: clock_list
          })
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
        }
      },
      fail: (res) => {

      }
    })

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
          var share_username = data.data.username
          var share_portrait = data.data.portrait
          var share_user_id = data.data.user_id
          // var share_insist_day = data.data.insist_day
          // var share_word_number = data.data.word_number

          that.setData({
            share_username: share_username,
            share_portrait: share_portrait,
            share_user_id: share_user_id,
          })

          // if (share_insist_day != undefined && share_word_number != undefined) {
          //   that.setData({
          //     share_insist_day: share_insist_day,
          //     share_word_number: share_word_number
          //   })
          // }

          //下载背景图
          wx.downloadFile({
            url: "https://file.ourbeibei.com/l_e/share_pic/share_background_image.png",
            success: function (res1) {
              //缓存背景图
              that.setData({
                background_image: res1.tempFilePath,
              })
              console.log("缓存背景图成功:")
              console.log(that.data.background_image)

              // 下载头像
              wx.downloadFile({
                url: share_portrait,
                success: function (res1) {
                  //缓存头像图片
                  that.setData({
                    portrait_image: res1.tempFilePath,
                  })
                  console.log("缓存头像成功:")
                  console.log(that.data.portrait_image)
                  app.globalData.MyUserId = share_user_id
                  that.getQR()
                },
                fail: (res) => {
                  console.log(res)
                }
              })
            },
            fail: (res) => {
              console.log(res)
            }
          })

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
  },


  //生成带参数的小程序码
  getQR: function () {
    wx.request({
      url: app.globalData.HOST + "/admin/qr_code_m_program.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      data: {
        scene: app.globalData.MyUserId,
        path: "page/tabBar/home/home",
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status == 200) {
          var base64 = res.data.data
          let that = this
          that.setData({
            QRUrl: "data:image/PNG;base64," + base64,
            raw_QRUrl: base64,
          })
          console.log("成功拿到带参数的小程序码")
          that.drawImg()
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },



  drawImg: function () {
    let that = this;
    let share_username = that.data.share_username
    let share_insist_day = that.data.insist_day
    let share_word_number = that.data.word_number
    let qr_image = that.data.QRUrl
    let portrait_image = that.data.portrait_image
    let background_image = that.data.background_image
    let scWidth = that.data.screenWidth
    let scHeight = that.data.screenHeight
    let mypx = scWidth / 375
    let year = that.data.year
    let month = that.data.month
    let weekList = that.data.weekList

    // console.log("查看绘图所需数据")
    // console.log(share_username)
    // console.log(share_insist_day)
    // console.log(share_word_number)
    // console.log(portrait_image)
    // // console.log(qr_image)
    // console.log(background_image)
    // console.log(scWidth)
    // console.log(scHeight)
    // console.log(month)
    // console.log(year)
    // console.log(weekList)

    const ctx = wx.createCanvasContext('myCanvas');

    //绘制背景图
    ctx.drawImage(background_image, 0, 0, scWidth, scHeight)

    //绘制小程序码(必须存到本地，否则真机不显示)
    const fsm = wx.getFileSystemManager();
    const fileName = wx.env.USER_DATA_PATH + '/share_img.png'
    var showImgData = that.data.raw_QRUrl
    showImgData = showImgData.replace(/\ +/g, ""); //去掉空格
    showImgData = showImgData.replace(/[\r\n]/g, "");
    const buffer = wx.base64ToArrayBuffer(showImgData);
    fsm.writeFileSync(fileName, buffer, 'binary')
    ctx.drawImage(fileName, scWidth / 2 - 95 * mypx, scHeight / 2 + 248 * mypx, 75 * mypx, 75 * mypx)

    //写slogan
    let str_slogan1 = "背呗背单词"
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(16);
    ctx.font = 'normal bold 23px sans-serif';
    ctx.fillText(str_slogan1, scWidth / 2 - 9 * mypx, scHeight / 2 + 285 * mypx)
    let str_slogan2 = "数百万大学生都在用!"
    ctx.setFillStyle('#ffffff');
    ctx.font = 'normal bold 12px sans-serif';
    ctx.setFontSize(12);
    ctx.fillText(str_slogan2, scWidth / 2 - 6 * mypx, scHeight / 2 + 305 * mypx)

    //绘制圆角背景白色蒙板
    let x = 20 * mypx
    let y = 55 * mypx
    let r = 10 * mypx
    let w = 335 * mypx
    let h = 510 * mypx
    ctx.beginPath()
    ctx.setFillStyle('rgba(255, 255, 255, 0.55)')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
    ctx.save()

    //绘制圆形头像
    ctx.beginPath()
    ctx.strokeStyle = ('rgba(255, 255, 255, 0)');
    ctx.setFillStyle('rgba(255, 255, 255, 1)')
    ctx.arc(scWidth / 2, 102 * mypx, 30 * mypx, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.fill()
    ctx.clip()
    ctx.drawImage(portrait_image, scWidth / 2 - 30 * mypx, 72 * mypx, 60 * mypx, 60 * mypx)
    ctx.restore()
    // ctx.closePath()

    //绘制用户名
    ctx.setFillStyle('#1a1a1a');
    ctx.setFontSize(17);
    ctx.fillText(share_username, (scWidth - ctx.measureText(share_username).width) / 2, 160 * mypx)

    //绘制背单词词数天数信息
    ctx.setFillStyle('white')
    ctx.fillRect(scWidth / 2 - 335 / 2 * mypx, 183 * mypx, 335 * mypx, 115 * mypx)
    let str_day1 = "已在背呗学习"
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal normal 13px sans-serif';
    ctx.fillText(str_day1, (scWidth / 2 - ctx.measureText(str_day1).width) / 2 * mypx + 10 * mypx, 218 * mypx)
    let str_day2 = String(share_insist_day)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bold 35px sans-serif';
    ctx.fillText(str_day2, (scWidth / 2 - ctx.measureText(str_day2).width) / 2 * mypx + 10 * mypx, 258 * mypx)
    // ctx.fillText(str_day2, scWidth / 4 - (String(str_day2).length-1) * 11 * mypx, 258 * mypx)
    let str_day3 = "Days"
    ctx.setFillStyle('#00c19e');
    ctx.font = 'normal normal 13px sans-serif';
    ctx.fillText(str_day3, (scWidth / 2 - ctx.measureText(str_day3).width) / 2 * mypx + 10 * mypx, 280 * mypx)
    let str_word1 = "已掌握单词"
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal normal 13px sans-serif';
    ctx.fillText(str_word1, scWidth / 2 + (scWidth / 2 - ctx.measureText(str_word1).width) / 2 * mypx - 10 * mypx, 218 * mypx)
    let str_word2 = String(share_word_number)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bold 35px sans-serif';
    ctx.fillText(str_word2, scWidth / 2 + (scWidth / 2 - ctx.measureText(str_word2).width) / 2 * mypx - 10 * mypx, 258 * mypx)
    // ctx.fillText(str_word2, scWidth * 3 / 4 - (String(str_word2).length - 1) * 11 * mypx - 18 * mypx, 258 * mypx)
    let str_word3 = "Words"
    ctx.setFillStyle('#00c19e');
    ctx.font = 'normal normal 13px sans-serif';
    ctx.fillText(str_word3, scWidth / 2 + (scWidth / 2 - ctx.measureText(str_word3).width) / 2 * mypx - 10 * mypx, 280 * mypx)
    //绘制线条
    ctx.beginPath()
    ctx.moveTo(scWidth / 2, 215 * mypx)
    ctx.lineTo(scWidth / 2, 275 * mypx)
    ctx.closePath()
    ctx.setStrokeStyle('#e5e5e5')
    ctx.stroke()

    //绘制日历
    let str_year = year
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bold 21px sans-serif';
    ctx.fillText(str_year, 150 * mypx, 340 * mypx)
    let str_month = month
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bold 21px sans-serif';
    ctx.fillText(str_month, 63 * mypx, 340 * mypx)

    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('MON', 63 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('TUE', 101 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('WED', 139 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('THU', 177 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('FRI', 215 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('SAT', 253 * mypx, 365 * mypx)
    ctx.setFillStyle('#3c3c3c');
    ctx.font = 'normal bolder 10px sans-serif';
    ctx.fillText('SUN', 291 * mypx, 365 * mypx)

    for (var i = 0; i < weekList.length; i++) {
      var day_x = 68 * mypx
      var day_y = 390 * mypx + i * 32 * mypx
      if (weekList.length == 5) {
        var day_y = 398 * mypx + i * 35 * mypx
      }
      for (var j = 0; j < weekList[i].length; j++) {
        if (weekList[i][j] != "undefined" && weekList[i][j] != null && weekList[i][j] != "") {

          if (weekList[i][j] == '*') {
            var index = j + 1
            var data_image = '/images/ic_sign_' + index + '.png'
            ctx.drawImage(data_image, day_x - 8 * mypx, day_y - 18 * mypx, 28 * mypx, 28 * mypx)
          }
          else {
            ctx.setFillStyle('#3c3c3c');
            ctx.font = 'normal bolder 12px sans-serif';
            ctx.fillText(weekList[i][j], day_x, day_y)
          }
        }
        day_x = day_x + 38 * mypx
      }
    }

    ctx.draw()
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: scWidth,
        height: scHeight,
        destWidth: scWidth * 3,
        destHeight: scHeight * 3,
        canvasId: 'myCanvas',
        success: function (res1) {
          console.log('朋友圈分享图生成成功:' + res1.tempFilePath);
          that.saveImg(res1.tempFilePath)
        }
      });
    }, 800);
  },


  // 保存图片
  saveImg: function (image_path) {
    //图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: image_path,
      success: function (data) {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
              })
            }
          })
        }
      },
    })
  },


})