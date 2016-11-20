sap.ui.controller("airbus.mes.polypoly.polypoly",{

	/**
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 * 
	 * @memberOf polypoly.main
	 */
	onInit : function() {
		columnModel = new sap.ui.model.json.JSONModel();
	},

	onBeforeRendering: function() {
//		var a=airbus.mes.polypoly.oView.byId("headerPolypoly");
//		if(airbus.mes.polypoly.PolypolyManager.isPolypolyEditable() && airbus.mes.polypoly.oView.getContent().indexOf(a) < 0){
//		airbus.mes.polypoly.oView.addContent(a);
//		}else if(!airbus.mes.polypoly.PolypolyManager.isPolypolyEditable() && airbus.mes.polypoly.oView.getContent().indexOf(a) >= 0){
//		airbus.mes.polypoly.oView.removeContent(a);
//		airbus.mes.polypoly.oView.rerender();
//		}
	},
//	onAfterRendering : function() {
//	var oData = sap.ui.getCore().getModel("mii").getData().Rowsets;
//	if (oData.Rowset && oData.Rowset.length > 0 && oData.Rowset[0].Row) {
//	var oMiiData = sap.ui.getCore().getModel("mii").getData();
//	var oTableData = airbus.mes.polypoly.PolypolyManager.createTableData(oMiiData);
//	var mTableModel = new sap.ui.model.json.JSONModel(oTableData);
//	airbus.mes.polypoly.PolypolyManager.internalContext.oModel = mTableModel;
//	sap.ui.getCore().byId("polypoly").setModel(mTableModel);
//	} 
//	var mTableModel = new sap.ui.model.json.JSONModel();
//	sap.ui.getCore().byId("polypoly").setModel(mTableModel);
//	},

	openQAPopup : function() {
		var that = this;
		if (!airbus.mes.polypoly.QADialog) {
			airbus.mes.polypoly.QADialog = sap.ui.xmlfragment(	"airbus.mes.polypoly.QAPopup", that);
		}
		airbus.mes.polypoly.QADialog.setModel(airbus.mes.polypoly.PolypolyManager.internalContext.oModelQA);
		airbus.mes.polypoly.QADialog.setModel(airbus.mes.polypoly.oView.getModel("PolypolyI18n"),"PolypolyI18n");
		sap.ui.getCore().byId("oTableQA").setVisibleRowCount(airbus.mes.polypoly.PolypolyManager.internalContext.iLinesQA);
		airbus.mes.polypoly.QADialog.open();
	},

	onClickQAPopup : function(){
		airbus.mes.polypoly.QADialog.close();
	},

	createColumnQA : function(sId, oContext) {
		var that = this;
		var aMultiLabels = [];

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

		var oColumn = new sap.ui.table.Column(
				{
					id : sId,
					hAlign : "Center",
					width : "7rem",
					multiLabels : [ aMultiLabels ],
					template : new sap.m.Text({
						text : {
							parts : [ oContext
							          .getProperty("techname") ],
							          formatter : function(text) {
							        	  return text;
							          }
						},
					})
				});

		;
		return oColumn
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
					customData: {
						key: "category",
						value: "{type}",
						writeToDom: true
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
		case "type":
			var oColumn = new sap.ui.table.Column({
				id : "typeRow",
				visible : false,
				filterProperty : oContext
				.getProperty("techname"),
				showFilterMenuEntry : false,
				width : "2rem",
				template : new sap.m.Text({
					customData: {
						key: "category",
						value: "{type}",
						writeToDom: true
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
		case "ressourcepool":
			var oColumn = new sap.ui.table.Column({
				id : oContext.getProperty("type"),
				filterProperty : oContext
				.getProperty("techname"),
				showFilterMenuEntry : false,
				width : "8rem",
				visible : false,
				template : new sap.m.Text({
					customData: {
						key: "category",
						value: "{type}",
						writeToDom: true
					},
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
//				filterProperty : oContext.getProperty("techname"),
				showFilterMenuEntry : false,
				width : "10rem",
				template : 
//					new sap.m.Text({
//						text : {
//							parts : [ oContext
//							          .getProperty("techname") ],
//							          formatter : function(text) {
//							        	  return text;
//							          }
//						},
//					})
					new sap.m.HBox({
						customData: {
							key: "category",
							value: "{type}",
							writeToDom: true
						},
						alignItems : "Center",
						items: [
						   new sap.m.Image({ 
							   	width : "2.5rem",
							   	src : {
			        				 parts : [oContext.getProperty("name")],
			        				 formatter : function(oRow) {
			        					 if(oRow != null){
			        						 return oRow.picture?airbus.mes.shell.UserImageManager.getUserImage(this.getId(), oRow.picture):oRow.picture;
			        					 }
			        				 }
			        			 } ,
							   	visible : {
			        				 parts : [ "type" ],
			        				 formatter : function(
			        						 type) {
			        					 return type == "UA_A"
			        						 || (type == "UA_P" && airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY")); 
			        				 }
			        			 } 
						   }),
						   new sap.m.Text({
							   text : {
								   parts : [oContext.getProperty("name")],
								   formatter : function(oRow){
									   if(oRow != null){
										   return oRow.category;
									   }
								   }
							   },
								visible : {
			        				 parts : [ "type" ],
			        				 formatter : function(type) {
			        					 return airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_NAME"); 
			        				 }
			        			 } 
						   })
						]
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
//						visible: airbus.mes.stationtracker.AssignmentManager.polypolyAffectation,
						visible : false, // This column may no longer be used
						template : new sap.m.CheckBox(
								{
									customData: {
										key: "category",
										value: "{type}",
										writeToDom: true
									},
//									selected : "{selected}",
//									select : sap.ui
//									.getCore()
//									.byId(
//									"polypoly")
//									.getController().onUserAllocate
									visible : {
										parts : [ "type" ],
										formatter : function(
												type) {
											return type == "UA_A" || type == "UA_P"
										}
									}
								})
					})
			break;
		case "icon":
			var oColumn = new sap.ui.table.Column(
					{
						hAlign : "Center",
						width : "2.5rem",
						template : new sap.m.VBox(
								{
									customData: {
										key: "category",
										value: "{type}",
										writeToDom: true
									},
									items : [
									         new sap.ui.core.Icon(
									        		 {
									        			 size : "1.7rem",
									        			 tooltip : {
									        				 parts : [ "icon" ],
									        				 formatter : function(icon) {
									        					 if(airbus.mes.polypoly.util.Formatter.isVisible()){
									        						 return icon;
									        					 }else{
									        						 return "Affect";
									        					 }
									        				 },
									        			 },
									        			 src : {
									        				 parts : [ "icon" ],
									        				 formatter : function(
									        						 status) {
									        					 switch (status) {
									        					 case "Clocked_In":
									        						 return "sap-icon://employee-approvals";
									        						 break;
									        					 case "No_Clocked_In":
									        						 return "sap-icon://employee-rejections";
									        						 break;
									        					 case "Not_Available":
									        						 return "sap-icon://employee";
									        						 break;
									        					 case "Planned_Absence":
									        						 return "sap-icon://employee-pane";
									        						 break;
									        					 case "No_Clock_Data":
									        						 return "sap-icon://employee-lookup";
									        						 break;
									        					 case "IN":
									        						 return "sap-icon://employee-approvals";
									        						 break;
									        					 case "OUT":
									        						 return "sap-icon://employee-rejections";
									        						 break;
									        					 }

									        				 }
									        			 },
									        			 color : {
									        				 parts : [ "icon" ],
									        				 formatter : function(
									        						 status) {
									        					 switch (status) {
									        					 case "Clocked_In":
									        						 return "Green";
									        						 break;
									        					 case "No_Clocked_In":
									        						 return "Red";
									        						 break;
									        					 case "Not_Available":
									        						 return "Grey";
									        						 break;
									        					 case "Planned_Absence":
									        						 return "DarkGrey";
									        						 break;
									        					 case "No_Clock_Data":
									        						 return "#8fd4e2";
									        						 break;
									        					 case "IN":
									        						 return "Green";
									        						 break;
									        					 case "OUT":
									        						 return "Red";
									        						 break;
									        					 }
									        				 }
									        			 },
									        			 hoverColor : {
									        				 parts : [ "type" ],
									        				 formatter : function(type) {
									        					 if(!airbus.mes.polypoly.util.Formatter.isVisible()){
									        						 return "DeepSkyBlue";
									        					 }
									        				 },
									        			 },
									        			 activeColor : {
									        				 parts : [ "type" ],
									        				 formatter : function(type) {
									        					 if(!airbus.mes.polypoly.util.Formatter.isVisible()){
									        						 return "DeepSkyBlue";
									        					 }
									        				 },
									        			 },
									        			 visible : {
									        				 parts : [ "type" ],
									        				 formatter : function(
									        						 type) {
									        					 return type == "UA_A"
									        						 || type == "UA_P"
									        				 }
									        			 },
									        			 press : function(oEvt) {
					        								 that.onIconAffectClick(oEvt)
					        							 },
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
									        								 sURI = "../components/polypoly/images/"
									        									 + level
									        									 + ".png";
									        							 }
									        							 return sURI
									        						 },
									        					 },
									        					 height : "1.5rem",
									        					 visible : {
									        						 parts : [ "type" ],
									        						 formatter : function(
									        								 type) {
									        							 return type != "UA_A"
									        								 && type != "UA_P" && type != "LABEL" && type != "LABEL_RP"
									        						 }
									        					 }
									        				 }) ]
								})
					});
			break;
		case "column":
			// Only display Edit and remove buttons if Polypoly
			// editable
//			if (formatter.isPolypolyEditable()) {
			if (airbus.mes.polypoly.util.Formatter.isVisible()){
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
			} 
			else {
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
//			if (airbus.mes.polypoly.PolypolyManager.globalContext.tabSelected == "polypoly") {
////			if (true){
//			oContext.getProperty("qa").forEach(
//			function(el) {
//			var oQALabel = new sap.m.Label({
//			text : el.label
//			});
//			aMultiLabels.push(oQALabel);
//			});
//			}

			var oColumn = new sap.ui.table.Column(
					{
						id : sId,
						hAlign : "Center",
						width : "7rem",
						multiLabels : [ aMultiLabels ],
						template : new sap.m.VBox(
								{
									customData: {
										key: "category",
										value: "{type}",
										writeToDom: true
									},
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
//									        					 return formatter.isPolypolyEditable();
									        					 return airbus.mes.polypoly.util.Formatter.isVisible();
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
									        							 type: sap.m.ButtonType.Transparent,
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
									        								        		   sURI = "../components/polypoly/images/"
									        								        			   + level
									        								        			   + ".png";
									        								        	   }
									        								        	   return sURI
									        								           }
									        							 },
									        							 visible : {
									        								 parts : [ "type" ],
									        								 formatter : function(
									        										 type) {
									        									 return type == "UA_A"
									        										 || type == "UA_P"
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
									        										        		   value) {
									        										        	   return Math.abs(value);
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
									        									 width : "100%",
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
//		if (formatter.isPolypolyEditable()) {
		if (airbus.mes.polypoly.util.Formatter.isVisible()){	
			airbus.mes.polypoly.PolypolyManager.userComptencyContext.rowBindingContext = oEvt
			.getSource().getBindingContext();
			airbus.mes.polypoly.PolypolyManager.userComptencyContext.columnIndex = oEvt
			.getSource().getParent().getParent()
			.getCells().indexOf(
					oEvt.getSource().getParent());
			var oPopover = new sap.m.Popover({
				placement : "HorizontalPreferredRight",
				showHeader : false,
				content : [ new sap.m.VBox({
					alignItems : "Center",
					items : [ new sap.m.Button({
						icon : "../components/polypoly/images/0.png",
						press : function(oEvt) {
							that.onChangeClick(oEvt)
						}
					}), new sap.m.Button({
						icon : "../components/polypoly/images/1.png",
						press : function(oEvt) {
							that.onChangeClick(oEvt)
						}
					}), new sap.m.Button({
						icon : "../components/polypoly/images/2.png",
						press : function(oEvt) {
							that.onChangeClick(oEvt)
						}
					}), new sap.m.Button({
						icon : "../components/polypoly/images/3.png",
						press : function(oEvt) {
							that.onChangeClick(oEvt)
						}
					}), new sap.m.Button({
						icon : "../components/polypoly/images/4.png",
						press : function(oEvt) {
							that.onChangeClick(oEvt)
						}
					}) ]
				}) ],
			});
			oPopover.openBy(sap.ui.getCore().byId(oEvt.getSource().getId()));
		}
	},

	onChangeClick : function(oEvt) {
		airbus.mes.polypoly.PolypolyManager.userComptencyContext.newLevel = oEvt
		.getSource().getParent().getItems().indexOf(
				oEvt.getSource());
		airbus.mes.polypoly.PolypolyManager.updateLevelInit();
	},

	onSelectLevelChange : function(oEvt) {
		var oModel = sap.ui.getCore().byId("polypoly")
		.getModel();
		var columnData = oModel.getData().columns[oEvt
		                                          .getSource().getParent().getParent().getCells()
		                                          .indexOf(oEvt.getSource().getParent()) + 4];
		var sPath = oEvt.getSource().getBindingContext()
		.getPath();
		var sNeed = oEvt.getSource().getBindingContext()
		.getProperty("icon");

		if (sNeed == "3") {
			var sNeed3 = ""
				+ oEvt.getSource().getSelectedIndex();
			var sNeed4 = oModel.oData.rows[2][columnData.techname];
		} else {
			var sNeed3 = oModel.oData.rows[1][columnData.techname];
			var sNeed4 = ""
				+ oEvt.getSource().getSelectedIndex();
		}

		var sName = columnData.name;
		var sTechname = columnData.techname;
		var sQA = columnData.qa.map(function(el) {
			return el.label;
		}).toString();

		airbus.mes.polypoly.PolypolyManager.updateColumn(sName, sQA, sNeed3,
				sNeed4, sTechname);
	},
	
	setRowCountVisible : function(bAssign){
		var e = window
		, a = 'inner';
		if ( !( 'innerWidth' in window ) )
		{
			a = 'client';
			e = document.documentElement || document.body;
		}
		var oDim = { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		
		var oNumberRows = Math.floor(oDim.height*0.0267 - 10.035);	//FIXME : Change if Rows' height CSS is modified
		
		if(bAssign){
			var aListRows = airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").oList;
			aListRows = aListRows.filter(function(el){
				return el.type == "UA_P" || el.type == "UA_A"
			});
			oNumberRows = Math.min(oNumberRows, aListRows.length + 1);
		}
		airbus.mes.polypoly.oView.byId("oTablePolypoly").setVisibleRowCount(oNumberRows);
	},
	
	filterUA : function() {
		if (sap.ui.getCore().byId("typeRow") /*&& sap.ui.getCore().byId("FilterClockedUsers")*/){
			var filterLabels = new sap.ui.model.Filter("type", "EQ", "LABEL_RP");
			var filterUA = new sap.ui.model.Filter("type", "Contains", "UA_");
			var aFilters = [filterLabels, filterUA];
//			if(sap.ui.getCore().byId("FilterClockedUsers").getSelected())
//			filterUA = new sap.ui.model.Filter("type", "EQ", "UA_CI","UA_NCD");
//			else

//			if ( airbus.mes.stationtracker.AssignmentManager.polypolyAffectation ) {
			if (nav.getCurrentPage().getId()!="polypolyPage"){
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter(aFilters);
				airbus.mes.polypoly.oView.byId("oTablePolypoly").setFixedRowCount(0);
//				airbus.mes.polypoly.oView.byId("oTablePolypoly").setVisibleRowCount(15); //FIXME : Depends on PopUp size small = 8
				airbus.mes.polypoly.oView.getController().setRowCountVisible(true);

			} else {
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter();
				airbus.mes.polypoly.oView.byId("oTablePolypoly").setFixedRowCount(3);
//				airbus.mes.polypoly.oView.byId("oTablePolypoly").setVisibleRowCount(13);
				airbus.mes.polypoly.oView.getController().setRowCountVisible(false);
			}
		}
	},

	initiatePolypoly : function(){
		var aControlsId = ["AddPolypoly"];
		this.filterUA();
		this.hideContent(aControlsId);
		this.clearFilters();
	},

	hideContent : function(aControlsId){
		aControlsId.forEach(function(el){
			var sControlID = el;
			var bVisible = airbus.mes.polypoly.PolypolyManager.isPolypolyEditable();
			airbus.mes.polypoly.oView.byId(sControlID).setVisible(bVisible);
		})
		airbus.mes.polypoly.oView.rerender();
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
//		sap.ui.getCore().byId("polypoly").byId("polypolySearchField").getBinding("suggestionItems").filter(filters);
//		sap.ui.getCore().byId("polypoly").byId("polypolySearchField").suggest();
//		sap.ui.getCore().byId("polypoly").getController().onRPSearch(oEvt);
		airbus.mes.polypoly.oView.byId("polypolySearchField").getBinding("suggestionItems").filter(filters);
		airbus.mes.polypoly.oView.byId("polypolySearchField").suggest();
		airbus.mes.polypoly.oView.getController().onRPSearch(oEvt);
	},

	onRPSearch : function(oEvt) {
		/*
		 * var item = oEvt.getParameter("suggestionItem"); if
		 * (item) {
		 * sap.ui.getCore().byId("rp_id").filter(item.getText()); }
		 * else { sap.ui.getCore().byId("rp_id").filter(""); }
		 */

		var value = oEvt.getSource().getValue();
		var filterLabels = new sap.ui.model.Filter("type", "EQ", "LABEL_RP");
		var filterUA = new sap.ui.model.Filter("type", "Contains", "UA_");
		var aFilters = [filterLabels, filterUA];
		if (value && value.length > 0) {

			var filters = new sap.ui.model.Filter("ressourcepoolId", "Contains", value);
			if ( airbus.mes.stationtracker.AssignmentManager.polypolyAffectation ) {
				aFilters.push(filters);
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter(aFilters);
			}else{
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter(filters)
			}

		} else {
			if ( airbus.mes.stationtracker.AssignmentManager.polypolyAffectation ) {
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter(aFilters);
			}else{
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter()
			}
		}
	},


	clearFilters : function() {
		if (sap.ui.getCore().byId("typeRow")) {
			sap.ui.getCore().byId("typeRow").filter("");
		}
		if (sap.ui.getCore().byId("rp_id")) {
			sap.ui.getCore().byId("rp_id").filter("");
		}
		if (airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows")) {
			var filterLabels = new sap.ui.model.Filter("type", "EQ", "LABEL_RP");
			var filterUA = new sap.ui.model.Filter("type", "Contains", "UA_");
			var aFilters = [filterLabels, filterUA];
			if ( airbus.mes.stationtracker.AssignmentManager.polypolyAffectation ) {
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter(aFilters);
			}else{
				airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows").filter()
			}
			airbus.mes.polypoly.oView.byId("polypolySearchField").setValue();
		}
//		var oView = sap.ui.getCore().byId("polypoly");
//		var oTable = airbus.mes.polypoly.oView.byId("oTablePolypoly");
//		oTable.setFixedRowCount(2);
//		oTable.setVisibleRowCount(10);
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
					"airbus.mes.polypoly.ColumnPopup", that);
		}

		var oBindingInfo = oEvt.getSource().getParent()
		.getParent().getBindingContext();
		if (oBindingInfo != undefined) {
			airbus.mes.polypoly.PolypolyManager.internalContext.saveContext = "UPDATE";
			that.colDialog.setTitle(airbus.mes.polypoly.oView.getController().getI18n("EditPolypoly"));

			var aQASelList = oBindingInfo.getProperty("qa");
			columnModel.setData({
				competency : oBindingInfo.getProperty("name"),
				techname : oBindingInfo.getProperty("techname"),
				qa : aQAList,
				need3 : airbus.mes.polypoly.PolypolyManager.internalContext.oModel.oData.rows[1][oBindingInfo.getProperty("techname")],
				need4 : airbus.mes.polypoly.PolypolyManager.internalContext.oModel.oData.rows[2][oBindingInfo.getProperty("techname")]
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
			airbus.mes.polypoly.PolypolyManager.internalContext.saveContext = "CREATE";
			that.colDialog.setTitle(airbus.mes.polypoly.oView.getController().getI18n("CreatePolypoly"));
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
		that.colDialog.setModel(airbus.mes.polypoly.oView.getModel("PolypolyI18n"),"PolypolyI18n");
		that.colDialog.open();

		sap.ui.getCore().byId("colTechname").setEditable((airbus.mes.polypoly.PolypolyManager.internalContext.saveContext == "CREATE"));

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
		var reg = new RegExp('[A-Z0-9\_]*');
		var sTechname = columnModel.oData.techname;
		sTechname=sTechname.match(reg)[0];
		
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

		if (aQAfiltered.length <= 5 && sTechname != "" && sName != "") {
			if (airbus.mes.polypoly.PolypolyManager.internalContext.saveContext == "CREATE") {
				airbus.mes.polypoly.PolypolyManager.createColumn(sName, sQA, sNeed3, sNeed4, sTechname);
			} else {
				airbus.mes.polypoly.PolypolyManager.updateColumn(sName, sQA,sNeed3, sNeed4, sTechname);
			}
		} else if (sTechname == "") {
			sap.m.MessageToast.show(airbus.mes.polypoly.oView.getController().getI18n("TechNameEmpty"));
		}else if (sName == "") {
			sap.m.MessageToast.show(airbus.mes.polypoly.oView.getController().getI18n("DescEmpty"));
		} else if (aQAfiltered.length > 5) {
			sap.m.MessageToast.show(airbus.mes.polypoly.oView.getController().getI18n("TooManyQA"));
		}
	},

	onCancelColumnPopup : function() {
		sap.ui.getCore().byId("columnPopupDialog").close();
	},

	openConfirmDelete : function(oEvt) {
		columnModel.setData();
		var oBindingInfo = oEvt.getSource().getParent().getParent().getBindingContext();
		columnModel.setData({techname : oBindingInfo.getProperty("techname")});
		

		if (!airbus.mes.polypoly.delDialog) {
			airbus.mes.polypoly.delDialog = sap.ui.xmlfragment("airbus.mes.polypoly.confirmDelete", airbus.mes.polypoly.oView.getController());
		}
		airbus.mes.polypoly.delDialog.setModel(airbus.mes.polypoly.oView.getModel("PolypolyI18n"),"PolypolyI18n");
		airbus.mes.polypoly.delDialog.open();
	},

	onConfirmDelete : function() {
		airbus.mes.polypoly.PolypolyManager.deleteColumn(columnModel.getData().techname);
	},

	onCancelDelete : function() {
		airbus.mes.polypoly.delDialog.close();
	},

	onClickInfoUpdate12 : function(oEvt) {
		sap.ui.getCore().byId("infoUpdate12").close();
		airbus.mes.polypoly.PolypolyManager.checkUpdateLevel();
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
		airbus.mes.polypoly.PolypolyManager.checkUpdateLevel();
	},

	onCancelInfoUpdate23 : function() {
		sap.ui.getCore().byId("infoUpdate23").close();
	},

	onColumnMove : function(oEvt) {
		var newPos = oEvt.getParameters().newPos;
		var oldPos = oEvt.getParameters().column.getIndex();
		if (newPos != oldPos) {
			if ((oEvt.getParameters().newPos - 6) < 0
//					|| formatter.isPolypolyEditable() == false) {
					|| airbus.mes.polypoly.util.Formatter.isVisible() == false) {
				sap.m.MessageToast.show(airbus.mes.polypoly.oView.getController().getI18n("Unauthorized"));
				var oTable = oEvt.getSource();
				var oColumn = oEvt.getParameters().column;
				setTimeout(function() {
					oTable.removeColumn(newPos);
					oTable.insertColumn(oColumn, oldPos);
				}, 0);
			} else {
				var newPos = newPos - 5;
				var sTechname = oEvt.getParameters().column.getBindingContext().getProperty("techname");
				if(newPos < 10){
					newPos = "00" + newPos + "0";
				}else{
					newPos = "0" + newPos + "0";
				}
				airbus.mes.polypoly.PolypolyManager.moveColumn(sTechname, newPos);
			}
		}
	},

//	visibleButton : function() {
//	if (sap.ui.getCore().byId("polypoly").getModel()
//	.getData().rows) {
////	return formatter.isPolypolyEditable();
//	return airbus.mes.polypoly.PolypolyManager.globalContext.bEditable;
//	} else {
//	return false;
//	}

//	},

	onBackPress : function(){
		nav.back();
	},
	
	getI18n : function(str){
		return airbus.mes.polypoly.oView.getModel("PolypolyI18n").getProperty(str)
	},
	
	onIconAffectClick : function(oEvt){
		if (!airbus.mes.stationtracker.AssignmentManager.polypolyAffectation){
			return false;
		}
		if (!airbus.mes.polypoly.PolypolyManager.oViewController){
			airbus.mes.polypoly.PolypolyManager.oViewController = airbus.mes.polypoly.oView.getController();
		}
		airbus.mes.polypoly.PolypolyManager.oViewController.oUserIcon = oEvt.getSource();
		airbus.mes.polypoly.PolypolyManager.polypolyIndex = airbus.mes.polypoly.PolypolyManager.oViewController.oUserIcon.getModel().getProperty(airbus.mes.polypoly.PolypolyManager.oViewController.oUserIcon.getBindingContext().getPath());
		airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedUser = airbus.mes.polypoly.PolypolyManager.polypolyIndex;
		
		var sERP_ID = airbus.mes.polypoly.PolypolyManager.polypolyIndex.login;
		if (sERP_ID == "---" || sERP_ID == " ") {
			ModelManager.messageShow(airbus.mes.polypoly.oView.getController().getI18n("InvalidID") + sERP_ID);
			return false;
		}
		
		airbus.mes.stationtracker.AssignmentManager.handleLineAssignment("S", false);
		
//		if (!airbus.mes.polypoly.PolypolyManager.oViewController.oDialogConfirmationPoyPoly) {
//			airbus.mes.polypoly.PolypolyManager.oViewController.oDialogConfirmationPoyPoly = sap.ui.xmlfragment("airbus.mes.polypoly.userAffectationConfirmationPolyPoly",airbus.mes.polypoly.oView.getController());
//		}
		 
//		airbus.mes.polypoly.ModelManager.chkUserOprCertificatePolyPoly(sERP_ID);
		return;

	},
	
// NOT USED	
//	onUserAllocate : function(oEvt) {
//		if (!airbus.mes.polypoly.PolypolyManager.oViewController)
//			airbus.mes.polypoly.PolypolyManager.oViewController = airbus.mes.polypoly.oView.getController();
//		airbus.mes.polypoly.PolypolyManager.oViewController.checkBox = oEvt.getSource();
//		airbus.mes.polypoly.PolypolyManager.polypolyIndex = airbus.mes.polypoly.PolypolyManager.oViewController.checkBox.getModel().getProperty(airbus.mes.polypoly.PolypolyManager.oViewController.checkBox.getBindingContext().getPath());
//		if (airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_ID == "---" || airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_ID == " ") {
//			ModelManager.messageShow("Invalid ERP ID" + airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_ID);
//			airbus.mes.polypoly.PolypolyManager.oViewController.checkBox.setSelected(false);
//			return false;
//		}
//		if (airbus.mes.polypoly.PolypolyManager.oViewController.checkBox.getSelected()) {
//			if (sap.ui.getCore().byId("toogleAffectConfirm").getState() === true) {
//				if (!airbus.mes.polypoly.PolypolyManager.oViewController.oDialogConfirmationPoyPoly) {
//					airbus.mes.polypoly.PolypolyManager.oViewController.oDialogConfirmationPoyPoly = sap.ui.xmlfragment("airbus.userAffectationConfirmationPolyPoly",airbus.mes.polypoly.PolypolyManager.oViewController);
//				}
//				var erp_id = airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_IDModelManager.chkUserOprCertificatePolyPoly(erp_id,airbus.mes.polypoly.PolypolyManager.oViewController.checkBox);
//				return;
//			}
//			// if no QA check assign automatically
//		}
//		// to deselect --auto
//		// Poly Poly User Save
//		if (!ModelManager.polypoly_UserSave) {
//			ModelManager.polypoly_UserSave.push(airbus.mes.polypoly.PolypolyManager.polypolyIndex);
//		}
//		if ((ModelManager.polypoly_UserSave.some(function(element) {
//					return (element.ERP_ID == airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_ID);
//				})) === false) {
//			ModelManager.polypoly_UserSave.push(airbus.mes.polypoly.PolypolyManager.polypolyIndex);
//		}
//	},

//	afterConfirmPress : function(oEvt) {
//	oEvt.getSource().getParent().close();
//	airbus.mes.polypoly.PolypolyManager.oViewController.checkBox
//	.setSelected(true); // works auto
//	if (!ModelManager.polypoly_UserSave) {
//	ModelManager.polypoly_UserSave
//	.push(airbus.mes.polypoly.PolypolyManager.polypolyIndex);
//	}
//	if ((ModelManager.polypoly_UserSave
//	.some(function(element) {
//	return (element.ERP_ID == airbus.mes.polypoly.PolypolyManager.polypolyIndex.ERP_ID);
//	})) === false) {
//	ModelManager.polypoly_UserSave
//	.push(airbus.mes.polypoly.PolypolyManager.polypolyIndex);
//	}

//	},
	onCancel : function(oEvt) {
		oEvt.getSource().getParent().close();
		airbus.mes.polypoly.PolypolyManager.oViewController.checkBox
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
//		sap.ui.getCore().byId(
//		"polypolyView--stationSelectPolyPoly")
//		.setSelectedKey(airbus.mes.polypoly.ModelManager.station_number);
//		sap.ui.getCore().byId(
//		"polypolyView--lineSelectPolyPoly")
//		.setSelectedKey(airbus.mes.polypoly.ModelManager.line_number);
	},

	onValueChange : function(oEvt) {
//		var station = sap.ui.getCore().byId(
//		"polypolyView--stationSelectPolyPoly")
//		.getSelectedKey();
//		var line_number = sap.ui.getCore().byId(
//		"polypolyView--lineSelectPolyPoly")
//		.getSelectedKey();
//		airbus.mes.polypoly.PolypolyManager.getPolypolyModel(
//		airbus.mes.polypoly.ModelManager.factory_name,
//		line_number, station,
//		airbus.mes.polypoly.ModelManager.site);
	},
//	setVisible: function(){
//	return  airbus.mes.polypoly.PolypolyManager.globalContext.tabSelected == "polypoly" ? true:false;
//	},

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
