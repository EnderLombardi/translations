sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",	{

					renderer : function(oRm, oControl) {
				
						oRm.write("<div ");
						oRm.writeControlData(oControl);
						oRm.write(" class='dhx_cal_container'  style='width:100%; height:71%;'>");
						oRm.write("	<div class='dhx_cal_navline'style=''>");
						oRm.write("		<div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%;'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_header' Style='text-align:left;'>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_data'></div>");
						oRm.write("</div>");
					},

					onAfterRendering: function onAfterRendering(){
					
						
						scheduler.xy.nav_height = 0; //Div height for date
						scheduler.xy.scroll_width=20;
						scheduler.xy.bar_height = 30;
						scheduler.deleteMarkedTimespan();
						scheduler.config.drag_resize = true;
						scheduler.locale.labels.timeline_tab = "Timeline";
						scheduler.locale.labels.section_custom="Section";
			 		    scheduler.config.details_on_create=false;
						scheduler.config.details_on_dblclick=false;
						scheduler.config.xml_date="%Y-%m-%d %H:%i";
						scheduler.config.markedCells = 0;

						scheduler.config.mark_now = true;
						scheduler.config.drag_create = false;
						scheduler.config.touch = "force";
					 	scheduler.config.details_on_create = false;
						scheduler.config.details_on_dblclick = false;
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
							//x_length : 18,
							y_unit:	[],
							y_property:	"section_id",
							render:"tree",
							folder_dy: 25,
							dy: 36,
														
						});
                        
                        //Shift Management
                        airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
                    	var ShiftManager = airbus.mes.stationtracker.ShiftManager;
                       
                    	scheduler.ignore_timeline = ShiftManager.bounded("isDateIgnored");
						scheduler.templates.timeline_date = ShiftManager.bounded("timelineHeaderTitle");
						scheduler.date.timeline_start = ShiftManager.bounded("adjustSchedulerXStart");
						scheduler.date.add_timeline_old = scheduler.date.add_timeline;
						scheduler.date.add_timeline = ShiftManager.bounded("timelineAddStep");
						//////////////////////////////////////////////////////
                                                
                        
                       
						scheduler.eventId.push ( scheduler.attachEvent("onEventDrag", function SchedStartChange(ev, mode, e) {
//							// any custom logic here
//						//	console.log(new Date(this.getEvent(ev).end_date.getTime()));
//							if (new Date(this.getEvent(ev).start_date.getTime()	+ (-scheduler.matrix.timeline.x_step * 60000)) < scheduler._min_date)
//
//							{
//								console.log("left");
//						//		ShiftManager.timelineSwip("left");
//							} else if (new Date(this.getEvent(ev).end_date.getTime()+ (scheduler.matrix.timeline.x_step * 60000)) > scheduler._max_date) {
//								console.log("right");
//								ShiftManager.timelineSwip("right");
//							}
						
							if ( this.getEvent(ev).start_date.getTime() >= scheduler._max_date  )
								{
								console.log("yes");
								
								}
							
							
						}));
						
						
						scheduler.eventId.push (scheduler.attachEvent("onBeforeEventChanged", function(ev, e, is_new, original){
						  
							if ( ev.section_id.slice(0,2) === "I_" ) {
						    return false;
						  } 
							
						  return true;
						  
						}));
					
												
						//				if (!scheduler.checkEvent("onBeforeEventChanged")) {
