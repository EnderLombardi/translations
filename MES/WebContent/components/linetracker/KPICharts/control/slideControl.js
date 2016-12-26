"use strict";
sap.ui.core.Control.extend("airbus.mes.linetracker.KPICharts.control.slideControl", {
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
		defaultAggregation : 'pageContent',

		aggregations : {
			pageContent : {
				type : 'sap.ui.core.Control',
				multiple : true,
				singularName : 'pageContent'
			},
			slideContent : {
				type : 'sap.ui.core.Control',
				multiple : false,
				singularName : 'slideContent'
			}
		},
//	 events : {
//	 "openNav" : {},
//	 "closeNav":{},
//	 }

	},
	// openNav : function(evt) {
	// //this.fireOpenNav();
	// this.openNavigation();
	// },
	renderer : function(r, t) {

		var ns = t.getNavSize();
		var sc = t.getSlideContent();
		var pc = t.getPageContent();
		r.write("<div");
		r.writeControlData(t);
		/*
		 * r.addClass("sideNavigation"); r.writeClasses();
		 */
		r.write('>');
		
		r.write("<div id='idSlide--kpi'");
		r.addClass("sidenav");
		r.writeClasses();
		if (ns!= '' || ns.toLowerCase() === 'auto') {
			r.addStyle('height', ns);
			r.addStyle('transition', '2s');
			r.writeStyles();
		}
		;
		r.write('>')
		r.renderControl(sc);
		r.write('</div>');

		r.write("<div id='main'");
		if (ns!= '' || ns.toLowerCase() === 'auto') {
			r.addStyle('margin-bottom', ns);
			r.writeStyles();
		}
		r.write(">");
		pc.forEach(function(c) {
			r.renderControl(c);
		});
		/* r.renderControl(G); */
		r.write('</div>');

	},

	openNavigation : function(oEvent) {

		//document.getElementById("main").style.width = "80%";
		this.setNavSize("30%");
		this.setState(true);
		//$("#blackOverlay").removeClass("hide");
	},

	closeNavigation : function(oEvent) {
		//document.getElementById("main").style.width = "100%";
		this.setNavSize("0%");
		this.setState(false);
	}
});