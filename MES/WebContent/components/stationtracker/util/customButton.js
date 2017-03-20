"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.util.customButton");

sap.m.Button.extend("airbus.mes.stationtracker.util.customButton", {
	metadata : {
			  
		properties : {
			
			text1 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0'
			},
			text2 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0'
			},
			
			enabled : {
				type : 'boolean',
				group : 'Behavior',
				defaultValue : true
			},
			
		},
	},
	

	renderer : function(oRm,oControl) {
		
		var fEnable = oControl.getEnabled();
		//console.log(fEnable);
		
		oRm.write("<button");
		oRm.writeControlData(oControl);
		if (!fEnable){
			oRm.addClass("disable");			
		}
		oRm.addClass("sapMBtn sapMBtnBase");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<div");
        oRm.addClass("sapMBtnHoverable sapMBtnIconFirst sapMBtnInner sapMBtnText sapMBtnTransparent sapMFocusable customButton");
        oRm.writeClasses();
        oRm.write(">");

		oRm.writeIcon("sap-icon://cause", "customButtonIcon");

        oRm.write("<span");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write(oControl.getText1());
        oRm.write("</span>")

        oRm.write("<span");
        oRm.addClass("circle");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write(oControl.getText2());
        oRm.write("</span>")

        oRm.write("</div>");
        oRm.write("</button>");
	
	}
});
