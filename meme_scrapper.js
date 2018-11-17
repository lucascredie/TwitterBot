/*
    This file scrapes from selected websites and writes it to a JSON file
*/
var request = require('request');
var cheerio = require('cheerio');
var download = require('image-downloader')
var fs = require('fs');
var config = require("./config");
const chalk = require('chalk');

var URL_array = [];


let urlSelection = [
    'http://devhumor.com/popular',
    'http://devhumor.com/',
    'http://devhumor.com/popular/month',
    'http://devhumor.com/popular/year',
    'http://devhumor.com/popular/week',
]

urlSelection.forEach((url)=>{
console.log(chalk.red(url));

request(url, function(err, res, body) {

    if(!err && res.statusCode === 200) { //if good request

        URL_array = readJSON("urls");

        var $ = cheerio.load(body);
        console.log(chalk.blueBright("---------------START----------------"));

        $(".single-media").each(function () {
            URL_array.push($(this).attr('src'));
            console.log(chalk.yellow($(this).attr('src')));
        });
        
        fs.writeFile('urls.json', JSON.stringify(URL_array), 'utf8', () => {
            console.log(chalk.yellow("wrote to JSON"));
        });
    }

    if(err) {
        console.log(chalk.red("error"));
    }
})//end of request

}) //end of foreach
//function that reads the json file and returns its content
function readJSON(filename) {
    let empty = [];

    fs.readFile(filename + '.json',function(content){
        if(content === undefined) {
            return empty;
        } else {
            return JSON.parse(content);
        }
        
      })

      return empty;
}

