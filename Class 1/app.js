const http = require('http')
const queryString = require('node:querystring')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt');

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
            fs.readFile(filePath, async (err, data) => {
                console.log("data--->", data.toString());
                const json = JSON.parse(data)

                if (err) {
                    console.log("Error's reading file", err);
                }
                else {
                    console.log('json--->', json);

                    const filter = json.users.filter((user) => user.username == parsedData.username)
                    const compareUser = await bcrypt.compare(parsedData.password, filter[0].password)

                    console.log("User mil gay---->", compareUser);
                    if (compareUser) {
                        res.end("<h1>Home Pages!</h1>")
                        return
                    }
                    else {
                        res.end("invalid credential!")
                    }
                }
            })
        })
        return
    }
    if (req.url === '/signup') {
        res.write(`<h1>Sign Up</h1>
        <form action="/submit2" method="POST">
                <input type="text" name="username" placeholder="Enter username"/></br>
                <input type="password" name="password" placeholder="Enter password"/></br>
                <input type="password" name="confirm_password" placeholder="Enter confirm password"/></br>
                <button type="submit">sign up</button>
        </form>`)
        res.end()
        return
    }
    if (req.url === '/submit2') {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            let parse = queryString.parse(data)
            if (parse.username && parse.password) {

                if (parse.password == parse.confirm_password) {
                    fs.readFile(filePath, (err, fileData) => {
                        if (err) {
                            console.log("singnUp err---->", err);
                            return
                        }
                        const jsondata = JSON.parse(fileData);

                        const saltRounds = 10;
                        bcrypt.hash(parse.password, saltRounds, function (err, hash) {
                            if (err) {
                                console.log("bcrypt hash err---->", err);
                                res.end('<h1>Error hashing password!</h1>');
                                return;
                            }

                            console.log("json data ==>", jsondata);
                            const NewUser = {
                                id: jsondata.users.length + 1,
                                username: parse.username,
                                password: hash
                            }

                            jsondata.users.push(NewUser)

                            fs.writeFile(filePath, JSON.stringify(jsondata, null, 2), (err) => {
                                if (err) {
                                    console.log("JsonData--->", err)
                                }
                                else {
                                    res.end('<h1>SignUp Successfully!</h1>')
                                    return
                                }
                            })
                        })
                    })
                } else {
                    res.end("<h1>Please Confirm Password!</h1>")
                    return
                }
            }
            else {
                res.end("<h1>Please fill the form!</h1>")
                return
            }
        })
        return
    }

    res.write("<h1>INVALID ROUTE!</h1>")
    res.end()
})

Server.listen(PORT, () => {
    console.log(`my server is running on PORT ${PORT}!`)
})