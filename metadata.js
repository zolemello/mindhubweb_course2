fetch('https://openstates.org/api/v1/metadata/', {
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




function mustache(valor) {

  var str = JSON.stringify(data, null, 2);
  var valor = JSON.parse(str);


  var members = valor;

  data.full_name = function () {
    return getfull_name(this);
  }
  data.party = function () {
    return getparty(this);
  }
  data.chamber = function () {
    return getchamber(this);

  }
  
  
  var template = document.getElementById("member-template").innerHTML;
  var html = Mustache.render(template, data);

}