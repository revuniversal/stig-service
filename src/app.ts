import axios from "axios";

console.log('hello world!');

axios.get('http://iase.disa.mil/stigs/Pages/a-z.aspx')
    .then((response) => {
        console.log(response);
    })