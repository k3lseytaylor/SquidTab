document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setcrrnt').addEventListener('click', setonCurrent);
    document.getElementById('cancelBtn').addEventListener('click', cancelTimeout);
    document.querySelector('.form-1').addEventListener('submit', controller);
    check();    
});

chrome.tabs.onCreated.addListener(function(tab){
    
})

var current;
var currentID;



function controller(e){
  	const address = JSON.stringify((this.querySelector('[name=page]')).value);
  	const time = (this.querySelector('[name=time]')).value * 1000
  	//make time goes as minutes
  	console.log(time);
  	console.log(address);
  	goTo(address,time);
  	e.preventDefault();
  	this.reset();
 }


function goTo(website,time){
  var url = JSON.parse(website);
  const box = {
    id:null,
    timeout:time
  }
    chrome.tabs.create({'url': 'https://' + url}, function(tab) {
      box.id = tab.id;
      console.log('working', box);
       current = setTimeout(function(){ chrome.tabs.remove(tab.id); }, time);

      chrome.storage.sync.set({'value': box}, function() { 
          console.log('Settings saved');
        }); 
  }); 
}

function setonCurrent(){
	const time = (document.getElementById('time-2')).value * 1000
	console.log(time);

	document.getElementById("form-2").reset();
	chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
		function(tab){
			currentID = tab[0].id;
      console.log(currentID);
  })
	current = setTimeout(function(){ chrome.tabs.remove(currentID); }, time);
}

function check(){
   chrome.storage.sync.get(["value"], function(items){
    console.log(items);
     if(Object.keys(items).length === 0){
      console.log('nothing');
        return;
      }else{
      chrome.storage.sync.clear(function(){
       console.log('cleared') 
     });
      current = setTimeout(function(){ chrome.tabs.remove(items.value.id); }, items.value.timeout);
      } 
  }); 
}

function cancelTimeout(){
   clearTimeout(current);
   console.log('paused');
}


