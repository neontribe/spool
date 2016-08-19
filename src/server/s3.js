// middleware handler for getting s3 signed url
var AWS = require('aws-sdk');
var express = require('express');

function S3Router(options) {
  var S3_BUCKET = options.bucket;

  if (!S3_BUCKET) {
    throw new Error("S3_BUCKET is required.");
  }

  var router = new express.Router();

  function findType(string) {
    var n = string.lastIndexOf('/');
    return string.substring(n+1);
  }

  router.get('/sign', function(req, res) {
    var filename = req.query.objectName;
    var mimeType = req.query.contentType;
    var ext = '.' + findType(mimeType);
    var fileKey = filename + ext;

    var s3 = new AWS.S3();

    var params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Expires: 600,
      ContentType: mimeType,
      ACL: options.ACL || 'private'
    };

    s3.getSignedUrl('putObject', params, function(err, data) {
      if (err) {
        console.log(err);
        return res.send(500, "Cannot create S3 signed URL");
      }
      res.json({
        signedUrl: data,
        publicUrl: 'https://s3.amazonaws.com/'+ S3_BUCKET + '/' + fileKey,
        filename: filename
      });
    });
  });



  return router;
}

module.exports = S3Router;
