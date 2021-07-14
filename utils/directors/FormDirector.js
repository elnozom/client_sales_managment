import { email, password } from '@/utils/helpers/Inputs.js'
import { login } from '@/utils/helpers/FormActions.js'


export default class DatatableDirector {

    constructor(builder) {
        this.builder = builder
    }
    makeLogin() {
        const inputs = [
            email,
            password,
        ]
        return this.builder
            .setTitle('login')
            .setInputs(inputs)
            .setCols(6)
            .setError('')
            .setErrors([])
            .setLoadnng(false)
            .setHiddenable(true)
            .setAction(login)
            .build()
    }
};