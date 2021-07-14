// import Http from "@/utils/Http.js"
// const setErr = (err, ctx) => {
//     ctx.opts.loading = false
//     typeof err.errors !== 'undefined' ? ctx.opts.errors = err.errors : ctx.opts.error = err
// }
// const clearErr = ctx => {
//     ctx.opts.errors = []
//     ctx.opts.loading = false
//     ctx.opts.error = ''
// }
export const login = async (ctx) => {
    ctx.opts.loading = true
    await ctx.$refs.form.validate()
    ctx.$router.push('/')

}

