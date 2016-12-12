"use strict";

sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",    {

//                    Define if it is a simple click or a double click. Used on event onDblClick and onClick
                    byPassOnClick: "boolean",

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
                            x_step : 30,
                            x_size : 18,
                            x_start : 0,
                            //x_length : 18,
                            y_unit:    [],
                            y_property:    "section_id",
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

                        /***************************************************************************
                         * ??????????
                         *
                         * @param {oEvent} Object wich represent the event on press from "TeamButton"
                         ****************************************************************************/

                        scheduler.eventId.push(scheduler.attachEvent("onBeforeEventChanged", function(ev, e, is_new,original) {

                            if (is_new) {
                                return false;
                            }

                            if (ev.section_id.slice(0, 2) === "I_") {
                                return false;
                            }
                            //
                            return true;

                        }));


//                if (!scheduler.checkEvent("onBeforeEventChanged")) {
//                        scheduler.eventId.push(scheduler.attachEvent("onBeforeEventChanged",
//
//                                function blockSectionChange(ev, e, is_new, original) {
//
//                                    ShiftManager.step = 1;
//
//                                    if (is_new) {
//                                        return false;
//                                    }
//                                    // to save the old start date to send to
//                                    // service.
//                                    //ModelManager.sOldStartDate = original.start_date.toISOString().slice(0, 16);
//                                    // any custom logic here
//                                    if (original.section_id === ev.section_id && !ShiftManager.isDateIgnored(ev.start_date)
//                                            && !ShiftManager.isDateIgnored(ev.end_date)) {
//                                        return true;
//                                    } else {
//
//                                        delete ev._move_delta
//
<<<<<<< refs/remotes/origin/MESv1.0.2
//                            //We check only the first start date because the duration of the operation cannot changed
//                            if( oInitial.start_date === oFinal.start_date ) {
//                            //date aren't change , nothing to do
//                                return true;
//                            } else {
//                                //Store oFinal and oInitial value in case of check qa is not successfull
//                                airbus.mes.stationtracker.oFinal = oFinal;
//                                airbus.mes.stationtracker.oInitial = oInitial;
//                                airbus.mes.stationtracker.ModelManager.sendRescheduleRequest(false,oFinal,oInitial);
//                            }
                            return false
                            console.log("end of drag");

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
//                                    airbus.mes.polypoly.ModelManager.getPolyPolyModel("CHES", "1L"); //FIXME When Settings ready
                                    airbus.mes.polypoly.ModelManager.getPolyPolyModel(airbus.mes.stationtracker.ModelManager.settings.site, airbus.mes.stationtracker.ModelManager.settings.station);
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
                                    airbus.mes.stationtracker.oPopoverPolypoly.open();
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
                                            airbus.mes.stationtracker.ShiftManager.selectFirstShift = true;
                                            airbus.mes.stationtracker.ModelManager.selectMyShift();
                                        });
                                    }

                                    if ($("div[class='dhx_cal_prev_button']").length === 0) {
                                        $("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
                                        $("div[class='dhx_cal_prev_button']").click(function() {
                                            scheduler._click.dhx_cal_prev_button();
                                            airbus.mes.stationtracker.ShiftManager.selectFirstShift = true;
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

//                              Need to define a time out to differenciate simple click and double click
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

//                              Reinitiate the bypass variable
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
=======
//                                        return false;
//                                    }
//                                    // false cancels the operation
//                                }));

                        /**
                         * This event permit to cancel the drag and drop of Initial operation and when
                         * the boxing value selected != operation_Id
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         * @return {boolean} true if not dragable, false to permit drag & drop
                         */

                        scheduler.eventId.push(scheduler.attachEvent("onBeforeDrag",function blockReadonly(id) {

                            //use it to get the object of the dragged event
                            scheduler.InitialPosition = {
                                    "start_date" : scheduler.getEvent(id).start_date,
                                    "skill" : scheduler.getEvent(id).avlLine.split("_")[1],
                                    "avlLine" : scheduler.getEvent(id).avlLine.split("_")[0],
                                    "sSfcStep" :  scheduler.getEvent(id).sSfcStep,
                                    "ProdGroup" : scheduler.getEvent(id).ProdGroup,
                            }

                            if (bBatch1 = true) {
                                return false;
                            }

//                            if (this.getEvent(id).type === "I" ) {
//
//                                return false;
//
//                            } else if ( airbus.mes.stationtracker.GroupingBoxingManager.box === "OPERATION_ID") {
//
//                                return true;
//                            } else {
//
//                                return false;
//                            }

                        }));

                        /**
                         * After drag & drop check the initial Date and compare with the new date if
                         * it is different it call the rescheduling request to MII
                         *
                         * @param {STRING} id, the Id of the box selected in gantt
                         */

                        scheduler.eventId.push(scheduler.attachEvent("onDragEnd", function rescheduling(id, mode, e){
//                            //Filled on event onBeforeDrag
//                            var oInitial = scheduler.InitialPosition;
//                            var oFinal = scheduler.getEvent(id);
//
//                            //We check only the first start date because the duration of the operation cannot changed
//                            if( oInitial.start_date === oFinal.start_date ) {
//                            //date aren't change , nothing to do
//                                return true;
//                            } else {
//                                //Store oFinal and oInitial value in case of check qa is not successfull
//                                airbus.mes.stationtracker.oFinal = oFinal;
//                                airbus.mes.stationtracker.oInitial = oInitial;
//                                airbus.mes.stationtracker.ModelManager.sendRescheduleRequest(false,oFinal,oInitial);
//                            }
                            return false
                            console.log("end of drag");

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
//                                    airbus.mes.polypoly.ModelManager.getPolyPolyModel("CHES", "1L"); //FIXME When Settings ready
                                    airbus.mes.polypoly.ModelManager.getPolyPolyModel(airbus.mes.stationtracker.ModelManager.settings.site, airbus.mes.stationtracker.ModelManager.settings.station);
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
                                    airbus.mes.stationtracker.oPopoverPolypoly.open();
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

//                              Need to define a time out to differenciate simple click and double click
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

//                              Reinitiate the bypass variable
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
>>>>>>> [batch1 - batch2 button] hide
