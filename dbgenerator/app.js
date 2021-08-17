
const config = require('config')
const fs = require("fs")
const Pool = require('pg').Pool
const axios = require('axios')

// 1 -- read from config
// config
const db_conn = config.get('db')
const scale = config.get('scale')
console.log(db_conn)
console.log(scale)

// connect to db
const pool = new Pool({
    user: db_conn.user,
    host: db_conn.host,
    database: db_conn.database,
    password: db_conn.password,
    port: db_conn.port,
  })

  pool.query('select * from sp_get_all_movies()', (err, res) => {
      console.log(res.rows)
  })
  

// 2 -- clear the db
// call sp that deletes all the tables and reset the auto increment key
// logfile- write that the db was cleared

// 3 -- create the data
// 3.1 local file: i.e. countries, ..
// example of reading countreis from the file
let string_from_file = fs.readFileSync('data\\countries.json', {encoding:'utf8', flag:'r'});
data = JSON.parse(string_from_file)
console.log(data[10].name);
/*
// demo code
for(let i =0; i < data.length; i++)
{
    console.log(data[i].name)
    // call sp_insert_country(data[i].name)
    //query('call sp_delete_and_reset_orders()')
    pool.query(`select * from sp_insert_country(${data[i].name})`, (err, res) => {
        console.log(res.rows)
    })
}
*/
// 3.2 fetch from the internet
// 3.3 generate data by code, i.e. departure time, landing time -- random
//     remaining tickets, credit-card  -- random
//     logic (?) : flight with 0 remain, 0 tickets
// logfile- write the amount created
// *bonus: runing .............. ui indication
//         creating airtines ....................
//         creating customers ..............

// bring data from internet
const makeGet = async() => {
    try {
        const response = await axios.get("https://randomuser.me/api?results=10") // &seed=abc
        for (let i = 0 ; i < 10; i++) {
            console.log(response.data.results[i].name.first)
            //select * from sp_insert_customer('abc', 'abc')
            // call sp_insert_customer
            pool.query(`select * from sp_insert_customer('${response.data.results[i].name.first}', '${response.data.results[i].location.city}')`, (err, res) => {
                console.log(res.rows)
            })
        }
    }
    catch (err) {

        console.log("received error: ", err.toJSON());
      }
}

makeGet()