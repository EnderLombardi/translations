sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",	{

					renderer : function(oRm, oControl) {
				
						oRm.write("<div ");
						oRm.writeControlData(oControl);
						oRm.write(" class='dhx_cal_container'  style='width:100%; height:71%;'>");
						oRm.write("	<div class='dhx_cal_navline'style=''>");
						oRm.write("		<div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_header' Style='text-align:left;'>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_data'></div>");
						oRm.write("</div>");
					
							
						
						
						scheduler.xy.scroll_width=20;
						scheduler.xy.bar_height = 30;
						scheduler.deleteMarkedTimespan();
						scheduler.config.drag_resize = false;
						scheduler.locale.labels.timeline_tab = "Timeline";
						scheduler.locale.labels.section_custom="Section";
			 		    scheduler.config.details_on_create=false;
						scheduler.config.details_on_dblclick=false;
						scheduler.config.xml_date="%Y-%m-%d %H:%i";
						scheduler.config.mark_now = true;
						scheduler.config.drag_create = false;
						scheduler.config.drag_resize = false;
						scheduler.config.touch = "force";
						scheduler.config.preserve_length = true;
						scheduler.config.dblclick_create = false;
						
					    scheduler.eventId = scheduler.eventId || [];
                        scheduler.eventId.forEach(function(el) { scheduler.detachEvent(el) });
                        scheduler.eventId = [];


						scheduler.createTimelineView({
								section_autoheight: false,
								name:	"timeline",
								x_unit:	"minute",
								x_date:	"%H:%i",
								x_step : 30,
								x_size : 18,
								x_start : 0,
								x_length : 18,
								y_unit:	[],
								y_property:	"section_id",
								render:"tree",
								folder_dy: 50,
								dy: 30,
								
							});
						//Shift Management

						airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
						var ShiftManager = airbus.mes.stationtracker.ShiftManager;
						
						///////////////////////////////////////////////////////
						function SchedStartChange(ev, mode, e) {
							// any custom logic here
							if (new Date(this.getEvent(ev).start_date.getTime()
									+ (-scheduler.matrix.timeline.x_step * 60000)) < scheduler._min_date)

							{
								ShiftManager.timelineSwip("left");
							} else if (new Date(this.getEvent(ev).end_date.getTime()
									+ (scheduler.matrix.timeline.x_step * 60000)) > scheduler._max_date) {
								ShiftManager.timelineSwip("right");
							}
						
						}
						//					if (!scheduler.checkEvent("onEventDrag")) {
						scheduler.eventId.push (scheduler.attachEvent("onEventDrag", SchedStartChange));
					
						////////////////////////////////////////////////////
						scheduler.ignore_timeline = ShiftManager.bounded("isDateIgnored");
						ShiftManager.addMarkedShifts();
						
//						if(ShiftManager.current_Date !=undefined){
//						scheduler.init(oEvt.srcControl.sId, new Date(ShiftManager.currentFullDate), "timeline");
//						}else{scheduler.init(oEvt.srcControl.sId, new Date(), "timeline");
//						};
						
						scheduler.templates.timeline_date = ShiftManager.bounded("timelineHeaderTitle");
//						scheduler.eventId.push(scheduler.attachEvent("onBeforeTodayDisplayed", function() {
//							
//							ShiftManager.step = 0;
//							ShiftManager.current_Date = new Date().toISOString().slice(0, 10);
//							ShiftManager.adjustSchedulerXStart(new Date());
//
//							// ShiftManager.current_shift = "NORMAL1";
//							return true;
//
//						}));
						scheduler.date.timeline_start = ShiftManager.bounded("timelineStart");
						scheduler.date.add_timeline_old = scheduler.date.add_timeline;
						scheduler.date.add_timeline = ShiftManager.bounded("timelineAddStep");
//						if (ShiftManager.currentFullDate != undefined) {
//							
//							ShiftManager.step = 0;
//							scheduler.updateView(ShiftManager.currentFullDate);	
//							
//							if (ShiftManager.fDraging) {
//								scheduler.updateView(ShiftManager.currentFullDateSwipping)
//								ShiftManager.fDraging = false;
//
//							}
//							
//						} else {
//							
//							ShiftManager.step = 0;
//							scheduler.updateView();		
//							
//						};
						//
						/* 	Custom Y group display */

						scheduler.templates.timeline_scale_label = function(key, label, section) {

							if (section.name && section.subname) {
								var html = '<div><span class="rond" title=' + airbus.mes.stationtracker.util.Formatter.spaceInsecable(section.name) + ' >'
										+ section.subname + '</span><span class="ylabel" title='
										+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(section.name) + '>' + section.name
										+ '</span><span  style="float: right;margin-right: 5px;" >' + section.hours
										+ '</span></div>';
								return html;

							}

							if (section.initial != undefined && airbus.mes.stationtracker.GroupingBoxingManager.showInitial ) {

								var html = '<span  style="float: right;margin-right: 5px;" >' + section.initial
										+ '</span>'
								return html;

							}

							if (section.newop != undefined) {

								var html = '<div><i class="fa fa-plus-circle"  style="float:left; padding-left:4px;" ></i><span class="ylabel">Select operator</span></div>';
								return html;

							}

							if (section.children != undefined) {

								var html = '<div><span id= folder_' +section.key
										+ ' class="' + airbus.mes.stationtracker.util.Formatter.openFolder(section.open) + '"></span><div title='
										+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(section.label) + ' class="ylabelfolder">' + section.label
										+ '</div><span id= add_' + section.key
										+ ' class="fa fa-user-plus custom" onclick="airbus.mes.stationtracker.AssignmentManager.newLine(\''
										+ section.key + '\')"></span></div>';
								return html;

							}

						};

						scheduler.templates.timeline_scaley_class = function(key, label, section) {

							if (section.initial != undefined) {

								return "initial";

							}

							if (section.label != undefined) {

								return "white";

							}

						};

						/* 	 Custom progress background display  */

						scheduler.templates.event_class = function(start, end, event) {

							return "grey";

						};

						scheduler.attachEvent("onYScaleClick", function(index, section, e) {

							if (airbus.mes.stationtracker.AssignmentManager.bOpen && section.children != undefined) {

								scheduler.openSection(section.key);
								airbus.mes.stationtracker.AssignmentManager.bOpen = false;
							}

							if (section.subname && !section.children) {

								new sap.m.Popover({
									placement : "Bottom",
								}).openBy(e.srcElement);

							}

						});

						/* 	 Custom Hour display display  */
						scheduler.templates.timeline_scalex_class = function(date){
							
						    return "customHour";
						    
						};
						
						scheduler.templates.event_bar_text = function(start, end, event) {

							if (event.type === "I") {
								
								return airbus.mes.stationtracker.util.Formatter.initial(event.text, event.progress);

								
							}
							
							if (event.progress === "100") {

								return airbus.mes.stationtracker.util.Formatter.fullConfirm(event.text, event.progress);

							}
							
							if (event.progress != "100") {
								
								if ( event.andon === 1 ) {
									
									return airbus.mes.stationtracker.util.Formatter.andon(event.text,event.progress);
									
								}
								
								if ( event.blocked === 1 ) {
									
									return airbus.mes.stationtracker.util.Formatter.blocked(event.text,event.progress);
								}
								
								
								
								return airbus.mes.stationtracker.util.Formatter.partialConf(event.text, event.progress);

							}
							
					
						};

						/* custom initial */

						scheduler.templates.timeline_cell_class = function(evs, date, section) {
							if (section.initial != undefined) {

								return "initial";

							}
							if (section.children != undefined) {

								return "white";

							}
						};

						/* Delete initial - + to indicate the collapse or expand of folder */
						
						scheduler.eventId.push ( scheduler.attachEvent("onScaleAdd", function( unit , date ) {
							for (i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
								$("div[class='dhx_scell_expand']").eq(i).remove();
							}

						/* Create arrow to change shift/day */								
							if ($("div[class='dhx_cal_next_button']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_next_button' Style='float:right;'></div>"));
								$("div[class='dhx_cal_next_button']").click(function() {
									scheduler._click.dhx_cal_next_button()
								});
							}

							if ($("div[class='dhx_cal_prev_button']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right;'></div>"));
								$("div[class='dhx_cal_prev_button']").click(function() {
									scheduler._click.dhx_cal_prev_button()
								});
							}
							
							if ($("select[class='selectBoxStation']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<select class='selectBoxStation' ><option value='volvo'>Volvo</option><option value='saab'>Saab</option>" +
										"<option value='opel'>Opel</option><option value='audi'>Audi</option></select>"));
								$("div[class='selectBoxStation']").click(function() {
									scheduler._click.dhx_cal_prev_button()
								});
							}
						}));
						
				
							
						scheduler.eventId.push ( scheduler.attachEvent("onClick", function(id, e) {	
							if ( airbus.mes.stationtracker.schedulerPopover === undefined ) {
								
								airbus.mes.stationtracker.schedulerPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.schedulerPopover", this);
								airbus.mes.stationtracker.schedulerPopover.addStyleClass("alignTextLeft");
								
							}
							
							airbus.mes.stationtracker.schedulerPopover.openBy(e.srcElement);		

						}));
										
					},
														
				});
