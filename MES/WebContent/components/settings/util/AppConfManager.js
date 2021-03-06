"use strict";

jQuery.sap.declare("airbus.mes.settings.util.AppConfManager")

airbus.mes.settings.util.AppConfManager = {

	oAppConfiguration : undefined,

	/***************************************************************************
	 * Load App Configurations Data
	 */

	getUrlAppConfig : function() {
		var urlAppConf = airbus.mes.settings.util.ModelManager.urlModel
				.getProperty("urlAppConfiguration");
		
		return urlAppConf;
	},

	loadAppConfig : function() {
		jQuery.ajax({
			type : 'post',
			url : this.getUrlAppConfig(),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.util.ModelManager.site,
				"configurationGroup" : "AIRBUS_MES_APP"
			}),

			success : function(data) {
				airbus.mes.settings.util.AppConfManager.oAppConfiguration = data;

				
				if (airbus.mes.settings.util.AppConfManager.oAppConfiguration.configarationList === undefined && airbus.mes.settings.util.AppConfManager != "")
					airbus.mes.settings.util.AppConfManager.oAppConfiguration = JSON.parse(airbus.mes.settings.util.AppConfManager.oAppConfiguration);
				
				
				// enable the button when the asynce request is complete
				if (sap.ui.getCore().byId("idMyprofileSettingButton"))
					sap.ui.getCore().byId("idMyprofileSettingButton").setBusy(
							false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				// Permit to do the check on every component where it use even
				// if we have no response.
				airbus.mes.settings.util.AppConfManager.oAppConfiguration = {};
				// enable the button when the request is complete
				if (sap.ui.getCore().byId("idMyprofileSettingButton"))
					sap.ui.getCore().byId("idMyprofileSettingButton").setBusy(
							false);
			}
		});
	},

	/***************************************************************************
	 * Get the Configuration value
	 */
	getConfiguration : function(pKey, dKey) {

		// check if object exist before lopping on.
		if (airbus.mes.settings.util.AppConfManager.oAppConfiguration.configarationList != undefined) {

			var value = airbus.mes.settings.util.AppConfManager
					._getConfiguration(pKey); // checking with primary key

			return value != null ? value : airbus.mes.settings.util.AppConfManager
					._getConfiguration(dKey); // if value not found return
		} 
	},
	_getConfiguration : function(Key) {

		// check if object exist before lopping on.
		if (airbus.mes.settings.util.AppConfManager.oAppConfiguration.configarationList != undefined) {

			var value = null;

			$.each( airbus.mes.settings.util.AppConfManager.oAppConfiguration.configarationList,
				function(key, row) {
					if (row.key == Key) {
						value = row.value;
						return;
					}
			});

			if (value == "FALSE")
				return false;
			else if (value == "TRUE")
				return true;
			else
				return value;
		}
	}
}
