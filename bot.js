console.log("Bot Started...");
var request = require('request');
var cheerio = require('cheerio');
var Twit = require("twit");
var download = require('image-downloader')
var fs = require('fs');
var config = require("./config");
const chalk = require('chalk');

var T = new Twit(config);

let urlSelection = [
    'http://devhumor.com/popular',
    'http://devhumor.com/',
    'http://devhumor.com/popular/month',
    'http://devhumor.com/popular/year',
    'http://devhumor.com/popular/week',
]
var randomIndex;
var array = [];

//set time out
request('http://devhumor.com/popular', function(err, res, body) {

    if(!err && res.statusCode === 200) { //if good request
        
        var $ = cheerio.load(body);
        console.log(chalk.blueBright("---------------START----------------"));

        $(".single-media").each(function () {
            array.push($(this).attr('src'));
            console.log(chalk.yellow($(this).attr('src')));
        });
        
        // console.log(array);
        randomIndex = Math.floor(Math.random() * (array.length -1)) ;
        // console.log(randomIndex);

        var selectedURL = array[randomIndex] + "";
        // console.log(url);

        const options = {
            url: selectedURL,
            dest: 'memes/picture.jpg'                  // Save to /path/to/dest/image.jpg
          }

        download.image(options)                        // Downloads image
            .then(({ filename, image }) => {
                
                console.log('File saved to', filename)
                var b64picture = fs.readFileSync('./memes/picture.jpg', { encoding: 'base64' })

                T.post('media/upload', { media_data: b64picture }, function (err, data, response) {
                    console.log("UPLOADED!")
                    var mediaIdStr = data.media_id_string
                    var altText = "yet another meme";
                    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText }}

                    T.post('media/metadata/create', meta_params, function (err, data, response) {
                        if (!err) {
                          // now we can reference the media and post a tweet (media will attach to the tweet)
                          var params = { status: '', media_ids: [mediaIdStr] }
                     
                          T.post('statuses/update', params, function (err, data, response) {
                            console.log(data);
                          })
                        }
                      })
                      
                })

        }).catch((err) => {
                console.error(chalk.red(err));
            })

        // T.post('statuses/update', { status: url }, function(err, data, response) {
        //     console.log(data)
        //   })
    }

    if(err) {
        console.log(chalk.red("error"));
    }
})//end of request
// //tweeting
// T.post('statuses/update', { status: 'testing from outer space' }, function(err, data, response) {
//     console.log(data)
// 