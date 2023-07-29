const { isValidValue } = require("./src/util.js");
let efDB;
class Database {
 
  constructor(options) {
   if (!options.hasOwnProperty("adapter")) throw new TypeError("\"options\" parameter must have \"adapter\" prototype.");
   if (typeof options.databaseName !== "string") throw new TypeError("\"adapter\" prototype in \"options\" parameter must be String.");
   if(options.adapter === "YamlDB") efDB = require("./adapters/YamlDB.js")
   if(options.adapter !== "YamlDB") efDB = require("./adapters/JsonDB.js")

   	this.database = new efDB(options);
  }

  set(key, value) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");
    if (typeof value == "undefined") throw new TypeError("\"value\" parameter must be available.");
    if (!isValidValue(value)) throw new TypeError("\"value\" parameter must be String or Number or Boolean or Object or Array.");

    this.database.set(key, value);

    return this.database.get(key);
  }

  delete(key) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");

    this.database.delete(key);

    return true;
  }

  all() {
    return this.database.all();
  }

  get(key) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");

    return this.database.get(key);
  }

  has(key) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");

    return this.database.has(key);
  }

  fetch(key) {
    return this.get(key);
  }

  push(key, value) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");
    if (typeof value == "undefined") throw new TypeError("\"value\" parameter must be available.");
    if (!isValidValue(value)) throw new TypeError("\"value\" parameter must be String or Number or Boolean or Object or Array.");

    if ((this.database.has(key) == false) && (this.database.ignoreWarns == false)) console.warn("This data isn't available. Created new array to this data.");
    if (this.database.has(key) == false) this.database.set(key, []);

    let data = this.database.get(key);

    if (!Array.isArray(data)) throw new TypeError("This data isn't Array so couldn't pushed value to this data.");

    data.push(value);
    this.database.set(key, data)

    return data;
  }
  unpush(key, value) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");
    if (typeof value == "undefined") throw new TypeError("\"value\" parameter must be available.");
    if (!isValidValue(value)) throw new TypeError("\"value\" parameter must be String or Number or Boolean or Object or Array.");

    if ((this.database.has(key) == false) && (this.database.ignoreWarns == false)) console.warn("This data isn't available. Created new array to this data.");
    if (this.database.has(key) == false) this.database.set(key, []);


    if (!Array.isArray(this.database.get(key))) throw new TypeError("This data isn't Array so couldn't pushed value to this data.");

    
    this.database.set(key, this.database.get(key).filter(k => k != value))

    return this.database.get(key);
  }

  add(key, value) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");
    if (typeof value == "undefined") throw new TypeError("\"value\" parameter must be available.");
    if (typeof value != "number") throw new TypeError("\"value\" parameter must be Number.");

    if ((this.database.has(key) == false) && (this.database.ignoreWarns == false)) console.warn("This data isn't available. The data to be added is received as 0.");
    if (this.database.has(key) == false) this.database.set(key, 0);

    let data = this.database.get(key);
    this.database.set(key, (data + value));
    data = this.database.get(key);

    return data;
  }

  subtract(key, value) {
    if (typeof key == "undefined") throw new TypeError("\"key\" parameter must be available.");
    if (typeof key != "string") throw new TypeError("\"key\" parameter must be String.");
    if (typeof value == "undefined") throw new TypeError("\"value\" parameter must be available.");
    if (typeof value != "number") throw new TypeError("\"value\" parameter must be Number.");

    if ((this.database.has(key) == false) && (this.database.ignoreWarns == false)) console.warn("This data isn't available. The data to be subtracted is received as 0.");
    if (this.database.has(key) == false) this.database.set(key, 0);

    let data = this.database.get(key);
    this.database.set(key, (data - value));
    data = this.database.get(key);

    return data;
  }

  substract(key, value) {
    return this.subtract(key, value);
  }

  deleteAll() {
    this.database.deleteAll();

    return true;
  }
}

module.exports = Database;
