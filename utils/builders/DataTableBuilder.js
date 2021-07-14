export default class DataTableBuilder {
    constructor() {
        this.datatable = {}
    }
    setTitle(title) {
        this.datatable.title = title
        return this
    }
    setTable(table) {
        this.datatable.table = table
        return this
    }
    setHeaders(headers) {
        this.datatable.headers = headers
        return this
    }
    setRememberAble(rememberAble) {
        this.datatable.rememberAble = rememberAble
        return this
    }
    setFilters(filters) {
        this.datatable.filters = filters
        return this
    }

    setUrl(url) {
        this.datatable.url = url
        return this
    }
    setCreate(create) {
        this.datatable.create = create
        return this
    }
    setEdit(edit) {
        this.datatable.edit = edit
        return this
    }
    setDocType(docType) {
        this.datatable.docType = docType
        return this
    }

    setEditable(editable) {
        this.datatable.editable = editable
        return this
    }
    setCreateAble(createable) {
        this.datatable.createable = createable
        return this
    }
    setView(view) {
        this.datatable.view = view
        return this
    }

    setViewable(viewable) {
        this.datatable.viewable = viewable
        return this
    }
    setDeleteble(deleteble) {
        this.datatable.deleteble = deleteble
        return this
    }

    setCreateLoading(createLoading) {
        this.datatable.createLoading = createLoading
        return this
    }

    build() {
        return this.datatable
    }
};