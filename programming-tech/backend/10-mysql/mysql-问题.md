
## mysql 登录
mysql -u root -p 

## Index column size too large. The maximum column size is 767 bytes.
set global innodb_file_format = BARRACUDA
```
https://www.jianshu.com/p/5c0cce24189b
```

## Specified key was too long; max key length is 767 bytes
set global innodb_large_prefix=on;

