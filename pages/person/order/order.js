var util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    statusType: ["全部", "待付款", "待发货", "已发货", "已完成", "退换货"],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "",],
    orderList: [],
    pageindex:1,
   ajaxpageindex: 0,
    pagesize:20,
    hideLoading: true,//隐藏底部加载
    loading:true,
    searchtxt:"",
    hasOnShow: false,
    //当前视频播放资源链接
    playVideoSrc:"",
    playVideoDoing:false,
    //下一页播放视屏读取
    og:{}
  },
  statusTap: function (e) {
    var curType
    if(e){
       curType = e.currentTarget.dataset.index;
      this.data.currentType = curType
      console.log(curType)
      if (curType == 0) {
        this.setData({
          searchType: 100
        });
      } else if (curType == 1) {
        this.setData({
          searchType: 0
        });
      } else if (curType == 2) {
        this.setData({
          searchType: 1
        });
      } else if (curType == 3) {
        this.setData({
          searchType: 2
        });
      } else if (curType == 4) {
        this.setData({
          searchType: 3
        });
      } else if (curType == 5) {
        this.setData({
          searchType: 4
        });
      }

    }
    this.setData({
      orderList: [],
      pageindex: 1,
      ajaxpageindex: 0,
      hideLoading: true,//隐藏底部加载
      loading: true,
      currentType: curType
    });
    this.onShow();
  },
  cancelOrderTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/transaction/v1/deleteorderinfo',{
            user_id: wx.getStorageSync("userIdBuyGood"),
            orderid: orderId
            }).then(function (res) {
            if (res.Code == "200") {
              that.statusTap();
            }
          })
        }
      }
    })
  },
  //播放视频
  // playVideo(e){
  //   console.log(e)
  //   //读取视频
  //   let index = e.currentTarget.dataset.index;
  //   let ogindex = e.currentTarget.dataset.ogindex;
  //   let og = this.data.orderList[index].goodslist[ogindex]
  //   this.setData({
  //     og:og
  //   })
  //   wx.navigateTo({
  //     url: '/pages/person/playvideo/playvideo?id',
  //   })
  //   //不再立即播放
  //   //return;
  //   if (!og.vide){
  //     wx.showToast({
  //       title: '视频资源没找到',
  //       icon:'none'
  //     })
  //     return;
  //   }
  //   this.setData({
  //     playVideoSrc:og.vide
  //   })
  //   //播放视频
  //   let videoContext =  wx.createVideoContext('playvideo_container',  this);
  //   videoContext.requestFullScreen({
  //     direction:90
  //   })
  //   videoContext.play()
  // },
  fullscreenchange(e){
    let isPlay = e.detail.fullScreen;
    this.setData({
      playVideoDoing:isPlay
    })
    // 停止视频
    if(!isPlay){
      let videoContext = wx.createVideoContext('playvideo_container', this);
      videoContext.stop()
      videoContext.seek(0)
      videoContext.pause()
      this.setData({
        playVideoSrc: ""
      })
    }
  },

  toPayTap: function (e) {
    const _this = this;
    const orderId = e.currentTarget.dataset.id;
    const total_fee = e.currentTarget.dataset.money;
    //调取提交订单接口--跳转到购物车结算页
    wx.redirectTo({
      url: '/pages/person/cart/carBuy/carBuy',
    })
  },
  scrolltolower() {
    
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onShow();
    }

  },
  onLoad: function (options) {
    this.setData({
      scroolHeight: app.data.windowHeight-40
    })
    if (options && options.type) {

      if (options.type == 100) {
        this.setData({
          hasRefund: false,
          currentType: options.type,
          searchType: parseInt(options.type)
        });
      } else {
        this.setData({
          hasRefund: false,
           currentType: options.type,
          searchType: parseInt(options.type)-1
        });
      }
    }else{
      this.setData({
        hasRefund: false,
        currentType: 0,
        searchType: 100
      });
    }
  },
  getOrder: function (pagesize) {
    // 获取订单列表
    var that = this;
    that.setData({
      orderList: [],
    })
    console.log(this.data.searchType)
    util.request(app.data.hostAjax + '/api/transaction/v1/curstormorderlist', {//用户订单列表
      userid: wx.getStorageSync("userIdBuyGood"),
      ordertype: this.data.searchType,
      pagesize: pagesize,
      pageindex: 1,
      searchtxt: this.data.searchtxt
    }).then(function (res) {
      console.log(res)
      if (res.Code == "200") {
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  onShow: function () {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/curstormorderlist',{//用户订单列表
      userid: wx.getStorageSync("userIdBuyGood"),
      ordertype:this.data.searchType,//100表示全部 0待付款 3已完成
      pagesize: this.data.pagesize,
      pageindex: this.data.pageindex,
      searchtxt: this.data.searchtxt
    }).then(function (res) {
      console.log(res)
      if (res.Code == "200") {
        console.log('111111')
        var arr = that.data.orderList.concat(res.Data.list);
        console.log("that.data.pageindex=", that.data.ajaxpageindex, that.data.pageindex )
        console.log(that.data.pageindex == that.data.ajaxpageindex)
        if (that.data.pageindex == that.data.ajaxpageindex) {
          console.log('22222')
          that.getOrder(that.data.orderList.length)
          return;
        }
        that.setData({
          orderList: arr,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  getgoods(e) {
    // 确认收货
    console.log(e)
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/transaction/v1/addbuyerreceiving', {
            userid: wx.getStorageSync("userIdBuyGood"),
            ordernumber: e.currentTarget.dataset.index,
          }).then(function (res) {
            if (res.Code == "200") {
              wx.showToast({
                title: '收货成功'
              })
              that.onLoad(that.data.e)
            } else {

              wx.showToast({
                title: res.Msg,
                icon: "none"
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})