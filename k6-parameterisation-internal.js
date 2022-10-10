//During parameterisation we need to consider two option
//1. Data reuse : Reading data randomly from file and data can be used multiple times
//2. Use data only once : Reading Unique Data

import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import encoding from 'k6/encoding';


//1. Reuse the data present in the file
/*export const options = {
    vus: 1,
    duration: '30s',
    iterations: 4,
  }
var username = new SharedArray("userdata",function() {
    var users= ["test","test1","test2","test3"];
  return users;
});

var password = new SharedArray("passdata",function() {
    var passwd= ["passwd","passwd1","passwd2","passwd3"];
  return passwd;
});


export default function() {

  let x = Math.floor((Math.random() * username.length) + 1);
	let username = username[x];
  console.log("Username:="+username[x]);
  console.log("Password:="+password[x]);


  let res = http.get(`http://httpbin.org/basic-auth/${username[x]}/${password[x]}`, {
    headers: { Authorization: 'Basic ' + encoding.b64encode(`${username[x]}:${password[x]}`) },
  })

  // Verify response (checking the echoed data from the httpbin.org basic auth test API endpoint)
  check(res, {
    'status is 200': r => r.status === 200,
    'is authenticated': r => r.json().authenticated === true,
    'is correct user': r => r.json().user === username[x],
  })
}*/

//--------------------------------------------------------------------------------------------------------------------
// Use only unique data

import { scenario } from 'k6/execution';
var username = new SharedArray("userdata",function() {
    var users= ["test","test1","test2","test3"];
  return users;
});

var password = new SharedArray("passdata",function() {
    var passwd= ["passwd","passwd1","passwd2","passwd3"];
  return passwd;
});
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 1,
      iterations: username.length,
      maxDuration: '2m',
    },
  },
};

export default function () {
  //console.log(`user: ${JSON.stringify(user)}`);
  console.log("Username:="+username[scenario.iterationInTest]);
  console.log("Password:="+password[scenario.iterationInTest]);
  let res = http.get(`http://httpbin.org/basic-auth/${username[scenario.iterationInTest]}/${password[scenario.iterationInTest]}`, {
    headers: { Authorization: 'Basic ' + encoding.b64encode(`${username[scenario.iterationInTest]}:${password[scenario.iterationInTest]}`) },
  })

  // Verify response (checking the echoed data from the httpbin.org basic auth test API endpoint)
  check(res, {
    'status is 200': r => r.status === 200,
    'is authenticated': r => r.json().authenticated === true,
    'is correct user': r => r.json().user === username[scenario.iterationInTest],
  })

}
