import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'

import {loginValidation, postCreateValidation, registerValidation} from './validations.js'
import {PostController, UserController} from './controllers/index.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'


//Аккаунт на монго через виртуальную машину. Подключение к базе данных.
mongoose.connect(
  process.env.MONGODB_URI
)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err))

//Создаем приложение по средствам експресс.
const app = express();

//Создаём хранилище, где мы будем сохранять картинки
const storage = multer.diskStorage({
  destination: (_, __, callBack) => { //Эта функция укажет путь, куда загружать файлы.
    if(!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    callBack(null, 'uploads')
  },
  filename: (_, file, callBack) => { //Эта функция укажет как их называть.
    callBack(null, file.originalname)
  },
})

//Функция, которая будет позволять использовать сам мультер.
const upload = multer({storage})

//Учит приложения распознавать JSON
app.use(express.json());

//CORS учит приложения принимать запросы с ДРУГИХ локал хостов.
app.use(cors())

//Учит приложение проверять папку uploads на наличие указанного файла и если он есть показывать картинку.
//Метод статик учит експресс понимать что ты не просто делаешь гет запрос, а именно гет запрос на получение статичного фала.
app.use('/uploads', express.static('uploads'))


//Приложение будет отлавливать гет запросы на корневой путь и возвращать хеллоу ворлд
app.get('/', (req, res) => {
  res.send('Hello World!!!');
});


//Регистрация пользователя. Вторым параметром принимает валидатор регистрации. Он проверяет все данные и если они ОК - возвращает саксес: тру.
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)


//Авторизация пользователя
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)


//Запрос информации о себе. Важно понимать, имеет ли пользователь возможность получить информацию о запросе, который он делает.
app.get('/auth/me', checkAuth, UserController.getMe)

//ТЭГИ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('posts/tags', PostController.getLastTags)
app.get('/tags', PostController.getLastTags)


//СТАТЬИ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//Гет запрос на получение всех статей.
app.get('/posts', PostController.getAll)


//Гет запрос на получение одной статьи. АЙДИ генерируется динамически.
app.get('/posts/:id', PostController.getOne)


//Пост запрос на создание статьи
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)


//Запрос делит на удаление статьи
app.delete('/posts/:id', checkAuth, PostController.remove)


//Запрос патч на обновление статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


//Запрос на ЗАГРУЗКУ ФАЛОВ!!!
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})


//Говорим приложению слушать порт 4444 и запускаться на нем. И в слуии ошибки выводить ее в консоль
app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
