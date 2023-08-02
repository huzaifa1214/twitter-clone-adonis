import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class RequestValidatorMiddleware {
  public async handle({ request, route }: HttpContextContract, next: () => Promise<void>) {
    const rules = this.getValidationRules(route?.pattern)

    if (rules) {
      await request.validate({
        schema: rules,
        messages: this.getValidationMessages(),
        reporter: validator.reporters.api,
      })
    }

    await next()
  }

  private getValidationRules(routePattern: string | undefined) {
    const validationRules: { [key: string]: any } = {
      // Define validation rules based on the route key
      'users.store': {
        // Validation rules for the 'users.store' route
        // Example:
        // username: schema.string({ trim: true }, [rules.required()]),
        // email: schema.string({ trim: true }, [rules.required(), rules.email()]),
        // password: schema.string({}, [rules.required(), rules.minLength(6)]),
      },
      // Add more routes and their respective validation rules
    }

    const routeKey = Object.keys(validationRules).find((key) => {
      const pattern = validationRules[key]?.pattern as string
      return routePattern && pattern && new RegExp(pattern).test(routePattern)
    })
    console.log({ routeKey })
    return routeKey ? validationRules[routeKey] : null
  }

  private getValidationMessages() {
    return {
      // Define validation error messages
      // Example:
      // 'username.required': 'The username field is required.',
      // 'email.required': 'The email field is required.',
      // 'email.email': 'Please enter a valid email address.',
      // 'password.required': 'The password field is required.',
      // 'password.minLength': 'The password must be at least 6 characters long.',
    }
  }
}
