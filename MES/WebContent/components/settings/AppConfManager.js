"use strict";

jQuery.sap.declare("airbus.mes.settings.AppConfManager")

airbus.mes.settings.AppConfManager =  {
	
	
	oAppConfiguration: undefined,
	
	
	/**************************************************
	 * Load App Configurations Data
	 */
	
	getUrlAppConfig : function() {
		var urlAppConf = airbus.mes.settings.ModelManager.urlModel.getProperty("urlAppConfiguration");
		return urlAppConf;
	},
	
	loadAppConfig: function(){
		jQuery.ajax({
		    type:'post',
		    url: this.getUrlAppConfig(),
		    contentType: 'application/json',
			data: JSON.stringify({ "site": airbus.mes.settings.ModelManager.site, "configurationGroup":"AIRBUS_MES_APP"  }),
		    
		    success: function(data){
		    	airbus.mes.settings.AppConfManager.oAppConfiguration = data;
		    },
		   
		    error: function(error,  jQXHR){
		    	console.log(error);
		    	// Permit to do the check on every component where it use even if we have no response.
		    	airbus.mes.settings.AppConfManager.oAppConfiguration = {};		    	 
		    }
		});
	},
	
	
	/******************************************************
	 * Get the Configuration value
	 */
	getConfiguration: function(pKey) {
		
    	// check if object exist before lopping on.
		if ( airbus.mes.settings.AppConfManager.oAppConfiguration.configarationList != undefined ) {
		
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
		return true
	
		}		
	},
	
}
