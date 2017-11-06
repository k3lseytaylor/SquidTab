document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setcrrnt').addEventListener('click', setonCurrent);
    document.getElementById('cancelBtn').addEventListener('click', get);
    document.querySelector('.form-1').addEventListener('submit', Ctrler);
        
});

function Ctrler(){
  const address = JSON.stringify((this.querySelector('[name=page]')).value);
  const time = (this.querySelector('[name=time]')).value 
  send(address,time);
  
}

 function get(){
   chrome.storage.sync.get(["value"], function(items){
   });
 }

 function setonCurrent(){
  const time = (document.getElementById('time-2')).value 
  const address = 'getCurrent';
  send(address,time);
  document.getElementById("form-2").reset();
 }


function send(address,time){
   const box = {
    timeStamp:Date.now(),
    address,
    time,
  }
  chrome.storage.sync.set({'value': box}, function() { 
   
  });
}




