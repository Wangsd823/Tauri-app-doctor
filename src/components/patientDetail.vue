<script setup>
/**
 * 用户诊断详情
 */
import { } from 'vue'
import { ElNotification } from 'element-plus'
import { CommonUtils } from '../utils'

const _props = defineProps({
    modelValue: { type: Boolean, default: false },
    data: { type: Object, default: {} }
})
const _$emit = defineEmits(['update:modelValue', 'complete'])

const addFollowUpRecord = () => {
    ElNotification({
        title: 'TODO',
        message: "正在开发...",
    })
}

/**
 * 清楚数据
 */
const _clearData = () => {

}
const onDialogBeforeClosed = () => {
    _$emit('update:modelValue', false)
    _clearData()
}
const imageDataToPreviewList = (imageList) => {
    if (!imageList || imageList.length === 0) return []
    return imageList.map(image => image.url)
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
                <template v-for="recordData in  _props.data.recordDataList ">
                    <el-timeline-item :timestamp="CommonUtils.showDateTimeByFormart(recordData.createDate)"
                        :color="'#0bbd87'" :type="primary" :hollow="true" placement="top">
                        <el-card header="病情详情">
                            <div>{{ recordData.illnessInfo.comment }}</div>
                            <template v-for="( imageData, index ) in  recordData.illnessInfo.imageList ">
                                <el-image :src="imageData.url"
                                    :preview-src-list="imageDataToPreviewList(recordData.illnessInfo.imageList)"
                                    width="120px" :initial-index="0" fit="cover" />
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
                    <el-button type="primary" @click="addFollowUpRecord">添加复诊信息</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>