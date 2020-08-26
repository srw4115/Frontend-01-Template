let getCode = "https://github.com/login/oauth/authorize?client_id=Iv1.86ec739f37e5fa74d&redirect_uri=http%3A%2F%2Flocalhost%3A8000&state=abc123"

let code = "2b2wdwdwdwdwdw"
let state = "abc123"
let client_secret = "cdb35c308952e58da220f8a367b47c7350bbd458"
let client_id = "Iv1.86ec739f37e5fa74"
let redirect_uri = encodeURIComponent("hppt://localhost:5111")

let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
let xhr = new XMLHttpRequest

xhr.open("POST", `https://github.com/login/oauth/access_token?${params}`, true)
xhr.setRequestHeader("Authorization", "token sdsdsdsdsdssdsdsd")
xhr.send(null)

xhr.addEventListener("readystatechange", function (event) {
    if (event.readystate === 4) {
        debugger
        console.log(event.responseText)
    }
})



let xhr = new XMLHttpRequest

xhr.open("GET", `https://github.com/user`, true)
xhr.setRequestHeader("Authorization", "token sdsdsdsdsdssdsdsd")
xhr.send(null)

xhr.addEventListener("readystatechange", function (event) {
    if (event.readystate === 4) {
        console.log(event.responseText)
    }
})