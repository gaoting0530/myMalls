<template>
    <el-card class="mycard">
        <my-bread title1="数据统计" title2="数据报表"></my-bread>
        <!-- 数据统计 -->
        <div id="main" style="width: 1000px;height:600px;"></div>
    </el-card>
</template>

<script>
const echarts = require('echarts')
export default {
    data() {
        return {
            option:{},
            option_circle:{}
        }
    },
    mounted() {
        this.getAllData()
    },
    methods: {
        async getAllData() {
            
            const option1 = {
                title: {
                    text: '地区销售总量'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            }
            const res = await this.$http.get(`reports/type/1`)
            const option2 = res.data.data
            this.option = {...option1,...option2}
            var myChart = echarts.init(document.getElementById('main'))
            myChart.setOption(this.option)
            
        }
    },
}
</script>

<style>
    .mycard {
        height: 100%
    }
    #main {
        margin-top: 20px;
    }
</style>
