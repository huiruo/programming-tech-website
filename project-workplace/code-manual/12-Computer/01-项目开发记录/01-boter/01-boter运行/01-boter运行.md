## 开始
```
终端进入：
wsl -u root

cd /home/ruo/user_ws/boter


cd /home/ruo/user_ws/boter/apps/bot-runner
yarn dev


cd /home/ruo/user_ws/boter/apps/market-event-publisher
yarn dev

cd /home/ruo/user_ws/boter/packages/graphql-service
本地：
yarn start  只是生成sdk,没有启动服务

如果在最外层 yarn build 后就不用yarn start
```

## 1.消息通知
路径：
D:\user_ws\boter-new\boter-backend\strategies\candle-signal
```
candle-signal.ts

CandleHelper.ts
futures-candle.ts

bot.service.ts
```

```js
@onCandle('{{params.period}}')
async handleCandle(candle: Candle) {
  // this.logger.info('Candle:', candle)
  console.log('Candle:', candle);
}

Candle: {
  _id: new ObjectId("635a892f4d72c727568a6d84"),
  symbol: 'APTUSDT',
  interval: '5m',
  openTime: 1666360200000,
  open: 7.261,
  high: 7.274,
  low: 7.241,
  close: 7.271,
  volume: 343944.9,
  closeTime: 1666360499999,
  quoteVolume: 2495963.5525,
  trades: 3773,
  baseAssetVolume: 182495.3,
  quoteAssetVolume: 2495963.5525,
  time: 1666360200000,
  buyVolume: NaN,
  quoteBuyVolume: NaN
}
```