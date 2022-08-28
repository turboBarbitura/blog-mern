import mongoose from "mongoose";

//Создание модели постов по типу интерфейса в TS.
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //Обязательное поле.
  },
  text: {
    type: String,
    required: true,
    unique: true,
  },
  tags: {
    type: Array,
    default: [],
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
}, {
  timestamps: true, //Добавляет дату и время.
})


export default mongoose.model('Post', PostSchema)