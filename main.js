document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setcrrnt').addEventListener('click', setonCurrent);
    document.getElementById('closeBtn').addEventListener('click', pause);
    document.querySelector('.form-1').addEventListener('submit', controller);
   
});

var currentTab;
var current;
var currentID;


function open(website){
	var url = JSON.parse(website);
    chrome.tabs.create({'url': 'https://' + url}, function(tab) {
    	    chrome.tabs.onCreated.addListener(function(tab){
    			console.log("new tab "+tab.id);
    			currentTab = tab.id;
	});
  }); 
}

function close(){
	setTimeout(function(){ chrome.tabs.remove(currentTab); }, 3000);
}

function controller(e){
  	const address = JSON.stringify((this.querySelector('[name=page]')).value);
  	const time = (this.querySelector('[name=time]')).value * 1000
  	//make time goes as minutes
  	console.log(time);
  	console.log(address);
  	timeCtrl(time)
  	goTo(address,time);
  	e.preventDefault();
  	this.reset();
 }


 function goTo(website,time){
	var url = JSON.parse(website);
    chrome.tabs.create({'url': 'https://' + url}, function(tab) {
    	console.log('working');
    	current = setTimeout(function(){ chrome.tabs.remove(tab.id); }, time);
  }); 
}

function pause(){
	 clearTimeout(current);
	 console.log('paused');
}

function timeCtrl(time){
	newTime = time * 60
	console.log(newTime);
}

function setonCurrent(){
	const time = (document.getElementById('time-2')).value * 1000
	console.log(time);
	document.getElementById("form-2").reset();
	chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
		function(d){
			console.debug(d[0].id);
			currentID=d[0].id;})
	current = setTimeout(function(){ chrome.tabs.remove(currentID); }, time);

}
