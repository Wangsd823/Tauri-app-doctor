<script setup>
import { ref, reactive, watch, toRaw } from 'vue'
import { SqliteUtils } from '../utils'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '选择表格' },
    closed: { type: Function, default: () => {} }
})

const _$emit = defineEmits(['update:modelValue', 'row-click'])

const onDialogBeforeClosed = () => {
    _$emit('update:modelValue', false)
    tableData.length = 0
    queryInputVal.value = ''
}

const onDialogclosed = () => {
    props.closed()
}

const queryInputVal = ref('')
let pageNumber = 1
let pageSize = 10
const nextPageBtnDiabled = ref(true)
const lastPageBtnDiabled = ref(true)
const tableData = reactive([])
watch(queryInputVal, async (newInputValue) => {
    pageNumber = 1
    nextPageBtnDiabled.value = true
    lastPageBtnDiabled.value = true
})
const queryTableData = async ({ nextPageFlag = false, lastPageFlag = false }) => {
    const nextPageClick = () => {
        if (!nextPageBtnDiabled.value) {
            pageNumber = pageNumber + 1
            lastPageBtnDiabled.value = false
        }
    }
    const lastPageClick = () => {
        if (!lastPageBtnDiabled.value) {
            pageNumber = pageNumber - 1
            lastPageBtnDiabled.value = pageNumber === 1
        }
    }
    nextPageFlag && nextPageClick()
    lastPageFlag && lastPageClick()

    const queryParamVal = queryInputVal.value
    let _SqliteReader = new SqliteUtils.SqliteReader()
    const result = await _SqliteReader.pagingQuery(queryParamVal, pageNumber, pageSize)
    nextPageBtnDiabled.value = result.length < pageSize
    tableData.length = 0
    result.forEach((data) => {
        tableData.push(data)
    })
    _SqliteReader = null
}

const tableRowClick = (row, column, event) => {
    const clickedData = toRaw(row)
    _$emit('row-click', clickedData)
}
</script>

<style scoped>
.library_dialog_header :deep(.el-input) {
    width: 200px !important;
    margin-right: 8px;
}
.library_dialog_body {
    margin-top: 10px;
}
</style>

<template>
    <el-dialog :model-value="modelValue" width="850px" :title="title" :destroy-on-close="true" @close="onDialogBeforeClosed" @closed="onDialogclosed">
        <div class="library_dialog_header">
            <el-input v-model="queryInputVal" @keyup.enter="queryTableData" />
            <el-button type="primary" @click="queryTableData">搜索</el-button>
            <el-button type="primary" :disabled="nextPageBtnDiabled" @click="queryTableData({ nextPageFlag: true })">下一页</el-button>
            <el-button type="primary" :disabled="lastPageBtnDiabled" @click="queryTableData({ lastPageFlag: true })">上一页</el-button>
        </div>
        <div class="library_dialog_body">
            <el-table :data="tableData" :border="true" :stripe="true" style="width: 100%" @row-click="tableRowClick">
                <el-table-column prop="medicineTypeName" label="medicineTypeName" />
                <el-table-column prop="medicineAlias" label="medicineAlias" />
                <el-table-column prop="effect" label="effect" />
                <el-table-column prop="medicineUnit" label="medicineUnit" align="right" width="130" />
            </el-table>
        </div>
    </el-dialog>
</template>
