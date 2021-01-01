// Convert evernote files to plain text files
// evernote stores notes in a .enen file which is xml
// files are notebooks, each containing all of the notes in that notebook
// before you run this tool, use evernote for desktop and export all of your notes

var fs = require('fs');
var xml2js = require('xml2js');
var { htmlToText } = require('html-to-text');

parser = new xml2js.Parser();

processFiles('C:/Users/micha/Documents/evernote/');

function processFiles(pathToEvernote) {
    try {
        var notebooks = fs.readdirSync(pathToEvernote);
        notebooks.forEach(notebook => convertFile(pathToEvernote, notebook));
    } catch (error) {
        console.log(error);
    }
}

function removeFileExt(notebookName) {
    return notebookName.substring(0, notebookName.lastIndexOf('.'));
}

function cleanFileName(fileName) {
    console.log(fileName);
    return fileName.replace(/[^\w\.\-]/g, "");
}

function convertFile(pathToEvernote, notebook) {
    // do not process the output folder
    if (notebook == 'output') return;

    // create an output folder for the current notebook 
    var outputFolder = pathToEvernote+'output/'+removeFileExt(notebook)+'/';

    if ( !fs.existsSync(outputFolder) ) { 
        fs.mkdirSync(outputFolder);
    }

    fs.readFile(pathToEvernote+notebook, function(err, data) {
       
        //console.log('**** file read');
       // creaqte output directory if it doesn't already exist
       
       // console.log(err);
        //console.log(data);
        parser.parseString(data, function(err, result){
           // console.log(err);
            var x = result['en-export']['note'];
            //console.log(x[0].title[0]);

            //console. log(x.length);

            for ( var i=0; i< x.length; i++) {
                var note = x[i];
                //console.log(note);
                var noteContent = note.content[0];
                var textContent = htmlToText(noteContent
                    
                    , {
                    wordwrap: 130
                });

                // create the file
                fs.writeFileSync(outputFolder+cleanFileName(note.title[0])+'.txt', textContent, (err) => {
                    if ( err ) throw err;
                    console.log('success writing ', note.title[0]);
                });
                //console.log(textContent);
            }
        });
    } );

}


