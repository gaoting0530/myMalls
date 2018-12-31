<template>
    <el-card class="mycard">
        <my-bread title1="商品管理" title2="商品列表"></my-bread>
        <el-alert
            class="myalert"
            title="添加商品信息"
            type="success"
            center
            show-icon>
        </el-alert>
        <el-steps :active="1*active" finish-status="success" class="mystep">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <el-form :model="form" label-position="top">
            <el-tabs tab-position="left" style="height: 400px;overflow: auto" class="mytabs" v-model="active" @tab-click="tabChange()">
                <el-tab-pane label="基本信息" name="1">
                    <el-form-item label="商品名称" :label-width="formLabelWidth">
                        <el-input v-model="form.goods_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" :label-width="formLabelWidth">
                        <el-input v-model="form.goods_price" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" :label-width="formLabelWidth">
                        <el-input v-model="form.goods_number" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" :label-width="formLabelWidth">
                        <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" :label-width="formLabelWidth">
                        {{selectedOptions3}}
                        <el-cascader
                        :options="options"
                        v-model="selectedOptions3"
                        :props="defaultProps"
                        clearable
                        ></el-cascader>
                    </el-form-item>
                
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2">
                     <el-form-item :label="item.attr_name" :label-width="formLabelWidth" v-for="(item,i) in active_params" :key="i">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="3">
                    <el-form-item :label="item.attr_name" v-for="(item,i) in static_params" :key="i" :label-width="formLabelWidth">
                        <el-input v-model="item.attr_vals" autocomplete="off"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="4">
                    <el-upload
                    class="upload-demo"
                    action="http://localhost:8888/api/private/v1/upload"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :headers="headers"
                    list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                    <quill-editor class="myquill" v-model="form.goods_introduce"></quill-editor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
    components: {
        quillEditor
    },
    data() {
        return {
            query:'',
            active: '1',
            form:{
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: [],
                attrs: []
            },
            options:[],
            checkList:[],
            selectedOptions3:[1,3,6],
            defaultProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            formLabelWidth:'120px',
            active_params:[],
            static_params:[],
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        //添加商品
        async addGoods() {
            this.form.goods_cat = this.selectedOptions3.join(',')
            const arr1 = this.active_params.map(item => {
                item.attr_vals = item.attr_vals.join(',')
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
            })
            const arr2 = this.static_params.map(item => {
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
            })
            this.form.attrs = [...arr1,...arr2]
            const res = await this.$http.post(`goods`,this.form)
            const {meta:{msg,status}} = res.data
            if(status === 201) {
                this.$message.success(msg)
                this.$router.push({name:'goods'})
            }
        },
        // 图片上传
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleSuccess(file) {
            console.log(file);
        },       
        async tabChange() {
            if(this.active === '2') {
                if(this.selectedOptions3.length !== 3) {
                    this.$message.warning('请先选择商品的三级分类')
                    return
                }
                //获取动态参数
                const res = await this.$http.get(`categories/${this.selectedOptions3[2]}/attributes?sel=many`)
                res.data.data.forEach(item => {
                    item.attr_vals = item.attr_vals.split(',')
                    item.attr_vals.forEach(item => {
                        this.checkList.push(item)
                    })
                });
                this.active_params = res.data.data
            }
            if(this.active === '3') {
                if(this.selectedOptions3.length !== 3) {
                    this.$message.warning('请先选择商品的三级分类')
                    return
                }
                //获取动态参数
                const res = await this.$http.get(`categories/${this.selectedOptions3[2]}/attributes?sel=only`)
                // res.data.data.forEach(item => {
                //     item.attr_vals = item.attr_vals.split(',')
                //     item.attr_vals.forEach(item => {
                //         this.checkList.push(item)
                //     })
                // });
                this.static_params = res.data.data
                console.log(res)
            }
            if(this.active === '4') {
                if(this.selectedOptions3.length !== 3) {
                    this.$message.warning('请先商品的三级分类');
                    return;
                }
            }
        },
        async getGoodsList() {
            const res = await this.$http.get(`categories?type=3`)
            this.options = res.data.data
            console.log(res)
        }
    },
}
</script>

<style>
.mycard {
    height: 100%;
}
.myalert,.mytabs {
    margin-top: 20px
}
.mystep {
    margin-top: 20px;
    padding: 0 20px;
}
.myquill {
    margin-top: 20px;
    height: 400px;
}
.ql-editor p {
    min-height: 400px;
}
</style>
