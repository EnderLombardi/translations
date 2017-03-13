"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.util.Globals_Functions");

airbus.mes.stationtracker.util.Globals_Functions = {
      
      
      /**
	 * **Synchronous function** 
	 * Return Missing Parts Data 
	 * @param {any} sSite 
	 * @param {any} sSation 
	 * @param {any} sMsn 
	 * @param {string} [sWorkOrder=""] 
	 * @returns 
	 */
	getMissingPartsData : function (sSite, sSation, sMsn ) {
            // Handle URL Model
            var urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.stationtracker.config.url_config");
		var missingPartsData = {};
		//Check for Local call to manage stub data source 
		if (sessionStorage.loginType !== "local") {
			//Remote call to REST Service
			jQuery.ajax({
				type: 'post',
				async: false,
				url: urlModel.getProperty("urlMissingParts"),
				contentType: 'application/json',
				data: JSON.stringify({
				"site": sSite,
				"physicalStation": sSation,
				"msn": sMsn,
				}),
				success: function (data) {
					try {		
							if ( !Array.isArray(data.missingPartList)) {
								
								data.missingPartList = [data.missingPartList];
							} 						
							//Get missing Parts data in Rowsets format from REST data 
							missingPartsData = airbus.mes.settings.GlobalFunction.getRowsetsFromREST(data.missingPartList, 
														     					this.excludedFields);
						
					} catch (error) {
						console.log(error);
					};
				},
				error: function (error, jQXHR) {
					console.log(error);
				}
			});
		} else {
			//Local call to JSON file resource
			jQuery.ajax({
				type: 'GET',
				async: false,
				url: urlModel.getProperty("getMissingParts"),
				contentType: 'application/json',
				data: JSON.stringify({}),
				success: function (data) {
					missingPartsData = data;
				},
				error: function (error, jQXHR) {
					console.log(error);
				}
			});
		}
		return missingPartsData;
	}
};