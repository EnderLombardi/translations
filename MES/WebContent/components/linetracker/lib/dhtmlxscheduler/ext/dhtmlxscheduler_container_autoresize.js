/*
@license
dhtmlxScheduler v.4.3.1 

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){!function(){e.config.container_autoresize=!0,e.config.month_day_min_height=90;var t=e._pre_render_events,a=!0;e._pre_render_events=function(i,n){if(!e.config.container_autoresize||!a)return t.apply(this,arguments);var l=this.xy.bar_height,r=this._colsS.heights,o=this._colsS.heights=[0,0,0,0,0,0,0],d=this._els.dhx_cal_data[0];if(i=this._table_view?this._pre_render_events_table(i,n):this._pre_render_events_line(i,n),this._table_view)if(n)this._colsS.heights=r;else{var s=d.firstChild;

if(s.rows){for(var _=0;_<s.rows.length;_++){if(o[_]++,o[_]*l>this._colsS.height-this.xy.month_head_height){var c=s.rows[_].cells,u=this._colsS.height-this.xy.month_head_height;1*this.config.max_month_events!==this.config.max_month_events||o[_]<=this.config.max_month_events?u=o[_]*l:(this.config.max_month_events+1)*l>this._colsS.height-this.xy.month_head_height&&(u=(this.config.max_month_events+1)*l);for(var h=0;h<c.length;h++)c[h].childNodes[1].style.height=u+"px";o[_]=(o[_-1]||0)+c[0].offsetHeight;

}o[_]=(o[_-1]||0)+s.rows[_].cells[0].offsetHeight}o.unshift(0),s.parentNode.offsetHeight<s.parentNode.scrollHeight&&!s._h_fix}else if(i.length||"visible"!=this._els.dhx_multi_day[0].style.visibility||(o[0]=-1),i.length||-1==o[0]){var p=(s.parentNode.childNodes,(o[0]+1)*l+1+"px");d.style.top=this._els.dhx_cal_navline[0].offsetHeight+this._els.dhx_cal_header[0].offsetHeight+parseInt(p,10)+"px",d.style.height=this._obj.offsetHeight-parseInt(d.style.top,10)-(this.xy.margin_top||0)+"px";var v=this._els.dhx_multi_day[0];

v.style.height=p,v.style.visibility=-1==o[0]?"hidden":"visible",v=this._els.dhx_multi_day[1],v.style.height=p,v.style.visibility=-1==o[0]?"hidden":"visible",v.className=o[0]?"dhx_multi_day_icon":"dhx_multi_day_icon_small",this._dy_shift=(o[0]+1)*l,o[0]=0}}return i};var i=["dhx_cal_navline","dhx_cal_header","dhx_multi_day","dhx_cal_data"],n=function(t){for(var a=0,n=0;n<i.length;n++){var l=i[n],r=e._els[l]?e._els[l][0]:null,o=0;switch(l){case"dhx_cal_navline":case"dhx_cal_header":o=parseInt(r.style.height,10);

break;case"dhx_multi_day":o=r?r.offsetHeight:0,1==o&&(o=0);break;case"dhx_cal_data":var d=e.getState().mode;if(o=r.childNodes[1]&&"month"!=d?r.childNodes[1].offsetHeight:Math.max(r.offsetHeight-1,r.scrollHeight),"month"==d){if(e.config.month_day_min_height&&!t){var s=r.getElementsByTagName("tr").length;o=s*e.config.month_day_min_height}t&&(r.style.height=o+"px")}if(e.matrix&&e.matrix[d])if(t)o+=2,r.style.height=o+"px";else{o=2;for(var _=e.matrix[d],c=_.y_unit,u=0;u<c.length;u++)o+=c[u].children?_.folder_dy||_.dy:_.dy;

}("day"==d||"week"==d)&&(o+=2)}a+=o}e._obj.style.height=a+"px",t||e.updateView()},l=function(){if(!e.config.container_autoresize||!a)return!0;var t=e.getState().mode;n(),(e.matrix&&e.matrix[t]||"month"==t)&&window.setTimeout(function(){n(!0)},1)};e.attachEvent("onViewChange",l),e.attachEvent("onXLE",l),e.attachEvent("onEventChanged",l),e.attachEvent("onEventCreated",l),e.attachEvent("onEventAdded",l),e.attachEvent("onEventDeleted",l),e.attachEvent("onAfterSchedulerResize",l),e.attachEvent("onClearAll",l),
e.attachEvent("onBeforeExpand",function(){return a=!1,!0}),e.attachEvent("onBeforeCollapse",function(){return a=!0,!0})}()});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_container_autoresize.js.map