
initStorage();

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log(changes.value);
	
	if( !changes.value.newValue || changes.value.newValue.address === null  ){
		console.log('nuuuull');
		return;
	}

   	chrome.storage.sync.get(["value"], function(items){
 	if(items.value.address === 'getCurrent'){
 		console.log('current called');
 		const time = items.value.time;
 		runCurrent(time);
 		return;
 	}
     const url = items.value.address;
     const time = items.value.time
     createTab(url,time);
 	});
});



function initStorage(){
	const box = {
		timeStamp:Date.now(),
		address:null,
		time:null
	}
	chrome.storage.sync.set({'value': box}, function() { 
            console.log('Settings saved');
  }); 
}


function createTab(url,time){
	const site  = JSON.parse(url);
	 chrome.tabs.create({'url': 'https://' + site ,"selected":true}, function(tab){
        console.log('done');
        const id = tab.id;
        console.log(id);
        timer(time,id);
    });
}

function runCurrent(time){
	chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
    function(tab){
       const id = tab[0].id;
        console.log(id);
        timer(time,id);
    })
}

function timer(time,tabID){

	const minutetime = time * 1000
	console.log(minutetime);
	alert('Press Okay to start timer');

    setTimeout(function(minutetime){ 
    	removeTabs(tabID);
    	
	}, minutetime);
	
}


function removeTabs(tabID){
	chrome.tabs.query(  {}, function(tabs) {
     for(let i = 0; i<tabs.length; i++){
       if (tabs[i].id === tabID) {
         console.log(`Tab ${tabID} exists!`);
         chrome.tabs.remove(tabID, function(){
			chrome.storage.sync.clear(function(){
               console.log('cleared') 
            });
		}); 
         return;
       }
     }
     	alert("Timer ran out Tab was closed manualy");
  	 });
}

function updateInfo(){
	chrome.tabs.executeScript(tabID,{code:`document.title='SquidTabs ${time}min'`});
}

