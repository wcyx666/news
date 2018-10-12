// pages/home/home.js
const amapFile = require('../libs/amap-wx.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveData:"",
    messData:"", // 寄语内容
    userInfo:'',
    topList:[
      { name: "身边事", index: 1 },
      { name: "好活动", index: 2 }
    ],
    chooseSize: false,
    inputValue:"",
    inputValueLenght:32
  },

  chooseSezi: function (e) {
    if (app.globalData.userInfo){
      
      var that = this;
      that.setData({
        // 改变view里面的Wx：if
        chooseSize: true
      })
    }else {
      wx.showModal({
        title: '请登录再进行操作',
        showCancel:false,  
        success:res => {
          console.log(1)
        }
      })
    }
  },

  hideModal: function (e) {
    var that = this;
    that.setData({
      chooseSize: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    var myAmapFun = new amapFile.AMapWX({ key: '733baa1f16554b74283d02774403cffb' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        that.setData({
          liveData: data.liveData
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },

  bindKeyInput(e){
    this.inputValueLenght(e.detail.value.length)
    this.setData({
      inputValue: e.detail.value,
    })
  },

  inputValueLenght(val){
    if (val == 0){
      this.setData({
        inputValueLenght: 32,
      })
    } else if ( val == 32 ){
      this.setData({
        inputValueLenght: 0,
      })
    }else {
      if (this.data.inputValueLenght == 0){
        this.setData({
          inputValueLenght: 32 - 1,
        })
      }else {
        this.setData({
          inputValueLenght: this.data.inputValueLenght - 1,
        })
      }    
    }
  },

  getMess(){
    let that = this;
    if (that.data.inputValue == ''){
      wx.showToast({
        title:"请输入内容",
        icon: "none"
      })
    }else {
      let avatarUrl = app.globalData.userInfo.avatarUrl;
      let nickName = app.globalData.userInfo.nickName;
      
      wx.request({
        url: app.globalData.requestHttp + 'message/wx_init_message.php',
        header: app.globalData.requestHeader,
        method: "POST",
        data: {
          uid: app.globalData.openid,
          content: that.data.inputValue,
          avatarUrl: avatarUrl,
          nickName: nickName
        },
        success(res) {
          if (res.data.success == 1){
            that.setData({
              chooseSize: false
            })
            wx.showToast({
              title: "发布成功",
              icon:"success"
            })
          }
        },
        fail() {

        }
      })
    }
    
    
  },
  randData() {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'message/wx_read_message.php',
      header: app.globalData.requestHeader,
      method: "POST",
      success(res) {
        console.log(res)
        if (res.data.success == 1) {
          that.setData({
            messData: res.data.data
          })
        }
      },
      fail() {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.randData();
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

  }
})