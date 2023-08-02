import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UserValidator {
  public static get createUserSchema() {
    return schema.create({
      name: schema.string({ trim: true }, [rules.required(), rules.minLength(3)]),
      username: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(3),
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string({ trim: true }, [
        rules.required(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
    })
  }

  public static get updateUserSchema() {
    return schema.create({
      name: schema.string({ trim: true }, [rules.minLength(3)]),
      username: schema.string.optional({ trim: true }, [
        rules.minLength(3),
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string.optional({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string.optional({}, [rules.minLength(6)]),
    })
  }

  public static get sendResetCodeSchema() {
    return schema.create({
      email: schema.string.optional([
        rules.email(),
        rules.exists({ table: 'users', column: 'email' }),
      ]),
      username: schema.string.optional([rules.exists({ table: 'users', column: 'username' })]),
    })
  }

  public static get messages() {
    return {
      'username.required': 'The username field is required.',
      'email.required': 'The email field is required.',
      'email.email': 'Please enter a valid email address.',
      'email.unique': 'The email address is already in use.',
      'password.required': 'The password field is required.',
      'password.minLength': 'The password must be at least 6 characters long.',
      'email.exists': 'The provided email does not exist',
      'username.exists': 'The provided username does not exist',
    }
  }
}
