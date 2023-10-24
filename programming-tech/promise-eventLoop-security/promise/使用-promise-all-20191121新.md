---
title: 使用-promise-all
sidebar_position: 3
---

```js
// 基础请求    
getTableData(current = 1, status = 0) {
      return new Promise((resolve, reject) => {
        this.$axios
          .post(
            `/backstage/ambassador/sales-management/findOrdersAuditRebates`,
            {
              pageCount: 10,
              pageIndex: current,
              status: status
            }
          )
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              alert('请求数据失败');
            }
          })
          .catch(error => {
            console.log(error, 'error');
          });
      });
    }

	//调用
    getAllData() {
      let base = this.getTableData(1, 0);
      let species = this.getTableData(1, 1);
      Promise.all([base, species])
        .then(result => {
          // 数据存入store
          this.setAuditListUnDone(result[0]);
          this.setAuditListDone(result[1]);
        })
        .catch(error => {
          console.log(error, 'errorPromiseAll');
        });
    },
```
