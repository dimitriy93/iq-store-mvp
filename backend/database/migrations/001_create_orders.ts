import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('orders', (table) => {
        table.increments('id').primary();
        table.timestamp('created_at').notNullable();
        table.decimal('total', 10, 2).notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('orders');
}