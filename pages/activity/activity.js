// pages/article/article.js
const WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData: "",
    chooseSize: false,
    inputValue: "",
    articleID: "", // 文章ID
    commentNum: "", // 评论数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      articleID: options.id
    })
    that.getActivity(options.id);
  },

  chooseSezi: function (e) {
    if (app.globalData.userInfo) {

      var that = this;
      that.setData({
        // 改变view里面的Wx：if
        chooseSize: true
      })
    } else {
      wx.showModal({
        title: '请登录再进行操作',
        showCancel: false,
        success: res => {
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

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  // 获取文章
  getActivity(id) {
    var that = this;
    wx.request({
      url: app.globalData.requestHttp + 'activity/wx_read_activity_id.php',
      header: app.globalData.requestHeader,
      method: "POST",
      data: {
        id: id
      },
      success(res) {
        that.setData({
          articleData: res.data.data
        })
        let article = res.data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
      },
      fail() {

      }
    })
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;

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