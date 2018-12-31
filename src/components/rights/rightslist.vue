<template>
    <el-card class="mycard">
        <my-bread title1="权限管理" title2="权限列表"></my-bread>
        <el-table
            :data="rightslist"
            height="550px"
            class="my_table"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="authName"
                label="权限名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径">
            </el-table-column>
            <el-table-column
                prop="level"
                label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-if="scope.row.level === '1'">二级</span>
                    <span v-if="scope.row.level === '2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            rightslist:[]
        }
    },
    created() {
        this.getAllRights()
    },
    methods: {
        async getAllRights() {
            const res = await this.$http.get(`rights/list`)
            this.rightslist = res.data.data
        }
    },
}
</script>

<style>
.mycard {
    height: 100%;
}
.my_table {
    margin-top: 20px;
}
</style>
