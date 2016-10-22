sap.ui
		.controller(
				"airbus.mes.resourcepool.views.Main",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf resource_pool.Main
					 */
					/*
					 * onInit: function() { },
					 */

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
									"SHIFT_BEGIN" : util.Formatter
											.shiftHoursToTime(oItemAssign
													.getCells()[1].getText()),
									"SHIFT_END" : util.Formatter
											.shiftHoursToTime(oItemAssign
													.getCells()[2].getText()),
									"VALID_FROM" : util.Formatter
											.shiftDateToString(oItemAssign
													.getCells()[3].getText()),
									"VALID_TO" : util.Formatter
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
									"SHIFT_BEGIN" : util.Formatter
											.shiftHoursToTime(oListOfItems
													.getItems()[i].getCells()[1]
													.getText()),
									"SHIFT_END" : util.Formatter
											.shiftHoursToTime(oListOfItems
													.getItems()[i].getCells()[2]
													.getText()),
									"VALID_FROM" : util.Formatter
											.shiftDateToString(oListOfItems
													.getItems()[i].getCells()[3]
													.getText()),
									"VALID_TO" : util.Formatter
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
						var aUsersToAssign = sap.ui.getCore().byId(
								"idMainView--listAvailableUsers")
								.getSelectedItems();

						var aError = [];

						/* If no selections are made when assigning show error */
						if (!aUsersToAssign || aUsersToAssign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager.showMessage("Toast", "",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("NoSelections"), "")
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
									if (item.getCustomData()[2].getValue() != "---"
											&& item.getCustomData()[3].getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
										aError.push(item);
									else {
										/*
										 * prepare a JSON object with all
										 * details of Assigned User
										 */
										//var info = item.getInfo().split("/ ");
										//var name = item.getCustomData()[3].getValue();
										var loaned_RP_Name = item.getCustomData()[4].getValue()?item.getCustomData()[4].getValue():"";

										var oJsonAssignedUsers = {
											"USER_ID" : item.getCustomData()[7].getValue(),
											"SITE" : airbus.mes.resourcepool.util.ModelManager.site,
											"NAME" : item.getCustomData()[3].getValue(),
											"PERSONAL_NO" : item.getCustomData()[0].getValue(),
											"ERP_USER_ID" : item.getCustomData()[1].getValue(),
											"FNAME" : item.getCustomData()[5].getValue(),
											"LNAME" : item.getCustomData()[6].getValue(),
											"LOANED_TO_POOL" : item.getCustomData()[2].getValue(),
											"LOANED_RP_NAME" : loaned_RP_Name
										}
										/*
										 * push JSON Object to
										 * AssignedUsersModel
										 */
										sap.ui.getCore().getModel(
												"AssignedUsersModel").oData.Rowsets.Rowset[0].Row
												.push(oJsonAssignedUsers);
									}
								});

						sap.ui.getCore().getModel("AssignedUsersModel")
								.refresh();
						/* remove all selections on screen */
						sap.ui.getCore().byId("idMainView--listAvailableUsers")
								.removeSelections();
						sap.ui.getCore().byId("idMainView--allAvailableUsers")
								.setSelected(false);
						sap.ui.getCore().byId("idMainView--allAssignedUsers")
								.setSelected(false);

						/* remove assigned users from AvailableUsersModel */
						var oModelAvailableUsers = sap.ui.getCore().getModel(
								"AvailableUsersModel").oData.Rowsets.Rowset[0].Row;

						for (var i = 0; i < aUsersToAssign.length; i++) {
							if (aUsersToAssign[i].getCustomData()[2].getValue() != "---" && aUsersToAssign[i].getCustomData()[3].getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
								continue;
							for (var j = 0; j < oModelAvailableUsers.length; j++) {
								if (oModelAvailableUsers[j].USER_ID == aUsersToAssign[i].getCustomData()[7].getValue())
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
						if (!this.oMessageDialog) {
							this.oMessageDialog = sap.ui.xmlfragment(
									"airbus.mes.resourcepool.views.messageDialog", this);
						}
						this.oMessageDialog.open();
						for (var i = 0; i < aError.length; i++) {
							this.oMessageDialog.getContent()[0]
									.addItem(new sap.m.Text(
											{
												text : airbus.mes.resourcepool.util.ModelManager.i18nModel
														.getProperty("User")
														+ " "
														+ this.titleCase(aError[i].getCustomData()[5].getValue() +" "+ aError[i].getCustomData()[6].getValue())
														+ " "
														+ airbus.mes.resourcepool.util.ModelManager.i18nModel.getProperty("AssignedToResourcePool")
														+ " "
														+ aError[i].getCustomData()[3].getValue()
														+ " "
														+ airbus.mes.resourcepool.util.ModelManager.i18nModel.getProperty("LoanedToResourcePool")
														+ aError[i].getCustomData()[4].getValue()

											}));
						}

					},

					/***********************************************************
					 * triggers when OK is pressed on Message Dialog which
					 * appeared while assigning users
					 **********************************************************/
					afterMessageDialogClose : function() {
						this.oMessageDialog.getContent()[0].removeAllItems();
						this.oMessageDialog.close();
					},

					/***********************************************************
					 * Triggers when unAssign button is clicked on the Users tab
					 **********************************************************/
					unassignUsers : function(evt) {
						var aUsersToUnassign = sap.ui.getCore().byId(
								"idMainView--listAllocatedUsers")
								.getSelectedItems();
						/*
						 * show error message when no users are selected when
						 * unassigning
						 */
						if (!aUsersToUnassign || aUsersToUnassign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager.showMessage("Toast", "",airbus.mes.resourcepool.util.ModelManager.i18nModel.getProperty("NoSelections"), "")
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
									var loaned_RP_Name = item.getCustomData()[4].getValue()?item.getCustomData()[4].getValue():"";

									if (item.getCustomData()[3].getValue() != airbus.mes.resourcepool.util.ModelManager.resourceName)
										// If Loaned to current resource
										var oJsonAvailableUsers = {
											"USER_ID" : item.getCustomData()[7].getValue(),
											"SITE" : airbus.mes.resourcepool.util.ModelManager.site,
											"NAME" : item.getCustomData()[3].getValue(),
											"PERSONAL_NO" : item.getCustomData()[0].getValue(),
											"ERP_USER_ID" : item.getCustomData()[1].getValue(),
											"FNAME" : item.getCustomData()[5].getValue(),
											"LNAME" : item.getCustomData()[6].getValue(),
											"LOANED_TO_POOL" : "---",
											"LOANED_RP_NAME" : loaned_RP_Name
										}
									else
										// If assigned to current resource
										// and may be loaned to other
										// resource
										var oJsonAvailableUsers = {
											"USER_ID" : item.getCustomData()[7].getValue(),
											"SITE" : airbus.mes.resourcepool.util.ModelManager.site,
											"NAME" : item.getCustomData()[3].getValue(),
											"PERSONAL_NO" : item.getCustomData()[0].getValue(),
											"ERP_USER_ID" : item.getCustomData()[1].getValue(),
											"FNAME" : item.getCustomData()[5].getValue(),
											"LNAME" : item.getCustomData()[6].getValue(),
											"LOANED_TO_POOL" : item.getCustomData()[2].getValue(),
											"LOANED_RP_NAME" : loaned_RP_Name
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
						sap.ui.getCore().byId("idMainView--listAllocatedUsers")
								.removeSelections();
						sap.ui.getCore().byId("idMainView--allAvailableUsers")
								.setSelected(false);
						sap.ui.getCore().byId("idMainView--allAssignedUsers")
								.setSelected(false);

						/* remove Users from AssignedUsersModel */
						var oModelAssignedUsers = sap.ui.getCore().getModel(
								"AssignedUsersModel").oData.Rowsets.Rowset[0].Row;

						for (var i = 0; i < aUsersToUnassign.length; i++) {
							for (var j = 0; j < oModelAssignedUsers.length; j++) {
								if (oModelAssignedUsers[j].USER_ID === aUsersToUnassign[i].getCustomData()[7].getValue())
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

						var aWorkCenterToAssign = sap.ui.getCore().byId(
								"idMainView--listAvailableWorkCenter")
								.getSelectedItems();
						/* If no selections are made when assigning show error */
						if (!aWorkCenterToAssign
								|| aWorkCenterToAssign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager.showMessage("Toast", "",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("NoSelections"), "")
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
						sap.ui.getCore().byId(
								"idMainView--listAvailableWorkCenter")
								.removeSelections();
						sap.ui.getCore().byId("idMainView--allAvailableWC")
								.setSelected(false);
						sap.ui.getCore().byId("idMainView--allAssignedWC")
								.setSelected(false);

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

						var aWorkCenterToUnassign = sap.ui.getCore().byId(
								"idMainView--listAllocatedWorkCenter")
								.getSelectedItems();
						if (!aWorkCenterToUnassign
								|| aWorkCenterToUnassign.length == 0) {
							airbus.mes.resourcepool.util.ModelManager.showMessage("Toast", "",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("NoSelections"), "")
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
						sap.ui.getCore().byId(
								"idMainView--listAllocatedWorkCenter")
								.removeSelections();
						sap.ui.getCore().byId("idMainView--allAssignedWC")
								.setSelected(false);
						sap.ui.getCore().byId("idMainView--allAvailableWC")
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
					onSelectAll : function(oEvent) {

						var flag = oEvent.getSource().getSelected();
						var oList = oEvent.getSource().getParent().getParent()
								.getContent()[0];

						switch (oEvent.getSource().getId()) {
						/* for Available Users List */
						case "idMainView--allAvailableUsers":
							if (flag)
								sap.ui.getCore().byId(
										"idMainView--listAvailableUsers")
										.selectAll();
							else
								sap.ui.getCore().byId(
										"idMainView--listAvailableUsers")
										.removeSelections();
							break;
						/* for Assigned Users List */
						case "idMainView--allAssignedUsers":
							if (flag)
								sap.ui.getCore().byId(
										"idMainView--listAllocatedUsers")
										.selectAll();
							else
								sap.ui.getCore().byId(
										"idMainView--listAllocatedUsers")
										.removeSelections();
							break;
						/* for available WC List */
						case "idMainView--allAvailableWC":
							if (flag)
								sap.ui.getCore().byId(
										"idMainView--listAvailableWorkCenter")
										.selectAll();
							else
								sap.ui.getCore().byId(
										"idMainView--listAvailableWorkCenter")
										.removeSelections();
							break;
						/* for Assigned WC List */
						case "idMainView--allAssignedWC":
							if (flag)
								sap.ui.getCore().byId(
										"idMainView--listAllocatedWorkCenter")
										.selectAll();
							else
								sap.ui.getCore().byId(
										"idMainView--listAllocatedWorkCenter")
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

						airbus.mes.resourcepool.util.ModelManager.updateResourcePool(aModelData);
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = false;

						/* airbus.mes.resourcepool.util.ModelManager.loadMainViewModels(); */

					},

					saveAssignedUsers : function() {

						var aAssignedItems = sap.ui.getCore().byId(
								"idMainView--listAllocatedUsers").getItems();

						var aModelData = []
						for (var i = 0; i < aAssignedItems.length; i++) {

							var oJson = {
								"Type" : "U",
								"Name" : aAssignedItems[i].getCustomData()[7].getValue(),
								"PersonalNo" : aAssignedItems[i].getCustomData()[0].getValue(),
								"ERP_USER_ID" : aAssignedItems[i].getCustomData()[1].getValue(),
								"ShiftStartDateTime" : "",
								"ShiftEndDateTime" : "",
								"ShiftValidFrom" : "",
								"ShiftValidTo" : "",
								"Description" : "",
								"LOANED_TO_POOL" : aAssignedItems[i].getCustomData()[2].getValue()

							}
							aModelData.push(oJson);
						}

						return aModelData;
					},

					saveAssignedWC : function() {
						var aAssignedItems = sap.ui.getCore().byId(
								"idMainView--listAllocatedWorkCenter")
								.getItems();

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
						var aRows = sap.ui.getCore().byId(
								"idMainView--shiftTable").getItems();

						var aModelData = [];
						for (var i = 0; i < aRows.length; i++) {
							if (aRows[i].getCells()[5].getState() === true) {
								var oJson = {
									"Type" : "S",
									"Name" : aRows[i].getCells()[0].getText(),
									"PersonalNo" : "",
									"ERP_USER_ID" : "",
									"ShiftStartDateTime" : util.Formatter
											.shiftHoursToTime(aRows[i]
													.getCells()[1].getText()),
									"ShiftEndDateTime" : util.Formatter
											.shiftHoursToTime(aRows[i]
													.getCells()[2].getText()),
									"ShiftValidFrom" : util.Formatter
											.shiftDateToString(aRows[i]
													.getCells()[3].getText()),
									"ShiftValidTo" : util.Formatter
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
					onBackPress : function() {
						if (airbus.mes.resourcepool.util.ModelManager.anyChangesFlag == true) {
							if (!this.oDialog) {
								this.oDialog = sap.ui.xmlfragment(
										"airbus.mes.resourcepool.views.SaveChanges", this);
							}

							this.oDialog.open();
						} else {
							this.clearFilters();
							app.removePage(main);
							app.to(page);
							sap.ui.getCore().byId("idSearchView--resourcePool")
									.setValue(airbus.mes.resourcepool.util.ModelManager.resourceName);
							sap.ui.getCore().byId("idSearchView--description")
									.setValue(airbus.mes.resourcepool.util.ModelManager.resourceDescription);
							// app.removePage("idMainView");
							// sap.ui.getCore().byId("idMainView").destroy();
						}
					},

					saveChangesUsingDialog : function() {
						this.saveChangesToResourcePool();
						this.oDialog.close();
						this.clearFilters();
						app.removePage(main);
						app.to(page);

					},

					afterDialogClose : function() {
						airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = false;
						this.oDialog.close();
						this.clearFilters();
						app.removePage(main);
						app.to(page);
						// app.removePage("idMainView");
						// sap.ui.getCore().byId("idMainView").destroy();
					},

					afterDialogCancel : function() {
						this.oDialog.close();
					},

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
						var oList = sap.ui.getCore().byId(
								"idMainView--listAvailableWorkCenter");
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
						var oList = sap.ui.getCore().byId(
								"idMainView--listAllocatedWorkCenter");
						;
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

						if (!this.oHelpDialog) {
							this.oHelpDialog = sap.ui.xmlfragment(
									"airbus.mes.resourcepool.views.Help", this);
						}
						this.oHelpDialog.open();
						switch (oEvent.getSource().getId()) {
						case "idMainView--helpAvailableUsers":
							sap.ui.getCore().byId("helpText").setText(
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("helpUsers"));
							break;

						case "idMainView--helpAssignedUsers":
							sap.ui.getCore().byId("helpText").setText(
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("helpUsers"));
							break;
						case "idMainView--helpAvailableWC":
							sap.ui.getCore().byId("helpText").setText(
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("helpWC"));
							break;
						case "idMainView--helpAssignedWC":
							sap.ui.getCore().byId("helpText").setText(
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("helpWC"));
							break;
						}

					},

					afterHelpOK : function() {
						this.oHelpDialog.close();
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
						sap.ui.getCore().byId(
								"idMainView--searchAvailableUsers").clear();
						sap.ui.getCore()
								.byId("idMainView--searchAssignedUsers")
								.clear();
						sap.ui.getCore().byId("idMainView--searchAvailableWC")
								.clear();
						sap.ui.getCore().byId("idMainView--searchAssignedWC")
								.clear();
					}

				});