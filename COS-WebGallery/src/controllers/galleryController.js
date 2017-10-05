var galleryController = function(title) {

    var s3 = require('../../app.js').s3;
    var myBucket = require('../../app.js').myBucket;
    var multer = require('multer');
    var multerS3 = require('multer-s3');
    var fs = require('fs');
    var https = require('https');
    var path = require('path');

    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: myBucket,
            key: function (req, file, cb) {
                cb(null, file.originalname);
                console.log(file);
            }
        })
    });

    var getGalleryImages = function (req, res) {
        var imgList = [];
        var params = {Bucket: myBucket};
        s3.listObjects(params, function (err, data) {
            if(data) {
                var bucketContents = data.Contents;
                for (var i = 0; i < bucketContents.length; i++) {
                    if(bucketContents[i].Key.search(/.jpg/i) > -1) {
                        console.log("image name is : "+bucketContents[i].Key);
                        imgList[i] = "imgs/"+bucketContents[i].Key;
                    }
                }
            }
            res.render('galleryView', {
                title: title,
                imageUrls: imgList
            });
        });
    };


    return {
        getGalleryImages: getGalleryImages,
        upload: upload
    };
};

module.exports = galleryController;
