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
					
							
						
						scheduler.xy.nav_height = 0; //Div height for date
						scheduler.xy.scroll_width=20;
						scheduler.xy.bar_height = 30;
						scheduler.deleteMarkedTimespan();
						scheduler.config.drag_resize = false;
						scheduler.locale.labels.timeline_tab = "Timeline";
						scheduler.locale.labels.section_custom="Section";
			 		    scheduler.config.details_on_create=false;
						scheduler.config.details_on_dblclick=false;
						scheduler.config.xml_date="%Y-%m-%d %H:%i";
						scheduler.config.markedCells = 0;

						scheduler.config.mark_now = true;
						scheduler.config.drag_create = false;
						scheduler.config.drag_resize = false;
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
							folder_dy: 50,
							dy: 30,
														
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

								jQuery.sap.registerModulePath("airbus.mes.polypoly","/MES/components/polypoly");
								airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = true;
		
							if (!airbus.mes.stationtracker.oPopoverPolypoly) {
								airbus.mes.stationtracker.oPopoverPolypoly = sap.ui.xmlfragment("airbus.mes.stationtracker.polypolyFragment", this);
								
								var oComp = sap.ui.getCore().createComponent({
						            name : "airbus.mes.polypoly", // root component folder is resources
						            id : "Comp10",
						     });	
								
								//load model of polypoly
								airbus.mes.polypoly.ModelManager.loadPolyPolyModel("F1","1","10","CHES");	
								
							}
							// Permit to display or not polypoly affectation or polypoly simple
							airbus.mes.polypoly.oView.getController().filterUA();
							
							// place this Ui Container with the Component inside into UI Area
							airbus.mes.stationtracker.oPopoverPolypoly.addContent(airbus.mes.polypoly.oView);
							airbus.mes.stationtracker.oPopoverPolypoly.open();	
								
								
								
								
								
							}

						});

						/* 	 Custom Hour display display  */
						scheduler.templates.timeline_scalex_class = function(date){
							
						    return "customHour";
						    
						};
						
						scheduler.templates.event_bar_text = function(start, end, event) {

						//	return airbus.mes.stationtracker.util.Formatter.BoxDisplay(event);
							
							if (event.type === "I") {
								
								return airbus.mes.stationtracker.util.Formatter.initial(event.text, event.progress);

								
							}
							
							if (event.progress === "100") {

								return airbus.mes.stationtracker.util.Formatter.fullConfirm(event.text, event.progress);

							}
							
							if (event.progress != "100") {
								
								if ( event.andon === 1 ) {
									
									return airbus.mes.stationtracker.util.Formatter.andon(event.text,event.progress,event.totalDuration);
									
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
									airbus.mes.stationtracker.ModelManager.selectMyShift();
								});
							}

							if ($("div[class='dhx_cal_prev_button']").length === 0) {
								$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
								$("div[class='dhx_cal_prev_button']").click(function() {
									scheduler._click.dhx_cal_prev_button();
									airbus.mes.stationtracker.ModelManager.selectMyShift();
								});
							}
							/* Listbox */
