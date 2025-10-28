const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const mturk = urlParams.get('id')
console.log(mturk);

document.getElementById('turkcode').innerHTML = mturk;
