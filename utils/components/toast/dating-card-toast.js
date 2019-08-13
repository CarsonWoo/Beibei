// utils/components/toast/dating-card-toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    toastContent:'默认内容',
    isShowToast:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setToastContent(content){
      this.setData({
        toastContent:content
      })
    },
    showToast(time){
      this.setData({
        isShowToast:true,
      })
      let self = this;
      setTimeout(function () {
        self.setData({
          isShowToast: false
        })
      }, time)
    },
    showLoadingToast(content){
      this.setData({
        isShowToast:true,
        toastContent:content
      })
    },
    hideLoadingToast(){
      this.setData({
        isShowToast:false
      })
    }
  }
})
