/**
 * indexedDB base
 */

class IndexedDBBase {
    constructor() {
        // 数据库对象
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        // 数据库实例
        this._dbInstance = null
        //
    }

    _close() {
        if (this._dbInstance) {
            this._dbInstance.close()
            this._dbInstance = null
        }
    }

    _open() {
        return new Promise((resolve, reject) => {
            this._close()
            const request = this.indexedDB.open(this.database, this.version)
            request.onupgradeneeded = (event) => {
                const _dbInstance = event.target.result
                this.storeNameConfig.forEach((storeInfo) => {
                    const _objectStore = _dbInstance.createObjectStore(storeInfo.name, { keyPath: storeInfo.keyPath })
                    storeInfo.indexArr.forEach((indexInfo) => {
                        _objectStore.createIndex(indexInfo.indexName, indexInfo.valueKey, { unique: indexInfo.unique })
                    })
                })
            }
            request.onerror = (event) => reject(event.target.error)
            request.onsuccess = (event) => {
                this._dbInstance = event.target.result
                resolve(event.target.result)
            }
        })
    }

    _getObjectStore(transactionArr, transactionType = 'readonly', storeName) {
        return new Promise(async (resolve, reject) => {
            const _dbInstance = await this._open()
            _dbInstance.onerror = (event) => reject(event.target.error)
            const _transaction = _dbInstance.transaction(transactionArr, transactionType)
            const resultStore = _transaction.objectStore(storeName)
            resolve(resultStore)
        })
    }

    get storeName() {
        return ''
    }

    /**
     * database index
     */
    get indexArr() {
        return []
    }

    /**
     * database keyPath
     */
    get keyPath() {
        return ''
    }

    /**
     * database name
     */
    get database() {
        return 'tauri-app-doctor'
    }

    /**
     * store 初始化配置
     */
    get storeNameConfig() {
        return [
            {
                name: 'user-data-table',
                indexArr: [
                    { indexName: 'user_table-userName', valueKey: 'userName', unique: false },
                    { indexName: 'user_table-updateDate', valueKey: 'updateDate', unique: false }
                ],
                keyPath: 'userCode'
            },
            {
                name: 'record-data-table',
                indexArr: [
                    { indexName: 'record_create_data_index', valueKey: 'createDate', unique: true },
                    { indexName: 'record_user_id_index', valueKey: 'userCode', unique: true }
                ],
                keyPath: 'recordId'
            }
        ]
    }

    /**
     * database version: 2
     */
    get version() {
        return 2
    }
}

export { IndexedDBBase }
