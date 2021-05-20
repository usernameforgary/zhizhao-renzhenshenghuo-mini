// pages/money/index/index.js
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
import drawQrcode from "../../../utils/weapp.qrcode.esm.js";
var app = getApp();
Page({
  skipNextPage(e) {
    //点击图片跳转到详情
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    modalshow: false,//优惠券的弹框-可以领取--当有优惠券的时候提示--分享人进来的时候判断是否分享成功
    true: true,
    bannerList: [],
    goodsValue: "",
    ajaxData: [],
    value1: 1,//商品数量
    ajaxGood: null,//点击加号，获取商品详情中的口味
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    loading: true,
    hideLoading: true,//隐藏底部加载
    hideBotom: true,//隐藏底部导航
    personUrl: "",
    show: false,
    acticeInxex: null,//口味的index,从0开始
    pageindex: 1,
    goodsValue: "",//搜索框的内容
    pagesize: 10,//每页的商品数量
    firstId: 0,//上一次选择的商品id
    warplist: [],//店铺列表
    shoplist: [],//商品列表
    usertype: '',//判断用户类型
    search: '',//搜索

    show1: false, //保存图片的弹出层
    ajaxData: null,
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    widthCord: (195 / 750) * wx.getSystemInfoSync().windowWidth, //二维码的px值（转换之后的）
    btnloading: false, //保存按钮的加载动画

    seleArr: [],//商品类型
    seleinx: 0,

    newgoodsarr:[],
    curentinx: 1,
    view:{
      Width:100,
      Height:100
    },

  },
  changeIndex(e) {
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  // 搜索功能
  scrou: function () {
    var thist = this
    console.log(11111)
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getpingtaiallgoodslist', // 获取店铺信息
      data: {
        search: thist.data.search
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res)
        thist.setData({
          newgoodsarr: res.data.Data.list
        })
      }
    })
  },

  search: function (e) {

    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  togglePopupclose() {
    var that = this;
    app.checkauthorization(() => {
      this.setData({ show1: !this.data.show1 });
    });
    that.setData({
      btnloading: false,
    });
  },
  togglePopup(e) {
    var that = this;
    var shopid = e.currentTarget.dataset.id

    var indexs = parseInt(e.currentTarget.dataset.index);

    console.log(that.data.warplist);

    that.setData({
      ajaxData: that.data.warplist[indexs],
    });
    that.drawImg();

    app.checkauthorization(() => {
      this.setData({ show1: !this.data.show1 });
    });
  },

  getOBJvalue(value) {
    return (value / 750) * wx.getSystemInfoSync().windowWidth;
  },
  roundRectfunction: function (ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('white')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },

  drawImg: function () {

    var that = this;
    //禁止页面分享
    const ctx = wx.createCanvasContext("myQrcode");
    ctx.setFillStyle("white");

    that.roundRectfunction(ctx, 0, 0, that.getOBJvalue(600), that.getOBJvalue(800), that.getOBJvalue(18))

    // ctx.fillRect(0, 0, that.getOBJvalue(600), that.getOBJvalue(800));
    ctx.setFillStyle("#000");

    var nstr = that.data.ajaxData.corporatename;
    if (nstr.length > 7) {
      nstr = nstr.substring(0, 7) + '...';
    }

    ctx.setFontSize(that.getOBJvalue(30));
    ctx.fillText('店铺名称：' + nstr, that.getOBJvalue(180), that.getOBJvalue(110));

    ctx.setFontSize(that.getOBJvalue(22));
    ctx.fillText('长按识别或扫码进入', that.getOBJvalue(340), that.getOBJvalue(760));

    ctx.setFontSize(that.getOBJvalue(22));
    ctx.fillText(wx.getStorageSync("username"), that.getOBJvalue(40), that.getOBJvalue(700));

    var imgUrl;
    imgUrl =
      "https://renzhenshenghuo.cn/shop/detail/?shopid=" +
      that.data.ajaxData.id +
      "&shareid=" +
      wx.getStorageSync("userIdBuyGood");



    // if (wx.getStorageSync("usertype") == 1) {

    //   imgUrl =
    //     "https://renzhenshenghuo.cn/good/detail/?shopid=" +
    //     goodsId +
    //     "&shareid=" +
    //     wx.getStorageSync("userIdBuyGood");
    // } else {

    //   imgUrl =
    //     "https://renzhenshenghuo.cn/good/detail/?useridsaleman=" +
    //     wx.getStorageSync("fenxiaoshangid") +
    //     "&goodsid=" +
    //     goodsId +
    //     "&shopid=" +
    //     wx.getStorageSync("shopid") +
    //     "&shareid=" +
    //     wx.getStorageSync("userIdBuyGood");
    // }

    var shareImg = that.data.ajaxData.logimg.replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");

    console.log('图片地址:' + shareImg);

    wx.downloadFile({
      url: shareImg,
      success: (res) => {

        console.log('下载成功:' + shareImg);

        shareImg = res.tempFilePath;
        ctx.drawImage(
          shareImg,
          that.getOBJvalue(30),
          that.getOBJvalue(30),
          that.getOBJvalue(100),
          that.getOBJvalue(100)
        );

        var contentimg = that.data.ajaxData.replylist[0].smallimg.replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
        wx.downloadFile({
          url: contentimg,
          success: (res) => {
            console.log('下载成功:' + shareImg);
            contentimg = res.tempFilePath;
            ctx.drawImage(
              contentimg,
              that.getOBJvalue(150),
              that.getOBJvalue(200),
              that.getOBJvalue(300),
              that.getOBJvalue(300)
            );

            var userimg = wx.getStorageSync("userimg").replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");

            console.log('用户头像地址' + userimg);

            wx.downloadFile({
              url: userimg,
              success: (res) => {
                console.log('下载成功:' + shareImg);
                userimg = res.tempFilePath;
                ctx.drawImage(
                  userimg,
                  that.getOBJvalue(40),
                  that.getOBJvalue(550),
                  that.getOBJvalue(100),
                  that.getOBJvalue(100)
                );
                drawQrcode({
                  x: that.getOBJvalue(360),
                  y: that.getOBJvalue(550),
                  width: that.getOBJvalue(160),
                  height: that.getOBJvalue(160),
                  canvasId: "myQrcode",
                  ctx: ctx,
                  text: imgUrl,
                });

                that.setData({
                  btnloading: false,
                });

              },
              fail: function (res) {
                // wx.showToast({
                //   title: '请前往个人中心登陆后再试',
                //   icon: 'none',
                // });
                // that.togglePopupclose();

                drawQrcode({
                  x: that.getOBJvalue(360),
                  y: that.getOBJvalue(550),
                  width: that.getOBJvalue(160),
                  height: that.getOBJvalue(160),
                  canvasId: "myQrcode",
                  ctx: ctx,
                  text: imgUrl,
                });

                that.setData({
                  btnloading: false,
                });

              }
            });

          },
        });



      },
    });







  },

  saveImgBtn() {
    let _this = this;
    wx.getSetting({
      success: function (res) {
        // console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting["scope.writePhotosAlbum"]) {
          _this.setData({
            openset: false,
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    });
    if (this.data.openset) {
      wx.openSetting({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
    if (this.data.btnloading) {
      return;
    }
    this.setData({
      btnloading: true,
    });

    wx.getSetting({
      success(res) {
        // console.log(res.authSetting["scope.writePhotosAlbum"]);
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.canvasToTempFilePath(
                {
                  canvasId: "myQrcode",
                  success: (res) => {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: (res) => {
                        // console.log(res);
                        _this.setData({
                          show1: false,
                          btnloading: false,
                        });
                      },
                      fail: (err) => {
                        _this.setData({
                          btnloading: false,
                        });
                      },
                    });
                  },
                  fail: (err) => {
                    wx.openSetting();
                    _this.setData({
                      btnloading: false,
                    });
                  },
                },
                this
              );
            },
            fail: (err) => {
              _this.setData({
                btnloading: false,
                openset: true,
              });
              // console.log("我进来额");
              wx.openSetting();
            },
          });
        } else {
          wx.canvasToTempFilePath(
            {
              canvasId: "myQrcode",
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (res) => {
                    // console.log(res);
                    _this.setData({
                      show1: false,
                      btnloading: false,
                    });
                  },
                  fail: (err) => {
                    _this.setData({
                      btnloading: false,
                    });
                  },
                });
              },
              fail: (err) => {
                _this.setData({
                  btnloading: false,
                });
              },
            },
            this
          );
        }
      },
    });
  },

  getGoodlist: function()
  {
     var that = this;
     wx.request({
      url: app.data.hostAjax + '/api/user/v1/getpingtaiallgoodslist', 
      data: {
        id: wx.getStorageSync("userIdBuyGood"),
        orderby: '0',
        search: '',
        pageindex: that.data.curentinx,
        pagesize: '20',
        goodtype: that.data.seleArr[that.data.seleinx].id,
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res)
        console.log('商品类型1')
        if(res.data.Code==1000){
          wx.showToast({
            title: "暂无数据",
            icon: "none",
          });
        }

        wx.hideNavigationBarLoading() //完成停止加载

        wx.stopPullDownRefresh() 

        if(res.data.Data.list)
        {
          that.setData({
            newgoodsarr: that.data.newgoodsarr.concat(res.data.Data.list)
         });
        }
        else{
          that.setData({
            newgoodsarr: []
         });
        }
        
      }
    })
  },

  topaction: function(e){
    var that = this;
    var indexs = parseInt(e.currentTarget.dataset.index);
    that.setData({
      seleinx:indexs,
    });
    that.setData({
      newgoodsarr: []
    });
    that.getGoodlist();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this;

    //计算宽度
    var screnw = wx.getSystemInfoSync().windowWidth;
    console.log('屏幕宽度'+screnw);
    var itemw = (375*2 - 90)/2;
    _this.setData({
      view:{
        Width:itemw,
        Height: itemw+110,
      }
  
    })

    wx.request({
      url: app.data.hostAjax + '/api/user/v1/selectgoodstype', // 获取店铺信息
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res)
        console.log('商品类型')
        _this.setData({
          seleArr: res.data.Data
        });
        //获取商品数据
        _this.getGoodlist();
      }
    })

 


    var goodsId = JSON.stringify(options);
    if (goodsId != "{}") {
      //此时是从分享页面进来的?useridsaleman=0&shopid=0&shareid=0
      if (decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("salemanshopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].split("&")[0])
      } else {
        wx.setStorageSync("salemanshopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1])
      }
      if (decodeURIComponent(options.q).indexOf("shareid") > 0) {
        if (decodeURIComponent(options.q).split("?")[1].split("shareid=")[1].indexOf("&") >= 0) {
          _this.setData({
            shareid: decodeURIComponent(options.q).split("?")[1].split("shareid=")[1].split("&")[0]
          })
        } else {
          _this.setData({
            shareid: decodeURIComponent(options.q).split("?")[1].split("shareid=")[1]
          })
        }
        // wx.setStorageSync("saoma", true)//后期去掉了自提和地址的限制
      }
      if (decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].split("&")[0])
        //为了跟appjs的uid冲突，制作一个顶级的分享人的uid--但是顶级分享人会一直保留

      } else {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1])
      }
    }
    //如果不是客戶，進來
    wx.hideShareMenu({
      success: function () {
        console.log("禁止了分享按钮的现实！")
      }
    })

    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 68 : app.data.windowHeight - 51
    })
    //调取banner的接口
    util.request(app.data.hostAjax + '/api/other/v1/banner', {
      t: 0
    }).then(function (res) {
      console.log(res)
      if (res.Code == "0") {
        _this.setData({
          bannerList: res.Data
        })
      } else {
        _this.setData({
          bannerList: []
        })
      }
    });






  },
  imageLoad(e) {
    // console.log(e)
    this.setData({
      bannerHeight: e.detail.height
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    console.log(111)
    let _this = this;
    _this.setData({
      usertype: wx.getStorageSync("usertype")
    })

    //首先登录，获取用户的类型，判断是不是客户
    if (wx.getStorageSync("openid") == "") {
      console.log("我进来了.,此时是页面加载早了，而微信appjs还没加载--导致openid为undefined")
      //此时是页面加载早了，而微信appjs还没加载--导致openid为undefined
      app.readyCallback = (hostAjax) => {
        wx.request({
          url: hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
          data: {
            openid: wx.getStorageSync("openid"),
            fxuserid: _this.data.shareid || 0
          },
          method: "get",
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            console.log(res)
            console.log(res.data.Data.usertype)
            if (res.data.Success) {
              wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
              wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
              _this.setData({
                usertype: parseInt(res.data.Data.usertype)
              })
              //在这里判断被分享人扫码进来的时候
              if (parseInt(res.data.Data.isticket) == 0) {//分享人进来时--未读消息时
                //弹出优惠券的框
                console.log("弹出优惠券的框");
                _this.setData({
                  modalshow: true
                })
              } else if (_this.data.shareid && parseInt(res.data.Data.isnewuser) == 1 && parseInt(res.data.Data.isticket) == 0) {////在这里判断被分享人扫码进来的时候 
                //弹出优惠券的框
                console.log("弹出优惠券的框");
                _this.setData({
                  modalshow: true
                })
              }
              if (_this.data.shareid) {
                //绑定专属顾问--扫码进来
                util.request(app.data.hostAjax + '/api/dester/v1/addmyadviser', { userid: res.data.Data.user_id, salapersonid: wx.getStorageSync("useridsaleman") }).then(function (res) {
                  if (res.Code == "200") {

                  }
                });
              }
              if (res.data.Data.usertype == 1) {
                //1为普通用户 2为经销商 3为店长 4为分销员
                //1--隐藏底部导航
                _this.setData({
                  hideBotom: false,
                  personUrl: "/pages/person/person"
                })
              } else {
                if (res.data.Data.usertype == 8) {//超管登录
                  wx.reLaunch({
                    url: '/pages/administrator/index/person',
                  })
                  return
                }
                wx.getUserInfo({
                  success: (data) => {
                    //更新data中的userInfo
                    app.globalData.userInfo = data.userInfo
                    app.login();
                    _this.setData({
                      hideBotom: true,
                      personUrl: "/pages/home/home"
                    })
                  },
                  fail: () => {
                    console.log("还没有授权登录！")
                    _this.setData({
                      hideBotom: false,
                      personUrl: "/pages/person/person"
                    })
                  }
                })

              }
            }
          }

        })
      }
      return false;

    }
    console.log("我没进来", wx.getStorageSync("openid") == "")
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
      data: {
        openid: wx.getStorageSync("openid"),
        fxuserid: _this.data.shareid || 0
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        _this.setData({
          loading: true
        })
        if (res.data.Success) {
          wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
          wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
          //在这里判断被分享人扫码进来的时候
          if (parseInt(res.data.Data.isticket) == 0) {//分享人进来时--未读消息时
            //弹出优惠券的框
            console.log("弹出优惠券的框");
            _this.setData({
              modalshow: true
            })
          } else if (_this.data.shareid && parseInt(res.data.Data.isnewuser) == 1 && parseInt(res.data.Data.isticket) == 0) {////在这里判断被分享人扫码进来的时候 
            //弹出优惠券的框
            console.log("弹出优惠券的框");
            _this.setData({
              modalshow: true
            })
          }
          if (_this.data.shareid) {
            //绑定专属顾问--扫码进来
            util.request(app.data.hostAjax + '/api/dester/v1/addmyadviser', { userid: res.data.Data.user_id, salapersonid: wx.getStorageSync("useridsaleman") }).then(function (res) {
              if (res.Code == "200") {

              }
            });
          }
          if (res.data.Data.usertype == 1) {
            //1为普通用户 2为经销商 3为店长 4为分销员
            //1--隐藏底部导航
            _this.setData({
              hideBotom: false,
              personUrl: "/pages/person/person"
            })
          } else {
            // if (wx.getStorageSync("usertype") == 8) {//超管登录
            //   wx.reLaunch({
            //     url: '/pages/administrator/index/person',
            //   })
            //   return
            // }

            wx.getUserInfo({
              success: (data) => {
                //更新data中的userInfo
                app.globalData.userInfo = data.userInfo
                app.login();
                _this.setData({
                  hideBotom: true,
                  personUrl: "/pages/home/home"
                })
              },
              fail: () => {
                console.log("还没有授权登录！")
                _this.setData({
                  hideBotom: false,
                  personUrl: "/pages/person/person"
                })
              }
            })
          }
        } else {

        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading()
    this.setData({
      show: false,
    })
  },

  onChange(event) {
    // console.warn(`change: ${event.detail}`);
    this.setData({
      value1: event.detail[0]
    })
  },
  onSearch(e) {
    this.setData({
      // ajaxData:[],
      hideLoading: true,
      goodsValue: e.detail
    })
    this.onLoad({});
  },
  onCancel() {//取消搜索搜索时触发
    this.setData({
      // ajaxData: [],
      hideLoading: true,
      goodsValue: ""
    })
    this.onLoad({});
  },

  onPullDownRefresh: function () {

    var that = this;

    that.setData({
      newgoodsarr: [],
      curentinx: 1,
    });
    that.getGoodlist();

    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载

    // setTimeout(function () {

    //   wx.hideNavigationBarLoading() //完成停止加载

    //   wx.stopPullDownRefresh() //停止下拉刷新

    // }, 1500);
  },
  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      // console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        curentinx: this.data.curentinx + 1
      })
      this.getGoodlist();
    }

  },
  onGotUserInfo: function (e) {//点击下一步
    wx.showLoading({
      title: '稍等',
    })
    if (this.data.acticeInxex != null) {
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData=' + JSON.stringify({
          id: this.data.firstId,//商品id
          title: this.data.ajaxGood.englishname + this.data.ajaxGood.name,//标题
          desc: this.data.ajaxGood.synopsis,//描述
          img: this.data.ajaxGood.smallimg,
          price: this.data.ajaxGood.e_price,//单价
          num: this.data.value1,//数量
          taste: this.data.ajaxGood.tastename[this.data.acticeInxex].names,//口味名字
          tasteId: this.data.ajaxGood.tastename[this.data.acticeInxex].id,//口味id
          totle: this.data.value1 * this.data.ajaxGood.e_price * 100,//总金额=数量乘以单价==单位是分
        }),
      })
    } else {
      //提示选择口味
      wx.showToast({
        title: '请选择口味',
        icon: "none"
      })
      if (this.data.show) {
        return false
      }
      this.setData({ show: !this.data.show });
    }
  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  showBottomBuy(e) {
    let _this = this;
    //初始化弹框的信息，先判断商品是否与上次点击不同
    if (e.currentTarget.dataset.id != this.data.firstId) {
      _this.setData({
        value1: 1,
        acticeInxex: null
      })
    }
    this.setData({
      firstId: e.currentTarget.dataset.id
    })
    //调取详情 接口--id--e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getgoodsdetail', // 获取商品详情
      data: {
        goods_id: e.currentTarget.dataset.id
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        wx.hideLoading();//关闭加载按钮--弹出口味选择--下一步点击下一步
        _this.onClose();
        if (res.data.Success) {
          // console.log(res.data);
          _this.setData({
            ajaxGood: res.data.Data
          })
        }
      }
    })

  },
  hideModal(e) {//增加了优惠券分享的弹框
    this.setData({
      modalshow: !this.data.modalshow
    })
  },
})