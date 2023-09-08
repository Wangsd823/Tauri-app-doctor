/**
 * 常量
 */

class EnumType {
    constructor(code, name, desc) {
        this._code = code
        this._name = name
        this._desc = desc
    }

    get code() {
        return this._code
    }

    get name() {
        return this._name
    }
}

export const IDBTransactionType = {
    EDIT: new EnumType('readwrite', '读写权限', ''),
    READ: new EnumType('readonly', '只读状态', '')
}
