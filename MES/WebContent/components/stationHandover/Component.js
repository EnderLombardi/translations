"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.stationHandover.util.Formatter");
jQuery.sap.require("airbus.mes.stationHandover.util.ModelManager");
jQuery.sap.require("airbus.mes.stationHandover.util.customIcon");


jQuery.sap.declare("airbus.mes.stationHandover.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationHandover.Component", {

metadata : {
//		manifest: "json",
		properties : {},
	},
	
	
//	init: function() {
//		// set the device model
//		airbus.mes.stationHandover.ModelManager.init(this);
//		
//	},
	
	
});

airbus.mes.stationHandover.Component.prototype.createContent = function() {
	
	   airbus.mes.stationHandover.isDisplay = true;

	    if (airbus.mes.stationHandover.oView === undefined) {

	    	// View on XML
	        this.oView = sap.ui.view({
	            id : "stationHandoverView",
	            viewName : "airbus.mes.stationHandover.view.stationHandover",
	            type : "XML",
	        });
	        
	        var i18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleName : "airbus.mes.stationHandover.i18n.i18n"
	         });
	        this.oView.setModel(i18nModel, "stationHandoverI18n");
	        // Set instant display for busy indicator
	        this.oView.setBusyIndicatorDelay(0);

	    	airbus.mes.stationHandover.component = this;
	    	airbus.mes.stationHandover.oView = this.oView;
	    	//Bind directly on the view avoid to set in the model in the core
	    	airbus.mes.stationHandover.util.ModelManager.init(airbus.mes.stationHandover.oView);
	    	
	        return this.oView;
	    } else {
	        return airbus.mes.stationHandover.oView;
	    }
};