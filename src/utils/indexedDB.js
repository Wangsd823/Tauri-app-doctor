/**
 * indexedDB base
 */

class IndexedDBBase {
    constructor() {
        // 数据库对象
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        // 数据库实例
        this._dbInstance = null
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
                // TODO add storeName check
                const _objectStore = _dbInstance.createObjectStore(this.storeName, { keyPath: this.keyPath })
                // FIXME 创建索引 扩展化
                this.indexArr.forEach((indexInfo) => {
                    _objectStore.createIndex(indexInfo.indexName, indexInfo.valueKey, { unique: indexInfo.unique })
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
     * database version: 2
     */
    get version() {
        return 2
    }
}

export { IndexedDBBase }
