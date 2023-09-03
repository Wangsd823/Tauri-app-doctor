<script setup>
import { reactive, toRaw } from 'vue'
// import fs from 'fs-extra'
import { MockUtils } from '../utils'
import userData from '../mock-data/user-data.json'
import NewPatient from './NewPatient.vue'
import DetailPatient from './DetailPatient.vue'

const userInfoList = reactive(userData)
const addNewPatient = reactive({
    show: false
})
const detailPatient = reactive({
    show: false,
    data: {}
})
// 组件 detail patient 处理
const openDetailPatient = (userInfo) => {
    detailPatient.data = userInfo
    detailPatient.show = true
}
// 存储数据
const saveJsonFile = async (saveData) => {
    // TODO JSON 本地存储
    // fs.writeFile('../mock-data/user-data.json', saveData, (error) => {
    //     if (error) console.error(error);
    // });
}
const addUserInfo = (userInfo) => {
    userInfoList.push({ ...userInfo, userCode: MockUtils.getUUID() })
    addNewPatient.show = false
    // try {
    //     saveJsonFile(toRaw(userInfoList))
    // } catch (err) { }
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
