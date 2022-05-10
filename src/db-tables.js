const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Export the DB to access it all across the project
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
		challenges: Sequelize.ARRAY(Sequelize.INTEGER)
	}),
	UserClass : class User{
		constructor(id = null, name = null, rank = null, title = null, solve = null, score = null, challenges = null){
			this.id = id;
			this.name = name;
			this.rank = rank;
			this.title = title;
			this.solve = solve;
			this.score = score;
			this.challenges = challenges;
		}

	}
};
