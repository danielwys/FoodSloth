    // 'CREATE TABLE project_category ( ' +
    //     'pid INT REFERENCES project(pid), ' +
    //     'name VARCHAR(64) REFERENCES category(name) ' +
    //     ');'
    // Art, Comics, Crafts, Dance, Design, Fashion, Film & Video
    // Food, Games, Journalism, Music, Photography, Publishing, 
    // Technology, Theater


exports.query =  
        'INSERT INTO project_category VALUES(1, \'Art\');'
    +   'INSERT INTO project_category VALUES(1, \'Photography\');'
    +   'INSERT INTO project_category VALUES(2, \'Technology\');'
    +   'INSERT INTO project_category VALUES(3, \'Crafts\');'
    +   'INSERT INTO project_category VALUES(4, \'Technology\');'
    +   'INSERT INTO project_category VALUES(5, \'Publishing\');'
    +   'INSERT INTO project_category VALUES(6, \'Journalism\');'
    +   'INSERT INTO project_category VALUES(7, \'Fashion\');'
    +   'INSERT INTO project_category VALUES(8, \'Technology\');'
    +   'INSERT INTO project_category VALUES(8, \'Games\');'
    +   'INSERT INTO project_category VALUES(8, \'Crafts\');'
    +   'INSERT INTO project_category VALUES(9, \'Journalism\');'
    +   'INSERT INTO project_category VALUES(10, \'Technology\');'
    +   'INSERT INTO project_category VALUES(11, \'Technology\');'
    +   'INSERT INTO project_category VALUES(12, \'Fashion\');'
    +   'INSERT INTO project_category VALUES(13, \'Crafts\');'
    +   'INSERT INTO project_category VALUES(13, \'Journalism\');'
    +   'INSERT INTO project_category VALUES(13, \'Crafts\');'
    +   'INSERT INTO project_category VALUES(14, \'Technology\');'
    +   'INSERT INTO project_category VALUES(15, \'Music\');'
    +   'INSERT INTO project_category VALUES(15, \'Photography\');'
    +   'INSERT INTO project_category VALUES(16, \'Technology\');'
    ;