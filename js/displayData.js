'use strict';

let eachItem;
let demandResult = [];
let demandForecast = [];
let demandAdjust = [];
let demandChart;

let psiDisplayArr = [[]];

{

const h1text = document.querySelector('h1')
window.addEventListener('load', showTitle);

function showTitle() {
  h1text.classList.add('shown');
}

window.addEventListener('load', setPSIElementToArr);

function setPSIElementToArr() {
  psiDisplayArr[0] = [
    document.getElementById('psi-header-category'),
    document.getElementById('psi-headerN4'),
    document.getElementById('psi-headerN3'),
    document.getElementById('psi-headerN2'),
    document.getElementById('psi-headerN1'),
    document.getElementById('psi-headerN0'),
    document.getElementById('psi-headerN-1'),
  ]


  psiDisplayArr[1] = [
    document.getElementById('psi-order-category'),
    document.getElementById('psi-orderN4'),
    document.getElementById('psi-orderN3'),
    document.getElementById('psi-orderN2'),
    document.getElementById('psi-orderN1'),
    document.getElementById('psi-orderN0'),
    document.getElementById('psi-orderN-1'),
  ]

  psiDisplayArr[2] = [
    document.getElementById('psi-incoming-category'),
    document.getElementById('psi-incomingN4'),
    document.getElementById('psi-incomingN3'),
    document.getElementById('psi-incomingN2'),
    document.getElementById('psi-incomingN1'),
    document.getElementById('psi-incomingN0'),
    document.getElementById('psi-incomingN-1'),
  ]

  psiDisplayArr[3] = [
    document.getElementById('psi-forecast-category'),
    document.getElementById('psi-forecastN4'),
    document.getElementById('psi-forecastN3'),
    document.getElementById('psi-forecastN2'),
    document.getElementById('psi-forecastN1'),
    document.getElementById('psi-forecastN0'),
    document.getElementById('psi-forecastN-1'),
  ]

  psiDisplayArr[4] = [
    document.getElementById('psi-endStock-category'),
    document.getElementById('psi-endStockN4'),
    document.getElementById('psi-endStockN3'),
    document.getElementById('psi-endStockN2'),
    document.getElementById('psi-endStockN1'),
    document.getElementById('psi-endStockN0'),
    document.getElementById('psi-endStockN-1'),
  ]
}

// get data of item to describe PSI sheet

  const description = document.getElementById('description');
  const item = document.getElementById('itemNumberText');
  const itemCheckbtn = document.getElementById('itemCheckButton');

  function getItemDataset(itemStr) {
    let line;
    itemStr = itemStr.toUpperCase();
    item.value = itemStr
    u020Arr.forEach(function(element) { 
      if (element[1] === itemStr) {
        line = element;
      }
    });
    return line;
  }

  function setDemand(resultOrForecast) {
    
    let tempDemand = [];

    if(resultOrForecast === 'result') {
      //get demand result
      for(let i=0; i<=11 ; i++) {
        tempDemand.push(Number(eachItem[i+14])); //from 15th
      }
      return tempDemand;

    } else if(resultOrForecast === 'forecast') {
      //get demand SVG original forecast
      for(let i=0; i<=23 ; i++) {
        if (i<=11) {
          tempDemand.push(0);
        } else {
          tempDemand.push(Number(eachItem[i+48])); //from 61th
        }
      }
      return tempDemand;  

    } else {
      //adjusted quantities = adjusted Qty - SVG original forecast
      for(let i=0; i<=23 ; i++) {
        if (i<=11) {
          tempDemand.push(0);
        } else {
          //adjusted value = forecast (from 29th column) - original forecast
          tempDemand.push(Number(eachItem[i+16]) - Number(eachItem[i+48])); 
        }
      }
      return tempDemand;
    }
  }

      //event when enter key is pressed
      item.onkeypress = (e) => {
        const key = e.keyCode;
        if (key === 13) {
          e.preventDefault();
          displayItem();
        }
      }


      //event when the "Go!" button is activated
      //This button update everything
      function displayItem() {
        demandResult = []; 
        demandForecast = []; 
        resetAllData();

        if(typeof demandChart != 'undefined' && demandChart) {
          demandChart.destroy();
        }
        
        // reflect data from U020
        eachItem = getItemDataset(item.value);

        if(eachItem != undefined) {
          description.textContent = eachItem[2]; 
        } else {
          description.textContent = 'Item not found.';
        }

        demandResult = setDemand('result'); 
        demandForecast = setDemand('forecast');
        demandAdjust = setDemand('adjust');

        fillU020Parameter(eachItem);
        drawChart(demandResult, demandForecast, demandAdjust);
        fillDemandTable(demandResult, demandForecast, demandAdjust);
        setRecalculateEvent();

        //reflect data from PSI sheet
        const itemStr = eachItem[1].toUpperCase();
        let itemIndex;

        function getIndex(itemStr) {
          for (let i=0; i<psiArr.length; i++) {
            if (psiArr[i][1] == itemStr) {
              return i;
            }
          }
        }
        itemIndex = getIndex(itemStr);

        fillPSIParameter(psiArr, itemIndex);
        fillPSIArea(psiArr, itemIndex);
        fillAverage(psiArr, itemIndex);
        fillMonthName(psiArr); //reflect Month Name

        //reflect data from Order Suggestion Report
        fillOrderSuggestionQty(orderSuggestionArr, itemStr);
      }


      itemCheckbtn.addEventListener('click', displayItem, false);

    //function to fill SKU parameter table(U020)
    function fillU020Parameter(data) {

      const asl = document.getElementById('asl');
      const lifeCyecle = document.getElementById('life-cycle');
      const abcRank = document.getElementById('abc-rank'); 
      const safetyStock = document.getElementById('safty-stock');
      const fobPrice = document.getElementById('fob-price');
      const importance = document.getElementById('importance');
      const forecasting = document.getElementById('forecasting');

      asl.innerText = data[5];
      lifeCyecle.innerText = data[6].substr(0,1);
      abcRank.innerText = data[7];
      safetyStock.innerText = data[11] + '(' + data[50] + ')'; // safety stock (calculated safety stock)
      fobPrice.innerText = data[10];
      importance.innerText = data[4];
      forecasting.innerText = data[13];
    }


    //function to fill SKU parameter table(PSI)
    function fillPSIParameter(psiArr, itemIndex) {
      const openBO = document.getElementById('open-bo');
      const spq = document.getElementById('spq');
      const necessaryQty = document.getElementById('necessary-qty');
      
      openBO.innerText = psiArr[itemIndex][12]; 
      spq.innerText = psiArr[itemIndex][22]; 
      necessaryQty.innerText = psiArr[itemIndex][16];
      
    }

    // function to fill Month name
    function fillMonthName (psiArr){
      let MonthNum = 0;
      const monthNames =document.getElementsByClassName('month-name');
      const thisMonthStrings = psiArr[0][28];
      switch(thisMonthStrings.length){
        case 7:
          // like 2023年9月
          MonthNum = Number(thisMonthStrings.slice(5,6));
          break;
        case 8:
          // like 2023年10月
          MonthNum = Number(thisMonthStrings.slice(5,7));
          break;
      }

      let tempMonth = MonthNum;

      for(let i=0;i<12;i++){
        if(tempMonth>12){
          tempMonth -= 12;
        }
        monthNames[i].innerText = tempMonth;
        tempMonth += 1;
      }
    }

    //function to fill 6mth and 12mth Average
    function fillAverage(psiArr, itemIndex){
      const sixMonthAverage =document.getElementById('6mth-ave');
      const tweleveMonthAverage =document.getElementById('12mth-ave');
      
      sixMonthAverage.innerText = psiArr[itemIndex][35];
      tweleveMonthAverage.innerText = psiArr[itemIndex][36];
    }

    //function to fill Order SuggestionQty from Order Suggestion Report
    function fillOrderSuggestionQty(orderSuggestionArr, itemStr){

      const regQty = document.getElementById('reg-qty');
      const addQty = document.getElementById('add-qty');

      let rowIndexOrderSuggestion;

      for (let i=0; i<orderSuggestionArr.length; i++) {
        if (orderSuggestionArr[i][2] == itemStr) {
          rowIndexOrderSuggestion = i;
          break;
        }      
      }
      
      regQty.innerText = orderSuggestionArr[rowIndexOrderSuggestion][10]; 
      addQty.innerText = orderSuggestionArr[rowIndexOrderSuggestion][12];
    }

     //function to describe chart
    function drawChart(r, f, a) {
      let ctx =  document.getElementById('demand-graph-area').getContext('2d');
      ctx.canvas.width = 700;
      ctx.canvas.height = 300;
      demandChart = new Chart(ctx,{
        type: 'bar',
        data: {
          labels: [
            "(N-12)",
            "(N-11)",
            "(N-10)",
            "(N-9)",
            "(N-8)",
            "(N-7)",
            "(N-6)",
            "(N-5)",
            "(N-4)",
            "(N-3)",
            "(N-2)",
            "(N-1)",
            "(N)",
            "(N+1)",
            "(N+2)",
            "(N+3)",
            "(N+4)",
            "(N+5)",
            "(N+6)",
            "(N+7)",
            "(N+8)",
            "(N+9)",
            "(N+10)",
            "(N+11)",
            "(N+12)",
          ],
          datasets: [
            {
              data: r, //data for chart
              backgroundColor: 'rgba(70,130,180,0.7)',
              borderColor: 'rgba(70,130,180,1)',
              borderWidth: 1,
              pointHoverBackGroundColor: 'rgba(0,0,255,1)',
              pointHoverBorderColor: 'rgba(0,0,255,1)',
              pointHoverBorderWidth: 2,
            },
            {
              data: f, //data for chart
              backgroundColor: 'rgba(180,165,32,0.7)',
              borderColor: 'rgba(180,165,32,1)',
              borderWidth: 1,
              pointHoverBackGroundColor: 'rgba(218,265,32,0.7)',
              pointHoverBorderColor: 'rgba(218,165,32,1)',
              pointHoverBorderWidth: 2,
            },
            {
              data: a, //data for chart
              backgroundColor: 'rgba(255,140,0,0.7)',
              borderColor: 'rgba(255,140,0,1)',
              borderWidth: 1,
              pointHoverBackGroundColor: 'rgba(240,50,0,1)',
              pointHoverBorderColor: 'rgba(255,50,0,1)',
              pointHoverBorderWidth: 2,
            },
          ],
        },
        options: {
          animation: {
            duration: 300,
          },
          scales:{
            xAxes: [{
              stacked: true,
              scaleLabel:{
                display: true
              }
            }],
            yAxes:[{
              stacked: true,
              display: true,   
              type: 'linear',
              suggestedmin: 0,
              scaleLabel: {
                display: true,
              },
              
              ticks: {
                beginAtZero: true,
                // stepSize: 1,
              }
              
            }]
          },
          legend: {
            display:false,
          },
          responsive: false,
        }
      });
    }

  //fill data in the demand table
  function fillDemandTable(r, f, a) {

    let demandData;

    for(let i=0; i<=23; i++) {
      let idName;
      if (i <= 11) {
        idName = 'n' + (i -12) + 's'
        demandData = document.getElementById(idName);
        demandData.innerText = r[i];
      } else {
        idName = 'n+' + (i -12) + 's'
        demandData = document.getElementById(idName);
        demandData.innerText = Math.round(f[i] + a[i]);
      }
    }  
  }


  //fill out PSI area
  function fillPSIArea (psiArr, itemIndex) {

    let tempYearMonth; 

    for (let i=0; i<=4; i++) {
      for (let j=0; j<=6; j++) {

        if (j === 0 || j ===6) {
          psiDisplayArr[i][j].innerText = psiArr[i + itemIndex - 1][j + 23];
        }

        if (i === 0){
          tempYearMonth = psiArr[i][j + 23]
          tempYearMonth = tempYearMonth.replace('年', '/');
          tempYearMonth = tempYearMonth.replace('月', '');
          psiDisplayArr[i][j].innerText = tempYearMonth;
        } else if (i === 4) {
          psiDisplayArr[i][j].innerText = psiArr[i + itemIndex - 1][j + 23];
        } else {
          psiDisplayArr[i][j].value = psiArr[i + itemIndex - 1][j + 23];
        }
      }
    }
  }


  function resetAllData() {

    //Initialize U020 data
    const asl = document.getElementById('asl');
    const lifeCyecle = document.getElementById('life-cycle');
    const abcRank = document.getElementById('abc-rank'); 
    const safetyStock = document.getElementById('safty-stock');
    const fobPrice = document.getElementById('fob-price');
    const importance = document.getElementById('importance');
    const forecasting = document.getElementById('forecasting');
    asl.innerText = '';
    lifeCyecle.innerText = '';
    abcRank.innerText = '';
    safetyStock.innerText =''; 
    fobPrice.innerText = '';
    importance.innerText = '';
    forecasting.innerText = '';

    //Initialize PSI parameter data
    const openBO = document.getElementById('open-bo');
    const spq = document.getElementById('spq');
    const necessaryQty = document.getElementById('necessary-qty');
   
    openBO.innerText = ''; 
    spq.innerText = ''; 
    necessaryQty.innerText = '';

    //Initialize Order Suggestion data
    const regQty = document.getElementById('reg-qty');
    const addQty = document.getElementById('add-qty');
    regQty.innerText = '';
    addQty.innerText = '';

    //Initialize PSI table
    for (let i=0; i<=4; i++) {
      for (let j=0; j<=6; j++) {
        psiDisplayArr[i][j].innerText = '';
        psiDisplayArr[i][j].value = '';
      }
    }

    //Initialize Demand table

    let demandData;

    for(let i=0; i<=23; i++) {
      let idName;
      if (i <= 11) {
        idName = 'n' + (i -12) + 's'
        demandData = document.getElementById(idName);
        demandData.innerText = '';
      } else {
        idName = 'n+' + (i -12) + 's'
        demandData = document.getElementById(idName);
        demandData.innerText = '';
      }
    }
  }

  //recalculate when PSI elements were revised(=input)
  function recalculatePSI() {   
    for(let nMonth=0; nMonth <= 4; nMonth++) {
      psiDisplayArr[4][5-nMonth].innerText = Number(psiDisplayArr[4][6-nMonth].innerText) + Number(psiDisplayArr[2][5-nMonth].value) - Number(psiDisplayArr[3][5-nMonth].value);
    }
  }

  // window.addEventListener('load', setRecalculateEvent, false);

  function setRecalculateEvent() {
    for (let i=0; i<=4; i++) {
      for (let j=0; j<=6; j++) {
  
        if (i === 0){
          // psiDisplayArr[i][j].innerText = psiArr[i][j + 23];
        } else if (i === 4) {
          // psiDisplayArr[i][j].innerText = psiArr[i + itemIndex - 1][j + 23];
        } else {
          // psiDisplayArr[i][j].value = psiArr[i + itemIndex - 1][j + 23];
          psiDisplayArr[i][j].addEventListener('input', recalculatePSI, false);
        }
      }
    }
  }

}