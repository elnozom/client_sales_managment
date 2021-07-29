import { viewProduct, editProduct } from "@/utils/helpers/DataTableActions.js"
export default class DatatableDirector {
    constructor(builder , ctx) {
        this.builder = builder
        this.ctx = ctx
    }

    makeProducts() {
        let headers1 = [
            // { text: this.t.$t(this.ctx.$t('columns.codeasdasd')), value: 'code', align: "center" },
            { text: this.ctx.$t('columns.code'), value: 'Code', align: "center" },
            { text: this.ctx.$t('columns.name'), value: 'Name', align: "center" },
            { text: this.ctx.$t('columns.weight'), value: 'Qnt', align: "center" },
            // { text: this.ctx.$t('columns.weight'), value: 'qty', align: "center" },
            
            // { text: this.ctx.$t('columns.price_range'), value: 'price_range', align: "center" },
            // { text: this.ctx.$t('columns.note'), value: 'note', align: "center" },
            // { text: this.ctx.$t('columns.limited'), value: 'note', align: "center" },
            // { text: this.ctx.$t('columns.actions'), value: 'actions', align: "center" }
        ]

        const headers2 = [
            { text: this.ctx.$t('columns.price'), value: 'Price', align: "center" },
            { text: this.ctx.$t('columns.min_price'), value: 'PMin', align: "center" },
            { text: this.ctx.$t('columns.max_price'), value: 'PMax', align: "center" },
            { text: this.ctx.$t('columns.limited'), value: 'LimitedQnt', align: "center" },
            { text: this.ctx.$t('columns.stop_sale'), value: 'StopSale', align: "center" },
        ]

        //check permissions to show stock
        this.ctx.$store.state.auth.employee.EmpName === 'Admin' 
            ? headers1.push({ text: this.ctx.$t('columns.qnt'), value: 'AnQnt', align: "center" })
        : ''

        console.log(this.ctx.$store.state.auth.employee.EmpName)


        const headers = headers1.concat(headers2)
        return this.builder
            .setTitle('products')
            .setUrl('items')
            .setEdit(editProduct)
            .setViewable(true)
            .setView(viewProduct)
            .setTable('products')
            .setHeaders(headers)
            .build()
    }

    makeOrderProducts() {
        let headers = [
            // { text: this.t.$t(this.ctx.$t('columns.codeasdasd')), value: 'code', align: "center" },
            { text: this.ctx.$t('columns.code'), value: 'Code', align: "center" },
            { text: this.ctx.$t('columns.name'), value: 'Name', align: "center" },
            { text: this.ctx.$t('columns.price'), value: 'Price', align: "center" },
            { text: this.ctx.$t('columns.qnt'), value: 'AnQnt', align: "center" },
            { text: this.ctx.$t('columns.total'), value: 'total', align: "center" },
        ]
        
        return this.builder
            .setTitle('products')
            .setUrl('items')
            .setEdit(editProduct)
            .setViewable(true)
            .setView(viewProduct)
            .setTable('products')
            .setHeaders(headers)
            .build()
    }

    makeOrders() {

        const headers = [
            { text: this.ctx.$t('columns.code'), value: 'code', align: "center" },
            { text: this.ctx.$t('columns.employee'), value: 'employee', align: "center" },
            { text: this.ctx.$t('columns.total'), value: 'total', align: "center" },
            { text: this.ctx.$t('columns.created_at'), value: 'created_at', align: "center" }
        ]
        return this.builder
            .setTitle('orders')
            .setUrl('orders')
            .setEdit(editProduct)
            .setViewable(true)
            .setView(viewProduct)
            .setTable('orders')
            .setHeaders(headers)
            .build()
    }

};