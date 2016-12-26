/*
@license
dhtmlxScheduler v.4.3.1 

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.attachEvent("onTemplatesReady",function(){for(var t=document.body.getElementsByTagName("DIV"),a=0;a<t.length;a++){var n=t[a].className||"";if(n=n.split(":"),2==n.length&&"template"==n[0]){var i='return "'+(t[a].innerHTML||"").replace(/\"/g,'\\"').replace(/[\n\r]+/g,"")+'";';i=unescape(i).replace(/\{event\.([a-z]+)\}/g,function(e,t){return'"+ev.'+t+'+"'}),e.templates[n[1]]=Function("start","end","ev",i),t[a].style.display="none"}}})});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_html_templates.js.map