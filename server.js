//load lib
const express = require('express')
const path = require('path')
const request = require('request')
const hbs = require('express-handlebars')
var async = require("async")

//start application
const app = express()
app.engine('handlebars', hbs({ defaultLayout: 'index'}))
app.set('view engine', 'handlebars')

//predefined data
let db = {}
let attributes = []
let global_count = 0

//routes
app.get ('/', (req, res) => [
  res.status(200).render('giphy', {layout: 'index'})
])

app.get('/random', (req, res) => {
  const term = req.query.term
  const count = req.query.count
  promiseForGetImage(term, count);
  Promise.all(promiseForGetImage).then(res.status(201).format({
        'text/html' : () => {res.render('giphy', { term: term, images: attributes, layout: 'index'})}
  }))
})

function promiseForGetImage(term, count) {
  return new Promise( (resolve, reject) => {
    for (let i = 0; i < count; i++) {
      request.get(`https://api.giphy.com/v1/gifs/random?api_key=rE028HISv3riXpopNBbasxNmEahKoSa5&tag=${term}&rating=G`, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        url = JSON.parse(body).data.image_url
        timestamp = new Date()
        db[i] = url
        console.info (db)
          attributes = Object.values(db)
        console.info (attributes)
          global_count = attributes.length
        console.info (global_count)
      });
    }
    resolve(attributes)
  });
}

//listen
PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
app.listen (PORT, () => {
  console.info (`Application started on port ${PORT}`)
})