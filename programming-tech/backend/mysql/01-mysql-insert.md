---
title: mysql-insert
sidebar_position: 1
---

## insert两种方法
第一种方法将列名和列值分开了，在使用时，列名必须和列值的数一致。如下面的语句向users表中插入了一条记录：
```sql
INSERT INTO users(id, name, age) VALUES(123, '姚明', 25);
```

第二种方法允许列名和列值成对出现和使用，如下面的语句将产生同样的效果。
```sql
INSERT INTO users SET id = 123, name = '姚明', age = 25;
```

## 不同点
(1): 如果使用了SET方式，必须至少为一列赋值。如果某一个字段使用了省缺值（如默认或自增值），这两种方法都可以省略这些字段。如id字段上使用了自增值，上面两条语句可以写成如下形式：
```sql
INSERT INTO users (name, age) VALUES('姚明',25);
INSERT INTO uses SET name = '姚明', age = 25;
```

(2)MySQL在VALUES上也做了些变化。
如果VALUES中什么都不写，那MySQL将使用表中每一列的默认值来插入新记录。
```sql
INSERT INTO users () VALUES();
```

(3)标准的INSERT语句允许一次插入多条数据，set不行
```sql
INSERT INTO users (name, age) VALUES('姚明',25),('麦蒂',25)
```
