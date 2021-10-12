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
    database: 'biblioteka'
})

con.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Yes!');
})






// Iraso nauja posta
// INSERT INTO table_name (column1, column2, column3,...)
// VALUES (value1, value2, value3,...)
app.post('/books', (req, res) => {
    console.log(req.body.title)
    const sql = `
        INSERT INTO books
        (title, author, category, pages)
        VALUES (?, ?, ?, ?)
        `;
    con.query(sql, [req.body.title, req.body.author, req.body.category, req.body.pages], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

// Trina posta
// DELETE FROM table_name
// WHERE some_column = some_value
app.delete('/books/:id', (req, res) => {
    const sql = `
        DELETE FROM books
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
app.put('/books/:id', (req, res) => {
    const sql = `
        UPDATE books
        SET title = ?, author = ?, category = ?, pages = ?
        WHERE id = ?
        `;
    con.query(sql, [req.body.title, req.body.author, req.body.category, req.body.pages, req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

// rodo visus postus
app.get('/books', (req, res) => {
    con.query('SELECT * FROM books ORDER BY id DESC', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

// skaiciuoka irasus
// SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;
app.get('/books/count', (req, res) => {
    con.query('SELECT COUNT(id) AS booksCount FROM books', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
})

// skaiciuoja kiekvienos kategorijos knygas
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