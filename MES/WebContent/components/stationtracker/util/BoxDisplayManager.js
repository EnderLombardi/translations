"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.util.BoxDisplayManager");
//Stationtracker box display

airbus.mes.stationtracker.util.BoxDisplayManager = {

    //---------------------
	//      LEFT ICON
	//---------------------
		
		    leftTriangleIcon: '<i class="fa fa-exclamation-triangle triangleIcon"></i>',
		    leftTriangleIcon_Dandelion: '<i class="fa fa-exclamation-triangle triangleIcon dandelion"></i>',
		    leftTriangleIcon_Petrol: '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>',
		
		    leftOswIcon: '<i class="fa fa-refresh oswIcon"><b style="padding-left:1px max-width:80px">',
		    leftOswIcon_Dandelion: '<i class="fa fa-refresh oswIcon dandelion"><b style="padding-left:1px">',
		    leftOswIcon_TealBlueWhite: '<i class="fa fa-refresh oswIcon teal-blue white">',
		
		    leftOswIcon_Constructor: function(elt) {
		        return airbus.mes.stationtracker.util.BoxDisplayManager.leftOswIcon + elt + '</b></i>';
		    },
		
		    leftOswIcon_Dandelion_Constructor: function(elt) {
		        return airbus.mes.stationtracker.util.BoxDisplayManager.leftOswIcon_Dandelion + elt + '</b></i>';
		    },
		
		    leftOswIcon_TealBlueWhite_Constructor: function(elt) {
		        return airbus.mes.stationtracker.util.BoxDisplayManager.leftOswIcon_TealBlueWhite + elt + '</b></i>';
		    },

    //---------------------
    //		RIGHT ICON
    //---------------------
		    
		    rightIcon_Constructor: function(fa_status, color) {
		        if (color) {   
		            return '<i class="fa ' + fa_status + ' rightIcon ' + color +'"></i>';
		        } else {
		            return '<i class="fa ' + fa_status + ' rightIcon"></i>';
		        }
		    },

    //---------------------
    //	COLOR PROGRESS
    //---------------------
    
		    colorProgress_OpenBlocked: '<div class="openBlocked"></div>',
		    colorProgress_Escalated: '<div class="openBlockedEscalated"></div>',
		    colorProgress_SolvedBlocked: '<div class="solvedBlocked"></div>',
		    colorProgress_SolvedBlockedExcalated: '<div class="solvedBlockedExcalated"></div>',
		
		    colorProgress_Constructor: function(color, sProgress) {
		        if (sProgress){
		            return '<div class="colorProgress ' + color + '" style="width:' + sProgress + '%"></div>';
		        } else {
		            return '<div class="colorProgress ' + color + '" style="width:100%"></div>';
		        }
		    },

    //---------------------
    //		TEXT
    //---------------------

		    //calculate the width unavailable for the text
		    getWidthUnavailableForText: function(sLeftIcon, sLeftIcon2, sLeftIcon3, sRightIcon) {
		        var widthUnavailableForText = 10;
		
		        //we add the size in px of the several icons to determinate the width used by the icons (and not available for the text)
		        if(sLeftIcon) {
		            widthUnavailableForText += 18;
		        }
		        if(sLeftIcon2) {
		            widthUnavailableForText += 65;
		        }
		        if(sLeftIcon3) {
		            widthUnavailableForText += 65;
		        }
		        if(sRightIcon) {
		            widthUnavailableForText += 18;
		        }
		        return widthUnavailableForText;
		    }
		
                    
};

