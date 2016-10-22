sap.ui.jsfragment("airbus.mes.linetracker.popoverMenu", {
	
	createContent : function(oController) {

			// Id of the pop-over
			var id = "tooltipbtn";

			/* Create Pop-over if not already created */
			var tp = sap.ui.getCore().byId(id);
			if (!tp) {
				var cnfFull = new sap.m.Button({
					text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("ConfirmFull"),//-vaibhav
					//text : "Confirm Full", //+vaibhav
					width : "100%",
					icon : "sap-icon://process",
					press : function(oEvt) {
						// XXX controller dup
						// oController.showFullDialog(oController)
						oController.confirmationFragment(oEvt, false);

					}
				});

				var cnfPart = new sap.m.Button({
					text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("ConfirmPartial"),//-vaibhav
					//text : "Confirm Partial",//+vaibhav
					width : "100%",
					icon : "sap-icon://instance",
					press : function(oEvt) {
						// XXX controller dup
						// oController.showPartialDialog(oController)

						oController.confirmationFragment(oEvt, true);

					}
				});
				var andon = new sap.m.Button({
					text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("Andon"),//-vaibhav
					//text : "Andon",//+vaibhav
					width : "100%",
					icon : "sap-icon://quality-issue",
					press : function(oEvt) {
						// XXX controller dup
						return false;
						//Controller.andonFragment(oEvt);
					}
				});

				var touchngo = new sap.m.Button({
					text : airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("TouchnGo"),//-vaibhav
					//text : "Touch n Go",//+vaibhav
					width : "100%",
					icon : "sap-icon://physical-activity",
					press : function() {
						oController.launchTng(oController)
					}
				});

				var oLayoutToolTip = new sap.ui.commons.layout.MatrixLayout({
					layoutFixed : false
				});

				oLayoutToolTip.createRow(" ", cnfFull);
				oLayoutToolTip.createRow(" ", cnfPart);
				/*temporarily hiding the andon and tunchngo button as per Guillaume's mail +vaibhav*/
//				oLayoutToolTip.createRow(" ", andon);
				oLayoutToolTip.createRow(" ", touchngo);

				tp = new sap.m.Popover({
				//visible : RoleManager.isAllowed("CONFIRMATION"),
					id : id,
					showHeader : false,
					enableScrolling : false,
					placement : sap.m.PlacementType.Auto,
					content : [oLayoutToolTip ]
				});

				tp.setModel(sap.ui.getCore().getModel("oprWrkListModel"));
			}
			return tp;
		}
});