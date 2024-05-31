import { Sequelize } from 'sequelize'
const db = new Sequelize('surya_varchas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

export default db
