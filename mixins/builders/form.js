import http from '@/utils/Http.js'
export default {
    props: ['opts'],
    data() {
        return {
            valid: false,
            metaHidden: false,
            errors: [],
            form: {}
        }
    },
    watch: {
        metaHidden: {
            handler() {
                localStorage.setItem(`${this.$route.name}-meta-hidden`, this.metaHidden)
            },
            deep: true,
        },
    },
    methods: {
        async submit() {
            await this.opts.action(this)

        },
        blur(input) {
            typeof input.blur != 'undefined' ? input.blur(this, input) : ''
        },
        changed(input) {
            typeof input.changed != 'undefined' ? input.changed(this, input) : ''
        },


        enter(input) {
            typeof input.enter != 'undefined' ? input.enter(this, input) : ''
        }
    },
    created() {
        // set form to the document type from  param
        if (this.$route.params.type) {
            this.form.type = this.$route.params.type
        }
        // set form to the document from  param
        if (this.$route.params.doc) {
            this.form.doc = this.$route.params.doc
        }
        // set the meta hidden value which responsible for hiding the unecessary fields on the product 
        //  to its previous value selected on this browser
        let metaHidden = localStorage.getItem(this.metaLocalStorageKey)
        if (typeof metaHidden !== 'undefined') {
            //  parsing string value from locale storage to boolean
            metaHidden = metaHidden === 'true'
            this.metaHidden = metaHidden
        }
        // check if param id is set to get the form data
        if (this.$route.params.id || this.$route.params.doc) {
            const id = this.$route.params.id ? this.$route.params.id : this.$route.params.doc
            http.get(`${this.opts.editUrl}/${id}`)
                .then(res => {
                    this.form = res.data
                })
        }

        // loop over inputs to get selects items 
        this.opts.inputs.forEach(input => {
            if (input.type === 'select' || input.type === 'combobox') {
                if (input.items.length === 0) {
                    input.loading = true
                    http.get(input.url)
                        .then(res => {
                            input.loading = false
                            input.items = res.data
                        })
                }
            }
        })

    },
}