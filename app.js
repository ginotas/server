const express = require('express')
const app = express()
const port = 3003
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ferma'
})

con.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Serveris veikia!! (kol nenuluzo:)');
})



// Iraso nauja posta
// INSERT INTO table_name (column1, column2, column3,...)
// VALUES (value1, value2, value3,...)
app.post('/cows', (req, res) => {
    console.log(req.body.title)
    const sql = `
        INSERT INTO cow_farm
        (name, weight, total_milk, last_milking_time)
        VALUES (?, ?, ?, ?)
        `;
    con.query(sql, [req.body.name, req.body.weight, req.body.total_milk, req.body.last_milking_time], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

// Trina posta
// DELETE FROM table_name
// WHERE some_column = some_value
app.delete('/cows/:id', (req, res) => {
    const sql = `
        DELETE FROM cow_farm
        WHERE id = ?
        `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

//Redagavimas
// UPDATE table_name
// SET column1=value, column2=value2,...
// WHERE some_column=some_value 
app.put('/cows/:id', (req, res) => {
    const sql = `
        UPDATE cow_farm
        SET name = ?, weight = ?, total_milk = ?, last_milking_time = ?
        WHERE id = ?
        `;
    con.query(sql, [req.body.name, req.body.weight, req.body.total_milk, req.body.last_milking_time, req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

// rodo visus postus
app.get('/cows', (req, res) => {
    con.query('SELECT * FROM cow_farm ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

// skaiciuoka irasus
// SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;
app.get('/cows/count', (req, res) => {
    con.query('SELECT COUNT(id) AS totalCow FROM cow_farm', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

// skaiciuoka total milk
// SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;
app.get('/cows/totalMilk', (req, res) => {
    con.query('SELECT SUM(total_milk) AS totalMilk FROM cow_farm', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

// skaiciuoja 
// SELECT COUNT(CustomerID), Country
// FROM Customers
// GROUP BY Country
// ORDER BY COUNT(CustomerID) DESC;

app.get('/books/cat-count', (req, res) => {
    con.query(`SELECT
    COUNT(id) AS count, category
    FROM books
    GROUP BY category
    ORDER BY COUNT(id) DESC
    `, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})