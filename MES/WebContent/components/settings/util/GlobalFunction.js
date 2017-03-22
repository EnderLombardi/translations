"use strict";

jQuery.sap.declare("airbus.mes.settings.util.GlobalFunction")
airbus.mes.settings.util.GlobalFunction = {
	
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
    getRowsetsFromREST: function(RestData, ExcludedFields = []){
        //Create rowset empty instance 
        var rowsets = {
            "DateCreated" : "",
            "Version" : "",
            "StartDate" : "",
            "EndDate" : "",
            "CachedTime" : "",
            "Rowset" : [],
        };
        
        if( Array.isArray(RestData) && (RestData.length > 0) ) {
            var aFields = Object.keys(RestData[0]);
            if (aFields) { 
                //add Rowset sub object instance
                rowsets.Rowset.push({"Columns" : { "Column" : [] },
                                 "Row" : []});
                //Add Column array attribut
                aFields.forEach(function(sField){
                    //Check field to exclude before add to columns array
                    if ( ExcludedFields.indexOf(sField) == -1 ) {
                        rowsets.Rowset[0].Columns.Column.push({
                            "Name" : sField,
                            "SourceColumn" : sField,
                            "Description" : "",
                            "SQLDataType" : "1",
                            "MinRange" : "1",
                            "MaxRange" : "1",
                        });
                    } 
                    
                });

                //Add rows array attribut
                RestData.forEach(function(oRow){
                    //Filtering row attributs not included in columns list
                    var oNewRow = {};
                    var aRowKeys = Object.keys(oRow);
                    var aRowValues = Object.values(oRow);
                    for( var i = 0; i < aRowKeys.length; i++){
                        if(rowsets.Rowset[0].Columns.Column.find(function(e){ 
                            if( e.Name === aRowKeys[i] ){ return true } else {return false}})){
                            oNewRow[aRowKeys[i]] = aRowValues[i];
                        }
                    }
                    //Add New filtered row object
                    rowsets.Rowset[0].Row.push(oNewRow);
                });
            }
        }
        return { "Rowsets" : rowsets};
    }
}