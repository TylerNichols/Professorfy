
//<li class="listing PROFESSOR">

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == "RMPify");
	port.onMessage.addListener(function(msg) {
		if(msg.Search){

			function makeHttpObject() {
				try {return new XMLHttpRequest();}
 				catch (error) {}
  				try {return new ActiveXObject("Msxml2.XMLHTTP");}
  				catch (error) {}
  				try {return new ActiveXObject("Microsoft.XMLHTTP");}
  				catch (error) {}
  				throw new Error("Could not create HTTP request object.");
			}

			var request = makeHttpObject();
			request.open("GET", msg.Search, true);
			request.send(null);
			request.onreadystatechange = function() {
 				if (request.readyState == 4){
    				//alert(request.responseText);
    				console.log (request.responseText);
    				var RMPpage = request.responseText;
    				var RMPre = /([A-z]{11})\.[A-z]+\?+[A-z]+\=+[1-9]*/g
    				var url_matches = RMPpage.match(RMPre);
    				console.log(url_matches);

    				port.postMessage({Response: url_matches});
    			}
			};
		}
	});
});