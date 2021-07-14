const config = {
    development: {
        baseUrl: 'http://localhost:8000/api',
    },
    staging: {
        baseUrl: 'http://localhost-stage:8000/api',
    },
    production: {
        baseUrl: 'http://localhost-prod:8000/api',
    }
}


const nodeEnv = process.env.NODE_ENV
module.exports = config[nodeEnv]