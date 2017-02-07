// middleware handler for getting s3 signed url
var AWS = require('aws-sdk');
var express = require('express');
var uuid = require('node-uuid');

function S3Router (options) {
    var S3_BUCKET = options.bucket;

    if (!S3_BUCKET) {
        throw new Error('S3_BUCKET is required.');
    }

    var router = new express.Router();

    function findType (string) {
        var n = string.lastIndexOf('/');
        return string.substring(n + 1);
    }

    router.get('/sign', function (req, res) {
        var filename = uuid.v4();
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

        s3.getSignedUrl('putObject', params, function (err, uploadUrl) {
            if (err) {
                console.log(err);
                return res.send(500, 'Cannot create S3 signed URL');
            }

            res.json({
                uploadUrl: uploadUrl,
                key: fileKey
            });
        });
    });

    router.get('/assets/:key', function (req, res) {
        console.log('Asset URL requested for :', req.params.key);
        var params = {
            Bucket: S3_BUCKET,
            Key: req.params.key,
            Expires: 3600
        };
        var s3 = new AWS.S3();
        // eslint-disable-next-line handle-callback-err
        s3.getSignedUrl('getObject', params, function (err, url) {
            /* Todo: Handle error callback */
            res.redirect(url);
        });
    });

    return router;
}

module.exports = S3Router;
