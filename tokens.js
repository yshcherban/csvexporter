/**
 * Created by wert on 15.02.16.
 */

const Chance  = require('chance');

const chance = new Chance();

const numeric = function(length){
    length = length || 4;
    return chance.string({length: length, pool: patterns.numeric});
};

const alphanumeric = function(length){
    length = length || 16;
    return chance.string({ length: length, pool: patterns.alphanumeric})
};

const guid = function() {
    return chance.guid();
};

const patterns = {
    numeric:        '0123456789',
    alphabet:       'abcdefghijklmnopqrstuvwxyz',
    alphanumeric:   '0123456789abcdefghijklmnopqrstuvwxyz'
};



module.exports.numeric          = numeric;
module.exports.pin              = numeric;
module.exports.alphanumeric     = alphanumeric;
module.exports.guid             = guid;