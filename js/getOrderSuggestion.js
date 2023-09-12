'use strict';

let orderSuggestionArr = [];

{

// get data from csv file and store in Array

const fileName = 'data/' + 'Order_Suggestion.csv';
let request = new XMLHttpRequest();
request.open('get', fileName, true);
request.send(null);
request.onload = function(){
  const dataSetList = request.responseText;
  let eachData = dataSetList.split("\n");
  for (let i=0; i<eachData.length; i++){
    orderSuggestionArr[i] = eachData[i].split(',');
  }
}
  
}