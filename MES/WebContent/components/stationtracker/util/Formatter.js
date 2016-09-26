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
	
};
