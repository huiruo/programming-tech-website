<template>
  <div class="container">
    <!-- list 1 -->
    <div class="coupon-container" v-for="item in couponList" :key='item.id'>
      <div class="top-content"><span class="title">单品券</span><span class="time">领券时间：2019年1月18日-2020年1月20日</span></div>
      <div class="inner-padding">
        <div class="coupon-content">
          <div class="coupon-main">
            <div class="left-img">
              <!-- fill:pink;fill-opacity:0.3; -->
              <svg style="width:200px;height:100px;" class='svg-class'>
                <!-- stroke="black" -->
                <reac x="10" y="10" width="100" height="100" fill="blue" stroke-weight="5" />
                <!-- <text x="8" y="60" style="" class="money">10</text> -->
                <!-- <text x="60" y="60" style="fill:#fff;">元</text> -->
                <!-- dx,dy 是相对（x，y）评议的大小。 经过平移，文字起始位置（x+dx, y+dy） -->
                <text x="8" y="60">
                  <tspan class="money">10</tspan>
                  <tspan style="fill:#fff;">元</tspan>
                  <tspan dy="24" dx="-60" style="fill:#fff;">满{{item.totalAmount}}元使用</tspan>
                </text>
                <!-- <text x="8" y="80" style="fill:#fff;">满{{item.totalAmount}}元使用</text> -->
                <!-- 5 -->
                <line x1="100" y1="80" x2="100" y2="20" style="stroke: #fff; stroke-width:2; stroke-dasharray:5 10;"></line>
                <text transform="translate(120,30)rotate(90)" style="fill:#fff;">TICKET</text>
                <!-- stroke="black" transform="translate(100,100)rotate(90)" -->
                <circle style='fill:#fff;' cx="100" cy="0" r="10" class="circle" stroke-width="1" fill="#fff" />
                <circle cx="100" cy="100" r="10" class="circle" stroke-width="1" fill="#fff" />
              </svg>
            </div>
            <div class="right-content">
              <p class="name">提货券名称超过一行很长的1很长的2很长的3很长的4很长的5</p>
              <p class="time">有效期</p>
              <p class="time">2019年1月20日-2020年1月20日</p>
              <p class="desc-normal">正常价格、秒杀、套餐均可用</p>
              <p class="desc-appoint desc-normal"><a>彩电-L65P2可使用</a></p>
            </div>
          </div>
        </div>
        <div class="progress-content">
          <!-- <div class="up-centent" :style="{left:'40%'}"> -->
          <!-- 50->40 -->
          <div class="up-centent" :style="{left:(item.rate-10)+'%'}">
            已经领取{{item.rate}}%
          </div>
          <div class="progress-rate-content">
            <div class="progress-rate" :style="{width:item.rate+'%'}">
            </div>
          </div>
          <!-- <div class="up2" :style="{left:'48%'}"></div> -->
          <!-- 50->48 -->
          <div class="up2" :style="{left:(item.rate-2)+'%'}"></div>
        </div>
        <hr class="line" />
        <div class="get-content">
          <div>每人限领2张</div>
          <div class="get-button">
            <van-button class="button-user" size="normal" :disabled=true>已领取</van-button>
            <van-button plain type="danger">领取</van-button>
          </div>
        </div>
      </div>
    </div>
    <!-- list 1 end -->
  </div>
</template>
<script>
export default {
  name: 'CouponCenter',
  data() {
    return {
      couponList: [
        {
          id: '1',
          rate: '40',
          totalAmount: '300'
        },
        {
          id: '2',
          rate: '60',
          totalAmount: '500'
        },
        {
          id: '3',
          rate: '90',
          totalAmount: '600'
        }
      ]
    }
  },
  methods: {},
  computed: {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.container {
  background: rgb(247, 247, 247);
  min-height: calc(100vh - 148px - 83.48px);
  overflow: auto;
  .top-content {
    padding: 15px 0;
    .title {
      padding: 0 15px;
      font-family: PingFangSC-Semibold;
      font-weight: bold;
      font-size: 28px;
      color: #222222;
    }
    .time {
      font-size: 24px;
      color: #bfbfbf;
      // color: rgb(192, 192, 192);
    }
  }
  .coupon-container {
    margin: 20px 20px;
    // 外层start
    .inner-padding {
      border-radius: 20px;
      padding: 18px;
      background: rgb(255, 255, 255);
    }
    // 外层end
    .coupon-content {
      .coupon-main {
        display: flex;
        .left-img {
          width: 40%;
          padding-left: 12px;
          // background: grey;
          .svg-class {
            border: 0px solid #fff;
            background-image: linear-gradient(180deg, #ff8688 0%, #ff4e50 100%);
            // background: hotpink;
            .money {
              fill: #fff;
              font-size: 80px;
              font-weight: bold;
            }
            .circle {
              z-index: 999;
              // background: hotpink;
            }
          }
        }
        .right-content {
          width: 60%;
          // background: #f3ebeb;
          .name {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            font-weight: bold;
            font-size: 32px;
            color: #404040;
            padding-bottom: 15px;
          }
          .time {
            font-size: 26px;
            color: #404040;
          }
          .desc-normal {
            padding-top: 15px;
            font-size: 10px;
            color: #919191;
          }
          .desc-appoint {
            a {
              text-decoration: underline;
            }
            a:visited {
              color: #919191;
            }
            a:hover {
              // color: red;
              color: #919191;
            }
            a:active {
              color: #919191;
            }
          }
        }
      }
    }
    .progress-content {
      width: 100%;
      border-radius: 10px;
      margin-top: 40px;
      position: relative;
      .up-centent {
        z-index: 10;
        position: relative;
        bottom: 20px;
        height: 40px;
        width: 192px;
        line-height: 40px;
        border-radius: 32px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        background: #ff6f00;
      }
      .up2 {
        position: relative;
        transform: rotate(18deg);
        width: 0px;
        height: 0px;
        border: 20px solid #666;
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-top-color: #ff6f00;
        margin-top: -6px;
        // bottom: 20px;
        // 22+12 = 34
        bottom: 34px;
      }
      .progress-rate-content {
        border-radius: 10px;
        background: rgb(246, 221, 201);
      }
      .progress-rate {
        height: 12px;
        border-radius: 10px;
        background: rgb(255, 111, 0);
        position: relative;
      }
    }
    // 分割线
    .line {
      // padding-top: 28.6px;
      border: none;
      border-bottom: 2px dashed #bfbfbf;
    }
    .get-content {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      .get-button {
        width: auto;
        .van-button {
          height: 48px;
          line-height: 48px;
          border-radius: 32px;
        }
        .button-user {
          background: #fff;
          border: 2.087px solid #bfbfbf;
        }
      }
    }
  }
}
</style>
