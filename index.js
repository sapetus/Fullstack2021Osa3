const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('build'));

//use morgan (logs info to console)
const morgan = require('morgan');
morgan.token('data', (req, res) => {
    return(
        JSON.stringify(req.body)
    );
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    },
    {
        id: 5,
        name: 'Erkki Esimerkki',
        number: '123-123-123456'
    }
]

//get all persons at specified address
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

//show info at specified address
app.get('/info', (req, res) => {
    const dataToSend = 
    `Phonebook has info for ${persons.length} people 
    <br><br> 
    ${Date()}`;

    res.send(dataToSend);
});

//show info of a specified resource
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id == id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end()
    }
});

//Delete info of a specified resource
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end
});

//add a person to the list
app.post('/api/persons', (req, res) => {
    const name = req.body.name;
    const number = req.body.number;

    //checks that the name and number are valid
    if (!name || !number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    } else if (persons.some(person => person.name === name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    //create a new person object
    const person = {
        id: Math.floor(Math.random() * 1000),
        name: name,
        number: number
    };

    //add the person object to existing list of persons
    persons = persons.concat(person);

    res.json(person);
});

//if nothing matches, use this
const unknownEndpoint = (req, res) => {
    res.status(400).send({error: 'unknown endpoint'});
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});