var http = require('http');
http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'X-Powered-By': 'hope'
    });
    response.end(`
        <html lang="en">
            <head/>
            <body>
                <h1>SPOOL</h1>
                <p>Sprint Zero. No features to see yet.</p>
            </body>
        </html>
    `);
}).listen(process.env.PORT || 3000);
