export const editProduct = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id', params: { id: item.id } })
    console.log('create')
}

export const viewProduct = (ctx, item) => {
   ctx.$store.dispatch('datatable/getStock' , item.Serial)
   .then(res => {
       ctx.$store.commit('ui/stockModal' , true)
       
   })

}

export const editOrder = (ctx, item) => {
    if(item.Reserved == true){
        const snackbar = {
            active: true,
            text: 'order_is_reserved',
        }
        if (!ctx.$store.getters['ui/snackbar'].active) ctx.$store.commit('ui/setSnackbar', snackbar)

        return
    }
    if(item.StkTr01Serial > 0){
        const snackbar = {
            active: true,
            text: 'order_is_posted',
        }
        if (!ctx.$store.getters['ui/snackbar'].active) ctx.$store.commit('ui/setSnackbar', snackbar)

        return
    }
    if (!(ctx.$auth.user.SecLevel >= 4 || ctx.$auth.user.EmpCode == item.EmpCode)) {
        const snackbar = {
            active: true,
            text: 'this_order_dosn\'t_belong_to_you',
        }
        if (!ctx.$store.getters['ui/snackbar'].active) ctx.$store.commit('ui/setSnackbar', snackbar)

        return

    }
    ctx.$router.push({ name: 'orders-customer-edit', query: { 'serial': item.Serial, 'EmpCode': item.EmpCode, 'customer_code': item.CustomerCode, 'customer_name': item.CustomerName , 'no' : item.DocNo }, params: { customer: item.CustomerSerial } })
}

export const createOrder = (ctx) => {
    ctx.$store.commit('ui/customerModal', true)
}




