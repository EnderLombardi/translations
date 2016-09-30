sap.ui.controller("airbus.mes.polypoly.main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf polypoly.main
*/
	onAfterRendering: function() {
		model = new sap.ui.model.json.JSONModel("./model/polypoly.json");
		this.getView().setModel(model);
		var oTable = sap.ui.getCore().byId("idmain1--polypolyView--oTable");
//		oTable.bindAggregation("columns", {
//			path : "/columns",
//			factory : function(sId, oContext) {	sap.ui.getCore().byId("idmain1--polypolyView").getController().createColumn(sId, oContext);
//				},
//				
//			
//		});
//				
////				"/columns", function(sId, oContext) {
////			sap.ui.getCore().byId("idmain1--polypolyView").getController().createColumn(sId, oContext);
////		});
////		
//		
//		oTable.bindRows("/rows");


		
	},
	
	createColumn : function (sId, oContext) {
		var that = this;
		switch(oContext.getProperty("type")){
			case "type":
				var oColumn =  new sap.ui.table.Column({
					id: "typeRow",
					visible: false,
					filterProperty: oContext.getProperty("techname"),
					showFilterMenuEntry: false,
					width: "10rem",
					template : new sap.m.Text({
						text : {
							parts: [oContext.getProperty("techname")],
							formatter: function(text){
								return text;
							}
						},
					})
				})
				break;
			case "ressourcepool":
				var oColumn =  new sap.ui.table.Column({
					id: oContext.getProperty("type"),
					filterProperty: oContext.getProperty("techname"),
					showFilterMenuEntry: false,
					width: "10rem",
					template : new sap.m.Text({
						visible: {
							parts: ["type"],
							formatter: function(type){
								if(type == "NEED"){
									return false;
								} else {
									return true;
								}
							}
						},
						text : {
							parts: [oContext.getProperty("techname")],
							formatter: function(text){
								return text;
							}
						},
					})
				})
				break;
			case "category":
				var oColumn =  new sap.ui.table.Column({
					id: oContext.getProperty("type"),
					filterProperty: oContext.getProperty("techname"),
					showFilterMenuEntry: false,
					width: "10rem",
					template : new sap.m.Text({
						text : {
							parts: [oContext.getProperty("techname")],
							formatter: function(text){
								return text;
							}
						},
					})
				})
				break;
			case "icon":
				var oColumn =  new sap.ui.table.Column({
					hAlign: "Center",
					width: "3rem",
					template :  new sap.m.VBox({
						items: [
						        new sap.ui.core.Icon({
						        	src: "sap-icon://employee",
						        	color : {
						        		parts: ["icon"],
						        		formatter: function(status){
						        			switch(status){
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
						        			}
						        		}
						        	},
						        	visible : {
						        		parts: ["type"],
						        		formatter: function(type){
						        			return type == "UA_A" || type == "UA_P"
						        		}
						        	}
						        }),
						        new sap.m.Image({
						        	src: "{icon}",
						        	height: "1.5rem",
						        	visible : {
						        		parts: ["type"],
						        		formatter: function(type){
						        			return type != "UA_A" && type != "UA_P"
						        		}
						        	}
						        })]
					})
				});
				break;
			case "column":
				var oColumn =  new sap.ui.table.Column({
					id: sId,
					hAlign: "Center",
					width: "5rem",
					multiLabels: [
//					              new sap.m.Label({
//					            	  text : oContext.getProperty("workpackage")
//					              }),
								  new sap.ui.core.Icon({
									 src: "sap-icon://edit",
									 size: "1rem",
								  }),
					              new sap.m.Label({
					            	  text : oContext.getProperty("name")
					              }),
					              new sap.m.VBox({
					            	  items: {
					            		  path: "qa",
					            		  template: new sap.m.Label({
					            			  text: "{label}"
					            		  })
					            	  }
					              })
					              ],
					template :  new sap.m.VBox({
						items: [
						        new sap.m.Text({
						        	text : {
										parts: [oContext.getProperty("techname")],
										formatter: function(text){
											return text;
										}
									},
						        	visible : {
						        		parts: ["type"],
						        		formatter: function(type){
						        			return (type == "NEED") || (type == "ASIS")
						        		}
						        	}
						        }),
						        new sap.m.Button({
						        	icon: {
										parts: [oContext.getProperty("techname")],
										formatter: function(uri){
											return uri;
										}
									},
						        	visible : {
						        		parts: ["type"],
						        		formatter: function(type){
						        			return type == "UA_A" || type == "UA_P"
						        		}
						        	},
						        	press: function(oEvt){
						        		that.onImgClick(oEvt)
						        		},
						        }),
						        new sap.m.Button({
						        	text : {
										parts: [oContext.getProperty("techname")],
										formatter: function(text){
											return text;
										}
									},
									type: {
										parts: [oContext.getProperty("techname")],
										formatter: function(value){
											if(value < 0){
												return "Reject";
											} else {
												return "Accept";
											};
										}
									},
									enabled: false,
						        	visible: {
						        		parts: ["type"],
						        		formatter: function(type){
						        			return type == "GAP"
						        		}
						        	},
						        }),
						        ]
					})
				});
				break;
		};
		
		return oColumn
	},
	


	
	onImgClick : function(oEvt){
//		var sId = oEvt.getId();
		airbus.mes.polypoly.PolypolyManager.userComptencyContext.rowBindingContext = oEvt.getSource().getBindingContext();
		airbus.mes.polypoly.PolypolyManager.userComptencyContext.columnIndex = oEvt.getSource().getParent().getParent().getCells().indexOf(oEvt.getSource());
		var oPopover = new sap.m.Popover({
			showHeader : false,
			content: [new sap.m.VBox({
				alignItems: "Center",
				items: [
//			new sap.m.Image({
//					src: "images/1.PNG",
//			    	height: "1.5rem",
//			    	press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
//			}),
			new sap.m.Button({
//				id:"img" + oContext.sPath.substring(6, 7)+ "_" + aComp[i],
				icon: "images/1.PNG",
				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
			}),
//			new sap.m.Image({
//				src: "images/2.PNG",
//				height: "1.5rem",
//				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
//			}),
			new sap.m.Button({
//				id:"img" + oContext.sPath.substring(6, 7)+ "_" + aComp[i],
				icon: "images/2.PNG",
				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
			}),
//			new sap.m.Image({
//				src: "images/3.PNG",
//				height: "1.5rem",
//				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
//			}),
			new sap.m.Button({
//				id:"img" + oContext.sPath.substring(6, 7)+ "_" + aComp[i],
				icon: "images/3.PNG",
				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
			}),
//			new sap.m.Image({
//				src: "images/4.PNG",
//				height: "1.5rem",
//				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
//			}),
			new sap.m.Button({
//				id:"img" + oContext.sPath.substring(6, 7)+ "_" + aComp[i],
				icon: "images/4.PNG",
				press: function(oEvt){ sap.ui.getCore().byId("idmain1").getController().onChangeClick(oEvt)}
			})
			]})],
		});
		oPopover.openBy(sap.ui.getCore().byId(oEvt.getSource().getId()));
		
	},
	
	onChangeClick : function(oEvt){
		var levelComp = oEvt.getSource().getParent().getItems().indexOf(oEvt.getSource()) + 1;
	},
	
	filterUA : function(){
		sap.ui.getCore().byId("typeRow").filter("UA_P");
		var oView = sap.ui.getCore().byId("idmain1").byId("polypolyView");
		var oTable = oView.byId("oTable");
		oTable.setFixedRowCount(0);
		oTable.setVisibleRowCount(oTable.getMinAutoRowCount());
	},
	
	filterRessourcePool : function(str){
		sap.ui.getCore().byId("ressourcepool").filter(str);
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf polypoly.main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf polypoly.main
*/
//	onAfterRendering: function() {
//		sap.ui.getCore().byId("__table0-3").setHeaderSpan([3,1,1])
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf polypoly.main
*/
//	onExit: function() {
//
//	}

});
