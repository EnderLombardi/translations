sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("airbus.mes.worktracker.components.Component", {

		metadata: {
			manifest: "json",
			includes : [ "../css/workTracker.css",
			             "../css/sideNavigation.css",
			             "../util/Formatter.js",
			             "../util/Functions.js",
			             "../util/ModelManager.js"]
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}

	});

});
