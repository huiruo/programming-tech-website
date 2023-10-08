
```js
const id1 = [
  { 
    value: '集合',
    id: '1351055116569181209',
  },
  { 
    value: '集合',
    id: '1351055116569181201',
  },
  {
    value: '集合',
    id: '1351055116569181202',
  },
  {
    value: '集合',
    id: '1351055116569181203',
  },
];

const id2 = new Set([
  '1351055116569181209',
  '1351055116569181201',
]);

const filteredId1 = id1.filter(item => id2.has(item.id));

console.log(filteredId1);
```