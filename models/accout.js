const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://khang1998:Khang1998*@cluster0.ddzc5.mongodb.net/khangthetest?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true

});

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  taikhoan: String,
  vaitro: String,
  matkhau: String

}, {
  collection: 'account'
});

const AccountModel = mongoose.model('account', AccountSchema)


module.exports = AccountModel