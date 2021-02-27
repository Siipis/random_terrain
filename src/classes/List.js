class List extends Object {
    add(value) {
        Object.keys(value).forEach(key => {
            if (this[key] === undefined) {
                this[key] = value[key]
            } else {
                this[key] += value[key]
            }
        })
    }

    values() {
        return Object.values(this)
    }

    keys() {
        return Object.keys(this)
    }

    filter(func) {
        if (!(typeof func === 'function')) {
            throw new TypeError()
        }

        const result = new List()
        Object.keys(this).forEach(key => {
            if (func(key, this[key])) {
                result[key] = this[key]
            }
        })
        return result
    }

    get length() {
        return this.keys().length
    }
}

export default List
