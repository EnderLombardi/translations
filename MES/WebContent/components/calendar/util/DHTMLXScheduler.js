"use strict";

sap.ui.core.Control.extend("airbus.mes.calendar.util.DHTMLXScheduler", {

	renderer : function(oRm, oControl) {

		oRm.write("<div ");
		oRm.writeControlData(oControl);
		oRm.write(" class='dhx_cal_container'  style='width:100%; height:calc(100% - 6.6rem);'>");
		oRm.write("    <div class='dhx_cal_navline'style=''>");
		oRm.write("        <div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%;'></div>");
		oRm.write("    </div>");
		oRm.write("    <div class='dhx_cal_header' Style='text-align:left;'>");
		oRm.write("    </div>");
		oRm.write("    <div class='dhx_cal_data'></div>");
		oRm.write("</div>");
	},

	onAfterRendering : function onAfterRendering() {

		calendar.xy.nav_height = 0; //Div height for date
		calendar.xy.scroll_width = 20;
		calendar.xy.bar_height = 30;
		calendar.deleteMarkedTimespan();
		calendar.config.drag_resize = false;
		calendar.locale.labels.timeline_tab = "Timeline";
		calendar.locale.labels.section_custom = "Section";
		calendar.config.xml_date = "%Y-%m-%d %H:%i";
		calendar.config.markedCells = 0;
		calendar.config.mark_now = true;
		calendar.config.drag_create = false;
		// no drag and drop calendar
		calendar.drag_move = false;
		// cant drag & drop verticaly if set to force
		calendar.config.touch = "force";
		calendar.config.details_on_create = false;
		calendar.config.details_on_dblclick = false;
		calendar.config.preserve_length = true;
		calendar.config.dblclick_create = false;
		calendar.eventId = calendar.eventId || [];
		calendar.eventId.forEach(function(el) {
			calendar.detachEvent(el);
		});
		calendar.eventId = [];

		calendar.createTimelineView({
			section_autoheight : false,
			name : "timeline",
			x_unit : "minute",
			x_date : "%H:%i",
			//When coming back from setting permit to display the previous mode shift/day
			x_step : 60,
			x_size : 18,
			x_start : 0,
			//x_length : 18,
			y_unit : [],
			y_property : "section_id",
			render : "tree",
			folder_dy : 25,
			dy : 45,

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

		/**
		 * Permit to replace the default arrow to change the day in calendar change the icon
		 * display on the collapse open folder
		 *
		 */

		calendar.eventId.push(calendar.attachEvent("onScaleAdd", function() {
			/* Delete initial - + to indicate the collapse or expand of folder */
			for (var i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
				$("div[class='dhx_scell_expand']").eq(i).remove();
			}

			/* Create arrow to change shift/day */
			if ($("#calendar--calendar")[0].children[1].children.length <= 2) {
				$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_next_button' Style='float:right; width:30px;'></div>"));
				$("div[class='dhx_cal_next_button']").tap(function() {
					calendar._click.dhx_cal_next_button();
					airbus.mes.calendar.oView.getController().UpdateDateSwipe();
				});
				$("div[class='dhx_cal_header']").append(("<div class='dhx_cal_prev_button' Style='float:right; width:30px;'></div>"));
				$("div[class='dhx_cal_prev_button']").tap(function() {
					calendar._click.dhx_cal_prev_button();
					airbus.mes.calendar.oView.getController().UpdateDateSwipe();
				});

			}

		}));

		/**
		 * Manage the double click on a box it open the recheduling popup dialog
		 *
		 * @param {STRING} id, the Id of the box selected in gantt
		 */
		calendar.eventId.push(calendar.attachEvent("onBeforeLightbox", function(id) {
			// Close default dialog of calendar after double click
			calendar._drag_mode = ""
			return false;

		}));
		/**
		 * Dismiss drag & drop
		 */
		calendar.eventId.push(calendar.attachEvent("onBeforeDrag", function(id, mode, e) {
			return false;
		}));
		/**
		 * Manage the simple click it open the operationInfo popup if boxing is
		 * operation otherwise it open worklist dialog
		 *
		 * @param {STRING} id, the Id of the box selected in gantt
		 */

		//                        calendar.eventId.push ( calendar.attachEvent("onClick", function(id,e) {
		//                        	
		//
		//                        }));
		/************************************************************************/
		/************************************************************************/
		/**                                                                    **/
		/**      DECLARTION OF ALL DHTMLX TEMPLATES (REF TO DHTMLX DOC)        **/
		/**                                                                    **/
		/************************************************************************/
		/************************************************************************/
		//Custom display of Y axis
		calendar.templates.timeline_scale_label = function(key, label, section) {
			return airbus.mes.calendar.util.Formatter.YdisplayRules(section);
		};

		/*      Custom progress background display  */
		calendar.templates.event_class = function(start, end, event) {

			if (event.validated === "true") {
				// absence validated
				return "grey";
			} else {
				// absence pending
				return "black";
			}
			return "";
		};
		
		calendar.templates.event_bar_text = function (start, end, event) {
			
			if ( event.total != undefined ) {
				
            return airbus.mes.calendar.util.BoxDisplayManager.totalConstructor(event);
            
			}
			return "";			
        };
		

		/*      Custom Hour display display  */
		calendar.templates.timeline_scalex_class = function(date) {
			if (airbus.mes.calendar.util.ShiftManager.taktDisplay) {
				
				var sTime = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd) - airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktStart);
				   
		        // Takt is over one day
		        if ( Math.abs(sTime) > 86400000 ) {
					return "customTakt";        		
		        } else {
					return "customHour";
		        }
			} else {
				return "customHour";
			}
		};

	},
});
