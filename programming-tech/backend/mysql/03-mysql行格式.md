---
title: mysql行格式
sidebar_position: 1
---

以记录为单位来向表中插入数据的，这些记录在磁盘上的存放方式也被称为 行格式 或者 记录格式 。 InnoDB 到现在为止设计了4种不同类型的 行格式 ，分别是 Compact 、 Redundant 、Dynamic 和 Compressed 行格式。

mysql5.0之后的默认行格式为Compact ， 5.7之后的默认行格式为dynamic
```sql
CREATE TABLE `coin`  (
  `ranked` int(0) NOT NULL COMMENT '排名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;
-- ) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Compact;
```

Compact改成Dynamic
```
 Row size too large (> 8126). Changing some columns to TEXT or BLOB or using ROW_FORMAT=DYNAMIC or ROW_FORMAT=COMPRESSED ma
```

### Dynamic和Compressed行格式
只不过在处理行溢出数据时不同，它们不会在记录的真实数据处存储字段真实数据的前 768 个字节，而是把所有的字节都存储到其他页面中，只在记录的真实数据处存储其他页面的地址

### Compact 行格式
Compact行格式在MySQL 5.0中被引入，其目标是为了更高效的存储数据记录。在该格式下，一条数据记录的组成部分如下所示。其大体分为两部分——记录的额外信息、记录的数据内容。后者比较好理解，其即是我们存储到数据库的各列(字段)数据值。而前者则是MySQL为了更好描述该条记录而添加的额外信息

### 修改
```sql
-- 修改行格式
alter table task2
    row_format = dynamic;

-- 查看行格式
show table status from test1 like 'task2';
```
