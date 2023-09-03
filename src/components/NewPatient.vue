<script setup>
import { defineProps, reactive, ref, defineEmits } from 'vue'
import { MockUtils } from '../utils'

// props
const dialogVisible = defineProps(['value'])
// emits
const saveEmit = defineEmits(['save'])
// data
const userInfo = reactive({
    userName: '',
    age: 1,
    phone: '',
    address: '',
    diagnosticRecord: [{
        date: MockUtils.getCurrentDate(),
        record: {
            illnessInfo: {
                images: [
                    {
                        name: 'food.jpeg',
                        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                    }
                ],
                comment: ''
            },
            diagnosis: '',
            prescription: {
                comment: '',
                infoList: []
            },
            note: ''
        }
    }],

})
let collapseActiveNames = ref(['1', '2', '3', '4'])
const collapseChange = (value) => {
    collapseActiveNames = value
}

// 选择处方
const fetchPrescriptionApi = (queryValue, callback) => {
    // TODO 数据库 sqlite
    callback && callback([])
}
const addpRescriptionInfo = () => {
    userInfo.diagnosticRecord[0].record.prescription.infoList.push({
        inputName: '',
        inputValue: 1
    })
}
// 提交保存信息
const saveNewPatientInfo = () => {
    saveEmit('save', userInfo)
}


</script>
<template>
    <el-dialog v-model="dialogVisible" title="新建医案" width="50%" class="new-patient-dialog-wrapper">
        <el-form :inline="true" style="width: 100%;" label-position="right" label-width="100">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名" style="width: 100%;">
                        <el-input v-model="userInfo.userName" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="年龄" style="width: 100%;">
                        <el-input-number v-model="userInfo.age" :min="1" :max="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式" style="width: 100%;">
                        <el-input v-model="userInfo.phone" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="地址" style="width: 100%;">
                        <el-input v-model="userInfo.address" :rows="2" type="textarea" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider />
        <el-collapse v-model="collapseActiveNames" @change="collapseChange">
            <el-collapse-item title="病情" name="1">
                <el-row :gutter="2">
                    <el-col :span="24">
                        <el-upload v-model:file-list="userInfo.diagnosticRecord[0].record.illnessInfo.images"
                            list-type="picture-card">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-col>
                    <el-col :span="24">
                        <el-input v-model="userInfo.diagnosticRecord[0].record.illnessInfo.comment" :rows="3" type="textarea"
                            placeholder="请填写病情描述." />
                    </el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="诊断" name="2">
                <el-input v-model="userInfo.diagnosticRecord[0].record.diagnosis" :rows="3" type="textarea"
                    placeholder="请填写诊断描述." />
            </el-collapse-item>
            <el-collapse-item title="处方" name="3">
                <el-row :gutter="2">
                    <el-col :span="24" style="margin-bottom: 10px;">
                        处方名称: <el-input style="width: 200px;" id="prescription-el-input-name-id"
                            v-model="userInfo.diagnosticRecord[0].record.prescription.name" />
                    </el-col>
                    <el-col :span="24">
                        <el-row>
                            <template v-for="presInfo in userInfo.diagnosticRecord[0].record.prescription.infoList">
                                <el-col :span="10" style="margin-bottom: 5px;">
                                    <el-autocomplete v-model="presInfo.inputName" :fetch-suggestions="fetchPrescriptionApi"
                                        clearable class="inline-input w-50" placeholder="请填写." />
                                    <el-input-number v-model="presInfo.inputValue" :min="0"></el-input-number>
                                    <el-text>&nbsp;g</el-text>
                                </el-col>
                            </template>
                            <el-col :span="4">
                                <el-button @click="addpRescriptionInfo">添加</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="24">
                        <el-input v-model="userInfo.diagnosticRecord[0].record.prescription.comment" :rows="3" type="textarea"
                            placeholder="请填写备注." />
                    </el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="按语" name="4">
                <el-input v-model="userInfo.diagnosticRecord[0].record.note" :rows="3" type="textarea" placeholder="请填写按语." />
            </el-collapse-item>
        </el-collapse>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="saveNewPatientInfo">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style>
.new-patient-dialog-wrapper {
    overflow: hidden !important;
}

/* TODO 滚动区域 修改 */
.new-patient-dialog-wrapper .el-dialog__body {
    max-height: 580px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.new-patient-dialog-wrapper .el-collapse-item__header {
    font-size: 18px;
}
</style>