// Traigo la variable para ver que listado utilizo
var url = '';

if (opc == "senate") {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

$(function () {
  fetch(url, {
    method: 'GET',
    headers: new Headers({
      "X-API-Key": "hwFKB37RLFz0ntVG1cIX0pxzq0QYHsbX24hR6swX"
    })
  }).then(function (response) {
    return response.json();
  }).then(function (json) {
    app.candidates = json.results[0].members;
    calcula(json.results[0].members);
  }).catch(function () {
    if (app.candidates == undefined) {
      console.log("Fail");
    } else {}
  })
});

// armo la estructura de mi JSON    
var estadisticas = {
  "totD": 0,
  "totR": 0,
  "totI": 0,
  "totales": 0,
  "totPorcD": 0,
  "totPorcR": 0,
  "totPorcI": 0,
  "totalPorc": 0,
  "least_engaged": [],
  "most_engaged": [],
  "least_loyal": [],
  "most_loyal": [],
  "totalStates": []
}

// Funcion para sacar los totales por partido y porcentajes
function calcula(data) {

  // Vuelco el JSON original en la variable members
  var members = data;
  var tempArray = []; // Va a ser mi Array para los valores de Attendance
  var tempArrayLoyal = []; // Va a ser mi Array para los valores de Loyalty
  var tempTotalStates = []; // Va a ser mi Array para el listado de estados

  //Conocer la cantidad de miembros de cada partido
  //defino tres variables que van a guardar el resultado de un filtrado del json data
  var democratMembers = members.filter(filtraD);
  var republicanMembers = members.filter(filtraR);
  var independentMembers = members.filter(filtraI);

  //Estas son las funciones que definen según qué criterio se va a aplicar el filtro
  function filtraD(members) {
    return members.party == "D";
  };

  function filtraR(members) {
    return members.party == "R";
  };

  function filtraI(members) {
    return members.party == "I";
  };


  totD = democratMembers.length;
  totPorcD = averageVotes(democratMembers);
  totR = republicanMembers.length;
  totPorcR = averageVotes(republicanMembers);
  totI = independentMembers.length;
  totPorcI = averageVotes(independentMembers);
  totales = members.length;
  totalPorc = averageVotes(members);


  //Con esta función calculo correctamente el promedio de porcentajes
  function averageVotes(array) {
    var sumarVotos = 0;
    var sumarPorcentajes = 0;
    for (let i = 0; i < array.length; i++) {
      sumarPorcentajes += (array[i].total_votes * array[i].votes_with_party_pct);
      sumarVotos += (array[i].total_votes);

    }
    return (array != null && array != undefined && array.length != 0) ? (sumarPorcentajes / sumarVotos).toFixed(2) : 0;
  }

  estadisticas.totD = totD;
  estadisticas.totR = totR;
  estadisticas.totI = totI;
  estadisticas.totales = totales;
  estadisticas.totPorcD = totPorcD;
  estadisticas.totPorcR = totPorcR;
  estadisticas.totPorcI = totPorcI;
  estadisticas.totalPorc = totalPorc;

  var checkedBoxes = Array.from(document.querySelectorAll('input[name = selParty]:checked')).map(elt => elt.value);

  //Lleno el array de Estados
  for (let i = 0; i < members.length; i++) {
    tempTotalStates[i] = members[i].state;
  }

  // Ordeno y filtro el listado de estados
  var tempTotalStatesSorted = tempTotalStates.sort();

  function removeDuplicates(tempArray) {
    var x;
    var len = tempArray.length;
    var out = [];
    var obj = {};

    for (x = 0; x < len; x++) {
      obj[tempTotalStatesSorted[x]] = 0;
    }
    for (x in obj) {
      out.push(x);
    }
    return out;
  } // FIN funcion removeDuplicates

  var result = removeDuplicates(tempTotalStatesSorted);
  app.states = result;

  estadisticas.totalStates = result;

  //Función para averiguar los más y menos comprometidos y leales
  //Primero declaro un par de variables necesarias
  let arrayAuxiliarEngaged = members;
  let mostEngaged = [];
  let leastEngaged = [];
  let arrayAuxiliarLoyal = members;
  let mostLoyal = [];
  let leastLoyal = [];
  let PNecesario = (members.length * 0.1);

  //Esta función ordena el array por porcentaje de votos perdidos, de mayor a menor. Se puede usar con el array auxiliar antes de empezar, y con los arrays llenos después, pasándolos por parámetro. Si se invierte el orden de b y a (a-b), se ordena de menor a mayor.
  function orderByMissedVotesPct(array) {
    array.sort(function (a, b) {
      return (b.missed_votes_pct - a.missed_votes_pct)
    })
  }


  //Con esta función itero el array y cargo un array nuevo con los valores, hasta que alcanza el total que se necesita (o más, si los valores son iguales en el límite de lo que se necesita). El parámetro que hay que pasar es el array que quiero llenar
  function engagedAndLoyal(array, arrayAuxiliar) {
    while (array.length < PNecesario) {
      for (let i = array.length; i < PNecesario || arrayAuxiliar[i - 1].missed_votes_pct == arrayAuxiliar[i].missed_votes_pct; i++) {
        array.push(arrayAuxiliar[i]);
      }
    }

  }

  //Esta función ordena el array por porcentaje de votos perdidos, de mayor a menor
  function orderByMissedVotesPctMoreToLess(array) {
    array.sort(function (a, b) {
      return (b.missed_votes_pct - a.missed_votes_pct)
    })
  }

  //Esta función ordena el array por porcentaje de votos perdidos, de menor a mayor
  function orderByMissedVotesPctLessToMore(array) {
    array.sort(function (a, b) {
      return (a.missed_votes_pct - b.missed_votes_pct)
    })
  }

  //Esta función ordena el array por porcentaje de votos con el partido, de mayor a menor
  function orderByPartyVotesPctMoreToLess(array) {
    array.sort(function (a, b) {
      return (a.votes_with_party_pct - b.votes_with_party_pct)
    })
  }

  //Esta función ordena el array por porcentaje de votos con el partido, de menor a mayor
  function orderByPartyVotesPctLessToMore(array) {
    array.sort(function (a, b) {
      return (b.votes_with_party_pct - a.votes_with_party_pct)
    })
  }

  //Acá llamo a las funciones y creo y lleno los array que necesito
  orderByMissedVotesPctMoreToLess(arrayAuxiliarEngaged);
  engagedAndLoyal(leastEngaged, arrayAuxiliarEngaged);
  orderByMissedVotesPctLessToMore(arrayAuxiliarEngaged);
  engagedAndLoyal(mostEngaged, arrayAuxiliarEngaged);
  orderByPartyVotesPctMoreToLess(arrayAuxiliarLoyal);
  engagedAndLoyal(leastLoyal, arrayAuxiliarLoyal);
  orderByPartyVotesPctLessToMore(arrayAuxiliarLoyal);
  engagedAndLoyal(mostLoyal, arrayAuxiliarLoyal);

  estadisticas.least_engaged = leastEngaged;
  estadisticas.most_engaged = mostEngaged;
  estadisticas.least_loyal = leastLoyal;
  estadisticas.most_loyal = mostLoyal;

}

function updateUI() {
  var checkedBoxes = Array.from(document.querySelectorAll("input[name=selParty]:checked")).map(ele => ele.value);
  var stateVal = $("#states").val();
  var stateArr = stateVal ? [stateVal] : [];

  $(".deGaby tr").each(function () {
    var partyVal = $(this).find(".buscaParty").text();
    var stateVal = $(this).find(".buscaState").text();
    var Selected = isIncluded(stateVal, stateArr, partyVal, checkedBoxes);
    $(this).toggle(Selected);
  });
} // FIN funcion updateUI
function isIncluded(x, lst, p, c) {
  return c.indexOf(p) != -1 && lst.length == 0 || c.indexOf(p) != -1 && lst.indexOf(x) != -1;
}

// Declaracion del Vue
var app = new Vue({
  el: '#app',
  data: {
    candidates: [],
    estadTotal: estadisticas, //Cargo mi JSON en el DATA
    states: []
  }
});


//ACORDION
/*
function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }
}
*/

