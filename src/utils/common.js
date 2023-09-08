/**
 * common utils
 */

/**
 * 当天时间判断
 * @param {Number} dateTimeParam
 * @returns
 */
export const isToday = (dateTimeParam) => {
    if (typeof dateTimeParam !== 'number') return false
    return new Date(dateTimeParam).toDateString() == new Date().toDateString()
}

/**
 * 两者日期做比较
 * @param {Number} dateTimeParam1
 * @param {Number} dateTimeParam2
 * @returns
 */
export const equalsDates = (dateTimeParam1, dateTimeParam2) => {
    if (typeof dateTimeParam !== 'number') return false
    return new Date(dateTimeParam1).toDateString() == new Date(dateTimeParam2).toDateString()
}

/**
 * (String) 空值判断
 * @param {String} value
 * @returns
 */
export const isEmptyForString = (value) => {
    return value === null || value === undefined || value.length === 0
}
