"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.calendar.util.Formatter");

airbus.mes.calendar.util.Formatter = {
		
		dateToStringFormat : function(sDate){
		    // Date send by MII are UTC date
			var oDate = new Date(sDate);
			var oFormat = sap.ui.core.format.DateFormat.getInstance({
				UTC : true,
				pattern : "dd MMM - HH:mm",
				calendarType : sap.ui.core.CalendarType.Gregorian
			});
			return oFormat.format(oDate)
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
			 
			    for (var i=0; i < aText.length; i++) {
			    if ( aText.length - 1=== i ) {
			        sTextF += aText[i];  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
			    } else {
			    sTextF += aText[i] + "&nbsp;";
			    }
			    }
			    
			    return sTextF;
			},
			
			jsDateFromDayTimeStr : function(day) {
				
			// return day for IE not working. - 1 on month because 00 = january
				if ( day != undefined ){
					return new Date(day.slice(0,4),day.slice(5,7)-1,day.slice(8,10),day.slice(11,13),day.slice(14,16),day.slice(17,19));
				} else {
				return new Date();
				}
				
			},
		
			/*----------------------------------------------------------------------------
		     * Permit to display the different case of rendering of box in scheduler : 
		     * See sd for different cases
		     * 
		     * @param {oBox} Object wich represent the current event in scheduler
		     * @return {STRING} html the html wich will apply
		     ----------------------------------------------------------------------------*/
//			BoxDisplay : function( oBox ) {
//				
//				// global name
//				var sOSW = airbus.mes.calendar.util.oView.getModel("StationTrackerI18n").getProperty("Osw");
//				var sUNPD = airbus.mes.calendar.util.oView.getModel("StationTrackerI18n").getProperty("Unplanned");
//				
//				var html = "";
//	
//				validated
//				
//				
//				if ( oBox.type === "I" ) {				
//					trackerTextClass = ""
//					html = sDivForLeftDisplayInitial + sLeftIcon + sRightIcon + sLeftIcon2 + sLeftIcon3+ sSpanText + sColorProgress + '</div>' ;	
//				} else {
//					html = sDivForLeftDisplay + sLeftIcon + sRightIcon + sLeftIcon2 + sLeftIcon3 + sSpanText + sColorProgress + '</div>' ;
//				}
//				html += '<span class="trackerBoxtooltiptext">'+ sSpanText +'</span>' ;		
//				return html;
//			},
			/*----------------------------------------------------------------------------
			     * Permit to display the different case to the left y-axis of scheduler
			     * display the case of user affected 
			     * no user affected
			     * folder row.
			     * 
			     * @param {oSection} Object wich represent the current Row
			----------------------------------------------------------------------------*/
			YdisplayRules : function ( oSection ) {
				var html = "";
			
				//** folder row **/
				if (oSection.children != undefined) {

					html = '<div><span id= folder_' +oSection.key
							+ ' class="' + airbus.mes.calendar.util.Formatter.openFolder(oSection.open) + '"></span><div title='
							+ airbus.mes.calendar.util.Formatter.spaceInsecable(oSection.label) + ' class="ylabelfolder">' + oSection.label
							+ '</div></div>';
					return html;
				}
				if ( oSection.key != "total1") {
					//Creation of Div of picture display
					if(airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY")){ // Check if user image to be displayed  or not
						
						var imgId = oSection.avlLine + oSection.ng;
						
						html += '<img  onerror = "airbus.mes.shell.UserImageManager.getErrorUserImage(this)" id="' + imgId +'" src=' + airbus.mes.shell.UserImageManager.getUserImage(imgId, oSection.ng) + ' class="ylabelUserImage"/>'		// To display User Image
					}						
					//Creation Span of name display
						html +=  '<span class="ylabelUser" title=' + airbus.mes.calendar.util.Formatter.spaceInsecable(oSection.firstName + " " + oSection.lastName) + '>'
	                    + oSection.firstName + " " + oSection.lastName + '</span>';
	
					return html + '</div>';
				
				}				

				return "<div></div>";					
			},
			  /***************************************************************************s
		     * Replace space in string by "_"
		     * 
		     * @param {sText} String,string to parse
		     ****************************************************************************/
			 idName : function(sText){
				 
				 var sTextF="";
				 var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
				 
				 for (var i=0; i < aText.length; i++) {
					 if ( aText.length - 1=== i ){
						 sTextF += aText[i];  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
						 } else {
							 sTextF += aText[i] + "_";
						}
				    }
				    
				    return sTextF;
				},
	                
};

