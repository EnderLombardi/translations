"use strict";

jQuery.sap.declare("airbus.mes.settings.GlobalFunction")
airbus.mes.settings.GlobalFunction = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	
	navigateTo : function(sButtonText,sButtonAction) {
			
		if(airbus.mes.component.settings === undefined) {
			airbus.mes.component.settings = sap.ui.getCore().createComponent({
					name : "airbus.mes.settings", // root component folder is resources
					settings : {
						textButtonTo : sButtonText,
						buttonAction : sButtonAction
					}	
				});	  
			
		} else {	
			airbus.mes.component.settings.setButtonAction(sButtonAction);
		};
		
		nav.addPage(airbus.mes.component.settings.oView);
		nav.to(airbus.mes.component.settings.oView.getId());	
		
	},

     /**
     * Return Rowsets from REST Webservice Data flow
     * 
     * @param {any} RestData 
     * @returns Rowsets
     */
    getRowsetsFromREST: function(RestData){
        var rowsets = {
            "DateCreated" : "",
            "Version" : "",
            "StartDate" : "",
            "EndDate" : "",
            "CachedTime" : "",
            "Rowset" : [],
        };
        
        if( Array.isArray(RestData) && (RestData.length > 0) ) {
            var attributs = Object.keys(RestData[0]);
            rowsets.Rowset.push({"Columns" : { "Column" : [] },
                                 "Row" : []});
            attributs.forEach(function(att){
                rowsets.Rowset[0].Columns.Column.push({
                    "Name" : att,
                    "SourceColumn" : att,
                    "Description" : "",
                    "SQLDataType" : "1",
                    "MinRange" : "1",
                    "MaxRange" : "1",
                });
            });
            RestData.forEach(function(row){
                rowsets.Rowset[0].Row.push(row);
            });
        }
        return { "Rowsets" : rowsets};
    }
}