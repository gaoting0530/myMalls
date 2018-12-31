<template>
    <el-card class="mycard">
        <my-bread title1="商品管理" title2="分类参数"></my-bread>
        <el-alert
            class="myalert"
            title=" 注意只允许为第三级分类设置参数"
            type="warning"
            show-icon>
        </el-alert>
        <el-form>
            <el-form-item label="请选择商品分类" :label-width="formLabelWidth">
                {{selectedOptions3}}
                <el-cascader
                :options="options"
                v-model="selectedOptions3"
                :props="defaultProps"
                clearable
                ></el-cascader>
            </el-form-item>
        </el-form>
            <el-tabs v-model="active" type="card" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="1">
                    <el-button type="danger">设置动态参数</el-button>
                    <el-table
                class="mytable"
                border
                height="420px"
                :data="activeParams"
                style="width: 100%">
                <el-table-column
                type="expand"
                width="80">
                <template slot-scope="scope">
                    <el-tag
                        :key="i"
                        v-for="(item,i) in scope.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(scope.row,item)">
                        {{item}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
                </el-table-column>
                <el-table-column
                    prop="attr_name"
                    label="属性名称">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="2">
                    <el-button type="danger">设置静态参数</el-button>
                     <el-table
                class="mytable"
                border
                height="320px"
                :data="static_params"
                style="width: 100%">
                <el-table-column
                    type="index">
                </el-table-column>
                <el-table-column
                    prop="attr_name"
                    label="属性名称">
                </el-table-column>
                <el-table-column
                    prop="attr_vals"
                    label="属性值">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
                </el-tab-pane>
            </el-tabs>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: '120px',
            options:[],
            selectedOptions3:[1,3,6],
            defaultProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            active: '1',
            activeParams:[],
            checkList:[],
            static_params:[],
            inputVisible: false,
            inputValue: ''

        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        async handleClose(attr,val) {
            attr.attr_vals.splice(attr.attr_vals.indexOf(val),1)
            // categories/:id/attributes/:attrid
            const res = await this.$http.put(`categories/${this.selectedOptions3[2]}/attributes/${attr.attr_id}`,{
                attr_name : attr.attr_name,
                attr_sel : 'many',
                attr_vals : attr.attr_vals.join(','),
            })
            this.$message.success(res.data.meta.msg)
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
      },

      async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue)
          const res = await this.$http.put(`categories/${this.selectedOptions3[2]}/attributes/${attr.attr_id}`,{
                attr_name : attr.attr_name,
                attr_sel : 'many',
                attr_vals : attr.attr_vals.join(','),
            })
        this.$message.success(res.data.meta.msg)
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
        async handleClick() {
         if(this.active === '1') {
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
                this.activeParams = res.data.data
            }
            if(this.active === '2') {
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
        height: 100%
    }
    .myalert,.mytable{
        margin-top: 20px;
        margin-bottom: 20px
    }
      .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