//						scheduler.eventId.push(scheduler.attachEvent("onBeforeEventChanged",
//								
//								function blockSectionChange(ev, e, is_new, original) {
//
//									ShiftManager.step = 1;
//
//									if (is_new) {
//										return false;
//									}
//									// to save the old start date to send to
//									// service.
//									//ModelManager.sOldStartDate = original.start_date.toISOString().slice(0, 16);
//									// any custom logic here
//									if (original.section_id === ev.section_id && !ShiftManager.isDateIgnored(ev.start_date)
//											&& !ShiftManager.isDateIgnored(ev.end_date)) {
//										return true;
//									} else {
//
//										delete ev._move_delta
//
//										return false;
//									}
//									// false cancels the operation
//								}));
						
						scheduler.eventId.push(scheduler.attachEvent("onBeforeDrag",function blockReadonly(id) {

						    dragged_event=scheduler.getEvent(id); //use it to get the object of the dragged event
							
							if (this.getEvent(id).type === "I" ) {
								
								return false;
								
							} else if ( airbus.mes.stationtracker.GroupingBoxingManager.box === "OPERATION_ID") {
								
								return true;
							} else {
								
								return false;
							}
			
						}));
						
						scheduler.eventId.push(scheduler.attachEvent("onDragEnd", function rescheduling(id, mode, e){
////						Filled on event onBeforeDrag
							var event_obj_before = dragged_event;

							var event_obj_now = scheduler.getEvent(id); 

//							We check only the first start date because the duration of the operation cannot changed							
							if(event_obj_before.start_date === event_obj_now.start_date) {
//								date aren't change , nothing to do
								return true;
							} else {
								airbus.mes.stationtracker.ModelManager.sendRescheduleRequest(event_obj_now);
							}
							
							
//							airbus.mes.stationtracker.ModelManager.reschedulingEvent(event_obj);
							
							console.log("end of drag");
							
						}));
												
						scheduler.eventId.push(scheduler.attachEvent("onBeforeTodayDisplayed", function() {
							
							ShiftManager.step = 0;
							ShiftManager.current_Date = new Date().toISOString().slice(0, 10);
							ShiftManager.adjustSchedulerXStart(new Date());

							return true;

						}));
					
						//
						/* 	Custom Y group display */

						scheduler.templates.timeline_scale_label = function(key, label, section) {

							return airbus.mes.stationtracker.util.Formatter.YdisplayRules(section);
							
						};

						scheduler.templates.timeline_scaley_class = function(key, label, section) {

							if (section.initial != undefined) {

								return "initial";

							}

							if (section.rescheduled != undefined) {

								return "lineYaxis";

							}
							
							
						};

						/* 	 Custom progress background display  */

						scheduler.templates.event_class = function(start, end, event) {
						
							return "grey";

						};

						scheduler.eventId.push (scheduler.attachEvent("onYScaleClick", function(index, section, e) {

							if (airbus.mes.stationtracker.AssignmentManager.bOpen && section.children != undefined) {

								scheduler.openSection(section.key);
								airbus.mes.stationtracker.AssignmentManager.bOpen = false;
							}

							if (section.rescheduled && !section.children) {
								
								jQuery.sap.registerModulePath("airbus.mes.polypoly","../components/polypoly");
								airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = true;
		
							if (!airbus.mes.stationtracker.oPopoverPolypoly) {
								airbus.mes.stationtracker.oPopoverPolypoly = sap.ui.xmlfragment("airbus.mes.stationtracker.polypolyFragment", airbus.mes.stationtracker.oView.getController());
								
								if(airbus.mes.polypoly == undefined){
									sap.ui.getCore().createComponent({
										name : "airbus.mes.polypoly", // root component folder is resources
									});	
								}
							}
							//load model of polypoly
							airbus.mes.polypoly.ModelManager.getPolyPolyModel("CHES", "1L"); //TODO Get Parameters
							// set polypoly in non-editable mode
							airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;
							
							
							// place this Ui Container with the Component inside into UI Area
							airbus.mes.stationtracker.oPopoverPolypoly.addContent(airbus.mes.polypoly.oView);
						

							airbus.mes.stationtracker.oPopoverPolypoly.open();
							// Permit to display or not polypoly affectation or polypoly simple
							airbus.mes.polypoly.oView.getController().initiatePolypoly();
							}

						}));

						/* 	 Custom Hour display display  */
						scheduler.templates.timeline_scalex_class = function(date){
							
						    return "customHour";
						    
						};
						
						scheduler.templates.event_bar_text = function(start, end, event) {

							return airbus.mes.stationtracker.util.Formatter.BoxDisplay(event);
					
						};

						/* custom initial */

						scheduler.templates.timeline_cell_class = function(evs, date, section) {
														
							if (section.initial != undefined) {
								
								return "initial";

							}
							if (section.children != undefined) {

								return "folderAxisColor";

							}
							
						};
						
						scheduler.eventId.push ( scheduler.attachEvent("onScaleAdd", function( unit , date ) {
					  /* Delete initial - + to indicate the collapse or expand of folder */		
							for (var i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
								$("div[class='dhx_scell_expand']").eq(i).remove();
							}

						/* Create arrow to change shift/day */								
							if ($("div[class='dhx_cal_next_button']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_next_button' Style='float:right; width:30px;'></div>"));
								$("div[class='dhx_cal_next_button']").click(function() {
									scheduler._click.dhx_cal_next_button();
									airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.current_shift.shiftID);
									airbus.mes.stationtracker.ModelManager.selectMyShift();
								});
							}

							if ($("div[class='dhx_cal_prev_button']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
								$("div[class='dhx_cal_prev_button']").click(function() {
									scheduler._click.dhx_cal_prev_button();
									airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.current_shift.shiftID);
									airbus.mes.stationtracker.ModelManager.selectMyShift();
								});
							}
												
							}));
						
											
						scheduler.eventId.push ( scheduler.attachEvent("onClick", function(id, e) {	
							
							airbus.mes.stationtracker.ModelManager.OpenWorkList(id);
							
						}));
						
					},
				});