//							$("select[class='selectShift']").setVisible(airbus.mes.stationtracker.ShiftManager.dayDisplay); // bad
//							var options = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day];
//							if (airbus.mes.stationtracker.ShiftManager.dayDisplay === true && $("select[class='selectBoxStation']").length === 0 ) {		
//								$("div[class='dhx_cal_header']").append("<select class='selectBoxStation' id='selectBoxStation' ></select>");
//								var i = 0;
//								for (var prop in options) {
//							        // skip loop if the property is from prototype
//							        if(!options.hasOwnProperty(prop)) continue;
//							        if (i != airbus.mes.stationtracker.ShiftManager.BoxSelected)
//							        {	
//							        	$("select[class='selectBoxStation']").append("<option value='"+prop+"'>"+prop+"</option>");
//							        }
//							        else
//							        {
//							        	$("select[class='selectBoxStation']").append("<option value='"+prop+"' selected='selected'>"+prop+"</option>");
//							        	airbus.mes.stationtracker.ShiftManager.ShiftSelected = prop;
//							        	var intervals = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][airbus.mes.stationtracker.ShiftManager.ShiftSelected];
//										airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart = intervals[0].beginDateTime;
//										airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd = intervals[intervals.length - 1].endDateTime;
//										scheduler.deleteMarkedTimespan();
//										scheduler.addMarkedTimespan({  
//											start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart,
//											end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd,
//										    css:   "shiftCss",
//										});
//							        }
//							        i++;
//							    }
//								 $("select[class='selectBoxStation']").change(function(){
//								this.options[this.selectedIndex].selected = true;
//								airbus.mes.stationtracker.ShiftManager.BoxSelected = this.selectedIndex;
//								airbus.mes.stationtracker.ShiftManager.ShiftSelected = this.options[this.selectedIndex].value;
//								var intervals = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][airbus.mes.stationtracker.ShiftManager.ShiftSelected];
//								airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart = intervals[0].beginDateTime;
//								airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd = intervals[intervals.length - 1].endDateTime;
//								scheduler.deleteMarkedTimespan();
//								scheduler.updateView();
//								scheduler.addMarkedTimespan({  
//									start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart,
//									end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd,
//								    css:   "shiftCss",
//								});
//
//
//								 
//							 });
//							}
//							else if (airbus.mes.stationtracker.ShiftManager.shiftDisplay === true)
//							{
//								scheduler.deleteMarkedTimespan();
//								$("select[class='selectBoxStation']").length = 0;
//								airbus.mes.stationtracker.ShiftManager.BoxSelected = 0;
//								airbus.mes.stationtracker.ShiftManager.ShiftSelected = undefined;
//								airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart = undefined;
//								airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd = undefined;
//							}							
//									
						
							}));
						
											
						scheduler.eventId.push ( scheduler.attachEvent("onClick", function(id, e) {	
							switch(airbus.mes.stationtracker.GroupingBoxingManager.box){
							case "OPERATION_ID" : 
//								Boxing operation, we display the operation list
								if ( airbus.mes.stationtracker.operationPopover === undefined ) {
									
									var oView = airbus.mes.stationtracker.oView;
									airbus.mes.stationtracker.operationPopover = sap.ui.xmlfragment("operationPopover","airbus.mes.stationtracker.operationPopover", airbus.mes.stationtracker.oView.getController());
									airbus.mes.stationtracker.operationPopover.addStyleClass("alignTextLeft");
									oView.addDependent(airbus.mes.stationtracker.operationPopover);
								}
								var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
								var oMasterPage = sap.ui.getCore().byId("operationPopover--master");
								oNavCon.to(oMasterPage);
								oNavCon.currentPageIsTopPage();
								var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
//								oOperationPopover.setContentHeight("353px");								
								airbus.mes.stationtracker.operationPopover.setModel(new sap.ui.model.json.JSONModel(airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box]), "WorkListModel");
								airbus.mes.stationtracker.operationPopover.getModel("WorkListModel").refresh();
//								airbus.mes.stationtracker.operationPopover.openBy(e.srcElement);	
								airbus.mes.stationtracker.operationPopover.open();	

								break;
							case "WORKORDER_ID" :	
//								Boxing Work order, we display the worklist list								
								if ( airbus.mes.stationtracker.worklistPopover === undefined ) {
									
									var oView = airbus.mes.stationtracker.oView;
									airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
									airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
									oView.addDependent(airbus.mes.stationtracker.worklistPopover);
								}
								airbus.mes.stationtracker.worklistPopover.unPlanned = false;
								airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box]), "WorkListModel");
								airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh();

								var oData = airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").getData();
								if (oData && oData.length > 0 && oData) {
									oData = airbus.mes.stationtracker.util.Formatter.sortWorkList(oData);
								}		
								airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").setData(oData);
								airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);
								
								
								airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("filterUnplannedModel").getData()), "filterUnplannedModel");
								airbus.mes.stationtracker.worklistPopover.getModel("filterUnplannedModel").refresh();

								// delay because addDependent will do a async rerendering and the popover will immediately close without it
								airbus.mes.stationtracker.worklistPopover.open();	
								break;							
							}
							
						
							
						}));
						
					},
				});
