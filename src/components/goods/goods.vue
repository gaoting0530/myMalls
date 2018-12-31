<template>
    <el-card class="mycard">
        <my-bread title1="商品管理" title2="商品列表"></my-bread>
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" clearable v-model="query" class="input-with-select searchbox" @change="searchGoods">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addGoodsShow">添加商品</el-button>
         <!-- 用户列表--表格 -->
        <el-table
            class="mytable"
            border
            height="460px"
            :data="goodsLists"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="goods_name"
                label="商品名称"
                width="380">
            </el-table-column>
            <el-table-column
                prop="goods_number"
                label="商品数量">
            </el-table-column>
            <el-table-column
                prop="goods_price"
                label="商品价格">
            </el-table-column>
            <el-table-column
                label="上新时间">
                <template slot-scope="scope">
                    {{scope.row.upd_time| fmtDate}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="editGoods(scope.row.id)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="deleteGoods(scope.row.goods_id)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            class="mypagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[200, 400, 600, 800]"
            :page-size="200"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            query:'',
            goodsLists:[],
            pagenum: 1,
            pagesize: 200,
            total: -1,
            formLabelWidth: '100px',
        }
    },
    created() {
        this.getAllGoodsList()
    },
    methods: {
        //删除商品
        deleteGoods(id) {
            this.$confirm('确定要删除该商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).then(async () => {
                         const res = await this.$http.delete(`goods/${id}`)
                        if(res.data.meta.status === 200) {
                            this.$message.success(res.data.meta.msg)
                            this.getAllGoodsList()
                        }
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            })
        },
        addGoodsShow() {
            this.$router.push({name:'addgoods'})
        },
         //搜索功能
        searchGoods() {
            this.getAllGoodsList()
        },
        // 分页功能相关事件
        handleSizeChange(val) {
            this.pagesize = val
            this.pagenum = 1
            this.getAllGoodsList()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val
            this.getAllGoodsList()
            console.log(`当前页: ${val}`);
        },
        // 获取所用商品信息
        async getAllGoodsList() {
            const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            this.goodsLists = res.data.data.goods
            this.total = res.data.data.total
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
    margin-top: 20px;
    width: 360px;
}
.mytable,.mypagination {
    margin-top: 20px;
}
</style>
