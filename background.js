
initStorage();

let alarmStatus = false;


chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log(namespace);

	if(namespace === 'sync'){
		alarmStatus = changes.alarmStatus.newValue;
		return;
	}

	if(namespace === 'local' && changes.value.newValue){
		
		if(changes.value.newValue.address === 'getCurrent'){
 		
 		const time = changes.value.newValue.time;
 		runCurrent(time,alarmStatus);
 		return;
 		}
 		if(changes.value.newValue.address === null){
 			
 		return;
 		}
 		const url = changes.value.newValue.address;
     	const time = changes.value.newValue.time
     	createTab(url,time,alarmStatus);
	}
});


function initStorage(){
	const box = {
		timeStamp:Date.now(),
		address:null,
		time:null
	}
	chrome.storage.local.set({'value': box});
	chrome.storage.sync.get(['alarmStatus'],function(a){
		alarmStatus = a.alarmStatus;
	})
}


function createTab(url,time,alarmStatus){
	const site  = JSON.parse(url);
	 chrome.tabs.create({'url': 'https://' + site ,"selected":true}, function(tab){
        const id = tab.id;
        timer(time,id,alarmStatus);
    });
}

function runCurrent(time,alarmStatus){
	chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
    function(tab){
       const id = tab[0].id;
        timer(time,id,alarmStatus);
    })
}

function timer(time,tabID,alarmStatus){
	const minutetime = (time * 1000)*60;
	let intervaltime = time;
	// listen(tabID);
	alertToggle(alarmStatus,'Press Ok to start timer');
	chrome.tabs.executeScript(tabID,{code:`document.title =  ' [ ${intervaltime} ]min'`});
	const counter = setInterval(function(){
		--intervaltime;
		chrome.tabs.executeScript(tabID,{code:`document.title =  ' [ ${intervaltime} ]min'`});
	}, 60000);

    setTimeout(function(minutetime){ 
    	removeTabs(alarmStatus,tabID);
    	clearInterval(counter);	
	}, minutetime);	
}


function removeTabs(alarmStatus,tabID){
	chrome.tabs.query(  {}, function(tabs) {
     for(let i = 0; i<tabs.length; i++){
       if (tabs[i].id === tabID) {
         console.log(`Tab ${tabID} exists!`);
         chrome.tabs.remove(tabID, function(){
         	 chrome.storage.local.remove(['value']);
		}); 
         return;
       }
     }
    alertToggle(alarmStatus,"Timer ran out Tab was closed manualy");
  	 });
}

function alertToggle(alarmStatus,text){
	if(!alarmStatus){
		return;
	}
	alert(text);
};


// function listen(tabID){
// 	chrome.tabs.onUpdated.addListener(function(tabID,changeInfo,tab){
// 		console.log(changeInfo);
// 		if(changeInfo.title === changeInfo.title){
// 			console.log('Changed', changeInfo.title);
// 		}
// 	});
// }



//My BOX --
// chrome.tabs.executeScript(tabID,{code:`var a = document.title; document.title = a + ' [${intervaltime}]min'`});