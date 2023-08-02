import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppException from 'App/Exceptions/AppException'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import { DateTime } from 'luxon'

export default class UserController {
  private static async sendResetCodeEmail(email: string, resetCode: string) {}

  public static async index({ response }: HttpContextContract): Promise<void> {
    const users = await User.all()
    return response.send(users)
  }

  public static async show({ params, response, auth }: HttpContextContract): Promise<void> {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).send({ error: 'User not found' })
    }

    return response.send(user)
  }

  public static async store({ request, response }: HttpContextContract): Promise<void> {
    const validationSchema = UserValidator.createUserSchema
    const messages = UserValidator.messages

    const validatedData = await request.validate({
      schema: validationSchema,
      messages,
    })

    const user = new User()
    user.fill(validatedData)
    await user.save()

    return response.status(201).send(user)
  }

  public static async update({ params, request, response }: HttpContextContract): Promise<void> {
    const validationSchema = UserValidator.updateUserSchema
    const messages = UserValidator.messages

    const validatedData = await request.validate({
      schema: validationSchema,
      messages,
    })
    const user = await User.findOrFail(params.id)

    user.merge(validatedData)
    await user.save()

    return response.send(user)
  }

  public static async destroy({ params, response }: HttpContextContract): Promise<void> {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).send({ error: 'User not found' })
    }

    await user.delete()

    return response.send({ message: 'User deleted successfully' })
  }

  public static async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)

    return token
  }

  public static async sendResetCode({ request, response }: HttpContextContract) {
    // try {
    const validationSchema = UserValidator.sendResetCodeSchema
    const messages = UserValidator.messages

    const { email, username } = await request.validate({
      schema: validationSchema,
      messages,
    })

    let userQuery = User.query()

    if (email) {
      userQuery = userQuery.where('email', email)
    }

    if (username) {
      userQuery = userQuery.where('username', username)
    }

    const user = await userQuery.first()

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Set the reset code and its expiry time
    user.resetCode = resetCode
    user.resetCodeExpiresAt = DateTime.now().plus({ minutes: 15 }) // Set expiry time (e.g., 15 minutes from now)
    await user.save()

    await UserController.sendResetCodeEmail(user.email, resetCode)

    // Return a success response
    return response.status(200).json({ resetCode, message: 'Reset code sent successfully' })
    // } catch (error) {
    //   // console.log({ status: error.status })
    //   // console.log({ code: error.code })
    //   // console.log({ message: error.messages })

    // }
  }
}
