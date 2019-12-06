var kafka = require('kafka-node');
import config from '../config';
console.log(`-------------${config.kafkaUrl}--------------`);
function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        this.client = new kafka.Client(`${config.kafkaUrl}:2181`);  // No need to contain http
        this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0} ]);
        this.client.on('ready', function () { /* console.log('client ready!') */ })
            
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client(`${config.kafkaUrl}:2181`);  // No need to contain http
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            // console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;