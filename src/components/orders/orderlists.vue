<template>
    <el-card class="mycard">
        <my-bread title1="订单管理" title2="订单列表"></my-bread>
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" clearable v-model="query" class="input-with-select searchbox" @change="searchOrders">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addOrderShow">添加订单</el-button>
        <!-- 订单列表 -->
        <!-- 用户列表--表格 -->
        <el-table
            class="mytable"
            border
            height="460px"
            :data="orderLists"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="order_fapiao_title"
                label="发票属性"
                width="80">
            </el-table-column>
            <el-table-column
                prop="order_number"
                label="订单号"
                width="220px">
            </el-table-column>
            <el-table-column
                prop="order_price"
                label="价格">
            </el-table-column>
            <el-table-column
                prop="is_send"
                label="是否发货">
            </el-table-column>
            <el-table-column
                label="支付状态"
                width="200px">
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.pay_status" size="mini" disabled>
                        <el-radio label="0">未付款</el-radio>
                        <el-radio label="1">已付款</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column
                label="支付方式"
                width="380px">
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.order_pay" size="mini" disabled>
                        <el-radio label="0">未支付</el-radio>
                        <el-radio label="1">支付宝</el-radio>
                        <el-radio label="2">微信</el-radio>
                        <el-radio label="3">银行卡</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.update_time | fmtDate}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                        <el-button @click="editOrderShow(scope.row.id)" plain size="small" type="primary" icon="el-icon-edit" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="mypagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
            <!-- 分配角色对话框 -->
        <el-dialog title="角色分配" :visible.sync="addressShowDialog">
            <el-form :model="form">
                <el-form-item label="收货人" :label-width="formLabelWidth" >
                    <el-input v-model="form.order_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" :label-width="formLabelWidth">
                    <el-cascader
                        expand-trigger="hover"
                        :options="options"
                        v-model="selectedOptions2"
                        :props="defaultProps">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addressShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addressShowDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import area from '@/components/orders/city_data2017_element.js'
// const area = require('city_data2017_element.js')
export default {
    data() {
        return {
            query:'',
            pagenum: 1,
            pagesize: 10,
            total: -1,
            orderLists:[],
            addressShowDialog: false,
            formLabelWidth:'120px',
            options:[],
            selectedOptions2:[],
            form:{},
            defaultProps:{
                label: 'label',
                value: 'value',
                children:'children'
            }
        }
    },
    created() {
        this.getAllOrders()
    },
    methods: {
        editOrderShow() {
            this.addressShowDialog = true
            this.options = area
        },
        handleChange(value) {
            console.log(value);
        },
        // 分页功能相关事件
        handleSizeChange(val) {
            this.pagesize = val
            this.pagenum = 1
            this.getAllOrders()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val
            this.getAllOrders()
            console.log(`当前页: ${val}`);
        },
        addOrderShow() {

        },
        searchOrders() {

        },
        async getAllOrders() {
            const res = await this.$http.get(`orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            const {data,meta:{msg,status}} = res.data
            if(status === 200) {
                this.total = data.total
                this.orderLists = data.goods
            }
            console.log(res)
        }
    },
}
</script>

<style>
    .mycard {
        height: 100%
    }
    .searchbox {
        width: 360px;
        margin-top: 20px;
    }
    .mytable,.mypagination {
        margin-top: 20px
    }
</style>
