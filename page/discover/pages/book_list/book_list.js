// pages/discover/book_list/book_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // book_list: [1, 2, 3, 4],
    swiperIndex: 0,
    chapter_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData()
  },

  loadData: function() {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    console.log(token)
    wx.request({
      url: HOST + '/various/showNowReadClassBookChapter.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          //data是所有书的对象集合，取值为书的id
          var data = res.data.data
          var book_list = []
          // console.log(data.size)
          for (var key in data) {
            book_list.push(data[key])
          }
          this.setData({
            book_list: book_list
          })
          this.changeChapterList(book_list[0])
          // console.log(data)
        }
      },
      fail: (res) => {
        console.log("请求失败: \n" + res)
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
    //width: 22px height: 39px
    var leftArrow = wx.createCanvasContext('left_arrow')
    var rightArrow = wx.createCanvasContext('right_arrow')

    leftArrow.setFillStyle("#c5caca")
    leftArrow.setStrokeStyle("#c5caca")
    leftArrow.setLineCap('round')
    leftArrow.setLineJoin("round")
    leftArrow.setLineWidth(1)
    leftArrow.beginPath()

    leftArrow.moveTo(20, 7)
    leftArrow.lineTo(5, 18)
    leftArrow.quadraticCurveTo(3, 19.5, 5, 21)
    leftArrow.lineTo(20, 32)
    leftArrow.lineTo(20, 7)

    leftArrow.stroke()
    leftArrow.fill()
    leftArrow.draw()

    rightArrow.setFillStyle("#c5caca")
    rightArrow.setStrokeStyle("#c5caca")
    rightArrow.setLineCap('round')
    rightArrow.setLineJoin("round")
    rightArrow.setLineWidth(1)
    rightArrow.beginPath()

    rightArrow.moveTo(2, 7)
    rightArrow.lineTo(17, 18)
    rightArrow.quadraticCurveTo(19, 19.5, 17, 21)
    rightArrow.lineTo(2, 32)
    rightArrow.lineTo(2, 7)

    rightArrow.stroke()
    rightArrow.fill()
    rightArrow.draw()

    //width:27px height:31px
    var icWord = wx.createCanvasContext('ic_word')
    icWord.setStrokeStyle('#ffffff')
    icWord.setLineCap('round')
    icWord.setLineJoin('round')
    icWord.beginPath()

    icWord.moveTo(21, 7)
    icWord.lineTo(8, 7)
    icWord.lineTo(8, 24)
    icWord.lineTo(22, 24)
    icWord.lineTo(22, 10)
    icWord.lineTo(8, 10)

    icWord.moveTo(15, 13.5)
    icWord.lineTo(12.5, 19.5)
    icWord.moveTo(15, 13.5)
    icWord.lineTo(17.5, 19.5)
    icWord.moveTo(14, 17.5)
    icWord.lineTo(16, 17.5)

    icWord.stroke()
    icWord.draw()
  },

  onSwiperChange: function(e) {
    var current = e.detail.current
    this.setData({
      swiperIndex: current
    })
    var chapter_list = this.data.book_list[current]
    this.changeChapterList(chapter_list)
  },

  changeChapterList: function(chapter_list) {
    this.setData({
      chapter_list:chapter_list
    })
    let is_reading = 0
    let is_finished = 1
    let end_chapter = chapter_list[chapter_list.length - 1].id
    for (let i = 0; i < chapter_list.length - 1; i++) {
      //取出最终更新的章节id
      if (chapter_list[i].is_able == 2 && (chapter_list[i + 1].is_able == 1 || chapter_list[i + 1].is_able == 0)){
        end_chapter = chapter_list[i].id
        break
      }
    }
    for (let i = 0; i < chapter_list.length; i++) {
      //存在一个未读
      if (chapter_list[i].is_able < 2) {
        is_finished = 0
        break
      }
    }
    if (is_finished == 0) {
      //只有未完成阅读 才有可能有其他状态
      for (let i = 0; i < chapter_list.length; i++) {
        //存在一个已读
        if (chapter_list[i].is_able == 2) {
          is_reading = 1
          break
        }
      }
    }
    this.setData({
      is_reading: is_reading == 1,
      is_finished: is_finished == 1,
      end_chapter: end_chapter
    })
  },

  onNewWordTap: function(e) {
    console.log(this.data.book_list[this.data.swiperIndex][0].book_id)
    wx.navigateTo({
      url: '../book/reading/new_word?book_id=' + this.data.book_list[this.data.swiperIndex][0].book_id,
    })
  },

  onChapterTap: function(e) {
    wx.setStorageSync("chapter_list", this.data.chapter_list)
    var chapter_list = this.data.chapter_list
    console.log(e)
    var chapter = e.currentTarget.dataset.chapter
    var chapter_id = e.currentTarget.dataset.chapter_id
    var isCurrentChapter = e.currentTarget.dataset.iscurrentchapter
    var isFirstChapter = e.currentTarget.dataset.isfirstchapter
    var book_id = this.data.book_list[this.data.swiperIndex][0].book_id
    var chapter_index = e.currentTarget.dataset.chapter_index
    console.log(e.currentTarget.dataset.chapter_index)
    var buttons_type = 0 // 0代表不显示，1代表只有下一章,2代表只有上一章，3代表上一章+下一章
    if(chapter_index==0&&chapter_list[1].is_able>0){
      buttons_type = 1
    }
    if (chapter_index == 0 && chapter_list[1].is_able == 0){
      buttons_type = 0
    }

    if (chapter_index < chapter_list.length - 1 && chapter_index>0 && chapter_list[chapter_index+1].is_able>0){
      buttons_type = 3
    }

    if (chapter_index < chapter_list.length - 1 && chapter_index > 0 && chapter_list[chapter_index + 1].is_able == 0) {
      buttons_type = 2
    }

    if(chapter_index == chapter_list.length-1){
      buttons_type = 2
    }


    wx.navigateTo({
      url: '../book/reading/reading?chapter_name=' + chapter + "&chapterId=" + chapter_id + "&bookId=" + book_id + "&end_chapter_id=" + this.data.end_chapter + "&start_chapter_id=" + this.data.book_list[this.data.swiperIndex][0].id + "&isCurrentChapter=" + isCurrentChapter + "&isFirstChapter=" + isFirstChapter + "&buttons_type=" + buttons_type +"&chapter_index="+chapter_index,
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
  },

  onLeftChange: function(e) {
    // console.log(e.currentTarget.dataset.current)
    var idx = e.currentTarget.dataset.current
    if (idx - 1 < 0) {
      idx = this.data.book_list.length - 1
    } else {
      idx = idx - 1
    }
    this.setData({
      swiperIndex: idx
    })
    this.changeChapterList(this.data.book_list[idx])
  },

  onRightChange: function(e) {
    // console.log(e.currentTarget.dataset.current)
    var idx = e.currentTarget.dataset.current
    if (idx + 1 >= this.data.book_list.length) {
      idx = 0
    } else {
      idx = idx + 1
    }
    this.setData({
      swiperIndex: idx
    })
    this.changeChapterList(this.data.book_list[idx])
  }


})