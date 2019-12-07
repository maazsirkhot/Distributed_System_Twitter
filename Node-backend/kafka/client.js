const rpc = new (require('./kafkarpc'))();

// make request to kafka
function make_request(queue_name, msg_payload, callback) {
  // console.log('in make request');
  // console.log(msg_payload);
  rpc.makeRequest(queue_name, msg_payload, (err, response) => {
    // It's like a general Remote procudre call.
    if (err) console.error(err);
    else {
      // console.log("response", response);
      callback(null, response);
    }
  });
}

exports.make_request = make_request;
