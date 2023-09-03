<script setup>
import { reactive } from 'vue';
import userData from '../mock-data/user-data.json'

// TODO search info
const searchParams = reactive({
    userName: ''
})
</script>
<template>
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" label-width="100">
                <el-form-item label="患者姓名">
                    <el-input v-model="searchParams.userName" />
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 列表 -->
        <el-col :span="24">
            <el-table :data="userData" style="width: 100%">
                <el-table-column type="index" width="50" />
                <el-table-column prop="userName" label="患者姓名" />
                <el-table-column prop="age" label="患者年纪" />
                <el-table-column prop="phone" label="联系方式" />
                <el-table-column prop="address" label="地址" />
                <el-table-column fixed="right" label="操作">
                    <template #default>
                        <el-button link type="primary" size="small">查看诊断记录</el-button>
                        <el-button link type="primary" size="small">编辑患者信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<style scoped></style>