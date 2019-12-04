require('babel-core/register')()
require('babel-polyfill')
var connection =  require('../kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var Books = require('../services/books');
var Users = require('../services/users');
var Tweets = require('../services/tweets');
var Lists = require('../services/lists');
var Message = require('../services/message');
var Search = require('../services/search');

require('../src/models/sqlDB/index')
require('../src/models/mongoDB/index')

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("post_book",Books)
handleTopicRequest("users",Users)
handleTopicRequest("tweets",Tweets)
handleTopicRequest("lists", Lists)
handleTopicRequest("messages", Message)
handleTopicRequest("search", Search)
