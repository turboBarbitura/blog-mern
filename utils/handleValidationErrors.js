import {validationResult} from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req)
  //Если валидация не прошла, верни одну ошибку или список ошибок.
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }
  //Если ошибок нет то иди далее.
  next()
}
