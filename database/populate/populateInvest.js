// const investmentQuery = 
//     'CREATE TABLE investment (' +
//         'id SERIAL PRIMARY KEY,' +
//         'investor VARCHAR(32) REFERENCES users(username) ON DELETE SET NULL,' +
//         'project SERIAL REFERENCES project(pid) ON DELETE SET NULL,' +
//         'amount DECIMAL CHECK(amount > 0),' +
//         'date DATE NOT NULL' +
//     ');';


exports.query =  
        'INSERT INTO investment VALUES(DEFAULT , \'username02\', \'4\', 3434 , \'2016-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username05\', \'3\', 100 , \'2017-05-03\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username00\', \'7\', 24 , \'2016-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username00\', \'2\', 7655 , \'2017-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username03\', \'5\', 11 , \'2017-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username05\', \'8\', 432 , \'2016-04-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username00\', \'12\', 256 , \'2016-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username08\', \'16\', 3333 , \'2017-09-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username09\', \'10\', 333 , \'2017-11-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username04\', \'2\', 5353 , \'2017-01-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username08\', \'1\', 2558 , \'2016-04-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username05\', \'1\', 3456 , \'2016-03-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username12\', \'2\', 3242 , \'2015-05-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username10\', \'11\', 999 , \'2017-05-12\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username11\', \'10\', 453 , \'2017-05-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username02\', \'10\', 23425 , \'2015-10-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username05\', \'12\', 999999 , \'2014-11-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username03\', \'13\', 9999 , \'2010-09-13\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username08\', \'13\', 3456 , \'2010-09-14\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username06\', \'12\', 999999 , \'2012-05-21\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username01\', \'16\', 3456 , \'2012-06-22\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username10\', \'10\', 3456 , \'2011-05-12\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username09\', \'5\', 112 , \'2015-07-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username03\', \'6\', 643 , \'2015-07-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username03\', \'7\', 453 , \'2017-05-01\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username02\', \'7\', 75 , \'2017-05-12\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username04\', \'6\', 222 , \'2016-03-21\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username06\', \'3\', 12 , \'2012-03-21\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username06\', \'2\', 12 , \'2011-05-21\');'
    +   'INSERT INTO investment VALUES(DEFAULT , \'username06\', \'1\', 12 , \'2012-05-21\');'
    ;
    