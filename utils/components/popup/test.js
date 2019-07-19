// utils/components/popup/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    photoFlag:false,
    img_photo_example:'',
    ic_progress_heart: app.globalData.FTP_ICON_HOST + 'ic_progress_heart.png',
    bg_vip_grey: app.globalData.FTP_ICON_HOST + 'bg_vip_grey.png',
    btn_add_staff: app.globalData.FTP_ICON_HOST + 'btn_add_staff.png',
    btn_post: app.globalData.FTP_ICON_HOST + 'btn_add.png',
    btn_upload_photo: app.globalData.FTP_ICON_HOST + 'btn_upload_photo.png',
    btn_change_photo: app.globalData.FTP_ICON_HOST + 'btn_change_photo.png',
    btn_download_wxcode: app.globalData.FTP_ICON_HOST + 'btn_download_wxcode.png',
    img_couple: app.globalData.FTP_ICON_HOST + 'img_couple.png',
    img_follow_us: app.globalData.FTP_ICON_HOST + 'img_follow_us.png',
    img_girls1: app.globalData.FTP_ICON_HOST + 'img_girls1.png',
    img_girls2: app.globalData.FTP_ICON_HOST + 'img_girls2.png',
    img_lead: app.globalData.FTP_ICON_HOST + 'img_lead.png',
    img_match_success: app.globalData.FTP_ICON_HOST + 'img_match_success.png',
    img_photo_example: app.globalData.FTP_ICON_HOST + 'img_photo_example.png',
    img_relation_break: app.globalData.FTP_ICON_HOST + 'img_relation_break.png',
    img_vip_crown: app.globalData.FTP_ICON_HOST + 'img_vip_crown.png',
    img_vip_intro: app.globalData.FTP_ICON_HOST + 'img_vip_intro.png',
    img_wxcode_staff: app.globalData.FTP_ICON_HOST + 'img_wxcode_staff.jpg',

    bg_partner_card: app.globalData.FTP_ICON_HOST + 'bg-firstmeet.png',
    img_card_title: app.globalData.FTP_ICON_HOST + 'img-firstmeet.png',
    bg_matchday: app.globalData.FTP_ICON_HOST + 'bg-matchday.png',
    btn_meetta: app.globalData.FTP_ICON_HOST + 'btn-meetta.png',
    btn_break: app.globalData.FTP_ICON_HOST + 'btn-break.png',
    btn_remindta: app.globalData.FTP_ICON_HOST + 'btn-remindta.png',
    img_stop1: app.globalData.FTP_ICON_HOST + 'img-stop1.png',
    img_stop2: app.globalData.FTP_ICON_HOST + 'img-stop2.png',
    ic_heart: app.globalData.FTP_ICON_HOST + 'ic_progress_heart.png',
    img_restart_text: app.globalData.FTP_ICON_HOST +'img-restart-text.png',


    studiedWordsNumber :9,//匹配成功后每个进度中的单词数
  },

  switchChooseNumberText(number){
    if(number<10){
      return "  总背"+number+"/80";
    }else{
      return "总背" + number + "/80";
    }
  },
  drawProgressBar(){
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 375;
      },
    })

    var scale = this.data.studiedWordsNumber/80; //进度条比例
    var wordsNumberText = this. switchChooseNumberText(this.data.studiedWordsNumber);
    
    var borderHeight = 19*rpx;
    var borderWidth = 156 * rpx;
    var strokeWidth = 1.5 * rpx; //外框的线条宽度
    var tl = strokeWidth/2; //顶部和左边的缝隙
    var solidWidth = 12 * rpx;//填充条宽度
    var il = (borderHeight-solidWidth-strokeWidth*2)/2; //填充条与框边的padding值
    var ctx = wx.createCanvasContext('progressbar-canvas')
    var pi = Math.PI;
    
    //外框绘制
    ctx.beginPath()
    ctx.setStrokeStyle("#363e49")
    ctx.moveTo(borderHeight/2+tl,tl)
    ctx.setLineWidth(strokeWidth)
    ctx.lineTo(borderWidth+tl,tl)
    ctx.arc(borderWidth + tl, borderHeight / 2 + tl, borderHeight / 2, 1.5*pi,0)
    ctx.arc(borderWidth + tl, borderHeight / 2 + tl, borderHeight / 2,0,0.5*pi)
    ctx.lineTo(borderHeight / 2 +tl,borderHeight+tl);
    ctx.arc(borderHeight / 2 + tl, borderHeight / 2 + tl, borderHeight / 2, 0.5*pi, 1 * pi)
    ctx.arc(borderHeight / 2 + tl, borderHeight / 2 + tl, borderHeight / 2, 1 * pi, 1.5 * pi)
    ctx.stroke()

    //填充条绘制
    if(scale>0){
      ctx.beginPath()
      ctx.moveTo(borderHeight / 2 + tl, borderHeight / 2 + tl)
      ctx.setLineCap("round")
      ctx.setLineWidth(solidWidth)
      ctx.setStrokeStyle("#8269ff")
      ctx.lineTo((borderWidth + tl) * scale, borderHeight / 2 + tl)
      ctx.stroke()
    }

    //文字绘制
    ctx.beginPath()
    ctx.setFontSize(11 * rpx)
    ctx.fillStyle= "#404751"
    ctx.fillText(wordsNumberText, 100 * rpx + tl, borderHeight / 2+tl+3.5*rpx);
    ctx.draw()

    // var context = wx.createCanvasContext('progressbar-canvas')


    // context.beginPath();
    // context.setStrokeStyle("#00ff00")
    // context.setLineWidth(5)
    // context.rect(0, 0, 200, 200)
    // context.stroke()

    // context.beginPath();
    // context.setStrokeStyle("#ff0000")
    // context.setLineWidth(2)
    // context.moveTo(160, 100)
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    // context.moveTo(140, 100)
    // context.arc(100, 100, 40, 0, Math.PI, false)
    // context.moveTo(85, 80)
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    // context.moveTo(125, 80)
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    // context.stroke()
    // context.draw()
    
  },

  
  // changeInforSwip: function (detail) {
  //   if (detail.detail.source == "touch") {
  //     //当页面卡死的时候，current的值会变成0 
  //     if (detail.detail.current == 0) {
  //       //有时候这算是正常情况，所以暂定连续出现3次就是卡了
  //       let swiperError = this.data.swiperError
  //       swiperError += 1
  //       this.setData({ swiperError: swiperError })
  //       if (swiperError >= 3) { //在开关被触发3次以上
  //         console.error(this.data.swiperError)
  //         this.setData({ goodsIndex: this.data.preIndex });//，重置current为正确索引
  //         this.setData({ swiperError: 0 })
  //       }
  //     } else {//正常轮播时，记录正确页码索引
  //       this.setData({ swiperCurrent: detail.detail.current });
  //       //将开关重置为0
  //       this.setData({ swiperError: 0 })
  //     }
  //   }
  // },

  //监听选择boy、girl性别的按钮改变
  boyTap: function () {
    this.setData({
      sexFlag: 1
    })
  },
  girlTap: function () {
    this.setData({
      sexFlag: 2
    })
  },
  //点击事件绑定匹配匹配意向的flag变动
  wantGirlTap: function () {
    this.setData({
      wantFlag: 1
    })
  },
  wantBoyTap: function () {
    this.setData({
      wantFlag: 2
    })
  },
  wantAllTap: function () {
    this.setData({
      wantFlag: 3
    })
  },
  //信息提交按钮事件
  inforPostTap: function () {
    //emptyFlag控制提示填写信息toast
    if (this.data.sexFlag == 0 || this.data.wantFlag == 0) {
      this.setData({
        emptyFlag: true,
        postFlag: false
      })
    } else if (this.data.sexFlag > 0 && this.data.wantFlag > 0) {
      this.setData({
        emptyFlag: false,
        postFlag: true
      })
    }
  },

  //弹窗展示和隐藏函数
  showPopup:function(event){
    console.log(event.target.id);
    switch(event.target.id){
      
      case 'btn-pop-openvip':this.popup1.showPopup();
        break;
      case 'btn-pop-lead': this.popup2.showPopup();
        break;
      case 'btn-pop-vipintro': this.popup3.showPopup();
        break;
      case 'btn-pop-bluewxcode': this.popup4.showPopup();
        break;
      case 'btn-pop-pinkwxcode': this.popup5.showPopup();
        break;
      case 'btn-pop-contactus': this.popup6.showPopup();
        break;
      case 'btn-pop-meetcode': this.popup7.showPopup();
        break;
      case 'btn-pop-break': this.popup8.showPopup();
        break;
      case 'btn-pop-remind': this.popup9.showPopup();
        break;
      case 'btn-pop-restart': this.popup10.showPopup();
        break;
      case 'btn-pop-matchsuccess': this.popup11.showPopup();
        break;
        
    }
  },
  hidePopup: function (event) {
    switch (event.target.id) {
      case 'pop-openvip': this.popup1.hidePopup();
        break;
      case 'pop-lead': this.popup2.hidePopup();
        break;
      case 'pop-vipintro': this.popup3.hidePopup()
        break;
      case 'pop-bluewxcode': this.popup4.hidePopup();
        break;
      case 'pop-pinkwxcode': this.popup5.hidePopup();
        break;
      case 'pop-contactus': this.popup6.hidePopup();
        break;
      case 'pop-meetcode': this.popup7.hidePopup();
        break;
      case 'pop-break': this.popup8.hidePopup();
        break;
      case 'pop-remind': this.popup9.hidePopup();
        break;
      case 'pop-restart': this.popup10.hidePopup();
        break;
      case 'pop-matchsuccess': this.popup11.hidePopup();
        break;
    }
  },
  showInforPop(){
    this.setData({
      flag:!this.data.flag
    })
  },
  hideInforPop(){
    this.setData({
      inForPopFlag: !this.data.inForPopFlag
    })
  },

  stopPageScroll(){
    return
  },
  addStaff:function(){
    console.log("click staff");
    this.popup2.showToast("嗯呢讷讷嗯呢额");
  },
  choosePhoto(){
    wx.navigateTo({
      url: '../image-cropper/croppertest',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressBar();
    //绑定弹窗组件id
    this.popup1 = this.selectComponent("#pop-openvip");
    this.popup2 = this.selectComponent("#pop-lead");
    this.popup3 = this.selectComponent("#pop-vipintro");
    this.popup4 = this.selectComponent("#pop-bluewxcode");
    this.popup5 = this.selectComponent("#pop-pinkwxcode");
    this.popup6 = this.selectComponent("#pop-contactus");
    this.popup7 = this.selectComponent("#pop-meetcode");
    this.popup8 = this.selectComponent("#pop-break");
    this.popup9 = this.selectComponent("#pop-remind");
    this.popup10 = this.selectComponent("#pop-restart");
    this.popup11 = this.selectComponent("#pop-matchsuccess");
    this.cardToast = this.selectComponent("#card-toast");
  
  },
  showCardToast(){
    this.cardToast.setToastContent("测试一下toast")
    this.cardToast.showToast(3000)
  },
  onSendRemindTap(){
    console.log('you click send remind')
    console.log(this.popup9.getRemindText())
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.cropPhotoSrc){
      this.setData({
        photoFlag:true,
        img_photo_example:app.globalData.cropPhotoSrc
      })
    }
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

  }
})