function getSignedUrl(fileinfo) {
    let queryString = '?objectName=' + fileinfo.id + '&contentType=' + encodeURIComponent(fileinfo.type);
    return fetch('/s3/sign' + queryString)
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log('error: ', err);
        });
}

/**
 * Provide a method which will accept a blob
 * and upload it to s3
 */
export default function uploadToS3(blob) {
    let params = {
        type: blob.type,
        data: blob,
        id: Math.floor(Math.random()*9000) + 10000
    };

    return new Promise(function(resolve, reject){
        getSignedUrl(params)
        .then((s3Info) => {
            fetch(s3Info.uploadUrl, {
                method: 'PUT',
                cors: true,
                headers: new Headers({
                    'Content-Type': params.type,
                    'x-amz-acl': 'private'
                }),
                body: params.data
            })
            .then(() => {
                resolve(s3Info);
            })
            .catch((error) => {
                reject(error)
            });
        });
    });
}
