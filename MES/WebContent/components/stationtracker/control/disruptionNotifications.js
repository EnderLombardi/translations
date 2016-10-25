"use strict";
sap.ui.core.Control.extend("airbus.mes.stationtracker.control.disruptionNotifications", {
	metadata : {
		properties : {

			navSize : {
				type : 'sap.ui.core.CSSSize',
				defaultValue : "0"
			},
			state : {
				type : 'boolean',
				defaultValue : 'false'
			}

		},
		defaultAggregation : 'sideContent',

		aggregations : {
			sideContent : {
				type : 'sap.ui.core.Control',
				multiple : false,
				singularName : 'sideContent'
			},
			content : {
				type : 'sap.ui.core.Control',
				multiple : true,
				singularName : 'content'
			}
		},
	// events : {
	// "openNav" : {},
	// "closeNav":{},
	// }

	},
	// openNav : function(evt) {
	// //this.fireOpenNav();
	// this.openNavigation();
	// },
	renderer : function(r, t) {

		var ns = t.getNavSize();
		var sc = t.getSideContent();

		r.write("<div");
		r.writeControlData(t);
		/*
		 * r.addClass("sideNavigation"); r.writeClasses();
		 */
		r.write('>');
		
		r.write("<div id='blackOverlay' onClick=''></div>")
		
		r.write("<div");
		r.addClass("sidenav");
		r.writeClasses();
		if (ns!= '' || ns.toLowerCase() === 'auto') {
			r.addStyle('width', ns);
			r.writeStyles();
		}
		;
		r.write('>')
		r.renderControl(sc);
		r.write('</div>');

		r.write("<div id='main'");
		if (ns!= '' || ns.toLowerCase() === 'auto') {
			r.addStyle('margin-right', ns);
			r.writeStyles();
		}
		r.write(">");
		t.getContent().forEach(function(c) {
			r.renderControl(c);
		});
		/* r.renderControl(G); */
		r.write('</div>');

	},

	openNavigation : function(oEvent) {

		//document.getElementById("main").style.width = "80%";
		this.setNavSize("300px");
		this.setState(true);
		//$("#blackOverlay").removeClass("hide");
	},

	closeNavigation : function(oEvent) {
		//document.getElementById("main").style.width = "100%";
		this.setNavSize("0");
		this.setState(false);
	}
});