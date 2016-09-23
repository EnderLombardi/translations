sap.ui.core.Control.extend("airbus.mes.stationtracker.DHTMLXScheduler",	{

					renderer : function(oRm, oControl) {
				
						oRm.write("<div ");
						oRm.writeControlData(oControl);
						oRm.write(" class='dhx_cal_container'  style='width:100%; height:71%;'>");
						oRm.write("	<div class='dhx_cal_navline'>");
						oRm.write("		<div class='dhx_cal_prev_button'></div>");
						oRm.write("	 	<div class='dhx_cal_next_button'></div>");
						oRm.write("		<div class='dhx_cal_date' Style='font-weight:bold; text-align:left; padding-left: 1.5%'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_header' Style='text-align:left;'>");
						oRm.write("		<div id='toto'></div>");
						oRm.write("	</div>");
						oRm.write("	<div class='dhx_cal_data'></div>");
						oRm.write("</div>");
					
						//$("div[class='dhx_cal_header']").append( "<p>Test</p>" );
						
						
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
								$("div[class='dhx_scell_expand']")[i].remove();
							}
							
						}));

						scheduler.eventId.push ( scheduler.attachEvent("onClick", function(id, e) {	
							if ( airbus.mes.stationtracker.toto === undefined ) {
								
								airbus.mes.stationtracker.toto = sap.ui.xmlfragment("airbus.mes.stationtracker.schedulerPopover", this);
								airbus.mes.stationtracker.toto.addStyleClass("alignTextLeft");
								
							}
							
							airbus.mes.stationtracker.toto.openBy(e.srcElement);		

						}));
				
					},
									
				});
