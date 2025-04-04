const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('testJWT', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  timezone: '+07:00',
});
const Connection =async ()=>{
    try {
        await sequelize.authenticate();
        // console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
export default Connection   