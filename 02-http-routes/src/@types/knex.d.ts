import 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            email: string
            password_hash: string
            name: string
            created_at: Datetime
        }

        meals: {
            id: string
            user_id: string
            name: string
            description?: string
            in_diet: boolean
            consumed_at: Datetime
        }
    }
}