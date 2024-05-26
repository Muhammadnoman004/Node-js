const http = require('http')
const queryString = require('node:querystring')
const fs = require('fs')
const path = require('path')

const PORT = 5000
const filePath = path.join(process.cwd(), 'data.json')

const Server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write(`<h1>HOME ROUTE!</h1>`)
        res.end()
        return
    }
    if (req.url === '/login') {
        res.setHeader('Content-Type', 'text/html')
        res.write(`<h1>Login</h1> <form action="/submit" method="POST">
            <input type="text" name="username" placeholder="Enter username"/></br>
            <input type="password" name="password" placeholder="Enter password"/></br>
            <button type="submit">login</button>
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
    if (req.url === '/signup') {
        res.write(`<h1>Sign Up</h1>
        <form action="/submit" method="POST">
                <input type="text" name="username" placeholder="Enter username"/></br>
                <input type="password" name="password" placeholder="Enter password"/></br>
                <input type="password" name="confirm_password" placeholder="Enter confirm password"/></br>
                <button type="submit">sign up</button>
        </form>`)
        res.end()
        return
    }
    if (req.url === '/submit') {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            let parse = queryString.parse(data)
            if (parse.password === parse.confirm_password) {

                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.log("singnUp err---->", err);
                        return
                    }
                    const jsondata = JSON.parse(data)
                    const NewUser = {
                        id: jsondata.users.length + 1,
                        username: parse.username,
                        password: parse.password
                    }

                    jsondata.users.push(NewUser)

                    fs.writeFile(filePath, JSON.stringify(jsondata, 2), (err) => {
                        if (err) {
                            console.log("JsonData--->", err)
                        }
                        else {
                            res.end('signUp successfully')
                            return
                        }
                    })
                })
            }
        })
        return
    }

    res.write("INVALID ROUTE!")
    res.end()
})

Server.listen(PORT, () => {
    console.log(`my server is running on PORT ${PORT}!`)
})