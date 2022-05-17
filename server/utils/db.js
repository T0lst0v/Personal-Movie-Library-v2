//had to move it to separate file, as when i try to use pgp(Db link) in 2 different
//controller files(user amd movies) it gave me warning - about establishing second connection to same DB

const pgp = require("pg-promise")();
const DB = pgp(process.env.POSTGRES);

module.exports = DB;
