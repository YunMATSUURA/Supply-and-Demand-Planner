'use strict';

{
    const opScreen = document.getElementById('opening-screen');
    const opTitle = document.getElementById('opening-title');
    const opLetters = document.getElementsByClassName('opening-title-p');

    
    function syncDelay(milliseconds){
        let start = new Date().getTime();
        let end = 0;
        while((end-start)<milliseconds){
            end = new Date().getTime();
        }
    }

    function delay(n){
        return new Promise(function(resolve){
            setTimeout(resolve,n*1000);
        });
    }

    async function doOpening(){
        for(let i=0;i<opLetters.length;i++){
            opLetters[i].classList.remove('hidden');
            syncDelay(200);
        }
        opScreen.classList.add('disappearing');
        await delay(0.2);
        opScreen.classList.remove('opening');
    }

    doOpening();

}