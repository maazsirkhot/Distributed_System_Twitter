import config from '../config';

const kafka = require('kafka-node');

console.log(`-------------${config.kafkaUrl}--------------`);
function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    this.client = new kafka.Client(`${config.kafkaUrl}:2181`); // No need to contain http
    this.kafkaConsumerConnection = new kafka.Consumer(this.client,
      [{ topic: topic_name, partition: 0 }]);
    this.client.on('ready', () => { /* console.log('client ready!') */ });

    return this.kafkaConsumerConnection;
  };

  // Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.Client(`${config.kafkaUrl}:2181`); // No need to contain http
      const { HighLevelProducer } = kafka;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      // console.log('producer ready');
    }
    return this.kafkaProducerConnection;
  };
}
module.exports = new ConnectionProvider();
