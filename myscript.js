

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

//Regular expresion to match Sometext,Someletter -- format for professor names
var myRe = /[a-zA-Z]+,[^ ]/g;

//Array to contain matches to regular expression -- hopefully all professors (testing to be done)
var array_matches = pageText.match(myRe);

console.log(array_matches.length);
console.log(array_matches);

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
		Matches[trIndex] = professorString
	}
	trIndex++;
}

console.log(Matches);




//Regular expression includes firstname(we want this),LastInitial(dont want this) right now
//Also constructs URL for RMP page...

var port = chrome.runtime.connect({name: "RMPify"});

for(var i=0; i < array_matches.length; i++){
	//array_matches now includes only last names
	array_matches[i] = array_matches[i].replace(/,[A-Za-z]/g, "");
	var url = urlFirstHalf + array_matches[i] + urlSecondHalf

	port.postMessage({Search: url});

	port.onMessage.addListener(function(msg) {
		if(msg.Response){
			console.log(msg.Response); 
		}
	});
}

console.log(array_matches);

//alert("Hello from your Extension");




