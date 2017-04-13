const   fs          = require('fs'),
        Promise     = require('bluebird'),
        MongoClient = require('mongodb').MongoClient,
        ObjectId 	= require('mongodb').ObjectId,
        baby        = require('babyparse'),
        tokens      = require('./tokens');
        

const   dbConnect       = Promise.promisify(MongoClient.connect),
		writeFile	    = Promise.promisify(fs.writeFile),
        getCsvFromJson  = Promise.method(baby.unparse);


const	hostname			= 'mongodb://127.0.0.1:27017';
		dbName				= 'squad-server2-1',
		userCollectionName	= 'users',
		schoolID			= '57b6c9a6dd69264b6c5ba82d';


let dbReference;

dbConnect(`${hostname}/${dbName}`).then(db => {
	dbReference = db;

	const userCollection 	= db.collection(userCollectionName);
	const userCursor 		= userCollection.find({"permissions.schoolId": ObjectId(schoolID)});

	return userCursor.toArray();

}).then(userData => {
	const schoolCollection 	= dbReference.collection('schools');

	return userData.map(userObj => {
		const form = schoolCollection.find({"_id": ObjectId(schoolID), "forms._id": userObj.permissions[0].details.formId}, {"_id": 0, "forms.name": 1});
		//const house = schoolCollection.find({"_id": ObjectId(schoolID), "houses._id": userObj.permissions[0].details.houseId}, {"_id": 1, "houses.name": 1});

		return {
			"id": userObj._id,
			"firstName": userObj.firstName,
			"lastName": userObj.lastName,
			"gender": userObj.gender
		}

	});

}).then(users => {
    return getPromiseFromJsonFile(users);
}).then(res => {
    return createCsvFile(res);
}).then( () => {
	dbReference.close();	
});

function getPromiseFromJsonFile (file) {
    return getCsvFromJson(file);
}

function createCsvFile(json) {
    const suffix = tokens.guid();
    return writeFile(`${suffix}.csv`, json);
}