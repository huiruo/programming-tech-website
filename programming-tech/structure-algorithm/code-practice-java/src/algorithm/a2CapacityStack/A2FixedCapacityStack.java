package algorithm.a2CapacityStack;

import algorithm.library.*;

class FixedCapacityStack<Item> {
    private Item[] a;
    private int N;
    public FixedCapacityStack(int cap) {
        System.out.println("初始化---》");
        a=(Item[]) new Object[cap];
    }

    public void push(Item item)
    {
        if(N==a.length) resize(2*a.length);
        a[N++]=item;
    }

    public Item pop()
    {
        Item item= a[--N];
        a[N]=null;
        if(N>0 && N==a.length/4)  resize(a.length/2);
        return item;
    }

    public boolean isEmpty() {
        return N==0;
    }

    public int size() {
        return N;
    }

    private void resize(int max)
    {
        Item[] temp=(Item[]) new Object[max];
        for(int i=0;i<N;i++)
            temp[i]=a[i];
        a=temp;
    }
}

public class A2FixedCapacityStack {
    public static void main(String[] args) {
        FixedCapacityStack<String> fixedCapacityStack;
        fixedCapacityStack = new FixedCapacityStack<String>(100);

        String exp="to be or not to - be - - that - - - is";
        String[] split = exp.split(" ");

        System.out.println("===分割线===");
        for (String item:split) {
            //这里要多判断一下,f函数的成员变量n是否为零.如果为零,则说明数组里面没东西了,不能用pop()去取数据,否则则会报错
            // System.out.println("item:"+item);
            if (!item.equals("-"))
                fixedCapacityStack.push(item);
            else if (!fixedCapacityStack.isEmpty())
                System.out.print(fixedCapacityStack.pop() + " ");
        }
        // StdOut.println("(" + fixedCapacityStack.size() + " left on stack)");
        StdOut.printf("(" + fixedCapacityStack.size() + " left on stack)");
        System.out.println("");
        System.out.println("分割线3"+fixedCapacityStack);
    }
}
