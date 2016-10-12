"use strict";
 
jQuery.sap.declare("airbus.mes.stationtracker.util.Formatter");

airbus.mes.stationtracker.util.Formatter = {
		
		minSizeMinutes : 30,

		sizeMin : function(sEndDate, sStartDate) {
		
			var oUtil = airbus.mes.stationtracker.util.Formatter;
			var oShiftManager = airbus.mes.stationtracker.ShiftManager;
			var dEndDate = sEndDate;
			var dStartDate = sStartDate;
		
			if (dEndDate - dStartDate < oUtil.minSizeMinutes * 60 * 1000) {
				if (oShiftManager.closestShift(dStartDate) != -1 && dStartDate > oShiftManager.shifts[0].StartDate) {

					dStartDate.setMinutes(dStartDate.getMinutes() + oUtil.minSizeMinutes);

					while (oShiftManager.isDateIgnored(dStartDate)) {

						dStartDate.setMinutes(dStartDate.getMinutes() + oUtil.minSizeMinutes);

					}

					var sDate = Math.max(dEndDate, dStartDate);

					return new Date(sDate);
				}
			}
		
			return sEndDate ;
		
		},	
		
		openFolder :function( bOpen ){
			
			if ( bOpen ) {
				
			return "fa fa-chevron-down custom";
			
			} else  {
				
				return "fa fa-chevron-right custom";
				
			}
			
		},
		
		 spaceInsecable : function(sText){
			 
			    var sTextF="";
			    var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
			 
			    for (var i=0; i < aText.length; i++)
			    {
			    	if ( aText.length - 1=== i ){
			    		
			        sTextF += aText[i];  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
			    	
			    	} else {
			    		
			    		sTextF += aText[i] + "&nbsp;";
			    		
			    	}
			    }
			    
			    return sTextF;
			},
			
			jsDateFromDayTimeStr : function(day) {
				
				// return day for IE not working. - 1 on month because 00 = january
				
				return new Date(day.slice(0,4),day.slice(5,7)-1,day.slice(8,10),day.slice(11,13),day.slice(14,16),day.slice(17,19));
				
			},
			date2Hour : function(day) {
				
				var date = new Date(day)
				return date.toTimeString().split(' ')[0];
				
			},
			progress2status : function(sString) {
				switch (sString){
				case "0" : return "Not started";
				case "100" : return "Finished";
				default : return "In progress";
				};
			},
			progress2percent : function(sString) {
				return sString + "%";
			},
			progress2float : function(sString) {
				return parseFloat(sString);
			},
			progress2string : function(sString) {
				return sString.toString();
			},
			totalDurationToIM : function(sDuration) {
				return ((sDuration * 100 * 0.001)/3600).toFixed(4) + " IM";
			},
			isCheckboxVisible : function(sString) {
				if( airbus.mes.stationtracker.worklistPopover.unPlanned === true ){
					return true;
				} else {
					return false;
				};
			},
			setmodeList : function() {
				if( airbus.mes.stationtracker.worklistPopover.unPlanned === true ){
					return "MultiSelect";
				} else {
					return "None";
				};				
			},
			isDayTimeline : function() {
				if(airbus.mes.stationtracker.ShiftManager.dayDisplay === undefined) {
					return false;
				} else {
					return airbus.mes.stationtracker.ShiftManager.dayDisplay;
				}
		
			},
//			transformRescheduleDate : function(oDate) {
//				var today = oDate;
//				var aDate = [];
//				
//				var sYear = today.getFullYear();
//				var sMounth = today.getMonth() + 1;
//				var sDay = today.getDate();
//				var sSecond =  today.getSeconds();
//				var sMinute =  today.getMinutes();
//				var sHour =  today.getHours();
//			
//				aDate.push(sMounth,sDay,sHour,sMinute,sSecond);
//				aDate.forEach(function(el,indice){
//					if(el<10){aDate[indice] = "0" + el;}
//				})
//						
//				
//					var FullTodayDate = sYear + "-" + aDate[0] + "-" + aDate[1] + " " + aDate[2] + ":" +  aDate[3] + ":" + aDate[4];
//				
//				return FullTodayDate;
//			},
//			

			fullConfirm : function(sText) {

				var html = "";

				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
				+ sText + '</div>';
				//html += '<div  style="width:inherit; height:inherit; position:absolute" >toto</div>';
				html += '<div style="width:100%; height:inherit; background-color:#0085AD ; position:absolute; z-index: 0; left: 0px;"></div>'
		
				return html;

			},
	
			andon : function(sText,sProgress, sTotalDuration) {
				
				var html = "";
				var progress = airbus.mes.stationtracker.util.Formatter.progressDisplayEvent(sProgress);
				var duration = airbus.mes.stationtracker.util.Formatter.progressDisplayEvent(sTotalDuration);


				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
				+ sText + '</div>';
			
				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-right: 5px;line-height: 23px; text-align:right; left: 0px;">' + 
				'<span style="padding-left:4px; line-height: 23px;" > ['+ progress +'/'+ duration +' IM]</span>' +
				'<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i></div>';
				
				
				html += '<div style="width:100%; height:inherit; background-color:#DB5550 ; position:absolute; z-index: 0; left: 0px;"></div>'
		
				return html;

				
			},
			
			blocked : function(sText,sProgress) {
				
				var html = "";

				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
				+ sText + '</div>';
			
				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-right: 5px;line-height: 23px; text-align:right; left: 0px;">' + 
				'<span style="padding-left:4px; line-height: 23px;" >' + sProgress + '%</span>' +
				'<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i></div>';
				
				
				html += '<div style="width:100%; height:inherit; background-color:#FEAF00 ; position:absolute; z-index: 0; left: 0px;"></div>'
		
				return html;
		
			},
	
			partialConf : function(sText,sProgress) {
				var html = "";
				
				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
					+ sText + '</div>';
					
				html += '<div style="width:'+ sProgress
				+ '%; height:inherit; background-color:#7ED320; position:absolute; z-index: 0; left: 0px;">&nbsp;<span  style="width:3px; float:right; background:#417506; height:inherit;" ></span> </div>'
								
				return html;
				
			},
			
			initial : function(sText,sProgress) {
				var html = "";
				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
					+ sText + '</div>';
				html += '<div style="width:'+ sProgress + '%; height:inherit;position:absolute; z-index: 0; left: 0px;"></div>'
				
				return html;
			},
						
			progressDisplayEvent : function(sDuration) {
				return ((sDuration * 100 * 0.001)/3600).toFixed(4);
			},
			
			stationTrackerStation : function(Station) {
				return "Station " + Station;
			},
			stationTrackerMsn : function(Msn) {
				return "MSN " + Msn;
			},
			stationTrackerPlant : function(Plant) {
				return "Plant " + Plant;
			},
			stationTrackerLine : function(Line) {
				return "Line: " + Line;
			},
			titleWorklist : function(workOrder, workOrderDescritpion) {
				return workOrder + " - " + workOrderDescritpion
			},
			displayValueIM : function(operation, operationDescription,	progress, duration) {
				progress = ((progress * 100 * 0.001)/3600).toFixed(4);
				duration = ((duration * 100 * 0.001)/3600).toFixed(4);
				return operation + " - " + operationDescription + ": " + "[" + progress + "/" + duration + " IM]";
			},
			percentValue : function(progress, duration) {

				progress = parseInt(progress);
				duration = parseInt(duration);
				if (!isNaN(parseInt(progress)) || !isNaN(parseInt(duration))) {
					if (duration <= 0) {
						return 0;
					} else {
						return Math.round((progress * 100) / duration);
					}
				} else {

					return 0;
				}
			},

			isGroupingVisible : function() { 

				if (airbus.mes.stationtracker.worklistPopover.OSW) {
					return false;
				} else if(airbus.mes.stationtracker.worklistPopover.unPlanned) {
					return true;
					
				} else {
					return false;
				}				
			},
			setWorkListText : function() {
				if (airbus.mes.stationtracker.worklistPopover.OSW) {
					return "OutStanding Work";
				} else if(airbus.mes.stationtracker.worklistPopover.unPlanned) {
					return "Unplanned Activities";
					
				} else {
					return "Work List";
				}
				
			},

			
			YdisplayRules : function( oSection ) {
			
				if (oSection.initial != undefined ) {

					var html = '<span  style="float: right;margin-right: 5px;" >' + oSection.initial
							+ '</span>'
					return html;

				}

				

				if (oSection.children != undefined) {

					var html = '<div><span id= folder_' +oSection.key
							+ ' class="' + airbus.mes.stationtracker.util.Formatter.openFolder(oSection.open) + '"></span><div title='
							+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(oSection.label) + ' class="ylabelfolder">' + oSection.label
							+ '</div><span id= add_' + oSection.key
							+ ' class="fa fa-user-plus custom" onclick="airbus.mes.stationtracker.AssignmentManager.newLine(\''
							+ oSection.key + '\')"></span></div>';
					return html;

				}
				
				// TODO maybe replace date + name by the Id of the shift?
				var sShiftDate = airbus.mes.stationtracker.ShiftManager.current_shift.day;
				var sShiftName = airbus.mes.stationtracker.ShiftManager.current_shift.shiftName;
				
				if ( airbus.mes.stationtracker.ShiftManager.dayDisplay ) {
						
				var sShiftName = airbus.mes.stationtracker.ShiftManager.ShiftSelected 
									
				}
				
				if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[oSection.avlLine]) {

				if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[oSection.avlLine][sShiftDate]) {
	
					if (airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[oSection.avlLine][sShiftDate][sShiftName]) {
						// See SD there is only one user affected for the couple of shift id + avlLine
						var oCurrentAffectedUser = airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[oSection.avlLine][sShiftDate][sShiftName][0];
						
						if (oSection.name && oSection.subname) {
							var html = '<div><span class="rond" title='	+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(oCurrentAffectedUser.firstName)
									+ ' >'	+ oCurrentAffectedUser.firstName + '</span><span class="ylabel" title='
									+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(oCurrentAffectedUser.firstName) + '>'
									+ oCurrentAffectedUser.lastName	+ '</span><span  style="float: right;margin-right: 5px;" >' + "hrs"
									+ '</span></div>';
							return html;
	
						}
	
					} else {

						var html = '<div><i class="fa fa-plus-circle"  style="float:left; padding-left:4px;" ></i><span class="ylabel">Select operator</span></div>';
						return html;
				
						}
				} else {

					var html = '<div><i class="fa fa-plus-circle"  style="float:left; padding-left:4px;" ></i><span class="ylabel">Select operator</span></div>';
					return html;
			
					}
	
			} else {

				var html = '<div><i class="fa fa-plus-circle"  style="float:left; padding-left:4px;" ></i><span class="ylabel">Select operator</span></div>';
				return html;
		
				}
				
				
			}

};
