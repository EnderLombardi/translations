"use strict";
//jQuery.sap.require("airbus.mes.operationDetail.Control.PhysicalStation.css");
sap.ui.core.Control.extend(
		"customtable.PhysicalStation.control.PhysicalStationBox", {
            metadata : {
                properties : {                                              
                       "station" : "",
                       "msn" : "",
                },
                
   defaultAggregation : 'actionIconButton',
                
   aggregations:{
	   actionIconButton :  {type : "sap.ui.core.Control", multiple: false, singularName : 'actionIconButton'},
	   detailIconButton :  {type : "sap.ui.core.Control", multiple: false, singularName : 'detailIconButton'},
	   image            :  {type : "sap.m.Image", multiple: false, singularName : 'image'},
   },
   
   events : {
		press : {
			parameters : {
				value : {type : "int"}
			}
          
   } },
            },
   renderer : function(oRm, oControl) {
   
	  /* var image =  oControl.getImage();*/
	   var msn = oControl.getMsn();
	   oRm.write("<div");
	   oRm.writeControlData(oControl);
	   //oRm.addStyle("background-color", oControl.getColor());
	  // oRm.writeStyles();
	   oRm.addClass("ParentDiv")
	   oRm.writeClasses();
	   oRm.write(">");
	   
	   oRm.write("<div");
	   oRm.addClass("ActionDiv");
	   oRm.writeClasses();
	   oRm.write(">");
	   
	   oRm.renderControl(oControl.getAggregation("actionIconButton"));
	   oRm.write("</div>");
	   
	   oRm.write("<div");
	   oRm.addClass("labelDiv");
	   oRm.writeClasses();
	   oRm.write(">");
	   
	   oRm.write("<div>");
	   oRm.write("<label");
	   oRm.addClass("StationLabel");
	   oRm.writeClasses();
	   var html = ">" + oControl.getStation() + "</label>" + "</div>";
	   oRm.write(html);
	   if(msn){
		   
		   oRm.write("<div");
		   oRm.write(">");
		   
		   oRm.write("<label");
		   oRm.addClass("MSNlabel");
		   oRm.writeClasses();
		   var html = ">" + msn + "</label>" + "</div>" ;
		   oRm.write(html);
	   }	   
	   oRm.write("</div>");
	   oRm.write("<div");
	   oRm.addClass("blankDiv");
	   oRm.writeClasses();
	   oRm.write("></div>");
	   
	   oRm.write("<div");
	   oRm.addClass("imageDiv");
	   oRm.writeClasses();
	   oRm.write(">");
	   
	   oRm.renderControl(oControl.getAggregation("image"));
	   oRm.write("</div>");
	   
	   oRm.write("<div");
	   oRm.addClass("detailDiv");
	   oRm.writeClasses();
	   oRm.write(">");
	   
	   oRm.renderControl(oControl.getAggregation("detailIconButton"));
	   oRm.write("</div> </div>");
   }
             } );