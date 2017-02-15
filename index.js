var project = getQueryVariable("project");
var vizId = getQueryVariable("vizId");

var nodeList = document.querySelectorAll(".dataviz__chart-area:not(#" + vizId + ")");
for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].style.display = 'none';
}

var body= document.getElementsByTagName('body')[0];
var script= document.createElement('script');
script.type= 'text/javascript';
script.src= "build/" + project + '.js';
body.appendChild(script);

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]).replace("/", "");
        }
    }
    console.log('Query variable %s not found', variable);
}