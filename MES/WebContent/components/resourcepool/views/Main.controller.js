sap.ui
		.controller(
				"airbus.mes.resourcepool.views.Main",
				{

					resourcePoolName : undefined,
					resourcePoolDescription : undefined,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf resource_pool.Main
					 */

					onInit : function() {
						if (this.getView().getId() == "resourcePool") {

							// add all three pages userView,ShiftView, and
							// WorkCenterView in NavContainer
							this.getView().byId("MainViewNavContainer")
									.addPage(
											sap.ui.getCore()
													.byId("idUsersView"));
							this.getView().byId("MainViewNavContainer")
									.addPage(
											sap.ui.getCore()
													.byId("idShiftView"));

							this.getView().byId("MainViewNavContainer")
									.addPage(
											sap.ui.getCore().byId(
													"idWorkCenterView"));

							this.nav = this.getView().byId(
									"MainViewNavContainer");
							this.nav.to("idUsersView");
						}

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf resource_pool.Main
					 */
					// onBeforeRendering: function() {
					//
					// },
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf resource_pool.Main
					 */
					/*
					 * onAfterRendering : function() { },
					 */
					/***********************************************************
					 * Load Views according to segmented button selected
					 **********************************************************/
					openPage : function(oEvent) {

						var itemKey = oEvent.getSource().getKey();
						if (itemKey === "users") {
							// direct nav container to users view
							this.nav.to("idUsersView");

						} else if (itemKey === "workcenters") {

							// direct nav container to workcenter view
							this.nav.to("idWorkCenterView");

						} else if (itemKey === "shifts") {

							this.nav.to("idShiftView");
						} else {
							// do nothing or probably select factory view again
						}
					},
					/***********************************************************
					 * Triggers when any change is done using switch button in
					 * Shifts Table
					 **********************************************************/
					changeAssignedShift : function(oEvent) {
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
						/* row of table on which event is triggered */
						var oItemAssign = oEvent.getSource().getParent();
						/* all list of shifts in table */
						var oListOfItems = oEvent.getSource().getParent()
								.getParent();

						/* empty the AvailableShiftModel */
						sap.ui.getCore().getModel("AvailableShiftModel").oData.Rowsets.Rowset[0].Row = []
						for (var i = 0; i < oListOfItems.getItems().length; i++) {
							/* if item is one on which the shift is changed */
							if (oListOfItems.getItems()[i] === oItemAssign) {

								/* create a JSON object with all the details */
								var oJsonShifts = {

									"USER_SHIFT_BO" : "",
									"SITE" : airbus.mes.resourcepool.util.ModelManager.site,
									"NAME" : oItemAssign.getCells()[0]
											.getText(),
									"SHIFT_BEGIN" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(oItemAssign
													.getCells()[1].getText()),
									"SHIFT_END" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(oItemAssign
													.getCells()[2].getText()),
									"VALID_FROM" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(oItemAssign
													.getCells()[3].getText()),
									"VALID_TO" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(oItemAssign
													.getCells()[4].getText()),
									"DESCRIPTION" : "",
									"CREATED_DATE_TIME" : "",
									"ASSIGNED" : oItemAssign.getCells()[5]
											.getState().toString(),
								}
								/* push JSON object to Model */
								sap.ui.getCore()
										.getModel("AvailableShiftModel").oData.Rowsets.Rowset[0].Row
										.push(oJsonShifts);
								/* set styleClass selected or not selected */
								if (oItemAssign.getCells()[5].getState() == true)
									oItemAssign
											.addStyleClass("sapMLIBSelected");
								else
									oItemAssign
											.removeStyleClass("sapMLIBSelected");

							}
							/* For all other items on which shift is not changed */
							else {
								/*
								 * create a JSON object with all details but
								 * Assignment = false
								 */
								var oJsonShifts = {

									"USER_SHIFT_BO" : "",
									"SITE" : airbus.mes.resourcepool.util.ModelManager.site,
									"NAME" : oListOfItems.getItems()[i]
											.getCells()[0].getText(),
									"SHIFT_BEGIN" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(oListOfItems
													.getItems()[i].getCells()[1]
													.getText()),
									"SHIFT_END" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(oListOfItems
													.getItems()[i].getCells()[2]
													.getText()),
									"VALID_FROM" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(oListOfItems
													.getItems()[i].getCells()[3]
													.getText()),
									"VALID_TO" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(oListOfItems
													.getItems()[i].getCells()[4]
													.getText()),
									"DESCRIPTION" : "",
									"CREATED_DATE_TIME" : "",
									"ASSIGNED" : "false",
								}
								/* Push JSON to Model */
								sap.ui.getCore()
										.getModel("AvailableShiftModel").oData.Rowsets.Rowset[0].Row
										.push(oJsonShifts);

								oListOfItems.getItems()[i]
										.removeStyleClass("sapMLIBSelected");
							}

						}
						/* Refresh Shift Model */
						sap.ui.getCore().getModel("AvailableShiftModel")
								.refresh();
					},
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf resource_pool.Main
					 */
					// onExit: function() {
					//
					// }
					/***********************************************************
					 * Triggers when Assign Button is clicked on Users Tab
					 **********************************************************/
					assignUsers : function(evt) {
						var aUsersToAssign = this.getView().byId(
								"listAvailableUsers").getSelectedItems();

						var aError = [];

						/* If no selections are made when assigning show error */
						if (!aUsersToAssign || aUsersToAssign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Toast",
											"",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty("NoSelections"),
											"");
							return;
						}
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
						/*
						 * if no data was present in AssignedUsersModel then set
						 * an empty Row
						 */
						if (!sap.ui.getCore().getModel("AssignedUsersModel").oData.Rowsets.Rowset[0].Row)
							sap.ui.getCore().getModel("AssignedUsersModel").oData.Rowsets.Rowset[0].Row = [];

						/* for each user selected to assign */
						aUsersToAssign
								.forEach(function(item) {

									/*
									 * If any user is already loaned or assigned
									 * then prepare error messages
									 */
									if (item.getCustomData()[2].getValue() != ""
											&& item.getCustomData()[3]
													.getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
										aError.push(item);
									else {
										/*
										 * prepare a JSON object with all
										 * details of Assigned User
										 */
										var oAssignedUser = item.getBindingContext("ResourcePoolDetailModel").getObject();
										
										/*var oJsonAssignedUsers = {
											"userId" : item.getCustomData()[7]
													.getValue(),
											"site" : airbus.mes.resourcepool.util.ModelManager.site,
											"name" : item.getCustomData()[5]
													.getValue(),
											"personalNo" : item.getCustomData()[0]
													.getValue(),
											"erpUserId" : item.getCustomData()[1]
													.getValue(),
											"assignedToRPName" : item
													.getCustomData()[3]
													.getValue(),
											"handle" : item.getCustomData()[9]
													.getValue(),
											"loanedToPool" : item
													.getCustomData()[2]
													.getValue(),
											"loanedToRPName" : item
													.getCustomData()[4]
													.getValue(),
											"type" : item.getCustomData()[8]
													.getValue(),
										}*/
										
										/*
										 * push JSON Object to
										 * AssignedUsersModel
										 */
										sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/").push(oAssignedUser);
									}
								});

						sap.ui.getCore().getModel("AssignedUsersModel")
								.refresh();

						/* remove all selections on screen */
						this.getView().byId("listAvailableUsers")
								.removeSelections();
						this.getView().byId("allAvailableUsers").setSelected(
								false);
						this.getView().byId("allAssignedUsers").setSelected(
								false);

						/* remove assigned users from AvailableUsersModel */
						var oModelAvailableUsers = sap.ui.getCore().getModel(
								"AvailableUsersModel").oData.Rowsets.Rowset[0].Row;

						for (var i = 0; i < aUsersToAssign.length; i++) {
							if ( (aUsersToAssign[i].getCustomData()[2].getValue() != "---" || aUsersToAssign[i].getCustomData()[2].getValue() != "" )
									&& aUsersToAssign[i].getCustomData()[3]
											.getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
								continue;
							for (var j = 0; j < oModelAvailableUsers.length; j++) {
								if (oModelAvailableUsers[j].USER_ID == aUsersToAssign[i]
										.getCustomData()[7].getValue())
									oModelAvailableUsers.splice(j, 1);
							}
						}

						sap.ui.getCore().getModel("AvailableUsersModel")
								.refresh();

						/* for loaned and assigned users show error message */
						if (aError.length != 0)
							this.showMessageDialog(aError);

					},
					/***********************************************************
					 * handle error message for already loaned and assigned
					 * users which cannot be assigned any longer
					 **********************************************************/
					showMessageDialog : function(aError) {
						if (airbus.mes.resourcepool.messageDialog === undefined) {

							airbus.mes.resourcepool.messageDialog = sap.ui
									.xmlfragment(
											"messageDialog",
											"airbus.mes.resourcepool.views.messageDialog",
											airbus.mes.resourcepool.oView
													.getController());
							airbus.mes.resourcepool.oView
									.addDependent(airbus.mes.resourcepool.messageDialog);
						}

						for (var i = 0; i < aError.length; i++) {
							airbus.mes.resourcepool.messageDialog.getContent()[0]
									.addItem(new sap.m.Text(
											{
												text : airbus.mes.resourcepool.oView
														.getModel("i18nModel")
														.getProperty("User")
														+ " "
														+ this
																.titleCase(aError[i]
																		.getCustomData()[5]
																		.getValue()
																		+ " "
																		+ aError[i]
																				.getCustomData()[6]
																				.getValue())
														+ " "
														+ airbus.mes.resourcepool.oView
																.getModel(
																		"i18nModel")
																.getProperty(
																		"AssignedToResourcePool")
														+ " "
														+ aError[i]
																.getCustomData()[3]
																.getValue()
														+ " "
														+ airbus.mes.resourcepool.oView
																.getModel(
																		"i18nModel")
																.getProperty(
																		"LoanedToResourcePool")
														+ aError[i]
																.getCustomData()[4]
																.getValue()

											}));
						}
						airbus.mes.resourcepool.messageDialog.open();

					},

					/***********************************************************
					 * triggers when OK is pressed on Message Dialog which
					 * appeared while assigning users
					 **********************************************************/
					afterMessageDialogClose : function() {
						airbus.mes.resourcepool.messageDialog.getContent()[0]
								.removeAllItems();
						airbus.mes.resourcepool.messageDialog.close();
					},

					/***********************************************************
					 * Triggers when unAssign button is clicked on the Users tab
					 **********************************************************/
					unassignUsers : function(evt) {
						var aUsersToUnassign = this.getView().byId(
								"listAllocatedUsers").getSelectedItems();
						/*
						 * show error message when no users are selected when
						 * unassigning
						 */
						if (!aUsersToUnassign || aUsersToUnassign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Toast",
											"",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty("NoSelections"),
											"")
							return;
						}
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;

						/*
						 * if no data is present in AvailableUsersModel then
						 * create a row
						 */
						if (!sap.ui.getCore().getModel("AvailableUsersModel").oData.Rowsets.Rowset[0].Row)
							sap.ui.getCore().getModel("AvailableUsersModel").oData.Rowsets.Rowset[0].Row = [];

						/* for each user which is to be unassigned */
						aUsersToUnassign
								.forEach(function(item) {
									/* create JSON Object */
									var loaned_RP_Name = item.getCustomData()[4]
											.getValue() ? item.getCustomData()[4]
											.getValue()
											: "";

									if (item.getCustomData()[3].getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
										// If Loaned to current resource
										var oJsonAvailableUsers = {
											"userId" : item.getCustomData()[7]
													.getValue(),
											"site" : airbus.mes.resourcepool.util.ModelManager.site,
											"name" : item.getCustomData()[5]
													.getValue(),
											"personalNo" : item.getCustomData()[0]
													.getValue(),
											"erpUserId" : item.getCustomData()[1]
													.getValue(),
											"assignedToRPName" : item
													.getCustomData()[3]
													.getValue(),
											"handle" : item.getCustomData()[9]
													.getValue(),
											"loanedToPool" : "",
											"loanedToRPName" : loaned_RP_Name,
											"type" : item.getCustomData()[8]
													.getValue()
										}
									else
										// If assigned to current resource
										// and may be loaned to other
										// resource
										var oJsonAvailableUsers = {
											"userId" : item.getCustomData()[7]
													.getValue(),
											"site" : airbus.mes.resourcepool.util.ModelManager.site,
											"name" : item.getCustomData()[5]
													.getValue(),
											"personalNo" : item.getCustomData()[0]
													.getValue(),
											"erpUserId" : item.getCustomData()[1]
													.getValue(),
											"assignedToRPName" : item
													.getCustomData()[3]
													.getValue(),
											"handle" : item.getCustomData()[9]
													.getValue(),
											"loanedToPool" : item
													.getCustomData()[2]
													.getValue(),
											"loanedToRPName" : loaned_RP_Name,
											"type" : item.getCustomData()[8]
													.getValue()
										}

										/*
										 * push prepared JSON Object to
										 * AvailableUsersModel
										 */
									sap.ui.getCore().getModel(
											"AvailableUsersModel").oData.Rowsets.Rowset[0].Row
											.push(oJsonAvailableUsers);
								});

						sap.ui.getCore().getModel("AvailableUsersModel")
								.refresh();

						/* remove all selection */
						this.getView().byId("listAllocatedUsers")
								.removeSelections();
						this.getView().byId("allAvailableUsers").setSelected(
								false);
						this.getView().byId("allAssignedUsers").setSelected(
								false);

						/* remove Users from AssignedUsersModel */
						var oModelAssignedUsers = sap.ui.getCore().getModel(
								"AssignedUsersModel").oData.Rowsets.Rowset[0].Row;

						for (var i = 0; i < aUsersToUnassign.length; i++) {
							for (var j = 0; j < oModelAssignedUsers.length; j++) {
								if (oModelAssignedUsers[j].USER_ID === aUsersToUnassign[i]
										.getCustomData()[7].getValue())
									oModelAssignedUsers.splice(j, 1);
							}
						}

						sap.ui.getCore().getModel("AssignedUsersModel")
								.refresh();
					},

					/***********************************************************
					 * triggers when assign button is clicked on WC Tab
					 **********************************************************/
					assignWorkCenter : function(evt) {

						var aWorkCenterToAssign = this.getView().byId(
								"listAvailableWorkCenter").getSelectedItems();
						/* If no selections are made when assigning show error */
						if (!aWorkCenterToAssign
								|| aWorkCenterToAssign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Toast",
											"",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty("NoSelections"),
											"")
							return;
						}
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
						/*
						 * if no data was present in AssignedWCModel then set an
						 * empty Row
						 */
						if (!sap.ui.getCore().getModel("AssignedWCModel").oData.Rowsets.Rowset[0].Row)
							sap.ui.getCore().getModel("AssignedWCModel").oData.Rowsets.Rowset[0].Row = [];

						/* for each WC selected to assign */
						aWorkCenterToAssign
								.forEach(function(item) {
									/*
									 * prepare a JSON object with all details of
									 * Assigned WC
									 */
									var oJsonAssignedWC = {
										"ASSIGNMENT_NAME" : item.getTitle(),
										"DESCRIPTION" : item.getDescription()
									}
									/*
									 * push JSON Object to AssignedWCModel
									 */
									sap.ui.getCore()
											.getModel("AssignedWCModel").oData.Rowsets.Rowset[0].Row
											.push(oJsonAssignedWC);
								});

						sap.ui.getCore().getModel("AssignedWCModel").refresh();

						/* remove all selections on screen */
						this.getView().byId("listAvailableWorkCenter")
								.removeSelections();
						this.getView().byId("allAvailableWC")
								.setSelected(false);
						this.getView().byId("allAssignedWC").setSelected(false);

						/* remove assigned WC from AvailableWCModel */
						var oModelAvailableWC = sap.ui.getCore().getModel(
								"AvailableWCModel").oData.Rowsets.Rowset[0].Row;

						for (var i = 0; i < aWorkCenterToAssign.length; i++) {
							for (var j = 0; j < oModelAvailableWC.length; j++) {
								if (oModelAvailableWC[j].WorkCenter == aWorkCenterToAssign[i]
										.getTitle()
										&& oModelAvailableWC[j].Description == aWorkCenterToAssign[i]
												.getDescription())
									oModelAvailableWC.splice(j, 1);
							}
						}

						sap.ui.getCore().getModel("AvailableWCModel").refresh();

					},

					/***********************************************************
					 * triggers when assign button is clicked on WC Tab
					 **********************************************************/
					unassignWorkCenter : function(evt) {

						var aWorkCenterToUnassign = this.getView().byId(
								"listAllocatedWorkCenter").getSelectedItems();

						if (!aWorkCenterToUnassign
								|| aWorkCenterToUnassign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Toast",
											"",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty("NoSelections"),
											"")
							return;
						}
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;

						if (!sap.ui.getCore().getModel("AvailableWCModel").oData.Rowsets.Rowset[0].Row)
							sap.ui.getCore().getModel("AvailableWCModel").oData.Rowsets.Rowset[0].Row = [];

						aWorkCenterToUnassign
								.forEach(function(item) {
									var oJsonAvailableWC = {
										"WorkCenter" : item.getTitle(),
										"Description" : item.getDescription()
									}

									sap.ui.getCore().getModel(
											"AvailableWCModel").oData.Rowsets.Rowset[0].Row
											.push(oJsonAvailableWC);
								});

						sap.ui.getCore().getModel("AvailableWCModel").refresh();

						this.getView().byId("listAllocatedWorkCenter")
								.removeSelections();
						this.getView().byId("allAssignedWC").setSelected(false);
						this.getView().byId("allAvailableWC")
								.setSelected(false);

						var oModelAssignedWC = sap.ui.getCore().getModel(
								"AssignedWCModel").oData.Rowsets.Rowset[0].Row;
						var length = sap.ui.getCore().getModel(
								"AssignedWCModel").oData.Rowsets.Rowset[0].Row.length
						for (var i = 0; i < aWorkCenterToUnassign.length; i++) {
							for (var j = 0; j < oModelAssignedWC.length; j++) {
								if (oModelAssignedWC[j].ASSIGNMENT_NAME === aWorkCenterToUnassign[i]
										.getTitle()
										&& oModelAssignedWC[j].DESCRIPTION === aWorkCenterToUnassign[i]
												.getDescription())
									oModelAssignedWC.splice(j, 1);
							}
						}

						sap.ui.getCore().getModel("AssignedWCModel").refresh();

					},

					/***********************************************************
					 * Select All the items when SelectAll CheckBox Clicked
					 **********************************************************/
					onSelectAllWC : function(oEvent) {

						var flag = oEvent.getSource().getSelected();
						var oList = oEvent.getSource().getParent().getParent()
								.getContent()[0];

						switch (oEvent.getSource().getId()) {

						/* for available WC List */
						case this.getView().byId("allAvailableWC").sId:
							if (flag)
								this.getView().byId("listAvailableWorkCenter")
										.selectAll();
							else
								this.getView().byId("listAvailableWorkCenter")
										.removeSelections();
							break;

						/* for Assigned WC List */
						case this.getView().byId("allAssignedWC").sId:
							if (flag)
								this.getView().byId("listAllocatedWorkCenter")
										.selectAll();
							else
								this.getView().byId("listAllocatedWorkCenter")
										.removeSelections();
							break;
						}

					},

					onSelectAllUsers : function(oEvent) {

						var flag = oEvent.getSource().getSelected();
						var oList = oEvent.getSource().getParent().getParent()
								.getContent()[0];

						switch (oEvent.getSource().getId()) {
						/* for Available Users List */
						case this.getView().byId("allAvailableUsers").sId:
							if (flag)
								this.getView().byId("listAvailableUsers")
										.selectAll();
							else
								this.getView().byId("listAvailableUsers")
										.removeSelections();
							break;

						/* for Assigned Users List */
						case this.getView().byId("allAssignedUsers").sId:
							if (flag)
								this.getView().byId("listAllocatedUsers")
										.selectAll();
							else
								this.getView().byId("listAllocatedUsers")
										.removeSelections();
							break;
						}
					},
					/***********************************************************
					 * Save Changes to Resource Pool
					 **********************************************************/
					saveChangesToResourcePool : function(oEvent) {

						/* show busy indicator as the process might be slow */
						sap.ui.core.BusyIndicator.show();
						/*
						 * clear all filters on Lists as it was creating problem
						 * in saving the list
						 */
						this.clearFilters();
						var aModelUsersData = this.saveAssignedUsers();
						var aModelWCData = this.saveAssignedWC();
						var aModelShifts = this.saveAssignedShifts();
						var aModelData = [];
						aModelData.push.apply(aModelData, aModelUsersData);
						aModelData.push.apply(aModelData, aModelWCData);
						aModelData.push.apply(aModelData, aModelShifts);

						airbus.mes.resourcepool.util.ModelManager
								.updateResourcePool(aModelData);
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = false;

						/* airbus.mes.resourcepool.util.ModelManager.loadMainViewModels(); */

					},

					saveAssignedUsers : function() {

						var aAssignedItems = this.getView().byId(
								"listAllocatedUsers").getItems();

						var aModelData = []
						for (var i = 0; i < aAssignedItems.length; i++) {

							var oJson = {
								"Type" : "U",
								"Name" : aAssignedItems[i].getCustomData()[7]
										.getValue(),
								"PersonalNo" : aAssignedItems[i]
										.getCustomData()[0].getValue(),
								"ERP_USER_ID" : aAssignedItems[i]
										.getCustomData()[1].getValue(),
								"ShiftStartDateTime" : "",
								"ShiftEndDateTime" : "",
								"ShiftValidFrom" : "",
								"ShiftValidTo" : "",
								"Description" : "",
								"LOANED_TO_POOL" : aAssignedItems[i]
										.getCustomData()[2].getValue()

							}
							aModelData.push(oJson);
						}

						return aModelData;
					},

					saveAssignedWC : function() {
						var aAssignedItems = this.getView().byId(
								"listAllocatedWorkCenter").getItems();

						var aModelData = [];
						for (var i = 0; i < aAssignedItems.length; i++) {

							var oJson = {
								"Type" : "WC",
								"Name" : aAssignedItems[i].getTitle(),
								"PersonalNo" : "",
								"ERP_USER_ID" : "",
								"ShiftStartDateTime" : "",
								"ShiftEndDateTime" : "",
								"ShiftValidFrom" : "",
								"ShiftValidTo" : "",
								"Description" : aAssignedItems[i]
										.getDescription(),
								"LOANED_TO_POOL" : ""
							}
							aModelData.push(oJson);
						}
						return aModelData;

					},

					saveAssignedShifts : function() {
						var aRows = this.getView().byId("shiftTable")
								.getItems();

						var aModelData = [];
						for (var i = 0; i < aRows.length; i++) {
							if (aRows[i].getCells()[5].getState() === true) {
								var oJson = {
									"Type" : "S",
									"Name" : aRows[i].getCells()[0].getText(),
									"PersonalNo" : "",
									"ERP_USER_ID" : "",
									"ShiftStartDateTime" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(aRows[i]
													.getCells()[1].getText()),
									"ShiftEndDateTime" : airbus.mes.resourcepool.util.Formatter
											.shiftHoursToTime(aRows[i]
													.getCells()[2].getText()),
									"ShiftValidFrom" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(aRows[i]
													.getCells()[3].getText()),
									"ShiftValidTo" : airbus.mes.resourcepool.util.Formatter
											.shiftDateToString(aRows[i]
													.getCells()[4].getText()),
									"Description" : "",
									"LOANED_TO_POOL" : ""
								}
								aModelData.push(oJson);
							}
						}
						return aModelData;

					},

					/**
					 * *************************** Back Button Press
					 * ********************************
					 */
					/*
					 * onBackPress : function() { if
					 * (airbus.mes.resourcepool.util.ModelManager.anyChangesFlag ==
					 * true) { if (!this.oDialog) { this.oDialog =
					 * sap.ui.xmlfragment(
					 * "airbus.mes.resourcepool.views.SaveChanges", this); }
					 * 
					 * this.oDialog.open(); } else { this.clearFilters();
					 * app.removePage(main); app.to(page);
					 * sap.ui.getCore().byId("idSearchView--resourcePool")
					 * .setValue(airbus.mes.resourcepool.util.ModelManager.resourceName);
					 * sap.ui.getCore().byId("idSearchView--description")
					 * .setValue(airbus.mes.resourcepool.util.ModelManager.resourceDescription); //
					 * app.removePage("idMainView"); //
					 * sap.ui.getCore().byId("idMainView").destroy(); } },
					 * 
					 * saveChangesUsingDialog : function() {
					 * this.saveChangesToResourcePool(); this.oDialog.close();
					 * this.clearFilters(); app.removePage(main); app.to(page); },
					 * 
					 * afterDialogClose : function() {
					 * airbus.mes.resourcepool.util.ModelManager.anyChangesFlag =
					 * false; this.oDialog.close(); this.clearFilters();
					 * app.removePage(main); app.to(page); //
					 * app.removePage("idMainView"); //
					 * sap.ui.getCore().byId("idMainView").destroy(); },
					 * 
					 * afterDialogCancel : function() { this.oDialog.close(); },
					 */

					/**
					 * *************Search Functions for Users and Work
					 * Centers***************
					 */
					onSearchUsers : function(oEvt) {

						// add filter for search
						var aFilters = [];
						var sQuery = oEvt.getSource().getValue();
						var oList = oEvt.getSource().getParent().getParent()
								.getContent()[0].getItems()[0];
						var binding = oList.getBinding("items");
						// console.log('Search '+sQuery);
						if (sQuery && sQuery.length > 0) {
							var filter1 = new sap.ui.model.Filter("USER_ID",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter1);

							var filter2 = new sap.ui.model.Filter(
									"PERSONAL_NO",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter2);

							var filter3 = new sap.ui.model.Filter(
									"ERP_USER_ID",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter3);

							var filter4 = new sap.ui.model.Filter("FNAME",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter4);

							var filter5 = new sap.ui.model.Filter("LNAME",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter5);
							binding.filter(new sap.ui.model.Filter(aFilters,
									false), "Control");
						}
						// update list binding
						else {
							binding.filter();
						}
					},

					onSearchAvailableWC : function(oEvt) {

						// add filter for search
						var aFilters = [];
						var sQuery = oEvt.getSource().getValue();
						var oList = this.getView().byId(
								"listAvailableWorkCenter");
						var binding = oList.getBinding("items");

						if (sQuery && sQuery.length > 0) {
							var filter1 = new sap.ui.model.Filter("WorkCenter",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter1);

							var filter2 = new sap.ui.model.Filter(
									"Description",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter2);

							binding.filter(new sap.ui.model.Filter(aFilters,
									false), "Control");
						}
						// update list binding
						else {
							binding.filter();
						}
					},

					onSearchAssignedWC : function(oEvt) {

						// add filter for search
						var aFilters = [];
						var sQuery = oEvt.getSource().getValue();
						var oList = this.getView().byId(
								"listAllocatedWorkCenter");

						var binding = oList.getBinding("items");

						if (sQuery && sQuery.length > 0) {
							var filter1 = new sap.ui.model.Filter(
									"ASSIGNMENT_NAME",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter1);

							var filter2 = new sap.ui.model.Filter(
									"DESCRIPTION",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter2);

							binding.filter(new sap.ui.model.Filter(aFilters,
									false), "Control");
						}
						// update list binding
						else {
							binding.filter();
						}
					},

					showHelp : function(oEvent) {

						if (airbus.mes.resourcepool.help === undefined) {

							airbus.mes.resourcepool.help = sap.ui.xmlfragment(
									"resourcePoolHelp",
									"airbus.mes.resourcepool.views.Help",
									airbus.mes.resourcepool.oView
											.getController());
							airbus.mes.resourcepool.oView
									.addDependent(airbus.mes.resourcepool.help);
						}
						airbus.mes.resourcepool.help.open();

					},

					afterHelpOK : function() {
						airbus.mes.resourcepool.help.close();
					},

					/***********************************************************
					 * Open Search Resource Pool Dialogue
					 **********************************************************/
					openSelectResourcePool : function(oEvent) {
						if (airbus.mes.resourcepool.searchResourcePool === undefined) {

							airbus.mes.resourcepool.searchResourcePool = sap.ui
									.xmlfragment(
											"searchResourcePool",
											"airbus.mes.resourcepool.views.Search",
											airbus.mes.resourcepool.oView
													.getController());
							airbus.mes.resourcepool.oView
									.addDependent(airbus.mes.resourcepool.searchResourcePool);
						}
						airbus.mes.resourcepool.searchResourcePool.open();
						sap.ui
								.getCore()
								.byId("searchResourcePool--site")
								.setText(
										airbus.mes.resourcepool.util.ModelManager.site);
						sap.ui
								.getCore()
								.byId("searchResourcePool--resourcePool")
								.setValue(
										airbus.mes.resourcepool.util.ModelManager.resourceName);
						sap.ui
								.getCore()
								.byId("searchResourcePool--description")
								.setValue(
										airbus.mes.resourcepool.util.ModelManager.resourceDescription);

						/* Attach focus out event to resource pool field */
						airbus.mes.resourcepool.util.ModelManager.currentView = this
								.getView();
						var oInputResource = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool");
						oInputResource.attachBrowserEvent("focusout",
								this.onFocusOutOfResourcePool, this);
					},

					cancelForm : function(oEvt) {
						if (airbus.mes.resourcepool.util.ModelManager.resourceName === undefined
								|| airbus.mes.resourcepool.util.ModelManager.resourceName == "") {
							nav.back();
						}
					},

					closeForm : function() {
						airbus.mes.resourcepool.searchResourcePool.close();
					},

					/***********************************************************
					 * Triggers when user focus out from resource pool field
					 * 
					 * @returns {Boolean} : false: resource pool does not
					 *          exists, true: resource pool exists
					 **********************************************************/
					onFocusOutOfResourcePool : function() {
						var resource = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool").getValue();

						var oButton = sap.ui.getCore().byId(
								"searchResourcePool--createOrDeleteButton");
						/*
						 * if resource pool is empty , create button will be
						 * shown
						 */
						if (resource === "") {

							sap.ui.getCore().byId(
									"searchResourcePool--description")
									.setValue("");
							oButton.setIcon("sap-icon://create");
							oButton.setTooltip("create");
							return;

						}
						/* search resource pool description in existing list */
						var value = this.searchValueHelp(resource);

						/*
						 * if description not exists - means resource pool does
						 * not exists
						 */
						if (!value) {
							/* message displayed according to roles */
							if (airbus.mes.shell.RoleManager
									.isAllowed('MII_MOD1684_PRODMNG')
									|| airbus.mes.shell.RoleManager
											.isAllowed('MII_MOD1684_MANUFMNG')
									|| airbus.mes.shell.RoleManager
											.isAllowed('MII_MOD1684_HOOPE')
									|| airbus.mes.shell.RoleManager
											.isAllowed('MII_MOD1684_MFTEAM')) {
								airbus.mes.resourcepool.util.ModelManager
										.showMessage(
												"Strip",
												"Error",
												airbus.mes.resourcepool.oView
														.getModel("i18nModel")
														.getProperty(
																"ResourceNotExists")
														+ airbus.mes.resourcepool.oView
																.getModel(
																		"i18nModel")
																.getProperty(
																		"CreateNewOne"),
												true);
							} else {
								airbus.mes.resourcepool.util.ModelManager
										.showMessage(
												"Strip",
												"Error",
												airbus.mes.resourcepool.oView
														.getModel("i18nModel")
														.getProperty(
																"ResourceNotExists"));
							}
							/*
							 * resource pool not exists- clear description and
							 * set create icon
							 */
							sap.ui.getCore().byId(
									"searchResourcePool--description").focus();
							sap.ui.getCore().byId(
									"searchResourcePool--description")
									.setValue("");
							oButton.setIcon("sap-icon://create");
							oButton.setTooltip("create");
							return false;
						} else {
							/*
							 * resource pool exists- show description and set
							 * delete button
							 */
							sap.ui.getCore().byId(
									"searchResourcePool--description")
									.setValue(value);
							oButton.setIcon("sap-icon://delete");
							oButton.setTooltip("delete");
							return true;
						}
					},

					/***********************************************************
					 * Show Value help on resource pool field
					 **********************************************************/
					showValueHelp : function(oEvent) {
						if (airbus.mes.resourcepool.valueHelp === undefined) {

							airbus.mes.resourcepool.valueHelp = sap.ui
									.xmlfragment(
											"valueHelp",
											"airbus.mes.resourcepool.views.valueHelp",
											airbus.mes.resourcepool.oView
													.getController());
							airbus.mes.resourcepool.oView
									.addDependent(airbus.mes.resourcepool.valueHelp);
						}
						airbus.mes.resourcepool.valueHelp.open();
					},

					/***********************************************************
					 * 
					 * Close Value Help on clicking close button
					 **********************************************************/
					handleCloseValueHelp : function(oEvt) {
						/*
						 * if
						 * (airbus.mes.resourcepool.util.ModelManager.resourceName
						 * === undefined ||
						 * airbus.mes.resourcepool.util.ModelManager.resourceName ==
						 * "") { this.openSelectResourcePool();
						 * airbus.mes.resourcepool.util.ModelManager
						 * .showMessage( "Toast", "",
						 * airbus.mes.resourcepool.oView .getModel("i18nModel")
						 * .getProperty("RPMandatory"), "", 5000); }
						 * 
						 * else
						 */
						oEvt.getSource().getBinding("items").filter([]);
					},

					/***********************************************************
					 * triggers when search is clicked on search field in value
					 * help
					 * 
					 * @param oEvt :
					 *            search on the search field of value help
					 **********************************************************/
					onSearch : function(oEvt) {

						// add filter for search
						var aFilters = [];
						var sQuery = oEvt.getParameter("value");
						if (sQuery && sQuery.length > 0) {
							var filter = new sap.ui.model.Filter("NAME",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter);
						}

						// update list binding
						var oDialog = sap.ui.getCore().byId("selectDialog");
						var binding = oDialog.getBinding("items");
						binding.filter(aFilters, "Application");
					},

					/***********************************************************
					 * handle selected value in the value help
					 * 
					 **********************************************************/
					handleSelectedValue : function(oEvt) {
						/*
						 * fill resource pool field and description field with
						 * selected item
						 */
						var oSelectedItem = oEvt.getParameter("selectedItem");
						var oResourcePool = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool");
						var oDescription = sap.ui.getCore().byId(
								"searchResourcePool--description");
						var oButton = sap.ui.getCore().byId(
								"searchResourcePool--createOrDeleteButton");

						oResourcePool.setValue(oSelectedItem.getTitle());
						oDescription.setValue(oSelectedItem.getDescription());

						this.resourcePoolName = oResourcePool.getValue();
						this.resourcePoolDescription = oDescription.getValue();

						/* set create or delete buton based on some conditions */
						if (!oResourcePool) {
							oButton.setIcon("sap-icon://create");
							oButton.setTooltip("create");
						} else {
							oButton.setIcon("sap-icon://delete");
							oButton.setTooltip("delete");
						}
						/* clear search filter for each case */
						oEvt.getSource().getBinding("items").filter([]);

					},

					/***********************************************************
					 * triggers when create or delete button is clicked
					 * 
					 * @param oEvent :
					 *            button event
					 **********************************************************/
					createOrDeleteResource : function(oEvent) {

						/* get the value on the screen in variables */
						var resourcePool = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool").getValue();
						var description = sap.ui.getCore().byId(
								"searchResourcePool--description").getValue();
						var oButton = sap.ui.getCore().byId(
								"searchResourcePool--createOrDeleteButton");

						/* check mandatory parameters are filled */
						if (this.checkMandatoryParam(resourcePool, description))
							return;
						/*
						 * Special Characters are not allowed in resource pool
						 * name
						 */
						if (/^[a-zA-Z0-9-_ ]*$/.test(resourcePool) == false) {
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Strip",
											"Error",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty(
															"NoSpecialCharacter"),
											true);
							return;
						}

						/* if create button is clicked */
						if (oEvent.getSource().getIcon() === "sap-icon://create") {

							/* call createResource() */
							var anyError = airbus.mes.resourcepool.util.ModelManager
									.createResource(sap.ui.getCore().byId(
											"searchResourcePool--resourcePool")
											.getValue(), sap.ui.getCore().byId(
											"searchResourcePool--description")
											.getValue());

							/* if no error is returned, set button to delete */
							if (anyError == 0) {
								oButton.setIcon("sap-icon://delete");
								oButton.setTooltip("delete");
							}
							/* if delete button is clicked */
						} else if (oEvent.getSource().getIcon() === "sap-icon://delete") {

							/* open DeleteConfirmation dialog before deleting */
							this.oDeleteDialogue();

						}
					},

					/***********************************************************
					 * triggers when Save button is clicked on the screen
					 * 
					 * @returns {Number} 0: if not error in updating else 1.
					 **********************************************************/
					updateResource : function() {

						var resourcePool = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool").getValue();
						var description = sap.ui.getCore().byId(
								"searchResourcePool--description").getValue();

						/*
						 * check mandatory paramaters are filled before
						 * proceeding to update
						 */
						if (this.checkMandatoryParam(resourcePool, description))
							return;

						/*
						 * call updateResource() method from
						 * airbus.mes.resourcepool.util.ModelManager.
						 */
						var anyError = airbus.mes.resourcepool.util.ModelManager
								.updateResource(resourcePool, description);
						airbus.mes.resourcepool.util.ModelManager
								.loadModelValueHelp();
						/* if no error is returned return 0 */
						if (anyError == 0) {

							/* Set the title header of the main page */
							if (resourcePool == airbus.mes.resourcepool.util.ModelManager.resourceName) {
								airbus.mes.resourcepool.util.ModelManager.resourceDescription = description;
								this
										.getView()
										.byId("resourcePoolName")
										.setText(
												airbus.mes.resourcepool.util.ModelManager.site
														+ " / "
														+ airbus.mes.resourcepool.util.ModelManager.resourceName
														+ " / "
														+ airbus.mes.resourcepool.util.ModelManager.resourceDescription);
							}

							return 0;
						}

						/*
						 * if 1 is returned, means resource pool does not
						 * exists, create new one by calling createResource()
						 */
						else if (anyError == 1)
							var error = airbus.mes.resourcepool.util.ModelManager
									.createResource(resourcePool, description);
						/* if creation is successful return 0 */
						if (error == 0)
							return 0;
						/* if creation is not successful return 1 */
						else
							return 1;

					},

					/***********************************************************
					 * function triggers when form is submitted
					 **********************************************************/
					submitForm : function(oEvt) {

						airbus.mes.resourcepool.util.ModelManager
								.loadModelValueHelp();

						var resourcePool = sap.ui.getCore().byId(
								"searchResourcePool--resourcePool").getValue();
						var description = sap.ui.getCore().byId(
								"searchResourcePool--description").getValue();
						/* Check Mandatory parameters are filled */
						if (this.checkMandatoryParam(resourcePool, description))
							return;

						/* decide action on submitting form */
						var action = this.checkResourcePool(resourcePool,
								description);

						switch (action) {

						/* 0: everything is perfect to move to next screen */
						case 0:
							this.resourcePoolName = sap.ui.getCore().byId(
									"searchResourcePool--resourcePool")
									.getValue();
							this.resourcePoolDescription = sap.ui.getCore()
									.byId("searchResourcePool--description")
									.getValue();
							this.loadMainPage();
							break;

						/* 1: the entered resource pool does not exists */
						case 1:
							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Strip",
											"Error",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty(
															"ResourceNotExists"),
											true);
							break;

						/*
						 * 2: description is changed on the screen for the
						 * resource pool
						 */
						case 2:

							if (airbus.mes.resourcepool.oUpdateDialog === undefined) {

								airbus.mes.resourcepool.oUpdateDialog = sap.ui
										.xmlfragment(
												"updateDialogue",
												"airbus.mes.resourcepool.views.updateDescription",
												airbus.mes.resourcepool.oView
														.getController());
								airbus.mes.resourcepool.oView
										.addDependent(airbus.mes.resourcepool.oUpdateDialog);
							}

							// Open
							airbus.mes.resourcepool.oUpdateDialog.open();

						}
					},

					/***********************************************************
					 * update description using dialog box
					 **********************************************************/
					updateDescriptionUsingDialog : function() {

						airbus.mes.resourcepool.oUpdateDialog.close();
						/*
						 * call updateResource() from
						 * airbus.mes.resourcepool.util.ModelManager
						 */
						var anyError = this.updateResource();
						/* if no error is returned then load main page */
						if (anyError == 0) {
							this.resourcePoolName = sap.ui.getCore().byId(
									"searchResourcePool--resourcePool")
									.getValue();
							this.resourcePoolDescription = sap.ui.getCore()
									.byId("searchResourcePool--description")
									.getValue();
							this.loadMainPage();
						}

					},

					/***********************************************************
					 * Triggers on "No" of Update Dialog
					 **********************************************************/
					afterUpdateDialogClose : function() {
						/*
						 * load main page if user dont want to save the
						 * description
						 */
						airbus.mes.resourcepool.oUpdateDialog.close();
						this.loadMainPage();
					},

					/***********************************************************
					 * Triggers when user clicks "Cancel" on update dialog
					 **********************************************************/
					afterUpdateDialogCancel : function() {
						airbus.mes.resourcepool.oUpdateDialog.close();
					},

					/***********************************************************
					 * Load the Main page of RPM to maintain the resource pool
					 **********************************************************/
					loadMainPage : function() {
						/* Set Model Manager Global Variables */
						airbus.mes.resourcepool.util.ModelManager.resourceName = this.resourcePoolName;
						airbus.mes.resourcepool.util.ModelManager.resourceDescription = this.resourcePoolDescription;

						/* Set the title header of the main page */
						this
								.getView()
								.byId("resourcePoolName")
								.setText(
										airbus.mes.resourcepool.util.ModelManager.site
												+ " / "
												+ airbus.mes.resourcepool.util.ModelManager.resourceName
												+ " / "
												+ airbus.mes.resourcepool.util.ModelManager.resourceDescription);

						/* take the current view in a variable */
						airbus.mes.resourcepool.util.ModelManager.currentView = this
								.getView();

						/* load all models and move to main page */
						airbus.mes.resourcepool.util.ModelManager
								.loadMainViewModels();

						// Close Search Resource Pool Pop-Up
						if (airbus.mes.resourcepool.searchResourcePool)
							airbus.mes.resourcepool.searchResourcePool.close();

					},

					titleCase : function(str) {
						var splitStr = str.toLowerCase().split(' ');
						for (var i = 0; i < splitStr.length; i++) {
							// You do not need to check if i is larger than
							// splitStr length, as your for does that for you
							// Assign it back to the array
							splitStr[i] = splitStr[i].charAt(0).toUpperCase()
									+ splitStr[i].substring(1);
						}
						// Directly return the joined string
						return splitStr.join(' ');
					},

					clearFilters : function() {
						this.getView().byId("searchAvailableUsers").clear();
						this.getView().byId("searchAssignedUsers").clear();
						this.getView().byId("searchAvailableWC").clear();
						this.getView().byId("searchAssignedWC").clear();
					},

					/*
					 * editTeamOpen : function() { if
					 * (airbus.mes.resourcepool.editTeam === undefined) {
					 * 
					 * airbus.mes.resourcepool.editTeam = sap.ui .xmlfragment(
					 * "editTeam", "airbus.mes.resourcepool.views.editTeam",
					 * airbus.mes.resourcepool.oView .getController());
					 * airbus.mes.resourcepool.oView
					 * .addDependent(airbus.mes.resourcepool.editTeam); }
					 *  // Open airbus.mes.resourcepool.editTeam.open();
					 *  // Set Site, Resource Pool name and Description
					 * sap.ui.getCore().byId("editTeam--site").setText(
					 * airbus.mes.resourcepool.util.ModelManager.site); sap.ui
					 * .getCore() .byId("editTeam--resourcePoolName") .setText(
					 * airbus.mes.resourcepool.util.ModelManager.resourceName);
					 * sap.ui .getCore() .byId("editTeam--description")
					 * .setValue(
					 * airbus.mes.resourcepool.util.ModelManager.resourceDescription); },
					 * 
					 * editTeamClose : function() {
					 * airbus.mes.resourcepool.editTeam.close(); },
					 */

					/***********************************************************
					 * Triggers when Save button is clicked on the Pop-Up
					 * 
					 * @returns {Number} 0: if not error in updating else 1.
					 **********************************************************/
					saveResourcePool : function() {

						var resourcePool = sap.ui.getCore().byId(
								"editTeam--resourcePoolName").getText();
						var description = sap.ui.getCore().byId(
								"editTeam--description").getValue();

						/*
						 * check mandatory paramater's are filled before
						 * proceeding to update
						 */
						if (this.checkMandatoryParam(resourcePool, description))
							return;
						airbus.mes.resourcepool.util.ModelManager.resourceName = resourcePool;
						airbus.mes.resourcepool.util.ModelManager.resourceDescription = description;

						/*
						 * call updateResource() method from
						 * airbus.mes.resourcepool.util.ModelManager.
						 */
						var anyError = airbus.mes.resourcepool.util.ModelManager
								.updateResource();

					},

					oDeleteDialogue : function() {
						if (airbus.mes.resourcepool.deleteTeam === undefined) {

							airbus.mes.resourcepool.deleteTeam = sap.ui
									.xmlfragment(
											"deleteTeam",
											"airbus.mes.resourcepool.views.DeleteConfirmation",
											airbus.mes.resourcepool.oView
													.getController());
							airbus.mes.resourcepool.oView
									.addDependent(airbus.mes.resourcepool.deleteTeam);
						}

						// Open
						airbus.mes.resourcepool.deleteTeam.open();
					},

					/***********************************************************
					 * Triggers when "Yes" is pressed on delete dialog
					 **********************************************************/
					deleteResourcePool : function() {
						/* call deleteResource() from ModelManager */
						var anyError = airbus.mes.resourcepool.util.ModelManager
								.deleteResource(sap.ui.getCore().byId(
										"searchResourcePool--resourcePool")
										.getValue());
						airbus.mes.resourcepool.deleteTeam.close();

						if (airbus.mes.resourcepool.util.ModelManager.resourceName == sap.ui
								.getCore().byId(
										"searchResourcePool--resourcePool")
								.getValue()) {
							airbus.mes.resourcepool.util.ModelManager.resourceName = undefined;
							airbus.mes.resourcepool.util.ModelManager.resourceDescription = undefined;
							this.getView().byId("resourcePoolName").setText("");
						}

					},

					/***********************************************************
					 * Triggers on "No" of Update Dialog
					 **********************************************************/
					deleteDialogueClose : function() {
						airbus.mes.resourcepool.deleteTeam.close();
					},

					/***********************************************************
					 * Check mandatory parameters before taking any actions
					 **********************************************************/
					checkMandatoryParam : function(resourcePool, description) {
						/* if resource pool is empty display error and return */
						if (!resourcePool) {

							airbus.mes.resourcepool.util.ModelManager
									.showMessage("Strip", "Error",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty(
															"EmptyResource"),
											true);

							return true;
						}

						/* if description is empty display error and return */
						if (!description) {

							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Strip",
											"Error",
											airbus.mes.resourcepool.oView
													.getModel("i18nModel")
													.getProperty(
															"EmptyDescription"),
											true);

							return true;
						}
					},

					/***********************************************************
					 * Converts the resource pool name to upper case
					 **********************************************************/
					upperCaseConversion : function(oEvt) {
						oEvt.getSource().setValue(
								oEvt.getSource().getValue().toUpperCase())
					},

					/***********************************************************
					 * Check resource pool exists
					 * 
					 * @param ResourcePool
					 * @param Description
					 * @returns {Number} 0: if exists 1: if does not exists 2:
					 *          if description is changed
					 **********************************************************/
					checkResourcePool : function(ResourcePool, Description) {

						var actualDescription = this
								.searchValueHelp(ResourcePool);

						if (!actualDescription) {
							return 1;
						}
						if (actualDescription != Description) {
							return 2;
						}

						return 0;
					},

					/***********************************************************
					 * function used to search resource pool in existing
					 * resource pools
					 **********************************************************/
					searchValueHelp : function(oValue) {

						var oModelData = sap.ui.getCore().getModel(
								"ValueHelpModel").getProperty(
								"/Rowsets/Rowset/0/Row");
						if (oModelData) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].NAME === oValue) {
									return oModelData[i].DESCRIPTION;
								}
							}
						}

					},

					afterNavigate : function(oEvt) {

						// if(oEvt.getParameters().toId == "idUsersView"){
						// this.getView().byId("availableUsersPanel").rerender();
						// this.getView().byId("assignedUsersPanel").rerender();
						// }
						//
						// else if (oEvt.getParameters().toId ==
						// "idWorkCenterView"){
						// this.getView().byId("availableWCPanel").rerender();
						// this.getView().byId("assignedWCPanel").rerender();
						// }
					},

					onNavBack : function(oEvent) {
						nav.back();
					}
				});