

//Content script Professor->ProfessorLink
//Will parse professors last names, not including the first name
//initially -- this is because first names can differ
//however last names will be much more conisistent.... usually


//url for professors page
//     "//http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+delaware&queryoption=HEADER&query=&facetSearch=true%PROFESSOR&facetSearch=true"
//used to construct the URL of the professors search
var urlFirstHalf = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+delaware&queryoption=HEADER&query="
var urlSecondHalf = "&facetSearch=true"


//<span class="main">Lynch, T.G.</span> RMP page title

//Returns the written TEXT on the page with no formatting.
function getText(){
	return document.body.innerText
}
//Returns the written HTML on the page - includes formatting
function getHTML(){
	return document.body.outerHTML
}


var pageText = getText();
//console.log(pageText);
var pageHTML = getHTML();
//console.log(pageHTML);



//Non Regular Expression method
//Initializing Matching array, Class row index, and Proff. string
var Matches = [];
var trIndex = 1;
var professorString = ""

while(professorString!=null){
	professorString = $("#container > table > tbody > tr:nth-child(" + trIndex + ") > td:nth-child(8)").text();
	//when there are no more valid professor rows, professorString = ""
	if(professorString == ""){
		professorString = null
	}
	else{
		//rid of whitespace and add to Matches array
		professorString = professorString.replace(/(\r\n|\n|\r)/gm, '');
		Matches[trIndex - 1] = professorString
	}
	trIndex++;
}
console.log(Matches.length);




//Regular expression includes firstname(we want this),LastInitial(dont want this) right now
//Also constructs URL for RMP page...

var port = chrome.runtime.connect({name: "RMPify"});

//Array to hold last name of professors
var MatchesLastName = [];
var lastName = "";
var linkText = "";

for(var i=0; i < Matches.length; i++){
	//Parsing out first word - is actually last name 
	lastName = Matches[i].split(",");
	//if string still has spaces.. for example: Novocin PhD this is broken..


	console.log(lastName[0]);
	MatchesLastName[i] = lastName[0];

	var url = urlFirstHalf + MatchesLastName[i] + urlSecondHalf

	port.postMessage({Search: url});

	port.onMessage.addListener(function(msg) {
		if(msg.Response){
			if(msg.Response != linkText){
			console.log(msg.Response);
			linkText = msg.Response;
			}
		}
	});
}


//alert("Hello from your Extension");




