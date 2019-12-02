// pages/home/word.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wordType: 'TYPE_GRAPH',
    // selectPos:2,
    // correctAnswer:2,
    currentPointer: 0,
    realPointer: 0,
    wrongCount: 0,
    word_list_num: 0,
    posted_list_num: 0,
    pass_list: [],
    old_list: [],
    new_list: [],
    word_list: [],
    post_list: [],
    more_pic_list:[],//当单词数低于20个时候会多10张图片
    pic_list:[],//合并后的总数组

    requestClear: false,
    hasupload: false,
  },
  loadData: function() {
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading'
    // })
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    wx.request({
      url: HOST + '/home/recite_word_list.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        wx.hideLoading()
        let that = this
        if (res.data.status == 200) {
          console.log(res.data)
          var data = res.data.data
          var new_list = data.new_list
          var old_list = data.old_list
          if (data.morepics!=undefined){
            // console.log("have more pic")
            that.setData({
              more_pic_list:data.morepics
            })
          }
          // 添加word_type参数
          for (var i = 0; i < new_list.length; i++) {
            var word = {}
            word['word_type'] = 'new'
            Object.assign(new_list[i], word);
          }
          for (var i = 0; i < old_list.length; i++) {
            var word = {}
            word['word_type'] = 'old'
            Object.assign(old_list[i], word);
          }
          console.log(new_list)
          console.log(old_list)
          // 单词列表小数四的情况,目前还不清楚什么原因会导致这种情况
          // 已找到主要原因：当词库背完时会出现该情况
          if (new_list.length + old_list.length + this.data.post_list.length < 4 && new_list.length + old_list.length + this.data.post_list.length > 0) {
            console.log("单词列表小数四：")
            console.log(new_list)
            console.log(old_list)
            var post_new_list = []
            var word_level = 2
            for (let i in new_list) {
              console.log(new_list[i])
              new_list[i]["level"] = word_level
              post_new_list.push(new_list[i])
            }
            console.log("post_new_list:")
            console.log(post_new_list)
            var list = []
            post_new_list = post_new_list.concat(old_list)
            for (let i in post_new_list) {
              var str_meaning = post_new_list[i]['meaning']
              post_new_list[i]['meaning'] = str_meaning.replace(/[\r\n]/g, "");
              var s = '{"id":' + post_new_list[i]['id'] + ',"level":' + post_new_list[i]['level'] + ',"word":"' + post_new_list[i]['word'] + '","meaning":"' + post_new_list[i]['meaning'] + '"' + ',"word_type":"' + post_new_list[i]['word_type'] + '"}'
              list.push(s)
            }
            var listStr = list.join(',')
            listStr = '[' + listStr + ']'
            console.log("listStr:")
            console.log(listStr)
            wx.request({
              url: app.globalData.HOST + '/home/liquidation_word.do',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': app.globalData.token,
                'version': 'version1'
              },
              data: {
                word_list: listStr
              },
              success: (res) => {
                console.log(res.data)
                if (res.data.status == 200) {
                  console.log("单词数小于四，上传并返回首页")
                  wx.reLaunch({
                    url: '../../../tabBar/home/home',
                    success: function() {
                      that.setData({
                        hasupload: true
                      })
                    }
                  })
                } else {
                  that.setData({
                    hasupload: false
                  })
                  console.log("上传失败")
                }
              },
              fail: (res) => {
                console.log(res)
              }
            })
          } else if (new_list.length + old_list.length + this.data.post_list.length == 0) {
            console.log("单词数为零")
            wx.showToast({
              title: '您的计划已经完成，请更换计划',
              mask: true, //是否显示透明蒙层,防止触摸穿透，默认：false  
              icon: 'none',
              success: function() {
                setTimeout(function() {
                  wx.reLaunch({
                    url: '../../../tabBar/user/user',
                    success: function() {
                      that.setData({
                        hasupload: true
                      })
                    }
                  })
                }, 2500) //延迟时间
                console.log("计划已完成，返回我的页面更换计划")
                setTimeout(() => {
                  wx.hideToast();
                }, 2200)
              }
            })
          } else {
            for (let j = 0; j < old_list.length; j++) {
              old_list[j]['sentence'] = this.parseSentence(old_list[j].word, old_list[j].sentence)
              // console.log(old_list[j].sentence)
            }
            for (let i = 0; i < new_list.length; i++) {
              new_list[i]['level'] = 0
              new_list[i]['sentence'] = this.parseSentence(new_list[i].word, new_list[i].sentence)
            }
            var word_list = []
            word_list = word_list.concat(old_list)
            word_list = word_list.concat(new_list)
            var word_list_num = word_list.length
            this.setData({
              word_list_num: word_list_num,
              word_list: word_list,
              pass_list: [],
              new_list: new_list,
              old_list: old_list
            }, () => {
              this.initialize()
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '网络开了小差噢...',
            showCancel: false
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.hideLoading()
      },
      complete: () => {}
    })
  },

  parseSentence: function(word, sentence) {
    sentence = sentence.trim()
    if (!sentence.endsWith(".") && !sentence.endsWith("?") && !sentence.endsWith("!")) {
      sentence = sentence + "."
    }
    var split = sentence.split(word)
    // console.log(split)
    if (split.length == 1) {
      var start = word
      //除了单词在开头外 还可能使专有名词 或全部大写
      //先转成全部小写 然后去匹配
      if (split[0].toLowerCase().startsWith(start)) {
        start = start.substring(0, 1).toUpperCase() + start.substring(1)
        //还需要去除开头的单词
        var follow = split[0]
        follow = follow.substring(word.length)
        if (!follow.startsWith(" ")) {
          start = start + follow.split(" ")[0]
          follow = split[0].substring(start.length)
        }
        var mSentence = "<span style='color:#5ee2c9;font-size:1.3rem'>" + start + "</span>" + follow
        return mSentence
      } else {
        var sentenceLower = split[0].toLowerCase()
        if (sentenceLower.indexOf(start) != -1) {
          //包含当前单词
          var index = sentenceLower.indexOf(start)
          var replacement = "<span style='color:#5ee2c9;font-size:1.3rem'>" + split[0].substring(index, index + start.length) + "</span>"
          var mSentence = split[0].substring(0, index) + replacement + split[0].substring(index + start.length)
          return mSentence
        } else {
          //还是匹配不到 则匹配前四个字母
          //即可能出现变型 匹配前四个字符 若相等 则将其设为高亮
          var mSentence = split[0]
          if (word.length > 4) {
            var regex = word.substring(0, 4)
            var target = word
            var tmp = mSentence.split(" ")
            for (let s in tmp) {
              if (tmp[s].startsWith(regex)) {
                target = tmp[s]
                break
              }
            }
            if (target != word) {
              if (target.endsWith(".") || target.endsWith(",") || target.endsWith("!") || target.endsWith(";") || target.endsWith("?") || target.endsWith("-") || target.endsWith("——")) {
                target = target.substring(0, target.length - 1)
              }
              mSentence = mSentence.split(target)[0] + "<span style='color:#5ee2c9;font-size:1.3rem'>" + target + "</span>" + mSentence.split(target)[1]
            }
          }
          return mSentence
        }
      }
    } else {
      //只出现一次
      var start = split[0]
      var end = split[1]
      var target = word
      if (!start.endsWith(" ")) {
        target = start.split(" ")[start.split(" ").length - 1] + target
        start = start.substring(0, start.length - start.split(" ")[start.split(" ").length - 1].length)
      }
      if (!end.startsWith(" ")) {
        target = target + end.split(" ")[0]
        end = end.substring(end.split(" ")[0].length)
      }
      if (target.endsWith(".") || target.endsWith("!") || target.endsWith("?")) {
        end = target.substring(target.length - 1)
        target = target.substring(0, target.length - 1)
      }
      if (target.endsWith(",")) {
        end = "," + end
        target = target.substring(0, target.length - 1)
      }
      if (target.endsWith(";")) {
        end = ";" + end
        target = target.substring(0, target.length - 1)
      }
      if (target.endsWith(":")) {
        end = ":" + end
        target = target.substring(0, target.length - 1)
      }
      if (target.endsWith("-")) {
        end = "-" + end
        target = target.substring(0, target.length - 1)
      }
      if (target.indexOf("——") != -1) {
        if (target.split("——").length == 2) {
          end = "——" + target.split("——")[1] + end
          target = target.split("——")[0]
        }
      }

      if (split.length > 2) {
        var length = start.length + target.length + end.length
        var remain = sentence.substring(length)
        var replacement = "<span style='color:#5ee2c9;font-size:1.3rem'>" + word + "</span>"
        remain = remain.replace(word, replacement)
        end = end + remain
      }

      var mSentence = start + "<span style='color:#5ee2c9;font-size:1.3rem'>" + target + "</span>" + end
      return mSentence
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var level = parseInt(options.level)
    this.setData({
      baseLevel: level
    })
    // 每天零点清缓存
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var new_time = year + '-' + month + '-' + day;
    console.log(new_time)
    if (wx.getStorageSync('time')) {
      var old_time = wx.getStorageSync('time')
      if (old_time != new_time) {
        console.log(old_time)
        console.log("clean storage")
        wx.removeStorageSync('new_list')
        wx.removeStorageSync('old_list')
        wx.removeStorageSync('word_list')
        wx.removeStorageSync('pass_list')
        wx.removeStorageSync('post_list')
        wx.removeStorageSync('currentPointer')
        wx.removeStorageSync('realPointer')
        wx.setStorageSync('time', new_time)
      }
    } else {
      wx.setStorageSync('time', new_time)
    }
    var new_list = wx.getStorageSync('new_list')
    var old_list = wx.getStorageSync('old_list')
    var word_list = wx.getStorageSync('word_list')
    var pass_list = wx.getStorageSync('pass_list')
    var post_list = wx.getStorageSync('post_list')
    var currentPointer = wx.getStorageSync('currentPointer')
    var realPointer = wx.getStorageSync('realPointer')
    var more_pic_list = wx.getStorageSync('more_pic_list')
    if (more_pic_list!=undefined){
      this.setData({
        more_pic_list: more_pic_list
      })
    }

    // word_list = word_list.concat(this.data.old_list)
    // word_list = word_list.concat(this.data.new_list)
    if (!new_list) {
      //到时候就联网
      console.log("no storage")
      this.loadData()
    } else {
      console.log("get data from storage")
      let progress_text = ''
      let wordType = ''
      if (currentPointer < old_list.length) {
        progress_text = '正在复习旧单词'
        wordType = 'TYPE_TEXT'
      } else if (currentPointer < old_list.length + new_list.length) {
        progress_text = '正在学习新单词'
        wordType = 'TYPE_GRAPH'
      } else {
        progress_text = '正在复习新单词'
        wordType = 'TYPE_TEXT'
      }
      var word_list_num = new_list.length + old_list.length
      this.setData({
        word_list_num: word_list_num,
        new_list: new_list,
        old_list: old_list,
        word_list: word_list,
        pass_list: pass_list,
        post_list: post_list,
        currentPointer: currentPointer,
        realPointer: realPointer,
        progress_text: progress_text,
        wordType: wordType,
      }, () => {
        this.initialize()
      })
    }
  },

  initialize: function() {

   //totalsize 更换为 old + new*2
    var totalSize = this.data.old_list.length + this.data.new_list.length * 2
    var word_list = this.data.word_list
    console.log("current"+this.data.currentPointer)
    console.log("real" + this.data.realPointer)
    console.log(word_list)
    this.setData({
      totalSize: totalSize,
      progressPercentage: this.data.currentPointer * 100 / totalSize,
      word: word_list[this.data.realPointer].word,
      targetSentence: word_list[this.data.realPointer].sentence,
      word_symbol: word_list[this.data.realPointer].phonetic_symbol_us,
    })
    this.refreshList(this.data.word_list, this.data.wordType)
  },

  refreshList: function(word_list, wordType) {
    //复习旧单词只用复习释义
    console.log(word_list)
    console.log(wordType)
    let progress_text = ''
    this.setData({
      animationData: ''
    })
    if (this.data.currentPointer < this.data.old_list.length) {
      progress_text = '正在复习旧单词'
      wordType = 'TYPE_TEXT'
      
    } else if (this.data.currentPointer < this.data.old_list.length + this.data.new_list.length) {
      progress_text = '正在学习新单词'
      wordType = 'TYPE_GRAPH'
    } else {
      progress_text = '正在复习新单词'
      wordType = 'TYPE_TEXT'
    }
    // console.log(this.data.word_list)
    this.onSoundClick()
    this.setData({
      animationData: '',
      wordType:wordType
    })
    if (word_list.length < 4) {
      console.log("length is minier than 4")
      word_list = word_list.concat(this.data.pass_list)
    }
    var correctAnswer = null
    if (wordType == 'TYPE_GRAPH') {
      correctAnswer = word_list[this.data.realPointer].pic
    } else {
      correctAnswer = word_list[this.data.realPointer].meaning
    }
    // console.log(correctAnswer)

    var list = []
    var pic_list = []
    var have_more_pic = false
    if (JSON.stringify(this.data.more_pic_list) != '""' && JSON.stringify(this.data.more_pic_list) != "[]")    {
      have_more_pic = true
      // console.log(JSON.stringify(this.data.more_pic_list))
      console.log("have more pic")
      //当more_pic_list有数据时
      var more_pic_list = this.data.more_pic_list
      for (var i = 0; i < more_pic_list.length; i++) {
        pic_list.push(more_pic_list[i].pic)
      }
      for (var i = 0; i < word_list.length; i++) {
        pic_list.push(word_list[i].pic)
      }
    }  

    // console.log(word_list)
    while (list.length < 3) {

      //向下取整
      var rNum = Math.floor(Math.random() * word_list.length)
      // console.log(rNum)
      if (wordType == 'TYPE_GRAPH') {
        if (have_more_pic){  
          rNum = Math.floor(Math.random() * pic_list.length)
          if (correctAnswer == pic_list[rNum]) {
            continue
          }
          var isAdded = false
          for (let index in list) {
            if (list[index] == pic_list[rNum]) {
              isAdded = true
              break
            }
          }
          if (!isAdded) {
            list.push(pic_list[rNum])
          }
          continue
        }
       
        if (correctAnswer == word_list[rNum].pic) {
          continue
        }
        var isAdded = false
        for (let index in list) {
          if (list[index] == word_list[rNum].pic) {
            isAdded = true
            break
          }
        }
        if (!isAdded) {
          list.push(word_list[rNum].pic)
        }
      } else {
        if (correctAnswer == word_list[rNum].meaning) {
          continue
        }
        var isAdded = false

        for (let index in list) {
          if (list[index] == word_list[rNum].meaning) {
            isAdded = true
            break
          }
        }
        if (!isAdded) {
          list.push(word_list[rNum].meaning)
        }
      }
    }
    // console.log(list)
    var index = Math.floor(Math.random() * 4)
    var tmpList = list.splice(0, index)
    // console.log("tmplist")
    // console.log(tmpList)
    // console.log(correctAnswer)

    var finalList = []
    finalList = finalList.concat(tmpList)
    finalList = finalList.concat(correctAnswer)
    finalList = finalList.concat(list)
    if (wordType == 'TYPE_GRAPH') {
      // if (finalList.length<4){
      //   console.log("小于四")
      //   pics = ["http://47.107.62.22/l_e/update_word/word_pic/4a32a91a-67f2-46b1-b761-80c43c3bcb9e.jpg", "http://47.107.62.22/l_e/update_word/word_pic/9287b8b9-abec-49e7-bd7a-d541b8d7e348.jpg", "http://47.107.62.22/l_e/1/1_pic/5b625ee1430bc.jpg"]
      //   var n = 4 - finalList.length
      //   finalList = finalList.concat(pics.splice(0,n))
      // }
      this.setData({
        img_path_first: finalList[0],
        img_path_second: finalList[1],
        img_path_third: finalList[2],
        img_path_fourth: finalList[3],
        correctAnswer: index + 1,
        progress_text: progress_text
      })
    } else {
      // if (finalList.length < 4) {
      //   meaning = ["n. 丛林", "adj. 牙齿的，牙科的", "n. 箍，铁环，戒指，篮"]
      //   var n = 4 - finalList.length
      //   finalList = finalList.concat(meaning.splice(0, n))
      // }
      this.setData({
        text_path_first: finalList[0],
        text_path_second: finalList[1],
        text_path_third: finalList[2],
        text_path_fourth: finalList[3],
        correctAnswer: index + 1,
        progress_text: progress_text
      })
    }
  },

  onSelectGraphItem: function(event) {
    // console.log(event)
    var audio = wx.createInnerAudioContext()
    var id = event.currentTarget.id
    this.setData({
      selectPos: id,
      animationData: ''
    })
    this.setAnimation()
    // console.log(this.data.selectPos)
    if (id == this.data.correctAnswer) {

      audio.src = '/voice/correct.mp3'
      audio.play()
      if (this.data.currentPointer < this.data.totalSize) {

        setTimeout(this.onGraphSuccess, 100)
      } else {
        this.setData({
          progressPercentage: 100,
          currentPointer: this.data.totalSize
        })
        // console.log("到头了")
        this.doPostWork()
      }
    } else {
      audio.src = '/voice/wrong.mp3',
        audio.play()
      this.onGraphFail()
    }

  },

  setAnimation: function() {
    this.animation.scale3d(1.5, 1.5, 1.5).step({
      duration: 200
    })
    this.animation.scale3d(1, 1, 1).step({
      duration: 200
    })

    this.setData({
      animationData: this.animation.export()
    })
  },

  onGraphSuccess: function() {
    var obj = this.data.word_list[this.data.realPointer]
    if (obj.level < 1) {
      //新单词学习
      wx.navigateTo({
        url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
      })
    } else if (obj.level < 2) {
      //新单词复习阶段
      if (this.data.wrongCount > 0) {
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
      } else {
        this.toRefresh()
      }
    } else {
      if (this.data.wrongCount > 1) {
        //旧单词复习
        //复习时错2次才会跳转并打回原形
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
      } else {
        this.setData({
          wordType: 'TYPE_TEXT',
          selectPos: 0,
          wrongCount: 0,
          tips_text: ''
        })
        this.refreshList(this.data.word_list, this.data.wordType)
      }
    }
  },

  onGraphFail: function() {
    var level = this.data.word_list[this.data.realPointer].level

    var wrongCount = this.data.wrongCount
    wrongCount++
    this.setData({
      wrongCount: wrongCount,
    })
    switch (wrongCount) {
      case 1:
        this.setData({
          tips_text: this.data.word_list[this.data.realPointer].paraphrase
        })
        break
      case 2:
        this.setData({
          tips_text: this.data.word_list[this.data.realPointer].meaning
        })
        break
      case 3:
        this.setData({
          tips_text: this.data.word_list[this.data.realPointer].sentence_cn
        })
        break
      default:
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
        break
    }
  },

  toRefresh: function() {
    console.log("toRefresh")
    var currentPointer = this.data.currentPointer
    var realPointer = this.data.realPointer
    console.log(this.data.word_list)
    if (this.data.word_list[realPointer].level < 2) {
      var word_list = this.data.word_list
      var obj = word_list[this.data.realPointer]
      obj.level = obj.level + 1
      word_list[realPointer] = obj
      this.setData({
        word_list: word_list
      })
    }
    //旧单词复习
    if (currentPointer < this.data.old_list.length) {
      this.setData({
        wordType: 'TYPE_TEXT'
      })
    }
    realPointer++
    currentPointer++
    console.log("currentPointer = " + currentPointer)
    console.log("realPointer = " + realPointer)

    if (realPointer >= this.data.word_list.length) {
      realPointer -= this.data.new_list.length
    }

    if (currentPointer == this.data.totalSize - this.data.new_list.length) {
         //判断知道已经进入复习释义
      this.setData({
        showReviewToast: true,
        wordType: 'TYPE_TEXT',
      })
      setTimeout(() => {
        this.setData({
          showReviewToast: false
        })
      }, 1000)
    }

    if (currentPointer == this.data.totalSize - this.data.new_list.length*2) {
      //新单词学习阶段
      this.setData({
        wordType: 'TYPE_GRAPH',
      })
    }

    if (currentPointer == this.data.totalSize) {
      this.setData({
        progressPercentage: 100,
        currentPointer: this.data.totalSize
      })
      this.doPostWork()
    } else {
      this.setData({
        selectPos: 0,
        currentPointer: currentPointer,
        realPointer: realPointer,
        progressPercentage: currentPointer * 100 / this.data.totalSize,
        word: this.data.word_list[realPointer].word,
        targetSentence: this.data.word_list[realPointer].sentence,
        word_symbol: this.data.word_list[realPointer].phonetic_symbol_us,
        tips_text: '',
        wrongCount: 0,
        // paraphrase: this.data.word_list[this.data.currentPointer].paraphrase,
        // meaning: 
      })
      this.refreshList(this.data.word_list, this.data.wordType)
    }

  },

  onSelectTextItem: function(event) {
    console.log("onTextTap")
    var audio = wx.createInnerAudioContext()
    var id = event.currentTarget.id
    this.setData({
      selectPos: id
    })
    if (this.data.selectPos == this.data.correctAnswer) {
      this.setAnimation()
      audio.src = '/voice/correct.mp3'
      if (this.data.currentPointer < this.data.totalSize) {
        setTimeout(this.onTextSuccess, 600)
      } else {
        this.setData({
          progressPercentage: 100,
          currentPointer: this.data.totalSize
        })
        // console.log("到头了")
        this.doPostWork()
      }
      // else {

      // }
    } else {
      audio.src = '/voice/wrong.mp3'
      this.onTextFail()
    }
    audio.play()
  },

  onTextSuccess: function() {
    console.log("TextSuccess")
    var obj = this.data.word_list[this.data.realPointer]
    if (obj.level <= 2) {
      //新单词释义复习或者旧单词释义选择题
      if (this.data.wrongCount > 0) {
        //错过就跳转并重置到总列表最后
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
      } else {
        if (this.data.currentPointer < this.data.old_list.length) {
          //旧单词复习 level + 1
          let word_list = this.data.word_list
          let obj = word_list[this.data.realPointer]
          obj.level = obj.level + 1
          word_list[this.data.realPointer] = obj
          this.setData({
            word_list: word_list
          })
        }
        this.grounpPostWork(obj)
        this.toRefresh()

      }
    } else {
      //旧单词复习
      if (this.data.wrongCount > 0) {
        //错过就跳转并重置到总列表最后
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
      } else {
        let word_list = this.data.word_list
        let obj = word_list[this.data.realPointer]
        obj.level = obj.level + 1
        word_list[this.data.realPointer] = obj
        this.setData({
          wordType: 'TYPE_TEXT',
          word_list: word_list
        })
        this.grounpPostWork(obj)
        this.toRefresh()

      }
    }
  },

  onTextFail: function() {
    var wrongCount = this.data.wrongCount
    wrongCount++
    this.setData({
      wrongCount: wrongCount
    })
    switch (wrongCount) {
      case 1:
        this.setData({
          tips_text: this.data.word_list[this.data.realPointer].paraphrase
        })
        break
      default:
        wx.navigateTo({
          url: 'word_detail/word_detail?wrongCount=' + this.data.wrongCount + "&word_id=" + this.data.word_list[this.data.realPointer].id + '&word=' + this.data.word_list[this.data.realPointer].word + '&symbol=' + this.data.word_list[this.data.realPointer].phonetic_symbol_us + '&paraphrase=' + this.data.word_list[this.data.realPointer].paraphrase + '&meaning=' + this.data.word_list[this.data.realPointer].meaning + '&pic=' + this.data.word_list[this.data.realPointer].pic,
        })
        break
    }
  },

  /**
   * 将对应元素放到列表最后
   */
  onCurrentToLast: function() {
    var obj = this.data.word_list[this.data.realPointer]
    var word_list = this.data.word_list
    var old_list = this.data.old_list
    var new_list = this.data.new_list
    if (this.data.realPointer < old_list.length) {
      //旧单词复习时错误
      old_list.splice(this.data.realPointer, 1)
      //加到新单词列表后 还得把level重置
      obj.level = 0
      new_list.push(obj)
      word_list.splice(this.data.realPointer, 1)
      word_list.push(obj)
      //总长会变更,测试点
      var totalSize = this.data.totalSize + 1
      this.setData({
        old_list: old_list,
        new_list: new_list,
        word_list: word_list,
        wrongCount: 0,
        totalSize: totalSize,
        progressPercentage: this.data.currentPointer * 100 / totalSize,
        word: word_list[this.data.realPointer].word,
        targetSentence: word_list[this.data.realPointer].sentence,
        word_symbol: word_list[this.data.realPointer].phonetic_symbol_us,
        wordType: 'TYPE_TEXT',
        selectPos: 0,
        tips_text: ''
      })
    } else {
      //新单词复习时错误
      //新单词学习不做重置
      if (obj.level < 1) {
        this.toRefresh()
        console.log("新单词学习错误 不做重置")
        return
      }
      //新单词复习做重置
      console.log("新单词复习错误")
      var index = this.data.realPointer - old_list.length
      new_list.splice(index, 1)
      new_list.push(obj)
      word_list.splice(this.data.realPointer, 1)
      word_list.push(obj)
      this.setData({
        new_list: new_list,
        word_list: word_list,
        wrongCount: 0,
        word: word_list[this.data.realPointer].word,
        targetSentence: word_list[this.data.realPointer].sentence,
        word_symbol: word_list[this.data.realPointer].phonetic_symbol_us,
        selectPos: 0,
        tips_text: ''
      })
    }
    this.refreshList(word_list, this.data.wordType)
  },


  //pass按钮函数节流，每1.7s最多执行一次
  onPassTap: util.throttle(function(event) {
    // console.log((new Date()).getSeconds())
    this.onPostChance(event)
    var obj = this.data.word_list[this.data.realPointer]
    obj.level = 5
    this.grounpPostWork(obj)
    var currentPointer = this.data.currentPointer
    var realPointer = this.data.realPointer
    var pass_list = this.data.pass_list
    var old_list = this.data.old_list
    var new_list = this.data.new_list
    var word_list = this.data.word_list
    //通过realPointer判断是否为旧单词
    if (realPointer < old_list.length) {
      //为旧单词
      obj.level = 5
      pass_list.push(obj)
      old_list.splice(this.data.realPointer, 1)
      word_list.splice(this.data.realPointer, 1)
      var totalSize = this.data.totalSize - 1
      if (totalSize == 0) {
        this.setData({
          progressPercentage: 100,
          currentPointer: this.data.totalSize
        })
        this.doPostWork()
        return
      } else {
        this.setData({
          pass_list: pass_list,
          old_list: old_list,
          word_list: word_list,
          totalSize: totalSize,
          progressPercentage: currentPointer * 100 / totalSize,
          wordType: 'TYPE_GRAPH',
          wrongCount: 0,
          word: word_list[realPointer].word,
          targetSentence: word_list[realPointer].sentence,
          word_symbol: word_list[realPointer].phonetic_symbol_us,
          selectPos: 0,
          tips_text: ''
        })
        this.refreshList(word_list, this.data.wordType)
      }
    } else {
      //为新单词
      if (currentPointer < word_list.length) {
        //新单词学习过程
        obj.level = 5
        pass_list.push(obj)
        var totalSize = this.data.totalSize - 3
        let index = realPointer - old_list.length
        new_list.splice(index, 1)
        word_list.splice(realPointer, 1)
        if (new_list.length == 0) {
          //如果新单词列表没有了 则结束
          this.setData({
            progressPercentage: 100,
            currentPointer: this.data.totalSize
          })
          this.doPostWork()
          return
        } else {
          if (realPointer == word_list.length) {
            realPointer -= new_list.length
          }
          this.setData({
            pass_list: pass_list,
            old_list: old_list,
            word_list: word_list,
            totalSize: totalSize,
            realPointer: realPointer,
            progressPercentage: currentPointer * 100 / totalSize,
            wordType: 'TYPE_GRAPH',
            wrongCount: 0,
            word: word_list[realPointer].word,
            targetSentence: word_list[realPointer].sentence,
            word_symbol: word_list[realPointer].phonetic_symbol_us,
            selectPos: 0,
            tips_text: ''
          })
        }
        this.refreshList(word_list, this.data.wordType)
      } else {
        //新单词复习过程
        // console.log("新单词复习过程")
        var totalSize = this.data.totalSize
        if (currentPointer < totalSize - new_list.length) {
          //新单词图册复习
          console.log("新单词图册复习")
          if (currentPointer == old_list.length + new_list.length) {
            this.setData({
              showReviewToast: true
            })
            setTimeout(() => {
              this.setData({
                showReviewToast: false
              })
            }, 1000)
          }
          obj.level = 5
          pass_list.push(obj)
          let totalSize = this.data.totalSize - 2
          let index = realPointer - old_list.length
          new_list.splice(index, 1)
          word_list.splice(realPointer, 1)
          if (new_list.length == 0) {
            //如果新单词列表没有了 则结束
            this.setData({
              progressPercentage: 100,
              currentPointer: this.data.totalSize
            })
            this.doPostWork()
            return
          } else {
            // console.log(totalSize)
            // console.log(currentPointer)
            if (currentPointer == totalSize - new_list.length) {
              this.setData({
                wordType: 'TYPE_TEXT'
              })
            }

            if (realPointer == word_list.length) {
              realPointer -= new_list.length
            }
            // 还有则可以进行复习
            this.setData({
              pass_list: pass_list,
              old_list: old_list,
              word_list: word_list,
              totalSize: totalSize,
              progressPercentage: currentPointer * 100 / totalSize,
              realPointer: realPointer,
              // wordType: 'TYPE_GRAPH',
              wrongCount: 0,
              word: word_list[realPointer].word,
              targetSentence: word_list[realPointer].sentence,
              word_symbol: word_list[realPointer].phonetic_symbol_us,
              selectPos: 0,
              tips_text: ''
            })
            this.refreshList(word_list, this.data.wordType)
          }
        } else {
          //新单词释义复习
          // console.log("新单词释义复习")
          obj.level = 5
          pass_list.push(obj)
          let totalSize = this.data.totalSize - 1
          let index = realPointer - old_list.length
          new_list.splice(index, 1)
          word_list.splice(realPointer, 1)
          if (new_list.length == 0) {
            //没有可再复习的了
            this.setData({
              progressPercentage: 100,
              currentPointer: this.data.totalSize
            })
            this.doPostWork()
            return
          } else {
            if (realPointer == word_list.length) {
              this.setData({
                progressPercentage: 100,
                currentPointer: this.data.totalSize
              })
              this.doPostWork()
              return
            }
            this.setData({
              pass_list: pass_list,
              old_list: old_list,
              word_list: word_list,
              totalSize: totalSize,
              progressPercentage: currentPointer * 100 / totalSize,
              realPointer: realPointer,
              // wordType: 'TYPE_GRAPH',
              wrongCount: 0,
              word: word_list[realPointer].word,
              targetSentence: word_list[realPointer].sentence,
              word_symbol: word_list[realPointer].phonetic_symbol_us,
              selectPos: 0,
              tips_text: ''
            })
            this.refreshList(word_list, this.data.wordType)
          }
        }
      }
    }
  }, 800),

  grounpPostWork: function(word) {
    var post_list = this.data.post_list
    if (post_list.indexOf(word) == -1 && word != undefined) {
      post_list.push(word)
    }
    this.setData({
      post_list: post_list,
    })
    console.log("word_list:")
    console.log(this.data.word_list)
    console.log("post_list:")
    console.log(this.data.post_list)
    if (this.data.post_list.length >= 5) {
      var post_list = this.data.post_list
      //去重
      var new_post_list = [];
      for (var i = 0; i < post_list.length; i++) {
        for (var j = i + 1; j < post_list.length; j++) {
          if (post_list[i].id == post_list[j].id) {
            ++i;
          }
        }
        new_post_list.push(post_list[i]);
      }
      this.setData({
        post_list: new_post_list,
      })
      console.log("deduplication_post_list:")
      console.log(new_post_list)
      if (new_post_list.length >= 5) {
        var list = []
        for (let i in new_post_list) {
          var str_meaning = new_post_list[i]['meaning']
          new_post_list[i]['meaning'] = str_meaning.replace(/[\r\n]/g, "");
          var s = '{"id":' + new_post_list[i]['id'] + ',"level":' + new_post_list[i]['level'] + ',"word":"' + new_post_list[i]['word'] + '","meaning":"' + new_post_list[i]['meaning'] + '"' + ',"word_type":"' + new_post_list[i]['word_type'] + '"}'
          list.push(s)
          console.log(s)
        }
        var listStr = list.join(',')
        listStr = '[' + listStr + ']'
        console.log(listStr)
        //清空post_list
        this.setData({
          post_list: []
        })
        var time_start = (new Date()).valueOf()
        wx.request({
          url: app.globalData.HOST + '/home/liquidation_word.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': app.globalData.token,
            'version': 'version1'
          },
          data: {
            word_list: listStr
          },
          success: (res) => {
            console.log(res.data)
            if (res.data.status == 200) {
              console.log("上传成功")
              var time_end = (new Date()).valueOf()
              console.log("上传耗时：")
              var time = time_end - time_start
              console.log(time)
              var posted_list_num = this.data.posted_list_num + new_post_list.length
              console.log("word_list_num:")
              console.log(this.data.word_list_num)
              console.log("posted_list_num:")
              console.log(posted_list_num)
              this.setData({
                posted_list_num: posted_list_num
              })
            } else {
              console.log(res.data.msg)
              console.log("上传失败(移至下一组上传)：")
              var post_list = this.data.post_list.concat(new_post_list)
              this.setData({
                post_list: post_list
              })
            }
          },
          fail: (res) => {
            console.log(res)
            console.log("网络请求失败(移至下一组上传)：")
            var post_list = this.data.post_list.concat(new_post_list)
            this.setData({
              post_list: post_list
            })
          }
        })
      }
    }
  },


  //上传最后一组并打卡
  doPostWork: function() {

    let that = this
    var post_list = this.data.post_list
    if (post_list.length == 0) {
      console.log("上传完成，清除缓存，跳转至打卡")
      this.data.requestClear = true
      if (wx.getStorageSync('new_list') || wx.getStorageSync('old_list') || wx.getStorageSync('pass_list')) {
        wx.removeStorageSync('new_list')
        wx.removeStorageSync('old_list')
        wx.removeStorageSync('word_list')
        wx.removeStorageSync('pass_list')
        wx.removeStorageSync('post_list')
        wx.removeStorageSync('currentPointer')
        wx.removeStorageSync('realPointer')
      }
      
      if (parseInt(this.data.baseLevel) < 2) {
        console.log("跳转到打卡")
        var beforePage = getCurrentPages()[0]
        beforePage.loadData(app.globalData.token)
        wx.redirectTo({
          url: '../sign/sign',
          success: function() {
            that.setData({
              hasupload: true
            })
          }
        })
      } else {
        console.log("返回首页")
        wx.reLaunch({
          url: '../../../tabBar/home/home',
          success: function() {
            that.setData({
              hasupload: true
            })
          }
        })
      }
    } else {
      //去重
      var new_post_list = [];
      for (var i = 0; i < post_list.length; i++) {
        for (var j = i + 1; j < post_list.length; j++) {
          if (post_list[i].id == post_list[j].id) {
            ++i;
          }
        }
        new_post_list.push(post_list[i]);
      }
      this.setData({
        post_list: new_post_list
      })
      console.log("post_list:")
      console.log(post_list)
      console.log("new_post_list:")
      console.log(new_post_list)

      // wx.showToast({
      //   title: '上传中',
      //   icon: 'loading',
      //   duration: 30000
      // })
      wx.showLoading({
        title: '上传中...',
      })
      let that = this
      if (!this.data.hasupload) {
        that.setData({
            hasupload: true
          },
          () => {
            var list = []
            for (let i in new_post_list) {
              var str_meaning = new_post_list[i]['meaning']
              new_post_list[i]['meaning'] = str_meaning.replace(/[\r\n]/g, "");
              var s = '{"id":' + new_post_list[i]['id'] + ',"level":' + new_post_list[i]['level'] + ',"word":"' + new_post_list[i]['word'] + '","meaning":"' + new_post_list[i]['meaning'] + '"' + ',"word_type":"' + new_post_list[i]['word_type'] + '"}'
              list.push(s)
            }
            var listStr = list.join(',')
            listStr = '[' + listStr + ']'
            console.log("上传最后一组，单词个数：")
            console.log(list.length)
            console.log(listStr)
            var time_start = (new Date()).valueOf()
            wx.request({
              url: app.globalData.HOST + '/home/liquidation_word.do',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': app.globalData.token,
                'version': 'version1'
              },
              data: {
                word_list: listStr
              },
              success: (res) => {
                console.log(res.data)
                if (res.data.status == 200) {
                  console.log("最后一组上传成功")
                  var time_end = (new Date()).valueOf()
                  console.log("上传耗时：")
                  var time = time_end - time_start
                  console.log(time)
                  var posted_list_num = this.data.word_list_num + list.length
                  if (posted_list_num >= this.data.word_list_num) {
                    console.log("上传完成，清除缓存跳转至打卡")
                    if (parseInt(this.data.baseLevel) < 2) {
                      console.log("跳转到打卡")
                      var beforePage = getCurrentPages()[0]
                      beforePage.loadData(app.globalData.token)
                      this.data.requestClear = true
                      if (wx.getStorageSync('new_list') || wx.getStorageSync('old_list') || wx.getStorageSync('pass_list')) {
                        wx.removeStorageSync('new_list')
                        wx.removeStorageSync('old_list')
                        wx.removeStorageSync('word_list')
                        wx.removeStorageSync('pass_list')
                        wx.removeStorageSync('post_list')
                        wx.removeStorageSync('currentPointer')
                        wx.removeStorageSync('realPointer')
                      }
                      if (wx.getStorageSync('more_pic_list') != undefined) {
                        wx.removeStorageSync('more_pic_list')
                      }
                      wx.redirectTo({
                        url: '../sign/sign',
                        success: function() {
                          that.setData({
                            hasupload: true
                          })
                        }
                      })
                    } else {
                      console.log("已打卡，返回首页")
                      wx.reLaunch({
                        url: '../../../tabBar/home/home',
                        success: function() {
                          that.setData({
                            hasupload: true
                          })
                        }
                      })
                    }
                  } else {
                    console.log("还有单词未完成上传，返回首页")
                    wx.reLaunch({
                      url: '../../../tabBar/home/home?hold_on=200',
                      success: function() {
                        that.setData({
                          hasupload: true
                        })
                      }
                    })
                  }
                } else {
                  that.setData({
                    hasupload: false
                  })
                  console.log("上传失败")
                }
              },
              fail: (res) => {
                console.log(res)
              },
              complete: () => {
                wx.hideLoading()
              }
            })

            // //不等返回信息直接跳打卡
            // var posted_list_num = this.data.word_list_num + list.length
            // if (posted_list_num >= this.data.word_list_num) {
            //   console.log("上传完成，跳转至打卡")
            //   if (parseInt(this.data.baseLevel) < 2) {
            //     console.log("跳转到打卡")
            //     var beforePage = getCurrentPages()[0]
            //     beforePage.loadData(app.globalData.token)
            //     wx.redirectTo({
            //       url: '../sign/sign',
            //       success: function () {
            //         that.setData({
            //           hasupload: true
            //         })
            //       }
            //     })
            //   } else {
            //     console.log("已打卡，返回首页")
            //     wx.reLaunch({
            //       url: '../../../tabBar/home/home',
            //       success: function () {
            //         that.setData({
            //           hasupload: true
            //         })
            //       }
            //     })
            //   }
            // }
            // else {
            //   console.log("还有单词未完成上传，返回首页")
            //   wx.reLaunch({
            //     url: '../../../tabBar/home/home?hold_on=200',
            //     success: function () {
            //       that.setData({
            //         hasupload: true
            //       })
            //     }
            //   })
            // }

            this.data.requestClear = true
            if (wx.getStorageSync('new_list') || wx.getStorageSync('old_list') || wx.getStorageSync('pass_list')) {
              console.log("清除缓存")
              wx.removeStorageSync('new_list')
              wx.removeStorageSync('old_list')
              wx.removeStorageSync('word_list')
              wx.removeStorageSync('pass_list')
              wx.removeStorageSync('post_list')
              wx.removeStorageSync('currentPointer')
              wx.removeStorageSync('realPointer')
            }
          })
      } else {
        return
      }
    }
  },

  onSentenceTap: function(event) {
    var audioCtx = this.audioCtx
    if (audioCtx) {
      // audioCtx.stop()
      audioCtx.setSrc(this.data.word_list[this.data.realPointer].sentence_audio)
      audioCtx.play()
    }
  },

  onWordTap: function(event) {
    var audioCtx = this.audioCtx
    if (audioCtx) {
      // audioCtx.stop()
      audioCtx.setSrc(this.data.word_list[this.data.realPointer].pronunciation_us)
      audioCtx.play()
    }
  },

  onSoundClick: function(event) {
    var audioCtx = this.audioCtx
    if (audioCtx) {
      // audioCtx.stop()
      audioCtx.setSrc(this.data.word_list[this.data.realPointer].sentence_audio)
      audioCtx.play()
    }
  },


  onPostChance: function(event) {
    if(event==undefined||event==null||event.detail.formId==undefined||event.detail.formId==null){
      return
    }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let b = wx.canIUse('wx.createInnerAudioContext')
    // console.log(b)
    this.audioCtx = wx.createAudioContext("audio")
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.animation = animation
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
    console.log("页面隐藏")
    app.globalData.appIsShow = false
    app.studyData.requestClear = this.data.requestClear
    app.studyData.word_list = this.data.word_list
    app.studyData.new_list = this.data.new_list
    app.studyData.old_list = this.data.old_list
    app.studyData.pass_list = this.data.pass_list
    app.studyData.post_list = this.data.post_list
    app.studyData.currentPointer = this.data.currentPointer
    app.studyData.realPointer = this.data.realPointer
    app.studyData.more_pic_list = this.data.more_pic_list
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //退出背单词页时保存进度
    console.log("页面消亡 是否需要clear缓存：" + this.data.requestClear)
    app.studyData.requestClear = this.data.requestClear
    if (!this.data.requestClear) {
      console.log("设置缓存")
      if (this.data.word_list.length > 0 || this.data.pass_list.length > 0) {
        console.log("in")
        wx.setStorageSync('word_list', this.data.word_list)
        wx.setStorageSync('new_list', this.data.new_list)
        wx.setStorageSync('old_list', this.data.old_list)
        wx.setStorageSync('pass_list', this.data.pass_list)
        wx.setStorageSync('post_list', this.data.post_list)
        wx.setStorageSync('currentPointer', this.data.currentPointer)
        wx.setStorageSync('realPointer', this.data.realPointer)
        if (JSON.stringify(this.data.more_pic_list) != '""' && JSON.stringify(this.data.more_pic_list) != '[]') {
          wx.setStorageSync('more_pic_list', this.data.more_pic_list)
        }
      } else {
        console.log("移除缓存")
        if (wx.getStorageSync('word_list') != undefined) {
          wx.removeStorageSync('word_list')
          wx.removeStorageSync('new_list')
          wx.removeStorageSync('old_list')
          wx.removeStorageSync('pass_list')
          wx.removeStorageSync('post_list')
          wx.removeStorageSync('currentPointer')
          wx.removeStorageSync('realPointer')
        }
        if (wx.getStorageSync('more_pic_list') != undefined) {
          wx.removeStorageSync('more_pic_list')
        }
      }
    }
    if (this.audioCtx) {
      wx.stopVoice()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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