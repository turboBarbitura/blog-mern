import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec() //Прикрутит юзера к запросу статей
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id //Вытаскивает ID статьи


    PostModel.findOneAndUpdate({

        _id: postId, //Найдет статью по айди

      },
      {
        $inc: {viewsCount: 1} //Инкриментирует счетчик просмотров. Встроеная в МОНГО функция.
      },
      {
        returnDocument: 'after' //Чтоб вернулся сразу обновленный результат.
      },

      (err, doc) => { //Функция которая выполнится.
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Не удалось вернуть статью'
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }

        res.json(doc)
      }).populate('user') //Популейт это метод монгуса для поиска одного юзера
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id //Вытаскивает ID статьи


    PostModel.findOneAndDelete({
        _id: postId
      }, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(500).json({
            message: 'Не удалось удалить статью'
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }

        res.json({
          success: true
        })
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось удалить статью'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось создать статью...'
    })
  }
}

export const update = async (req, res) => {
  try {

    const postId = req.params.id

    await PostModel.updateOne({
        _id: postId
      }, {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      }
    )

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось обновить статью...'
    })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec() //Прикрутит юзера к запросу статей

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)


    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить теги'
    })
  }
}