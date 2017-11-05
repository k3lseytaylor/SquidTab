

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setcrrnt').addEventListener('click', setonCurrent);
    document.getElementById('closeBtn').addEventListener('click', check);
    document.querySelector('.form-1').addEventListener('submit', controller);
    check();   
});

let current;
let currentID;

function check(){
   chrome.storage.sync.get(["value"], function(items){
    console.log(items);
     if(Object.keys(items).length === 0){
        return;
     }else{
    	chrome.storage.sync.clear(function(){
	       console.log('cleared') 
	     });
      	current = setTimeout(function(){ chrome.tabs.remove(items.value); }, 3000);
      } 
  }); 
}



function controller(e){
	const address = JSON.stringify((this.querySelector('[name=page]')).value);
  	const time = (this.querySelector('[name=time]')).value * 1000
  	console.log(time);
  	console.log(address);

  	goTo(address,time);
  	e.preventDefault();
  	this.reset();
}

function cancelTimout(){
	 clearTimeout(current);
	 console.log('paused');
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
    	

    	chrome.storage.sync.set({'value': box}, function() { 
          console.log('Settings saved');
        }); 
  }); 
}

function setonCurrent(){
	const time = (document.getElementById('time-2')).value * 1000
	const box = {
		id:null,
		time,
	}

	console.log(time);
	document.getElementById("form-2").reset();
	chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
		function(tab){

			console.debug(tab[0].id);
			currentID=tab[0].id;
			box.id = tab[0].id;

      console.log(currentID);

       chrome.storage.sync.set({'value': box}, function() { 
          console.log('Settings saved');
        });    })

	current = setTimeout(function(){ chrome.tabs.remove(currentID); }, time);
}