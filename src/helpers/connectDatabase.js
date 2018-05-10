const mongoose = require('mongoose');

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'production') return 'mongodb://admin:123@ds113169.mlab.com:13169/mean1003'; 
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/mean1003-test';
    return 'mongodb://localhost/mean1003';
}

mongoose.Promise = global.Promise;

mongoose.connect(getDatabaseUri(), { useMongoClient: true })
.then(() => console.log('Database connected.'))
.catch(error => {
    console.log(error.message);
    process.exit(1);
});
