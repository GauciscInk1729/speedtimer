const body=document.querySelector("body");
const clock=document.querySelector("#clock");
const scrambleP=document.querySelector("#scramble");
const scrambleDiv=document.querySelector("#scrambleDiv");
const footerP=document.querySelector("#description");
const aside=document.querySelector("aside");
const html=document.querySelector("html");
const timesElements=document.querySelector("#timesTable > tbody");
const resolutionElement=document.querySelector("#resolution");
const average=document.querySelector("#avg");
const title=document.querySelector('h1');
//variables that uses localStorage
let times;
times=(window.localStorage.getItem('timesObject'))?JSON.parse(window.localStorage.getItem('timesObject')):{t:[]};
//21 movements for scramble
let time=0;
let timing=0;
let stopTimer;
let start=0;
const lettersScramble=['R','L','U','D','B'];
const complementScramble=["'",'2',""];
function getScramble(size=21){
	let scramble="";
	let randomLetter;
	let randomComplement;
	for (let i=0;i<size;i++){
		randomLetter=lettersScramble[Math.floor(Math.random()*lettersScramble.length)];
		randomComplement=complementScramble[Math.floor(Math.random()*complementScramble.length)];
		scramble+=`${randomLetter}${randomComplement}  `;
	}
	scrambleP.textContent=scramble;
}
getScramble();
function updatePageElements(){
	updateTable();
	updateNumberResolution();
	updateAverage();
	upgradeLocalStorage();
}
function updateNumberResolution(){
	resolutionElement.textContent=`Resolución: ${times.t.length}`;
}
function updateAverage(){
	let currentSumTimes=(times.t.length!=0)?times.t.reduce((accum, current)=>accum+current):0;
	let avg=(times.t.length!=0)?currentSumTimes/times.t.length:0;
	average.textContent=(times.t.length!=0)?`Media: ${convertTimeInMiliseconds(avg)}`:'Media: 0';
}
function convertTimeInMiliseconds(time){
	let hours=parseInt(parseInt(parseInt(time/1000)/60)/60);
	let minutes=parseInt(parseInt(time/1000)/60);
	let seconds=Math.floor(parseInt(time/1000))%60;
	let miliseconds=Math.floor(time%1000);
	let hours1=(hours<10)?"0"+hours:hours;
	let minutes1=(minutes<10)?"0"+minutes:minutes;
	let seconds1=(seconds<10)?"0"+seconds:seconds;
	let miliseconds1=((miliseconds<100)?(miliseconds<10)?"00"+miliseconds:"0"+miliseconds:miliseconds);
	return (hours!==0)?`${hours1}:${minutes1}:${seconds1}:${miliseconds1}`:(minutes!==0)?`${minutes1}:${seconds1}:${miliseconds1}`:`${seconds1}:${miliseconds1}`;
}
function startTimer(){
	time = performance.now()-start;
	clock.textContent=convertTimeInMiliseconds(time);
	return time;
}
function hiddenShowComplements(value){
	scrambleDiv.style.visibility=value;
	footerP.style.visibility=value;
	aside.style.visibility=value;
	(value==="hidden")?title.setAttribute("class","unselected"):title.removeAttribute("class");
}
function upgradeLocalStorage(){
	window.localStorage.removeItem('timesObject');
	window.localStorage.setItem('timesObject',JSON.stringify(times));
}
function updateTable(){
	while(timesElements.firstChild){
		timesElements.removeChild(timesElements.firstChild);
	}
	times.t.forEach((timeElement, index)=>{
		timesElements.innerHTML+=`<tr><td>${index+1}</td><td>${convertTimeInMiliseconds(timeElement)}</td><td class="unselected"><span id="delete${index+1}"class="material-icons md-18 unselected">
delete</span></td></tr>`;
		for(let i=0;i<=index;i++){
			const deleteBtn=document.querySelector(`#delete${i+1}`);
			deleteBtn.onclick=(e)=>{
				timesElements.removeChild(e.target.parentNode.parentNode);
				times.t.splice(i,1);
				updatePageElements();
			};
	}
	});
}
function startTimerEvent(e){
	if (!timing%2) {
		startTimer();
		hiddenShowComplements('hidden');
		clock.style.scale=1.8;
		start = performance.now();
		stopTimer=setInterval(startTimer,1);
		timing++;
		time=0;
	}else{
		times.t.push(startTimer());
		updatePageElements();
		getScramble();
		clock.style.scale=1.5;
		setTimeout(hiddenShowComplements,20,'visible')
		clearInterval(stopTimer);
		timing--;
	}
}
function timerChangeBackground(e){
	if(!timing%2){
	body.style.background="hsla(120, 100%, 70%,50%)";
	}
}
function timerOriginalBackground(e){
	body.style.backgroundImage="linear-gradient(65deg,hsl(60, 100%, 80%),hsl(60, 100%, 90%))";
}
function clickOrTouchWithoutAside(e){
	return (e.target.nodeName==="ASIDE"| e.target.parentNode.id==="detalles" | e.target.nodeName==="SPAN" | e.target.parentNode.nodeName==="TH" |e.target.parentNode.nodeName==="TR")?true:false;
}
//Events
html.addEventListener("touchend",(e)=>{
	if(clickOrTouchWithoutAside(e))return;
	startTimerEvent(e);
});
html.addEventListener("keyup",(e)=>{
	if(clickOrTouchWithoutAside(e))return;
	if(e.keyCode===32) startTimerEvent(e);
});

html.addEventListener("touchstart",(e)=>{
	if(clickOrTouchWithoutAside(e))return;
	timerChangeBackground(e);
	hiddenShowComplements('hidden');
});
html.addEventListener("keydown",(e)=>{
	if(e.keyCode===32){
    timerChangeBackground(e);
    hiddenShowComplements('hidden');
  }
});

html.addEventListener("touchend",(e)=>{
	if(clickOrTouchWithoutAside(e))return;
	timerOriginalBackground(e);
});
html.addEventListener("keyup",(e)=>{
	if(e.keyCode===32) timerOriginalBackground(e);
});
window.onload=()=>{
	updatePageElements();
};