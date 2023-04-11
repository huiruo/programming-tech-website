const position = {
  "symbol": "BTCUSDT",
  "positionAmount": -0.027,
  "initialMargin": 630.88469999,
  "maintMargin": 2.5235388,
  "entryPrice": 23250.28888889,
  "unrealizedProfit": -3.12689999,
  "leverage": 1,
  "isolated": false,
  "isolatedWallet": "0",
  "positionSide": "BOTH"
}

const params = {
  "direction": "short",
  "leverage": 1,
  "cash": 80,
  "purchasePrice": 23414,
  "profitPercent": 2,
  // "lossPercent": 0
  "lossPercent": 2
}

const ticker = {
  // 2 止损线
  close: 24501
  // 非止损线
  // close: 23501

  // 止盈线
  // close: 22501
  // 非止盈线
  // close: 23001
}

// 浮动盈亏: profitRate =（当天结算价－开仓价格）×持仓量×合约单位－手续费
const { entryPrice, positionAmount, leverage, initialMargin } = position
const { close: currentPrice } = ticker
const profit = (currentPrice - entryPrice) * positionAmount * leverage
const { profitPercent, lossPercent } = params

const profitRate = parseFloat(((profit / initialMargin) * 100).toFixed(2))
if (profitRate > 0) {
  if (profitRate > profitPercent) {
    console.log(`当前:${profitRate}%,达到${profitPercent}%止盈线,开始止盈...`);
    // await this.closePosition()
  } else {
    console.log(`当前:${profitRate}%,未达到${profitPercent}%止盈线,running`);
  }
} else {

  if (!lossPercent) {
    console.log(`当前:${profitRate}%,该策略未设置止损线,running`);

  } else {
    if (profitRate < (0 - lossPercent)) {
      console.log(`当前:${profitRate}%,达到-${lossPercent}%止损线,开始止损...`);
      // this.tradeStatus = stoped
      // await this.closePosition()
    } else {
      console.log(`当前:${profitRate}%,未达到-${lossPercent}%止损线,running`);
    }
  }
}
