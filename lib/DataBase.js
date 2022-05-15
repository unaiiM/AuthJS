const fs = require("fs");
module.exports = class DataBase {
	constructor(PathToFile){
		this.dbpath = PathToFile;
	}
	load(){
		let dbpath = this.dbpath;
		this.db = JSON.parse(fs.readFileSync(dbpath).toString());
		return;
	}
	reset(){
		let dbpath = this.dbpath;
		let database = JSON.stringify({});
		fs.writeFileSync(dbpath, database);
		return; 
	}
	create(key, value){
		let db = this.db;
		db[key] = value;
		this.update();
		return;
	}
	update(){
		let dbpath = this.dbpath;
		let db = JSON.stringify(this.db);
		fs.writeFileSync(dbpath, db);
		return;
	}
	content(){
		let dbpath = this.dbpath;
		let database = (JSON.parse(fs.readFileSync(dbpath).toString()));
	        return database; 
	}
	read(path){
		let db = this.db;
		path = path.split(".");
		let currentObj = db;
		for(let i = 0; i < path.length; i++){	
			currentObj = currentObj[path[i]];
		};
		return currentObj;
	}
	write(path, value){
		let db = this.db;
		path = path.split(".");
		let currentObj = db;
		for(let i = 0; i < path.length; i++){
			if(i === (path.length - 1)){
				currentObj[path[i]] = value;
				break;
			};
			currentObj = currentObj[path[i]];
		};
		this.update();
		return;
	}
	remove(path){
		let db = this.db;
		path = path.split(".");
		let currentObj = db;
		for(let i = 0; i < path.length; i++){
			if(i === (path.length - 2)){
				let keys = Object.keys(currentObj[path[i]]);
				let newObj = {};
				keys.splice((keys.indexOf(path[i + 1])), 1);
				for(let x = 0; x < keys.length; x++){
					newObj[keys[i]] = currentObj[path[i]][keys[i]];
				};
				console.log(newObj);
				currentObj[path[i]] = newObj;
				break;
			};
			currentObj = currentObj[path[i]];
		};
		this.update();
		return;
	}
	check(path){
		let db = this.db;
		path = path.split(".");
		let currentObj = db;
		for(let i = 0; i < path.length; i++){	
			currentObj = currentObj[path[i]];
			if(currentObj === undefined){
				return false;
			};
		};	
		return true;
	}
}
/*
const path = __dirname;
const db = new DataBase(path + "/try.json");
db.load();
db.write("wordpress.title", "Hello Wold");
console.log(db.read("wordpress.title"));
*/
