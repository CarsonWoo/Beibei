// utils/components/popup/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_share_study: app.globalData.FTP_ICON_HOST + 'btn_share_study.png',
    img_muchbook: app.globalData.FTP_ICON_HOST + 'img_muchbook.png',
    img_lead_contact: app.globalData.FTP_ICON_HOST + 'img_lead_contact.png',
    ic_close: app.globalData.FTP_ICON_HOST +'ic_close_feed_top.png',
  },

  drawImg: function() {
    let that = this;
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375;
        that.setData({
          screenWidth:res.windowWidth
        })
      },
    })
    var scale = 1334 / 750; //背景图片的高与宽之比
    console.log(scale)
    // let share_username = that.data.share_username
    // let share_insist_day = that.data.share_insist_day
    // let share_word_number = that.data.share_word_number
    // let qr_image = that.data.QRUrl
    // let portrait_image = that.data.portrait_image
    // let background_image = that.data.background_image
    let portrait_image = '/images/ic_sign_1.png'
    let background_image = 'img_share_sign_card.png'
    let scWidth = that.data.screenWidth
    let scHeight = that.data.screenWidth * scale

    const ctx = wx.createCanvasContext('img-canvas');
    //绘制背景图
    ctx.drawImage(background_image, 0, 0, scWidth, scHeight)
    ctx.setFillStyle("#000000")
    //ctx.fillRect(0, 0, scWidth, scHeight)

    // // 绘制圆形头像
    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(scWidth / 2 + 8.5, 120 + 21, 24.5, 0, 2 * Math.PI)
    // ctx.clip()
    // ctx.drawImage(portrait_image, scWidth / 2 - 24.5 + 8.5, 95.5 + 21, 55, 55)
    // ctx.restore()

    let todayText = '2019.8.25'
    var ts1 = 0.01424 * scHeight
    ctx.font = ts1 + 'px Times, Times New Roman, Georgia, serif';
    //绘制日期文字
    ctx.textAlign = "left";
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(ts1)
    ctx.fillText(todayText, scWidth * 0.071, scHeight * 0.076)


    let ts9 = parseInt(12 * rpx)
    var rectY = 0.1057 * scHeight
    let txtY = rectY + ts9 * 1.36
    ctx.beginPath()
    let ts10 = parseInt(45*rpx)
    let studyTime = '120'
    let numY = txtY + 0.065 * scHeight
    ctx.setFillStyle("#fff")
    ctx.font = 'bold ' + ts10 +'px "Times New Roman",Georgia,Serif'
    let studyNumW = ctx.measureText(studyTime).width
    ctx.textAlign = "left";
    if(studyTime.length>=3){
      ctx.setFontSize(parseInt(40*rpx))
      ctx.fillText(studyTime, 0.1073 * scWidth, numY)
    }else{
      ctx.fillText(studyTime, 0.1373 * scWidth, numY)
    }

    ctx.save()
    //绘制用户信息：头像，名称
    let circleR = 0.061*scWidth /2
    let circleX = 0.076*scWidth
    let circleY = 0.244*scHeight
    ctx.beginPath()
    ctx.arc(circleX+circleR,circleY+circleR , circleR, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portrait_image, circleX,circleY,circleR*2,circleR*2)
    ctx.restore()

    
    let ts2 = 10*rpx
    ctx.setFontSize(ts2)
    ctx.setFillStyle("#fff")
    ctx.textAlign = "left";
    ctx.fillText("用户名",0.1547*scWidth,circleY+circleR+(ts2/2))
    
     //绘制数字
    ctx.beginPath()
    let text1Y = 0.948*scHeight;
    let text1X = 0.67*scWidth;
    let ts7 = 24 * rpx
    let wordNum = '1180'
    ctx.font = 'bold ' + parseInt(ts7) +'px sans-serif'
    var wordNumW = ctx.measureText(wordNum).width
    //渐变色
    let grd2 = ctx.createLinearGradient(text1X-wordNumW, text1Y, text1X, text1Y)
    grd2.addColorStop(0, '#1ae8c8')
    grd2.addColorStop(1, '#4a8aff')
    ctx.setFillStyle(grd2)
    ctx.textAlign = "right";
    ctx.fillText(wordNum,text1X,text1Y)

    ctx.beginPath()
    let dayNum = '80'
    var dayNumW = ctx.measureText(dayNum).width
    let text2X = 0.9 * scWidth
    let grd3 = ctx.createLinearGradient(text2X-dayNumW, 0, text2X, 0)
    grd3.addColorStop(0, '#1ae8c8')
    grd3.addColorStop(1, '#4a8aff')
    ctx.setFillStyle(grd3)
    ctx.fillText(dayNum, text2X, text1Y)
    
    ctx.draw()
  // setTimeout(function () {
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: 0,
    //     width: scWidth,
    //     height: scHeight,
    //     destWidth: scWidth,
    //     destHeight: scHeight,
    //     canvasId: 'myCanvas',
    //     success: function (res1) {
    //       console.log('朋友圈分享图生成成功:' + res1.tempFilePath);
    //       that.saveImg(res1.tempFilePath)
    //     }
    //   });
    // }, 800);
  },

  getChnArrayFromStr(arrayStr, txt, lineMaxW, charW, ctx) {
    var txtW = ctx.measureText(txt).width
    if (txtW > lineMaxW) {
      var index = 0;
      for (var i = 1; (i * charW) <= lineMaxW; i++) {
        index = i
      }
      arrayStr.push(txt.substring(0,index+1))
      return this.getChnArrayFromStr(arrayStr, txt.substring(index + 1), lineMaxW, charW, ctx)
       
    } else {
      arrayStr.push(txt)
      console.log(arrayStr)
      return arrayStr
    }

  },

  getEngArrayFromStr(arrayStr,txt,lineMaxW,charW,ctx){
    var txtW = ctx.measureText(txt).width
    if(txtW>lineMaxW){
      var index = 0;
      for (var i = 1; (i * charW) <= lineMaxW; i++) {
        index = i
      }
      var firstStr = txt.substring(0, index)
      var array = firstStr.split('')
      console.log(array)
      for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == " ") {
          console.log(i)
          console.log(txt.substring(0, i))
          arrayStr.push(txt.substring(0,i))
          return this.getEngArrayFromStr(arrayStr,txt.substring(i+1), lineMaxW, charW, ctx)
        }
      }  
    }else{
      arrayStr.push(txt)
      console.log(arrayStr)
      return arrayStr
    }
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   // this.drawImg()
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

  },
  onMaskTap() {
    console.log("you")
  }
})