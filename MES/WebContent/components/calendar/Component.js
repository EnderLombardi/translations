"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.calendar.util.Formatter");
jQuery.sap.require("airbus.mes.calendar.util.GroupingBoxingManager");
jQuery.sap.require("airbus.mes.calendar.util.ShiftManager");
jQuery.sap.require("airbus.mes.calendar.util.ModelManager");

jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_tooltip");

jQuery.sap.declare("airbus.mes.calendar.Component");

sap.ui.core.UIComponent.extend("airbus.mes.calendar.Component", {

metadata : {
//		manifest: "json",
		properties : {},
	},
	
	
//	init: function() {
//		// set the device model
//		airbus.mes.calendar.ModelManager.init(this);
//		
//	},
	
	
});

airbus.mes.calendar.Component.prototype.createContent = function() {
	
	   airbus.mes.calendar.isDisplay = true;

	    if (airbus.mes.calendar.oView === undefined) {

	    	// View on XML
	        this.oView = sap.ui.view({
	            id : "calendar",
	            viewName : "airbus.mes.calendar.view.calendar",
	            type : "XML",
	        });
	        
	        var i18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleName : "airbus.mes.calendar.i18n.i18n"
	         });
	        this.oView.setModel(i18nModel, "calendarI18n");
	        // Set instant display for busy indicator
	        this.oView.setBusyIndicatorDelay(0);

	    	airbus.mes.calendar.component = this;
	    	airbus.mes.calendar.oView = this.oView;
	    	//Bind directly on the view avoid to set in the model in the core
	    	airbus.mes.calendar.util.ModelManager.init(airbus.mes.calendar.oView);
	    	
	    	window.calendar = Scheduler.getSchedulerInstance();
	        return this.oView;
	    } else {
	        return airbus.mes.calendar.oView;
	    }
};