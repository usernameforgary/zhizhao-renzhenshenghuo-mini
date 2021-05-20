import config from "../../../config";
const util = require("../../../utils/util.js");
import Toast from "../../../dist/toast/toast";
import drawQrcode from "../../../utils/weapp.qrcode.esm.js";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneValue: "", //input框中的手机号码
    modalshow: false, //优惠券的弹框-可以领取--当有优惠券的时候提示--分享人进来的时候判断是否分享成功
    shareid: "", //分享人的id
    isLogin: false,
    windowHeight: null, //可用窗口的高度
    value1: 1, //购买数量

    true: true,
    goodsValue: "",
    ajaxData: null,
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    show: false, //选择口味的弹出层
    show1: false, //保存图片的弹出层
    goodsid: 0,
    phone: "", //手机号
    codeSubmit: false, //验证码
    submitTimeNum: 0,
    times: null,
    submitTime: 60,
    statusType: ["课程详情", "往期精彩", "评价"],
    currentType: 0,
    name: "",
    ma: false,
    ordId: "", //课程详情ID
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 0,
    // allcurrent:3,
    circular: true,
    // goodsnum:0,
    // tastArr:[],
    // tasteId:null,//口味id
    acticeInxex: null, //口味的顺序index值0开始
    widthCord: (195 / 750) * wx.getSystemInfoSync().windowWidth, //二维码的px值（转换之后的）
    // productName:"SNOW＋橘子汽水",
    loading: false, //保存按钮的加载动画
    openset: false, //打开设置的判断
    // hideBotom: true,//此时为了隐藏分享按钮，当时普通用户的时候
    buyType: 2, //1为加入购物车，2为购买
    goodLength: "",
    shortvideo: "",
    pzlist: [], // 评论列表

    useridsaleman: '', //分享二维码的用户id
    shopid: '',
  },
  // 复制
  copy: function (e) {
    console.log(e)
    var code = e.currentTarget.dataset.copy;
    this.setData({
      value: e.currentTarget.dataset.copy,
    });
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',

        });
      },
      fail: function (res) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
        });
      }
    })
  },

  statusTap: function (e) {
    const curType = e.currentTarget ? e.currentTarget.dataset.index : e;
    this.setData({
      currentType: curType,
    });
  },
  changeIndex(e) {
    console.log(e);
    this.setData({
      acticeInxex: e.currentTarget.dataset.index,
    });
    // this.//设置传递到递交订单页的口味
  },
  changeSwiper(e) {
    this.setData({
      current: e.detail.current,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
      // console.log("r = " + r)
      // console.log("r[2] = " + r[2])
      return r[2]
    }
    return null;
  },
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/home/home'
    // })
    console.log(options)
    let _this = this;
    var goodsId = options.id;

    var netstr = decodeURIComponent(options.q);
    console.log('————————————————' + netstr);
    if (netstr.length > 10) {
      var searchParams = _this.getQueryString(netstr, 'goodsid');
      console.log('12333456' + searchParams);
      goodsId = searchParams;
      _this.setData({
        useridsaleman: _this.getQueryString(netstr, 'useridsaleman'),
        shopid: _this.getQueryString(netstr, 'shopid')
      });

    }
    else {
      //不是扫码
      _this.setData({
        useridsaleman: wx.getStorageSync("useridsaleman"),
        shopid: wx.getStorageSync("shopid")
      });
    }


    //下面是调取详情接口--展示商品信息
    wx.request({
      url: app.data.hostAjax + "/api/user/v1/getgoodsdetail", // 获取商品详情
      data: {
        goods_id: goodsId,
      },
      method: "get",
      header: {
        "content-type": "application/json",
      },
      success(res) {
        console.log(res);
        if (res.data.Success) {
          console.log(res.data);
          // console.log(res.datFid);
          _this.setData({
            ajaxData: res.data.Data,
            ordId: res.data.Data.id,

          });
          _this.drawImg(goodsId);
        } else {
          wx.showToast({
            title: "数据信息展示失败",
            icon: "none",
            duration: 2000,
          });
        }
      },
    });

    //下面就是画图--分享商品图
    // wx.hideShareMenu({
    //   success: function () {
    //     // console.log("禁止了分享按钮的现实！");
    //   },
    // });


  },
  drawImg(goodsId) {

    let _this = this;
    //禁止页面分享
    var w = (451 / 750) * wx.getSystemInfoSync().windowWidth;
    var h = (753 / 750) * wx.getSystemInfoSync().windowWidth;
    var a = (43 / 750) * wx.getSystemInfoSync().windowWidth;
    var b = (625 / 750) * wx.getSystemInfoSync().windowWidth;
    var c = (45 / 750) * wx.getSystemInfoSync().windowWidth;
    var d = (360 / 750) * wx.getSystemInfoSync().windowWidth;
    var e = (45 / 750) * wx.getSystemInfoSync().windowWidth;
    var f = (443 / 750) * wx.getSystemInfoSync().windowWidth;
    var ss = (22 / 750) * wx.getSystemInfoSync().windowWidth;
    var s = (30 / 750) * wx.getSystemInfoSync().windowWidth;
    const ctx = wx.createCanvasContext("myQrcode");
    //画板的背景
    var shareImg = _this.data.ajaxData.imgurl
      .split("|")[0]
      .replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
    // console.log(shareImg);
    ctx.setFillStyle("white");
    ctx.fillRect(0, 0, w, h);
    ctx.setFillStyle("#000");
    //加入图片到canvas中
    var imgUrl;
    if (wx.getStorageSync("usertype") == 1) {

      imgUrl =
        "https://renzhenshenghuo.cn/good/detail/?goodsid=" +
        goodsId +
        "&shareid=" +
        wx.getStorageSync("userIdBuyGood");
    } else {

      imgUrl =
        "https://renzhenshenghuo.cn/good/detail/?useridsaleman=" +
        wx.getStorageSync("userIdBuyGood") +
        "&goodsid=" +
        goodsId +
        "&shopid=" +
        wx.getStorageSync("shopid") +
        "&shareid=" +
        wx.getStorageSync("userIdBuyGood");
    }

    console.log(imgUrl);
    wx.downloadFile({
      url: shareImg,
      success: (res) => {
        shareImg = res.tempFilePath;
        ctx.drawImage(
          shareImg,
          c,
          (38 / 750) * wx.getSystemInfoSync().windowWidth,
          d,
          d
        );
        //加入商品名字到canvas中
        ctx.setFontSize(s);
        if (_this.data.ajaxData.name.length > 11) {
          var str = _this.data.ajaxData.name.substr(0, 11);
          ctx.fillText(str + "...", e, f);
        } else {
          ctx.fillText(_this.data.ajaxData.name, e, f);
        }

        //加入价钱到canvas中
        ctx.setFontSize(ss);
        ctx.fillText("￥", a, b);
        ctx.setFontSize(s);
        ctx.fillText(parseFloat(_this.data.ajaxData.e_price).toFixed(2), a + 15, b);
        // 绘制图片到canvas中
        drawQrcode({
          x: (211 / 750) * wx.getSystemInfoSync().windowWidth,
          y: (479 / 750) * wx.getSystemInfoSync().windowWidth,
          width: _this.data.widthCord,
          height: _this.data.widthCord,
          canvasId: "myQrcode",
          ctx: ctx,
          text: imgUrl,
        });
      },
    });
  },
  previewImage: function (e) {
    console.log(e);
    var current = e.target.dataset.src;
    var index = e.target.dataset.index;
    console.log(this.data.pzlist[index]);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.pzlist[index].imgurl, // 需要预览的图片http链接列表
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
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true,
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
                          loading: false,
                        });
                      },
                      fail: (err) => {
                        _this.setData({
                          loading: false,
                        });
                      },
                    });
                  },
                  fail: (err) => {
                    wx.openSetting();
                    _this.setData({
                      loading: false,
                    });
                  },
                },
                this
              );
            },
            fail: (err) => {
              _this.setData({
                loading: false,
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
                      loading: false,
                    });
                  },
                  fail: (err) => {
                    _this.setData({
                      loading: false,
                    });
                  },
                });
              },
              fail: (err) => {
                _this.setData({
                  loading: false,
                });
              },
            },
            this
          );
        }
      },
    });
  },
  onShow: function () {
    this.getInfo();
    this.setData({
      autoplay: true,
    });
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
  },
  onHide: function () {
    this.setData({
      show: false,
      autoplay: false,
      acticeInxex: 0,
    });
  },
  onChange(event) {
    // console.warn(`change: ${event.detail[0]}`);
    // console.log(event.detail[0]);
    this.setData({
      value1: event.detail[0],
    });
  },
  onSearch(e) {
    // console.log(e.detail);
  },
  onPullDownRefresh: function () {
    wx.setBackgroundTextStyle({
      textStyle: "dark", // 下拉背景字体、loading 图的样式为dark
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载

    setTimeout(function () {
      wx.hideNavigationBarLoading(); //完成停止加载

      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1500);
  },
  scrolltolower() {
    if (this.data.loading) {
      let _this = this;
      this.setData({
        loading: false,
      });
      setTimeout(function () {
        _this.setData({
          loading: true,
        });
      }, 1000);
      // console.log("在我这里调取加载数据");
    }
  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  togglePopup() {
    console.log(1)
    app.checkauthorization(() => {
      this.setData({ show1: !this.data.show1 });
    });
  },
  onGotUserInfo: function (e) {
  console.log(e)
    console.log('跳转参数' + e.currentTarget.dataset.url);

    app.checkauthorization(() => {
      if (e.currentTarget.dataset.url) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        });
        return;
      }
      this.setData({
        buyType: e.currentTarget.dataset.index,
      });
      this.onClickButton();
    });
  },

  // 发送验证码
  sumbitCode: function () {
    var phone = this.data.phone;
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (phone.length == 11 && myreg.test(phone)) {
      wx.request({
        url: config.apiHost + "/api/user/v1/sms",
        method: "POST",
        data: {
          type: 5,
          account: phone,
        },
        success: (res) => {
          // console.log(res);
          if (res.data.Msg == "发送成功") {
            wx.showToast({
              title: "验证码已发送",
              icon: "none",
            });
            this.setData(
              {
                codeSubmit: true,
                submitTimeNum: this.data.submitTimeNum + 1,
              },
              () => {
                clearInterval(this.data.times);
                this.data.times = setInterval(() => {
                  this.setData(
                    {
                      submitTime: this.data.submitTime - 1,
                    },
                    () => {
                      if (this.data.submitTime == 0) {
                        clearInterval(this.data.times);
                        this.setData({
                          codeSubmit: false,
                          submitTime: 60,
                        });
                      }
                    }
                  );
                }, 1000);
              }
            );
          } else {
            wx.showToast({
              title: res.data.Msg,
              icon: "none",
            });
          }
        },
      });
    } else {
      wx.showToast({
        title: "请输入正确的手机号码！",
        icon: "none",
      });
    }
  },

  // 输入框
  changeInput: function (e) {
    var aa = wx.getStorageSync("userIdBuyGood");
    let _this = this;
    // console.log(e);
    var types = e.currentTarget.dataset.types;
    if (types == "phone") {
      this.setData({
        phone: e.detail.value,
      });
      // console.log(_this.data.phone);
    } else if (types == "code") {
      this.setData({
        code: e.detail.value,
      });
      // console.log(_this.data.code);
    }

    wx.request({
      url: app.data.hostAjax + "/api/user/v1/bindphone", // 判断用户是否绑定过手机号
      data: {
        userid: aa,
        phone: _this.data.phone,
        code: _this.data.code,
      },
      method: "get",
      header: {
        "content-type": "application/json",
      },
      success(res) {
        // console.log(res);
      },
    });
  },

  onClickButton() { //立即购买

    let _this = this;
    //判断口味是否选择
    console.log("口味：", _this.data.acticeInxex)
    console.log(this.data.value1 * this.data.ajaxData.e_price)
    if (this.data.acticeInxex != null ) {
     
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData=' + JSON.stringify({
          shopid: this.data.shopid,//商品分享人
          useridsaleman: this.data.useridsaleman,//商品分享人
          id: this.data.ajaxData.id, //商品id
          title: this.data.ajaxData.englishname + this.data.ajaxData.name, //标题
          desc: this.data.ajaxData.synopsis, //描述
          img: this.data.ajaxData.smallimg,
          price: this.data.ajaxData.e_price, //单价
          num: this.data.value1, //数量
          taste: this.data.acticeInxex.names, //口味名字
          tasteId: this.data.acticeInxex || 0, //口味id
          totle: this.data.value1 * this.data.ajaxData.e_price * 100, //总金额=数量乘以单价==单位是分
        }),
      })
    } else {
      //提示选择口味
      wx.showToast({
        title: '请商品类型',
        icon: "none"
      })
      if (this.data.show) {
        return false
      }
      this.setData({
        show: !this.data.show
      });
    }

  },
  hideModal(e) {
    //增加了优惠券分享的弹框
    this.setData({
      modalshow: !this.data.modalshow,
    });
  },
  getInfo: function () {
    let _this = this;
    wx.getUserInfo({
      success: (data) => {
        // console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo;
        app.login(1, function () {
          _this.setData({
            isLogin: false,
          });
          //首先登录，获取用户的类型，判断是不是客户--储存购买用户的id
          wx.request({
            url: app.data.hostAjax + "/api/user/v1/wxloginopenid", // 微信openid登录
            data: {
              openid: wx.getStorageSync("openid"),
              fxuserid: _this.data.shareid || 0,
            },
            method: "get",
            header: {
              "content-type": "application/json",
            },
            success(res) {
              // console.log(res);
              if (res.data.Success) {
                wx.setStorageSync("userIdBuyGood", res.data.Data.user_id); //储存购买用户的id用来调取支付

                console.log('123214124312' + _this.data.goodsid);

                // _this.drawImg(_this.data.goodsid);
                if (res.data.Data.usertype == 1) {
                  //1为普通用户 2为经销商 3为课程顾问 4为推广大使
                  //1--隐藏底部导航
                } else {
                  //，，专门为扫码进来的分销商、课程顾问、推广大使、制作分享页--帮助分享
                }
                // console.log("商品详情中的购买人id", res.data.Data.user_id);
                //在这里判断被分享人扫码进来的时候
                if (
                  _this.data.shareid &&
                  parseInt(res.data.Data.isnewuser) == 1 &&
                  parseInt(res.data.Data.isticket) == 0
                ) {
                  //新用户
                  //弹出优惠券的框pa
                  // console.log("弹出优惠券的框");
                  _this.setData({
                    modalshow: true,
                  });
                }
                if (_this.data.shareid) {
                  //绑定专属顾问--扫码进来
                  util
                    .request(
                      app.data.hostAjax + "/api/dester/v1/addmyadviser",
                      {
                        userid: res.data.Data.user_id,
                        salapersonid: wx.getStorageSync("useridsaleman"),
                      }
                    )
                    .then(function (res) {
                      console.log(res)
                      if (res.Code == "200") {
                      }
                    });
                }


              }
            },
          });
        });
      },
      fail: () => {
        this.setData({
          isLogin: true,
        });
      },
    });
  },
});
