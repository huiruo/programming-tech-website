
```js
function checkObjectValues(obj: Record<string, any>): boolean {
  return Object.values(obj).every((value: any) => value === true);
}

const obj1 = {
  level: true,
  area: false
};

console.log(checkObjectValues(obj1));
```