// pages/bindingshop/bindingshop.js
import config from '../../config'
import Toast from '../../dist/toast/toast';
const app = getApp()
Page({
  data: {
    bindingImage: [
      "http://www.yqcoffee.cn/image/dianpu.png",
      "http://www.yqcoffee.cn/image/dizhi.png",
      "http://www.yqcoffee.cn/image/phone.png",
      "http://www.yqcoffee.cn/image/yanzheng.png"
    ],
    distributorid: 26,
    submitTimeNum: 0,
    times: null,
    submitTime: 60,
    phone: '',
    name: '',
    code: '',
    address: '',
    isLogin: false,
    uid: 151,
    userInfoName: "",
    userInfoImg: "",
    state: 1,
    ifskip: false,
    ifclick: false,
  },
  // 登录
  login: function () {
    wx.login({
      success: (res) => {
        console.log(res)
        wx.request({
          url: config.apiHost + '/api/weixin/v1/jscode2session',
          data: {
            response_type: res.code,
          },
          method: "GET",
          success: (res) => {
            let ress = JSON.parse(res.data.Data)
            let openid = JSON.parse(res.data.Data).openid
            // console.log(res.data)
            //获取用户的openid 
            console.log("用户的openid" + openid)
            app.globalData.openid = openid
            wx.request({
              url: config.apiHost + '/api/user/v1/wxloginopenid',
              data: {
                openid: openid,
                imgurl: app.globalData.userInfo.avatarUrl,
                nickname: app.globalData.userInfo.nickName
              },
              success: (ress) => {
                console.log(ress)
                let usertype = ress.data.Data.usertype
                app.globalData.usertype = ress.data.Data.usertype
                app.globalData.user_id = ress.data.Data.user_id
                app.globalData.token = ress.data.Data.token
                if (parseInt(usertype) != 1) {
                  wx.navigateTo({
                    url: '/pages/goods/index/index',
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  // 绑定手机号
  bindingPhone: function () {
    app.checkauthorization(() => {


      //禁止连续点击
      if (this.data.ifclick) {
        return
      }
      this.setData({
        ifclick: true
      })
      let _this = this;
      console.log('开始绑定', app.globalData.openid)

      if (this.data.address.length == 0) {
        if (this.data.phone.length > 0) {
          if (this.data.code.length > 0) {

            wx.request({
              url: config.apiHost + '/api/user/v1/addshopowner_manager',
              method: "POST",
              data: {
                distributorid: this.data.distributorid,//经销商id
                phone: this.data.phone,
                code: this.data.code,
                shopname: this.data.name,
                openid: wx.getStorageSync("openid"),
                Address: this.data.address,
                state: this.data.state
              },
              success: (res) => {
                console.log(res)
                if (res.data.Msg == '操作成功') {
                  wx.showToast({
                    title: '您的申请已提交，请等待校长审核',
                    icon: 'none',
                  })
                  wx.setStorageSync("usertype", 3);
                  try {
                    wx.setStorageSync("userid", res.data.Data.user_id);
                    app.globalData.user_id = res.data.Data.user_id
                  } catch (e) {

                  }
                  _this.setData({
                    ifskip: true,
                  })
                  // setTimeout(()=>{
                  //   wx.redirectTo({
                  //     url: '/pages/home/home',
                  //   })
                  // },1500)
                } else {
                  _this.setData({
                    ifclick: false
                  })
                  wx.showToast({
                    title: res.data.Msg,
                    icon: 'none',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '请填写验证码！',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请填写手机号！',
            icon: 'none'
          })
        }
      }
      // else {
      //   wx.showToast({
      //     title: '请填写店铺地址！',
      //     icon: 'none'
      //   })
      // }  

    })
  },
  // 发送验证码
  sumbitCode: function () {
    var phone = this.data.phone
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
    if (phone.length == 11) {
      wx.request({
        url: config.apiHost + '/api/user/v1/sms',
        method: "POST",
        data: {
          type: 5,
          account: phone
        },
        success: (res) => {
          console.log(res)
          if (res.data.Msg == '发送成功') {
            wx.showToast({
              title: '验证码已发送',
              icon: 'none'
            })
            this.setData({
              codeSubmit: true,
              submitTimeNum: this.data.submitTimeNum + 1
            }, () => {
              clearInterval(this.data.times)
              this.data.times = setInterval(() => {
                this.setData({
                  submitTime: this.data.submitTime - 1
                }, () => {
                  if (this.data.submitTime == 0) {
                    clearInterval(this.data.times)
                    this.setData({
                      codeSubmit: false,
                      submitTime: 60,
                    })
                  }
                })
              }, 1000)
            })
          } else {
            wx.showToast({
              title: res.data.Msg,
              icon: 'none'
            })
          }

        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  // 输入框
  changeInput: function (e) {
    console.log(e)
    var types = e.currentTarget.dataset.types
    switch (types) {
      case 'name':
        this.setData({
          // name: e.detail.value
        })
        break;
      case 'address':
        this.setData({
          address: e.detail.value
        })
        break;
      case 'phone':
        this.setData({
          phone: e.detail.value
        })
        break;
      case 'code':
        this.setData({
          code: e.detail.value
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   
   

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