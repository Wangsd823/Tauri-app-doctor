import { IndexedDBUtils, CommonUtils } from '../utils'

class UserMockData extends IndexedDBUtils.IndexedDBBase {
    /**
     * 更新用户信息
     * @param {Object} userData
     * @returns
     */
    putSingleUserData(userData) {
        return new Promise(async (resolve, reject) => {
            const _objectStore = await this._getObjectStore([this.storeName], 'readwrite', this.storeName)
            const request = _objectStore.put(userData)
            request.onerror = (event) => reject(event.target.error)
            request.onsuccess = (event) => resolve(event.target.result)
        })
    }
    /**
     * 添加用户信息
     * @param {Object} userData
     * @returns
     */
    addSingleUserData(userData) {
        return new Promise(async (resolve, reject) => {
            const _objectStore = await this._getObjectStore([this.storeName], 'readwrite', this.storeName)
            const request = _objectStore.add(userData)
            request.onerror = (event) => reject(event.target.error)
            request.onsuccess = (event) => resolve(event.target.result)
        })
    }

    /**
     * 查询所有用户信息
     * @returns
     */
    queryUserInfoForAll() {
        return new Promise(async (resolve, reject) => {
            const _objectStore = await this._getObjectStore([this.storeName], 'readonly', this.storeName)
            const _cursor = _objectStore.getAll()
            _cursor.onerror = (event) => reject(event.target.error)
            const result = []
            _cursor.onsuccess = (event) => {
                const cursor = event.target.result
                if (!cursor) {
                    this._close()
                    cursor.forEach((item) => result.push(item))
                    return resolve(result)
                }
            }
        })
    }

    /**
     * 分页查询用户信息
     * @param {Number} pageNum
     * @param {Number} pageSize
     * @param {userName: String} { userName } 不支持模糊查询
     * @returns
     */
    queryUserInfoForPage(pageNum, pageSize, { userName }) {
        return new Promise(async (resolve, reject) => {
            let index = null
            let result = []
            const _objectStore = await this._getObjectStore([this.storeName], 'readonly', this.storeName)
            let _openedCursor = CommonUtils.isEmptyForString(userName)
                ? _objectStore.openCursor()
                : _objectStore.index('user_table-userName').openCursor(IDBKeyRange.only(userName))
            _openedCursor.onerror = (event) => reject(event.target.error)
            _openedCursor.onsuccess = (event) => {
                const cursor = event.target.result

                if (!cursor || (index !== null && index === pageSize)) {
                    this._close()
                    resolve(result)
                    return
                }
                if (index === null && pageNum - 1 !== 0) {
                    const advanceNum = (pageNum - 1) * pageSize
                    index = 0
                    cursor.advance(advanceNum)
                } else {
                    index += 1
                    result.push(cursor.value)
                    cursor.continue()
                }
            }
        })
    }

    /**
     * 根据 userCodes 查询 userDatas
     * @param {Array<String>} userCodes
     * @returns
     */
    queryUserDatasByUserCode(userCodes) {
        return new Promise(async (resolve, reject) => {
            const _objectStore = await this._getObjectStore([this.storeName], 'readonly', this.storeName)
            const _openedCursor = _objectStore.get(userCodes).openCursor()
            const result = []
            _openedCursor.onerror = (event) => reject(event.target.error)
            _openedCursor.onsuccess = (event) => {
                const cursor = event.target.result
                if (!cursor) {
                    resolve(result)
                    return
                }
                result.push(cursor.value)
                cursor.continue()
            }
        })
    }

    /**
     * 查询最近七天的 userData
     * @returns
     */
    queryUserDatasForLastWeek() {
        return new Promise(async (resolve, reject) => {
            const startTime = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            const _objectStore = await this._getObjectStore([this.storeName], 'readonly', this.storeName)
            const _openedCursor = _objectStore.index('user_table-updateDate').getAll(IDBKeyRange.lowerBound(startTime, true))
            _openedCursor.onerror = (event) => reject(event.target.error)
            _openedCursor.onsuccess = (event) => {
                resolve(event.target.result || [])
            }
        })
    }

    get indexArr() {
        return [
            { indexName: 'user_table-userName', valueKey: 'userName', unique: false },
            { indexName: 'user_table-updateDate', valueKey: 'updateDate', unique: false }
        ]
    }

    get keyPath() {
        return 'userCode'
    }

    get storeName() {
        return 'user-data-table'
    }

    get version() {
        return 3
    }
}

export { UserMockData }
