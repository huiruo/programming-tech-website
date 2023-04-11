/*
 Navicat Premium Data Transfer

 Source Server         : cryto-server
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : 1.14.165.196:3306
 Source Schema         : quantier

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 12/03/2022 14:00:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bot
-- ----------------------------
DROP TABLE IF EXISTS `bot`;
CREATE TABLE `bot`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `strategyId` int(0) NOT NULL COMMENT '策略ID',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '名字',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'Stopped' COMMENT '状态',
  `duration` int(0) NOT NULL DEFAULT 0 COMMENT '运行时间',
  `profit` int(0) NOT NULL DEFAULT 0 COMMENT '盈利',
  `deletedAt` datetime(6) NULL DEFAULT NULL COMMENT '是否已被删除',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `params` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '参数',
  `userId` int(0) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bot
-- ----------------------------
INSERT INTO `bot` VALUES (1, 1, '网格交易', 'Running', 0, 0, NULL, '2022-03-02 07:52:07.609876', '2022-03-12 05:44:29.000000', '{\"apiId\":1,\"symbol\":\"BTC-USDT\",\"maxPrice\":\"1\",\"minPrice\":\"2\",\"gridNum\":\"3\"}', 0);
INSERT INTO `bot` VALUES (2, 2, '期货套利', 'Stopped', 0, 0, NULL, '2022-03-02 08:10:06.603854', '2022-03-08 09:52:09.000000', '{\"maxPrice\":\"12\"}', 0);
INSERT INTO `bot` VALUES (3, 3, '波段追踪', 'Stopped', 0, 0, NULL, '2022-03-02 10:36:02.236663', '2022-03-09 03:17:28.000000', '{\"apiId\":2,\"symbol\":\"BTC/USDT\"}', 0);
INSERT INTO `bot` VALUES (13, 1, '网格交易11', 'Running', 0, 0, NULL, '2022-03-09 11:24:15.468795', '2022-03-12 05:44:29.000000', NULL, 1);
INSERT INTO `bot` VALUES (14, 2, '期货套利-子弋', 'Stopped', 0, 0, NULL, '2022-03-09 11:33:10.852798', '2022-03-09 11:43:38.000000', NULL, 1);
INSERT INTO `bot` VALUES (15, 1, '网格交易', 'Running', 0, 0, NULL, '2022-03-09 13:31:23.918755', '2022-03-12 05:44:29.000000', '{\"apiId\":5,\"symbol\":\"3343\",\"maxPrice\":\"1\",\"minPrice\":\"1\",\"gridNum\":\"1\"}', 3);
INSERT INTO `bot` VALUES (17, 1, '网格交易二', 'Stopped', 0, 0, NULL, '2022-03-10 05:01:05.361042', '2022-03-10 05:01:05.361042', NULL, 1);
INSERT INTO `bot` VALUES (18, 1, '网格交易', 'Stopped', 0, 0, NULL, '2022-03-10 10:53:57.601535', '2022-03-10 10:53:57.601535', NULL, 1);
INSERT INTO `bot` VALUES (19, 1, '网格交易', 'Stopped', 0, 0, NULL, '2022-03-10 11:04:14.133933', '2022-03-10 11:07:40.000000', NULL, 1);
INSERT INTO `bot` VALUES (24, 1, '网格交易', 'Running', 0, 0, NULL, '2022-03-11 10:01:17.040105', '2022-03-12 05:44:29.000000', '{\"apiId\":10,\"symbol\":\"ETH/USDT\",\"maxPrice\":\"3\",\"minPrice\":\"3\",\"gridNum\":\"3\",\"quantity\":\"3\",\"stopLossPrice\":\"3\",\"stopProfitPrice\":\"3\"}', 2);

SET FOREIGN_KEY_CHECKS = 1;
