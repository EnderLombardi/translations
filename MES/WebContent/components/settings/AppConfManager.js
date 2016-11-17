"use strict";

jQuery.sap.declare("airbus.mes.settings.AppConfManager")

airbus.mes.settings.AppConfManager =  {
	
	
	oAppConfiguration: undefined,
	
	
	/**************************************************
	 * Load App Configurations Data
	 */
	
	getUrlAppConfig : function() {
		var urlAppConf = airbus.mes.settings.ModelManager.urlModel
				.getProperty("urlAppConfiguration");
		return urlAppConf;
	},
	
	loadAppConfig: function(){
		jQuery.ajax({
		    type:'post',
		    url: "https://dmiswde0.eu.airbus.corp/airbus-rswebservice/rest/mesAppConfigurationService/getConfiguration?j_user=ng34ed3&j_password=Malice0*",
		    contentType: 'application/json; charset=utf-8',
		    accept: 'application/json',
		    headers: {
			    "Access-Control-Allow-Origin": '*'
		    },
			data: {
		    	"site": airbus.mes.settings.ModelManager.site,
		    	"configurationGroup":"AIRBUS_MES_APP"
		    },
		    
		    success: function(data){
		    	airbus.mes.settings.AppConfManager.oAppConfiguration = data;
		    },
		    
		    error: function(error,  jQXHR){console.log(error)}
		});
	},
	
	
	/******************************************************
	 * Get the Configuration value
	 */
	getConfiguration: function(pKey) {
		
		var value;
		
		$.each(airbus.mes.settings.AppConfManager.oAppConfiguration.configarationList, function(key, row) {
			if(row.key == pKey){
				value = row.value;
				return;
			}

		});
		
		if(value == "FALSE")
			return false;
		else if (value == "TRUE")
			return true;
		else
			return value;
	},
	
}