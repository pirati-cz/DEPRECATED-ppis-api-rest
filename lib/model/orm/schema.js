conf = require('../../../init');
var Schema = require('jugglingdb').Schema;
var schema = new Schema(conf.dbSchema, conf.dbOptions);
schema.Text = Schema.Text;
module.exports = schema;
