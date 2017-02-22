"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {

   getExclamationIcon:function(oEvt){
	   if(oEvt === "true"){
		 return "sap-icon://warning";
	   }
   },
   
   getEnabled: function(){
	   var oVal = airbus.mes.qdc.ModelManager.loadQDCData();
	  if(oVal.Rowsets.Rowset[0].Row.QdcStatus ==="X"){
		  set fso = CreateObject("Scripting.FileSystemObject");  
		    set s = fso.CreateTextFile("C:\test.txt", True);
		    s.writeline("HI");
		    s.writeline("Bye");
		    s.writeline("-----------------------------");
		    s.Close();
	  }
   }

};
