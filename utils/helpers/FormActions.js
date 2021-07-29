// import {addParamsToLocation} from "@/store/global.js"
const setErr = (err, ctx) => {
    ctx.opts.loading = false
    typeof err.errors !== 'undefined' ? ctx.opts.errors = err.errors : ctx.opts.error = err
}
const clearErr = ctx => {
    ctx.opts.errors = []
    ctx.opts.loading = false
    ctx.opts.error = ''
}
export const login = async (ctx, input) => {
    ctx.opts.loading = true
    await ctx.$refs.form.validate()
    if (ctx.opts.valid) {
        ctx.$store.dispatch('auth/login', ctx.form.password)
            .then(() => {
                clearErr(ctx)
                ctx.opts.loading = false
                ctx.$router.push('/')
            })
            .catch(err => {
                console.log(err)
                setErr(err, ctx)
            })

    }

}
export const chooseCustomer = async (ctx) => {
    ctx.opts.loading = true
    await ctx.$refs.form.validate()
    if (ctx.opts.valid) {
        const input = ctx.opts.inputs[0]
        const customer = input.items.filter(item => {
            return item.AccountName === ctx.form[input.prop] ? item : ''
        })[0]
        ctx.$router.push({ name: 'orders-customer-edit', query: { 'customer_code': customer.AccountCode, 'customer_name': customer.AccountName }, params: { customer: customer.Serial } })
        ctx.$store.commit('ui/customerModal', false)
    }
    ctx.opts.loading = false
}

export const innsertDocItem = async (ctx, input) => {
    ctx.opts.loading = true
    const orderForm = {
        DocNo: 12,
        EmpCode: ctx.$store.getters['auth/employee'].EmpCode
    }

    // validate there is no items inserted
    console.log(ctx.$route.query)
    if (ctx.$store.getters['order/serial'] == null && typeof ctx.$route.query.order == 'undefined') {
        ctx.$store.dispatch('order/create', orderForm)
            .then(res => {
                const newQuery = Object.assign({}, ctx.$route.query, { order: res })
                addParamsToLocation(newQuery, ctx.$route.path)
                ctx.$store.commit('order/serial', res)
            })
    }

    const serial = ctx.$route.query.order || ctx.$store.getters['order/serial']



    const itemForm = {
        HeadSerial: serial,
        ItemSerial: ctx.form.item.Serial,
        Qnt: parseFloat(ctx.form.qnt),
        Price: parseFloat(ctx.form.price)
    }

    ctx.$store.dispatch('order/insertItem', itemForm)
        .then(res => {
            const total = parseFloat(ctx.form.item.Price) * parseFloat(ctx.form.qnt)
            const totalP =  parseFloat(ctx.form.qnt)
            ctx.$store.commit('order/appendTotal' , total)
            ctx.$store.commit('order/appendPackages' ,totalP)

            console.log(ctx.form.item.Price,total,totalP)
        })

    ctx.opts.loading = false


}

export const itemChanged = (ctx, input) => {
    input.items.forEach(item => {
        if (item.Name === ctx.form.item) {
            ctx.form.item = item
            ctx.$refs.qnt[0].focus()
            return

        }
    })
    ctx.$refs.qnt[0].focus()
}
const addParamsToLocation = (params, path) => {
    history.pushState(
        {},
        null,
        path +
        '?' +
        Object.keys(params)
            .map(key => {
                return (
                    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                )
            })
            .join('&')
    )

}
export const getProductSerial = async (ctx, input) => {
    ctx.opts.loading = true
    input.items.forEach(item => {
        if (item.Code === ctx.form.item) {
            ctx.form.item = item
            ctx.$refs.qnt[0].focus()
            return

        }
    })
    ctx.opts.loading = false
}

export const getEmp = async (ctx, input) => {
    ctx.opts.loading = true
    if (ctx.form.code) {
        ctx.$store.dispatch('auth/getEmp', ctx.form)
            .then(() => {
                clearErr(ctx)
                ctx.opts.loading = false
                ctx.$refs.password[0].focus()
            })
            .catch(err => {
                setErr(err, ctx)
            })
    }
    ctx.opts.loading = false

}





