var _ = require('lodash');
var mappings = require('./mappings');


function util (conditionData) {
	return _.uniq(conditionData,'CND_ID')
};

module.exports = util;