import {required ,  email as emailValidation , min6} from './Validations.js'


export const email = {
    type : "text",
    prop : "email",
    inputType : "email",
    ref : "email",
    enter : ()=>{console.log('enter')},
    cols : 12,
    label : 'email',
    rules : [required , emailValidation],
}
export const password = {
    type : "text",
    inputType : "password",
    prop : "password",
    ref : "password",
    enter : ()=>{console.log('enter')},
    cols : 12,
    label : 'password',
    rules : [required , min6],
}
