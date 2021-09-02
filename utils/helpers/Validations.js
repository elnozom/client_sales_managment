
export const  required = v => !!v || 'required'
export const  min6 = v => !!v || 'min6'
export const  email = v => /.+@.+/.test(v) || 'email'
export const  man255 = v => v.length > 255 || 'min255'
export const  number = v => {
    if(v && isNaN(v)){
        return 'number'
    }
    return
}
export const  positive = v => (v && !isNaN(v) && v > 0) || 'positive_number'
export const  percent = v => {
    if(v && (v < 0 || v > 100)){
        return 'percent'
    }
}
export const  min = (v , min) => {
    if(v && v < min){
        return 'min'
    }
}
export const  max = (v , max) => {
    if(v && v > max){
        return 'min'
    }
}
