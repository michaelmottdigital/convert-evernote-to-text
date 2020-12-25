var fs = require('fs');
var xml2js = require('xml2js');

parser = new xml2js.Parser();

fs.readFile('foo.xml', function(err, data) {
    parser.parseString(data, function(err, result){
        console.dir(result);
        console.log('done');
    });
} );

