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
			displayValue3 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},nc : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},reservation : {
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
			isAndon : {
				type : 'string', // 'boolean',
				group : 'Appearance',
				defaultValue : ''
			},
			status : {
				type : 'string',
				group : 'Appearance',
				defaultValue : ''
			},
			delayed : {
				type : 'string',
				defaultValue : ''
			},
//			showIcon : {
//				type : 'boolean',
//				defaultValue :false
//			},
//			iconColor : {
//				type : 'string',
//				defaultValue : 'white'
//			}
		}
	},

	onclick : function() {   // is called when the Button is hovered - no event registration required
        this.fireClick();
    },
	
	renderer : function(r, c) {
		if (!c.getVisible()) {
			return;
		}
		var color;
		var w = c.getPercentValue();
		var W = c.getWidth();
		var h = c.getHeight();
		var t = c.getDisplayValue();
		var t2 = c.getDisplayValue2();
		var t3 = c.getDisplayValue3();
		var nc = c.getNc();
		var reservation = c.getReservation();
		var s = c.getShowValue();
//		var S = c.getState();
//		var i = c.getShowIcon();
//		var ic = c.getIconColor();
		var andon = c.getIsAndon();
		var delayed = parseInt(c.getDelayed(), 10) > 0 ? true : false;
		var status = c.getStatus();
//		if (andon === '1')
//			r.addClass('sapMPIAndon');
		
		if (parseInt(c.getDelayed(), 10) > 0) {
			console.log('delayed!');
		}
		
		
		r.write('<div');
		r.writeControlData(c);

		r.addClass('sapMPI');
		if (andon === '1') {
			r.addClass('sapMPIAndon');
		} else {
		
		if (delayed) {
			r.addClass('sapMPIBarDarkGrey');			
		} else {
			r.addClass('sapMPIBarGrey');			
		}
		}

		// if (w > 50) {
		// r.addClass('sapMPIValueGreaterHalf')
		// }
		r.addStyle('width', W);
		if (h) {
			r.addStyle('height', h);
		}
		r.writeStyles();
		if (c.getEnabled()) {
			r.writeAttribute('tabIndex', '-1');
		} else {
			r.addClass('sapMPIBarDisabled');
		}

		r.writeClasses();
		r.write('>');

		r.write('<div');

		r.addClass('sapMPIBar');

		if (status === "SFFI") {
			r.addClass('sapMPIBarDarkGrey');
		} else {
			r.addClass('sapMPIBarGreen');
		}
		
		r.writeClasses();

		r.writeAttribute('id', c.getId() + '-bar');
		r.writeAttribute('style', 'width:' + w + '%');
		r.write('>');

		r.write('</div>');

		r.write('<div');
		r.addClass('sapMPIBar');
		
		if (andon === '0') {
		if (delayed) {
			r.addClass('sapMPIBarYellow');			
		} else {
			r.addClass('sapMPIBarGrey');			
		}
		}
		
// r.addClass('sapMPIBarBlue');
		r.writeClasses();
		r.writeAttribute('id', c.getId() + '-bar2');
		// if(!w){w=0;}
		r.writeAttribute('style', 'width:' + (100-w) + '%; float:left;');

		r.write('>');
		r.write('</div>');
		
	
		// r.write('</div>');
		if(s) {
			if(t2=='') {
// if(i===false){
				r.write("<span class='sapMPIText2'");
				//r.addStyle('width', 'calc(100% - 40px)');
				//r.addStyle('max-height', '1.5rem');
				r.writeStyles();
				r.write(">");
				r.writeEscaped(t);
				r.write("</span>");

		} else{
		r.write("<span class='sapMPIText1'");
		// r.writeControlData(c);
		r.addStyle('width', W);
		r.writeStyles();
		r.write(">");
			r.writeEscaped(t);
			r.write("</span>");
			r.write("<span class='sapMPIText2'");
			// r.writeControlData(c);
		r.addStyle('width', W);
		r.writeStyles();
		r.write(">");
			r.writeEscaped(t2);
			r.write("</span>");
		}
		}
		
	
		if(reservation != '0' && reservation != ""){
			var sReservation = reservation;	
			r.write('<span class="sapMPITextRightBar" style="color:red">' + sReservation + '</span>&nbsp;');

		}	
		
		if (t3 === '1' || t3 === '2'){
			r.write("<span class='sapMPITextRightBar'");
			r.write('id="' + c.sId + '-TextRight"' );

			if (t3 === '1'){
				color = 'white';
			}else if (t3 === '2'){
				color = 'red';
			}
			r.addStyle('color', color);
			r.writeStyles();
			r.write(">R</span>&nbsp;");
			}
		
		if(nc != '0' && reservation != "" ){
//			var sNc = nc;
			r.write('<span class="sapMPITextRightBar" style="color:red">Q</span>&nbsp;');
		}			

		
	r.write('</div>');
	}

	
});