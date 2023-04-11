package algorithm.a1Base;

import java.util.Arrays;

/*
* 颠倒数组元素的顺序
* */
public class ReverseArr {
    public static void main(String[] args) {

        // int[] arrA = new int[]{1,100,200,999,998};
        int[] arrA = new int[]{1,100,200,999,998,1000};

        int length = arrA.length;

        for(int i = 0 ;i < length/2;i++){

           System.out.println("循环次数："+ i);

           int temp = arrA[i];

           arrA[i] = arrA[length - 1 - i];

           System.out.println("末尾数组index:"+ (length - i - 1));

           arrA[length - i - 1] = temp;
        }

        System.out.println("arrA：" + Arrays.toString(arrA));
    }
}
