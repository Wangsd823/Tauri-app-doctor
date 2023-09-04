import { IndexedDBUtils } from '../utils'

class UserMockData extends IndexedDBUtils.IndexedDBBase {
    addSingleUserData(userData) {
        return new Promise(async (resolve, reject) => {
            const _dbInstance = await this._open()
            const _transaction = _dbInstance.transaction(this.database, 'readwrite')
            const _objectStore = _transaction.objectStore(this.database)
            const request = _objectStore.add(userData)
            request.onerror = (event) => reject(event.target.error)
            request.onsuccess = (event) => resolve(event.target.result)
            _transaction.oncomplete = (event) => this._close()
        })
    }

    queryUserList() {
        return new Promise(async (resolve, reject) => {
            const _dbInstance = await this._open()
            const _objectStore = _dbInstance.transaction(this.database, 'readonly').objectStore(this.database)
            const _cursor = _objectStore.openCursor()
            _cursor.onerror = (event) => reject(event.target.error)
            const result = []
            _cursor.onsuccess = (event) => {
                const cursor = event.target.result
                if (!cursor) {
                    this._close()
                    return resolve(result)
                }
                result.push(cursor.value)
                cursor.continue()
            }
        })
    }

    get keyPath() {
        return 'user_code'
    }

    get database() {
        return 'user-data-table'
    }

    get version() {
        return 3
    }
}

export { UserMockData }
