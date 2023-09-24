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
    if (typeof dateTimeParam1 !== 'number') return false
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

/**
 * 时间戳展示
 * TODO 暂时处理
 * @param {Number} dateTime
 * @returns
 */
export const showDateTimeByFormart = (dateTime) => {
    const _date = new Date(dateTime)
    // yyyy-mm-dd
    const _year = _date.getFullYear()
    const _month = _date.getMonth() + 1
    const _day = _date.getDate()
    return `${_year}-${_month}-${_day}`
}

/**
 * 图片转字节
 * @param {File} file
 * @returns
 */
export const imageToArrayBuffer = (file = null) => {
    return new Promise((resolve, reject) => {
        if (!file) return reject(null)
        if (!file) return null
        const fileReader = new FileReader()
        fileReader.onload = (event) => {
            resolve(event.target.result)
        }
        fileReader.readAsDataURL(file)
    })
}
