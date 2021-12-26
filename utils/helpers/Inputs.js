import {required  , min6 , min0} from './Validations.js'
import { getEmp  , login , getProductSerial , itemChanged ,chooseCustomer, innsertDocItem } from '@/utils/helpers/FormActions.js'

// login
export const code = {
    type : "text",
    inputType : "number",
    prop : "empCode",
    ref : "code",
    enter : (ctx, input) =>   ctx.$refs.password[0].focus(),
    blur : getEmp,
    cols : 12,
    label : 'code',
    rules : [required , min0],
}



export const password = {
    type : "text",
    inputType : "password",
    prop : "empPassword",
    ref : "password",
    enter : login,
    cols : 12,
    label : 'password',
    rules : [required , min6],
}



// modals

export const customer = {
    type : "combobox",
    items : [],
    url : 'account?type=1',
    prop : "customer",
    inputText: "AccountName",
    enter: chooseCustomer,
    inputValue: "",
    ref : "customer",
    cols : 12,
    label : 'customer',
    meta : true,
    rules : [required],
}



export const item = {
    type : "combobox",
    items : [],
    url : 'items?StoreCode=1',
    prop : "item",
    inputText: "Name",
    class:"item-combobox",
    enter : getProductSerial,
    changed: itemChanged ,
    inputValue: "",
    ref : "item",
    cols : 3,
    label : 'item',
    meta : true,
    rules : [required],
}
export const qnt = {
    type : "text",
    inputType : "number",
    prop : "qnt",
    ref : "qnt",
    enter : (ctx, input) => {
        ctx.$refs.price[0].focus()
    },
    cols : 3,
    label : 'qnt',
    rules : [required ],
}

export const price = {
    type : "text",
    inputType : "number",
    prop : "price",
    ref : "price",
    enter : innsertDocItem,
    cols : 3,
    label : 'price',
    rules : [required ],
}

export const SalesOrderNo = {
    type : "text",
    inputType : "number",
    prop : "SalesOrderNo",
    ref : "SalesOrderNo",
    label : 'SalesOrderNo',
}

