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
			}
		}
	},

	onclick : function() {   // is called when the Button is hovered - no event registration required
        this.fireClick();
    },
 
	renderer : function(r, c) {
		
		if (!c.getVisible()) {
			return;
		}
		
		var PercValue = c.getPercentValue();
		var Status = c.getStatus();
		var DispValue = c.getDisplayValue();
		var DispValue2 = c.getDisplayValue2();
		var ShowValue = c.getShowValue();
		var paused = c.getPaused();
		var progress = c.getProgress();
		var rmastatus = c.getRmastatus();
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
						/************************************/
						if ( rmastatus != "---" ){	//rma
							sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon dandelion"></i>';
						}
						if (osw[0] === "3" ){ //OSW
							sLeftIcon2 = '<i class="fa fa-refresh oswIcon dandelion-back "><b style="padding-left:1px">OSW</b></i>';
						}
						
						// Operation is active	
						if ( paused === "false") {
							//sStatus = "2";
							r.addStyle('background-color','#84bd00');
							sRightIcon = '<i class="fa fa-play rightIcon"></i>';
						}		
							// Operation is not started
						if ( paused === "---" ) {
							//sStatus = "1";
							// Operation is pause	
							if ( paused === "---" && progress != "0" ) {
								//sStatus = "3";
								r.addStyle('background-color','#84bd00');
								sRightIcon = '<i class="fa fa-pause rightIcon"></i>';
							}	
						}				
						// Operation Completed
						if ( Status === "C" ) {
							//sStatus = "0";
							r.addStyle('background-color','#0085ad');
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon teal-blue white"><b style="padding-left:1px">OSW</b></i>';
							}
						}
						//Opened Blocking and Escalated disruption
						debugger ;
						if ( Status === "D1") {
							//sStatus = "4";
							r.addStyle('background-color','#fbec00');
							sRightIcon = '<i class="fa fa-stop rightIcon petrol" ></i>';
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon petrol-back dandelion"><b style="padding-left:1px">OSW</b></i>';
							}
						}
						//Opened Blocking disruption
						if ( Status === "D2") {
							//sStatus = "5";
							r.addStyle('background-color','#fbec00');
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon petrol-back dandelion"><b style="padding-left:1px">OSW</b></i>';
							}
						}
						//Solved Blocking and Escalated disruption
						if ( Status === "D3") {
							//sStatus = "6";
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon petrol-back dandelion"><b style="padding-left:1px">OSW</b></i>';
							}
						}
						//Solved Blocking disruption
						if ( Status === "D4") {
							//sStatus = "7";
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon petrol"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon petrol-back dandelion"><b style="padding-left:1px">OSW</b></i>';
							}
						}
						//andon
						if ( Status === "B") {
							//sStatus = "99";
							r.addStyle('background-color','#e4002b');
							if ( rmastatus != "---" ){	//rma
								sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
							}
							if (osw[0] === "3" ){ //OSW
								sLeftIcon2 = '<i class="fa fa-refresh oswIcon cherry-red white"><b style="padding-left:1px">OSW</b></i>';
							}
						} else {
							r.addClass('sapMPIBarGreen');
							r.writeClasses();
							r.writeAttribute('style', 'width:' + PercValue + '%');
						}						
						// Operation is from OSW
//								if ( osw[0] === "3" ) {
//									//fOSW = "1";
//									//sLeftIcon = '<i class="fa fa-exclamation-triangle triangleIcon"></i>';
//									
//								}
//								//Maturity
//								if ( rmastatus != "---" ) {
//									//fRMA = "1";		
//									//sLeftIcon2 = '<i class="fa fa-refresh oswIcon cherry-red white"><b style="padding-left:1px">OSW</b></i>';
//									
//								}
											
						
						/*******************************************/

								
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