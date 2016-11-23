"use strict";
sap.ui.jsfragment("airbus.mes.linetracker.Confirmation", {
	createContent : function(oController) {

//		var model = sap.ui.getCore().getModel("oprWrkListModel");

		var username;
		var password;
		var percentBox;
		var oProgress;
		// create confirm button
		var oBtnCnf = new sap.m.Button({
			//visible : RoleManager.isAllowed("CONFIRMATION"),
			text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("Confirm"),
			press : function(oEvt) {
				oController.saveconfirmationFragment(oEvt);
			}
		});

		// create cancel button
		var oBtnCancel = new sap.m.Button({
			text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("Close"),
			press : oController.closeoBtnCancel,

		});

		// creating the popup and its layout
		username = new sap.m.Input("username", {
			placeholder : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("UsernamePlaceholder")
		}).addStyleClass("upperCaseConversion");
		var user = new sap.m.Label({
			text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("UsernameLabel"),
			required : true
		});

		password = new sap.m.Input("password", {
			placeholder : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("PasswordPlaceholder"),
			type : sap.m.InputType.Password
		});
		var pass = new sap.m.Label({
			text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("PasswordLabel"),
			required : true
		});

		var pcent = new sap.m.Label("pcent", {
			text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("PercentageLabel")
			+ "%",
			required : true
		});
		// var percent_box;

		var percentSlider = new sap.m.Slider("slider", {
			min : 0,
			max : 100,
			step : 10,
			liveChange : oController.livechange,

		});

		percentBox = new sap.m.Label("percent_box", {});

		var spanMsg = new sap.m.Label("spanMsg", {}).setVisible(false);

		// create a simple matrix layout
		var oPopupLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 4,
			width : "100%",
			templateShareable : true,
			widths : [ "8%", "34%", "50%", "8%" ]
		});

			oProgress = new airbus.customProgressIndicator("oProgress", {

			layoutData : new sap.m.FlexItemData({
				baseSize : "100%",
				growFactor : 1
			}),
			width : "100%",
			state : sap.ui.core.ValueState.Success,
			status : "{STATUS}",
			isAndon : "{ANDON}",
			delayed : "{DELAY}"
		});
		/* Different display values in aos and step change hence different binding here */ //+vaibhav
		oProgress.bindProperty("displayValue", {
			parts : [ "Order_ID","Order_Desc"],
			formatter : function(OrderID, OrderDesc) {
				return OrderID + " - " + OrderDesc;
			}
		});
		
		oProgress.bindProperty("displayValue2", {
			parts : [ "Operation_ID","Operation_Desc","Progress"],
			formatter : function(OperationID, OperationDesc, Progress) {
				return OperationID + " - " + OperationDesc + " : " + Progress*100
						+ "%";
			}
		});
/*
		oProgress.bindProperty("displayValue",
				{
					// XXX i18n
					parts : [ "AUFNR", "MAKTX", "VORNR", "LTXA1", "PROGRESS",
							"STATUS" ],
					formatter : function(AUFNR, MAKTX, VORNR, LTXA1, PROGRESS,
							STATUS) {
						return AUFNR + " - " + MAKTX;
					}
				});
		oProgress.bindProperty("displayValue2",
				{
					parts : [ "AUFNR", "MAKTX", "VORNR", "LTXA1", "PROGRESS",
							"STATUS" ],
					formatter : function(AUFNR, MAKTX, VORNR, LTXA1, PROGRESS,
							STATUS) {
						return VORNR + " - " + LTXA1 + " : " + PROGRESS + "%";
					}
				});
*/		oProgress.bindProperty("percentValue", {
			parts : [ "Progress" ],
			formatter : function(Progress) {
				var p = parseFloat(Progress)*100;
				if (isNaN(p) || p <= 0) { 
					return 0;
				} else if (p > 100) {
					return 100;
				} else {
					return p;
				}
			}
		});

		var oCellProgress = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : [ oProgress ]
		});

		var oCellMsg = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : [ spanMsg ]
		});

		var oCellPcent = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : [ pcent ]
		});

		var oCellPercent = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 3,
			content : [ percentSlider ]
		});

		var oCellPercentBox = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ percentBox ]
		});

		oPopupLayout.createRow("", oCellProgress, "");
		oPopupLayout.createRow("", oCellPcent, "");
		oPopupLayout.createRow(oCellPercent, oCellPercentBox);
		oPopupLayout.createRow("", user, username, "");
		oPopupLayout.createRow("", pass, password, "");
		oPopupLayout.createRow("", oCellMsg, "");

		/*Title for step change*/ //+vaibhav
		var title = new sap.m.Text({
			text : {
				parts : [ "Order_ID", "Order_Desc", "Operation_ID", "Operation_Desc", "Progress" ],
				formatter : function(OrderID, OrderDesc, OperationID, OperationDesc, Progress) {
					return OrderID + " " + OrderDesc + "\n" + OperationID + " " + OperationDesc
							+ Progress
				}
			}

		});
		/*Title for airbus*/ //-vaibhav
/*		var title = new sap.m.Text({
			text : {
				parts : [ "AUFNR", "MAKTX", "VORNR", "LTXA1", "PROGRESS" ],
				formatter : function(aufnr, maktx, vornr, ltxa1, progress) {
					return aufnr + " " + maktx + "\n" + vornr + " " + ltxa1
							+ progress
				}
			}

		});
*/
		title.setTextAlign(sap.ui.core.TextAlign.Center);

		var title3 = new sap.m.Bar({
			contentMiddle : title
		});// .addStyleClass("increaseBarHeight");

		var oDialog1 = new sap.m.Dialog('oDialog1',{
			showHeader : false,
			modal : true,
			buttons : [ oBtnCnf, oBtnCancel ],
			content : [ title3, oPopupLayout ]
		});

		return oDialog1;

	}
});