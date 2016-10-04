sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("airbus.mes.Component", {

		metadata : {
			manifest : "json",
			includes : [  ]
		},

		init : function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		
		createContent: function(){
			// View on XML
			if (airbus.mes.oView === undefined) {
				
				this.oView = sap.ui.view({
					id : "mesNavView",
					viewName : "airbus.mes.views.App",
					type : "XML",
					height : "100%"

				}).addStyleClass("absolutePosition");

				airbus.mes.oView = this.oView;
				
				return this.oView;
			}
			
		}

	});

});