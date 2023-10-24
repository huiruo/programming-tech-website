---
title: 使用-tabControl-两个请求合并promiseAll
sidebar_position: 5
---

```js
import axios from 'axios'
import baseUrl from "../../urlConfig.js";
// import mockData from "../../mockData.js";
const state = {
    componentSwip: false,
    baseData: null,
    speciesData: null,
    tabInitData: [],  //一个tab数据
}
const getters = {}
const mutations = {
    getMouseoverAction(state, value) {
        console.log("getMouseoverAction22：", value)
        state.MouseoverAction = value;
    },
    componentSwip(state, value) {
        console.log("componentSwip22：", value)
        state.componentSwip = value;
    },
    getData2(state, res) {
        console.log("数据获取成功，准备渲染：")
        state.baseData = res[0]
        state.speciesData = res[1]
        console.log(state.baseData)   //02总的基础数据,修改之后无效
        console.log(state.speciesData)  //03.映射数据        

    },
    getdata(state, res) {  //测试方法01.
        console.log("数据获取成功，准备渲染：")
        state.baseData = res[0]
        state.speciesData = res[1]
        console.log(state.baseData)   //02总的基础数据
        console.log(state.speciesData)  //03.映射数据

        console.log("==============")
        //01.**tab表头的值
        state.basic_module = state.baseData.module //01.tab种类：如 物理性能
        state.basic_row = state.baseData.row   //02.基础值
        state.basic_module_col = state.baseData.module_col  //03.基础值，用于对应 attribute_detail 属性名(也就是在attribute_detail取值)
        console.log(state.basic_module_col)
        state.basic_data = state.baseData.basic_data   //02.基础值

        // console.log(state.basic_module)
        // console.log(state.basic_row)
        // console.log(state.basic_data)
        for (let i = 0; i < state.speciesData.length; i++) {
            let mod_id = state.speciesData[i].mod_id  //base physical
            //01.查找表头
            // console.log(state.data_module[mod_id].mod_ch) //物理性能 应用要求
            //02.查找展示的名
            let displayRowlist = state.speciesData[i].stans[0].row_list
            console.log("查找展示的列-->" + i)
            console.log(displayRowlist)
            //这个是总的映射数据，一般有好几条，根据displayRowlist[i].row_id
            //取 state.basic_row 里面的数据(state.basic_row.映射id)

            let tabDisplayRowObj = null  //=存展示的列
            let dataObj = {             //=一个tab 完整的数据
                tabNameZh: state.basic_module[mod_id].mod_ch,
                tabDisplayRow: [],
            }

            //**查找当前属性
            let current_module_col = state.basic_module_col[mod_id]
            console.log(current_module_col)

            for (let i = 0; i < displayRowlist.length; i++) {
                console.log("=============AAAAAAAAAA第二个for循环开始查找展示的列" + i + ":" + displayRowlist[i].row_id)
                // console.log(displayRowlist[i])
                let displayRowData = state.basic_row[displayRowlist[i].row_id]
                console.log("被取得对象,基础的值------》")
                console.log(displayRowData)
                console.log("被取得对象2,展示的值------》")
                console.log(displayRowlist[i])
                let displayRowlist_value = displayRowlist[i].value

                let rowName = ''
                let row1 = []
                for (let i = 0; i < current_module_col.length; i++) {
                    console.log("<==========节点属性名==============>")
                    console.log(current_module_col[i])
                    /**
                    <==========节点属性名==============>
                    name
                    <==========节点属性名==============>
                    chinese_context
                    <==========节点属性名==============>
                    english_context
                     * 
                     */
                    let rowZhTyp = null
                    if (current_module_col[i] == 'name') {  //name 属性单独处理
                        rowName = displayRowData.attribute_detail[current_module_col[i]].col[0].colDefaultvalue
                    } else if (current_module_col[i] == 'english_context') {  //不处理 english_context 属性
                        console.log("_________$$$$$$$$$$$不处理 english_context 属性")
                    } else {
                        rowZhTyp = displayRowData.attribute_detail[current_module_col[i]]
                        console.log("----------------8999000除name属性的其他属性" + current_module_col[i] + "-------------------")
                        console.log(rowZhTyp)
                        console.log("rowZhTyp_colType的值：" + rowZhTyp.colType)
                        /**
                            1.auto 根据colDefaultvalue取值
                            2.select 根据colBinding取值
                            3.list 根据colBinding取值
                            4.object 根据col数据处理 
                         */
                        let rowZhTyp_colType = rowZhTyp.colType
                        if (rowZhTyp_colType == 'select') {
                            console.log('----> select_根据colBinding取值:' + rowZhTyp_colType)
                            let colBindingStr = 'i' + rowZhTyp.colBinding
                            // console.log(state.basic_data.data[colBindingStr])
                            // console.log(displayRowlist_value)
                            let state_basic_d_d = state.basic_data.data[colBindingStr]
                            let chinese_context = displayRowlist_value.chinese_context
                            for (let i = 0; i < chinese_context.length; i++) {
                                //只需要中文名(cname)
                                // console.log(state_basic_d_d['i' + chinese_context[i]].cname)  
                                row1.push(state_basic_d_d['i' + chinese_context[i]].cname)
                            }
                        } else if (rowZhTyp_colType == 'list') {
                            console.log('---->list根据colBinding取值:' + rowZhTyp_colType)
                            console.log(rowZhTyp)
                            if (current_module_col[i] == 'condition') {  //**1.condition特殊处理
                                let colBindingStr = 'i' + rowZhTyp.colBinding
                                // console.log(state.basic_data.data[colBindingStr])
                                // console.log(displayRowlist_value)
                                let state_basic_d_d = state.basic_data.data[colBindingStr]
                                console.log('condition的值PPPPPPPP')
                                console.log(state_basic_d_d)  //取里面的值
                            } else {  //** 2.非condition特殊处理
                                /**
                                 * 2）	当该列不为” condition”时，根据行定义的(row)colBinding结合数据(species )中value值，到basic_data. data中获取对应的值。（只有一个值）。
                                 */
                                console.log('condition的值AAAAA')
                                console.log(rowZhTyp)
                                let colBindingStr = 'i' + rowZhTyp.colBinding
                                console.log(colBindingStr)
                                console.log(displayRowlist_value)
                                console.log(current_module_col[i])
                                // console.log(displayRowlist_value.current_module_col[i])
                            }
                        } else if (rowZhTyp_colType == 'auto') {
                            console.log('---->auto 根据colDefaultvalue取值')
                            console.log(rowZhTyp)
                        } else if (rowZhTyp_colType == 'object') {
                            console.log('---->object 根据col数据处理 ')
                            console.log(rowZhTyp)
                        }
                    }
                }
                tabDisplayRowObj = {
                    rowName: rowName,
                    row1: row1,
                }
                dataObj.tabDisplayRow.push(tabDisplayRowObj)
            }

            state.tabInitData.push(dataObj)  //2019.7.31修改为mock数据进行测试
            // console.log('修改为mock数据进行测试-----》')
            // console.log(mockData)
            // state.tabInitData = mockData
        }
        //02.**展示的实际名

        //03.**basic_data 展示的实际值
        state.basic_data = state.baseData.basic_data
        console.log("basic_data展示的实际值")
        console.log(state.basic_data)

        console.log("最终渲染到页面的数据=====》")
        console.log(state.tabInitData)
    }
}
function parseFormData(data) {
    let newData = new FormData();
    for (let i in data) {
        newData.append(i, data[i]);
    }
    return newData;
}
//**01.提交到线上得注释，本地项目测试用
// /** 
let promiseLogin = new Promise((resolve, reject) => {
    //初始化promise 状态(同步)：pending: 初始化状态
    let data = parseFormData({
        username: '15692426057',
        password: 'abchen183123',
    });
    //***请求登录接口 start
    //***请求登录接口 start
    axios({
        method: 'post',
        url: '/api/login/ajax',
        data: data,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Client-Type': 1 }
    }).then(res => {
        if (res.data.status == 1) {
            console.log("登录成功")
            resolve()
        } else {
            console.log("登录失败1")
            reject()
        }
    }).catch(function (err) {
        console.log("登录失败catch")
    });
})
// */

function getInitData(flag) {
    return new Promise(function (resolve, reject) {
        const url = baseUrl + '/plastic/advanceSearchCond'   //1.本项目测试
        // const url2 = 'https://wn3r59eejh.17suzao.com/plastic/advanceSearchCond'  //2.提交到线上测试
        // const url3 = ''  //3.提交到正式站

        let params = name
        if (flag) {
            // console.log("搜索信息请求")
            params = {
                act: 'species',   //当传base为基础信息表
                species: 'pa66',
            }
        } else {
            // console.log("基础数据请求")
            params = {  //1
                act: 'base',   //当传base为基础信息表
            }
        }
        axios(
            {
                method: "get",
                url: url,
                params: params,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }
        ).then((res) => {
            // console.log(res)
            // console.log(res.data.data)
            resolve(res.data.data);
        })
    });
}


const actions = {
    getdata(context) {
        //***02.本地项目测试用promise,用于登录，提交到线上得注释
        promiseLogin.then(() => {
            //***去拿数据start
            //***去拿数据start
            let base = getInitData(0) //基础信息
            let species = getInitData(1)  //搜索信息
            Promise.all([base, species]).then(function (results) {
                // context.commit('getdata', results)
                context.commit('getData2', results)
                // results.forEach(function (result) {
                //     console.log("数据")
                //     console.log(result);
                // });
            }).catch(function (err) {
                console.log("Promiseall错误")
                console.log(err);
            });
            //***拿数据end
            //***拿数据end
        }).catch((error) => {
            console.log("需要登录拿数据");
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
```
