<script setup>
/**
 * 添加患者医案
 */
import { reactive, ref, toRaw } from 'vue'
import { InitPatientData } from '../config/index'
import libraryDialog from './libraryDialog.vue'
import { CommonUtils } from '../utils'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    data: { type: Object, default: {} }
})
const _$emit = defineEmits(['update:modelValue', 'complete'])

/**
 * 默认数据变量
 */
// 病情信息
let illnessInfo = reactive(InitPatientData.initIllnessInfo())
// 诊断信息
const diagnosticNote = ref('')
// 处方信息
let formulaInfo = reactive(InitPatientData.initFormulaInfo())
// 按语
const notesStr = ref('')

// 组件
const libraryDialogVisible = ref(false)
// 组件函数
const libraryDialogRowClick = (selectedInfo) => {
    console.log('[libraryDialogRowClick]: ', selectedInfo)
    libraryDialogVisible.value = false
    formulaInfo.subList.push({
        labelText: `${selectedInfo.medicineTypeName}(单位：${selectedInfo.medicineUnit})`,
        inputValue: 0.01
    })
}
const openFormulaDialog = () => {
    libraryDialogVisible.value = true
}
const resetFormulaSubList = () => {
    formulaInfo.subList.length = 0
}
const savePatientInfo = () => {
    const addRecordData = {
        illnessInfo: toRaw(illnessInfo),
        formulaInfo: toRaw(formulaInfo),
        notesStr: notesStr.value,
        diagnosticNote: diagnosticNote.value
    }
    _$emit('complete', addRecordData)
}

// 图片上传转化
const onIllnessImageChange = async (uploadFile) => {
    const imageArraybuffer = await CommonUtils.imageToArrayBuffer(uploadFile.raw)
    illnessInfo.imageList.forEach(imageInfo => {
        if (uploadFile.uid === imageInfo.uid) {
            imageInfo.urlArrayBuffer = imageArraybuffer
        }
    })
}
const onFormulaInfoImageChange = async (uploadFile) => {
    const imageArraybuffer = await CommonUtils.imageToArrayBuffer(uploadFile.raw)
    formulaInfo.imageList.forEach(imageInfo => {
        if (uploadFile.uid === imageInfo.uid) {
            imageInfo.urlArrayBuffer = imageArraybuffer
        }
    })
}

/**
 * 清楚数据
 */
const _clearData = () => {
    // 病情信息
    illnessInfo = reactive(InitPatientData.initIllnessInfo())
    // 处方信息
    formulaInfo = reactive(InitPatientData.initFormulaInfo())
}
const onDialogBeforeClosed = () => {
    _$emit('update:modelValue', false)
    _clearData()
}

</script>
<style scoped>
.add_follow_patient_container :deep(.el-overlay-dialog) {
    overflow: hidden;
}

.add_follow_patient_container :deep(.el-dialog__body) {
    max-height: 35rem;
    overflow-y: scroll;
}

.add_follow_patient_container :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
<template>
    <div class="add_follow_patient_container">
        <el-dialog :model-value="modelValue" width="750px" title="添加患者复诊记录" :destroy-on-close="true"
            @close="onDialogBeforeClosed">
            <el-descriptions title="患者基础信息" :border="true">
                <el-descriptions-item label="姓名" width="120px">{{ props.data.userName }}</el-descriptions-item>
                <el-descriptions-item label="年龄" width="120px">{{ props.data.userAge }}</el-descriptions-item>
                <el-descriptions-item label="联系方式" width="120px">{{ props.data.userPhone }}</el-descriptions-item>
                <el-descriptions-item label="联系地址" width="120px">{{ props.data.userAddress }}</el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <el-card header="病情详情">
                <el-input v-model="illnessInfo.comment" :rows="2" type="textarea" />
                <div style="height: 10px;"></div>
                <el-upload v-model:file-list="illnessInfo.imageList" action="#" :auto-upload="false"
                    :on-change="onIllnessImageChange" list-type="picture-card">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-card>
            <el-divider />
            <el-card header="诊断情况">
                <el-input v-model="diagnosticNote" :rows="3" type="textarea" />
            </el-card>
            <el-divider />
            <el-card>
                <template #header>
                    <div class="card-header">
                        <div>处方信息</div>
                        <div>
                            <el-button type="success" @click="openFormulaDialog">选择处方</el-button>
                            <el-button type="info" @click="resetFormulaSubList">重置</el-button>
                        </div>
                    </div>
                </template>
                <el-input v-model="formulaInfo.comment" :rows="3" type="textarea" />
                <div style="height: 10px;"></div>
                <el-upload v-model:file-list="formulaInfo.imageList" action="#" :auto-upload="false"
                    :on-change="onFormulaInfoImageChange" list-type="picture-card">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <div style="height: 10px;"></div>
                <el-form :inline="true" label-position="left" label-width="200" style="width: 100%;">
                    <template v-for="info in formulaInfo.subList">
                        <el-form-item :label="info.labelText">
                            <el-input-number v-model="info.inputValue" :min="0" :step="0.01" />
                        </el-form-item>
                    </template>
                </el-form>
            </el-card>
            <el-divider />
            <el-card header="按语情况">
                <el-input v-model="notesStr" :rows="3" type="textarea" />
            </el-card>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="savePatientInfo">保存</el-button>
                </span>
            </template>
        </el-dialog>
        <libraryDialog v-model="libraryDialogVisible" @row-click="libraryDialogRowClick" />
    </div>
</template>