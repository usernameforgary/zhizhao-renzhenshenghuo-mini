// pages/person/consultant/consultant.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shjvalue: '',
    listshj:[]
  },

  shinput(e) {
    console.log(e)
    let shjinput = e.detail.value
    this.setData({
      shjvalue: shjinput
    })
  },

  
  determine: function(e) {
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/machinebinding', { //绑定售货机
      distributorid: wx.getStorageSync("distributorid"),
      machinecode: that.data.shjvalue,
    }).then(function(res) {
      console.log(res)
      if (res.Code == 200) {
        that.onLoad()
        wx.showModal({
          title: '提示',
          content: '绑定成功请勿重复绑定',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })


      }
    });
  },

  // 解除绑定
  relieve: function(e) {
    console.log(e)
    var lists = e.currentTarget.dataset.index
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/deletemachinebinding', { //绑定售货机
      distributorid: wx.getStorageSync("distributorid"),
      machinecode: lists,
    }).then(function(res) {
      console.log(res)
      if (res.Code == 200) {
        that.onLoad()
        wx.showModal({
          title: '提示',
          content: '解除绑定成功',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })


      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function(options) {

      var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getmachinebindinglist', { //绑定售货机
        distributorid: wx.getStorageSync("distributorid"),
       
      }).then(function (res) {
        console.log(res)
         that.setData({
           listshj:res.Data.list
         })
      });
   
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

  }
})