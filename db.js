var mssql = require("mssql"); 
var config = {
        user: 'origsvc_boss',
        password: 'n@ti0nstar123',
        server: '10.64.187.38', 
        database: 'ACES_BOSS_DEV',
		port: 1733,
    };

var connection = mssql.connect(config, function (err) {
	//console.log('connection', connection);
    if (err)
        throw err; 
});

module.exports = connection; 
