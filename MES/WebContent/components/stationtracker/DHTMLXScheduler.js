sap.ui.core.Control.extend(
				"airbus.mes.stationtracker.DHTMLXScheduler",
				{

					renderer : function(oRm, oControl) {
						if( airbus.mes.stationtracker.test != undefined ) {
																	
						oRm.write("<div ");
						oRm.writeControlData(oControl);
						oRm.write(" class='dhx_cal_container'  style='width:100%; height:900px;'>");
						oRm.write("	<div class='dhx_cal_navline'>");
						oRm.write("		<div class='dhx_cal_prev_button'></div>");
						oRm.write("	 	<div class='dhx_cal_next_button'></div>");
						oRm.write("		<div class='dhx_cal_today_button'></div>");
						oRm.write("		<div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_header' Style='text-align:left;'></div>");
						oRm.write("	<div class='dhx_cal_data'></div>");
						oRm.write("</div>");

						scheduler.xy.scale_height = 20;
						scheduler.deleteMarkedTimespan();
						scheduler.config.drag_resize = false;
						scheduler.xy.bar_height = 30;
						scheduler.locale.labels.timeline_tab = "Timeline";
						scheduler.locale.labels.section_custom="Section";
			 		    scheduler.config.details_on_create=true;
						scheduler.config.details_on_dblclick=true;
						scheduler.config.xml_date='%H %i';
				    
							scheduler.createTimelineView({
								section_autoheight: false,
								name:	"timeline",
								x_unit:	"minute",
								x_date:	"%d/%m/%Y",
								x_step:	120,
								x_size: 6,
								x_start: 3,
								x_length:	12,
								y_unit:	[],
								y_property:	"section_id",
								render:"tree",
								folder_dy: 50,
								dy: 30,
								
							});
						
						
						/* 	Custom Y group display */

						scheduler.templates.timeline_scale_label = function(key, label, section) {

							if (section.name && section.subname) {
								var html = '<div><span class="rond" title=' + sap.ui.getCore().byId("stationTrackerView").getController().spaceInsecable(section.name) + ' >'
										+ section.subname + '</span><span class="ylabel" title='
										+ sap.ui.getCore().byId("stationTrackerView").getController().spaceInsecable(section.name) + '>' + section.name
										+ '</span><span  style="float: right;margin-right: 5px;" >' + section.hours
										+ '</span></div>';
								return html;

							}

							if (section.initial != undefined && airbus.mes.stationtracker.AssignmentManager.bInitial) {

								var html = '<span  style="float: right;margin-right: 5px;" >' + section.initial
										+ '</span>'
								return html;

							}

							if (section.newop != undefined) {

								var html = '<div><i class="fa fa-plus-circle"  style="float:left; padding-left:4px;" ></i><span class="ylabel">Select operator</span></div>';
								return html;

							}

							if (section.children != undefined) {

								var html = '<div><span id= folder_' + section.key
										+ ' class="fa fa-chevron-down custom" ></span><div title='
										+ sap.ui.getCore().byId("stationTrackerView").getController().spaceInsecable(section.label) + ' class="ylabelfolder">' + section.label
										+ '</div><span class="fa fa-user-plus custom" onclick="airbus.mes.stationtracker.AssignmentManager.newLine('
										+ section.key + ')" ></span></div>';
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

						/* 	 Custom progress display  */

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

						scheduler.templates.event_bar_text = function(start, end, event) {

							var html = "";

							html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
									+ event.text + '</div>';
							html += '<div  style="width:inherit; height:inherit; position:absolute" ></div>';

							if (event.progress != undefined && event.type === "R") {
								html += '<div style="width:'
										+ event.progress
										+ '%; height:inherit; background-color:#7ED320; position:absolute; z-index: 0; left: 0px;">&nbsp;<span  style="width:3px; float:right; background:#417506; height:inherit;" ></span> </div>'
							}

							return html;

						}

						/* custom initial */

						scheduler.templates.timeline_cell_class = function(evs, date, section) {
							if (section.initial != undefined) {

								return "initial";

							}
							if (section.label != undefined) {

								return "white";

							}
						};

						scheduler.attachEvent("onScaleAdd", function() {
							for (i = 0; i < $("div[class='dhx_scell_expand']").length; i++) {
								$("div[class='dhx_scell_expand']")[i].remove();
							}

						});

						scheduler.attachEvent("onAfterFolderToggle", function(section, isOpen, allSections) {
							if (isOpen) {

								$('#folder_' + section.key).removeClass();
								$('#folder_' + section.key).addClass("fa fa-chevron-down custom");

							} else {

								$('#folder_' + section.key).removeClass();
								$('#folder_' + section.key).addClass("fa fa-chevron-right custom");

							}

						});

						scheduler.attachEvent("onClick", function(id, e) {

							new sap.m.Popover({
								placement : "Bottom",
							}).openBy(e.srcElement);
						});
						} else {
							
							airbus.mes.stationtracker.test = 1 ;
						}
					},
					
				});
