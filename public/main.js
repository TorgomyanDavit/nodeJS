const root = document.getElementById("root")
function createElement(response) {
    const newDiv = document.createElement("div")
    newDiv.innerHTML = JSON.stringify(response)
    
    newDiv.classList.add("get")
    root.appendChild(newDiv)
}

// method Get
const get = document.getElementById("get")
get.addEventListener("click",() => {
    fetch("/get")
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})

// Method Post
const Post = document.getElementById("post")
Post.addEventListener("click",() => {
    fetch("/post",{
        method:"post",
        headers:{"content-type" : "application/json"},
        body:JSON.stringify({
            name:"gexam",
            username:"vardenis",
            method:"POST"
        })
    })
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})

// getid
const getId = document.getElementById("getid")
getId.addEventListener("click",() => {
    fetch("/getid/1")
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})

// put
const put = document.getElementById("put")
put.addEventListener("click",() => {
    fetch("/put/1",{
        method:"put",
        headers:{"content-type" : "application/json"},
        body:JSON.stringify({
            name:"Put",
            username:"putID",
            method:"Put"
        })
    })
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})

// delete
const deleta = document.getElementById("deleta")
deleta.addEventListener("click",() => {
    fetch("/delete/1",{
        method:"DELETE"
    })
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})

// query
const query = document.getElementById("query")
query.addEventListener("click",() => {
    fetch("/query?name=vzgo&method=query")
    .then((resp) => resp.json())
    .then((resp) => {
        createElement(resp)
    })
})


