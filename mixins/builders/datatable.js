import http from '@/utils/Http.js'
import { mapGetters } from 'vuex'
import { clearNullValues, addParamsToLocation, serializeQuery } from '@/utils/helpers/Global.js'
export default {
    props: ['opts'],
    data() {
        // extract document id from query parameter
        return {
            snack: false,
            snackColor: '',
            snackText: '',
            PMin: '',
            createLoading :false,
            PMax: '',
            datatable: {},
            form: {
                StoreCode: 1
            },
            apiUrl: process.env,
            search: "",
            loading: false,
            options: {}
        }
    },
    computed: {
        ...mapGetters({
            items: 'datatable/items'
        })
    },
    methods: {
        save(item, type) {
            this.snack = true
            this.snackColor = 'success'
            this.snackText = this.$t('table.saved')
            // MinValue , MaxValue
            const payload = type == 'PMax' ? { Serial: item.Serial, MaxValue: parseFloat(this.PMax) } : { Serial: item.Serial, MinValue: parseFloat(this.PMin) }
            this.update(payload);
        },
        cancel() {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = this.$t('table.cancled')
        },
        open() {
            this.snack = true
            this.snackColor = 'info'
            this.snackText = this.$t('table.opened')
        },
        close() {
            console.log('Dialog closed')
        },
        getData() {
            this.loading = true
            let url = `${this.opts.url}?${serializeQuery(clearNullValues(this.form))}`
            if( typeof this.opts.noQuery !== 'undefined' && this.opts.noQuery){
                url = this.opts.url 
            }
            if( typeof this.opts.query !== 'undefined'){
                const q = this.opts.query 
                url = `${this.opts.url}?${q}=${this.$route.query[q]}}`
            }
            http.get(url)
                .then(res => {
                    res.data = res.data === null ? [] : res.data
                    this.datatable.items = res.data
                    this.loading = false
                    this.$emit('fetched', res.data)
                    //  console.log(res.data[0].keys)
                })
        },
        deleted() {
            console.log('deel')
        },
        async create()  {
            this.createLoading=true
            await this.opts.create(this)
            this.createLoading=false
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
        },
        async update(payload) {
            this.opts.loading = true
            await this.$emit('update', payload)
            this.getData()
            this.opts.loading = false

        }

    },
    created() {
        this.$bus.$on('productUpdated', () => {
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
            // i commented the next line to avoid error on edit order page
            // this.form = query
        }
        this.initFilters()
        this.form.search = ''
        this.getData()
    },

}
