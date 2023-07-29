const { isObject, setObject, getObject, deleteObject } = require("../src/util");
const fs = require("fs")

module.exports = class {
  constructor(options) {
    if (!isObject(options)) throw new TypeError("\"options\" parameter must be Object.");
    if (!options.hasOwnProperty("databaseName")) throw new TypeError("\"options\" parameter must have \"databaseName\" prototype.");
    if (typeof options.databaseName !== "string") throw new TypeError("\"databaseName\" prototype in \"options\" parameter must be String.");

    if (options.hasOwnProperty("ignoreWarns") && (typeof options.ignoreWarns !== "boolean")) throw new TypeError("\"ignoreWarns\" prototype in \"options\" parameter must be Boolean.");
    if (options.hasOwnProperty("autoFile") && (typeof options.autoFile !== "boolean")) throw new TypeError("\"autoFile\" prototype in \"options\" parameter must be Boolean.");
    if (options.hasOwnProperty("deletingBlankData") && (typeof options.deletingBlankData !== "boolean")) throw new TypeError("\"deletingBlankData\" prototype in \"options\" parameter must be Boolean.");

    this.databaseName = options.databaseName;
    this.seperator = options.seperator || ".";
    this.ignoreWarns = ((typeof options.ignoreWarns != "undefined") ? options.ignoreWarns : false);
    this.autoFile = ((typeof options.autoFile != "undefined") ? options.autoFile : true);
    this.deletingBlankData = ((typeof options.deletingBlankData != "undefined") ? options.deletingBlankData : false);

    if (this.autoFile == true) {
      if (fs.existsSync(`./efdb/${this.databaseName}.json`) == false) {
        if (fs.existsSync("./efdb") == false) {
          fs.mkdirSync("./efdb");
        }

        fs.writeFileSync(`./efdb/${this.databaseName}.json`, "{}");
      }
    }
  }

  set(key, value) {
    let data = fs.readFileSync(`./efdb/${this.databaseName}.json`, "utf8");
    data = setObject(JSON.parse(data), key, value, this.seperator);

   fs.writeFileSync(`./efdb/${this.databaseName}.json`, JSON.stringify(data, null, 2));
     return data;
  }

  deleteAll() {
    fs.writeFileSync(`./efdb/${this.databaseName}.json`, "{}");
    return true;
  }
  
  get(key) {
    let data = fs.readFileSync(`./efdb/${this.databaseName}.json`, "utf8");
    data = getObject(JSON.parse(data), key, this.seperator);

    return data;
  }

  has(key) {
    let data = fs.readFileSync(`./efdb/${this.databaseName}.json`, "utf8");
    data = getObject(JSON.parse(data), key, this.seperator);

    return (typeof data != "undefined");
  }

  delete(key) {
    let data = fs.readFileSync(`./efdb/${this.databaseName}.json`, "utf8");
    data = deleteObject(JSON.parse(data), key, this.seperator);

    if (this.deletingBlankData == true) {
       for (let i = 0; i < key.split(this.seperator).length; i++) {
        let newGet = getObject(data, key.split(this.seperator).slice(0, -(i + 1)).join(this.seperator));

        if ((isObject(newGet) == true) && (Object.keys(newGet).length == 0)) {
          data = deleteObject(data, key.split(this.seperator).slice(0, -(i + 1)).join("."));
        }
      }
    }
   fs.writeFileSync(`./efdb/${this.databaseName}.json`, JSON.stringify(data, null, 2));
   
    return true;
  }

  all() {
    let data = fs.readFileSync(`./efdb/${this.databaseName}.json`, "utf8");

    return JSON.parse(data);
  }
}
