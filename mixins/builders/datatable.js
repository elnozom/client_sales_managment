import http from '@/utils/Http.js'
import { clearNullValues, addParamsToLocation, serializeQuery } from '@/utils/helpers/Global.js'
export default {
    props: ['opts'],
    data() {
        // extract document id from query parameter
        return {
            datatable: {},
            form: {
                StoreCode:1
            },
            apiUrl:process.env,
            search: "",
            loading: false,
            options: {}
        }
    },
    methods: {
        getData() {
            this.loading = true
            http.get(`${this.opts.url}?${serializeQuery(clearNullValues(this.form))}`)
                .then(res => {
                    this.datatable.items = res.data
                    this.loading = false
                    //  console.log(res.data[0].keys)
                })
        },
        deleted() {
            console.log('deel')
        },
        create() {
            this.opts.create(this)
        },
        isNumber(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },
        initFilters() {
            if (typeof this.opts.filters !== 'undefined') this.opts.filters.forEach(filter => {
                if (filter.url && filter.items.length === 0) {
                    http.get(filter.url)
                        .then(res => {
                            filter.items = res.data
                        })
                }
            });
        },
        saveFilters() {
            let type = this.opts.docType ? `${this.opts.docType}` : '-'
            localStorage.setItem(`${this.$route.name}${type}-filter`, JSON.stringify(clearNullValues(this.form)))
            const snackbar = {
                active: true,
                text: 'Your filters has been saved successfully'
            }
            this.$store.commit('ui/setSnackbar', snackbar)
        },
        filter() {
            this.getData(this.form)
            addParamsToLocation(this.form, this.$route.path)
        },
        deleteItem(item) {
            this.$store.commit('ui/setDeleteModal', true)
            this.$store.commit('global/setDeleteItem', { id: item.id, table: this.opts.table })
            //  this.$store.commit('global/setDeleteAction' , {action:'inventory/get' , payload : this.filters})
        },
        editItem(item) {
            this.opts.edit(this, item)
        },
        viewItem(item) {
            this.opts.view(this, item)
        }

    },
    created() {
        // set opt.doctype to the document type from do param
        if (this.$route.params.type) {
            this.opts.docType = this.$route.params.type
        }
        this.$bus.$on('productCreated', () => {
            console.log('asdasdasdasd')
            this.getData()
        })
        // get the page query
        let query = this.$route.query
        // check if there is no query which means that user just opened the page
        // by other word its not manual refresh to the page
        if (JSON.stringify(query) === '{}') {
            let type = this.opts.docType ? `${this.opts.docType}` : '-'
            // check if there is filters saved on localstorage
            if (localStorage.getItem(`${this.$route.name}${type}-filter`)) {
                // get all saved filters
                const saved = JSON.parse(localStorage.getItem(`${this.$route.name}${type}-filter`))
                //  console.log(saved)
                this.form = saved
            }
        } else {
            // this code will be executed if we visite the page with query already set
            this.form = query
        }
        this.initFilters()
        this.form.search = ''
        this.getData()
    },

}
