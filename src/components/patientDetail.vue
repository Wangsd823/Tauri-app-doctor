<script setup>
/**
 * 用户诊断详情
 */
import { reactive, ref } from 'vue'
import { CommonUtils, MockUtils } from '../utils'
import addFollowRecord from './addFollowRecord.vue'
import { RecordsMockData } from '../mock-data/records-data'


const _props = defineProps({
    modelValue: { type: Boolean, default: false },
    data: { type: Object, default: {} }
})
const _$emit = defineEmits(['update:modelValue', 'complete'])

// 当前页面需要展示的数据
console.log('_props.data: ', _props.data)
// indexedDB 数据Store
const _recordMockData = new RecordsMockData()

// 复诊记录组件
const followRecordVisible = ref(false)
const onFollowRecordComplete = async (followRecordData) => {
    const updateDate = new Date().getTime()
    const recordData = { ...followRecordData, userCode: _props.data.userCode, createDate: updateDate, [_recordMockData.keyPath]: MockUtils.getUUID() }
    // 添加到当前详情缓存数据中
    _props.data.recordDataList.push(recordData)
    followRecordVisible.value = false
    // 添加 indexedDB 数据中
    console.info('[Home.vue] -> addUserResult: ', recordData)
    await _recordMockData.addSingleRecordData(recordData)
}
const onAddFollowUpRecord = () => {
    followRecordVisible.value = true
}

/**
 * 清楚数据
 */
const _clearData = () => { }
const onDialogBeforeClosed = () => {
    _$emit('update:modelValue', false)
    _clearData()
}
const imageDataToPreviewList = (imageList) => {
    if (!imageList || imageList.length === 0) return []
    return imageList.map(image => image.urlArrayBuffer)
}

</script>
<style scoped>
.user_patient_detail_container :deep(.el-overlay-dialog) {
    overflow: hidden;
}

.user_patient_detail_container :deep(.el-dialog__body) {
    max-height: 35rem;
    overflow-y: scroll;
}
</style>
<template>
    <div class="user_patient_detail_container">
        <el-dialog :model-value="_props.modelValue" width="750px" title="患者医案详情" :destroy-on-close="true"
            @close="onDialogBeforeClosed">
            <el-descriptions title="患者基础信息" :border="true">
                <el-descriptions-item label="姓名" width="120px">{{ _props.data.userName }}</el-descriptions-item>
                <el-descriptions-item label="年龄" width="120px">{{ _props.data.userAge }}</el-descriptions-item>
                <el-descriptions-item label="联系方式" width="120px">{{ _props.data.userPhone }}</el-descriptions-item>
                <el-descriptions-item label="联系地址" width="120px">{{ _props.data.userAddress }}</el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <el-timeline>
                <template v-for="recordData in _props.data.recordDataList">
                    <el-timeline-item :timestamp="CommonUtils.showDateTimeByFormart(recordData.createDate)"
                        :color="'#0bbd87'" :type="primary" :hollow="true" placement="top">
                        <el-card header="病情详情">
                            <div>{{ recordData.illnessInfo.comment }}</div>
                            <template v-for="( imageData, index ) in  recordData.illnessInfo.imageList ">
                                <el-image :src="imageData.urlArrayBuffer"
                                    :preview-src-list="imageDataToPreviewList(recordData.illnessInfo.imageList)"
                                    style="width: 200px;" :initial-index="0" fit="cover" />
                            </template>
                        </el-card>
                        <el-card header="诊断情况">
                            <div>{{ recordData.diagnosticNote }}</div>
                        </el-card>
                        <el-card header="处方信息">
                            <div>{{ recordData.formulaInfo.comment }}</div>
                            <el-descriptions title="">
                                <template v-for=" subData  in  recordData.formulaInfo.subList ">
                                    <el-descriptions-item :label="subData.labelText" width="200px">{{ subData.inputValue
                                    }}</el-descriptions-item>
                                </template>
                            </el-descriptions>
                        </el-card>
                        <el-card header="按语情况">
                            <div>{{ recordData.notesStr }}</div>
                        </el-card>
                    </el-timeline-item>
                </template>

            </el-timeline>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="onAddFollowUpRecord">添加复诊信息</el-button>
                </span>
            </template>
        </el-dialog>
        <addFollowRecord v-model="followRecordVisible" :data="_props.data" @complete="onFollowRecordComplete" />
    </div>
</template>