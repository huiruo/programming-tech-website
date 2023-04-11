/*
我们将使用一个关联数组（对象来表示我们的数据结构，和我们在Dictionary类中所做的一样。

put(key,value)：向散列表增加一个新的项
remove(key)：根据键值从散列表中移除值
get(key)：返回根据键值检索到的特定的值
*/
class HashTable {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }
  // 我们要实现的第一个方法是散列函数
  /*
  * 在loseloseHashCode方法中，我们首先检验key是否是一个数,如果是，我们直接将其返回。
  * 然后，给定一个key参数，我们就能根据组成key的每个字符的ASCII码值的和得到一个数。
  * 所以，首先需要将key转换为一个字符串（行{2}），防止key是一个对象而不是字符串。
  * 我们需要一个hash变量来存储这个总和（行{3}）。然后，遍历key并将从ASCII表中查到的每个字符对应的ASCII值加到hash变量中（行{4}），
  * 可以使用JavaScript的String类中的charCodeAt方法。最后，返回hash值。
  * 为了得到比较小的数值，我们会使用hash值和一个任意数做除法的余数（%）（行{5}）——这可以规避操作数超过数值变量最大表示范围的风险。
  * */
  loseloseHashCode(key) {
    if (typeof key === 'number') {
      return key;
    }
    const tableKey = this.toStrFn(key); // {2}
    let hash = 0; // {3}
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i); // {4}
    }
    return hash % 37; // {5}
  }
  /* djb2HashCode(key) {
    const tableKey = this.toStrFn(key);
    let hash = 5381;
    for (let i = 0; i < tableKey.length; i++) {
      hash = (hash * 33) + tableKey.charCodeAt(i);
    }
    return hash % 1013;
  } */

  // hashCode方法简单地调用了loseloseHashCode方法，将key作为参数传入。
  hashCode(key) {
    return this.loseloseHashCode(key);
  }

  // 向散列表增加一个新的项（也能更新散列表）。
  /*
  * 首先，我们检验key和value是否合法（行{1}），
  * 对于给出的key参数，我们需要用所创建的hashCode函数在表中找到一个位置（行{2}）。
  * 然后，用key和value创建一个ValuePair实例（行{3}）。
  *  */
  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      this.table[position] = new ValuePair(key, value);
      return true;
    }
    return false;
  }

  // get(key)：返回根据键值检索到的特定的值。
  /*
  * 首先，我们会用所创建的hashCode方法获取key参数的位置。该函数会返回对应值的位置，我们要做的就是到table数组中对应的位置取到值并返回。
  * 
  * HashTable和Dictionary类很相似。不同之处在于在Dictionary类中，我们将valuePair保存在table的key属性中（在它被转化为字符串之后），
  * 而在HashTable类中，我们由key（hash）生成一个数，并将valuePair保存在hash位置（或属性）。
  * */
  get(key) {
    const valuePair = this.table[this.hashCode(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
  // remove(key)：根据键值从散列表中移除值。
  /*
  * 要从HashTable中移除一个值，首先需要知道值所在的位置，因此我们使用hashCode函数来获取hash（行{1}）。
  * 我们在hash的位置获取到valuePair（行{2}），如果valuePair不是null或undefined，就使用JavaScript的delete运算符将其删除
  * */
  remove(key) {
    const hash = this.hashCode(key);
    const valuePair = this.table[hash];
    if (valuePair != null) {
      delete this.table[hash];
      return true;
    }
    return false;
  }
  getTable() {
    return this.table;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return Object.keys(this.table).length;
  }
  clear() {
    this.table = {};
  }
  toString() {
    if (this.isEmpty()) {
      return '';
    }
    const keys = Object.keys(this.table);
    let objString = `{${keys[0]} => ${this.table[keys[0]].toString()}}`;
    for (let i = 1; i < keys.length; i++) {
      objString = `${objString},{${keys[i]} => ${this.table[keys[i]].toString()}}`;
    }
    return objString;
  }
}

const hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
console.log(hash.hashCode('Gandalf') + ' - Gandalf');
console.log(hash.hashCode('John') + ' - John');
console.log(hash.hashCode('Tyrion') + ' - Tyrion');