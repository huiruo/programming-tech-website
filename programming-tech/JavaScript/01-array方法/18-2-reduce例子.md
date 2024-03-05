## 下面两个相同
```js
const initializedData2 = [];
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const rowData = {};

  if (rowKeys.includes(row.id)) {
    for (let j = 0; j < columns.length; j++) {
      const col = columns[j];

      const cell = cells.find(
        (c) => c.props.columnId === col.id && c.props.rowId === row.id,
      )!;

      // console.log('%c=ceelllll', 'color:red', cell);

      rowData[col.id] = cell;
    }
    initializedData2.push(rowData);
  }
}

  const initializedData2 = rows.reduce((acc:Record<string, ICellNode>[], row) => {
    if (rowKeys.includes(row.id)) {
      const rowData = columns.reduce((rowData, col) => {
        const cell = cells.find(
          (c) => c.props.columnId === col.id && c.props.rowId === row.id,
        )!;
  
        rowData[col.id] = cell;
        return rowData;
      }, {} as Record<string, ICellNode>);
  
      acc.push(rowData);
    }
  
    return acc;
  }, []);
```