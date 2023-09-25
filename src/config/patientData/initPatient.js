/**
 * 患者相关初始化数据
 */

/**
 * 基础用户信息
 * @returns
 */
export const initUserBaseInfo = () => {
    return { userName: '', userAge: 0, userPhone: '', userAddress: '' }
}

/**
 * 病情
 * @returns
 */
export const initIllnessInfo = () => {
    return { imageList: [], comment: '' }
}
/**
 * 处方
 * @returns
 */
export const initFormulaInfo = () => {
    return { name: '', subList: [], imageList: [], comment: '' }
}
