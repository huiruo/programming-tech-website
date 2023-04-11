```
每种数据类型都需要相应的散列函数，于是 Java 令所有数据类型都继承了一个能够返回一个 32 比特整数的 hashCode() 方法。

每一种数据类型的 hashCode() 方法都必须和 equals() 方法一致。也就是说，如果 a.equals(b) 返回 true，那么 a.hashCode() 的返回值必然和 b.hashCode() 的返回值相同。

相反,如果两个对象的 hashCode() 方法的返回值不同，那么我们就知道这两个对象是不同的。

但如果两个对象的 hashCode() 方法的返回值相同，这两个对象也有可能不同，我们还需要用 equals() 方法进行判断。

请注意，这说明如果你要为自定义的数据类型定义散列函数，你需要同时重写 hashCode() 和 equals() 两个方法。默认散列函数会返回对象的内存地址，但这只适用于很少的情况。

Java 为很多常用的数据类型重写了 hashCode() 方法（包括 String、Integer、Double、File 和 URL）。
```

## 例子：使用 hashCode 与 equals 判断对象是否相等
```
hashCode 的作用是用来获取哈希码，也可以称作散列码，实际返回值为一个 int 型数据，常用于确定对象在哈希表中的位置。

因为超类 Object 中有 hashcode 方法，也就意味着所有的类都有 hashCode 方法。

示例：如下通过重写 equal 方法，使得两个对象内容相同，然后这两个对象的哈希码并不相同。
```

```java
public class EqualTest {
	public static void main(String[] args) {
	Person p1 = new Person(10, "张三");
	Person p2 = new Person(10, "张三");
	System.out.println(
	"p1.equals(p2)=" + p1.equals(p2) + ", p1.hashcode=" + p1.hashCode() + ", p2.hashcode=" +p2.hashCode());
	}
}

class Person {
	int age;
	String name;
	……
	@Override
	public boolean equals(Object obj) {
	if (this == obj) return true;
	if (obj == null) return false;
	if (getClass() != obj.getClass()) return false;
	
	Person other = (Person) obj;
	if (age != other.age) return false;
	if (name == null) {
		if (other.name != null)
			return false;
	} else if (!name.equals(other.name)){
		return false;
	}else{
		return true;
	}
	}
}

// 因为没有重写 hashCode 方法，所以输出结果为：
// p1.equals(p2)=true, p1.hashcode=246688959, p2.hashcode=1457895203


// 接下来我们重写 hashCode 方法，
@Override
public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + age;
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    return result;
}

// 这样，这两个对象的哈希值就相同了。
```