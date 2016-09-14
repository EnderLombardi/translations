sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",{
				
					renderer : function(oRm, oControl) {

						oRm.write("<div ");
						oRm.writeControlData(oControl);
						oRm.write(" class='dhx_cal_container'  style='width:100%; height:100%;'>");
						oRm.write("	<div class='dhx_cal_navline'>");
						oRm.write("		<div class='dhx_cal_prev_button'></div>");
						oRm.write("	 	<div class='dhx_cal_next_button'></div>");
						oRm.write("		<div class='dhx_cal_today_button'></div>");
						oRm.write("		<div class='dhx_cal_date'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_header'></div>");
						oRm.write("	<div class='dhx_cal_data'></div>");
						oRm.write("</div>");
						
						
						scheduler.xy.scale_height = 20;
						scheduler.locale.labels.timeline_tab = "Timeline";
						scheduler.locale.labels.section_custom = "Section";
						scheduler.config.xml_date = "config.xml_date";
						scheduler.config.markedCells = 0;
						scheduler.config.mark_now = true;
						scheduler.config.drag_create = false;
						scheduler.config.drag_resize = false;
						scheduler.config.touch = "force";
					 	scheduler.config.details_on_create = false;
						scheduler.config.details_on_dblclick = false;
						scheduler.config.preserve_length = true;
						scheduler.config.dblclick_create = false;
						
						// open worklist poppup when click on box
						clicks=0;
						scheduler.attachEvent("onClick", function(id, e) {
                     	  // alert("lol");
                     /*	   to add check what popup to open worklist / operation Info
                     	   not sure could also be handled in worklist View: to be checked later*/
						clicks++;
						if(clicks===1){
				            timer = setTimeout(function() {
				            	ModelManager.bPopupWorkList = true;
				            	sap.ui.getCore().byId("dhtmlx").getController().openWorklistPopup(id,e,false);
				            	clicks=0;
				            },700);
						}
							return false;
                         });

						// open rechdule poppup when doubleclick on box
						//	if (!scheduler.checkEvent("onDblClick")) {
					scheduler.attachEvent("onDblClick", function(id, e) {
						clearTimeout(timer);
						//sap.ui.getCore().byId("worklistPopup").close();
						sap.ui.getCore().byId("dhtmlx").getController().openReschedule(id, e);
						clicks=0;
						return false;
					});
				},
			});

