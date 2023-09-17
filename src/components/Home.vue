<script setup>
import { reactive, toRaw } from 'vue'
import { MockUtils } from '../utils'
import { UserMockData } from '../mock-data/user-data'
import { RecordsMockData } from '../mock-data/records-data'
import addPatient from './addPatient.vue'
import patientDetail from './patientDetail.vue'

// 组件部分
const addNewPatient = reactive({
    show: false
})
const detailPatient = reactive({
    show: false,
    data: {}
})

// 数据部分
const userInfoList = reactive([])

// mock data
const _userMockData = new UserMockData()
const _recordMockData = new RecordsMockData()

// 查询 home 主数据
const queryHomeData = async () => {
    const userDatas = await _userMockData.queryUserDatasForLastWeek()
    console.log('queryHomeData: ', userDatas)
    userDatas.forEach(_user => {
        userInfoList.push(_user)
    })
}
// 初次查询数据
setTimeout(() => { queryHomeData() })

// 组件 detail patient 处理
const openDetailPatient = async (userData) => {
    // 查询该用户下的记录
    const recordDatas = await _recordMockData.queryRecordDatasByUserCode(userData.userCode)
    detailPatient.data = { ...userData, recordDataList: recordDatas }
    detailPatient.show = true
}
const patientDetailComplete = () => {
    detailPatient.show = false
}

const addUserInfo = async (userData) => {
    const userCode = MockUtils.getUUID()
    const updateDate = new Date().getTime()
    userInfoList.push({ ...userData.userBaseInfo, userCode })
    addNewPatient.show = false

    // 存储数据拆分
    const { userBaseInfo, ...diagnosticData } = userData
    console.info('[Home.vue] -> addUserResult: ', { ...userBaseInfo, userCode, updateDate })
    await _userMockData.addSingleUserData({ ...userBaseInfo, userCode, updateDate })
    // record
    const recordData = { ...diagnosticData, userCode, createDate: updateDate, [_recordMockData.keyPath]: MockUtils.getUUID() }
    console.info('[Home.vue] -> addUserResult: ', recordData)
    await _recordMockData.addSingleRecordData(recordData)
}

</script>

<template>
    <div class="home_wrapper">
        <el-row>
            <el-col :span="24">
                <el-affix target=".home_wrapper" :offset="10">
                    <el-button type="primary" @click="addNewPatient.show = true">新增患者
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                </el-affix>
            </el-col>
        </el-row>
        <!-- 患者信息 -->
        <div class="userinfo-show-wrapper">
            <template v-for="userData in userInfoList">
                <el-space wrap :size="10">
                    <el-card shadow="hover" class="card-user_info_wrapper" @click="openDetailPatient(userData)">
                        <el-avatar :size="100" shape="square" fit="fill"
                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
                        <el-form style="width: 100%;" label-position="left">
                            <el-form-item label="姓名">{{ userData.userName }}</el-form-item>
                            <el-form-item label="年纪">{{ userData.userAge }}&nbsp;岁</el-form-item>
                            <el-form-item label="联系方式">{{ userData.userPhone }}</el-form-item>
                            <el-form-item label="地址">{{ userData.userAddress }}</el-form-item>
                        </el-form>
                    </el-card>
                </el-space>
            </template>
        </div>
        <!-- 组件部分 -->
        <addPatient v-model="addNewPatient.show" @complete="addUserInfo" />
        <patientDetail v-model="detailPatient.show" :data="detailPatient.data" @complete="patientDetailComplete" />
    </div>
</template>

<style scoped>
.home_wrapper {
    position: relative;
    box-sizing: border-box;
}

.home_wrapper .userinfo-show-wrapper {
    margin-top: 30px;
    overflow-y: scroll;
    max-height: calc(100vh - 200px);
}

.home_wrapper .card-user_info_wrapper {
    width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.home_wrapper .card-user_info_wrapper :deep(.el-form-item) {
    margin-bottom: 10px;
}
</style>
