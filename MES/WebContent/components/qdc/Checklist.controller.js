"use strict";
sap.ui.controller("airbus.mes.qdc.Checklist", {
	onAfterRendering: function(){
		var oTTbl = airbus.mes.qdc.oView.byId("TabChecklistTable");
		oTTbl.expandToLevel(1);
//		this.updateTreeTableView();
	},
	//apply css and events for the document displayed (on the row)
//	updateTreeTableView: function () {
//		//we add and remove class for the rows displayed
//
//		var events;
//				events = $._data(this.selectTreeTableRow(2)[0], 'events');
//
//					this.selectTreeTableRow(5).addClass("LinkColour");
//
//					if (!events.click) {
//						this.selectTreeTableRow(5).on("click", { url: "http://doc.content.airbus.corp/AASOI/123123456/P1/myForecastv9.pdf" }, this.onClick);//we attach click event
//					} else {
//						this.selectTreeTableRow(5).off("click",this.onClick);//we remove click event
//						this.selectTreeTableRow(5).on("click", { url: "http://doc.content.airbus.corp/AASOI/123123456/P1/myForecastv9.pdf" },this.onClick);//we attach click event
//					}
//	},
//	onClick: function(){
//		var sUrl = "http://cis.csuohio.edu/~fadlalla/notes1.ppt";
//		var link = document.createElement('a');
//		link.href = sUrl;
//		link.setAttribute('target', '_blank');
//
//		if (link.download !== undefined) {
//			//Set HTML5 download attribute. This will prevent file from opening if supported.
//			var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
//			link.download = fileName;
//		}
//
//		//Dispatching click event.
//		if (document.createEvent) {
//			var e = document.createEvent('MouseEvents');
//			e.initEvent('click', true, true);
//			link.dispatchEvent(e);
//			return true;
//		}
//
//		// Force file download (whether supported by server).
//		if (sUrl.indexOf('?') === -1) {
//			sUrl += '?download';
//		}
//
//		window.open(sUrl, '_blank');
//		return true;
//	},
//	
//	//select in jquery the html row for a tree table sapui5 component
//	selectTreeTableRow: function (i) {
//		return $("#idCheckListView--TabChecklistTable-table").children("tbody").children(":nth-child(" +i+ ")");
//	},
});
