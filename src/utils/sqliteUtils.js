import axios from 'axios'

class SqliteReader {
    constructor() {
        this._dbFile = 'medicinesearch.db'
        this._axios = axios
        this._SQL = window.SQL
        this._db = null
    }

    async _open() {
        const response = await this._axios.get(this._dbFile, { responseType: 'arraybuffer' })
        this._db = new this._SQL.Database(new Uint8Array(response.data))
    }

    /**
     * 分页查询
     * @param {String} searchVal
     * @param {Number} pageNumber
     * @param {Number} pageSize
     * @returns
     */
    pagingQuery(searchVal, pageNumber, pageSize) {
        return new Promise(async (resolve, reject) => {
            try {
                const sqStr = `
SELECT
    DISTINCT MEDICINE_TYPE_NAME, MEDICINE_ALIAS, EFFECT,
    'g' AS MEDICINE_UNIT
FROM
    (
        SELECT
            MEDICINE_TYPE_NAME_PINYIN,
            MEDICINE_TYPE_NAME,
            MEDICINE_ALIAS,
            EFFECT
        FROM
            SELF_OWNED_MEDICINE_VO
        WHERE
            MEDICINE_UNIT = 'g'
    ) AS SELF_OWNED_MEDICINE_VO_SUB
WHERE
    MEDICINE_TYPE_NAME_PINYIN LIKE '%${searchVal}%'
    OR MEDICINE_TYPE_NAME LIKE '%${searchVal}%'
LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize};
`
                if (!this._db) {
                    await this._open()
                }
                console.log('[sqliteUtils] -> sql: ', sqStr)
                const result = this._db.exec(sqStr)
                this._db = null
                resolve(this._dbResultToObject(result))
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 数据库查询结果转 JSON 对象
     * @param {Array<Object>} dbResult
     * @returns
     */
    _dbResultToObject(dbResult = {}) {
        const toObjectResult = []

        // 把数组里面的所有 column 转化为驼峰命名
        const _camelArray = (columns) => columns.map((item) => this._camelConvert(item))
        // 组成 Array<Objects>
        const _arrayToObject = (keys = [], values = []) => {
            if (keys.length === 0 || values.length === 0) return {}
            const len = keys.length > values.length ? values.length : keys.length
            const result = {}
            for (let i = 0; i < len; i++) {
                result[keys[i]] = values[i]
            }
            return result
        }
        dbResult.map((dbItem) => {
            const resultColumns = _camelArray(dbItem.columns)
            dbItem.values.map((dbItemValues) => toObjectResult.push(_arrayToObject(resultColumns, dbItemValues)))
        })
        return toObjectResult
    }

    /**
     * 转驼峰表示
     * @param {String} value
     * @param {Boolean} firstUpper 首字母是否大写
     * @description
     * * func.camel('USER_ROLE',true) => UserRole
     * * func.camel('USER_ROLE',false) => userRole
     */
    _camelConvert(value, firstUpper = false) {
        let result = value.toLowerCase()
        result = result.replace(/_([\w+])/g, (all, letter) => letter.toUpperCase())
        if (firstUpper) {
            result = result.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2)
        }
        return result
    }
}

export { SqliteReader }
