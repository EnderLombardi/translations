"use strict";

jQuery.sap.declare("airbus.mes.stationHandover.util.customIcon");

sap.ui.core.Control.extend("airbus.mes.stationHandover.util.customIcon", {
	metadata : {
			  
		properties : {
			
			color : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0'
			}
			
		}
	},

	renderer : function(r, c) {
		
		var sColor = c.getColor();
			
		r.write('<I');
				r.writeControlData(c);
				r.addClass('fa fa-exclamation-triangle fa-exclamation-triangle-triangle');
				r.addStyle('color', "blue");
				r.writeStyles();
				r.writeClasses();
				r.write('/I>');
	
	
	}
});
