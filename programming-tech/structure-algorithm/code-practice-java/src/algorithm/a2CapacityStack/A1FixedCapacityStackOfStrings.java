package algorithm.a2CapacityStack;

/*
* 优点:
* 1.栈的乞丐版本
* 2.push和pop和栈的长度无关
缺点:
* 1.不支持各种类型的(泛型);
* 2.数组大小被写死了.没办法动态的改变
* 3.对象游离了没有被回收
* 4.不支持迭代
*
* 改进版本:算法1.1 下压栈 能够动态调整数组大小
*  */
public class A1FixedCapacityStackOfStrings {
    private String[] a;
    private int n=0;

    // 创建 固定容量空栈
    public A1FixedCapacityStackOfStrings(int capacity) {
        a=new String[capacity];
    }

    // 添加一个字符串
    public void push(String item){
        //a[n++]=item
        a[n]=item;
        n++;
    }

    // 删除最近添加的字符串
    public String pop(){
        //return a[--m]
        n=n-1;
        return a[n];
    }

    // 栈是否空
    public boolean isEmpty(){
        return n==0;
    }

    // 栈的字符串数量
    public int size(){
        return n;
    }


    public static void fnPrint(String exp){
        String[] split = exp.split(" ");
        A1FixedCapacityStackOfStrings f =new A1FixedCapacityStackOfStrings(20);

        for (String s:split) {
            //这里要多判断一下,f函数的成员变量n是否为零.如果为零,则说明数组里面没东西了,不能用pop()去取数据,否则则会报错
            System.out.println("s分割线----->:"+s);
            if(s.equals("-") && !f.isEmpty()){
                String pop = f.pop();//取数据的前提是:数组里面还有数据才可以
                System.out.println(pop);
            }else{
                f.push(s);
            }
        }

        System.out.println("-----------------end-------------------");
        System.out.println(f.size()+" left on stack ");

    }

    public static void main(String[] args) {
        // 当遇到 - 将会把栈的内容弹出并打印结果
        String exp="to be or not to - be - - that - - - is";
        fnPrint(exp);
    }
}
