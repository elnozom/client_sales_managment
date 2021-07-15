
export const  required = v => !!v || 'this field is required'
export const  min6 = v => !!v || 'this field is required'
export const  email = v => /.+@.+/.test(v) || 'this field must be a valid email'
export const  man255 = v => v.length > 255 || 'this field must be less than 255 character'
export const  number = v => {
    if(v && isNaN(v)){
        return 'this field must be a valid number'
    }
    return
}
export const  positive = v => (v && !isNaN(v) && v > 0) || 'this field must be a positive Number'
export const  percent = v => {
    if(v && (v < 0 || v > 100)){
        return 'this field must be a valid percent'
    }
}
