import { viewProduct, editProduct , editOrder } from "@/utils/helpers/DataTableActions.js"
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
            { text: this.ctx.$t('columns.code'), value: 'BarCode', align: "center" },
            { text: this.ctx.$t('columns.name'), value: 'ItemName', align: "center" },
            { text: this.ctx.$t('columns.price'), value: 'Price', align: "center" },
            { text: this.ctx.$t('columns.qnt'), value: 'Qnt', align: "center" },
            { text: this.ctx.$t('columns.total'), value: 'Total', align: "center" },
        ]
        return this.builder
            .setTitle('products')
            .setUrl('orders/items')
            .setEdit(editProduct)
            .setTable('products')
            .setQuery('serial')
            .setHeaders(headers)
            .build()
    }

    makeOrders() {
        let headers = [
            { text: this.ctx.$t('columns.docNo'), value: 'DocNo', align: "center" },
            { text: this.ctx.$t('columns.empName'), value: 'EmpName', align: "center" },
            { text: this.ctx.$t('columns.empCode'), value: 'EmpCode', align: "center" },
            { text: this.ctx.$t('columns.totalCash'), value: 'TotalCash', align: "center" },
            { text: this.ctx.$t('columns.docDate'), value: 'DocDate', align: "center" },
            { text: this.ctx.$t('columns.actions'), value: 'actions', align: "center" }
        ]
        
        return this.builder
            .setTitle('orders')
            .setUrl('orders')
            .setEdit(editOrder)
            .setEditable(true)
            .setQuery('serial')
            .setHeaders(headers)
            .build()
    }

    

};