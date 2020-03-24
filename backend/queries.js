const Pool = require('pg').Pool
const pool = new Pool({
  user: 'harshita',
  host: 'localhost',
  database: 'project',
  password: 'sql',
  port: 5432,
})

const getAllUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY uid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE uid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { username, password, type } = request.body

  pool.query('INSERT INTO Users (username, password, type) VALUES ($1, $2, $3)', [username, password, type], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
}

