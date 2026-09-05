import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('order_items', (table) => {
        table.increments('id').primary();
        table.integer('order_id').notNullable();
        table.string('product_id').notNullable();
        table.string('name').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.integer('quantity').notNullable();
        table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('order_items');
}