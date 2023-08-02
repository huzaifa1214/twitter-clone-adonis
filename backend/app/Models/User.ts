import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  static boot() {
    super.boot()
  }

  // Define model attributes
  static get table() {
    return 'users'
  }

  static get hidden() {
    return ['password']
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      console.log({ pass: user.password })
      user.password = await Hash.make(user.password)
      console.log({ pass: user.password })
    }
  }

  static get fillable() {
    return ['name', 'email', 'username', 'password']
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ columnName: 'reset_code' })
  public resetCode: string

  @column({ columnName: 'reset_code_expires_at' })
  public resetCodeExpiresAt: DateTime
}
