import type {Knex} from "knex";

const config: Knex.Config = {
    client: "better-sqlite3",
    connection: {
        filename: "./database/iq-store.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
        directory: "./database/migrations",
    }
}

export default config;