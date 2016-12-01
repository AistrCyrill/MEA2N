// Grab the packages we need for the user model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema

var UserSchema = new Schema({
		name: String,
	username : { type: String, required: true, index: { unique: true }},
	password: { type: String, required : true, select: false}
});

// Hash the pass before the user is saved 

UserSchema.pre('save', function(next){
	var user = this;
	// hash the pass inly if the password has been changed or user is new
	if(!user.isModified('password')) return next();

	//generate the hasj
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);

		//change the pass to the hashed version
		user.password = hash;
		next();
	});
});

//Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
};


//return the model
module.exports = mongoose.model('User', UserSchema);