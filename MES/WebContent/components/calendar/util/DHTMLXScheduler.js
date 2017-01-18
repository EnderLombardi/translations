"use strict";

sap.ui.core.Control.extend("airbus.mes.calendar.util.DHTMLXScheduler",    {

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

                        calendar.xy.nav_height = 0; //Div height for date
                        calendar.xy.scroll_width=20;
                        calendar.xy.bar_height = 30;
                        calendar.deleteMarkedTimespan();
                        calendar.config.drag_resize = false;
                        calendar.locale.labels.timeline_tab = "Timeline";
                        calendar.locale.labels.section_custom="Section";
                        calendar.config.xml_date="%Y-%m-%d %H:%i";
                        calendar.config.markedCells = 0;
                        calendar.config.mark_now = true;
                        calendar.config.drag_create = false;
                        // cant drag & drop verticaly if set to force
                        calendar.config.touch = "force";
                        calendar.config.details_on_create = false;
                        calendar.config.details_on_dblclick = false;
                        calendar.config.preserve_length = true;
                        calendar.config.dblclick_create = false;
                        calendar.eventId = calendar.eventId || [];
                        calendar.eventId.forEach(function(el) { calendar.detachEvent(el); });
                        calendar.eventId = [];

                        calendar.createTimelineView({
                            section_autoheight: false,
                            name:    "timeline",
                            x_unit:    "minute",
                            x_date:    "%H:%i",
                            //When coming back from setting permit to display the previous mode shift/day
                            x_step :  airbus.mes.calendar.util.ShiftManager.dayDisplay ? 60 : 30,
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
                        airbus.mes.calendar.util.ShiftManager.init(airbus.mes.calendar.util.GroupingBoxingManager.shiftNoBreakHierarchy);
                        var ShiftManager = airbus.mes.calendar.util.ShiftManager;

                        calendar.ignore_timeline = ShiftManager.bounded("isDateIgnored");
                        calendar.templates.timeline_date = ShiftManager.bounded("timelineHeaderTitle");
                        calendar.date.timeline_start = ShiftManager.bounded("adjustcalendarXStart");
                        calendar.date.add_timeline_old = calendar.date.add_timeline;
                        calendar.date.add_timeline = ShiftManager.bounded("timelineAddStep");
                        calendar._click.dhx_cal_next_button = ShiftManager.bounded("next");

                        
                        /************************************************************************/
                        /************************************************************************/
                        /**                                                                    **/
                        /**         DECLARTION OF ALL DHTMLX EVENT (REF TO DHTMLX DOC)         **/
                        /**                                                                    **/
                        /************************************************************************/
                        /************************************************************************/

//                        calendar.eventId.push ( calendar.attachEvent("onEventDrag", function SchedStartChange(ev, mode, e) {
//                            if ( this.getEvent(ev).start_date.getTime() >= calendar._max_date  ){
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
                        
                        calendar.eventId.push(calendar.attachEvent("onBeforeEventChanged", function(ev, e, is_new,original) {

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
                                airbus.mes.stationtracker.ModelManager.sendRecalendarequest(false,oFinal,oInitial);
                                return true;
                        }));

                        /**
                         * This event permit to cancel the drag and drop of Initial operation and when
                         * the boxing value selected != operation_Id
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         * @return {boolean} true if not dragable, false to permit drag & drop
                         */

                        calendar.eventId.push(calendar.attachEvent("onBeforeDrag",function blockReadonly(id) {

                        	var that = this;
                        	this.byPassOnDrag = false;
                        	
                        	// permit to dont reschedule
                            if ( bBatch1 ) {
                            	calendar._drag_mode = ""
                                return false;
                            }

                            // cannot reschedule an initial operation                            
                            if (this.getEvent(id).type === "I" ) {

                            	calendar._drag_mode = ""
                                return false;

                                
                            } else if ( airbus.mes.calendar.util.GroupingBoxingManager.box === "OPERATION_ID") {

                            	if (this.getEvent(id)) {

                        		
                            		if (airbus.mes.calendar.util.GroupingBoxingManager.computeStatus(this.getEvent(id).state, this.getEvent(id).paused, this.getEvent(id).previouslyStarted) === "0" ) {
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
                                         calendar._drag_mode = ""
                            			return false;			
                            		} else {
                            			return true;
                            		};
                            	} else {
                                    return true;                            		
                            	}

                            } else {
                            	// cannot reschedule if grouping is not operation	
                            	calendar._drag_mode = ""
                            	return false;
                            }

                        }));

                        /**
                         * ??????????
                         *
                         * @param {oEvent} Object wich represent the event on press from "TeamButton"
                         */

                        calendar.eventId.push(calendar.attachEvent("onBeforeTodayDisplayed", function() {

                            ShiftManager.step = 0;
                            ShiftManager.current_Date = new Date().toISOString().slice(0, 10);
                            ShiftManager.adjustcalendarXStart(new Date());

                            return true;

                        }));

                        /**
                         * Open PolyPoly fragment in affectation mode
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         * @param {OBJECT}    section a data object of the clicked cell
                         * @param {Event} e    a native event object
                         */

                        calendar.eventId.push (calendar.attachEvent("onYScaleClick", function(index, section, e) {

                            if (airbus.mes.stationtracker.AssignmentManager.bOpen && section.children != undefined) {

                                calendar.openSection(section.key);
                                airbus.mes.stationtracker.AssignmentManager.bOpen = false;
                            }

                            if (section.rescheduled && !section.children) {
                                jQuery.sap.registerModulePath("airbus.mes.polypoly","../components/polypoly");
                                airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = true;
                                airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedLine = section;
                                airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift = airbus.mes.calendar.util.ShiftManager.ShiftSelected;

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
                                        if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[section.avlLine][airbus.mes.calendar.util.ShiftManager.ShiftSelected.shiftID]){
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
                         * Permit to replace the default arrow to change the day in calendar change the icon
                         * display on the collapse open folder
                         *
                         */

                        calendar.eventId.push ( calendar.attachEvent("onScaleAdd", function() {
                              /* Delete initial - + to indicate the collapse or expand of folder */
                                    for (var i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
                                        $("div[class='dhx_scell_expand']").eq(i).remove();
                                    }

                                /* Create arrow to change shift/day */
                                    if ($("div[class='dhx_cal_next_button']").length === 0) {
                                        $("div[class='dhx_cal_header']").append(("<div class='dhx_cal_next_button' Style='float:right; width:30px;'></div>"));
                                        $("div[class='dhx_cal_next_button']").tap(function() {
                                            calendar._click.dhx_cal_next_button();
                                            //airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.calendar.util.ShiftManager.current_shift.shiftID);
                                        });
                                    }

                                    if ($("div[class='dhx_cal_prev_button']").length === 0) {
                                        $("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
                                        $("div[class='dhx_cal_prev_button']").tap(function() {
                                            calendar._click.dhx_cal_prev_button();
                                            //airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.calendar.util.ShiftManager.current_shift.shiftID);
                                        });
                                    }

                                    }));

                        /**
                         * Manage the double click on a box it open the recheduling popup dialog
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         */
                        
                        calendar.attachEvent("onBeforeLightbox", function (id){
                            //any custom logic here
                            return true;
                        });

                        calendar.eventId.push( calendar.attachEvent("onBeforeLightbox", function(id) {
                        	// Close default dialog of calendar after double click
                        	calendar._drag_mode = ""
                            return false;

                        }));

                        /**
                         * Manage the simple click it open the operationInfo popup if boxing is
                         * operation otherwise it open worklist dialog
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         */

                        calendar.eventId.push ( calendar.attachEvent("onClick", function(id,e) {
                        		
                             airbus.mes.stationtracker.ModelManager.OpenWorkList(id);
                             calendar._drag_mode = ""
                             return false;

                        }));

                        /************************************************************************/
                        /************************************************************************/
                        /**                                                                    **/
                        /**      DECLARTION OF ALL DHTMLX TEMPLATES (REF TO DHTMLX DOC)        **/
                        /**                                                                    **/
                        /************************************************************************/
                        /************************************************************************/

                        calendar.templates.timeline_scale_label = function(key, label, section) {
                            return airbus.mes.stationtracker.util.Formatter.YdisplayRules(section);
                        };

                        calendar.templates.timeline_scaley_class = function(key, label, section) {
                            if (section.initial != undefined) {
                                return "initial";
                            }

                            if (section.rescheduled != undefined) {
                                return "lineYaxis";
                            }
                        };

                        /*      Custom progress background display  */
                        calendar.templates.event_class = function(start, end, event) {
                            return "grey";
                        };

                        /*      Custom Hour display display  */
                        calendar.templates.timeline_scalex_class = function(date){
                            return "customHour";
                        };

                        calendar.templates.event_bar_text = function(start, end, event) {
                            return airbus.mes.stationtracker.util.Formatter.BoxDisplay(event);
                        };

                        /* custom initial */
                        calendar.templates.timeline_cell_class = function(evs, date, section) {
                            if (section.initial != undefined) {
                                return "initial";
                            }
                            if (section.children != undefined) {
                                return "folderAxisColor";
                            }
                        };
                    },
                });
