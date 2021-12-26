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
    if (ctx.$auth.user.SecLevel >= 4){
        const payload = {
            "AuditCode" : ctx.$auth.user.EmpCode,
            "Reserved" : true,
            "Serial" : item.Serial,
        }
        ctx.$store.dispatch('order/updateOrder' , payload)
    }
    const finished = (item.Finished == 0) ? 0 : 1
    ctx.$router.push({ name: 'orders-customer-edit', query: { finished, 'date' :item.DocDate, 'serial': item.Serial, 'EmpCode': item.EmpCode, 'customer_code': item.CustomerCode, 'customer_name': item.CustomerName , 'no' : item.DocNo ,'driverName':item.DriverName , 'deliveryFee': item.DeliveryFee }, params: { customer: item.CustomerSerial } })
}
export const editOrderStore = (ctx, item) => {
    const finished = (item.Finished || ctx.$auth.user.FixEmpStore == 0) ? 1 : 0
    ctx.$router.push({ name: 'stock-edit', query: { 'store' : item.StoreName , finished , 'date' :item.DocDate,'serial': item.Serial,'no' : item.DocNo,'customer_code': item.CustomerCode, 'customer_name': item.CustomerName ,'emp_name': item.EmpName ,'stock_emp_name': item.StcEmpName ,'driverName':item.DriverName , 'deliveryFee': item.DeliveryFee }})
}

export const createOrder = (ctx) => {
    ctx.$store.commit('ui/customerModal', true)
}




