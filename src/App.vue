<script setup>
import { ref } from 'vue'
import Home from './components/Home.vue'
import PatientRecords from './components/PatientRecords.vue'

const activeIndex = ref('1')

const searchInput = ref('')

const handleSelect = (key) => {
    activeIndex.value = key
}
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header class="el-header-wrapper">
                <el-row class="el-row_header-wrapper" :gutter="2">
                    <el-col :span="6">
                        <h2>居山医康堂</h2>
                    </el-col>
                    <el-col :span="10">
                        <el-menu class="el-menu-demo" mode="horizontal" :default-active="activeIndex" :ellipsis="false"
                            @select="handleSelect">
                            <el-menu-item index="1">工作台
                                <el-icon>
                                    <EditPen />
                                </el-icon>
                            </el-menu-item>
                            <el-menu-item index="2">患者管理
                                <el-icon>
                                    <User />
                                </el-icon>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="12"></el-col>
                            <el-col :span="12" class="search-input_wrapper">
                                <el-input v-model="searchInput" class="w-50 m-2" size="large">
                                    <template #append>
                                        <el-icon>
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <Home v-if="activeIndex == 1" />
                <PatientRecords v-if="activeIndex == 2" />
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.common-layout {
    width: 100%;
    height: 100%;
}

.common-layout .el-header-wrapper {
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
}

.common-layout .el-header-wrapper .el-row_header-wrapper {
    width: 100% !important;
    display: flex;
    align-items: center;
}

.common-layout .el-header-wrapper .el-row_header-wrapper :deep(.el-menu--horizontal.el-menu) {
    background-color: transparent;
}

.common-layout .el-header-wrapper .el-row_header-wrapper :deep(.el-input--large .el-input__wrapper) {
    padding: 0;
}

.common-layout .el-header-wrapper .el-row_header-wrapper :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: none;
    border: 1px solid #ccc;

    :deep(input) {
        box-shadow: none;
    }
}
</style>
