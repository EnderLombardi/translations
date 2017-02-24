"use strict";
sap.ui.controller("airbus.mes.qdc.Checklist", {
	onAfterRendering: function(){
		var oTTbl = airbus.mes.qdc.oView.byId("TabChecklistTable");
		oTTbl.expandToLevel(1);
//		this.updateTreeTableView();
	},
	
	onClick: function(oEvt){
//		var oVal = airbus.mes.qdc.ModelManager.loadQDCData();
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
		var sGroup = "";   
		var obj = oVal.oData.Rowsets.Rowset[1].Row;
		var oData = oVal.oData.Rowsets.Rowset[0].Row[0];
		var oValue = airbus.mes.shell.RoleManager.profile.connectedUser;		
//		obj.filter(function (row) {
//			  if(row.DOC_TYPE == "MEA" || row.DOC_TYPE == "MAA" || row.DOC_TYPE == "QDC") {
//				  if(row.DOC_TYPE === "MEA"){
//					  sGroup = row.GROUP;
//				  }if(row.DOC_TYPE === 'MAA'){
//					  sGroup = row.GROUP;
//				  }if(row.DOC_TYPE === 'QDC'){
//					  sGroup = row.GROUP;
//				  }
//				  return true;
//				  } else {
//					  return false;
//				  }
//			  
//		  })
		
		  obj.filter(function (row) {
			  if(row.DOC_TYPE === "MEA"){
				  sGroup = row.GROUP;
			  }

		  });

	  obj.filter(function (row) {
			  if(row.DOC_TYPE === "PLA"){
				  sGroup = row.GROUP;
			  }

		  });		  
	  
	  obj.filter(function (row) {
			  if(row.DOC_TYPE === "QDC"){
				  sGroup = row.GROUP;
			  }

		  });	
		
		var oQDCData = {};
		oQDCData.PROFILE = "OPERATEUR";
		oQDCData.ORIGIN  = oData.ERP_SYSTEM+"CLNT001"
		oQDCData.LANGUAGE = oValue.Language;
		oQDCData.OPERATION_CODE = "J";
		oQDCData.WORKSHOP = oData.WORKSHOP;
		oQDCData.MACHINE = oData.MACHINE;
		oQDCData.PRODUCT = oData.PRODUCT;
		oQDCData.SERNR = oData.SERNR;
		oQDCData.GROUP = sGroup;
		oQDCData.OF = oData.OF;
		oQDCData.OPERATION = oData.OPERATION;
		oQDCData.CONFIRMATION = oData.CONFIRMATION;
		oQDCData.ARTICLE = oData.ARTICLE;
		oQDCData.USERID = oValue.IllumLoginName;
		oQDCData.NOM = oValue.lastname;
		oQDCData.PRENOM = oValue.firstname;
		oQDCData.PROGRAMME = oData.PROGRAMME;
		oQDCData.MSN_INITIAL = oData.MSN_INITIAL;
		oQDCData.STATION = oData.STATION;
		oQDCData.STD = oData.STD;			
		
		// grab the content of the form field and place it into a variable
	    var textToWrite = JSON.stringify(oQDCData);
	    //  create a new Blob (html5 magic) that conatins the data from your form feild
	    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	    
		var sText = oEvt.oSource.mProperties.text;
		if(sText === "MEA"){
			// Specify the name of the file to be saved
		    var fileNameToSaveAs = "myNewFile.txt";
			
		}else if(sText === "MAA"){
			// Specify the name of the file to be saved
		    var fileNameToSaveAs = "myNewFile.MAA";
			
		}else if(sText === "MQM"){
			// Specify the name of the file to be saved
		    var fileNameToSaveAs = "myNewFile.MQM";
			
		}	    
	// Optionally allow the user to choose a file name by providing 
	// an imput field in the HTML and using the collected data here
	// var fileNameToSaveAs = txtFileName.text;

	// create a link for our script to 'click'
	    var downloadLink = document.createElement("a");
	//  supply the name of the file (from the var above).
	// you could create the name here but using a var
	// allows more flexability later.
	    downloadLink.download = fileNameToSaveAs;
	// provide text for the link. This will be hidden so you
	// can actually use anything you want.
	    downloadLink.innerHTML = "My Hidden Link";
	    
	// allow our code to work in webkit & Gecko based browsers
	// without the need for a if / else block.
	    window.URL = window.URL || window.webkitURL;
	          
	// Create the link Object.
	    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	// when link is clicked call a function to remove it from
	// the DOM in case user wants to save a second file.
//	    downloadLink.onclick = destroyClickedElement;
	// make sure the link is hidden.
	    downloadLink.style.display = "none";
	// add the link to the DOM
	    document.body.appendChild(downloadLink);
	    
	// click the new link
	    downloadLink.click();
	    
	}
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
