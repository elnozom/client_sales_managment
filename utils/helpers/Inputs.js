import {required ,  positive , min6} from './Validations.js'
import { getEmp  , login} from '@/utils/helpers/FormActions.js'


export const code = {
    type : "text",
    inputType : "number",
    prop : "code",
    ref : "code",
    enter : getEmp,
    cols : 12,
    label : 'code',
    rules : [required , positive],
}

export const password = {
    type : "text",
    inputType : "password",
    prop : "password",
    ref : "password",
    enter : login,
    cols : 12,
    label : 'password',
    rules : [required , min6],
}
