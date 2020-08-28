# aws_s3_to_zip
Using NodeJS lambda function to zip list of files in bucket

## How to use
1. first install dependencies with:
```
cd aws_s3_to_zip

npm install
```

2. build the .zip file
```
zip -r ../zip-s3-files.zip .
```

3. Upload .zip file to S3 
Upload zip file to S3 using CLI (or you can use Web Interface):
```
aws s3 cp zip-s3-files.zip s3://my-bucket/
```
4. Create Lambda fucntion then use .zip file in s3 as code source 
