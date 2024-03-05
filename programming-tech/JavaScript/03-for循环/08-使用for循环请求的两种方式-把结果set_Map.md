## for of
```js
const initAllGiftList = async (list: IGiftItem[]) => {
  const allAllGiftList: Map<number, IGiftItem[]> = new Map();

  for (const item of list) {
    console.log('initAllGiftList', item.id);
    const res = await getGiftListUtil(item.id);
    allAllGiftList.set(item.id as number, res);
  }

  console.log('initAllGiftList', allAllGiftList);
};
```

## promise all & map
```js
const initAllGiftList = async (list: GiftItem[]) => {
  const allAllGiftList: Map<number, IGiftItem[]> = new Map();
  const promises = list.map(async (item) => {
    const res = await getGiftListUtil(item.id);
    allAllGiftList.set(item.id as number, res);
  });

  await Promise.all(promises);
}
```