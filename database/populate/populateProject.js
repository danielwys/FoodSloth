// const projectQuery = 
//     'CREATE TABLE project (' +
//         'pid SERIAL PRIMARY KEY,' +
//         'creator INTEGER REFERENCES users(id) ON DELETE SET NULL,' +
//         'title VARCHAR(256),' +
//         'description VARCHAR(256),' +
//         'category VARCHAR(64) REFERENCES category(name),' +
//         'startdate DATE NOT NULL,' +
//         'enddate DATE NOT NULL,' +
//         'amountrequested BIGSERIAL,' +
//         'funded BOOLEAN' +
//     ');'


exports.query =  
        'INSERT INTO project VALUES(DEFAULT, 1, \'New arts and craft project\', \'this is a new way of doing arts and crafts\', \'Art\', \'1999-01-01\', \'2018-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 1, \'SkateBar\', \'wanna go to the bar and skate at the same time?\', \'Games\', \'1999-01-01\', \'2018-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 3, \'Solar Panel for LIFE\', \'100% no fuss solar panel\', \'Games\', \'1999-01-01\', \'2019-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 3, \'Solar Panel Competitor\', \'the other panel is bad\', \'Games\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 6, \'New books\', \'some title and author\', \'Comics\', \'1999-01-01\', \'2019-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 6, \'BBC Competitor\', \'we are BBD!\', \'Journalism\', \'1999-01-01\', \'2018-04-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 7, \'New Clothes for all genders\', \'clothes for all genders~\', \'Fashion\', \'1999-01-06\', \'2018-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 5, \'Another Movie by Famous Actor\', \'another movie\', \'Film & Video\', \'1999-01-01\', \'2017-09-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 2, \'Another App\', \'another app for another platform\', \'Technology\', \'1999-01-01\', \'2018-11-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 5, \'projectTitleFOOBAR\', \'BAR BAR FOO BAR HAVE YOU ANY NULL\', \'Dance\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 2, \'Promises life for all\', \'gatica\', \'Journalism\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 5, \'projectTitleFOOBAR2\', \'YES SIR YES SIR NULL BAGS FOO\', \'Technology\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 8, \'Pottery\', \'pots and pans\', \'Crafts\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 5, \'New android\', \'android version 20\', \'Technology\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 5, \'Sick RnB\', \'some form of music\', \'Music\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    +   'INSERT INTO project VALUES(DEFAULT, 2, \'New Iphone\', \'ios version 30\', \'Technology\', \'1999-01-01\', \'2020-01-01\', 100000, FALSE);'
    ;
    