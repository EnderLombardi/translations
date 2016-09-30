sap.ui
		.controller(
				"airbus.polypoly",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf polypoly.main
					 */
					onInit : function() {
						var miiModel = new sap.ui.model.json.JSONModel();
						sap.ui.getCore().setModel(miiModel, "mii");
						airbus.mes.polypoly.PolypolyManager.getPolypolyModel("F1","1","10","CHES");
						sap.ui.getCore().getModel("mii")
								.attachRequestCompleted(
										airbus.mes.polypoly.PolypolyManager.onModelLoaded);
						needLevelsmodel = new sap.ui.model.json.JSONModel(
								"./model/needlevels.json");
						sap.ui.getCore()
								.setModel(needLevelsmodel, "needlevels");
						columnModel = new sap.ui.model.json.JSONModel();
						listQAmodel = new sap.ui.model.json.JSONModel(
								airbus.mes.polypoly.PolypolyManager.urlModel
										.getProperty("urlgetqalist"));
						sap.ui.getCore().setModel(listQAmodel, "listQA");
					},

					createColumn : function(sId, oContext) {
						var that = this;
						switch (oContext.getProperty("type")) {
						case "rp_id":
							var oColumn = new sap.ui.table.Column({
								id : "rp_id",
								visible : false,
								filterProperty : oContext
										.getProperty("techname"),
								showFilterMenuEntry : false,
								width : "2rem",
								template : new sap.m.Text({
									text : {
										parts : [ oContext
												.getProperty("techname") ],
										formatter : function(text) {
											return text;
										}
									},
								})
							})
							break;
						case "type":
							var oColumn = new sap.ui.table.Column({
								id : "typeRow",
								visible : false,
								filterProperty : oContext
										.getProperty("techname"),
								showFilterMenuEntry : false,
								width : "2rem",
								template : new sap.m.Text({
									text : {
										parts : [ oContext
												.getProperty("techname") ],
										formatter : function(text) {
											return text;
										}
									},
								})
							})
							break;
						case "ressourcepool":
							var oColumn = new sap.ui.table.Column({
								id : oContext.getProperty("type"),
								filterProperty : oContext
										.getProperty("techname"),
								showFilterMenuEntry : false,
								width : "8rem",
								template : new sap.m.Text({
									visible : {
										parts : [ "type" ],
										formatter : function(type) {
											if (type == "NEED") {
												return false;
											} else {
												return true;
											}
										}
									},
									text : {
										parts : [ oContext
												.getProperty("techname") ],
										formatter : function(text) {
											return text;
										}
									},
								})
							})
							break;
						case "category":
							var oColumn = new sap.ui.table.Column({
								id : oContext.getProperty("type"),
								filterProperty : oContext
										.getProperty("techname"),
								showFilterMenuEntry : false,
								width : "8rem",
								template : new sap.m.Text({
									text : {
										parts : [ oContext
												.getProperty("techname") ],
										formatter : function(text) {
											return text;
										}
									},
								})
							})
							break;
						case "selected":
							var oColumn = new sap.ui.table.Column(
									{
										id : oContext.getProperty("type"),
										filterProperty : oContext
												.getProperty("techname"),
										showFilterMenuEntry : false,
										width : "3rem",
										// visible: false,
										visible : PolypolyManager.globalContext.tabSelected !== "polypoly",
										template : new sap.m.CheckBox(
												{
													selected : "{selected}",
													select : sap.ui
															.getCore()
															.byId(
																	"polypolyView")
															.getController().onUserAllocate
												})
									})
							break;
						case "icon":
							var oColumn = new sap.ui.table.Column(
									{
										hAlign : "Center",
										width : "3rem",
										template : new sap.m.VBox(
												{
													items : [
															new sap.ui.core.Icon(
																	{
																		size : "1.7rem",
																		tooltip : "{icon}",
																		src : {
																			parts : [ "icon" ],
																			formatter : formatter.iconFormatterAffectation
																		},
																		color : {
																			parts : [ "icon" ],
																			formatter : formatter.colorFormatterAffectation
																		},
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type == "UA_NCI" || type == "UA_CI" || type == "UA_NA" || type == "UA_PA" || type == "UA_NCD"
																			}
																		}
																	}),
															new sap.m.Image(
																	{
																		src : {
																			parts : [ "icon" ],
																			formatter : function(
																					level) {
																				var sURI = "";
																				if (level == "0"
																						|| level == "1"
																						|| level == "2"
																						|| level == "3"
																						|| level == "4") {
																					sURI = "images/"
																							+ level
																							+ ".PNG";
																				}
																				return sURI
																			},
																		},
																		height : "1.5rem",
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type != "UA_NCI" && type != "UA_CI" && type != "UA_NA" && type != "UA_PA" && type != "UA_NCD"
																			}
																		}
																	}) ]
												})
									});
							break;
						case "column":
							// Only display Edit and remove buttons if Polypoly
							// editable
							if (formatter.isPolypolyEditable()) {
								var aMultiLabels = [ new sap.m.HBox({
									justifyContent : "SpaceAround",
									items : [ new sap.ui.core.Icon({
										src : "sap-icon://edit",
										size : "1rem",
										hoverColor : "DeepSkyBlue",
										tooltip : "Edit",
										press : function(oEvt) {
											that.openColumnPopup(oEvt)
										}
									}), new sap.ui.core.Icon({
										src : "sap-icon://less",
										size : "1rem",
										hoverColor : "Red",
										tooltip : "Remove",
										press : function(oEvt) {
											that.openConfirmDelete(oEvt)
										}
									}), ]
								}) ]
							} else {
								var aMultiLabels = []
							}
							aMultiLabels.push(new sap.m.Label({
								text : oContext.getProperty("techname"),
								design : "Bold",
								tooltip : oContext.getProperty("techname"),
							}));
							aMultiLabels.push(new sap.m.Label({
								text : oContext.getProperty("name"),
								design : "Bold",
								tooltip : oContext.getProperty("name"),
							}));
							// Only display QA in Tab Polypoly
							if (PolypolyManager.globalContext.tabSelected == "polypoly") {
								oContext.getProperty("qa").forEach(
										function(el) {
											var oQALabel = new sap.m.Label({
												text : el.label
											});
											aMultiLabels.push(oQALabel);
										});
							}

							var oColumn = new sap.ui.table.Column(
									{
										id : sId,
										hAlign : "Center",
										width : "7rem",
										multiLabels : [ aMultiLabels ],
										template : new sap.m.VBox(
												{
													items : [
															new sap.m.Select(
																	{
																		change : function(
																				oEvt) {
																			that
																					.onSelectLevelChange(oEvt);
																		},
																		items : {
																			path : "needlevels>/levels",
																			templateShareable : true,
																			template : new sap.ui.core.Item(
																					{
																						key : "{needlevels>key}",
																						text : "{needlevels>text}",
																					}),
																		},
																		selectedKey : {
																			parts : [ oContext
																					.getProperty("techname") ],
																			formatter : function(
																					text) {
																				return text;
																			}
																		},
																		textAlign : "Center",
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type == "NEED"
																			},

																		},
																		enabled : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return formatter
																						.isPolypolyEditable();
																			},
																		},
																	}),
															new sap.m.Text(
																	{
																		text : {
																			parts : [ oContext
																					.getProperty("techname") ],
																			formatter : function(
																					text) {
																				return text;
																			}
																		},
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type == "ASIS"
																			}
																		}
																	}),
															new sap.m.Button(
																	{
																		icon : {
																			parts : [ oContext
																					.getProperty("techname") ],
																			formatter : function(
																					level) {
																				var sURI = "";
																				if (level == "0"
																						|| level == "1"
																						|| level == "2"
																						|| level == "3"
																						|| level == "4") {
																					sURI = "images/"
																							+ level
																							+ ".PNG";
																				}
																				return sURI
																			}
																		},
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type == "UA_NCI" || type == "UA_CI" || type == "UA_NA" || type == "UA_PA" || type == "UA_NCD"
																			}
																		},
																		press : function(
																				oEvt) {
																			that
																					.onImgClick(oEvt)
																		},
																	}),
															new sap.m.Button(
																	{
																		text : {
																			parts : [ oContext
																					.getProperty("techname") ],
																			formatter : function(
																					text) {
																				return text;
																			}
																		},
																		type : {
																			parts : [ oContext
																					.getProperty("techname") ],
																			formatter : function(
																					value) {
																				if (value < 0) {
																					return "Reject";
																				} else {
																					return "Accept";
																				}
																				;
																			}
																		},
																		enabled : false,
																		visible : {
																			parts : [ "type" ],
																			formatter : function(
																					type) {
																				return type == "GAP"
																			}
																		},
																	}), ]
												})
									});
							break;
						}
						;
						return oColumn
					},

					onImgClick : function(oEvt) {
						var that = this;
						if (formatter.isPolypolyEditable()) {
							PolypolyManager.userComptencyContext.rowBindingContext = oEvt
									.getSource().getBindingContext();
							PolypolyManager.userComptencyContext.columnIndex = oEvt
									.getSource().getParent().getParent()
									.getCells().indexOf(
											oEvt.getSource().getParent());
							var oPopover = new sap.m.Popover({
								showHeader : false,
								content : [ new sap.m.VBox({
									alignItems : "Center",
									items : [ new sap.m.Button({
										icon : "images/0.PNG",
										press : function(oEvt) {
											that.onChangeClick(oEvt)
										}
									}), new sap.m.Button({
										icon : "images/1.PNG",
										press : function(oEvt) {
											that.onChangeClick(oEvt)
										}
									}), new sap.m.Button({
										icon : "images/2.PNG",
										press : function(oEvt) {
											that.onChangeClick(oEvt)
										}
									}), new sap.m.Button({
										icon : "images/3.PNG",
										press : function(oEvt) {
											that.onChangeClick(oEvt)
										}
									}), new sap.m.Button({
										icon : "images/4.PNG",
										press : function(oEvt) {
											that.onChangeClick(oEvt)
										}
									}) ]
								}) ],
							});
							oPopover.openBy(sap.ui.getCore().byId(
									oEvt.getSource().getId()));
						}
					},

					onChangeClick : function(oEvt) {
						PolypolyManager.userComptencyContext.newLevel = oEvt
								.getSource().getParent().getItems().indexOf(
										oEvt.getSource());
						PolypolyManager.updateLevelInit();
					},

					onSelectLevelChange : function(oEvt) {
						var oModel = sap.ui.getCore().byId("polypolyView")
								.getModel();
						var columnData = oModel.getData().columns[oEvt
								.getSource().getParent().getParent().getCells()
								.indexOf(oEvt.getSource().getParent()) + 3];
						var sPath = oEvt.getSource().getBindingContext()
								.getPath();
						var sNeed = oEvt.getSource().getBindingContext()
								.getProperty("icon");

						if (sNeed == "3") {
							var sNeed3 = ""
									+ oEvt.getSource().getSelectedIndex();
							var sNeed4 = oModel.oData.rows[1][columnData.techname];
						} else {
							var sNeed3 = oModel.oData.rows[0][columnData.techname];
							var sNeed4 = ""
									+ oEvt.getSource().getSelectedIndex();
						}

						var sName = columnData.name;
						var sTechname = columnData.techname;
						var sQA = columnData.qa.map(function(el) {
							return el.label;
						}).toString();

						PolypolyManager.updateColumn(sName, sQA, sNeed3,
								sNeed4, sTechname);
					},

					filterUA : function() {
						if (sap.ui.getCore().byId("typeRow") && sap.ui.getCore().byId("FilterClockedUsers")){
							var filterUA;
							if(sap.ui.getCore().byId("FilterClockedUsers").getSelected())
								filterUA = new sap.ui.model.Filter("type", "EQ", "UA_CI","UA_NCD");
							else
								filterUA = new sap.ui.model.Filter("type", "Contains", "UA_");
							sap.ui.getCore().byId("polypolyView").byId(
									"oTablePolypoly").getBinding("rows")
									.filter(filterUA);
						}
//						if (sap.ui.getCore().byId("typeRow")) {
//							sap.ui.getCore().byId("typeRow").filter("UA_P");
//						}
						var oView = sap.ui.getCore().byId("polypolyView");
						var oTable = oView.byId("oTablePolypoly");
						oTable.setFixedRowCount(0);
						oTable.setVisibleRowCount(8);
					},

					onRPSuggest : function(oEvt) {
						var value = oEvt.getParameter("suggestValue");
						var filters = [];
						if (value) {
							filters = [ new sap.ui.model.Filter(
									"rp_id",
									function(sText) {
										return (sText || "").toUpperCase()
												.indexOf(value.toUpperCase()) > -1;
									}) ]
						}
						;
						sap.ui.getCore().byId("polypolyView").byId(
								"polypolySearchField").getBinding(
								"suggestionItems").filter(filters);
						sap.ui.getCore().byId("polypolyView").byId(
								"polypolySearchField").suggest();
						sap.ui.getCore().byId("polypolyView").getController()
								.onRPSearch(oEvt);
					},

					onRPSearch : function(oEvt) {
						/*
						 * var item = oEvt.getParameter("suggestionItem"); if
						 * (item) {
						 * sap.ui.getCore().byId("rp_id").filter(item.getText()); }
						 * else { sap.ui.getCore().byId("rp_id").filter(""); }
						 */

						var value = oEvt.getSource().getValue();
						var filterUA;
						/* to show users based on clocked in Status */
						if (sap.ui.getCore().byId("FilterClockedUsers") && sap.ui.getCore().byId("FilterClockedUsers").getSelected() === true)
							filterUA = new sap.ui.model.Filter("type", "EQ","UA_CI", "UA_NCD");
						else
							filterUA = new sap.ui.model.Filter("type","Contains", "UA_");
						
						if (value && value.length > 0) {
							var filterRes = new sap.ui.model.Filter("ressourcepoolId", "Contains", value);
							if (PolypolyManager.globalContext.tabSelected == "allocation") {
								var filters = new sap.ui.model.Filter([ filterUA, filterRes ], true);
								sap.ui.getCore().byId("polypolyView").byId("oTablePolypoly").getBinding("rows").filter(filters);
							} else {
								sap.ui.getCore().byId("polypolyView").byId("oTablePolypoly").getBinding("rows").filter(filterRes);
							}

						} else {

							if (PolypolyManager.globalContext.tabSelected == "allocation") {
								sap.ui.getCore().byId("polypolyView").byId("oTablePolypoly").getBinding("rows").filter(filterUA);
							} else
								sap.ui.getCore().byId("polypolyView").byId("oTablePolypoly").getBinding("rows").filter();
						}
					},

					// filterRessourcePool : function(str){
					// sap.ui.getCore().byId("rp_id").filter(str);
					// },

					clearFilters : function() {
						if (sap.ui.getCore().byId("typeRow")) {
							sap.ui.getCore().byId("typeRow").filter("");
						}
						if (sap.ui.getCore().byId("rp_id")) {
							sap.ui.getCore().byId("rp_id").filter("");
						}
						if (sap.ui.getCore().byId("polypolyView").byId(
								"oTablePolypoly").getBinding("rows")) {
							sap.ui.getCore().byId("polypolyView").byId(
									"oTablePolypoly").getBinding("rows")
									.filter();
							sap.ui.getCore().byId("polypolyView").byId(
									"polypolySearchField").setValue();
						}
						var oView = sap.ui.getCore().byId("polypolyView");
						var oTable = oView.byId("oTablePolypoly");
						oTable.setFixedRowCount(2);
						oTable.setVisibleRowCount(10);
					},

					colDialog : undefined,
					openColumnPopup : function(oEvt) {
						columnModel.setData();
						var that = this;

						var aQAList = jQuery
								.extend(true, [], sap.ui.getCore().getModel(
										"listQA").oData.Rowsets.Rowset[0].Row);
						if (!that.colDialog) {
							that.colDialog = sap.ui.xmlfragment(
									"airbus.ColumnPopup", that);
						}
						var oBindingInfo = oEvt.getSource().getParent()
								.getParent().getBindingContext();
						if (oBindingInfo != undefined) {
							PolypolyManager.internalContext.saveContext = "UPDATE";
							that.colDialog.setTitle("Edit Polypoly");

							var aQASelList = oBindingInfo.getProperty("qa");
							columnModel
									.setData({
										competency : oBindingInfo
												.getProperty("name"),
										techname : oBindingInfo
												.getProperty("techname"),
										qa : aQAList,
										need3 : PolypolyManager.internalContext.oModel.oData.rows[0][oBindingInfo
												.getProperty("techname")],
										need4 : PolypolyManager.internalContext.oModel.oData.rows[1][oBindingInfo
												.getProperty("techname")]
									});
							aQASelList
									.forEach(function(el) {
										for (var i = 0; i < columnModel.oData.qa.length; i++) {
											if (columnModel.oData.qa[i].CERTIFICATION == el.label) {
												columnModel.oData.qa[i].selected = true;
											} else if (columnModel.oData.qa[i].selected == undefined) {
												columnModel.oData.qa[i].selected = false;
											}
										}
									});
						} else {
							PolypolyManager.internalContext.saveContext = "CREATE";
							that.colDialog.setTitle("Create Polypoly");
							columnModel.setData({
								competency : "",
								techname : "",
								qa : aQAList,
								need3 : "0",
								need4 : "0"
							});
							columnModel.oData.qa.forEach(function(el) {
								el.selected = false;
							})
						}
						that.colDialog.setModel(columnModel, "columnModel");
						that.colDialog.open();

						sap.ui
								.getCore()
								.byId("colTechname")
								.setEditable(
										(PolypolyManager.internalContext.saveContext == "CREATE"));

						// Sort QA Column on selected Checkboxes
						sap.ui.getCore().byId("colQA").sort("Descending")

					},

					onSearch : function(oEvt) {
						// add filter for search
						var aFilters = [];
						var sQuery = oEvt.getSource().getValue();
						if (sQuery && sQuery.length > 0) {
							var filter = new sap.ui.model.Filter(
									"CERTIFICATION",
									sap.ui.model.FilterOperator.Contains,
									sQuery);
							aFilters.push(filter);
						}

						// update list binding
						var table = sap.ui.getCore().byId("oQATable");
						var binding = table.getBinding("rows");
						binding.filter(aFilters);
					},

					onSaveColumnPopup : function() {
						var sTechname = columnModel.oData.techname
								.toUpperCase();
						var sName = columnModel.oData.competency;
						var sNeed3 = columnModel.oData.need3;
						var sNeed4 = columnModel.oData.need4;
						var aQAfiltered = columnModel.oData.qa.filter(
								function(el) {
									return el.selected;
								}).map(function(el) {
							return el.CERTIFICATION;
						});
						var sQA = aQAfiltered.toString();

						if (aQAfiltered.length <= 5 && sTechname != ""
								&& sName != "") {
							if (PolypolyManager.internalContext.saveContext == "CREATE") {
								PolypolyManager.createColumn(sName, sQA,
										sNeed3, sNeed4, sTechname);
							} else {
								PolypolyManager.updateColumn(sName, sQA,
										sNeed3, sNeed4, sTechname);
							}
						} else if (sTechname == "") {
							sap.m.MessageToast
									.show("Please enter a Technical Name");
						} else if (sName == "") {
							sap.m.MessageToast
									.show("Please enter a Competency description");
						} else if (aQAfiltered.length > 5) {
							sap.m.MessageToast
									.show("Please select no more than 5 Quality Authorisations");
						}
					},

					onCancelColumnPopup : function() {
						sap.ui.getCore().byId("columnPopupDialog").close();
					},

					openConfirmDelete : function(oEvt) {
						columnModel.setData();
						var oBindingInfo = oEvt.getSource().getParent()
								.getParent().getBindingContext();
						columnModel.setData({
							techname : oBindingInfo.getProperty("techname"),
						});

						var that = this;
						if (!that.delDialog) {
							that.delDialog = sap.ui.xmlfragment(
									"airbus.confirmDelete", that);
						}
						that.delDialog.open();
					},

					onConfirmDelete : function() {
						PolypolyManager
								.deleteColumn(columnModel.getData().techname);
					},

					onCancelDelete : function() {
						sap.ui.getCore().byId("confirmDeleteDialog").close();
					},

					onClickInfoUpdate12 : function(oEvt) {
						sap.ui.getCore().byId("infoUpdate12").close();
						PolypolyManager.checkUpdateLevel();
					},

					statusFormatter : function(status) {
						if (status == "OK") {
							return "sap-icon://accept";
						} else {
							return "sap-icon://decline";
						}
					},

					colorFormatter : function(status) {
						if (status == "OK") {
							return "Green";
						} else {
							return "Red";
						}
					},

					onContinueInfoUpdate23 : function() {
						sap.ui.getCore().byId("infoUpdate23").close();
						PolypolyManager.checkUpdateLevel();
					},

					onCancelInfoUpdate23 : function() {
						sap.ui.getCore().byId("infoUpdate23").close();
					},

					onColumnMove : function(oEvt) {
						var newPos = oEvt.getParameters().newPos;
						var oldPos = oEvt.getParameters().column.getIndex();
						if (newPos != oldPos) {
							if ((oEvt.getParameters().newPos - 5) < 0
									|| formatter.isPolypolyEditable() == false) {
								sap.m.MessageToast.show("Unauthorized action");
								var oTable = oEvt.getSource();
								var oColumn = oEvt.getParameters().column;
								setTimeout(function() {
									oTable.removeColumn(newPos);
									oTable.insertColumn(oColumn, oldPos);
								}, 0);
							} else {
								var newPos = newPos - 4;
								var sTechname = oEvt.getParameters().column
										.getBindingContext().getProperty(
												"techname");
								PolypolyManager.moveColumn(sTechname, newPos);
							}
						}
					},

					visibleButton : function() {
						if (sap.ui.getCore().byId("polypolyView").getModel()
								.getData().rows) {
							return formatter.isPolypolyEditable();
						} else {
							return false;
						}

					},
					onUserAllocate : function(oEvt) {

						if (!PolypolyManager.oViewController)
							PolypolyManager.oViewController = sap.ui.getCore()
									.byId("polypolyView").getController();

						PolypolyManager.oViewController.checkBox = oEvt
								.getSource();
						PolypolyManager.polypolyIndex = PolypolyManager.oViewController.checkBox
								.getModel()
								.getProperty(
										PolypolyManager.oViewController.checkBox
												.getBindingContext().getPath());
						if (PolypolyManager.polypolyIndex.ERP_ID == "---"
								|| PolypolyManager.polypolyIndex.ERP_ID == " ") {
							ModelManager.messageShow("Invalid ERP ID"
									+ PolypolyManager.polypolyIndex.ERP_ID);

							PolypolyManager.oViewController.checkBox
									.setSelected(false);
							return false;
						}

						if (PolypolyManager.oViewController.checkBox
								.getSelected()) {
							if (sap.ui.getCore().byId("toogleAffectConfirm")
									.getState() === true) {
								if (!PolypolyManager.oViewController.oDialogConfirmationPoyPoly) {
									PolypolyManager.oViewController.oDialogConfirmationPoyPoly = sap.ui
											.xmlfragment(
													"airbus.userAffectatonConfirmationPolyPoly",
													PolypolyManager.oViewController);
								}
								var erp_id = PolypolyManager.polypolyIndex.ERP_ID
								ModelManager
										.chkUserOprCertificatePolyPoly(
												erp_id,
												PolypolyManager.oViewController.checkBox);
								return;
							}
							// if no QA check assign automatically
						}
						// to deselect --auto

						// Poly Poly User Save

						if (!ModelManager.polypoly_UserSave) {
							ModelManager.polypoly_UserSave
									.push(PolypolyManager.polypolyIndex);
						}
						if ((ModelManager.polypoly_UserSave
								.some(function(element) {
									return (element.ERP_ID == PolypolyManager.polypolyIndex.ERP_ID);
								})) === false) {
							ModelManager.polypoly_UserSave
									.push(PolypolyManager.polypolyIndex);
						}

					},

					afterConfirmPress : function(oEvt) {
						oEvt.getSource().getParent().close();
						PolypolyManager.oViewController.checkBox
								.setSelected(true); // works auto
						if (!ModelManager.polypoly_UserSave) {
							ModelManager.polypoly_UserSave
									.push(PolypolyManager.polypolyIndex);
						}
						if ((ModelManager.polypoly_UserSave
								.some(function(element) {
									return (element.ERP_ID == PolypolyManager.polypolyIndex.ERP_ID);
								})) === false) {
							ModelManager.polypoly_UserSave
									.push(PolypolyManager.polypolyIndex);
						}

					},
					onCancel : function(oEvt) {
						oEvt.getSource().getParent().close();
						PolypolyManager.oViewController.checkBox
								.setSelected(false);
					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf polypoly.main
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
					 * @memberOf polypoly.main
					 */
					onAfterRendering : function() {
						if (PolypolyManager.globalContext.tabSelected == "allocation") {
							this.filterUA();
						} else {
							this.clearFilters();
						}
						sap.ui.getCore().byId(
								"polypolyView--stationSelectPolyPoly")
								.setSelectedKey(ModelManager.station_number);
						sap.ui.getCore().byId(
								"polypolyView--lineSelectPolyPoly")
								.setSelectedKey(ModelManager.line_number);
						PolypolyManager.station_number = ModelManager.station_number;
						PolypolyManager.line_number = ModelManager.line_number;
						
					},

					onValueChange : function(oEvt) {
						PolypolyManager.station_number = sap.ui.getCore().byId(
								"polypolyView--stationSelectPolyPoly")
								.getSelectedKey();
						PolypolyManager.line_number = sap.ui.getCore().byId(
								"polypolyView--lineSelectPolyPoly")
								.getSelectedKey();
						PolypolyManager.getPolypolyModel(
								ModelManager.factory_name, PolypolyManager.line_number,
								PolypolyManager.station_number, ModelManager.site);
					},
					setVisible : function() {
						return PolypolyManager.globalContext.tabSelected == "polypoly" ? true
								: false;
					}

				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf polypoly.main
				 */
				// onExit: function() {
				//
				// }
				});
