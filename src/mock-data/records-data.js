import { event } from '@tauri-apps/api'
import { IndexedDBUtils, ConstantUtils, CommonUtils } from '../utils'

class RecordsMockData extends IndexedDBUtils.IndexedDBBase {
    /**
     * 添加记录
     * @param {Object} recordData
     * @returns
     */
    addSingleRecordData(recordData) {
        return new Promise(async (resolve, reject) => {
            const _objectStore = await this._getObjectStore([this.storeName], ConstantUtils.IDBTransactionType.EDIT.code)
            const _request = _objectStore.add(recordData)
            _request.onerror = (event) => reject(event.target.error)
            _request.onsuccess = (event) => resolve(event.target.result)
        })
    }

    /**
     * 根据 userCode 查询对应记录
     * @param {String} userCode
     * @returns
     */
    queryRecordDatasByUserCode(userCode) {
        return new Promise(async (resolve, reject) => {
            const result = []
            if (CommonUtils.isEmptyForString(userCode)) return resolve(results)
            const _objectStore = await this._getObjectStore([this.storeName], ConstantUtils.IDBTransactionType.EDIT.code)
            const _request = _objectStore.index('record_user_id_index').openCursor()
            _request.onerror = (event) => reject(event.target.error)
            _request.onsuccess = (event) => {
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

    get keyPath() {
        return 'recordId'
    }

    get indexArr() {
        return [
            { indexName: 'record_create_data_index', valueKey: 'createDate', unique: true },
            { indexName: 'record_user_id_index', valueKey: 'userCode', unique: true }
        ]
    }

    get storeName() {
        return 'record-data-table'
    }

    get version() {
        return 3
    }
}

export { RecordsMockData }
