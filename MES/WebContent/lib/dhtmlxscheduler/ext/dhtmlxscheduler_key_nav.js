/*
@license
dhtmlxScheduler v.4.3.1 

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e._temp_key_scope=function(){function t(e){delete e.rec_type,delete e.rec_pattern,delete e.event_pid,delete e.event_length}e.config.key_nav=!0;var a,n,i=null;e.attachEvent("onMouseMove",function(t,i){a=e.getActionData(i).date,n=e.getActionData(i).section}),e._make_pasted_event=function(i){var r=i.end_date-i.start_date,l=e._lame_copy({},i);if(t(l),l.start_date=new Date(a),l.end_date=new Date(l.start_date.valueOf()+r),n){var d=e._get_section_property();e.config.multisection?l[d]=i[d]:l[d]=n;

}return l},e._do_paste=function(t,a,n){e.addEvent(a),e.callEvent("onEventPasted",[t,a,n])},e._is_key_nav_active=function(){return this._is_initialized()&&!this._is_lightbox_open()&&this.config.key_nav?!0:!1},dhtmlxEvent(document,_isOpera?"keypress":"keydown",function(t){if(!e._is_key_nav_active())return!0;if(t=t||event,37==t.keyCode||39==t.keyCode){t.cancelBubble=!0;var a=e.date.add(e._date,37==t.keyCode?-1:1,e._mode);return e.setCurrentView(a),!0}var n=e._select_id;if(t.ctrlKey&&67==t.keyCode)return n&&(e._buffer_id=n,
i=!0,e.callEvent("onEventCopied",[e.getEvent(n)])),!0;if(t.ctrlKey&&88==t.keyCode&&n){i=!1,e._buffer_id=n;var r=e.getEvent(n);e.updateEvent(r.id),e.callEvent("onEventCut",[r])}if(t.ctrlKey&&86==t.keyCode){var r=e.getEvent(e._buffer_id);if(r){var l=e._make_pasted_event(r);if(i)l.id=e.uid(),e._do_paste(i,l,r);else{var d=e.callEvent("onBeforeEventChanged",[l,t,!1,r]);d&&(e._do_paste(i,l,r),i=!0)}}return!0}})},e._temp_key_scope()});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_key_nav.js.map