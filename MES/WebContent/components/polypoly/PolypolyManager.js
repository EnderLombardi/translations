"use strict";

jQuery.sap.declare("airbus.mes.polypoly.PolypolyManager")

airbus.mes.polypoly.PolypolyManager = {
	
	globalContext : {
		tabSelected : undefined,
		bEditable : undefined,
	},

	userComptencyContext : {
		rowBindingContext : undefined,
		columnIndex : undefined,
		newLevel : undefined,
	},

	internalContext : {
		oModel : undefined,
		saveContext : undefined,
	},

	levelUpdater : {
		sUserID : undefined,
		sUserName : undefined,
		startLevel : undefined,
		currentLevel : undefined,
		endLevel : undefined,
		sTechName : undefined,
	},

	urlModel : undefined,
	oViewController : undefined,
	polypolyIndex : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		var dest = undefined;
		switch (window.location.hostname) {
		case "localhost":
			dest = "imi";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/polypoly/config/url_config.properties",
			bundleLocale : dest
		});
		airbus.mes.polypoly.ModelManager.loadStationListModel();
	},

	// Crazy function call not present in the model manager or polypolymanager even in the code get from stepchange
	// onModelLoaded of what ??????
	
	onModelLoaded : function() {
		var oData = sap.ui.getCore().getModel("mii").getData().Rowsets;
		if (oData.Rowset && oData.Rowset.length > 0 && oData.Rowset[0].Row) {
			var oMiiData = sap.ui.getCore().getModel("mii").getData();
			var oTableData = airbus.mes.polypoly.PolypolyManager.createTableData(oMiiData);
			var mTableModel = new sap.ui.model.json.JSONModel(oTableData);
			airbus.mes.polypoly.PolypolyManager.internalContext.oModel = mTableModel;
			
			// ????? 
			sap.ui.getCore().byId("polypoly").setModel(mTableModel);
			//sap.ui.getCore().getModel("mTableModel").loadData(mTableModel);
			
		} 
		else {
			var mTableModel = new sap.ui.model.json.JSONModel();
			}
	},

	createTableData : function(oMiiData) {

		var oMiiRows = oMiiData.Rowsets.Rowset[0].Row;
		var oMiiColumns = oMiiData.Rowsets.Rowset[1].Row;

		// Creation de la table des ressourcePools
		var ressourcePools = new Object();
		oMiiRows.forEach(function(row) {
			if (row != "") {
				// if(!ressourcePools.includes(row.RP_Description)){ressourcePools.push(row.RP_Description)};
				if (!Object.keys(ressourcePools).includes(row.RP_ID)) {
					ressourcePools[row.RP_ID] = row.RP_Description
				}
				;
			}
		});

		var ressourcePoolsmodel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(ressourcePoolsmodel, "rpModel");

		var aRessourcePools = [];
		Object.keys(ressourcePools).forEach(function(el) {
			var oTemp = {};
			oTemp["rp_id"] = el;
			oTemp["rp_desc"] = ressourcePools[el];
			aRessourcePools.push(oTemp)
		});

		ressourcePoolsmodel.setData({
			rp : aRessourcePools
		});


		var oTableRows = {
			"rows" : [ {
				"ressourcepool" : "",
				"ressourcepoolId" : "",
				"category" : "NEED",
				"icon" : "3",
				"type" : "NEED"
			}, {
				"ressourcepool" : "",
				"ressourcepoolId" : "",
				"category" : "NEED",
				"icon" : "4",
				"type" : "NEED"
			}, ],
			"columns" : [ {
				"type" : "type",
				"techname" : "type"
			}, {
				"type" : "rp_id",
				"techname" : "ressourcepoolId"
			}, {
				"type" : "ressourcepool",
				"name" : "",
				"techname" : "ressourcepool"
			}, {
				"type" : "category",
				"name" : "",
				"techname" : "category"
			}, {
				"type" : "selected",
				"name" : "",
				"techname" : "selected"
			}, {
				"type" : "icon",
				"name" : "",
				"techname" : "icon"
			}, ]
		};

		// Creation des colonnes
		var colonnes = {};
		var need3 = 0;
		var need4 = 0;
		oMiiColumns
				.forEach(function(col) {
					if (col != "") {
						if (col.POLYPOLY_NEEDS_3 == '---') {
							oTableRows.rows[0][col.technicalName] = "0";
						} else {
							oTableRows.rows[0][col.technicalName] = col.POLYPOLY_NEEDS_3;
						}

						if (col.POLYPOLY_NEEDS_4 == '---') {
							oTableRows.rows[1][col.technicalName] = "0";
						} else {
							oTableRows.rows[1][col.technicalName] = col.POLYPOLY_NEEDS_4;
						}

						oTableRows.columns.push({});
						oTableRows.columns[oTableRows.columns.length - 1]["name"] = col.competencyName;
						oTableRows.columns[oTableRows.columns.length - 1]["techname"] = col.technicalName;
						oTableRows.columns[oTableRows.columns.length - 1]["qa"] = [];
						oTableRows.columns[oTableRows.columns.length - 1]["type"] = "column";
						var qa = col.qualityApproval;
						if (qa != undefined) {
							qa = qa.split(", ")
						}
						;
						qa
								.forEach(function(c, i) {
									if (c != "") {
										oTableRows.columns[oTableRows.columns.length - 1]["qa"]
												.push({});
										oTableRows.columns[oTableRows.columns.length - 1]["qa"][oTableRows.columns[oTableRows.columns.length - 1]["qa"].length - 1]["label"] = c;
									}
								})
						if (col.POLYPOLY_NEEDS_3 == '---') {
							need3 = 0;
						} else {
							need3 = parseInt(col.POLYPOLY_NEEDS_3, 10);
						}
						if (col.POLYPOLY_NEEDS_4 == '---') {
							need4 = 0;
						} else {
							need4 = parseInt(col.POLYPOLY_NEEDS_4, 10);
						}
						colonnes[col.technicalName] = [ 0, 0, 0, 0, need3,
								need4 ];
					}
				});

		var separateur = "";
		Object
				.keys(ressourcePools)
				.forEach(
						function(rp) {
							oTableRows.rows[0]["ressourcepool"] = oTableRows.rows[0]["ressourcepool"]
									+ separateur + ressourcePools[rp];
							oTableRows.rows[0]["ressourcepoolId"] = oTableRows.rows[0]["ressourcepoolId"]
									+ separateur + rp;
							separateur = ","
							oTableRows.rows[1]["ressourcepool"] = oTableRows.rows[0]["ressourcepool"];
							oTableRows.rows[1]["ressourcepoolId"] = oTableRows.rows[0]["ressourcepoolId"];
							// Creation des lignes de type UA
							oMiiRows
									.forEach(function(row) {
										if ((row != "") && (row.RP_ID === rp)) {
											// if(!ressourcePools.has(row.RP_ID)){ressourcePools.push()}
											oTableRows.rows.push({});
											oTableRows.rows[oTableRows.rows.length - 1]["category"] = row.longName;
											oTableRows.rows[oTableRows.rows.length - 1]["ressourcepool"] = row.RP_Description;
											oTableRows.rows[oTableRows.rows.length - 1]["ressourcepoolId"] = row.RP_ID;
											oTableRows.rows[oTableRows.rows.length - 1]["ERP_ID"] = row.ERP_ID;
											oTableRows.rows[oTableRows.rows.length - 1]["icon"] = row.status;
											try {
												if (sap.ui.getCore().getModel(
														"zModel").getData()) {
													var flag = false;
													var affectModelRow = sap.ui
															.getCore()
															.getModel("zModel")
															.getProperty(
																	"/Rowsets/Rowset/0/Row");
													affectModelRow
															.forEach(function(
																	a_row) {
																if (a_row.ERP_ID === row.ERP_ID) {
																	// a_row.Name.toUpperCase()
																	// ==
																	// row.longName.replace("
																	// ","_")
																	// //test
																	// condition
																	oTableRows.rows[oTableRows.rows.length - 1]["selected"] = a_row.Affected === "YES" ? true
																			: false;
																	flag = true;
																	// break;
																}
															})
													if (flag === false) {
														oTableRows.rows[oTableRows.rows.length - 1]["selected"] = false;
													}
												}
											} catch (e) {
												oTableRows.rows[oTableRows.rows.length - 1]["selected"] = false;
											}
											// oTableRows.rows[oTableRows.rows.length
											// - 1]["selected"] = false;
											if (row.status != "No_Clocked_In") {
												oTableRows.rows[oTableRows.rows.length - 1]["type"] = "UA_P"
											} else {
												oTableRows.rows[oTableRows.rows.length - 1]["type"] = "UA_A"
											}
											;
											var compName = row.competency;
											var compLevel = row.level;
											if (compLevel != undefined) {
												compLevel = compLevel
														.split(", ")
											}
											;
											if (compName != undefined) {
												compName = compName.split(", ")
											}
											;
											compName
													.forEach(function(c, i) {
														if (c != "") {
															oTableRows.rows[oTableRows.rows.length - 1][c] = compLevel[i];
															if (colonnes[c] != undefined) {
																colonnes[c][parseInt(
																		compLevel[i],
																		10) - 1]++
															}
															;
														}
													})
										}
									});
							// AS IS
							for (var i = 1; i < 5; i++) {
								oTableRows.rows.push({});
								oTableRows.rows[oTableRows.rows.length - 1]["category"] = "AS IS";
								oTableRows.rows[oTableRows.rows.length - 1]["icon"] = i
										.toString();
								oTableRows.rows[oTableRows.rows.length - 1]["type"] = "ASIS";
								oTableRows.rows[oTableRows.rows.length - 1]["ressourcepool"] = ressourcePools[rp];
								oTableRows.rows[oTableRows.rows.length - 1]["ressourcepoolId"] = rp;
								oMiiColumns
										.forEach(function(col) {
											if (col != "") {
												var c = col.technicalName;
												oTableRows.rows[oTableRows.rows.length - 1][c] = colonnes[c][i - 1]
														.toString();
											}
										});
							}
							// Gap
							for (var j = 1; j < 3; j++) {
								var k = j + 2;
								oTableRows.rows.push({});
								oTableRows.rows[oTableRows.rows.length - 1]["category"] = "GAP";
								oTableRows.rows[oTableRows.rows.length - 1]["icon"] = k
										.toString();
								oTableRows.rows[oTableRows.rows.length - 1]["type"] = "GAP";
								oTableRows.rows[oTableRows.rows.length - 1]["ressourcepool"] = ressourcePools[rp];
								oTableRows.rows[oTableRows.rows.length - 1]["ressourcepoolId"] = rp;
								oMiiColumns
										.forEach(function(col) {
											if (col != "") {
												var c = col.technicalName;
												var u = (colonnes[c][j + 1] - colonnes[c][j + 3]);
												if (j == 1) {
													var v = (colonnes[c][j + 2] - colonnes[c][j + 4]);
													if (v > 0) {
														u = u + v;
													}
												}
												oTableRows.rows[oTableRows.rows.length - 1][c] = u
														.toString();
											}
										});
							}
							// Ré-initialiser le calcul de GAP et de AS IS
							oMiiColumns.forEach(function(col) {
								if (col != "") {
									if (col.POLYPOLY_NEEDS_3 == '---') {
										need3 = 0;
									} else {
										need3 = parseInt(col.POLYPOLY_NEEDS_3,
												10);
									}
									if (col.POLYPOLY_NEEDS_4 == '---') {
										need4 = 0;
									} else {
										need4 = parseInt(col.POLYPOLY_NEEDS_4,
												10);
									}
									colonnes[col.technicalName] = [ 0, 0, 0, 0,
											need3, need4 ];
								}
							});
						});
		return oTableRows;
	},

