const path = __dirname;
const crypto = require("crypto"); 
const sha512crypto = require("./sha512crypt-node/sha512crypt.js");
const DataBase = new (require("./DataBase.js"))(path + "/../db/users.json");
DataBase.load();

class Identifier {
	constructor(){
		// static
		this.salt = this.randomBytes(16);
		//console.log(this.salt);
		return;
	}	
	randomBytes(len){
		let chars = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789";
		let max = chars.length;
		let output = "";
		for(let i = 0; i < len; i++){
			let random = Math.floor(Math.random() * max);
			let char = chars[random];
			output += char;
		};
		return output;
	}
	load(username){
		// tmp
		this.username = username;
		this.password = DataBase.read(username + ".password");
		//console.log(this.username, this.password);
		return;
	}
	generate(){
		let username = this.username;
		let password = this.password;
		let salt = this.salt;
		let secret = username + "&" + password;
		let hash = sha512crypto.b64_sha512crypt(secret, salt);
		hash = (hash.split("$"))[3];
		hash = username + "$" + hash;
		//console.log(hash);
		return hash;
	}
	validate(identifier){	
		let username = (identifier.split("$"))[0];
	 	let salt = this.salt;
		this.load(username);
		let hash = this.generate();
		if(hash === identifier) return true;
		else return false;
	}
}

class Profile {
	constructor(){ return; };
	load(username, password){
		// tmp
		this.username = username;
		this.password = password;
		return;
	};
	login(){
		let username = this.username;
		let password = this.password;
		let dbPassword = DataBase.read(username + ".password");
		if(password === dbPassword) return true;
		else return false;
	};
	register(){
		let username = this.username;
		let password = this.password;
		let users = Object.keys(DataBase.content());
		for(let i = 0; i < users.length; i++){
			if(users[i] === username){
				return false;
			};
		};
		password = crypto.createHash('md5').update(password).digest('hex').toString();
		let obj = { "password" : password };
		DataBase.create(username, obj);
		return true;
	};

};

module.exports = {
	Identifier,
	Profile
}

/*
const Session = new Identifier();
Session.load("unai");
let hash = Session.generate();
console.log(Session.validate(hash));
const profile = new Profile();
profile.load("hello", "patata");
console.log(profile.register());
Session.load("hello");
hash = Session.generate();
console.log(Session.validate(hash));
*/
