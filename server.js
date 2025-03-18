const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 3000

const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html'})
    fs.readFile('miniNotes.html', function(error ,data) {
        if(error) {
            res.writeHead(404, { 'Content-Type': 'text/html'})
            res.write('<h1>Error: File Not Found</h1>')
        }
        else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function(error) {
    if(error) console.log('An error occured: ' + error)
    else console.log('Server is listening on port ' + port)
})