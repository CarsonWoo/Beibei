// pages/user/wallet/alipay/alipay.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    total_cash : 0,

    input_cash_number:'',

    input_name:'',

    input_account:'',

    is_input_number : false,

    is_input_name : false,

    is_input_account : false,


    is_show_mask: false,

    is_show_remind_view: false,

  },


  stopPageScroll: function (e) {
  },

  OnCloseView: function (event) {
    wx.showTabBar({})
    this.setData({

      is_show_mask: false,

      is_show_remind_view: false,

    })
  },


//限制只能输入数字并且第一位不能是点，小数点后最多两位
  input_number_filter:function(e){
    var inputVal;
    inputVal = e.detail.value.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^[0]+[0-9]*$/gi, "");
    //提现金额不能超过现有金额
    if (parseFloat(inputVal) > parseFloat(this.data.total_cash) ){
      inputVal = inputVal.substring(0, inputVal.length - 1);
      this.setData({ input_cash_number: inputVal })
    }
    if (inputVal == "undefined" || inputVal == null || inputVal == "") {
      this.setData({is_input_number: false})
      } else {
      this.setData({ is_input_number: true })
    } 
    this.setData({ input_cash_number: inputVal })
  },

  input_name_filter:function(e){
    var inputVal;
    inputVal = e.detail.value
    // inputVal = e.detail.value.replace(/\s+/g,'')  
    this.setData({ input_name: inputVal })
    if (inputVal == "undefined" || inputVal == null || inputVal == "") {
      this.setData({ is_input_name: false })
    } else {
      this.setData({ is_input_name: true })
    } 
  },

  input_account_filter: function (e) {
    var inputVal;
    inputVal = e.detail.value
    // inputVal = e.detail.value.replace(/\s+/g,'')
    this.setData({ input_account: inputVal })
    if (inputVal == "undefined" || inputVal == null || inputVal == "") {
      this.setData({ is_input_account: false })
    } else {
      this.setData({ is_input_account: true })
    } 
  },

  

  submit_successed:function(){

    console.log(this.data.input_cash_number)

    if (parseFloat(this.data.input_cash_number)<5){
      this.setData({
        is_show_mask: true,
        is_show_remind_view: true,
      })
    }

    else{
      var token = app.globalData.token
      var host = app.globalData.HOST

      wx.request({
        url: host + "/various/withdraw_cash.do",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        data:{
          type: 'zfb',
          money: parseFloat(this.data.input_cash_number),
          name:this.data.input_name,
          account_number:this.data.input_account,
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            wx.redirectTo({
              url: '../alipay_successed/alipay_successed?back_cash=' + parseFloat(this.data.input_cash_number),
            })
          } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
            console.log(res.data.msg)
          }
        },
        fail: (res) => {
          console.log("fail")
          console.log(res)
        }
      })


    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      total_cash: options.cash_back_number
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

