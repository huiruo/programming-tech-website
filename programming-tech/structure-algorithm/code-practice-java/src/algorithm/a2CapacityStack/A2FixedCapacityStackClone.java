package algorithm.a2CapacityStack;

import algorithm.library.StdIn;
import algorithm.library.StdOut;

import java.util.Scanner;

class FixedCapacityStackClone<Item> {
    private Item[] a;
    private int N;
    public FixedCapacityStackClone(int cap) {
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

public class A2FixedCapacityStackClone {
    public static void main(String[] args) {
        FixedCapacityStack<String> fixedCapacityStack;
        fixedCapacityStack = new FixedCapacityStack<String>(100);

        // String exp="to be or not to - be - - that - - - is #";

        /*
        while (!StdIn.isEmpty()) {
            String item = StdIn.readString();
            // System.out.println("item:"+item);
            if (!item.equals("-"))
                fixedCapacityStack.push(item);
            else if (!fixedCapacityStack.isEmpty())
                System.out.print(fixedCapacityStack.pop() + " ");
        }
        */

        // 重写手动输入并 以 # 跳出循环
        Scanner sc = new Scanner(System.in);
        while(!sc.hasNext("#"))  // 即以#为结束符号
        {
            String item = sc.next();
            if (!item.equals("-"))
                fixedCapacityStack.push(item);
            else if (!fixedCapacityStack.isEmpty())
                System.out.print(fixedCapacityStack.pop() + " ");
        }

        StdOut.printf("(" + fixedCapacityStack.size() + " left on stack)");
    }
}
