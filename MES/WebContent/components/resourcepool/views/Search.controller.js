sap.ui
		.controller(
				"airbus.mes.resourcepool.views.Search",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf resource_pool.Search
					 */
					/*
					 * onInit : function() { },
					 */

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf resource_pool.Search
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
					 * @memberOf resource_pool.Search
					 */
					onAfterRendering : function() {
						/* Attach focus out event to resource pool field */
						airbus.mes.resourcepool.util.ModelManager.currentView = this.getView();
						var oInputResource = this.getView()
								.byId("resourcePool");
						oInputResource.attachBrowserEvent("focusout",
								this.onFocusOutOfResourcePool, this);
					},

					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf resource_pool.Search
					 */
					// onExit: function() {
					//
					// }
					/***********************************************************
					 * Show Value help on resource pool field
					 **********************************************************/

					showValueHelp : function(oEvent) {
						if (!this._oDialog) {
							this._oDialog = sap.ui.xmlfragment(
									"resource_pool.valueHelp", this);

						}
						airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();
						this._oDialog.open();
					},

					/***********************************************************
					 * Triggers when user focus out from resource pool field
					 * 
					 * @returns {Boolean} : false: resource pool does not
					 *          exists, true: resource pool exists
					 **********************************************************/
					onFocusOutOfResourcePool : function() {
						var resource = this.getView().byId("resourcePool")
								.getValue();

						var oButton = this.getView().byId(
								"createOrDeleteButton");
						/*
						 * if resource pool is empty , create button will be
						 * shown
						 */
						if (resource === "") {

							this.getView().byId("description").setValue("");
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
							if (RoleManager.isAllowed('MII_MOD1684_PRODMNG')
									|| RoleManager
											.isAllowed('MII_MOD1684_MANUFMNG')
									|| RoleManager
											.isAllowed('MII_MOD1684_HOOPE')
									|| RoleManager
											.isAllowed('MII_MOD1684_MFTEAM')) {
								airbus.mes.resourcepool.util.ModelManager
										.showMessage(
												"Strip",
												"Error",
												airbus.mes.resourcepool.util.ModelManager.i18nModel
														.getProperty("ResourceNotExists")
														+ airbus.mes.resourcepool.util.ModelManager.i18nModel
																.getProperty("CreateNewOne"),
												true);
							} else {
								airbus.mes.resourcepool.util.ModelManager
										.showMessage(
												"Strip",
												"Error",
												airbus.mes.resourcepool.util.ModelManager.i18nModel
														.getProperty("ResourceNotExists"));
							}
							/*
							 * resource pool not exists- clear description and
							 * set create icon
							 */
							this.getView().byId("description").focus();
							this.getView().byId("description").setValue("");
							oButton.setIcon("sap-icon://create");
							oButton.setTooltip("create");
							return false;
						} else {
							/*
							 * resource pool exists- show description and set
							 * delete button
							 */
							this.getView().byId("description").setValue(value);
							oButton.setIcon("sap-icon://delete");
							oButton.setTooltip("delete");
							return true;
						}
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

					/***********************************************************
					 * function triggers when form is submitted
					 **********************************************************/
					submitForm : function(oEvt) {

						airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();

						var resourcePool = this.getView().byId("resourcePool")
								.getValue();
						var description = this.getView().byId("description")
								.getValue();
						/* Check Mandatory parameters are filled */
						if (this.checkMandatoryParam(resourcePool, description))
							return;

						/* decide action on submitting form */
						var action = this.checkResourcePool(resourcePool,
								description);

						switch (action) {
						/* 0: everything is perfect to move to next screen */
						case 0:
							airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
									"idSearchView--site").getText();
							airbus.mes.resourcepool.util.ModelManager.resourceName = sap.ui.getCore().byId(
									"idSearchView--resourcePool").getValue();
							airbus.mes.resourcepool.util.ModelManager.resourceDescription = sap.ui.getCore()
									.byId("idSearchView--description")
									.getValue();
							this.loadMainPage();
							break;
						/* 1: the entered resource pool does not exists */
						case 1:
							airbus.mes.resourcepool.util.ModelManager.showMessage("Strip", "Error",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("ResourceNotExists"),
									true);
							break;
						/*
						 * 2: description is changed on the screen for the
						 * resource pool
						 */
						case 2:

							/* Popup to confirm update changes */
							if (!this.oUpdateDialog) {
								this.oUpdateDialog = sap.ui
										.xmlfragment(
												"resource_pool.updateDescription",
												this);
							}
							this.oUpdateDialog.open();

						}
					},

					/***********************************************************
					 * Load the Main page of RPM to maintain the resource pool
					 **********************************************************/
					loadMainPage : function() {
						/* load all models and move to main page */
						airbus.mes.resourcepool.util.ModelManager.loadMainViewModels();
						app.addPage(main);
						app.to(main);

						/* set the title header of the main page */
						sap.ui
								.getCore()
								.byId("idMainView--customHeaderTitle")
								.setText(
										airbus.mes.resourcepool.util.ModelManager.site
												+ " / "
												+ airbus.mes.resourcepool.util.ModelManager.resourceName
												+ " / "
												+ airbus.mes.resourcepool.util.ModelManager.resourceDescription);

						/* take the current view in a variable */
						airbus.mes.resourcepool.util.ModelManager.currentView = sap.ui.getCore().byId(
								"idMainView");
						
					},

					/***********************************************************
					 * check mandatory parameters before taking any actions
					 **********************************************************/
					checkMandatoryParam : function(resourcePool, description) {
						/* if resource pool is empty display error and return */
						if (!resourcePool) {

							airbus.mes.resourcepool.util.ModelManager
									.showMessage(
											"Strip",
											"Error",
											airbus.mes.resourcepool.util.ModelManager.i18nModel
													.getProperty("EmptyResource"),
											true);

							return true;
						}
						/* if description is empty display error and return */
						if (!description) {

							airbus.mes.resourcepool.util.ModelManager.showMessage("Strip", "Error",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("EmptyDescription"),
									true);

							return true;
						}
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
								'idSearchView--resourcePool');
						var oDescription = sap.ui.getCore().byId(
								'idSearchView--description');
						var oButton = this.getView().byId(
								"createOrDeleteButton");
						oResourcePool.setValue(oSelectedItem.getTitle());
						oDescription.setValue(oSelectedItem.getDescription());

						/*
						 * load three global variables with site, resource pool
						 * name and its description
						 */
						airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
								"idSearchView--site").getText();
						airbus.mes.resourcepool.util.ModelManager.resourceName = oResourcePool.getValue();
						airbus.mes.resourcepool.util.ModelManager.resourceDescription = oDescription
								.getValue();

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
					 * 
					 * Close Value Help on clicking close button
					 **********************************************************/
					handleCloseValueHelp : function(oEvt) {
						oEvt.getSource().getBinding("items").filter([]);
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
					 * triggers when create or delete button is clicked
					 * 
					 * @param oEvent :
					 *            button event
					 **********************************************************/
					createOrDeleteResource : function(oEvent) {

						/* get the value on the screen in variables */
						var resourcePool = this.getView().byId("resourcePool")
								.getValue();
						var description = this.getView().byId("description")
								.getValue();
						var oButton = this.getView().byId(
								"createOrDeleteButton");

						/* check mandatory parameters are filled */
						if (this.checkMandatoryParam(resourcePool, description))
							return;
						/*
						 * Special Characters are not allowed in resource pool
						 * name
						 */
						if (/^[a-zA-Z0-9-_ ]*$/.test(resourcePool) == false) {
							airbus.mes.resourcepool.util.ModelManager.showMessage("Strip", "Error",
									airbus.mes.resourcepool.util.ModelManager.i18nModel
											.getProperty("NoSpecialCharacter"),
									true);
							return;
						}

						/* if create button is clicked */
						if (oEvent.getSource().getIcon() === "sap-icon://create") {

							airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
									"idSearchView--site").getText();
							airbus.mes.resourcepool.util.ModelManager.resourceName = sap.ui.getCore().byId(
									"idSearchView--resourcePool").getValue();
							airbus.mes.resourcepool.util.ModelManager.resourceDescription = sap.ui.getCore()
									.byId("idSearchView--description")
									.getValue();
							/* call createResource() */
							var anyError = airbus.mes.resourcepool.util.ModelManager.createResource();

							/* if no error is returned, set button to delete */
							if (anyError == 0) {
								oButton.setIcon("sap-icon://delete");
								oButton.setTooltip("delete");
							}
							/* if delete button is clicked */
						} else if (oEvent.getSource().getIcon() === "sap-icon://delete") {

							/* open DeleteConfirmation dialog before deleting */
							if (!this.oDeleteDialog) {
								this.oDeleteDialog = sap.ui.xmlfragment(
										"resource_pool.DeleteConfirmation",
										this);
							}
							this.oDeleteDialog.open();

						}
					},
					/***********************************************************
					 * triggers when Save button is clicked on the screen
					 * 
					 * @returns {Number} 0: if not error in updating else 1.
					 **********************************************************/
					updateResource : function() {

						var resourcePool = this.getView().byId("resourcePool")
								.getValue();
						var description = this.getView().byId("description")
								.getValue();

						/*
						 * check mandatory paramaters are filled before
						 * proceeding to update
						 */
						if (this.checkMandatoryParam(resourcePool, description))
							return;
						airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
								"idSearchView--site").getText();
						airbus.mes.resourcepool.util.ModelManager.resourceName = sap.ui.getCore().byId(
								"idSearchView--resourcePool").getValue();
						airbus.mes.resourcepool.util.ModelManager.resourceDescription = sap.ui.getCore()
								.byId("idSearchView--description").getValue();
						/* call updateResource() method from airbus.mes.resourcepool.util.ModelManager. */
						var anyError = airbus.mes.resourcepool.util.ModelManager.updateResource();
						airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();
						/* if no error is returned return 0 */
						if (anyError == 0)
							return 0;
						/*
						 * if 1 is returned, means resource pool does not
						 * exists, create new one by calling createResource()
						 */
						else if (anyError == 1)
							var error = airbus.mes.resourcepool.util.ModelManager.createResource();
						/* if creation is successful return 0 */
						if (error == 0)
							return 0;
						/* if creation is not successful return 1 */
						else
							return 1;

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
					 * update description using dialog box
					 **********************************************************/
					updateDescriptionUsingDialog : function() {

						this.oUpdateDialog.close();
						/* call updateResource() from airbus.mes.resourcepool.util.ModelManager */
						var anyError = this.updateResource();
						/* if no error is returned then load main page */
						if (anyError == 0) {
							airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
									"idSearchView--site").getText();
							airbus.mes.resourcepool.util.ModelManager.resourceName = sap.ui.getCore().byId(
									"idSearchView--resourcePool").getValue();
							airbus.mes.resourcepool.util.ModelManager.resourceDescription = sap.ui.getCore()
									.byId("idSearchView--description")
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
						this.loadMainPage();
						this.oUpdateDialog.close();
					},

					/***********************************************************
					 * Triggers when user clicks "Cancel" on update dialog
					 **********************************************************/
					afterUpdateDialogCancel : function() {
						this.oUpdateDialog.close();
					},

					/***********************************************************
					 * Triggers when "Yes" is pressed on delete dialog
					 **********************************************************/
					deleteResourceUsingDialog : function() {
						var oButton = this.getView().byId(
								"createOrDeleteButton");
						airbus.mes.resourcepool.util.ModelManager.site = sap.ui.getCore().byId(
								"idSearchView--site").getText();
						airbus.mes.resourcepool.util.ModelManager.resourceName = sap.ui.getCore().byId(
								"idSearchView--resourcePool").getValue();
						airbus.mes.resourcepool.util.ModelManager.resourceDescription = sap.ui.getCore()
								.byId("idSearchView--description").getValue();

						/* call deleteResource() from ModelManager */
						var anyError = airbus.mes.resourcepool.util.ModelManager.deleteResource();
						/* if no error is returned then set create button */
						if (anyError == 0) {
							oButton.setIcon("sap-icon://create");
							oButton.setTooltip("create");
							this.getView().byId("resourcePool").setValue("");
							this.getView().byId("description").setValue("");
						}
						this.oDeleteDialog.close();
					},

					/***********************************************************
					 * Triggers when "Cancel" is clicked on delete dialog
					 **********************************************************/
					afterDeleteDialogCancel : function() {
						this.oDeleteDialog.close();
					},

					/***********************************************************
					 * Converts the resource pool name to upper case
					 **********************************************************/
					upperCaseConversion : function(oEvt) {
						oEvt.getSource().setValue(
								oEvt.getSource().getValue().toUpperCase())
					}

				});