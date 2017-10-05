var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var app = express();

// serve the files out of ./public as our main files
app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

var title = 'Simple COS Web Gallery';
// Serve index.ejs
app.get('/', function (req, res) {
  res.render('index', {status: '', title: title});
});

var aws = require('aws-sdk');
var awsConfig = require('aws-config');

// IF Reading from VCAP_SERVICES as after binding credentials
var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
var credentailsJson = vcap_services['Object Storage Dedicated'][0]['credentials'];
var s3 = new aws.S3(awsConfig({endpoint: credentailsJson['endpoint-url'],region: credentailsJson['region'], 
                       accessKeyId: credentailsJson['accessKeyID'], secretAccessKey: credentailsJson['secretAccessKey']}));

// If Directly reading from application code 
// s3 = new aws.S3(awsConfig({endpoint: '<ENDPOINT-URL>',region: '<REGION>', 
//        accessKeyId: '<AWS_ACCESS_KEY>', secretAccessKey: 'AWS_SECRET_KEY'}));    

var myBucket = 'web-images';

module.exports = {s3 : s3, 
				  myBucket: myBucket}

app.get('/imgs/:myimage',function(req,res){
  var
    imgStream = s3.getObject({
      Bucket: 'web-images',
      Key: req.params.myimage
    }).createReadStream();
 
  imgStream.pipe(res);
});


var imageUploadRouter = require('./src/routes/imageUploadRoutes')(title);
var galleryRouter = require('./src/routes/galleryRoutes')(title);

app.use('/gallery', galleryRouter);
app.use('/', imageUploadRouter);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});