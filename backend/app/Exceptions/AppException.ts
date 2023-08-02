// import { Exception } from '@adonisjs/core/build/standalone'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { StatusCodes } from 'http-status-codes'

// /*
// |--------------------------------------------------------------------------
// | Exception
// |--------------------------------------------------------------------------
// |
// | The Exception class imported from `@adonisjs/core` allows defining
// | a status code and error code for every exception.
// |
// | @example
// | new AppException('message', 500, 'E_RUNTIME_EXCEPTION')
// |
// */
// export default class AppException extends Exception {
//   private async jsonHandle(error: this, ctx: HttpContextContract): Promise<void> {
//     switch (error.code) {
//       case 'E_VALIDATION_FAILURE':
//         return ctx.response.status(StatusCodes.BAD_REQUEST).send(error.message)

//       case 'E_ROW_NOT_FOUND':
//         return ctx.response.status(StatusCodes.NOT_FOUND).send(error.message)

//       default:
//         return ctx.response
//           .status(error.status ?? StatusCodes.INTERNAL_SERVER_ERROR)
//           .send(error.message)
//     }
//   }

//   public async handle(error: this, ctx: HttpContextContract) {
//     switch (ctx.request.accepts(['html', 'json'])) {
//       case 'json':
//         this.jsonHandle(error, ctx)
//         break

//       default:
//         return ctx.response.status(error.status).send(error.message)
//     }
//   }
// }

import BaseExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AppException extends BaseExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(404).json({ error: 'Validation failed', messages: error.messages })
    }

    if (error.status && error.message) {
      return ctx.response.status(error.status).json({ error: error.message })
    }

    return super.handle(error, ctx)
  }

  public async report(error: any, ctx: HttpContextContract) {
    // You can log the error or send it to an error tracking service here.
  }
}
