"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.customProgressIndicator");
jQuery.sap.require("airbus.mes.stationtracker.util.BoxDisplayManager");

sap.ui.core.Control.extend("airbus.mes.stationtracker.customProgressIndicator", {
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
		
		var PercValue = c.getPercentValue();
		var Status = c.getStatus();
		var sUnplanned = c.getUnplanned();
		var DisruptionStatus = c.getDisruption();
		var DispValue = c.getDisplayValue();
		var DispValue2 = c.getDisplayValue2();
		var ShowValue = c.getShowValue();
		var paused = c.getPaused();
//		var progress = c.getProgress();
		var rmastatus = c.getRmastatus();
		var prevstarted = c.getPrevstarted();
//		var skill = c.getSkill();
		var osw = c.getOsw();
//		var S = c.getState();	not used
		var W = c.getWidth();
		var H = c.getHeight();
		var sRightIcon = "";	
		var sLeftIcon = "";
		var sLeftIcon2 = "";
		var sLeftIcon3 = "";
		var boxDisplayManager = airbus.mes.stationtracker.util.BoxDisplayManager;
		
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
						if ( rmastatus != "---" ){	//rma
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
							r.addClass('sapMPIBarGreen');
							r.writeClasses();
							r.writeAttribute('style', 'width:' + PercValue + '%');
					break;
					case "---" :				
					// Operation is not started sStatus = "1" Operation is pause	
							//if ( paused === "---" && progress != "0" ) sStatus = "3";
							if ( paused === "---" && prevstarted === "true" ) {
								sRightIcon = boxDisplayManager.rightPaused;
							}	
					break;
					default :
				}
				
				//rma
				if ( rmastatus === "1" ){	
					sLeftIcon =  boxDisplayManager.leftTriangleIcon_Dandelion;
				}
				//OSW
				if (osw[0] === "3" ){ 
					sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
				} 
				//unplanned
				if (osw[0] === "1"  || sUnplanned === "1" ){
					sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
				}
											
				switch ( DisruptionStatus ) {		
					case "D1" :
					// Opened Blocking and disruption ( Status === "D1") sStatus = "4";
							r.addStyle('background-color','#fbec00');
							r.addStyle('color','rgba(0, 86, 112, 0.94)');
							sRightIcon = boxDisplayManager.rightStop_Petrol;
							
							if ( rmastatus === 1 || rmastatus != "---" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
							}
							if (osw[0] === "3" ){ //OSW
								//sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sOSW+'</b></i>';
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								//sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
							//}
					break;
					case "D2" :
					// Opened Blocking disruption ( Status === "D2") sStatus = "5";
							r.addStyle('background-color','#e4002b');
							sRightIcon = boxDisplayManager.rightStop;
							
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
					break;
					case "D3" :
					//Solved Blocking and Escalated disruption ( Status === "D3") sStatus = "6";
							r.addStyle('background', 'repeating-linear-gradient(135deg, #ffbf00, #ffbf00 10px, #fbec00 10px, #fbec00 20px)');
							sRightIcon = boxDisplayManager.rightPlay_Petrol;
							
							if ( rmastatus === 1 || rmastatus != "---" ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
					break;
					case "D4" :
					//Solved Blocking disruption ( Status === "D4") sStatus = "7";
							r.addStyle('background', 'repeating-linear-gradient(135deg, #e4002b, #e4002b 10px, #9e001e 10px, #9e001e 20px)');
							sRightIcon = boxDisplayManager.rightPlay;
							
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = boxDisplayManager.leftTriangleIcon;
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sOSW);
							}
							if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
								sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
							}
					break;
					/*case "B" :
					//andon
							//if ( Status === "B") sStatus = "99";
							r.addStyle('background-color','#e4002b');
							sRightIcon = '<i class="fa fa-stop rightIcon"></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 cherry-red white"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (osw[0] === "1" ){ //unplanned
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 cherry-red white"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							break;*/
					default:		
				}
					
				// Operation Completed
				if (Status === "C") {
					
					//sStatus = "0";
					r.addStyle('background-color','#0085ad');
					sRightIcon = boxDisplayManager.rightCheck;
					
					if ( rmastatus === 1 ){	//rma
						sLeftIcon = boxDisplayManager.leftTriangleIcon;
					}
					if (osw[0] === "3" ){ //OSW
						sLeftIcon2 = boxDisplayManager.rightOswIcon_TealBlueWhite_Constructor(sOSW);
					}
					if (osw[0] === "1" || sUnplanned === "1" ){ //unplanned
						sLeftIcon3 = boxDisplayManager.rightOswIcon_Dandelion_Constructor(sUNPD);
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
								if ( DisruptionStatus === "D3" || DisruptionStatus === "D1") {
									r.addStyle('color','rgba(0, 86, 112, 0.94)');
								}
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue);
						r.write("</span>");
						r.write("<span class='sapMPIText2'");
								r.addStyle('width', W);
								if ( DisruptionStatus === "D3" || DisruptionStatus === "D1") {
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
