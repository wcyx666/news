// pages/article/article.js
const WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData:"",
    chooseSize:false,
    inputValue:"",
    articleID:"", // 文章ID
    commentNum:"", // 评论数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      articleID: options.id
    })
    that.getComment(options.id); // 获取评论
    that.getArcticle(options.id);
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
  getArcticle(id){
    var that = this;
    wx.request({
      url: app.globalData.requestHttp + 'article/wx_read_article_id.php',
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
  // 发布评论
  getMess() {
    let that = this;
    if (that.data.inputValue == '') {
      wx.showToast({
        title: "请输入内容",
        icon: "none"
      })
    } else {
      let avatarUrl = app.globalData.userInfo.avatarUrl;
      let nickName = app.globalData.userInfo.nickName;
      wx.request({
        url: app.globalData.requestHttp + 'comment/wx_init_comment.php',
        header: app.globalData.requestHeader,
        method: "POST",
        data: {
          articleID: that.data.articleID,
          uid: app.globalData.openid,
          content: that.data.inputValue,
          avatarUrl: avatarUrl,
          nickName: nickName
        },
        success(res) {
          if (res.data.success == 1) {
            that.getComment(that.data.articleID);
            that.setData({
              chooseSize: false
            })
            wx.showToast({
              title: "发布成功",
              icon: "success"
            })
          }
        },
        fail() {

        }
      })
    }
  },
  // 获取评论数据
  getComment(id) {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'comment/wx_read_comment.php',
      header: app.globalData.requestHeader,
      method: "POST",
      data:{
        articleid: id,
      },
      success(res) {
        that.setData({
          commentData:res.data.data,
          commentNum: res.data.data.length
        })
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