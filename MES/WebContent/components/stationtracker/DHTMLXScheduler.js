"use strict";

sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",    {

//                  Define if it is a simple click or a double click. Used on event onDblClick and onClick
                    byPassOnClick: "boolean",
//                  Define if it is a simple click or a drag and drop. Used on event onBeforeDrag and onClick
                    byPassOnDrag: "boolean",
                    
                    renderer : function(oRm, oControl) {

                        oRm.write("<div ");
                        oRm.writeControlData(oControl);
                        oRm.write(" class='dhx_cal_container'  style='width:100%; height:71%;'>");
                        oRm.write("    <div class='dhx_cal_navline'style=''>");
                        oRm.write("        <div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%;'></div>");
                        oRm.write("    </div>");
                        oRm.write("    <div class='dhx_cal_header' Style='text-align:left;'>");
                        oRm.write("    </div>");
                        oRm.write("    <div class='dhx_cal_data'></div>");
                        oRm.write("</div>");
                    },

                    onAfterRendering: function onAfterRendering(){

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
                        // cant drag & drop verticaly if set to force
                        scheduler.config.touch = "force";
                        scheduler.config.details_on_create = false;
                        scheduler.config.details_on_dblclick = false;
                        scheduler.config.preserve_length = true;
                        scheduler.config.dblclick_create = false;
                        scheduler.eventId = scheduler.eventId || [];
                        scheduler.eventId.forEach(function(el) { scheduler.detachEvent(el); });
                        scheduler.eventId = [];


                        scheduler.createTimelineView({
                            section_autoheight: false,
                            name:    "timeline",
                            x_unit:    "minute",
                            x_date:    "%H:%i",
                            //When coming back from setting permit to display the previous mode shift/day
                            x_step :  airbus.mes.stationtracker.ShiftManager.dayDisplay ? 60 : 30,
                            x_size : 18,
                            x_start : 0,
                            //x_length : 18,
                            y_unit:    [],
                            y_property:    "section_id",
                            render:"tree",
                            folder_dy: 25,
                            dy: 48,

                        });

                        //Shift Management
                        airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
                        var ShiftManager = airbus.mes.stationtracker.ShiftManager;

                        scheduler.ignore_timeline = ShiftManager.bounded("isDateIgnored");
                        scheduler.templates.timeline_date = ShiftManager.bounded("timelineHeaderTitle");
                        scheduler.date.timeline_start = ShiftManager.bounded("adjustSchedulerXStart");
                        scheduler.date.add_timeline_old = scheduler.date.add_timeline;
                        scheduler.date.add_timeline = ShiftManager.bounded("timelineAddStep");

                        /************************************************************************/
                        /************************************************************************/
                        /**                                                                    **/
                        /**         DECLARTION OF ALL DHTMLX EVENT (REF TO DHTMLX DOC)         **/
                        /**                                                                    **/
                        /************************************************************************/
                        /************************************************************************/

//                        scheduler.eventId.push ( scheduler.attachEvent("onEventDrag", function SchedStartChange(ev, mode, e) {
//                            if ( this.getEvent(ev).start_date.getTime() >= scheduler._max_date  ){
//                                console.log("yes");
//                                }
//                        }));


                        /**
                         * After drag & drop check the initial Date and compare with the new date if
                         * it is different it call the rescheduling request to MII
                         *
                         * @param {OBJECT} ev, event new object
                         * @param {OBJECT} original, event previous object
                         * @param {Boolean} is_new, if is created event
                         */
                        
                        scheduler.eventId.push(scheduler.attachEvent("onBeforeEventChanged", function(ev, e, is_new,original) {

                        	//Filled on event onBeforeDrag
                			var oInitial = original;
                    		var oFinal = ev;
                        	
                            if (is_new) {
                                return false;
                            }

                            if (ev.section_id.slice(0, 2) === "I_") {
                                return false;
                            }
                            
                            // Get Value of groupind of new operation
                            var aNewGroup = ev.section_id.split("_");
                            var fLenght = aNewGroup.length - 2;
                            var sNewGroup = "";
                            
                            for ( var i = 0;  i < fLenght  ; i++) {
                            	
                            	sNewGroup += aNewGroup[i];
                            	
                            }
                            // Get Value of grouping of initial operation
                            var aInitialGroup = oInitial.section_id.split("_");
                            var fLenghtI = aInitialGroup.length - 2;
                            var sInitialGroup = "";
                            
                            for ( var i = 0;  i < fLenghtI  ; i++) {
                            	
                            	sInitialGroup += aInitialGroup[i];
                            	
                            }                           
                            
                            // Check if the grouping of operation is different
                            if (  sInitialGroup != sNewGroup ) {
                            	
                            	return false;
                            	
                            }
                           
                                //Store oFinal and oInitial value in case of check qa is not successfull
                                airbus.mes.stationtracker.oFinal = oFinal;
                                airbus.mes.stationtracker.oInitial = oInitial;
                                airbus.mes.stationtracker.ModelManager.sendRescheduleRequest(false,oFinal,oInitial);
                                return true;
                        }));

                        /**
                         * This event permit to cancel the drag and drop of Initial operation and when
                         * the boxing value selected != operation_Id
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         * @return {boolean} true if not dragable, false to permit drag & drop
                         */

                        scheduler.eventId.push(scheduler.attachEvent("onBeforeDrag",function blockReadonly(id) {

                        	var that = this;
                        	this.byPassOnDrag = false;
                        	
                        	// permit to dont reschedule
                            if ( bBatch1 ) {
                                return false;
                            }

                            // cannot reschedule an initial operation                            
                            if (this.getEvent(id).type === "I" ) {

                                return false;

                                
                            } else if ( airbus.mes.stationtracker.GroupingBoxingManager.box === "OPERATION_ID") {

                            	if (this.getEvent(id)) {

                        		
                            		if (airbus.mes.stationtracker.GroupingBoxingManager.computeStatus(this.getEvent(id).state, this.getEvent(id).paused, this.getEvent(id).previouslyStarted) === "0" ) {
                                   		// if current operation is complete, cannot reschedule the operation
                                        setTimeout(function() {

                                            //If the bypass variable has been set on true to the double click action
//                                              we don't perform the simple click action
                                              if (!that.byPassOnDrag) {
                                       			sap.m.MessageToast.show(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("ForbiddenReschedule"), {
                                    				duration : 3000});
                                              }
                                        	}
                                         , 200)                            			
                           			
                            			return false;			
                            		} else {
                            			return true;
                            		};
                            	} else {
                                    return true;                            		
                            	}

                            } else {
                            	// cannot reschedule if grouping is not operation	
                                return false;
                            }

                        }));

                        /**
                         * ??????????
                         *
                         * @param {oEvent} Object wich represent the event on press from "TeamButton"
                         */

                        scheduler.eventId.push(scheduler.attachEvent("onBeforeTodayDisplayed", function() {

                            ShiftManager.step = 0;
                            ShiftManager.current_Date = new Date().toISOString().slice(0, 10);
                            ShiftManager.adjustSchedulerXStart(new Date());

                            return true;

                        }));

                        /**
                         * Open PolyPoly fragment in affectation mode
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         * @param {OBJECT}    section a data object of the clicked cell
                         * @param {Event} e    a native event object
                         */

                        scheduler.eventId.push (scheduler.attachEvent("onYScaleClick", function(index, section, e) {

                            if (airbus.mes.stationtracker.AssignmentManager.bOpen && section.children != undefined) {

                                scheduler.openSection(section.key);
                                airbus.mes.stationtracker.AssignmentManager.bOpen = false;
                            }

                            if (section.rescheduled && !section.children) {
                                jQuery.sap.registerModulePath("airbus.mes.polypoly","../components/polypoly");
                                airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = true;
                                airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedLine = section;
                                airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift = airbus.mes.stationtracker.ShiftManager.ShiftSelected;

                                if(!airbus.mes.stationtracker.AssignmentManager.checkQA){
                                    if (!airbus.mes.stationtracker.oPopoverPolypoly) {
                                        airbus.mes.stationtracker.oPopoverPolypoly = sap.ui.xmlfragment("airbus.mes.stationtracker.polypolyFragment", airbus.mes.stationtracker.oView.getController());

                                        if(airbus.mes.polypoly == undefined){
                                            sap.ui.getCore().createComponent({
                                                name : "airbus.mes.polypoly", // root component folder is resources
                                            });
                                        }
                                    }
                                    //load model of polypoly
                                    airbus.mes.polypoly.ModelManager.getPolyPolyModel(airbus.mes.stationtracker.ModelManager.settings.site, airbus.mes.stationtracker.ModelManager.settings.station);

                                    //active busy
                                    airbus.mes.shell.busyManager.setBusy(airbus.mes.polypoly.oView);

                                    //open the pop-up
                                    airbus.mes.stationtracker.oPopoverPolypoly.open();

                                    // set polypoly in non-editable mode
                                    airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;

                                    // place this Ui Container with the Component inside into UI Area
                                    airbus.mes.stationtracker.oPopoverPolypoly.addContent(airbus.mes.polypoly.oView);
                                    airbus.mes.stationtracker.oPopoverPolypoly.setModel(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n"),"StationTrackerI18n");

                                    var myButton = airbus.mes.stationtracker.oPopoverPolypoly.getButtons().find(function(el){
                                        return el.sId == "deleteLineAssignmentButton";
                                    });
                                    if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[section.avlLine]) {
                                        if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[section.avlLine][airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID]){
                                            if(!myButton.getVisible()){
                                                myButton.setVisible(true);
                                            }
                                        }else{
                                            if(myButton.getVisible()){
                                                myButton.setVisible(false);
                                            }
                                        }
                                    }else{
                                        if(myButton.getVisible()){
                                            myButton.setVisible(false);
                                        }
                                    }                         
                                    // Permit to display or not polypoly affectation or polypoly simple
                                    airbus.mes.polypoly.oView.getController().initiatePolypoly();

                                }else{
                                    airbus.mes.stationtracker.AssignmentManager.handleLineAssignment("W", false);
                                }
                            }

                        }));

                        /**
                         * Permit to replace the default arrow to change the day in scheduler change the icon
                         * display on the collapse open folder
                         *
                         */

                        scheduler.eventId.push ( scheduler.attachEvent("onScaleAdd", function() {
                              /* Delete initial - + to indicate the collapse or expand of folder */
                                    for (var i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
                                        $("div[class='dhx_scell_expand']").eq(i).remove();
                                    }

                                /* Create arrow to change shift/day */
                                    if ($("div[class='dhx_cal_next_button']").length === 0) {
                                        $("div[class='dhx_cal_header']").append(("<div class='dhx_cal_next_button' Style='float:right; width:30px;'></div>"));
                                        $("div[class='dhx_cal_next_button']").click(function() {
                                            scheduler._click.dhx_cal_next_button();
                                            //airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.current_shift.shiftID);
                                            airbus.mes.stationtracker.ModelManager.selectMyShift();
                                        });
                                    }

                                    if ($("div[class='dhx_cal_prev_button']").length === 0) {
                                        $("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
                                        $("div[class='dhx_cal_prev_button']").click(function() {
                                            scheduler._click.dhx_cal_prev_button();
                                            //airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.current_shift.shiftID);
                                            airbus.mes.stationtracker.ModelManager.selectMyShift();
                                        });
                                    }

                                    }));

                        /**
                         * Manage the double click on a box it open the recheduling popup dialog
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         */

                        scheduler.eventId.push( scheduler.attachEvent("onDblClick", function(id) {

//                            Set the bypass variable to true
                            this.byPassOnClick = true;
                            //airbus.mes.stationtracker.ModelManager.OpenReschedule(id);

                            return false;

                        }));

                        /**
                         * Manage the simple click it open the operationInfo popup if boxing is
                         * operation otherwise it open worklist dialog
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         */

                        scheduler.eventId.push ( scheduler.attachEvent("onClick", function(id) {

                              var that = this;
                              
                              this.byPassOnDrag = true;
                              
//                            Need to define a time out to differenciate drag and drop, simple click and double click
                              setTimeout(function() {

                                  //If the bypass variable has been set on true to the double click action
//                                    we don't perform the simple click action
                                    if (that.byPassOnClick) {
                                        return false;
                                    } else {
                                        airbus.mes.stationtracker.ModelManager.OpenWorkList(id);
                                        return true;
                                        }
                                  }, 200)

//                            Reinitiate the bypass variable
                              this.byPassOnClick = false;
                        }));

                        /************************************************************************/
                        /************************************************************************/
                        /**                                                                    **/
                        /**      DECLARTION OF ALL DHTMLX TEMPLATES (REF TO DHTMLX DOC)        **/
                        /**                                                                    **/
                        /************************************************************************/
                        /************************************************************************/

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

                        /*      Custom progress background display  */
                        scheduler.templates.event_class = function(start, end, event) {
                            return "grey";
                        };

                        /*      Custom Hour display display  */
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
                    },
                });
