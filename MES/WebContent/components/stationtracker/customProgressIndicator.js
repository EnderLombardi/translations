"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.customProgressIndicator");

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
			}
		}
	},

	onclick : function() {   // is called when the Button is hovered - no event registration required
        this.fireClick();
    },
 
	renderer : function(r, c) {
		
		// gloabal name 
		var sOSW = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Osw");
		var sUNPD = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Unplanned");
		
		
		if (!c.getVisible()) {
			return;
		}
		
		var PercValue = c.getPercentValue();
		var Status = c.getStatus();
		var DisruptionStatus = c.getDisruption();
		var DispValue = c.getDisplayValue();
		var DispValue2 = c.getDisplayValue2();
		var ShowValue = c.getShowValue();
		var paused = c.getPaused();
		var progress = c.getProgress();
		var rmastatus = c.getRmastatus();
		var skill = c.getSkill();
		var osw = c.getOsw();
//		var S = c.getState();	not used
		var W = c.getWidth();
		var H = c.getHeight();
		var sRightIcon = "";	
		var sLeftIcon = "";
		var sLeftIcon2 = "";
		
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
							sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon dandelion"></i>';
						}
						if (osw[0] === "3" ){ //OSW
							sLeftIcon2 = '<i class="fa fa-refresh oswIcon dandelion-back "><b style="padding-left:1px">'+sOSW+'</b></i>';
						}
						
						// Operation is active	
						
				//------------------------------------------						
				// condition design for worklist pop up
				//------------------------------------------
				
				switch ( paused ) {
					case "false" :
					// Operation is active
							//sStatus = "2";
							sRightIcon = '<i class="fa fa-play rightIcon"></i>';
							break;
					case "---" :				
					// Operation is not started
							//sStatus = "1";
							// Operation is pause	
							if ( paused === "---" && progress != "0" ) {
								//sStatus = "3";
								sRightIcon = '<i class="fa fa-pause rightIcon"></i>';
							}	
							break;
					default :
				}
											
				switch ( DisruptionStatus ) {		
					case "D1" :
					//Opened Blocking and Escalated disruption
							//if ( Status === "D1") {
							//sStatus = "4";
							r.addStyle('background-color','#fbec00');
							sRightIcon = '<i class="fa fa-play rightIcon petrol" ></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (skill === "unplanned" ){ //skill
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							//}
							break;
					case "D2" :
					//Opened Blocking disruption
							//if ( Status === "D2") {
							//sStatus = "5";
							r.addStyle('background-color','#fbec00');
							sRightIcon = '<i class="fa fa-stop rightIcon petrol" ></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (skill === "unplanned" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							break;
					case "D3" :
					//Solved Blocking and Escalated disruption
							//if ( Status === "D3") {
							//sStatus = "6";
							sRightIcon = '<i class="fa fa-play rightIcon"></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (skill === "unplanned" ){ //skill
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							break;
					case "D4" :
					//Solved Blocking disruption
							//if ( Status === "D4") {
							//sStatus = "7";
							sRightIcon = '<i class="fa fa-play rightIcon petrol"></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (skill === "unplanned" ){ //skill
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							break;
					case "B" :
					//andon
							//if ( Status === "B") {
							//sStatus = "99";
							r.addStyle('background-color','#e4002b');
							sRightIcon = '<i class="fa fa-stop rightIcon"></i>';
							if ( rmastatus === 1 ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 cherry-red white"><b style="padding-left:1px">'+sOSW+'</b></i>';
							}
							if (skill === "unplanned" ){ //skill
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 cherry-red white"><b style="padding-left:1px">'+sUNPD+'</b></i>';
							}
							break;
					default:		
				}
				
				// Operation Completed
				if (Status === "C") {
					
					//sStatus = "0";
					r.addStyle('background-color','#0085ad');
					sRightIcon = '<i class="fa fa-check rightIcon"></i>';
					if ( rmastatus === 1 ){	//rma
						sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
					}
					if (osw[0] === "3" ){ //OSW
						sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 teal-blue white"><b style="padding-left:1px">'+sOSW+'</b></i>';
					}
					if (skill === "unplanned" ){ //skill
						sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
					}
				}
						
				//rma
				if ( rmastatus === 1 ){	
					sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon dandelion"></i>';
				}
				//OSW
				if (osw[0] === "3" ){ 
					sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 dandelion-back "><b style="padding-left:1px">'+sOSW+'</b></i>';
				} else {
					r.addClass('sapMPIBarGreen');
					r.writeClasses();
					r.writeAttribute('style', 'width:' + PercValue + '%');
				}
				//skill
				if (skill === "unplanned" ){
						sLeftIcon2 = '<i class="fa fa-refresh oswIcon2 petrol-back dandelion"><b style="padding-left:1px">'+sUNPD+'</b></i>';
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
								if ( Status === "D2" || Status === "D1") {
									r.addStyle('color','#0F2D65');
								}
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue);
						r.write("</span>");
						r.write("<span class='sapMPIText2'");
								r.addStyle('width', W);
								if ( Status === "D2" || Status === "D1") {
									r.addStyle('color','#0F2D65');
								}
								r.writeStyles();
								r.write(">");
								r.writeEscaped(DispValue2);
						r.write("</span>");
						r.write("<span class='sapMPIText3'");
								r.write(">");
								r.write(sLeftIcon);
								r.write(sLeftIcon2);
								r.write(sRightIcon);
						r.write("</span>");
					} 
				}
		
	r.write('</div>');
	
	}
});
