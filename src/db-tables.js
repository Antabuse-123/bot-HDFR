const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

module.exports = {

	Users_db : sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			unique: true,
			primaryKey:true,
		},
		name: Sequelize.STRING,
		rank: Sequelize.INTEGER,
		title : Sequelize.STRING,
		solve: Sequelize.ARRAY(Sequelize.INTEGER),
		score: Sequelize.INTEGER,
		challenges: Sequelize.INTEGER
	})
};