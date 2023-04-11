## 2022.03.14计划
```
1.增加统计数据
```

## 开发记录
```
模块名：TradeOrder
后端：
TradeOrderController

方法：
queryTradeOrder
接口：
/trade/order/query

服务：
TradeOrderService
TradeOrderImpl

实体：
TradeOrder

mapper sql:
TradeOrderMapper
TradeOrderDao
```


## sql
```sql
CREATE TABLE `trade_order`  (
  `id` bigint(60) NOT NULL,
  `symbol` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderId` bigint(60) NULL DEFAULT NULL,
  `orderListId` bigint(60) NULL DEFAULT NULL,
  `price` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `qty` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `quoteQty` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `commission` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `commissionAsset` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` bigint(60) NULL DEFAULT NULL,
  `isBuyer` tinyint(1) NOT NULL,
  `isMaker` tinyint(1) NOT NULL,
  `isBestMatch` tinyint(1) NOT NULL,
  `update_time`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_time`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

INSERT INTO `time-manual2`.`trade_order`(`symbol`, `price`, `qty`, `quoteQty`, `commission`, `commissionAsset`, `id`, `orderId`, `orderListId`, `time`, `isBuyer`, `isMaker`, `isBestMatch`) VALUES ('ETHUSDT', '4190.83000000', '0.21540000', '902.70478200', '0.00118524', 'BNB', 1, 0, 0, 0, 0, 0, 0);
```
