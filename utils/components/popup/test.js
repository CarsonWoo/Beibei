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