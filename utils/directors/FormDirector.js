import { code, password , customer , qnt , item , price } from '@/utils/helpers/Inputs.js'
import { login , chooseCustomer , innsertDocItem} from '@/utils/helpers/FormActions.js'


export default class DatatableDirector {

    constructor(builder) {
        this.builder = builder
    }
    makeCustomer() {
        const inputs = [
            customer,
        ]
        return this.builder
            .setTitle('customer')
            .setInputs(inputs)
            .setCols(6)
            .setError('')
            .setErrors([])
            .setLoading(false)
            .setHiddenable(true)
            .setAction(chooseCustomer)
            .build()
    }
    makeLogin() {
        const inputs = [
            code,
            password,
        ]
        return this.builder
            .setTitle('login')
            .setInputs(inputs)
            .setCols(6)
            .setError('')
            .setErrors([])
            .setLoading(false)
            .setHiddenable(true)
            .setAction(login)
            .build()
    }
    makeInsertItem() {
        const inputs = [
            item,
            qnt,
            price,
        ]
        return this.builder
            .setTitle('insert_item')
            .setInputs(inputs)
            .setCols(6)
            .setBtnCols(3)
            .setError('')
            .setErrors([])
            .setLoading(false)
            .setHiddenable(true)
            .setAction(innsertDocItem)
            .build()
    }
};