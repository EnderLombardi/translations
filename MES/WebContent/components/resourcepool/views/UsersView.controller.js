sap.ui
		.controller(
				"airbus.mes.resourcepool.views.UsersView",
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

					/*
					 * onInit : function() { },
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
										// var info = item.getInfo().split("/
										// ");
										// var name =
										// item.getCustomData()[3].getValue();
										var loaned_RP_Name = item
												.getCustomData()[4].getValue() ? item
												.getCustomData()[4].getValue()
												: "";

										var oJsonAssignedUsers = {
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
							if (aUsersToAssign[i].getCustomData()[2].getValue() != "---"
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
					}
				});