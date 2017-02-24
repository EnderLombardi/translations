"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {

   getExclamationIcon:function(oEvt){
	   if(oEvt === "true"){
		 return "sap-icon://warning";
	   }
   },
   
   getEnabled: function(){
	   var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
	   
	   var obj = oVal.oData.Rowsets.Rowset[1].Row;
	  if(oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS ===""){
		  
		  obj.filter(function (row) {
				  if(row.DOC_TYPE === "MEA"){
					  airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled();
				  }

			  });

		  obj.filter(function (row) {
				  if(row.DOC_TYPE === "PLA"){
					  airbus.mes.qdc.oView.byId("idButtonMAA").setEnabled();
				  }

			  });		  
		  
		  obj.filter(function (row) {
				  if(row.DOC_TYPE === "QDC"){
					  airbus.mes.qdc.oView.byId("idButtonQDC").setEnabled();
				  }

			  });		  
		  
		  
		  
		  
		  
		  
		  
//		 var sDocType = oVal.Rowsets.Rowset[1].Row;
//		 $.each(obj, function(Key, Value){
//			 if(Value.DOC_TYPE==="PLA"){
//				 console.log(Key);
//			 }
//
//		 });
//			var sValue = evt.getParameter("value");
//			var oFilter = new sap.ui.model.Filter("DOC_TYPE", sap.ui.model.FilterOperator.Contains, "PLA");
//			obj.filter([ oFilter ]);
			
//		 for(var i=0;i<obj.length;i++){
//			 if(obj[i].DOC_TYPE === "PLA"){
//				 airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled();
//			 }else if(obj[i].DOC_TYPE === "MAA"){
//				 airbus.mes.qdc.oView.byId("idButtonMAA").setEnabled();
//			 }else if(obj[i].DOC_TYPE === "QDC"){
//				 airbus.mes.qdc.oView.byId("idButtonQDC").setEnabled();
//			 }
//		 }


	  }
   }

};
