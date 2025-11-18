import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

const app = express();

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));
const orders = [];
const PORT = 3077;

dotenv.config();
 const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
 }).promise();

app.get('/admin', async (req,res) =>{
    try {
        const [orders] = await pool.query ('SELECT * FROM orders ORDER BY timestamp DESC');
        res.render('admin', { orders });
    } catch (err) {
        console.error('error', err) 
        res.status(500).send(err.message);
    }
})

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/db-test', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    }
    catch (err) {
        console.error('error', err) 
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.post('/submit-order', async (req, res) => {
try {
    const order = req.body;

    console.log('New order submitted:', order);

    order.toppings = Array.isArray(order.toppings) ?
    order.toppings.join(", ") : "";

    const sql = 
    `INSERT INTO orders(customer, email, flavor, cone, toppings)
    VALUES (?, ?, ?, ?, ?);`;

    const params = [
        order.customer,
        order.email,
        order.flavor,
        order.cone
    ];
    let toppings = req.body["toppings[]"];
    order.toppings = Array.isArray(toppings) ? toppings.join(", ") : "";
    const [result] = await pool.execute(sql, params);
    console.log ('Order saved with ID:', result.insertId);

    res.render('confirmation', { order }); 
}
    catch (err) {
        console.error('error', err) 
        res.status(500).send('There was an error processing your order, please try again');
    }
});