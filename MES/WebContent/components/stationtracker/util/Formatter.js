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
			BoxDisplay : function( oBox ) {
				
				var html = "";
				
				var sDivForLeftDisplay = '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; line-height: 23px;left: 0px; text-align:left;  overflow: hidden; text-overflow: ellipsis; " >'
				var sDivForRightDisplay = '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; line-height: 23px;left: 0px; text-align:right; " >'
					
					
				var sText = '<span>' + 'TEXXT DE TEST' + '</span>';	
					
				// need one more condition to add OSW
				if ( oBox.routingMaturityAssessment != "---" ) {
					
					var sLeftIcon = '<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i>'
				
				}  
				
					var sLeftIcon = "";
				
				switch (  oBox.status ) {
				case "N":
					var sColorProgress = "";
					break;
				case "C":
					var sColorProgress = '<div style="width:100%; height:inherit; background-color:#0085ad ; position:absolute; z-index: 0;left: 0px;"></div>';
					break;
				case "S":
					var sColorProgress = '<div style="width:'+ oBox.progress + '%; height:inherit; background-color:#84bd00; position:absolute; z-index: 0; left: 0px;"></div>';
					break;
				case "P":
					var sColorProgress = '<div style="width:'+ oBox.progress + '%; height:inherit; background-color:#84bd00; position:absolute; z-index: 0; left: 0px;"></div>';
					break;
				default:
					var sColorProgress = '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-right: 5px;line-height: 23px; left: 0px;"></div>';
					break;;
				}
				
				switch (  oBox.status ) {
				case "P":
					var sRightIcon = '<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i>';
					break;
				case "A":
					var sRightIcon = '<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i>';
					break;
				case "C":
					var sRightIcon = '<i class="fa fa-check-square-o" style="padding-left:4px; line-height: 23px; color:white;" ></i>';
					break;
				
				default:
					var sRightIcon = "";
					break;
				}
				
				
				var sRightText = '<span style="padding-left:4px; line-height: 23px;" > ['+ oBox.progress +'/'+ oBox.totalDuration +' IM]</span>';				
				
				
				html = sDivForLeftDisplay + sText + '</div>' + sColorProgress +  sDivForRightDisplay + sRightText + sRightIcon  + '</div>'; 
				
				return html;
//				var sRightIcon = '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-right: 5px;line-height: 23px; text-align:right; left: 0px;">' + 
//				'<span style="padding-left:4px; line-height: 23px;" > ['+ progress +'/'+ duration +' IM]</span>' +
//				'<i class="fa fa-exclamation-triangle" style="padding-left:4px; line-height: 23px;" ></i></div>';
				
				
				
			},
			
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


				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" ><i class="fa fa-exclamation-triangle" style="padding-right:4px; line-height: 23px;" ></i>' + sText + '</div>';
			
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
					
				html += '<div style="width:'+ sProgress+ '%; height:inherit; background-color:#84bd00; position:absolute; z-index: 0; left: 0px;">&nbsp;<span  style="width:3px; float:right; background:#417506; height:inherit;" ></span> </div>'
								
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
					return true;
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
				
				
			},
			/**
		     * Sort worklist according to business rule.
		     * 
		      * Rule in detail: the operations shall be grouped by WO. These WO groups
		     * shall be sorted using the start date/time of their box in the Gantt, then
		     * using the schedule start date/time and then numerical order, ascending
		     * order. Within one group of operations belonging to the same WO,
		     * operations shall be sorted by ascending operation number.
		     * 
		      * @param oWorkList
		     */
		     sortWorkList : function(oWorkList) {
		           var oWL2 = [];
		           var oWOList = [];
		           var i;

		           // Sort by WO number (to group operations with same WO)
		           // Also group by operation, because the sort order is kept for
		           // operations
		           oWorkList.sort(this.fieldComparator([ 'shopOrder',
		                         'operationID' ]));

		           // Constitute a table of WO groups with operations associated
		           // The group object has template bellow.
		           var currentWO = {
		        		  shopOrder : undefined,
		                  dynamicStartDate : undefined,
		                  scheduledStartDate : undefined,
		                  operationsID : [],
		           };

		           for (i = 0; i < oWorkList.length; i++) {
		                  if (currentWO.shopOrder !== oWorkList[i].shopOrder) {

		                         if (currentWO.operationsID.length > 0) {
		                                oWOList.push(currentWO);
		                         }

		                         currentWO = {
		                        		shopkOrder : oWorkList[i].shopOrder,
		                                startDate : oWorkList[i].startDate,
//		                                scheduledStartDate : oWorkList[i].start,
		                                operationsID : [ oWorkList[i] ],
		                         };

		                  } else {

		                         if (oWorkList[i].startDate < currentWO.startDate) {
		                                currentWO.startDate = oWorkList[i].startDate;
		                         }

//		                         if (oWorkList[i].start < currentWO.scheduledStartDate) {
//		                                currentWO.scheduledStartDate = oWorkList[i].start;
//		                         }

		                         currentWO.operationsID.push(oWorkList[i]);

		                  }
		           }

		           oWOList.push(currentWO);

		           // Sort each groups (Work Orders)
		           // The operations inside each groups should still be in the same order
		           // (ascending order preserved)
		           oWOList.sort(this.fieldComparator([ 'startDate', 'workOrder' ]));

		           // Flatten worklist (take operations of each groups)
		           oWL2 = oWOList.reduce(function(prev, curr) {
		                  return prev.concat(curr.operationsID);
		           }, []);

		           // Keep the index, for stable sorting on WorkList screen (as sorter is
		           // also used for grouping)
		           oWL2.forEach(function(el, i) {
		                  el.index = i;
		           });

		           return oWL2;
		     },

		//////////////////////////////////////

		/**
		     * Returns a comparator function on the provided fields, in the provided
		     * order of priority, to be used for example by an Array.sort() function.
		     * 
		      * @param {Array}
		     *            fields, Array of object
		     * @returns {Function} comparator
		     */
		     fieldComparator : function(fields) {
		           return function(a, b) {
		                  return fields.map(function(o) {
		                         var dir = 1;
		                         if (o[0] === '-') {
		                                dir = -1;
		                                o = o.substring(1);
		                         }
		                         if (a[o] > b[o])
		                                return dir;
		                         if (a[o] < b[o])
		                                return -(dir);
		                         return 0;
		                  }).reduce(function firstNonZeroValue(p, n) {
		                         return p ? p : n;
		                  }, 0);
		           };
		     }
};
