"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.util.customProgressIndicator");
jQuery.sap.require("airbus.mes.stationtracker.util.BoxDisplayManager");

sap.ui.core.Control.extend("airbus.mes.stationtracker.util.customProgressIndicator", {
	metadata : {
		  events: {
              "click" : {}  // this Button has also a "hover" event, in addition to "press" of the normal Button
          },
          
      onclick : function(evt) {   
			     this.fireClick();
			  },
			  
		properties : {
			visible : {
				type : 'boolean',
				group : 'Behavior',
				defaultValue : true
			},
			enabled : {
				type : 'boolean',
				group : 'Behavior',
				defaultValue : true
			},
			state : {
				type : 'sap.ui.core.ValueState',
				group : 'Appearance',
				defaultValue : sap.ui.core.ValueState.None
			},
			displayValue : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0%'
			},
			displayValue2 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},			
			percentValue : {
				type : 'float',
				group : 'Data',
				defaultValue : 0
			},
			showValue : {
				type : 'boolean',
				group : 'Appearance',
				defaultValue : true
			},
			width : {
				type : 'sap.ui.core.CSSSize',
				group : 'Dimension',
				defaultValue : 'auto'
			},
			height : {
				type : 'sap.ui.core.CSSSize',
				group : 'Dimension',
				defaultValue : null
			},
			status : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			disruption : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			paused : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			osw : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			progress : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			rmastatus: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			skill: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			unplanned: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			prevstarted: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			stop: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			blockingDisruption: {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			}
			
		}			  
	},

	onclick : function() {   // is called when the Button is hovered - no event registration required
        this.fireClick();
    },
 
	renderer : function(r, c) {
		
		// global name 
		var sOSW = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Osw");
		var sUNPD = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Unplanned");
		
		
		if (!c.getVisible()) {
			return;
		}
		
		var sBlockingDisruption = c.getBlockingDisruption();
		var sStop = c.getStop();
		var PercValue = c.getPercentValue();
		var Status = c.getStatus();
		var sUnplanned = c.getUnplanned();
		var DisruptionStatus = c.getDisruption();
		var DispValue = c.getDisplayValue();
		var DispValue2 = c.getDisplayValue2();
		var ShowValue = c.getShowValue();
		var paused = c.getPaused();
		var rmastatus = c.getRmastatus();
		var prevstarted = c.getPrevstarted();
		var osw = c.getOsw();
		var W = c.getWidth();
		var H = c.getHeight();
		var sRightIcon = "";	
		var sLeftIcon = "";
		var sLeftIcon2 = "";
		var sLeftIcon3 = "";
		var boxDisplayManager = airbus.mes.stationtracker.util.BoxDisplayManager;
		
		//Stop icon
		if (sStop === "1" || sStop === "true") {
			var dispatch = true;
		} else {
			var dispatch = false;			
		};
		
		//Stop Icon for disurption
		if (sBlockingDisruption === "1" || sBlockingDisruption === "true") {
			var fBlockingDisruption = true;
		} else {
			var fBlockingDisruption = false;			
		};
		
		var dispatchWhite = false;
		
		r.write('<div');
				r.writeControlData(c);
				r.addClass('sapMPI');
				r.addClass('sapMPIBarGrey');
				r.addStyle('width', W);
				
				if (H) {
					r.addStyle('height', H);
				}
				
				r.writeStyles();
				r.writeClasses();
				r.write('>');
				r.write('<div');
						r.addClass('sapMPIBar');
										
						// condition design for worklist pop up
						if ( rmastatus === "1" ){	//rma
							sLeftIcon = boxDisplayManager.leftTriangleIcon;
						}
						if (osw[0] === "3" ){ //OSW
							sLeftIcon2 = boxDisplayManager.leftOswIcon_Constructor(sOSW);
						}
						
						// Operation is active	
						
				//------------------------------------------						
				// condition design for worklist pop up
				//------------------------------------------
				
				
						
				switch ( paused ) {
					case "false" :
					// Operation is active sStatus = "2";
							sRightIcon = boxDisplayManager.rightPlay;
							if ( DisruptionStatus === "D2" || DisruptionStatus === "D4") {
								sRightIcon = boxDisplayManager.rightPlay_Petrol;
							}
							r.addClass('sapMPIBarGreen');
							r.writeClasses();
							r.writeAttribute('style', 'width:' + PercValue + '%');
					break;
					case "---" :
							//// Operation is not started sStatus = "1"
							if ( paused === "---" && prevstarted === "false" && Status != "C" ){
								// if operation is not started and has disruption it should be show in yellow
								if ( DisruptionStatus === "D5" || DisruptionStatus === "D4" || DisruptionStatus === "D1" || DisruptionStatus === "D3") {
									DisruptionStatus = "D2";						
								}
							}
							//Operation is pause sStatus = "3"
							if ( paused === "---" && prevstarted === "true" && Status != "C" ) {
								sRightIcon = boxDisplayManager.rightPaused;
								if ( DisruptionStatus === "D2" || DisruptionStatus === "D4") {
									sRightIcon = boxDisplayManager.rightPaused_Petrol;
								}
								r.addClass('sapMPIBarGreen');
								r.writeClasses();
								r.writeAttribute('style', 'width:' + PercValue + '%');
							}	
					break;
					default :
				}
				
				//rma
				if ( rmastatus === "1" ){	
					sLeftIcon =  boxDisplayManager.leftTriangleIcon_Dandelion;
				}
				//OSW
				if (osw[0] === "3" || airbus.mes.stationtracker.CheckQa === "OSW"){ 
					sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
				} 
				//unplanned
				if (osw[0] === "1"  || sUnplanned === "1" ){
					sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
				} 
				 //{ if it's not unplanned it's osw because this code is only used for osw and unplanned pop-up
				//	sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
				//}
								
				switch ( DisruptionStatus ) {		
					case "D2" :
						//Open disruption yellow( Status === "D2") sStatus = "7"; #fbec00
							r.addStyle('background-color','#fbec00');
							r.addStyle('color','rgba(0, 86, 112, 0.94)');
							
							if ( rmastatus === "1" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
						
					break;
					case "D1" :
						//Opened disruption Escalated red ( Status === "D1") sStatus = "8";
							r.addStyle('background-color','#e4002b');
							
							if ( rmastatus === "1" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
							
							if (dispatch || fBlockingDisruption) {

								dispatchWhite = true;
							} 
					break;
					case "D4" :
					//Answered yellow hatch ( Status === "D4") sStatus = "5";
							r.addStyle('background', 'repeating-linear-gradient(135deg, #ffbf00, #ffbf00 10px, #fbec00 10px, #fbec00 20px)');
							
							if ( rmastatus === "1" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
							
					
					break;
					case "D3" :
					//Answered Escalated red Hatch ( Status === "D3") sStatus = "6";
							r.addStyle('background', 'repeating-linear-gradient(135deg, #e4002b, #e4002b 10px, #9e001e 10px, #9e001e 20px)');
							
							if ( rmastatus === "1" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
							
							if (dispatch || fBlockingDisruption) {

								dispatchWhite = true;
							} 
					break;
					case "D5" :
						//All disruptions are solved green hatch ( Status === "D5") sStatus = "4";
								r.addStyle('background', 'repeating-linear-gradient(135deg, #37b36c, #37b36c 10px, #16dc6b 10px, #16dc6b 20px)');
								
								if ( rmastatus === "1" ){	//rma
									sLeftIcon = boxDisplayManager.leftTriangleIcon;
								}
								if (osw[0] === "3" ){ //OSW
									sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
								}
								if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
									sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
								}
								
								if (dispatch || fBlockingDisruption) {

									dispatchWhite = true;
								} 
						break;
					default:		
				}
					
				// Operation Completed
				if (Status === "C") {
					
					r.addStyle('background-color','#0085ad');
					PercValue = 0;
					sRightIcon = boxDisplayManager.rightCheck;
					
					if ( rmastatus === "1" && DisruptionStatus != "D4" ){	//rma
						sLeftIcon = boxDisplayManager.leftTriangleIcon;
					}
					if (osw[0] === "3" ){ //OSW
						sLeftIcon2 = boxDisplayManager.rightOswIcon_TealBlueWhite_Constructor(sOSW);
					}
					if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
						sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
					}
					
				}
				
				
				if (dispatch) {
					if (dispatchWhite){
						sLeftIcon = boxDisplayManager.leftStopIcon_White;
					}
					else {
						sLeftIcon = boxDisplayManager.leftStopIcon;
					}
				}
				
				if (fBlockingDisruption) {
					if (dispatchWhite){
						sRightIcon = boxDisplayManager.rightStopWhite;
					}
					else {
						sRightIcon = boxDisplayManager.rightStop;
					}
				}
				//------------------------------------------------------------

				r.write('>');
				r.write('</div>');
				r.write('<div');
						r.addClass('sapMPIBar');
						r.writeClasses();
						r.writeAttribute('style', 'width:' + (100-PercValue) + '%; float:left;');
						r.write('>');
				r.write('</div>');
		
				if (ShowValue) {
					if (DispValue2 == '') {
						r.write("<span class='sapMPIText2'");
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue);
						r.write("</span>");
					} else {
						r.write("<span class='sapMPIText1'");
								r.addStyle('width', W);
								if ( DisruptionStatus === "D2" || DisruptionStatus === "D4") {
									r.addStyle('color','rgba(0, 86, 112, 0.94)');
								}
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue);
						r.write("</span>");
						r.write("<span class='sapMPIText2'");
								r.addStyle('width', W);
								if ( DisruptionStatus === "D2" || DisruptionStatus === "D4") {
									r.addStyle('color','rgba(0, 86, 112, 0.94)');
								}
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue2);
						r.write("</span>");
						r.write("<span class='sapMPIText3'");
								r.write(">");
								r.write(sLeftIcon);
								r.write(sLeftIcon2);
								r.write(sLeftIcon3);
								r.write(sRightIcon);
						r.write("</span>");
					} 
				}
		
	r.write('</div>');
	
	}
});
