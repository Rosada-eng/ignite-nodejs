import { app } from './app'
import { env } from './config/env'
app.listen({
    host: '0.0.0.0',
    port: env.PORT,
})
    .then(() => {
        console.log('🚀 Server is running on port 3333')
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
