package algorithm;

import java.util.Arrays;
import java.util.Scanner;

public class HelloWorld {
    public static void main(String[] args){
        int[] a= new int[5];
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入5个数");
        for(int i=0;i<a.length;i++){
            System.out.println("请输入第"+(i+1)+"个数");
            a[i] = sc.nextInt();
        }

        for(int i=0;i<a.length-1;i++) {

            for(int j=0;j<a.length-1-i;j++) {

                if(a[j]>a[j+1]) {

                    int temp=a[j];

                    a[j]=a[j+1];

                    a[j+1]=temp;
                }
            }

        }

        System.out.println(Arrays.toString(a));
    }
}
