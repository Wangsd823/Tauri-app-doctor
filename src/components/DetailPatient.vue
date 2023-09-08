<script setup>
import { defineProps, ref } from 'vue'
import { ElNotification } from 'element-plus'

const props = defineProps(['modelValue', 'data'])
const $emits = defineEmits(['closed'])

// 诊断记录布局
const collapseActiveNames = ref(['0'])

const addFollowUpRecord = () => {
    ElNotification({
        title: 'TODO',
        message: "正在开发...",
    })
}
const closedDialog = () => {
    $emits('closed', false)
}
</script>

<template>
    <el-dialog v-model="props.modelValue" title="浏览医案" width="40%" class="new-patient-dialog-wrapper"
        @closed="closedDialog">
        <!-- 用户信息 -->
        <el-row>
            <el-col :span="24">
                <h2>患者简介</h2>
            </el-col>
            <el-col :span="8">姓名: {{ props.data.userName }}</el-col>
            <el-col :span="8">年纪: {{ props.data.age }}</el-col>
            <el-col :span="8">联系方式: {{ props.data.phone }}</el-col>
            <el-col :span="24">地址: {{ props.data.address }}</el-col>
        </el-row>
        <el-divider />
        <!-- 诊断记录 -->
        <!-- TODO 初诊 -->
        <el-collapse v-model="collapseActiveNames">
            <template v-for="(recordInfo, index) in props.data.diagnosticRecord">
                <el-collapse-item :title="`${index === 0 ? '初诊记录' : '复诊记录'}: ${recordInfo.date}`" :name="index">
                    <el-row :gutter="2">
                        <el-col :span="12">
                            <h3>病情</h3>
                            <el-text>{{ recordInfo.record.illnessInfo.comment }}</el-text>
                        </el-col>
                        <el-col :span="24">
                            <template v-for="imageInfo in recordInfo.record.illnessInfo.images">
                                <el-image style="width: 100px;" :src="imageInfo.url" fit="fill" />
                            </template>
                        </el-col>
                        <el-col :span="24">
                            <h3>诊断结果</h3>
                            <el-text>
                                {{ recordInfo.record.diagnosis }}
                            </el-text>
                        </el-col>
                        <el-col :span="24">
                            <h3>处方</h3>
                            <el-text>
                                处方名称: {{ recordInfo.record.prescription.name }}
                            </el-text>
                            <template v-for="info in recordInfo.record.prescription.infoList">
                                <el-col :span="4">
                                    <el-text>{{ info.inputName }}: {{ info.inputValue }}g</el-text>
                                </el-col>
                            </template>
                            <el-text>
                                备注：{{ recordInfo.record.prescription.comment }}
                            </el-text>
                        </el-col>
                        <el-col :span="24">
                            <h3>按语</h3>
                            <el-text>{{ recordInfo.record.note }}</el-text>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </template>
        </el-collapse>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="addFollowUpRecord">
                    添加复诊
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>