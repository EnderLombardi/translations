"use strict";
 
jQuery.sap.declare("airbus.mes.stationtracker.util.Formatter");

airbus.mes.stationtracker.util.Formatter = {
		
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
			isCheckboxVisible : function(sString) {
				if( airbus.mes.stationtracker.worklistPopover.unPlanned === true ){
					return true;
				} else {
					return false;
				};
				
			},
			transformRescheduleDate : function(oDate) {
				var today = oDate;
				var aDate = [];
				
				var sYear = today.getFullYear();
				var sMounth = today.getMonth() + 1;
				var sDay = today.getDate();
				var sSecond =  today.getSeconds();
				var sMinute =  today.getMinutes();
				var sHour =  today.getHours();
			
				aDate.push(sMounth,sDay,sHour,sMinute,sSecond);
				aDate.forEach(function(el,indice){
					if(el<10){aDate[indice] = "0" + el;}
				})
						
				
					var FullTodayDate = sYear + "-" + aDate[0] + "-" + aDate[1] + " " + aDate[2] + ":" +  aDate[3] + ":" + aDate[4];
				
				return FullTodayDate;
			},
			

			fullConfirm : function(sText) {

				var html = "";

				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
				+ sText + '</div>';
				//html += '<div  style="width:inherit; height:inherit; position:absolute" >toto</div>';
				html += '<div style="width:100%; height:inherit; background-color:#0085AD ; position:absolute; z-index: 0; left: 0px;"></div>'
		
				return html;

			},
	
			andon : function(sText,sProgress) {
				
				var html = "";

				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
				+ sText + '</div>';
			
				html += '<div  style="width:inherit; height:inherit; position:absolute; z-index: 1; padding-right: 5px;line-height: 23px; text-align:right; left: 0px;">' + 
				'<span style="padding-left:4px; line-height: 23px;" >' + sProgress + '%</span>' +
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
			
			minSizeMinutes : 30,

			sizeMin : function(sEndDate, sStartDate) {
				
				var dEndDate = ShiftManager.dateFormatter(sEndDate);
				var dStartDate = ShiftManager.dateFormatter(sStartDate);
					

				if (dEndDate - dStartDate < util.Formatter.minSizeMinutes * 60 * 1000) {
					if (ShiftManager.closestShift(dStartDate) != -1 && dStartDate > ShiftManager.shifts[0].getStartDate()) {

						dStartDate.setMinutes(dStartDate.getMinutes() + util.Formatter.minSizeMinutes);

						while (ShiftManager.isDateIgnored(dStartDate)) {

							dStartDate.setMinutes(dStartDate.getMinutes() + util.Formatter.minSizeMinutes);

						}

						var sDate = Math.max(dEndDate, dStartDate);

						return ModelManager.transformRescheduleDate(new Date(sDate), "no");
					}
				}
			
				return sEndDate ;
			
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
				return operation + " - " + operationDescription + ": " + progress + " IM (of " + duration + " IM)";
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
			}			
			
};
