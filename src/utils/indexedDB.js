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

    _open() {
        return new Promise((resolve, reject) => {
            this._close()
            const request = this.indexedDB.open(this.database, this.version)
            request.onupgradeneeded = (event) => {
                const _dbInstance = event.target.result
                const _objectStore = _dbInstance.createObjectStore(this.database, { keyPath: this.keyPath })
                // 创建 user_name 索引
                _objectStore.createIndex('user_name', 'userName', { unique: false })
            }
            request.onerror = (event) => reject(event.target.error)
            request.onsuccess = (event) => {
                this._dbInstance = event.target.result
                resolve(event.target.result)
            }
        })
    }

    _close() {
        if (this._dbInstance) {
            this._dbInstance.close()
            this._dbInstance = null
        }
    }

    /**
     * database name
     */
    get database() {
        return ''
    }

    /**
     * 默认 version: 2
     */
    get version() {
        return 2
    }
}

export { IndexedDBBase }
