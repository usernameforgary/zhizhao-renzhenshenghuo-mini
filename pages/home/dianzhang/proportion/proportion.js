// pages/home/dianzhang/proportion/proportion.js
const util = require('../../../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard:false,
    id:0,
    shopid:0,
    distributor: "",
    shopowner: "",
    salaperson: "",
    hadsetting: false,
    showSelect:false
  },
  isCard(e) {
    console.log(e.detail.value)
    this.setData({
      isCard: e.detail.value
    })
    if (e.detail.value){//设置pos
      util.request(app.data.hostAjax + '/api/user/v1/addispos', {
        userid: wx.getStorageSync("userid"),
        shopid: this.data.shopid,
        posstate: 1
      }).then(function (res) {
      });
    }else{
      //取消pos
      util.request(app.data.hostAjax + '/api/user/v1/addispos', {
        userid: wx.getStorageSync("userid"),
        shopid: this.data.shopid,
        posstate: 0
      }).then(function (res) {
      });
    }
  },
  checkname(e) {
    let _this=this;
    this.setData({
      goodname: e.currentTarget.dataset.name,
      showSelect: !this.data.showSelect,
      goodsid: e.currentTarget.dataset.id
    })
    util.request(app.data.hostAjax + '/api/user/v1/getshopownerpercents', {
      userid: wx.getStorageSync("userid"),
      shopid: this.data.shopid,
      goodsid: e.currentTarget.dataset.id
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          distributor: parseFloat(res.Data.distributor) || 0,
          shopowner: parseFloat(res.Data.shopowner) || 0,
          salaperson: parseFloat(res.Data.salaperson) || 0,
          isCard: res.Data.ispos == "POS" ? true : false
        })
        console.log(Number(res.Data.salaperson))
        if (Number(res.Data.distributor) != 100) {
          //  已经设置过了
          _this.setData({
            setted: true
          })
        } else {
          _this.setData({
            setted: false
          })
        }
        if (parseFloat(res.Data.distributor) && wx.getStorageSync("usertype") == 6) {
          _this.setData({
            hadsetting: true
          })
        }
      }
    });
  },
  changgoods(){
    this.setData({
      showSelect: !this.data.showSelect
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// /api/user/v1/addsetpercents
      this.setData({
        shopid: options.shopid,
      })
    let _this = this;
    //获取三者的比例
    
    //获取所有商品的名字和id，名字展示页面，id选取第一个调取查询分成比列接口
    util.request(app.data.hostAjax + '/api/user/v1/getgoodslist', {
      pageindex:1,
      pagesize: 111,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          goodsLists:res.Data.list,
          goodname: res.Data.list[0].goodsabbreviation,
          goodsid: res.Data.list[0].id
        })
        util.request(app.data.hostAjax + '/api/user/v1/getshopownerpercents', {
          userid: wx.getStorageSync("userid"),
          shopid: _this.data.shopid,
          goodsid: res.Data.list[0].id
        }).then(function (res) {
          if (res.Code == "200") {
            _this.setData({
              distributor: parseFloat(res.Data.distributor) || 0,
              shopowner: parseFloat(res.Data.shopowner) || 0,
              salaperson: parseFloat(res.Data.salaperson) || 0,
              isCard: res.Data.ispos == "POS" ? true : false
            })
            if (Number(res.Data.distributor)!=100){
              //  已经设置过了
              _this.setData({
                setted:true
              })
            }else{
              _this.setData({
                setted: false
              })
            }
            if (parseFloat(res.Data.distributor) && wx.getStorageSync("usertype") == 6) {
              _this.setData({
                hadsetting: true
              })
            }
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function () {
    if (this.data.setted && wx.getStorageSync("usertype")==6){
      wx.showToast({
        title: "您已经设置过一次了，不能重复设置",
        icon: "none",
        duration: 3000
      })
      return
    }
    if (parseFloat(this.data.shopowner) + parseFloat(this.data.salaperson) + parseFloat(this.data.distributor) != 100) {
      wx.showToast({
        title: "推广大使+课程顾问+经销商的比例之和必须等于100%",
        icon: "none",
        duration: 4000
      })
      return
    }
    let _this = this;
    //分销商给课程顾问设置
    util.request(app.data.hostAjax + '/api/user/v1/addsetpercents', {
      userid: wx.getStorageSync("userid"),
      shopid: this.data.shopid,
      distributor: this.data.distributor,
      shopowner: this.data.shopowner,
      salaperson: this.data.salaperson,
      posstate: this.data.isCard?1:0,
      goodsid: this.data.goodsid
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '设置成功'
        })
        wx.navigateBack({
          delta:1
        })
      } else {
        wx.showToast({
          title:res.Msg,
          icon:"none"
        })
      }
    });
  },
  distributor(e){
    //e.detail.value
    this.setData({
      distributor: e.detail.value
    })
  },
  shopowner(e) {
    this.setData({
      shopowner: e.detail.value
    })
    this.settingauto()
  },
  salaperson(e) {
    this.setData({
      salaperson: e.detail.value
    })
    this.settingauto()
  },
  settingauto(){//自动计算三者的比例
    if (this.data.distributor){
      // Number(2),toFixed
    }
    this.setData({
      distributor: (100.00 - parseFloat(this.data.shopowner).toFixed(2) - parseFloat(this.data.salaperson).toFixed(2)).toFixed(2)
    })
    if (isNaN(this.data.distributor)){
      this.setData({
        distributor: ""
      })
    }
    console.log(this.data.distributor)
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