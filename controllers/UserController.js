import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //Шифрование пароля
    //Вытаскиваем пароль, который пришел с фронта
    const password = req.body.password
    //СОздаем метод шифрования
    const salt = await bcrypt.genSalt(10)
    //Помещаяем в переменную зашифрованный пароль
    const hash = await bcrypt.hash(password, salt)

    //Создание документа нового пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    //Создаём самого пользователя с помощью моногоДБ
    const user = await doc.save()

    //Создаём токен, в котором будет зашифрован ID пользователя, чтоб потом с ним работать
    const token = jwt.sign({
        _id: user._id
      }, 'secret123',
      {
        expiresIn: '30d'
      })

    //Деструктуризируем объект, чтоб выиащить из него пароль и не возвращать его, в целях безопасности.
    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData, //Информация о пользователе без пароля
      token
    })
  } catch (err) { //Обработка ошибки.
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться...'
    })
  }
}

export const login = async (req, res) => {
  try {

    //Создаём пользоваетля и ищем его в базе данных.
    const user = await UserModel.findOne({ email: req.body.email})
    if (!user) {
      return req.status(404).json({
        message: 'Такой пользователь не найден...' //Обычно пишут неверный логин или пароль.
      })
    }

    //Проверяем пароль. И сравниваем введенный пароль в запросе и парорль из документа пользователя в МОНГО.
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
    if(!isValidPassword) {
      return res.status(400).json({
        message: 'Не верный логи или пароль...'
      })
    }

    //Генерируем токен
    const token = jwt.sign({
        _id: user._id
      }, 'secret123',
      {
        expiresIn: '30d'
      })

    //Деструктуризируем объект, чтоб выиащить из него пароль и не возвращать его, в целях безопасности.
    //Вытаскиваем информацию о пользователе.
    const {passwordHash, ...userData} = user._doc

    //Возвращаем ответ.
    res.json({
      ...userData, //Информация о пользователе без пароля.
      token
    })

  } catch (err) { //Если произошла ошибка, придет оповещение.
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться...'
    })
  }
}

export const getMe = async (req, res)=>{
  try{
    const user = await UserModel.findById(req.userId)

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    const {passwordHash, ...userData} = user._doc
    res.json(userData)

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Нет доступа'
    })
  }


}