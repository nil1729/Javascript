const fetch = require('node-fetch');
var prompt = require('prompt');

const accountSid = 'AC343c3e936cb543d65509a51b52bda8d6';
const authToken = 'd4f1f622df07930276d6d465d3130122';
const client = require('twilio')(accountSid, authToken);

function send_sms(body, phoneNumber) {
    client.messages
        .create({
            body: body,
            from: '+12564729994',
            to: phoneNumber
        })
        .then(message => console.log('SMS ID: ' + message.sid));
}

var sms_count = 0;

var prompt_attributes = [{
    name: 'Phone_Number',
    validator: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
    warning: "Phone Number is not valid, it can only contains Numeric Characters and '+' sign (+919089819188)"
}];
prompt.start();
prompt.get(prompt_attributes, function(err, result) {
    if (err) {
        console.log(err);
        return 1;
    } else {
        var phoneNumber = result.Phone_Number;
        console.log('We will send a message after every 5 minutes for 30 minutes to this number: ' + phoneNumber);
        var interval = setInterval(() => {
            sms_count++;
            var body;
            fetch('https://api.kanye.rest')
                .then(response => response.json())
                .then(data => {
                    body = data.quote;
                })
                .then(() => {
                    send_sms(body, phoneNumber);
                }).then(() => {
                    console.log(sms_count + ' SMS SENT')
                });
            if (sms_count == 7) {
                clearInterval(interval);
            }
        }, 300000);
    }
});