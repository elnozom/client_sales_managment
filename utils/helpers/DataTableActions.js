export const editProduct = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id', params: { id: item.id } })
    console.log('create')
}

export const viewProduct = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id-view', params: { id: item.id } })
    console.log('view')

}

export const editOrder = (ctx, item) => {
    // ctx.$router.push({ name: 'products-id-view', params: { id: item.id } })
    const customer = {}
    const serial = ""
    console.log(item.CustomerName)
    ctx.$router.push({ name: 'orders-customer-edit', query: { 'serial' : item.Serial , 'customer_code': item.CustomerCode, 'customer_name': item.CustomerName }, params: { customer: item.CustomerSerial } })
    console.log('edit')

}

