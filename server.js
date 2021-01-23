require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

/*const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]*/

/*{
  "filmtv_ID": 2,
  "film_title": "Bugs Bunny's Third Movie: 1001 Rabbit Tales",
  "year": 1982,
  "genre": "Animation",
  "duration": 76,
  "country": "United States",
  "director": "David Detiege, Art Davis, Bill Perez",
  "actors": "N/A",
  "avg_vote": 7.7,
  "votes": 28
}*/


app.get('/movie', function handleGetMovie(req, res) {
  let response = MOVIES;

  /* When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive. */
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  /* When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive. */
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    )
  }

  /*  When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number. */

  

  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})