// pages/home/jingxuan/jingxuan.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    usertype: 0,
    ismaiduan: 0,
    data: {},
    statusType: [],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex: 1,
    ajaxpageindex: 0,
    pagesize: 20,
    hideLoading: true, //隐藏底部加载
    loading: true,
    searchtxt: "",
    alter: false, //弹框
    searchType: '', //searchType
    listtime: [], //商品列表
    originalprice: '', //商品原价
    discountprice: '', //商品折扣价
    distributor: '', //分销商佣金比例
    distributor1: '', //分销员佣金比例
    mydistributor: '', //我的佣金比例
    img:'',//商品图片
    name: '',//商品名字
    e_price: '',//商品名字
    price: '',//折扣价
    sellingtimes:'',//已售
    shopid:'',//商品id
    search:'',//搜索
  },
  statusTap: function(e) {
    console.log(e)
    const curType = e.currentTarget ? e.currentTarget.dataset.index : e;
    this.data.currentType = curType
    // if (curType == 0) {
    this.setData({
      searchType: e.currentTarget.dataset.index
    });
    // } else if (curType == 1) {
    //   this.setData({
    //     searchType: 0
    //   });
    // } else {
    //   this.setData({
    //     searchType: 3
    //   });
    // }


    this.setData({
      orderList: [],
      pageindex: 1,
      ajaxpageindex: 0,
      hideLoading: true, //隐藏底部加载
      loading: true,
      currentType: curType
    });

    this.onShow();


  },
// 搜索
  shopsearch: function () {
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getgoodslist', { //用户商品列表
      distributorid: wx.getStorageSync('distributorid'),
      search: that.data.search

    }).then(function (res) {
      console.log(res)
      that.setData({
        listtime: res.Data.list,
        // listtime: lists
      })



    });
  },


  tapalter: function(e) {
    console.log(e)

    this.setData({
      alter: true,
      img: e.currentTarget.dataset.img,
      e_price: e.currentTarget.dataset.e_price,
      name: e.currentTarget.dataset.name,
      price: e.currentTarget.dataset.price,
      sellingtimes: e.currentTarget.dataset.sellingtimes,
      shopid: e.currentTarget.dataset.shopid,
    })
  },

  submit: function() {

    wx.request({
      url: app.data.hostAjax + '/api/dstributor/v1/choicegoods', // 设置分佣比例
      data: {
        goodsid: this.data.shopid,
        user_id: wx.getStorageSync("userid"),
          price: this.data.originalprice,
          e_price: this.data.discountprice,
        distributor: this.data.mydistributor,
        shopowner: this.data.distributor,
        salaperson: this.data.distributor1,
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data.Data)
        if (res.data.Code==200){
           wx.showToast({
             title: '设置成功'
           })
         }else{
          wx.showToast({
            title: res.data.Msg,
            icon: "none",
          });
        
         }

      }
    })


    this.setData({
      alter: false
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/selectgoodstype', // 获取知识商品
      data: {

      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data)
        _this.setData({
          statusType: res.data.Data
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //搜索功能
  search: function (e) {
    var originalprice = e.detail.value
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },


  // 商品原价
  originalprice: function(e) {
    var originalprice = e.detail.value
    console.log(e.detail.value)
    this.setData({
      originalprice: e.detail.value
    })
  },
  // 商品折扣价
  discountprice: function(e) {
    var discountprice = e.detail.value
    console.log(e.detail.value)
    this.setData({
      discountprice: e.detail.value
    })
  },
  //分销商佣金比例
  distributor: function(e) {
    var distributor = e.detail.value
    console.log(e.detail.value)
    this.setData({
      distributor: e.detail.value
    })
  },
  //分销员佣金比例
  distributor1: function(e) {
    var distributor1 = e.detail.value
    console.log(e.detail.value)
    this.setData({
      distributor1: e.detail.value
    })
  },
  // 我的佣金比例
  mydistributor: function(e) {
    var mydistributor = e.detail.value
    console.log(e.detail.value)
    this.setData({
      mydistributor: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getgoodslist', { //用户商品列表
      distributorid: wx.getStorageSync('distributorid'),
      goodtype: that.data.searchType

    }).then(function(res) {
      console.log(res)
    //  if(res.Code==1000){
    //    wx.showToast({
    //      title: "暂无数据",
    //      icon: "none",
    //    });
    //  }
     


      if (res.Code == 200) {
        that.setData({
          listtime: res.Data.list,
          // listtime: lists
        })
      } else {
        wx.showToast({
          title: "暂无数据",
          icon: "none",
        });

        that.setData({
          listtime: [],
          // listtime: lists
        })
        
      }




    });
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