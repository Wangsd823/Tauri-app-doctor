<script setup>
import { reactive, toRaw } from 'vue'
import { MockUtils } from '../utils'
import { UserMockData } from '../mock-data/user-data'
import { RecordsMockData } from '../mock-data/records-data'
import NewPatient from './NewPatient.vue'
import DetailPatient from './DetailPatient.vue'

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
const openDetailPatient = async (userInfo) => {
    // 查询该用户下的记录
    const recordDatas = await _recordMockData.queryRecordDatasByUserCode(userInfo.userCode)
    detailPatient.data = { ...userInfo, diagnosticRecord: recordDatas }
    detailPatient.show = true
}
// TODO 拆解
const addUserInfo = async (userInfo) => {
    userInfoList.push({ ...userInfo, userCode: MockUtils.getUUID() })
    addNewPatient.show = false
    // 存储数据拆分
    // userInfo
    const { diagnosticRecord, ...userData } = userInfo
    const userCode = MockUtils.getUUID()
    const updateDate = new Date().getTime()
    console.info('[Home.vue] -> addUserResult: ', { ...userData, userCode, updateDate })
   await _userMockData.addSingleUserData({ ...userData, userCode, updateDate }).catch(error => console.error(error))
    // record
    const recordData = { ...toRaw(diagnosticRecord[0]), userCode, createDate: updateDate, [_recordMockData.keyPath]: MockUtils.getUUID() }
    console.info('[Home.vue] -> addUserResult: ', recordData)
    await _recordMockData.addSingleRecordData(recordData).catch(error => console.error(error))
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
            <template v-for="userInfo in userInfoList">
                <el-space wrap :size="10">
                    <el-card shadow="hover" class="card-user_info_wrapper" @click="openDetailPatient(userInfo)">
                        <el-avatar :size="100" shape="square" fit="fill"
                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
                        <el-form style="width: 100%;" label-position="left">
                            <el-form-item label="姓名">{{ userInfo.userName }}</el-form-item>
                            <el-form-item label="年纪">{{ userInfo.age }}&nbsp;岁</el-form-item>
                            <el-form-item label="联系方式">{{ userInfo.phone }}</el-form-item>
                            <el-form-item label="地址">{{ userInfo.address }}</el-form-item>
                        </el-form>
                    </el-card>
                </el-space>
            </template>
        </div>
        <!-- 组件部分 -->
        <NewPatient v-model="addNewPatient.show" @save="addUserInfo" />
        <DetailPatient v-model:modelValue="detailPatient.show" :data="detailPatient.data"
            @closed="detailPatient.show = false" />
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