//	updateLevelInit : function() {
//		var oModel = sap.ui.getCore().byId("polypolyView").getModel();
//		this.levelUpdater.sUserID = this.userComptencyContext.rowBindingContext
//				.getProperty("ERP_ID");
//		this.levelUpdater.sUserName = this.userComptencyContext.rowBindingContext
//				.getProperty("category");
//		this.levelUpdater.sTechName = oModel.getData().columns[PolypolyManager.userComptencyContext.columnIndex + 3].techname;
//		this.levelUpdater.startLevel = parseInt(PolypolyManager.userComptencyContext.rowBindingContext
//				.getProperty(this.levelUpdater.sTechName));
//		this.levelUpdater.endLevel = PolypolyManager.userComptencyContext.newLevel;
//		this.levelUpdater.currentLevel = this.levelUpdater.startLevel;
//
//		PolypolyManager.checkUpdateLevel();
//	},
//
//	checkUpdateLevel : function() {
//		var p = PolypolyManager.levelUpdater;
//		if (PolypolyManager.levelUpdater.currentLevel >= PolypolyManager.levelUpdater.endLevel) {
//			PolypolyManager.handleUpdateLevel();
//		} else {
//			PolypolyManager.levelUpdater.currentLevel += 1;
//			if (PolypolyManager.levelUpdater.currentLevel == 2) {
//				PolypolyManager.updateLevel12(p.sUserID, p.sTechName);
//			} else if (PolypolyManager.levelUpdater.currentLevel == 3) {
//				PolypolyManager.updateLevel23(p.sUserID, p.sTechName);
//			} else {
//				PolypolyManager.checkUpdateLevel();
//			}
//		}
//	},
//
//	handleUpdateLevel : function() {
//		var p = PolypolyManager.levelUpdater;
//		if (PolypolyManager.levelUpdater.endLevel == 0) {
//			PolypolyManager.updateLevelDelete(p.sUserID, p.sTechName);
//		} else if (PolypolyManager.levelUpdater.startLevel == 0) {
//			PolypolyManager.updateLevelCreate(p.sUserID, p.sTechName,
//					p.endLevel);
//		} else {
//			PolypolyManager.updateLevel(p.sUserID, p.sTechName, p.startLevel,
//					p.endLevel);
//		}
//	},
//
//	updateLevelCreate : function(sUserID, sTechName, sNewLevel) {
//		var urlqalevelcreate = this.urlModel.getProperty("urlqalevelcreate");
//
//		urlqalevelcreate = urlqalevelcreate.replace("$erpid", sUserID);
//		urlqalevelcreate = urlqalevelcreate
//				.replace("$certification", sTechName);
//		urlqalevelcreate = urlqalevelcreate.replace("$nLevel", sNewLevel);
//		urlqalevelcreate = urlqalevelcreate.replace("$site", ModelManager.site);
//
//		$.ajax({
//			url : urlqalevelcreate,
//			success : function(data, textStatus, jqXHR) {
//				PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//						ModelManager.line_number, ModelManager.station_number,
//						ModelManager.site);
//			},
//		})
//	},
//
//	updateLevelDelete : function(sUserID, sTechName) {
//		var urlqaleveldelete = this.urlModel.getProperty("urlqaleveldelete");
//
//		urlqaleveldelete = urlqaleveldelete.replace("$erpid", sUserID);
//		urlqaleveldelete = urlqaleveldelete.replace("$competency", sTechName);
//		urlqaleveldelete = urlqaleveldelete.replace("$site", ModelManager.site);
//
//		$.ajax({
//			url : urlqaleveldelete,
//			success : function(data, textStatus, jqXHR) {
//				PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//						ModelManager.line_number, ModelManager.station_number,
//						ModelManager.site);
//			},
//		})
//	},
//
//	updateLevel : function(sUserID, sTechName, sPreviousLevel, sNewLevel) {
//		var urlqalevelupdate = this.urlModel.getProperty("urlqalevelupdate");
//
//		urlqalevelupdate = urlqalevelupdate.replace("$erpid", sUserID);
//		urlqalevelupdate = urlqalevelupdate.replace("$competency", sTechName);
//		urlqalevelupdate = urlqalevelupdate.replace("$pLevel", sPreviousLevel);
//		urlqalevelupdate = urlqalevelupdate.replace("$nLevel", sNewLevel);
//		urlqalevelupdate = urlqalevelupdate.replace("$site", ModelManager.site);
//
//		$.ajax({
//			url : urlqalevelupdate,
//			success : function(data, textStatus, jqXHR) {
//				PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//						ModelManager.line_number, ModelManager.station_number,
//						ModelManager.site);
//			},
//		})
//	},
//
//	updateLevel12 : function(sUserID, sTechName) {
//		var urlqalevel12 = this.urlModel.getProperty("urlqalevel12");
//
//		urlqalevel12 = urlqalevel12.replace("$erpid", sUserID);
//		urlqalevel12 = urlqalevel12.replace("$competency", sTechName);
//		urlqalevel12 = urlqalevel12.replace("$site", ModelManager.site);
//
//		$
//				.ajax({
//					url : urlqalevel12,
//					success : function(data, textStatus, jqXHR) {
//						data.Rowsets.Rowset[0].name = PolypolyManager.levelUpdater.sUserName;
//						var infoModel = new sap.ui.model.json.JSONModel();
//						if (!sap.ui.getCore().byId("infoUpdate12")) {
//							sap.ui.xmlfragment("airbus.InfoUpdate12", sap.ui
//									.getCore().byId("polypolyView")
//									.getController());
//						}
//						sap.ui.getCore().byId("infoUpdate12").open();
//						sap.ui.getCore().byId("infoUpdate12").setModel(
//								infoModel);
//					},
//				})
//	},
//
//	updateLevel23 : function(sUserID, sTechName) {
//		var urlqalevel23 = this.urlModel.getProperty("urlqalevel23");
//
//		urlqalevel23 = urlqalevel23.replace("$erpid", sUserID);
//		urlqalevel23 = urlqalevel23.replace("$competency", sTechName);
//		urlqalevel23 = urlqalevel23.replace("$site", ModelManager.site);
//
//		$
//				.ajax({
//					url : urlqalevel23,
//					success : function(data, textStatus, jqXHR) {
//						data.Rowsets.Rowset[0].name = PolypolyManager.levelUpdater.sUserName;
//						var infoModel = new sap.ui.model.json.JSONModel();
//						infoModel.setData(data.Rowsets.Rowset[0]);
//						if (infoModel.getData().Row) {
//							if (!sap.ui.getCore().byId("infoUpdate23")) {
//								sap.ui.xmlfragment("airbus.InfoUpdate23",
//										sap.ui.getCore().byId("polypolyView")
//												.getController());
//							}
//							sap.ui.getCore().byId("infoUpdate23").open();
//							sap.ui.getCore().byId("infoUpdate23").setModel(
//									infoModel);
//						} else {
//							PolypolyManager.checkUpdateLevel();
//						}
//					},
//				})
//	},
//
//	createColumn : function(sName, sQA, sNeed3, sNeed4, sTechname) {
//		var urlcreatecolumn = this.urlModel.getProperty("urlcreatecolumn");
//
//		urlcreatecolumn = urlcreatecolumn.replace("$sName", sName);
//		urlcreatecolumn = urlcreatecolumn.replace("$polypoly", sTechname);
//		urlcreatecolumn = urlcreatecolumn.replace("$site", ModelManager.site);
//		urlcreatecolumn = urlcreatecolumn.replace("$factory",
//				ModelManager.factory_name);
//		urlcreatecolumn = urlcreatecolumn.replace("$line",
//				ModelManager.line_number);
//		urlcreatecolumn = urlcreatecolumn.replace("$station",
//				ModelManager.station_number);
//
//		$.ajax({
//			url : urlcreatecolumn,
//			cache : false,
//			success : function(data, textStatus, jqXHR) {
//				var sNewTechName = data.Rowsets.Rowset[0].Row[0].Message;
//				PolypolyManager.updateColumn(sName, sQA, sNeed3, sNeed4,
//						sNewTechName);
//			},
//		});
//	},
//
//	updateColumn : function(sName, sQA, sNeed3, sNeed4, sTechname) {
//		var urlupdatecolumn = this.urlModel.getProperty("urlupdatecolumn");
//
//		urlupdatecolumn = urlupdatecolumn.replace("$New_Description", sName);
//		urlupdatecolumn = urlupdatecolumn.replace("$QA_LIST", sQA);
//		urlupdatecolumn = urlupdatecolumn.replace("$Needs_3", sNeed3);
//		urlupdatecolumn = urlupdatecolumn.replace("$Needs_4", sNeed4);
//		urlupdatecolumn = urlupdatecolumn.replace("$polypoly", sTechname);
//		urlupdatecolumn = urlupdatecolumn.replace("$site", ModelManager.site);
//
//		$.ajax({
//			url : urlupdatecolumn,
//			cache : false,
//			success : function(data, textStatus, jqXHR) {
//				if (sap.ui.getCore().byId("columnPopupDialog")) {
//					if (sap.ui.getCore().byId("columnPopupDialog").isOpen()) {
//						sap.ui.getCore().byId("columnPopupDialog").close();
//					}
//				}
//				PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//						ModelManager.line_number, ModelManager.station_number,
//						ModelManager.site);
//			},
//		});
//	},
//
//	deleteColumn : function(sName) {
//		var urldeletecolumn = this.urlModel.getProperty("urldeletecolumn");
//
//		urldeletecolumn = urldeletecolumn.replace("$site", ModelManager.site);
//		urldeletecolumn = urldeletecolumn.replace("$polypoly", sName);
//		$.ajax({
//			url : urldeletecolumn,
//			cache : false,
//			success : function(data, textStatus, jqXHR) {
//				sap.ui.getCore().byId("confirmDeleteDialog").close();
//				PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//						ModelManager.line_number, ModelManager.station_number,
//						ModelManager.site);
//			},
//		});
//	},
//
//	moveColumn : function(sName, newPos) {
//		var urlmovecolumn = this.urlModel.getProperty("urlmovecolumn");
//
//		urlmovecolumn = urlmovecolumn.replace("$site", ModelManager.site);
//		urlmovecolumn = urlmovecolumn.replace("$polypoly", sName);
//		urlmovecolumn = urlmovecolumn.replace("$order", newPos);
//		$.ajax({
//			url : urlmovecolumn,
//			cache : false,
//			success : function(data, textStatus, jqXHR) {
//				// sap.ui.getCore().byId("confirmDeleteDialog").close();
//				// PolypolyManager.getPolypolyModel(ModelManager.factory_name,
//				// ModelManager.line_number, ModelManager.station_number,
//				// ModelManager.site);
//			},
//		});
//	},

	// Crazy why declare model here???? .................-_-_-_--__-_-_ what mean MII model???
	
	getPolypolyModel : function(sFactory, sLine, sStation, site) {
		var miiModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(miiModel, "mii");
//		airbus.mes.polypoly.PolypolyManager.PolypolyManager.getPolypolyModel("F1","1","10","CHES");
//		sap.ui.core.BusyIndicator.show();
		var urlgetpolypoly = this.urlModel.getProperty("urlgetpolypoly");

		urlgetpolypoly = urlgetpolypoly.replace("$factory", sFactory);
		urlgetpolypoly = urlgetpolypoly.replace("$line", sLine);
		urlgetpolypoly = urlgetpolypoly.replace("$station", sStation);
		urlgetpolypoly = urlgetpolypoly.replace("$site", site);

//		var oViewModel = sap.ui.getCore().getModel("mii");
		sap.ui.getCore().getModel("mii").loadData("/MES/components/polypoly/model/model.json",null,false);

//		miiModel.loadData(urlgetpolypoly, {
//			cache : false
//		}, true);
//
		var needLevelsmodel = new sap.ui.model.json.JSONModel(
				"/MES/components/polypoly/model/needlevels.json");
		sap.ui.getCore()
				.setModel(needLevelsmodel, "needlevels");
		var columnModel = new sap.ui.model.json.JSONModel();
//		var listQAmodel = new sap.ui.model.json.JSONModel(
//				this.urlModel
//						.getProperty("urlgetqalist"));
//		sap.ui.getCore().setModel(listQAmodel, "listQA");
		
		
		
		

	},

//	setUserAllocation : function() {
//
//		PolypolyManager.oViewController.checkBox.setSelected(true); // works
//																	// auto
//		if (!ModelManager.polypoly_UserSave) {
//			ModelManager.polypoly_UserSave.push(PolypolyManager.polypolyIndex);
//		}
//		if ((ModelManager.polypoly_UserSave.some(function(element) {
//			return (element.ERP_ID == PolypolyManager.polypolyIndex.ERP_ID);
//		})) === false) {
//			ModelManager.polypoly_UserSave.push(PolypolyManager.polypolyIndex);
//		}
//	}

};
airbus.mes.polypoly.PolypolyManager.init(sap.ui.getCore());
//PolypolyManager.init(sap.ui.getCore());
