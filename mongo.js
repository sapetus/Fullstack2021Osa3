const mongoose = require('mongoose');

//process.argv[3] -> person.name
//process.argv[4] -> person.number

//only password is given
if (process.argv.length == 3) {
    //print out all the people in the database
    const password = process.argv[2];
    const url = `mongodb+srv://fullstack:${password}@cluster0.rrt8p.mongodb.net/FullstackOsa3?retryWrites=true&w=majority`;

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });
    
    const Person = mongoose.model('Person', personSchema);

    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name + ' ' + person.number);
        });
        mongoose.connection.close();
    });
//password, name and number is given 
} else if (process.argv.length == 5) { 
    //add person to database and print out 'added {name} number {number} to phonebook'
    const password = process.argv[2];

    const url = `mongodb+srv://fullstack:${password}@cluster0.rrt8p.mongodb.net/FullstackOsa3?retryWrites=true&w=majority`;

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });
    
    const Person = mongoose.model('Person', personSchema);

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(result => {
        console.log(`Added ${person.name}, number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
};