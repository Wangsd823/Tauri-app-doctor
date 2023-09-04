/**
 * common utils
 */

/**
 * 当天时间判断
 * @param {Number} dateTimeParam
 * @returns
 */
export const isCurrentDate = (dateTimeParam) => {
    if (typeof dateTimeParam !== 'number') return false
    return new Date(dateTimeParam).toDateString() == new Date().toDateString()
}
