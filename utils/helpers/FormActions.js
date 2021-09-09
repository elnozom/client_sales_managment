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
   ctx.form.empCode = parseInt(ctx.form.empCode)
        ctx.$auth
        .loginWith('local', { data: ctx.form })
        .then(()=>{
            ctx.loading  = false
            clearErr(ctx)
            ctx.$router.push('/')
        }).catch(e => {
          console.log(e)
          setErr(e, ctx)
          ctx.loading  = false
        })
        
        // ctx.$store.dispatch('myAuth/login', {code : ctx.form.code ,password: ctx.form.password})
        //     .then(() => {
        //         clearErr(ctx)
        //         ctx.opts.loading = false
        //         ctx.$router.push('/')
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         setErr(err, ctx)
        //     })

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
        ctx.form.customer = null
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
    // create order 
    if (ctx.$store.getters['order/serial'] == null && typeof ctx.$route.query.order == 'undefined') {
        ctx.$store.dispatch('order/create', orderForm)
            .then(res => {
                const newQuery = Object.assign({}, ctx.$route.query, { serial: res })
                // set order number on the url
                addParamsToLocation(newQuery, ctx.$route.path)
                // set order number on the store
                ctx.$store.commit('order/serial', res)
            })
    }
    //get serial neither from url or from store
    // should be equals
    // if we just opened the page then we depend on url [means we are editing order]
    // if we are just created the order the we depend  on store [means we are creating order]
    const serial = ctx.$route.query.order || ctx.$store.getters['order/serial']



    const itemForm = {
        HeadSerial: serial,
        ItemSerial: ctx.form.item.Serial,
        Qnt: parseFloat(ctx.form.qnt),
        Price: parseFloat(ctx.form.price)
    }

    ctx.$store.dispatch('order/insertItem', itemForm)
        .then(res => {
            const total = parseFloat(ctx.form.price) * parseFloat(ctx.form.qnt)
            const totalP =  parseFloat(ctx.form.qnt)

            const item = {
                "Serial": 42,
                "BarCode": ctx.form.item.Code,
                "ItemName": ctx.form.item.Name,
                "Qnt": parseFloat(ctx.form.qnt),
                "Price": parseFloat(ctx.form.price),
                "Total": total
              }
            ctx.$store.commit('order/appendTotal' , total)
            ctx.$store.commit('order/appendPackages' ,totalP)
            ctx.$store.commit('datatable/appendRow' ,item)
            

            console.log('form' , item)
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




