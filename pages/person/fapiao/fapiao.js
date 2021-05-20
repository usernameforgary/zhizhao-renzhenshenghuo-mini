// pages/invoice/fapiao.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    statusType: [
      {
        indexs: 1,
        label: "个人",
        
      },
      {
        indexs: 2,
        label: "企业",

      },
    ],
    currentTab: 1,
    name:'',
    phone:'',
    eimg:'',
    ordeid:'',
    title:'',
    duty:'',
    address:'',
    bankcard:'',
    bankname:'',
    bor:false,
  },
  active: function (e) {
     console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.int)

    this.setData({
      currentTab:e.currentTarget.dataset.int
    })

  },
// 个人名字
  name:function(e){
    console.log(e.detail.value)
    this.setData({
     name:e.detail.value
    })
  },
// 电话
  phone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  // 邮箱
  eimg: function (e) {
    console.log(e.detail.value)
    this.setData({
      eimg: e.detail.value
    })
  },
  //抬头名称
  titename: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  // 税号
  dutyname: function (e) {
    console.log(e.detail.value)
    this.setData({
      duty: e.detail.value
    })
  },
  // 单位名称
  address: function (e) {
    console.log(e.detail.value)
   


    this.setData({
      address: e.detail.value
    })
  },
  // 银行账户

  bankcard: function(e) {
    console.log(e.detail.value)
    this.setData({
      bankcard: e.detail.value
    })
  },
  // 开户银行
  bankname: function (e) {
    console.log(e.detail.value)
    this.setData({
      bankname: e.detail.value
    })
  },





  but:function () {
  let thist =this
    wx.request({//获取发票
      url: app.data.hostAjax + "/api/transaction/v1/addorderinvoice",
      data: {
        invoicetype: thist.data.currentTab,
        name: thist.data.name,
        tel: thist.data.phone,
        email: thist.data.eimg,
        title: thist.data.title,
        duty: thist.data.duty,
        bankname: thist.data.bankname,
        orderid: parseInt(thist.data.ordeid),
        address: thist.data.address,
        reason: '',
        bankcard: thist.data.bankcard,

      },
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data.Code)
        
        if (res.data.Msg == "该订单已申请开票,请等待审核！"){
          wx.navigateTo({
            url: '/pages/person/fapiaocg/fapiaocg',
          })
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: "none",
          });
        }

       
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      ordeid:options.id
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

  }
})