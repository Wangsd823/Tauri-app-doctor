import mockjs from 'mockjs'

const Random = mockjs.Random

/**
 * UUID
 */
export const getUUID = () => {
    return Random.guid()
}

/**
 * 获取当天日期
 */
export const getCurrentDate = (formatStr = 'yyyy-MM-dd') => {
    return Random.now(formatStr)
}
