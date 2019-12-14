fetch('https://openstates.org/api/v1/legislators/', {
  method: 'GET',
  headers: {
    'X-API-Key': '6da57630-c811-4dc5-b81d-e1dcde686eac'
  }
}).then((response) => {
  return response.json();
}).then((json) => {
  data = json;
  console.log(data);
}).catch((error) => {
  console.log("error:" + error);
});



