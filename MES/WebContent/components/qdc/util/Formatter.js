"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {

   getExclamationIcon:function(oEvt){
	   if(oEvt === "true"){
		 return "sap-icon://warning";
	   }
   }   

};
