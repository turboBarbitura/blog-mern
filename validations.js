import {body} from "express-validator";

//Валидирует введенные пользователем данные при регистрации.
export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
  body('fullName', 'Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аву').optional().isURL(), //Optional() - означает что аватарка может быть или не быть. Не обязательный параметр.
]


//Валидирует введенные пользователем данные при авторизации.
export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]


//Валидирует введенные пользователем данные для статей.
export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]