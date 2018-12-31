<template>
    <el-card class="mycard">
        <my-bread title1="商品管理" title2="商品分类"></my-bread>
        <el-button type="success" class="mybtn" @click="addCatesShow()">添加分类</el-button>
         <el-table
            height="460px"
            :data="cateLists"
            style="width: 100%">
            <el-tree-grid
            label="分类名称"
            prop="cat_name"
            treeKey="cat_id"
            parentKey="cat_pid"
            childKey="children"
            levelKey="cat_level">
            </el-tree-grid>
            <el-table-column
                label="级别"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">一级</span>
                    <span v-if="scope.row.cat_level === 1">二级</span>
                    <span v-if="scope.row.cat_level === 2">三级</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cat_deleted"
                label="是否有效">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_deleted === false">有效</span>
                    <span v-if="scope.row.cat_deleted === true">无效</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
                    <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
           <!-- 添加分类对话框 -->
        <el-dialog title="添加商品分类" :visible.sync="addCatesShowDialog">
            <el-form :model="form">
                <el-form-item label="分类名称" :label-width="formLabelWidth" >
                     <el-input v-model="form.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" :label-width="formLabelWidth">
                    {{selectedOptions3}}
                    <el-cascader
                    :options="options"
                    v-model="selectedOptions3"
                    change-on-select
                    :props="defaultProps"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addCatesShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addCates">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
const ElTreeGrid = require('element-tree-grid')
 
export default {
    components: {
        ElTreeGrid
    },
    data() {
        return {
            cateLists:[],
            addCatesShowDialog: false,
            formLabelWidth:'120px',
            form:{},
            options:[],
            selectedOptions3:[],
            defaultProps:{
                label:'cat_name',
                children: 'children',
                value: 'cat_id'
            }
        }
    },
    created() {
        this.getAllCates()
    },
    methods: {
        async addCates() {
            if(this.selectedOptions3.length === 0) {
                this.form.cat_pid = 0
                this.form.cat_level = 0
            } else if (this.selectedOptions3.length === 1) {
                this.form.cat_pid = this.selectedOptions3[0]
                this.form.cat_level = 1
            } else if  (this.selectedOptions3.length === 2) {
                this.form.cat_pid = this.selectedOptions3[1]
                this.form.cat_level = 2
            }
            const res = await this.$http.post(`categories`,this.form)
            const {meta: {msg,status}} = res.data
            if(status === 201) {
                this.$message.success(msg)
                this.getAllCates()
            }
            this.addCatesShowDialog = false

        },
        async addCatesShow() {
            const res = await this.$http.get(`categories?type=2`)
            this.options = res.data.data;
            console.log(res)
            this.addCatesShowDialog = true
        },
        async getAllCates() {
            const res = await this.$http.get(`categories?type=3`)
            this.cateLists = res.data.data;
            console.log(res)
      }
    },
}
</script>

<style>
    .mycard {
        height: 100%
    }
    .mybtn {
        margin-top: 20px
    }
</style>
