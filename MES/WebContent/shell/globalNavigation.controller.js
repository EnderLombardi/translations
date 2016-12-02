"use strict";

sap.ui.controller(
				"airbus.mes.shell.globalNavigation",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.globalnav.globalNavigation
					 */
					onInit : function() {
					},
					
					onPress : function(oEvt) {
					},

					goToHome : function() {
						// Active settings button during leaving settings screen
						if (airbus.mes.shell != undefined) {
							sap.ui.getCore().byId("popupSettingsButton").setEnabled(true);
							airbus.mes.shell.oView.getController().setInformationVisibility(false);
						}

						if (airbus.mes.homepage != undefined) {
							nav.to(airbus.mes.homepage.oView.getId());
						} else {
							sap.ui.getCore().createComponent({
								name : "airbus.mes.homepage", // root component folder is resources
							});
							nav.addPage(airbus.mes.homepage.oView);
							nav.to(airbus.mes.homepage.oView.getId());
						}
					},
					
					/**
					 * action on the view globalNavigation
					 * Change the language settings with two step
					 * 1 - save data on MII back end with saveUserSetting function
					 * 2 - update and reload the url of the application with sap-language parameter
					 * 
					 * @memberOf components.globalnav.globalNavigation
					 * @param {Object} oEvent : Button event
					 */
					onChangeLanguage : function(oEvent) {
//					    Retrieve language
						var sText = oEvent.getSource().getSelectedKey();
						
//						Update the language on the settings ModelManager
						airbus.mes.settings.ModelManager.saveUserSetting(sText);
						
//						Reload the url with the new language
						this.updateUrlForLanguage(sText);
					},
					
					/**
					 * Set the new language on the url and reload 
					 * @memberOf components.globalnav.globalNavigation
					 * @param {String} sText : new language code
					 */
					updateUrlForLanguage : function(sText) {
						switch (sText) {
						case "en":
							sap.ui.getCore().getConfiguration().setLanguage("en");
							break;
						case "de":
							sap.ui.getCore().getConfiguration().setLanguage("de");
							break;
						case "fr":
							sap.ui.getCore().getConfiguration().setLanguage("fr");
							break;
						case "sp":
							sap.ui.getCore().getConfiguration().setLanguage("sp");
							break;
						default:
							sap.ui.getCore().getConfiguration().setLanguage(sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2))
							break;
						}
					},
					
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.globalnav.globalNavigation
					 */
					 onBeforeRendering: function() {
					 },
					
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.globalnav.globalNavigation
					 */
					onAfterRendering : function() {
						
						// add event on home button this is not done by ui addEvent because
						// we cant add and delete the same event several time
						// this is use to block the user if he has no user setting saved or unvailable.
						$( '#' + airbus.mes.shell.oView.byId("logo").sId).click(airbus.mes.shell.oView.getController().goToHome);
				
					},
					
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.?????
					 * 
					 * @memberOf components.globalnav.globalNavigation
					 */
					navigate : function() {
						this.setInformationVisibility(false);
						// Deactivate button on settings screen
						sap.ui.getCore().byId("popupSettingsButton").setEnabled(false);

						var textButtonTo = undefined;

						switch (nav.getCurrentPage().getId()) {
						case "stationTrackerView":
							textButtonTo = "Go to Station Tracker";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
							break;
						case "homePageView":
							textButtonTo = "Go to Home Page";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
							break;
						case "resourcePool":
							textButtonTo = "Go to Team Assignment";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
							break;
						case "disruptiontrackerView":
							textButtonTo = "Go to Disruption Tracker";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
							break;
						case "polypolyPage":
							textButtonTo = "Go to Polypoly";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "polypoly");
							break;
						case "idMainView":
							textButtonTo = "Go to LineTracker";
							airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
							break;
						default:
						}
					},

					onNavigate : function() {
						airbus.mes.shell.AutoRefreshManager.clearInterval();
					},
					
					/**
					 * Refresh view
					 */
					refreshbtn: function() {
						console.log(" ========== refresh ==========");
						switch (nav.getCurrentPage().getId()) {
						
							case "stationTrackerView":
								this.renderStationTracker();
								airbus.mes.shell.AutoRefreshManager.clearInterval();
								airbus.mes.shell.AutoRefreshManager.setInterval("stationTrackerView");
								break;
							case "disruptiontrackerView":
								airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
								airbus.mes.shell.AutoRefreshManager.clearInterval();
								airbus.mes.shell.AutoRefreshManager.setInterval("disruptiontrackerView");
								break;
							case "disruptionKPIView":
								airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel();
								airbus.mes.shell.AutoRefreshManager.clearInterval();
								airbus.mes.shell.AutoRefreshManager.setInterval("disruptionKPIView");
								break;
							default:
							}
					},
					
					renderViews : function() {
						
						switch (nav.getCurrentPage().getId()) {
						case "homePageView":
							airbus.mes.shell.oView.byId('refreshTime').setVisible(false);
							airbus.mes.shell.oView.byId("homeButton").setVisible(false);
							airbus.mes.shell.oView.byId("SelectLanguage").setVisible(true);
							break;
						case "settingsView":
							airbus.mes.shell.oView.byId('refreshTime').setVisible(false);
							break;
						case "stationTrackerView":
							this.renderStationTracker();
							airbus.mes.shell.AutoRefreshManager.setInterval("stationTrackerView");
							airbus.mes.shell.oView.byId('refreshTime').setVisible(true);
							airbus.mes.shell.oView.byId("homeButton").setVisible(true);
							airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
							break;
						case "disruptiontrackerView":
							airbus.mes.shell.AutoRefreshManager.setInterval("disruptiontrackerView");
							airbus.mes.shell.oView.byId('refreshTime').setVisible(true);
							airbus.mes.shell.oView.byId("homeButton").setVisible(true);
							airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
							break;
						case "disruptionKPIView":
							airbus.mes.shell.AutoRefreshManager.setInterval("disruptionKPIView");
							airbus.mes.shell.oView.byId('refreshTime').setVisible(true);
							airbus.mes.shell.oView.byId("homeButton").setVisible(true);
							airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
							break;
						case "resourcePool":
							airbus.mes.resourcepool.util.ModelManager.askResourcePool();
							break;
						default:
						}
					},

					/**
					 * RenderStation Tracker and reload all model reload shift
					 * and compute shift hierarchy.
					 */
					renderStationTracker : function() {
						airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);
						airbus.mes.stationtracker.ShiftManager.updateShift = false;
						var oModule = airbus.mes.stationtracker.ModelManager;
						airbus.mes.shell.oView.getController().setInformationVisibility(true);

						// ** synchrone call **//
						oModule.loadShifts();
						oModule.loadAffectation();
						airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
						airbus.mes.stationtracker.AssignmentManager.computeAffectationHierarchy();

						// ** asynchrone call **//
						airbus.mes.shell.oView.oController.loadStationTrackerGantKPI();
						
					},

					loadStationTrackerGantKPI : function() {
						var oModule = airbus.mes.stationtracker.ModelManager;
						airbus.mes.stationtracker.ShiftManager.updateShift = false;
						// ** asynchrone call **//
						oModule.loadRessourcePool();
						oModule.loadStationTracker("U");
						oModule.loadStationTracker("O");
						oModule.loadStationTracker("R");
						oModule.loadProductionGroup();
						oModule.loadFilterUnplanned();
						oModule.loadKPI();
						// oModule.loadKPIextraWork();
					},

					setInformationVisibility : function(bSet) {
						this.getView().byId("informationButton").setVisible(bSet);
						this.getView().byId("homeButton").setVisible(bSet);
						this.getView().byId("SelectLanguage").setVisible(!bSet);
					},
					
					onInformation : function(oEvent) {
						airbus.mes.shell.oView.addStyleClass("viewOpacity");

						if (airbus.mes.stationtracker.informationPopover === undefined) {
							var oView = airbus.mes.stationtracker.oView;
							airbus.mes.stationtracker.informationPopover = sap.ui.xmlfragment(
											"informationPopover",
											"airbus.mes.shell.informationPopover",
											airbus.mes.shell.oView.getController()
											);
							airbus.mes.stationtracker.informationPopover.addStyleClass("alignTextLeft");
							oView.addDependent(airbus.mes.stationtracker.informationPopover);
						}

						// delay because addDependent will do a async
						// re-rendering and the popover will immediately close
						// without it
						var oButton = oEvent.getSource();
						jQuery.sap.delayedCall(0, this, function() {
							airbus.mes.stationtracker.informationPopover.openBy(oButton);
						});
					},
					
					onCloseInformation : function() {
						airbus.mes.shell.oView.removeStyleClass("viewOpacity");
					},
					
					/***********************************************************
					 * My Profile PopUp
					 */
					goToMyProfile : function() {
						if (!this.myProfileDailog) {
							this.myProfileDailog = sap.ui.xmlfragment("airbus.mes.shell.myProfile", this);
							this.getView().addDependent(this._myProfileDialog);
						}
						
						this.myProfileDailog.open();
						sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
						sap.ui.getCore().byId("uIdMyProfile").setValue("");
						sap.ui.getCore().byId("badgeIdMyProfile").setValue("");
						sap.ui.getCore().byId("userNameMyProfile").setValue("");
						sap.ui.getCore().byId("passwordMyProfile").setValue("");
						sap.ui.getCore().byId("pinCodeMyProfile").setValue("");
					},
					
					onCancelMyProfile : function() {
						sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.None);
						sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.None);
						this.myProfileDailog.close();
					},

					/***********************************************************
					 * Scan Badge for Save User Profile
					 */
					onScanMyProfile : function(oEvt) {
						var timer;
						// close existing connection. then open again
						oEvt.getSource().setEnabled(false);
						var callBackFn = function() {
							console.log("callback entry \n");
							console.log("connected");
							if (airbus.mes.shell.ModelManager.badgeReader.readyState == 1) {
								airbus.mes.shell.ModelManager.brStartReading();
								sap.ui.getCore().byId("msgstrpMyProfile").setText(
												sap.ui.getCore().getModel("ShellI18n").getProperty("ConenctionOpened")
												);
								var i = 10;

								timer = setInterval(
										function() {
											sap.ui.getCore().byId("msgstrpMyProfile").setType("Information");
											sap.ui.getCore().byId("msgstrpMyProfile").setText(
															sap.ui.getCore().getModel("ShellI18n").getProperty("ConnectYourBadge")+ "" + i--
															);
											if (i < 0) {
												clearInterval(timer);
												airbus.mes.shell.ModelManager.brStopReading();
												sap.ui.getCore().byId("scanButtonMyProfile").setEnabled(true);
												sap.ui.getCore().byId("msgstrpMyProfile").setType("Warning");
												sap.ui.getCore().byId("msgstrpMyProfile").setText(
																sap.ui.getCore().getModel("ShellI18n").getProperty("timeout")
																);
												airbus.mes.shell.ModelManager.brStopReading();
												airbus.mes.shell.ModelManager.badgeReader.close();
												setTimeout(function() {
													sap.ui.getCore().byId("msgstrpMyProfile").setVisible(false);
												}, 2000)
											}
										}, 1000)

							}
						}

						var response = function(data) {
							clearInterval(timer);
							sap.ui.getCore().byId("uIdMyProfile").setValue();
							sap.ui.getCore().byId("badgeIdMyProfile").setValue();
							sap.ui.getCore().byId("scanButtonMyProfile").setEnabled(true);
							sap.ui.getCore().byId("msgstrpMyProfile").setVisible(false);
							if (data.Message) {
								type = data.Message.split(":")[0];
								// id = data.Message.split(":")[1];

								if (type == "UID") {
									sap.ui.getCore().byId("uIdMyProfile").setValue(data.Message);
									sap.ui.getCore().byId("msgstrpMyProfile").setType("Success");
									sap.ui.getCore().byId("msgstrpMyProfile").setText(
													sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully")
													);
									sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);

								} else if (type == "BID") {
									sap.ui.getCore().byId("badgeIdMyProfile").setValue(data.Message);
									sap.ui.getCore().byId("msgstrpMyProfile").setType("Success");
									sap.ui.getCore().byId("msgstrpMyProfile").setText(
													sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully")
													);
									sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
									
								} else {
									sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
									sap.ui.getCore().byId("msgstrpMyProfile").setText(
													sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning")
													);
									sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
								}
								
							} else {
								sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
								sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
								sap.ui.getCore().byId("msgstrpMyProfile").setText(
													sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning")
													);
							}
							setTimeout(function() {
								sap.ui.getCore().byId("msgstrpMyProfile").setVisible(false);
								sap.ui.getCore().byId("msgstrpMyProfile").setText("");
							}, 2000);
							
							airbus.mes.shell.ModelManager.badgeReader.close();
							sap.ui.getCore().byId("scanButtonMyProfile").setEnabled(true);
						}
						var error = function() {
							clearInterval(timer);
							sap.ui.getCore().byId("scanButtonMyProfile").setEnabled(true);
							sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
							sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
							sap.ui.getCore().byId("msgstrpMyProfile").setText(
													sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorConnectionWebSocket")
													);
							
							setTimeout(function() {
								sap.ui.getCore().byId("msgstrpMyProfile").setVisible(false);
								sap.ui.getCore().byId("msgstrpMyProfile").setText("");
							}, 2000)
							
							sap.ui.getCore().byId("scanButtonMyProfile").setEnabled(true);

						}

						// Open a web socket connection
						// if(!airbus.mes.shell.ModelManager.badgeReader){
						airbus.mes.shell.ModelManager.connectBadgeReader(
								callBackFn, response, error);
						// }

						sap.ui.getCore().byId("msgstrpMyProfile").setType("Information");
						sap.ui.getCore().byId("msgstrpMyProfile").setText(
								sap.ui.getCore().getModel("ShellI18n").getProperty("OpeningConnection")
								);
						sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);

					},

					onSaveMyProfile : function(oEvent) {
						sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
						var badgeID = sap.ui.getCore().getElementById("badgeIdMyProfile").getValue();
						var uID = sap.ui.getCore().getElementById("uIdMyProfile").getValue();
						var user = sap.ui.getCore().getElementById("userNameMyProfile").getValue();
						var pass = sap.ui.getCore().getElementById("passwordMyProfile").getValue();
						var pinCode = sap.ui.getCore().getElementById("pinCodeMyProfile").getValue();

						if (user == "" || pass == "") {
							sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
							sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
							sap.ui.getCore().byId("msgstrpMyProfile").setText(
									sap.ui.getCore().getModel("ShellI18n").getProperty("CompulsaryCredentials")
									);
							
							if (user === "") {
								sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.Error);
							} else {
								sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.None);
							};
							
							if (pass === "") {
								sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.Error);
							} else {
								sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.None);
							};
							
						} else {
							if (user != "" || user != undefined) {
								sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.None);
							};
							if (pass != "" || pass != undefined) {
								sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.None);
							};
							var sMessageError = sap.ui.getCore().getModel("ShellI18n").getProperty("errorMsgwhileSavingProfile");
							var sMessageSuccess = sap.ui.getCore().getModel("ShellI18n").getProperty("successMsgwhileSavingProfile");
							// Call service for Save My Profile
							jQuery
									.ajax({
										url : airbus.mes.shell.ModelManager
												.getMyProfileUrl(badgeID, user,
														pass, pinCode, uID),
										async : false,
										error : function(xhr, status, error) {
											airbus.mes.shell.ModelManager
													.messageShow(sMessageError);
											flag_success = false

										},
										success : function(result, status, xhr) {
											if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
												airbus.mes.shell.ModelManager
														.messageShow(sMessageSuccess);
												flag_success = true;
											} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
												airbus.mes.shell.ModelManager
														.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
												flag_success = false;
											} else {
												airbus.mes.shell.ModelManager
														.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
												flag_success = true;
											}

										}
									});
							if (flag_success === true) {
								this._myProfileDailog.close();
							} else {
								airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
							}
						}

					},
					openSettingPopup : function() {
					
						airbus.mes.shell.settingPopup.openBy(this.getView().byId("settingsButton"));
					
					},

					logOut : function() {
						Cookies.remove("login");
						window.location = window.location.origin + window.location.pathname;

					}
				});

