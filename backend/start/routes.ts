/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import UserController from 'App/Controllers/UserController'

Route.group(() => {
  Route.post('/register', UserController.store)
  Route.post('/login', UserController.login)
  Route.get('', UserController.index).middleware('auth')
  Route.get('/:id', UserController.show).middleware('auth')
  Route.put('/:id', UserController.update).middleware('auth')
  Route.delete('/:id', UserController.destroy).middleware('auth')
  Route.post('/forgot-password', UserController.sendResetCode)
}).prefix('/users')
