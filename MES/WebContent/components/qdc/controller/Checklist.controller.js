"use strict";
sap.ui.controller("airbus.mes.qdc.controller.Checklist", {
	onAfterRendering : function() {
		var oTTbl = airbus.mes.qdc.oView.byId("TabChecklistTable");
		oTTbl.expandToLevel(1);
	},
	

	/**
	 * BR: SD-QDC-HMI-160 This function is used to enable or disable the
	 * External tools buttons on switching the display only and Execution mode
	 * Switch control
	 */
	enableButtons: function(data){
		var oData = data;

		airbus.mes.qdc.oView.byId("idButtonMEA").setVisible(false);
		airbus.mes.qdc.oView.byId("idButtonMAA").setVisible(false);
		airbus.mes.qdc.oView.byId("idButtonQDC").setVisible(false);

		if (oData.Rowsets.Rowset[0].Row[0].QDCSTATUS !== "" &&
			// Operation Started
			airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").getState() === true) {
			var obj = oData.Rowsets.Rowset[1].Row;
			
			if(obj){
			obj.filter(function(row) {
				if (row.DOC_TYPE === "MEA") {
					airbus.mes.qdc.oView.byId("idButtonMEA").setVisible(true);
				}
		
			});
		
			obj.filter(function(row) {
				if (row.DOC_TYPE === "MAA") {
					airbus.mes.qdc.oView.byId("idButtonMAA").setVisible(true);
				}
		
			});
		
			obj.filter(function(row) {
				if (row.DOC_TYPE === "QDC") {
					airbus.mes.qdc.oView.byId("idButtonQDC").setVisible(true);
				}
		
			});
		}
			}
	},
	
	
	
	/**
	 * BR: SD-QDC-HMI-150 Function is used to download the file based on the
	 * document type. First a QA check is also performed.
	 */
	onClick : function(oEvt) {
		var oData = sap.ui.getCore().getModel("QACheckModel");
		var sMssg = oData.oData.message;
		var sMsg;
		if (sMssg === "E") {
			sMsg = airbus.mes.qdc.oView.getModel("i18nModel").getResourceBundle().getText("NoAuthorization", [ sap.ui.getCore().getModel("userSettingModel").oData.Rowsets.Rowset[0].Row[0].user]);
			sap.m.MessageToast.show(sMsg);
		} else if (sMssg === "W") {
			sMsg = airbus.mes.qdc.oView.getModel("i18nModel").getResourceBundle().getText("NoAuthorization", [ sap.ui.getCore().getModel("userSettingModel").oData.Rowsets.Rowset[0].Row[0].user]);
			sap.m.MessageToast.show(sMsg);
		} else if (sMssg === "S") {
			var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
			var sGroup = "";
			var obj = oVal.oData.Rowsets.Rowset[1].Row;
			var oData = oVal.oData.Rowsets.Rowset[0].Row[0];
			var oValue = airbus.mes.shell.RoleManager.profile.connectedUser;

			obj.filter(function(row) {
				if (row.DOC_TYPE === "MEA") {
					sGroup = row.GROUP;
				}
			});

			obj.filter(function(row) {
				if (row.DOC_TYPE === "MAA") {
					sGroup = row.GROUP;
				}
			});

			obj.filter(function(row) {
				if (row.DOC_TYPE === "QDC") {
					sGroup = row.GROUP;
				}
			});

			var oQDCData = {};
			oQDCData.PROFILE = "OPERATEUR";
			oQDCData.ORIGIN = oData.ERP_SYSTEM + "CLNT001"
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
			
			var textToWrite =   "PROFILE=" + "OPERATEUR"+
            "\rORIGIN=" + oData.ERP_SYSTEM + "CLNT001" +
			"\rLANGUAGE=" + oValue.Language+
			"\rOPERATION_CODE=" + "J"+
			"\rWORKSHOP=" + oData.WORKSHOP+
			"\rMACHINE="+ oData.MACHINE+
			"\rPRODUCT="+ oData.PRODUCT+
			"\rSERNR="+ oData.SERNR+
			"\rGROUP="+ sGroup+
			"\rOF="+ oData.OF+
			"\rOPERATION="+ oData.OPERATION+
			"\rCONFIRMATION="+ oData.CONFIRMATION+
			"\rARTICLE="+ oData.ARTICLE+
			"\rUSERID="+ oValue.IllumLoginName+
			"\rNOM="+ oValue.lastname+
			"\rPRENOM="+ oValue.firstname+
			"\rPROGRAMME="+ oData.PROGRAMME+
			"\rMSN_INITIAL="+ oData.MSN_INITIAL+
			"\rSTATION="+ oData.STATION+
			"\rSTD="+ oData.STD+"\r";


            // create a new Blob (html5 magic) that conatins the data from your
			// form feild
			var textFileAsBlob = new Blob([ textToWrite ], {
				type : 'text/plain',
				endings:"native"
			});
			
			
			
			

			var sText = oEvt.oSource.mProperties.text;
			if (sText === "MEA") {
				// Specify the name of the file to be saved
				var fileNameToSaveAs = "MES_"+oQDCData.USERID+".MEA";

			} else if (sText === "MAA") {
				// Specify the name of the file to be saved
				var fileNameToSaveAs = "MES_"+oQDCData.USERID+".MAA";

			} else if (sText === "MQM") {
				// Specify the name of the file to be saved
				var fileNameToSaveAs = "MES_"+oQDCData.USERID+".MQM";

			}
			// Optionally allow the user to choose a file name by providing
			// an input field in the HTML and using the collected data here
			// var fileNameToSaveAs = txtFileName.text;

			// create a link for our script to 'click'
			var downloadLink = document.createElement("a");
			// supply the name of the file (from the var above).
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
			// downloadLink.onclick = destroyClickedElement;
			// make sure the link is hidden.
			downloadLink.style.display = "none";
			// add the link to the DOM
			document.body.appendChild(downloadLink);

			// click the new link
			downloadLink.click();
		}
	}
});
