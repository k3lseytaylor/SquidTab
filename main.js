document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setcrrnt').addEventListener('click', setonCurrent);
    document.querySelector('.form-1').addEventListener('submit', Ctrler);
    document.querySelector('.checkbox').addEventListener('click', setSetting);
    getSetting();        
});


function Ctrler(){
  const address = JSON.stringify((this.querySelector('[name=page]')).value);
  const time = (this.querySelector('[name=time]')).value 
  send(address,time);
  
}

function setonCurrent(){
  const address = 'getCurrent';
  const time = parseInt((document.getElementById('time-2')).value );
  send(address,time);
  document.getElementById("form-2").reset();
}

function send(address,time){
   const box = {
    timeStamp:Date.now(),
    address,
    time,
  }
  chrome.storage.local.set({'value': box});
}


function getSetting(){
  chrome.storage.sync.get(['alarmStatus'],function(obj){
    document.querySelector('.checkbox > input').checked = obj.alarmStatus;   
  })
}

function setSetting(){
    var alarmStatus = document.querySelector('.checkbox > input').checked;
    chrome.storage.sync.set({'alarmStatus': alarmStatus},function(){
  })
}
