//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabs: ["干锅", "烤串", "进店必点"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: "",
    imgUrls: [
      '../../static/img/timg.jpg',
      '../../static/img/fish.jpg',
      '../../static/img/xiaolongxia.jpg'
    ],
    menu: {},//全部菜单
    orderMenu: [],//已点菜单
    totalNum: 0,
    totalPrice: 0,
    showDialog: true
  },
  getData() {
    let that = this
    wx.request({
      url: 'http://localhost:3000/123',
      data: {
        index: this.data.activeIndex
      },
      success: function (res) {
        that.setData({
          menu: res.data
        })
      }
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  cutNum: function (e) {
    let i = e.currentTarget.dataset.index
    // if (this.data.menu[activeIndex].num === 0) return
    let num = "menu." + this.data.activeIndex + "["+ i + "]" + ".num"
    this.setData({
      [num]: this.data.menu[this.data.activeIndex][i].num -1,
      totalNum: this.data.totalNum - 1,
      totalPrice: this.data.totalPrice - this.data.menu[this.data.activeIndex][i].price
    })
  },
  addNum (e) {
    let i = e.currentTarget.dataset.index
    console.log(this.data.menu[this.data.activeIndex][i].price)
    // if (this.data.menu[activeIndex].num === 0) return
    let num = "menu." + this.data.activeIndex + "[" + i + "]" + ".num"
    this.setData({
      [num]: this.data.menu[this.data.activeIndex][i].num + 1,
      totalNum: this.data.totalNum + 1,
      totalPrice: this.data.totalPrice + this.data.menu[this.data.activeIndex][i].price
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getData()
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log()
        that.setData({
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / that.data.tabs.length) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  orderMenuHandle () {
    let m = []
    for (let k in this.data.menu) {
      let item = this.data.menu[k]
      item.map((_item, _index) => {
        if (_item.num !== 0) {
          m.push(_item)
        }
      })
    }
    return m
  },
  showOrderMenu: function () {
    let m = this.orderMenuHandle()
    if (m.length === 0) return
    this.setData({
      // showDialog: false,
      orderMenu: m
    })
    console.log(this.data.orderMenu)
  },
  closeDialog: function () {
    this.setData({
      showDialog: true
    })
  },
  postData: function () {
    let m = this.orderMenuHandle()
    wx.request({
      url: 'http://localhost:3000/postOrderMenu',
      method: 'POST',
      data: {
        menu: m
      }
    })
  }
})
