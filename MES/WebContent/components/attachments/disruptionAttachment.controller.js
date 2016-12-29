"use strict";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	

	return Controller.extend("airbus.mes.attachments.disruptionAttachment", {
//		onInit: function(){
//			var loHeaderPath = "attachDisruption" + ">/"
//			var loDisruptionList = this.getView().byId("idDisruptionsList")
//			var list = this.getView().byId("idDisruptionsist")
//
//			loDisruptionList.bindItems({
//				path: "attachDisruption>/Rowsets/Rowset/0/Row/0/wp01",
////				sorter: new sap.ui.model.Sorter("attachDisruption>FirstName", false, function(oContext) {
////					return {
////						key: oContext.getProperty("NameChar")
////					};
////				}),
////				template: new sap.m.ObjectListItem({
////					title: "{attachDisruption>wo_no} {attachDisruption>op_no}",
////					attributes: [new sap.m.ObjectAttribute({
////						text: "{attachDisruption>dis_no}"
////					}), new sap.m.ObjectAttribute({
////						text: "{attachDisruption>dis_des}"
////					}), new sap.m.ObjectAttribute({
////						text: "{attachDisruption>gravity}"
////					})],
////					firstStatus: new sap.m.ObjectStatus({
////						text: "{attachDisruption>status}"
////					})
////
////				})
//				
//				
//				
//				
//				
//				
////				template: new sap.m.CustomListItem({
////				    content: [
////				            new sap.m.Panel({
////				            	expandable:true,
//////						headerText : "This is the Panel header",
////						headerToolbar : new sap.m.Toolbar({
////							content : [
////							new sap.m.Title({
////								text : "{attachDisruption>wo_no}-{attachDisruption>op_no}-{attachDisruption>dis_no}-{attachDisruption>dis_des}-{attachDisruption>gravity}-{attachDisruption>status}"
////							})
////							]
////						}),
////						content : [
////						           list.bindItems({
////						        	   path: "attachDisruption>Row1/",
////						        	 template:  new sap.m.CustomListItem({
////							        	   content: [
////											            new sap.m.Panel({
////											            	expandable:true,
////													headerToolbar : new sap.m.Toolbar({
////														content : [
////														new sap.m.Title({
////															text : "{attachDisruption>Title}"
////														})
////														]
////													})
////											            })
////											            ]
////							           })
////						           })
////						           ],
////				            
////				    })
////						],
////				})				
//				
//				
//				template: new sap.m.CustomListItem({
//				    content: [
//				            new sap.m.Panel({
//				            	expandable:true,
//				            	expand: function(oEvt){
//				            		var oPath = oEvt.oSource.oPropagatedProperties.oBindingContexts.attachDisruption.sPath;
//				            		var oLength = oPath.length;
//				            		var oIndex = oPath.slice(oLength-1);
//				            		var oList = this.oParent.oParent.oParent.byId("idDisruptionsist");
//				            		oList.bindItems({
//
//				        		        	   path: "attachDisruption>/Rowsets/Rowset/0/Row/0/wp01/0/op01/0/dp01/"+oIndex+"/",
//				        		        	 template:  new sap.m.CustomListItem({
//				        			        	   content: [
//				        							            new sap.m.Panel({
//				        							            	expandable:true,
//				        									headerToolbar : new sap.m.Toolbar({
//				        										content : [
//				        										new sap.m.Title({
//				        											text : "{attachDisruption>dis_no}"
//				        										})
//				        										]
//				        									})
//				        							            })
//				        							            ]
//				        			           })
//				        		});
//				            		var oModel = oList.getBindingContext().getModel();
//				            		var oContext = oModel.getContext(sPath);
//				            		oList.setBindingContext(oContext);
//				            		
//				            		
//				            	},
////						headerText : "This is the Panel header",
//						headerToolbar : new sap.m.Toolbar({
//							content : [
//							new sap.m.Title({
//								text : "{attachDisruption>wo_no}{attachDisruption>op01/0/op_no}"
//							})
//							]
//						}),
//						content : [
//						           list.bindItems({
//						        	   path: "attachDisruption>/Rowsets/Rowset/0/Row/0/wp01/0/op01/0/dp01/",
//						        	 template:  new sap.m.CustomListItem({
//							        	   content: [
//											            new sap.m.Panel({
//											            	expandable:true,
//													headerToolbar : new sap.m.Toolbar({
//														content : [
//														new sap.m.Title({
//															text : "{attachDisruption>dis_no}"
//														})
//														]
//													})
//											            })
//											            ]
//							           })
//						           })
//						           ],
//				            
//				    })
//						],
//				})
//
//			});
//		},
		onNavPress: function(){
			this.nav = this.getView().oParent;
			this.nav.back();
		},
		onFilterChange: function(oEvent){}

	});
});
