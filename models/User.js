import mongoose from "mongoose";

//Создание карточки юзера по типу интерфейса в TS.
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, //Обязательное поле.
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },

  avatarUrl: String,
}, {
  timestamps: true, //Добавляет дату и время.
})


export default mongoose.model('User', UserSchema)