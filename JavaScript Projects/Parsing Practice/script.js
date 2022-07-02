let data = `{
    "username": "Peter",
    "email": "peter@gmail.com",
    "age": "27"
}`;

let jsonToObj = document.querySelector('#btn-jsonObj');
let objToJson = document.querySelector('#btn-objJson');
let username = document.querySelector('#username');
let email = document.querySelector('#email');
let age = document.querySelector('#age');

jsonToObj.addEventListener('click', () =>{
    let myObj = JSON.parse(data);
    username.value = myObj.username;
    email.value = myObj.email;
    age.value = myObj.age;
});

objToJson.addEventListener('click', () =>{
    let myObj = {};
    myObj.username = username.value;
    myObj.email = email.value;
    myObj.age = age;

    let json = JSON.stringify(myObj);
    document.querySelector('#jsonData').innerText = json; 
})