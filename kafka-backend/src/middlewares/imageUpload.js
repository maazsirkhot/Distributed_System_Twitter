
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

import config from '../../config/env/development';

aws.config.update({
  secretAccessKey: config.awsS3Keys.AWS_SECRET_ACCESS,
  accessKeyId: config.awsS3Keys.AWS_ACCESSKEY,
  region: config.awsS3Keys.REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'twitter-273-images',
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: 'Twitter-Images' });
    },
    key(req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
