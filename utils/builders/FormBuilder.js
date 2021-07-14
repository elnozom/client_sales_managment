export default class FormBuilder {
    constructor() {
        this.form = {}
    }

    setTitle(title) {
        this.form.title = title
        return this
    }

    setCols(cols) {
        this.form.cols = cols
        return this
    }

    setLoadnng(loading) {
        this.form.loading = loading
        return this
    }

    setEditUrl(editUrl) {
        this.form.editUrl = editUrl
        return this
    }
    
    setHiddenable(hiddenable) {
        this.form.hiddenable = hiddenable
        return this
    }
    
    setInputs(inputs) {
        this.form.inputs = inputs
        return this
    }
    
    setAction(action) {
        this.form.action = action
        return this
    }
    
    setErrors(errors) {
        this.form.errors = errors
        return this
    }
    
    setError(error) {
        this.form.error = error
        return this
    }

    build() {
        return this.form
    }
};