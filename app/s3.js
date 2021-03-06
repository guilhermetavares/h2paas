import AWS from 'aws-sdk'
import fs from 'fs'

import { templateReq, urlReq } from './core'
import { DEFAULT_BUCKET, AWS_REGION, S3_API_VERSION, ACL_DEFAULT } from './settings.js'

AWS.config.region = AWS_REGION
AWS.config.apiVersions = { s3: S3_API_VERSION }

const s3 = new AWS.S3();

export const s3EmitPDF = (res, {bucket = DEFAULT_BUCKET, acl = ACL_DEFAULT}) => (err, r) =>  {
	if (err) throw err;
	
	fs.readFile(r.filename, (err, buffer) => {
		const splitter = r.filename.split("/");
		const name = splitter[splitter.length - 1]
		
		s3.upload({ACL: acl, Bucket: bucket, Key: name, Body: buffer}, (err, data) => {
			if (err) throw err;

			res.json(data)
		});
	});
}

export const s3TemplateReq = (req, res, next) => templateReq(req, res, next, s3EmitPDF)

export const s3UrlReq = (req, res, next) => urlReq(req, res, next, s3EmitPDF)
