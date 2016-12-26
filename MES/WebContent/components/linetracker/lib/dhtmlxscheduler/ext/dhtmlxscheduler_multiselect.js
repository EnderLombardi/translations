/*
@license
dhtmlxScheduler v.4.3.1 

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.form_blocks.multiselect={render:function(e){for(var t="<div class='dhx_multi_select_"+e.name+"' style='overflow: auto; height: "+e.height+"px; position: relative;' >",a=0;a<e.options.length;a++)t+="<label><input type='checkbox' value='"+e.options[a].key+"'/>"+e.options[a].label+"</label>",convertStringToBoolean(e.vertical)&&(t+="<br/>");return t+="</div>"},set_value:function(t,a,n,i){function r(e){for(var a=t.getElementsByTagName("input"),n=0;n<a.length;n++)a[n].checked=!!e[a[n].value];

}for(var d=t.getElementsByTagName("input"),l=0;l<d.length;l++)d[l].checked=!1;var o={};if(n[i.map_to]){for(var s=(n[i.map_to]+"").split(","),l=0;l<s.length;l++)o[s[l]]=!0;r(o)}else{if(e._new_event||!i.script_url)return;var _=document.createElement("div");_.className="dhx_loading",_.style.cssText="position: absolute; top: 40%; left: 40%;",t.appendChild(_),dhtmlxAjax.get(i.script_url+"?dhx_crosslink_"+i.map_to+"="+n.id+"&uid="+e.uid(),function(e){for(var a=e.doXPath("//data/item"),n={},d=0;d<a.length;d++)n[a[d].getAttribute(i.map_to)]=!0;

r(n),t.removeChild(_)})}},get_value:function(e,t,a){for(var n=[],i=e.getElementsByTagName("input"),r=0;r<i.length;r++)i[r].checked&&n.push(i[r].value);return n.join(",")},focus:function(e){}}});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_multiselect.js.map