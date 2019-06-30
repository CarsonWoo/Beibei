// page/tabBar/home/home.js
var WXBizDataCrypt = require('../../../utils/cryptojs/RdWXBizDataCrypt.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // flag: 1,
    fish_gif: 'https://file.ourbeibei.com/l_e/static/images/home_fish.gif',
    type: 0,
    storage: false,
    isShowDialog: false,
    alert_type: 0,
    swiperIndex: 0,
    tmps: [0, 1, 2],
    hold_on: false,
    //判断是否能用获取用户信息接口
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    //1.1

    //是否展示弹窗
    isShowSignUpView: false,
    isShowMedallionView: false,
    isShowChallengeRedPackView: false,
    isOpenChallengeRedPackView: false,
    isShowInviteRedPackView: false,
    isOpenInviteRedPackView: false,
    isShowSupportSuccess: false,
    isShowMask: false,

    //是否隐藏弹窗
    //（1.未报名情况下，从打卡页跳转到feeds）
    isHideSignUpView1: false,
    // (2.有红包时要隐藏挑战邀请框)
    isHideSignUpView2: false,

    //消息模板返回的参数
    medallion_show: false,
    medallion_success: false,
    challenge_success_red_packet: false,
    challenge_invite_red_packet: false,

    //上滑到底部加载更多
    feeds_page: 0,

    //朋友圈分享保存图片
    raw_QRUrl: '',
    QRUrl: '',
    portrait_image: '',
    screenWidth: 0,
    screenHeight: 0,
    // background_image: '/images/Invitation_card.png',

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var token = app.globalData.token
    var HOST = app.globalData.HOST
    app.globalData.onload_options = options
    wx.showShareMenu({
      withShareTicket: true
    })
    // wx.showToast({
    //   title: '加载中..',
    //   icon: 'loading',
    //   duration: 2000
    // })
    wx.showLoading({
      title: '加载中...',
    })
    if (token) {
      this.loadData(token)
    } else {
      this.getToken()
    }
    if (options.hold_on == 200) {
      this.setData({
        hold_on: true,
      })
    }

    let action = options.action
    if (action != undefined && action != null) {
      this.setData({
        action: action
      })
    }

    //----------------------------------------1.1-top--------------------------------
    //-------------------------------------------------------------------------------

    //带参分享的各种参数（邀请人id，免死金牌求助者id，免死金牌的flag，单词挑战事件id，是否有挑战红包，是否有鼓励红包，是否有免死金牌，免死金牌是否领取成功） 
    console.log("分享、邀请、模板消息参数:" + options)
    //别人的免死金牌邀请参数
    var medallion_flag = options.flag;
    var use_medallion_id = options.use_medallion_id;
    var word_challenge_contestants_id = options.word_challenge_contestants_id;
    //本人有无免死金牌
    var method = options.method
    if (method == 'medallion_show') {
      this.setData({
        medallion_show: true,
      })
      if (this.data.isShowMedallionView == true) {
        wx.hideTabBar({})
        this.setData({
          isShowMask: true
        })
      }
    }

    //本人免死金牌是否领取成功
    if (method == 'medallion_success') {
      console.log("免死金牌领取成功")
      var medallion_success = true
      this.setData({
        medallion_success: true
      })

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
            let word_challenge_status = data.data.word_challenge_status
            this.setData({
              word_challenge_status: word_challenge_status
            })
            if (this.data.word_challenge_status == 2) {

              wx.navigateTo({
                url: '../../discover/pages/WordChallenge/PunchRank/PunchRank?medallion_success=' + '1',
              })

              // ////应对ios支付举报
              // wx.getSystemInfo({
              //   success: function(res) {
              //     that.setData({
              //       systemInfo: res,
              //     })
              //     if (res.platform == "ios") {
              //       wx.navigateTo({
              //         url: '../home/home',
              //       })
              //     } else if (res.platform == "android") {
              //       wx.navigateTo({
              //         url: '../../discover/pages/WordChallenge/PunchRank/PunchRank?medallion_success=' + '1',
              //       })
              //     }
              //   }
              // })

            }
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
    //本人的挑战红包状态
    if (method == 'challenge_success_red_packet') {
      this.setData({
        challenge_success_red_packet: true
      })
      console.log("有挑战大红包")
      if (this.data.isShowChallengeRedPackView == true) {
        wx.hideTabBar({})
        this.setData({
          isHideSignUpView2: true,
          isShowMask: true
        })
      }
    }
    //本人的邀请红包状态
    if (method == 'challenge_invite_red_packet') {
      this.setData({
        challenge_invite_red_packet: true
      })
      console.log("有鼓励小红包 ")

      if (this.data.isShowInviteRedPackView == true) {
        wx.hideTabBar({})
        this.setData({
          isHideSignUpView2: true,
          isShowMask: true
        })
      }
    }


    // //应对ios支付举报
    // if (use_medallion_id != undefined && medallion_flag != undefined && word_challenge_contestants_id != undefined) {
    //   wx.getSystemInfo({
    //     success: function (res) {
    //       that.setData({
    //         systemInfo: res,
    //       })
    //       if (res.platform == "android") {
    //         //免死金牌助力
    //         wx.request({
    //           url: HOST + '/various/medallion_help.do',
    //           method: 'POST',
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded',
    //             token: token,
    //           },
    //           data: {
    //             user_id: use_medallion_id,
    //             flag: medallion_flag,
    //             word_challenge_contestants_id: word_challenge_contestants_id,
    //           },
    //           success: (res) => {
    //             if (res.data.status == 200) {
    //               this.setData({
    //                 isShowSupportSuccess: true,
    //                 isShowMask: true
    //               })
    //               console.log("助力成功")
    //             }
    //           },
    //           fail: (res) => {
    //             console.log(res)
    //           }
    //         })
    //       }
    //     }
    //   })
    // }


    // 原先的方法
    if (use_medallion_id != undefined && medallion_flag != undefined && word_challenge_contestants_id != undefined) {
      //免死金牌助力
      wx.request({
        url: HOST + '/various/medallion_help.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          token: token,
        },
        data: {
          user_id: use_medallion_id,
          flag: medallion_flag,
          word_challenge_contestants_id: word_challenge_contestants_id,
        },
        success: (res) => {
          if (res.data.status == 200) {
            this.setData({
              isShowSupportSuccess: true,
              isShowMask: true
            })
            console.log("助力成功")
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })

    }

    //从打卡页跳到首页隐藏弹窗
    if (options.isHide == 100) {
      this.setData({
        isHideSignUpView1: true
      })
    }
    //------------------------------------------------------------------------------------
    //----------------------------------------1.1-btm-------------------------------------

  },

  onDrawProgress: function() {
    var ctx = wx.createCanvasContext('progress-canvas')
    ctx.setStrokeStyle("#edeff3")
    // ctx.setStrokeStyle("black")
    ctx.setLineWidth(1.5)
    ctx.setLineCap("round")
    ctx.beginPath()

    ctx.moveTo(39, 194)

    ctx.arc(120, 120, 110, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.moveTo(54, 187)

    ctx.arc(120, 120, 95, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.moveTo(54, 187)

    ctx.quadraticCurveTo(55, 200, 40, 197)

    ctx.moveTo(186, 187)

    ctx.quadraticCurveTo(185, 200, 200, 197)

    ctx.stroke()

    ctx.setLineWidth(1)
    ctx.setStrokeStyle("#ff859d")
    ctx.beginPath()
    // ctx.moveTo(46.5, 190.5)

    ctx.arc(120, 120, 102.5, 0.75 * Math.PI, 2.25 * Math.PI, false)

    ctx.stroke()

    ctx.setLineWidth(6)

    ctx.setStrokeStyle("#ff859d")

    ctx.beginPath()

    // ctx.moveTo(44.5, 188.5)

    var progress = this.data.learned_word / this.data.plan_number

    // console.log(progress)

    ctx.arc(120, 120, 102.5, 0.75 * Math.PI, (0.75 + 1.5 * progress) * Math.PI, false)

    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(90, 70)

    //加粗
    ctx.font = 'normal bold 18px sans-serif';
    ctx.setFontSize(18)
    ctx.setFillStyle("black")
    ctx.fillText("已背单词", 85, 70)

    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(50, 150)

    var length = this.data.learned_word.toString().length
    // console.log(length)

    ctx.setFontSize(60)
    ctx.setFillStyle("#ff859d")
    //还需要对font-size进行转换
    ctx.fillText(this.data.learned_word.toString(), 120 - length / 2 * 60 * 0.6, 150)

    ctx.fill()

    ctx.draw()
  },

  onPrizeTap: function(event) {
    wx.navigateTo({
      url: '../../home/pages/prize/prize?level=' + this.data.level + '&flag=' + this.data.flag,
    })
  },

  onPlanTap: function(event) {
    wx.navigateTo({
      url: '../../user/pages/plan/plan',
    })
  },

  onStartTap: function(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../home/pages/word/word?level=' + this.data.level,
    })
  },

  onJoinTap: function() {
    wx.navigateTo({
      url: '../../home/pages/word/word',
    })
  },

  onShareTap: function() {
    console.log("onShare")
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    // this.onShareAppMessage()
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
    wx.showTabBar({})
    // this.loadData()
    // this.onDrawProgress()
    this.setData({
      storage: wx.getStorageSync('currentPointer')
    })
  },

  onFeedsClick: function(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../home/pages/feed/feed?id=' + id,
    })
  },

  loadData: function(token) {
    //添加访问发现页并记录is_reading状态
    wx.request({
      url: app.globalData.HOST + "/various/found_page.do",
      method: 'POST',
      header: {
        'token': token
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res)
          if (res.data.data.is_reading != null) {
            wx.setStorageSync('is_reading', res.data.data.is_reading)
          }
          if (res.data.data.is_reserved != undefined && res.data.data.is_reserved != null) {
            wx.setStorageSync('is_reserved', res.data.data.is_reserved)
          }
        } else {
          console.log(res);
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })

    //加载首页数据
    wx.request({
      url: app.globalData.HOST + "/home/home_page_info.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        var data = res.data
        if (data.status == 200) {
          // console.log("in")
          let homeData = data.data
          console.log("首页数据：")
          console.log(homeData)
          let flag = homeData.flag
          let learned_word = homeData.learned_word
          let insist_days = homeData.insist_days
          let rest_days = homeData.rest_days
          let level = homeData.level
          let plan_number = homeData.plan_number
          var feeds = homeData.feeds

          let word_challenge_status = homeData.word_challenge_status
          let use_medallion = homeData.use_medallion
          let whether_challenge_success = homeData.whether_challenge_success
          let challenge_red_packet = 0
          let whether_invite_challenge_success = homeData.whether_invite_challenge_success
          let invite_challenge_red_packet = 0
          let need_advertising = homeData.need_advertising
          let whether_clock_in = homeData.whether_clock_in

          if (whether_challenge_success == 1) {
            challenge_red_packet = homeData.challenge_red_packet
          }
          if (whether_invite_challenge_success == 1) {
            invite_challenge_red_packet = homeData.invite_challenge_red_packet
          }
          if (homeData.unionid == 'no') {
            console.log('no union id')
            wx.getSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  //已授权
                  this.getUnionId()

                } else {
                  console.log('scope disable')
                  this.fadeInDialog()
                }
              },
              fail: (res) => {
                console.log(res)
              }
            })

          } else {
            wx.getSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  //已授权
                  wx.getUserInfo({
                    withCredentials: true,
                    success: (res) => {
                      // console.log(res)
                      app.globalData.userInfo = res.userInfo
                    }
                  })

                } else {
                  console.log('scope disable')
                  // this.fadeInDialog()
                }
              },
              fail: (res) => {
                console.log(res)
              }
            })
          }

          this.setData({
            word_challenge_status: word_challenge_status,
            use_medallion: use_medallion,
            whether_challenge_success: whether_challenge_success,
            challenge_red_packet: homeData.challenge_red_packet,
            whether_invite_challenge_success: whether_invite_challenge_success,
            invite_challenge_red_packet: invite_challenge_red_packet,
          })

          const res = wx.getSystemInfoSync()
          if (res.SDKVersion < "2.6.0") {
            need_advertising = 0
          }
          if (need_advertising == 1) {
            app.globalData.isneedvideoAd = true
          }
          else if (need_advertising == 0) {
            app.globalData.isneedvideoAd = false
          }

          // //ios举报，暂时隐藏弹窗
          // //每一期挑战只弹一次弹窗
          // wx.request({
          //   url: app.globalData.HOST + "/various/show_word_challenge.do",
          //   method: 'POST',
          //   header: {
          //     'content-type': 'application/x-www-form-urlencoded',
          //     'token': app.globalData.token
          //   },
          //   success: (res) => {
          //     var data = res.data
          //     if (data.status == 200) {
          //       var new_periods = data.data.periods
          //       const periods = wx.getStorageSync('challenge_periods')
          //       if (periods && periods!= new_periods){
          //         wx.setStorageSync('challenge_periods', new_periods)
          //         wx.setStorageSync('isShowedSignUpview', false)
          //       }
          //       else{
          //         wx.setStorageSync('challenge_periods', new_periods)
          //         wx.setStorageSync('isShowedSignUpview', true)
          //       }
          //       const isShowedSignUpview = wx.getStorageSync('isShowedSignUpview')
          //     if(word_challenge_status == 0  && isShowedSignUpview==false){
          //       wx.hideTabBar({})
          //       wx.setStorageSync('isShowedSignUpview', true)
          //        this.setData({
          //        isShowSignUpView:true,
          //        isShowMask: true,
          //      })
          //      }
          //     }
          //     },
          //     fail: (res) => {
          //       console.log(res)
          //     }
          //   })

          if (whether_challenge_success == 1) {
            this.setData({
              isShowChallengeRedPackView: true,
            })
            //本人的挑战红包状态
            if (this.data.challenge_success_red_packet == true) {
              console.log("有挑战大红包")
              wx.hideTabBar({})
              this.setData({
                isHideSignUpView2: true,
                isShowMask: true
              })
            }
          }

          if (whether_invite_challenge_success == 1) {
            this.setData({
              isShowInviteRedPackView: true,
            })
            //本人的邀请红包状态
            if (this.data.challenge_invite_red_packet == true) {
              wx.hideTabBar({})
              this.setData({
                isHideSignUpView2: true,
                isShowMask: true
              })
            }
          }
          if (use_medallion == 1) {
            if (this.data.medallion_show == true) {
              wx.hideTabBar({})
              this.setData({
                isShowMask: true
              })
            }
            this.setData({
              isShowMedallionView: true,
            })
            //拿到免死金牌邀请参数
            var token = app.globalData.token
            var HOST = app.globalData.HOST
            var user_id
            var medallion_flag
            var word_challenge_contestants_id
            var user_list
            wx.request({
              url: HOST + '/various/get_medallion_info.do',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
              },
              success: (res) => {
                if (res.data.status == 200) {
                  // console.log(res.data)
                  user_id = res.data.data.user_id,
                    medallion_flag = res.data.data.flag,
                    word_challenge_contestants_id = res.data.data.word_challenge_contestants_id
                  user_list = res.data.data.user_list
                  this.setData({
                    user_id: res.data.data.user_id,
                    medallion_flag: res.data.data.flag,
                    word_challenge_contestants_id: res.data.data.word_challenge_contestants_id,
                    user_list: user_list,
                  })
                  // console.log(user_list)
                }
              },
              fail: (res) => {
                console.log(res)
              }
            })

          }

          for (let i = 0; i < feeds.length; i++) {
            if (feeds[i].likes < 10) {
              feeds[i].likes = 10 + parseInt(Math.random() * 5);
            } else if (feeds[i].likes < 20) {
              feeds[i].likes = 20 + parseInt(Math.random() * 10)
            } else if (feeds[i].likes < 50) {
              feeds[i].likes = 50 + parseInt(Math.random() * 20)
            } else if (feeds[i] < 100) {
              feeds[i].likes = 100 + parseInt(Math.random() * 30)
            }
          }

          var portraits = homeData.head_user_portrait
          let whether_template = parseInt(homeData.whether_template)
          wx.setStorage({
            key: 'whether_template',
            data: whether_template,
          })

          this.setData({
            flag: flag,
            learned_word: learned_word,
            insist_days: insist_days,
            rest_days: rest_days,
            level: level,
            plan_number: plan_number,
            feeds: feeds,
            user_default_portrait_1: portraits[0],
            user_default_portrait_2: portraits[3],
            user_default_portrait_3: portraits[5],
            user_default_portrait_4: portraits[1],
            user_default_portrait_5: portraits[2],
            user_default_portrait_6: portraits[4],

            whether_reminder: parseInt(homeData.whether_reminder),
          })

          if (level == 1 && whether_clock_in == 1) {
            this.setData({
              level:4
            })
          }

          if (flag == 1) {
            this.onDrawProgress()
            if (this.data.action != undefined && this.data.action != null) {
              console.log(this.data.action)
              switch (this.data.action) {
                case 'onStartTap':
                  if (parseInt(this.data.level) < 3) {
                    this.onStartTap()
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '今天已经双倍完成任务了噢~',
                      showCancel: false
                    })
                  }
                  break
                case 'onFeedScroll':
                  setTimeout(() => {
                    wx.pageScrollTo({
                      scrollTop: 390,
                      duration: 600
                    })
                  }, 500)
                  break
                case 'onBookTap':
                  this.onBookTap()
                  break
                case 'onMoneyTap':
                  this.onMoneyTap()
                  break
                case 'onCetTap':
                  this.onCetTap()
                  break
                default:
                  break
              }
              this.setData({
                action: ''
              })
            }
          } else {
            // 引导没有计划的用户去选择词汇背诵
            this.onPlanTap()
          }

        } else {
          if (data.status == 400 && data.msg == '身份认证错误！') {
            this.getToken()
          }
        }

      },
      fail: (res) => {
        console.log(res)
      },
      complete: () => {
        wx.hideLoading()
      }
    })

    //获取邀请链接参数
    wx.request({
      url: app.globalData.HOST + "/various/show_invite_link_inner.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log("用户本人的邀请参数:")
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {
          var share_msg = data.data.msg
          var share_user_id = data.data.user_id
          // console.log("用户邀请信息"+share_msg)
          console.log("用户本人ID" + share_user_id)
          this.setData({
            share_msg: share_msg,
            share_user_id: share_user_id
          })
          app.globalData.MyUserId = share_user_id
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

    //----------------------------------------1.1-top--------------------------------
    //-------------------------------------------------------------------------------
    //拿到带参分享的各种参数（邀请人id，免死金牌求助者id，免死金牌的flag，单词挑战事件id，是否有挑战红包，是否有鼓励红包，是否有免死金牌，免死金牌是否领取成功） 
    var options = app.globalData.onload_options
    console.log("分享、邀请、模板消息参数:" + options)
    //别人的挑战邀请参数(群聊))
    if (options.InviterUserId) {
      var InviterUserId = options.InviterUserId
      app.globalData.InviterUserId = InviterUserId
      console.log("拿到在群聊挑战分享者的UserId:" + InviterUserId)
      wx.request({
        url: app.globalData.HOST + "/home/home_page_info.do",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        success: (res) => {
          var data = res.data
          if (data.status == 200 && InviterUserId != undefined) {
            let word_challenge_status = data.data.word_challenge_status
            this.setData({
              word_challenge_status: word_challenge_status
            })
            if (this.data.word_challenge_status == 0) {
              wx.navigateTo({
                url: '../../discover/pages/WordChallenge/SignUp/SignUp',
              })
              // //应对ios支付举报
              // wx.getSystemInfo({
              //   success: function(res) {
              //     that.setData({
              //       systemInfo: res,
              //     })
              //     if (res.platform == "ios") {
              //       wx.navigateTo({
              //         url: '../home/home',
              //       })
              //     } else if (res.platform == "android") {
              //       wx.navigateTo({
              //         url: '../../discover/pages/WordChallenge/SignUp/SignUp',
              //       })
              //     }
              //   }
              // })

            }
            console.log("word_challenge_status:" + word_challenge_status)
          } else {
            console.log("fail_load_word_challenge_status:" + res.data)
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }

    //别人的挑战邀请参数（朋友圈）
    if (options.scene) {
      var PyqInviteUserId = decodeURIComponent(options.scene)
      app.globalData.PyqInviteUserId = PyqInviteUserId
      console.log("拿到在朋友圈挑战分享者的UserId:" + PyqInviteUserId)
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
            let word_challenge_status = data.data.word_challenge_status
            this.setData({
              word_challenge_status: word_challenge_status
            })
            if (this.data.word_challenge_status == 0) {

              wx.navigateTo({
                url: '../../discover/pages/WordChallenge/SignUp/SignUp',
              })

              // ////应对ios支付举报
              // wx.getSystemInfo({
              //   success: function(res) {
              //     that.setData({
              //       systemInfo: res,
              //     })
              //     if (res.platform == "ios") {
              //       wx.navigateTo({
              //         url: '../home/home',
              //       })
              //     } else if (res.platform == "android") {
              //       wx.navigateTo({
              //         url: '../../discover/pages/WordChallenge/SignUp/SignUp',
              //       })
              //     }
              //   }
              // })
            }
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
  },

  getToken: function() {

    wx.login({
      success: (res) => {
        var code = res.code
        console.log("code=" + res.code)
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

                if (res.data.status == 200) {
                  var token = res.data.data
                  console.log("login_success" + res.data.msg)
                  console.log("token = " + token)
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData(token)
                } else {
                  console.log("login_fail" + res.data)
                }
              },
              fail: (res) => {
                console.log("request fail")
              }
            })
            // this.globalData.token = token
          },
          fail: () => {
            console.log("code=" + res.code)
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
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData(token)
                } else {
                  console.log("login_fail" + res.data)
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

  onProgressTap: function(event) {
    wx.navigateTo({
      url: '../../home/pages/word_list/word_list',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

    wx.showTabBar({})

    this.setData({
      //是否展示弹窗
      isShowSignUpView: false,
      isShowMedallionView: false,
      isShowChallengeRedPackView: false,
      isOpenChallengeRedPackView: false,
      isShowInviteRedPackView: false,
      isOpenInviteRedPackView: false,
      isShowMask: false,
    })
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
    // console.log("onRefresh");
    // this.setData({
    //   action: ''
    // })
    this.setData({
      feeds_page: 0,
      animationIdx: '',
      favourAnimation: ''
    })
    this.loadData(app.globalData.token)
    setTimeout(this.stopPullDownRefresh, 500)
  },

  stopPullDownRefresh: function() {
    wx.stopPullDownRefresh()
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

    console.log(this.data.insist_days)
    console.log(this.data.learned_word)

    var use_medallion = this.data.use_medallion
    var user_id = this.data.user_id
    var medallion_flag = this.data.medallion_flag
    var word_challenge_contestants_id = this.data.word_challenge_contestants_id
    var img_url = '/images/image_share.png'

    // console.log('pages/home/home?use_medallion_id=' + user_id + '&flag=' + flag + '&word_challenge_contestants_id=' + word_challenge_contestants_id)

    if (this.data.level == 1) {
      this.doSignWork()
      // console.log(res)
      if (this.data.insist_days != undefined && this.data.learned_word != undefined) {

        var share_imgs = new Array(
          //打卡分享图  
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img1.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img2.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img3.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img4.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img5.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img6.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img7.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img8.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img9.jpg",
          "https://file.ourbeibei.com/l_e/share_pic/sign_share_img10.jpg",
        )
        var choose_number = parseInt(Math.random() * share_imgs.length, 10)
        var share_img = share_imgs[choose_number]

        let share_insist_day = this.data.insist_days
        let share_word_number = this.data.learned_word
        var share_text = '我在背呗已经学习了' + String(share_insist_day) + '天，掌握' + String(share_word_number) + '个单词'

        return {
          title: share_text,
          path: 'page/tabBar/home/home',
          imageUrl: share_img,

        }
        // return {
        //   title: '我正在背呗背单词赢奖品，快来跟我一起背~',
        //   path: '/pages/home/home',
        //   imageUrl: 'https://file.ourbeibei.com/l_e/common/brother.jpg',
        // }
      }
    }


    if (res != undefined) {
      // console.log(parseInt(Math.random() * 7, 10))

      if (res.from === 'button') {

        if (this.data.word_challenge_status == 0) {
          img_url = 'https://file.ourbeibei.com/l_e/common/NoChallenge.jpg'
        }

        if (this.data.word_challenge_status == 1) {
          img_url = 'https://file.ourbeibei.com/l_e/common/Challenging.jpg'
        }

        if (this.data.word_challenge_status == 2) {
          img_url = 'https://file.ourbeibei.com/l_e/common/Challenging.jpg'
        }

        console.log(res.target.id)
        //1.1
        // 免死金牌
        if (res.target.id == 101 && use_medallion == 1) {
          var share_texts = new Array(
            "自律的小可爱又开小差了！助力一下帮我完成挑战！！",
            "确定过眼神，你就是那个帮我助力的人！！！",
            "一江春水向东流，帮我助力泯恩仇",
            "我的单词挑战快失败了！快快助力帮我度过难关！！",
            "我在背呗参加单词挑战，就差你的助力了！！",
            "我离巨额奖金只差你的一个助力！",
          )
          var choose_number = parseInt(Math.random() * share_texts.length, 10)
          var share_text = String(share_texts[choose_number])

          return {
            title: share_text,
            path: 'page/tabBar/home/home?use_medallion_id=' + user_id + '&flag=' + medallion_flag + '&word_challenge_contestants_id=' + word_challenge_contestants_id,
            imageUrl: 'https://file.ourbeibei.com/l_e/common/Challenging.jpg',
          }
        }


        //  红包下面的wechat分享
        else if (res.target.id == 102) {
          return {
            title: '我在背呗背单词参加挑战，快来跟我一起挑战吧~',
            path: 'page/tabBar/home/home?InviterUserId=' + app.globalData.MyUserId,
            imageUrl: img_url,
          }
        }

      } else {

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

    }
  },



  //红包下面点击朋友圈分享



  //---------------------------------生成图片保存本地相册-------------------------------



  shareTopyq: function() {
    wx.showLoading({
      title: '保存中...'
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 3500)
    this.loadShareData()
    // this.getQR()
    // this.drawImg()
    // this.saveImg()
  },

  loadShareData: function() {
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
            success: function(res1) {
              //缓存背景图
              that.setData({
                background_image: res1.tempFilePath,
              })
              console.log("缓存背景图成功:")
              console.log(that.data.background_image)

              // 下载头像
              wx.downloadFile({
                url: share_portrait,
                success: function(res1) {
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
  getQR: function() {
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



  drawImg: function() {

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
    let share_data = that.data.calendar_list[11]
    let year = share_data.year
    let month = share_data.month
    let weekList = share_data.weekList


    // //查看绘图所需数据
    // console.log(share_username)
    // console.log(share_insist_day)
    // console.log(share_word_number)
    // console.log(portrait_image)
    // // console.log(qr_image)
    // console.log(background_image)
    // console.log(scWidth)
    // console.log(scHeight)
    // console.log(share_data)
    // console.log(share_data.year)
    // console.log(share_data.month)

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
          } else {
            ctx.setFillStyle('#3c3c3c');
            ctx.font = 'normal bolder 12px sans-serif';
            ctx.fillText(weekList[i][j], day_x, day_y)
          }
        }
        day_x = day_x + 38 * mypx
      }
    }

    ctx.draw()
    setTimeout(function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: scWidth,
        height: scHeight,
        destWidth: scWidth * 3,
        destHeight: scHeight * 3,
        canvasId: 'myCanvas',
        success: function(res1) {
          console.log('朋友圈分享图生成成功:' + res1.tempFilePath);
          that.saveImg(res1.tempFilePath)
        }
      });
    }, 800);
  },


  // 保存图片
  saveImg: function(image_path) {
    //图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: image_path,
      success: (data) => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: function(err) {
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


  doSignWork: function() {

    console.log('正在打卡...')
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
          console.log('打卡成功')
          this.setData({
            level: this.data.level + 1
          })

        } else {
          console.log(res)
          console.log('打卡失败')
          console.log(res.data)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2400,
          })
        }
      },
      fail: (res) => {
        console.log(res)
        console.log('打卡网络请求失败')
        console.log(res.data)
      }
    })
  },

  onCloseDialog: function(event) {
    this.setData({
      isShowDialog: false
    })

  },


  //----------------------------------------1.1-top-------------------------------------
  //------------------------------------------------------------------------------------


  //应对ios支付举报
  onMoneyTap: function(event) {
    if (this.data.word_challenge_status == 0) {
      wx.navigateTo({
        url: '../../discover/pages/WordChallenge/SignUp/SignUp',
      })
      // let that = this
      // wx.getSystemInfo({
      //   success: (res) => {
      //     that.setData({
      //       systemInfo: res,
      //     })
      //     if (res.platform == "ios") {
      //       wx.showToast({
      //         title: '该模块正在整改中~~',
      //         duration: 1500,
      //         mask: true,
      //         icon: 'none',
      //       })
      //       //关闭红包弹窗
      //       that.OnCloseView
      //     } else if (res.platform == "android") {
      // wx.navigateTo({
      //   url: '../../discover/pages/WordChallenge/SignUp/SignUp',
      // })
      // }
      // }
      // })
    } else if (this.data.word_challenge_status == 1) {
      wx.navigateTo({
        url: '../../discover/pages/WordChallenge/WaitingChallenge/WaitingChallenge',
      })
    } else if (this.data.word_challenge_status == 2) {
      wx.navigateTo({
        url: '../../discover/pages/WordChallenge/PunchRank/PunchRank',
      })
    }
  },

  //原先的方法
  // onMoneyTap: function (event) {
  //   //1.0
  //   // this.setData({
  //   //   isShowDialog: true,
  //   //   alert_type: 1
  //   // })
  //   // setTimeout(this.onCloseDialog, 1500)

  //   if (this.data.word_challenge_status == 0) {

  //     wx.navigateTo({
  //       url: '../discover/WordChallenge/SignUp/SignUp',
  //     })
  //   }
  //   else if (this.data.word_challenge_status == 1) {

  //     wx.navigateTo({
  //       url: '../discover/WordChallenge/WaitingChallenge/WaitingChallenge',
  //     })

  //   }
  //   else if (this.data.word_challenge_status == 2) {

  //     wx.navigateTo({

  //       url: '../discover/WordChallenge/PunchRank/PunchRank',
  //     })
  //   }
  // },



  stopPageScroll: function(e) {},

  OnSignUp: function() {
    wx.navigateTo({
      url: '../../discover/pages/WordChallenge/SignUp/SignUp',
    })
  },

  ToBillDetail: function() {

    wx.navigateTo({
      url: '../../user/pages/wallet/BillDetail/BillDetail',
    })

  },

  OpenChallengeRedpackView: function(event) {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/getChallengeRedPacket.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },

      success: (res) => {
        if (res.data.status == 200) {
          console.log("挑战金领取成功")
        } else {
          console.log("挑战金领取失败")
          console.log(res.data.msg)

        }
      },
      fail: (res) => {

        console.log(res)
      }
    })

    wx.hideTabBar({})
    this.setData({

      isShowMask: true,

      isShowChallengeRedPackView: false,

      isOpenChallengeRedPackView: true,

    })
  },


  OpenInviteRedpackView: function(event) {
    var token = app.globalData.token
    var HOST = app.globalData.HOST

    wx.request({
      url: HOST + '/various/getChallengeInviteRedPacket.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },

      success: (res) => {
        if (res.data.status == 200) {
          console.log("鼓励金领取成功")
        } else {
          console.log("鼓励金领取失败")
          console.log(res.data.msg)

        }
      },
      fail: (res) => {

        console.log(res)
      }
    })


    wx.hideTabBar({})
    this.setData({

      isShowMask: true,

      isShowInviteRedPackView: false,

      isOpenInviteRedPackView: true,

    })
  },


  OnCloseView: function(event) {

    wx.showTabBar({})

    this.setData({

      isShowSignUpView: false,

      isShowMedallionView: false,

      isShowChallengeRedPackView: false,

      isOpenChallengeRedPackView: false,

      isShowInviteRedPackView: false,

      isOpenInviteRedPackView: false,

      isShowSupportSuccess: false,

      isShowMask: false,

      medallion_show: false,

      medallion_success: false,

      challenge_success_red_packet: false,

      challenge_invite_red_packet: false,

    })
    this.loadData(app.globalData.token)
  },

  //查看日历
  look_calendar: function() {
    wx.navigateTo({
      url: '../../home/pages/sign/sign_history',
    })
  },



  //------------------------------------------------------------------------------------
  //----------------------------------------1.1-btm------------------------------------




  onEventTap: function(event) {
    this.setData({
      isShowDialog: true,
      alert_type: 2
    })
  },

  toWebView: function(event) {
    this.onCloseDialog()
    wx.navigateTo({
      url: '../../discover/pages/web/web',
    })
  },

  onFishTap: function(event) {
    this.setData({
      isShowDialog: true,
      alert_type: 3
    })
  },

  onSubmitAppoint: function(event) {
    this.onCloseDialog()
    //预约提醒
    let token = app.globalData.token
    let HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/appointment_to_remind.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        if (res.data.status == 200) {
          this.setData({
            whether_reminder: 1
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  onPostChance: function(event) {
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
          console.log("collect_form_id_success")
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  //1.2
  onSwiperChange: function(event) {
    // console.log(event)
    this.setData({
      swiperIndex: event.detail.current
    })
  },

  stopPageScroll() {},

  // 监听页面滑动，滑到底部自动更新feeds流
  onPageScroll: function(e) {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    // console.log(e.scrollTop)
    // console.log(this.data.feeds_page)
    if (parseInt(e.scrollTop / 680) > this.data.feeds_page) {
      this.setData({
        feeds_page: parseInt(e.scrollTop / 680)
      })
      // console.log(this.data.feeds_page)
      wx.request({
        url: app.globalData.HOST + "/home/more_feeds.do",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data: {
          page: this.data.feeds_page
        },
        success: (res) => {
          if (res.data.status == 200) {
            // console.log(res.data)
            var data = res.data.data
            console.log("加载更多feeds数据：")
            console.log(data)
            for (let i = 0; i < data.length; i++) {
              if (data[i].likes < 10) {
                data[i].likes = 10 + parseInt(Math.random() * 5)
              } else if (data[i].likes < 20) {
                data[i].likes = 20 + parseInt(Math.random() * 10)
              } else if (data[i].likes < 50) {
                data[i].likes = 50 + parseInt(Math.random() * 20)
              } else if (data[i] < 100) {
                data[i].likes = 100 + parseInt(Math.random() * 30)
              }
            }
            var new_feeds = this.data.feeds.concat(data)
            this.setData({
              feeds: new_feeds,
            })
          } else {
            console.log("加载更多feeds数据失败：")
            console.log(res.data.msg)
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
  },

  //1.2
  onBookTap: function(e) {

    var is_reading = wx.getStorageSync('is_reading')
    if (is_reading == 0) {
      if (wx.getStorageSync('is_reserved') == 'yes') {
        //有预约
        wx.navigateTo({
          url: '../../discover/pages/book/book_sign_up?is_reserved=true',
        })

      } else {
        wx.navigateTo({
          url: '../../discover/pages/book/book_sign_up',
        })
      }
    }
    /* else if (is_reading == 3) {
               wx.navigateTo({
                 url: '../../discover/pages/book/book_sign_assist',
               })
             } */
    else {
      wx.switchTab({
        url: '../discover/discover',
      })
    }
    // }
    // }
    // })
  },

  fadeInDialog: function(e) {
    this.setData({
      showScope: true,
    })

    wx.hideTabBar({

    })

    var anim = wx.createAnimation({
      duration: 0,
      timingFunction: 'step-start'
    })

    anim.scale(0.5, 0.5).step()
    this.setData({
      scopeAnimation: anim.export()
    })

    anim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })

    anim.scale(1, 1).step()
    this.setData({
      scopeAnimation: anim.export()
    })
  },

  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许
      this.getUnionId()

      var anim = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease'
      })
      anim.opacity(0.5).scale(0.5, 0.5).step()
      this.setData({
        scopeAnimation: anim.export()
      })
      setTimeout(() => {
        this.setData({
          showScope: false
        })
        wx.showTabBar({

        })
      }, 400)

    } else {
      //用户按了拒绝
    }
  },
  getUnionId: function() {
    console.log('scope enable')
    wx.login({
      success: (res) => {
        let code = res.code
        wx.request({
          url: app.globalData.HOST + '/user/wxReturnSessionKey.do',
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'code': code
          },
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data.data)
              let sessionKey = res.data.data
              var pc = new WXBizDataCrypt('wx915c7b2ebc140ee6', sessionKey)
              wx.getUserInfo({
                withCredentials: true,
                success: (res) => {
                  console.log(res)
                  let userInfo = res.userInfo
                  app.globalData.userInfo = userInfo
                  let union_id = pc.decryptData(res.encryptedData, res.iv).unionId
                  console.log('union_id = ' + union_id)
                  let portrait = res.userInfo.avatarUrl
                  let username = res.userInfo.nickName
                  this.uploadUserInfo(username, portrait, union_id)
                }
              })
            } else {
              console.log(res)
            }
          },
          fail: (res) => {
            console.log('fail')
          }
        })
      }
    })
  },

  uploadUserInfo: function(username, portrait, union_id) {
    let HOST = app.globalData.HOST
    let token = app.globalData.token
    console.log('uploading user info...')
    console.log('username = ' + username)
    console.log('portrait = ' + portrait)
    console.log('union_id = ' + union_id)
    wx.request({
      url: HOST + '/various/setUserUnionId.do',
      method: 'POST',
      header: {
        'token': token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'username': username,
        'portrait': portrait,
        'unionid': union_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log('上传userinfo成功')
        } else if (res.data.status == 400 && res.data.msg == '身份信息错误！') {
          this.getToken()
        } else {
          console.log('上传userinfo失败\n' + res)
          wx.showToast({
            title: '身份信息上传有误...',
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        console.log('访问upload userinfo失败')
        wx.showToast({
          title: '身份信息上传有误...请检查网络状态',
          icon: 'none'
        })
      }
    })
  },

  onFavourTap: function(e) {
    let id = e.currentTarget.dataset.id
    let likes = e.currentTarget.dataset.likes
    let idx = e.currentTarget.dataset.position

    var favourAnimation = wx.createAnimation({
      duration: 800
    })

    favourAnimation.rotate(10).step({
      duration: 160
    })
    favourAnimation.rotate(-10).step({
      duration: 160
    })
    favourAnimation.rotate(5).step({
      duration: 160
    })
    favourAnimation.rotate(-5).step({
      duration: 160
    })
    favourAnimation.rotate(0).step({
      duration: 160
    })

    wx.request({
      url: app.globalData.HOST + '/home/favour_feeds.do',
      method: 'POST',
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: (res) => {
        if (res.data.status == 200) {
          // console.log('点赞成功')
        }
      }

    })

    let feeds = this.data.feeds
    feeds[idx].likes = feeds[idx].is_favour == 0 ? likes + 1 : likes - 1
    feeds[idx].is_favour = feeds[idx].is_favour == 0 ? 1 : 0

    this.setData({
      favourAnimation: favourAnimation.export(),
      feeds: feeds,
      animationIdx: idx
    })


  },

  onCetTap: function(e) {
    wx.navigateTo({
      url: '../../discover/pages/CET/CET_sign_up',
    })
  },

  onGameTap: function(e) {
    this.setData({
      isShowDialog: true,
      alert_type: 1
    })
    setTimeout(() => {
      this.setData({
        isShowDialog: false,
        alert_type: ''
      })
    }, 1500)
  }
})