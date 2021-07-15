import Http from "@/utils/Http.js"
const setErr = (err, ctx) => {
    ctx.opts.loading = false
    typeof err.errors !== 'undefined' ? ctx.opts.errors = err.errors : ctx.opts.error = err
}
const clearErr = ctx => {
    ctx.opts.errors = []
    ctx.opts.loading = false
    ctx.opts.error = ''
}
export const login = async (ctx) => {
    ctx.opts.loading = true
    await ctx.$refs.form.validate()
    if (ctx.opts.valid) {
        ctx.$store.dispatch('auth/login', ctx.form.password)
            .then(() => {
                clearErr(ctx)
                ctx.opts.loading = false
                ctx.$router.push('/')
            })
            .catch(err => {
                console.log(err)
                setErr(err, ctx)
            })

    }

}
export const getEmp = async (ctx) => {
    ctx.opts.loading = true
    ctx.$store.dispatch('auth/getEmp', ctx.form)
        .then(() => {
            clearErr(ctx)
            ctx.opts.loading = false
            ctx.$refs.password[0].focus()
        })
        .catch(err => {
            setErr(err, ctx)
        })
}





