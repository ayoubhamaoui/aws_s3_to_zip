'use strict';

const AWS = require("aws-sdk");
AWS.config.update( { region: "us-east-1" } );
const s3 = new AWS.S3()
const   _archiver = require('archiver');


//This returns us a stream..
const streamTo = (_bucket, _key) => {
	var stream = require('stream');
	var _pass = new stream.PassThrough();
	s3.upload( { Bucket: _bucket, Key: _key, Body: _pass }, (_err, _data) => { /*...Handle Errors Here*/ } );
	return _pass;
};
      
exports.handler = async (_req, _ctx, _cb) => {
    //this variable hold name of s3 bucket
    var bucketName = 'alphaflink'

    //this one hold name of zip file
    var zippedFileName = 'fileName.zip'

    //_Keys list contains list of names of file in the bucket that we will insert inro zip file
	var _keys = ['untitled.png','aws-png-7.png'];
	
    var _list = await Promise.all(_keys.map(_key => new Promise((_resolve, _reject) => {
            s3.getObject({Bucket: bucketName, Key:_key}).promise().then(_data => _resolve( { data: _data.Body, name: `${_key.split('/').pop()}` } ));
        }
    ))).catch(_err => { throw new Error(_err) } );

    await new Promise((_resolve, _reject) => { 
        var _myStream = streamTo(bucketName, zippedFileName);		//instantiate that pipe...
        var _archive = _archiver('zip');
        _archive.on('error', err => { throw new Error(err); } );
        
        //Your promise gets resolved when the fluid stops running..
        _myStream.on('close', _resolve);
        _myStream.on('end', _resolve);
        _myStream.on('error', _reject);
        
        _archive.pipe(_myStream);			//Pass that pipe to _archive so it can push the fluid straigh down to S3 bucket
        _list.forEach(_itm => _archive.append(_itm.data, { name: _itm.name } ) );		//start adding files to it
        _archive.finalize();
    }).catch(_err => { throw new Error(_err) } );
    
    _cb(null, { } );		//Handle response back to server
};