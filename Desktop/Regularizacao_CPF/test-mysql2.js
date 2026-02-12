const mysql = require('mysql2');
require('dotenv').config();

const url = new URL(process.env.DATABASE_URL);
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: decodeURIComponent(url.password),
  database: 'reg_cpf'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com mysql2:', err);
    process.exit(1);
  }
  console.log('Conectado com sucesso usando mysql2!');
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    console.log('A solução é: ', results[0].solution);
    connection.end();
  });
});
