const http = require('http')
const queryString = require('node:querystring')
const fs = require('fs')
const path = require('path')

const PORT = 5000
const filePath = path.join(process.cwd(), 'data.json')

const Server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write("HOME ROUTE!")
        res.end()
        return
    }
    if (req.url === '/login') {
        res.setHeader('Content-Type', 'text/html')
        res.write(`<form action="/submit method="POST">
            <input type="text" name="username" placeholder="Enter username"/></br>
            <input type="password" name="password" placeholder="Enter password"/></br>
            <button>Submit</button>
            </form>`)
        res.end()
        return
    }
    if (req.url === '/submit') {
        let data = ""
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            const parsedData = queryString.parse(data)
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log("Error's reading file", err);
                }
                else {
                    console.log('data--->', data);
                }
            })
            res.write('Success')
            res.end()
        })
        return
    }

    res.write("INVALID ROUTE!")
    res.end()
})

Server.listen(PORT, () => {
    console.log(`my server is running on PORT ${PORT}!`)
})