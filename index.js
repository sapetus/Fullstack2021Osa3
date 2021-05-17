require('dotenv').config()
const express = require('express')
const Person = require('./models/person.js')

const app = express()

app.use(express.json())
app.use(express.static('build'))

//use morgan (logs info to console)
const morgan = require('morgan')
morgan.token('data', (req, res) => {
  return (
    JSON.stringify(req.body)
  )
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

//get all persons at specified address (works with MongoDB)
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(people => {
    res.json(people)
  })
    .catch(error => next(error))
})

//show info at specified address (works with MongoDB)
app.get('/info', (req, res, next) => {
  Person.countDocuments({}, (error, count) => {
    const dataToSend =
            `Phonebook has info for ${count} people 
            <br><br> 
            ${Date()}`

    res.send(dataToSend)
  })
    .catch(error => next(error))
})

//show info of a specified resource (works with MongoDB)
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

//Delete info of a specified resource (workds with MongoDB)
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

//add a person to the list (works with MongoDB)
app.post('/api/persons', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number

  //checks that the name and number are valid
  if (!name || !number) {
    return res.status(400).end()
  }

  //create a new Person
  const person = new Person({
    name: name,
    number: number
  })

  //save to database and show
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

//update a person in the list (workds with MongoDB)
//this lets the user change the number of the person to be less than set in schema, I tried to fix it but it seems that is beyond my current understanding
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

//if nothing matches, use this (works with MongoDB)
const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})