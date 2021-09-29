export const editProduct = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id', params: { id: item.id } })
    console.log('create')
}

export const viewProduct = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id-view', params: { id: item.id } })
    console.log('view')

}

export const editOrder = (ctx, item) => {
    if (ctx.$auth.user.SecLeve >= 4 || ctx.$auth.user.EmpCode == item.EmpCode) {
        ctx.$router.push({ name: 'orders-customer-edit', query: { 'serial': item.Serial, 'EmpCode': item.EmpCode, 'customer_code': item.CustomerCode, 'customer_name': item.CustomerName }, params: { customer: item.CustomerSerial } })
    } else {
        const snackbar = {
            active: true,
            text: 'this_order_dosn\'t_belong_to_you',
        }
        if (!ctx.$store.getters['ui/snackbar'].active) ctx.$store.commit('ui/setSnackbar', snackbar)
    }
}

export const createOrder = (ctx) => {
    ctx.$store.commit('ui/customerModal', true)
}




