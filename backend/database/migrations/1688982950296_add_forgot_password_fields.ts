import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('reset_code').nullable()
      table.dateTime('reset_code_expires_at').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('reset_code')
      table.dropColumn('reset_code_expires_at')
    })
  }
}
