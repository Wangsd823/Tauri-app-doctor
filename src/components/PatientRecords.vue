<script setup>
/**
 * 患者管理
 */
import { reactive } from 'vue'
import patientDetail from './patientDetail.vue'
import { UserMockData } from '../mock-data/user-data'
import { RecordsMockData } from '../mock-data/records-data'

const searchParams = reactive({
    userName: ''
})
// 数据
const userDataList = reactive([])
let pageNumber = 1
let pageSize = 10

const _UserMockData = new UserMockData()
const _recordMockData = new RecordsMockData()

_UserMockData.queryUserInfoForPage(pageNumber, pageSize, searchParams).then(result => {
    result && result.forEach(userData => userDataList.push(userData))
})

const detailPatient = reactive({
    show: false,
    data: {}
})
const patientDetailComplete = () => {
    detailPatient.show = false
}
const openDetailPatient = async (userData) => {
    // 查询该用户下的记录
    const recordDatas = await _recordMockData.queryRecordDatasByUserCode(userData.userCode)
    detailPatient.data = { ...userData, recordDataList: recordDatas }
    detailPatient.show = true
}
</script>
<template>
    <div>
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
                <el-table :data="userDataList" style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="userName" label="患者姓名" />
                    <el-table-column prop="userAge" label="患者年纪" />
                    <el-table-column prop="userPhone" label="联系方式" />
                    <el-table-column prop="userAddress" label="地址" />
                    <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="openDetailPatient(scope.row)">查看诊断记录</el-button>
                            <el-button link type="primary" size="small">编辑患者信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <patientDetail v-model="detailPatient.show" :data="detailPatient.data" @complete="patientDetailComplete" />
    </div>
</template>
<style scoped></style>