var project = getQueryVariable("project");
var vizId = getQueryVariable("vizId");

if (!project) { alert("Please provide the project id."); }
if (!vizId) { alert("Please provide the visualization id."); }

var head= document.getElementsByTagName('head')[0];
var script= document.createElement('script');
script.type= 'text/javascript';
script.src= "https://na-data-projects.s3.amazonaws.com/projects/" + project + '.js';
head.appendChild(script);

var nodeList = document.querySelectorAll(".dataviz__chart-area:not(#" + vizId + ")");
for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].style.display = 'none';
}

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