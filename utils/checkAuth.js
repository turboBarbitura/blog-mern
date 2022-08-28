import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  //Получаем токен. Если токена нет, передается пустая строчка.
  //Если токен есть из него вычетается слово Bearer и заменяется на пустую строчку.
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123')

      req.userId = decoded._id
      next()
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа'
      })
    }

  } else {
    return res.status(403).json({
      message: 'Нет доступа'
    })
  }
}