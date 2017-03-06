"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("airbus.mes.stationtracker.util.BoxDisplayManager");
jQuery.sap.declare("airbus.mes.stationtracker.util.Formatter");

airbus.mes.stationtracker.util.Formatter = {

	dateToStringFormat: function (sDate) {
		// Date send by MII are UTC date
		var oDate = new Date(sDate);
		var oFormat = sap.ui.core.format.DateFormat.getInstance({
			UTC: true,
			pattern: "dd MMM - HH:mm",
			calendarType: sap.ui.core.CalendarType.Gregorian
		});
		return oFormat.format(oDate)
	},

	stringToInt: function (string) {
		if (typeof string == "string") {
			return parseInt(string, 10)
		} else {
			return string
		}
	},

	dateForWorkTracker: function (startDate, endDate) {
		var startTime = new Date(startDate);
		var endTime = new Date(endDate);
		var returnValue;

		returnValue = ("0" + startTime.getHours()).substr(-2) + ':' + ("0" + startTime.getMinutes()).substr(-2) + ' - ' + ("0" + endTime.getHours()).substr(-2) + ':' + ("0" + endTime.getMinutes()).substr(-2);

		return returnValue;

	},


	dateDelayForWorkTracker: function (startDate, endDate) {
		var startTime = new Date(startDate);
		var endTime = new Date(endDate);
		var diffDate;
		var returnValue;


		diffDate = endTime.getDay() - startTime.getDay();
		if (diffDate > 0) {
			returnValue = ' (+' + diffDate + ')';
		}
		return returnValue;

	},

	KPIiconTrendSrc: function (bTrend) {
		if (bTrend == "true") {
			return "sap-icon://up"
		} else if (bTrend == "false") {
			return "sap-icon://down"
		} else {
			return "sap-icon://media-play"
		}
	},

	KPIiconTrendColor: function (bTrend) {
		if (bTrend == "true") {
			return "#84bd00"
		} else if (bTrend == "false") {
			return "#e4002b"
		} else {
			return "#97999b"
		}
	},

	minSizeMinutes: 30,

	sizeMin: function (sEndDate, sStartDate) {

		var oUtil = airbus.mes.stationtracker.util.Formatter;
		var oShiftManager = airbus.mes.stationtracker.util.ShiftManager;
		var dEndDate = sEndDate;
		var dStartDate = sStartDate;
		var dMaxDate = oShiftManager.shifts[oShiftManager.shifts.length - 1].EndDate;

		if (dEndDate - dStartDate < oUtil.minSizeMinutes * 60 * 1000) {
			if (oShiftManager.closestShift(dStartDate) != -1 && dStartDate > oShiftManager.shifts[0].StartDate) {

				dStartDate.setMinutes(dStartDate.getMinutes() + oUtil.minSizeMinutes);

				while (oShiftManager.isDateIgnored(dStartDate)) {

					if (dStartDate < dMaxDate) {

						dStartDate.setMinutes(dStartDate.getMinutes() + oUtil.minSizeMinutes);
						var sDate = Math.max(dEndDate, dStartDate);
						return new Date(sDate);
					}

				}
				var sDate = Math.max(dEndDate, dStartDate);

				return new Date(sDate);
			}
		}
		return sEndDate;

	},

	openFolder: function (bOpen) {

		if (bOpen) {
			return "fa fa-chevron-down custom";
		} else {
			return "fa fa-chevron-right custom";
		}
	},

	spaceInsecable: function (sText) {

		var sTextF = "";
		var aText = sText.split(new RegExp("[ ]+", "g")); // Récupère tous les mots dans un tableau : texte_decoup

		for (var i = 0; i < aText.length; i++) {
			if (aText.length - 1 === i) {
				sTextF += aText[i]; // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32)
			} else {
				sTextF += aText[i] + "&nbsp;";
			}
		}

		return sTextF;
	},

	jsDateFromDayTimeStr: function (day) {

		// return day for IE not working. - 1 on month because 00 = january
		if (day != undefined) {
			return new Date(day.slice(0, 4), day.slice(5, 7) - 1, day.slice(8, 10), day.slice(11, 13), day.slice(14, 16), day.slice(17, 19));
		} else {
			return new Date();
		}

	},

	// Transform object Date to date (without hour)

	dDate2sDate: function (dDate) {

		var sMounth = dDate.getMonth() + 1;
		var sDay = dDate.getDate();
		var sHours = dDate.getHours();
		var sMinutes = dDate.getMinutes();
		var sSeconds = dDate.getSeconds();

		var aLoop = [sMounth, sDay, sHours, sMinutes, sSeconds]

		aLoop.forEach(function (el, index) {

			if (el < 10) {

				aLoop[index] = "0" + aLoop[index];

			}
		})

		return dDate.getFullYear() + "-" + aLoop[0] + "-" + aLoop[1] + "T" + aLoop[2] + ":" + aLoop[3] + ":" + aLoop[4];

	},

	date2date: function (day) {
		return day.split(' ')[0];
	},
	date2jsDate: function (day) {

		if (day != undefined) {

			return new Date(day.split(' '));

		}
	},
	date2Hour: function (day) {

		var date = new Date(day)
		return date.toTimeString().split(' ')[0];

	},
	progress2status: function (sString) {
		switch (sString) {
			case "0":
				return "Not started";
			case "100":
				return "Finished";
			default:
				return "In progress";
		}
		;
	},
	progress2percent: function (sString) {
		return sString + "%";
	},
	progress2float: function (sString) {
		return parseFloat(sString);
	},
	progress2string: function (sString) {
		return sString.toString();
	},
	totalDurationToIM: function (sDuration) {
		return ((sDuration * 100 * 0.001) / 3600).toFixed(0);
	},
	isCheckboxVisible: function (sString) {
		if (airbus.mes.stationtracker.worklistPopover.unPlanned === true) {
			return true;
		} else {
			return false;
		}
		;
	},
	setmodeList: function () {
		if (airbus.mes.stationtracker.worklistPopover.unPlanned === true) {
			return "MultiSelect";
		} else {
			return "None";
		}
		;
	},
	isDayTimeline: function () {
		if (airbus.mes.stationtracker.util.ShiftManager.dayDisplay) {
			return airbus.mes.stationtracker.util.ShiftManager.dayDisplay;

		} else {

			return false;
		}

	},
	/*----------------------------------------------------------------------------
	 * Permit to display the different case of rendering of box in scheduler :
	 * See sd for different cases
	 *
	 * @param {oBox} Object wich represent the current event in scheduler
	 * @return {STRING} html the html wich will apply
	 ----------------------------------------------------------------------------*/
	BoxDisplay: function (oBox) {

		// global name
		var sOSW = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Osw");
		var sUNPD = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("Unplanned");
			
		var html = "";
		var sDivForLeftDisplay = '<div  class="trackerBox">';
		var sDivForLeftDisplayInitial = '<div class="tracker-item-initial" >';
		var sRightIcon = "";
		var sLeftIcon = "";
		var sLeftIcon2 = "";
		var sLeftIcon3 = "";
		var sColorProgress = "";
		var sText = "";
		var trackerTextClass = "";
		var boxDisplayManager = airbus.mes.stationtracker.util.BoxDisplayManager;
		var sProgress = airbus.mes.stationtracker.util.Formatter.percentValue(oBox.progress, oBox.totalDuration);
		
		
		var dispatch = false; //only for test waiting MII service
		var dispatchWhite = false;
		
		// Text to display different case regarding box selected
		switch (airbus.mes.stationtracker.util.GroupingBoxingManager.box) {

			case "OPERATION_ID":
				sText = oBox.operationDescription + " - " + oBox.shopOrder + " - " + oBox.operationId;

				break;

			case "WORKORDER_ID":
				sText = oBox.shopOrderDescription + " - " + oBox.shopOrder;
				break;
			default:
				sText = oBox.realValueBox;
				break;

		}
		if (oBox.type === "I") {
			trackerTextClass = "trackerTextInitial";
		} else {
			trackerTextClass = "trackerText";
		}

		if (oBox.status == 6 || oBox.status == 4)
			trackerTextClass = "trackerTextBlock";

		if (oBox.rmaStatus === 1) { //rma
			sLeftIcon = boxDisplayManager.leftTriangleIcon_Dandelion;
		}
		if (oBox.OSW === 3 ||oBox.OSW === 4) { //OSW
			sLeftIcon2 = boxDisplayManager.leftOswIcon_Constructor(sOSW,oBox.aAcpngStatus);
		}
		if (oBox.isUnplanned === 1) { //Unplanned
			sLeftIcon3 = boxDisplayManager.leftOswIcon_Constructor(sUNPD);
		}
		switch (oBox.status) {
			// box is active
			case 2:
				sColorProgress = boxDisplayManager.colorProgress_Constructor("dark-lime-green-back", sProgress);

				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-play");
				break;
			// box is paused
			case 3:
				sColorProgress = boxDisplayManager.colorProgress_Constructor("dark-lime-green-back", sProgress);

				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-pause");
				break;
			// box not started
			case 1:
				sRightIcon = "";
				break;
			// box Completed
			case 0:
				sColorProgress = boxDisplayManager.colorProgress_Constructor("teal-blue-back");

				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-check");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon;
				}
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_TealBlueWhite_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_TealBlueWhite_Constructor(sUNPD);
				}
				

				break;
				
			// Operation not started but disruption exists
			case 4:
				sColorProgress = boxDisplayManager.colorProgress_OpenBlocked;

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
				}
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				
				break;

			// Opened Escalated disruption = andon raised
			case 5:
				sColorProgress = boxDisplayManager.colorProgress_Escalated;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon;
				}
				
				if (dispatch) {
					
					dispatchWhite = true;
				}
				
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				
				break;

			// Opened Blocking disruption
			case 6:
				sColorProgress = boxDisplayManager.colorProgress_OpenBlocked;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop", "petrol");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon;
				}
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				
				if (dispatch) {
					
					dispatchWhite = true;
				}
				
				break;

			// Answered Blocking
			case 7:
				sColorProgress = boxDisplayManager.colorProgress_AnsweredBlocked;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop", "petrol");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
				}
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}

				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				break;

			// Answered escalated = andon answered
			case 8:
				sColorProgress = boxDisplayManager.colorProgress_AnsweredBlockedExcalated;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon;
				}
				
				if (dispatch) {
					
					dispatchWhite = true;
				}
				
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				break;
				

			// Solved Escalated disruption
			case 9:
				sColorProgress = boxDisplayManager.colorProgress_SolvedBlocked;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop", "petrol");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon_Petrol;
				}
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}

				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				break;
			
			// Solved Blocking disruption
			case 10:
				sColorProgress = boxDisplayManager.colorProgress_SolvedBlockedExcalated;
				sRightIcon = boxDisplayManager.rightIcon_Constructor("fa-stop");

				if (oBox.rmaStatus === 1) { //rma
					sLeftIcon = boxDisplayManager.leftTriangleIcon;
				}
				
				if (dispatch) {
					
					dispatchWhite = true;
				}
				
//				if (oBox.OSW === 3) { //OSW
//					sLeftIcon2 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sOSW);
//				}
				if (oBox.isUnplanned === 1) { //Unplanned
					sLeftIcon3 = boxDisplayManager.leftOswIcon_Dandelion_Constructor(sUNPD);
				}
				break;
				
			default:
		}
		
		if (dispatch) {
			if (dispatchWhite){
				sLeftIcon = boxDisplayManager.leftStopIcon_White;
			}
			else {
				sLeftIcon = boxDisplayManager.leftStopIcon;
			}
		}
		

		//
		var widthUnavailableForText = boxDisplayManager.getWidthUnavailableForText(sLeftIcon, sLeftIcon2, sLeftIcon3, sRightIcon);

		//description text + progress in IM (industrial minutes)
		var sSpanText = '<span class=" ' + trackerTextClass + ' "style="float: left; overflow: hidden;text-overflow: ellipsis;'
			+ 'white-space: nowrap; margin-left:5px; margin-right:5px;' + 'max-width:calc(100% - ' + widthUnavailableForText + 'px);padding-left: 0px;">'
			+ sText + ' - [' + airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.progress) + '/'
			+ airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.totalDuration) + ' IM]</span>';

		//construction of the html
		if (oBox.type === "I") {
			trackerTextClass = ""
			html = sDivForLeftDisplayInitial + sLeftIcon + sRightIcon + sLeftIcon2 + sLeftIcon3 + sSpanText + sColorProgress + '</div>';
		} else {
			html = sDivForLeftDisplay + sLeftIcon + sRightIcon + sLeftIcon2 + sLeftIcon3 + sSpanText + sColorProgress + '</div>';
		}
		//html += '<span class="trackerBoxtooltiptext">'+ sSpanText +'</span>' ;

		/* var tooltipTextForBox = '<span class="tooltipTextTrackerBox"style="float: left; overflow: hidden;' +
		'white-space: nowrap; margin-left:5px; margin-right:5px;' +
		'padding-left: 0px;">' +
		sText + ' - ['+
		airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.progress) +'/'+
		airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.totalDuration) +' IM]</span>';*/

		var tooltipTextForBox = '<div class="tooltipTextTrackerBox1"> ' + '<span class="tooltipTextTrackerBox2" data-text="' + sText + ' - ['
			+ airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.progress) + '/'
			+ airbus.mes.stationtracker.util.Formatter.totalDurationToIM(oBox.totalDuration) + ' IM]"></span></div>';

		html += tooltipTextForBox;
		return html;
	},

	initial: function (sText, sProgress) {
		var html = "";
		html += '<div  style=" border: solid 2px #979797; background-color:#f5f5f5; width:100%; height:inherit; position:absolute; z-index: 1; padding-left: 5px;line-height: 23px;left: 0px;" >'
			+ sText + '</div>';
		html += '<div style="width:' + sProgress + '%; height:inherit;position:absolute; z-index: 0; left: 0px;"></div>'

		return html;
	},

	progressDisplayEvent: function (sDuration) {
		return ((sDuration * 100 * 0.001) / 3600).toFixed(4);
	},

	titleWorklist: function (workOrder, workOrderDescritpion) {
		if (workOrderDescritpion != "") {

			return workOrder + " - " + workOrderDescritpion;

		} else {

			return workOrder;
		}
	},

	displayValueIM: function (operation, operationDescription, progress, duration) {
		progress = ((progress * 100 * 0.001) / 3600).toFixed(0);
		duration = ((duration * 100 * 0.001) / 3600).toFixed(0);

		if (operation === "") {
			//                    Case of Overall progress
			return "[" + progress + "/" + duration + " IM]";
		} else {
			//                    Others operation
			return operation + " - " + operationDescription + ": " + "[" + progress + "/" + duration + " IM]";
		}

	},

	percentValue: function (progress, duration) {
		progress = parseInt(progress, 10);
		duration = parseInt(duration, 10);
		if (!isNaN(parseInt(progress, 10)) || !isNaN(parseInt(duration, 10))) {
			if (duration <= 0) {
				return 0;
			} else {
				return Math.round((progress * 100) / duration);
			}
		} else {
			return 0;
		}
	},
	
	rescheduleLine: function (avlLine, skill) {
		window.event.stopPropagation();
		
		console.log("reScheduleLine");
		alert("Test");
	},

	/*----------------------------------------------------------------------------
	 * Permit to display the different case to the left y-axis of scheduler
	 * display the case of user affected
	 * no user affected
	 * folder row.
	 *
	 * @param {oSection} Object wich represent the current Row
	----------------------------------------------------------------------------*/
	YdisplayRules: function (oSection) {
		var html = "";
		var oHierarchyDelay;
		var fProgress;
		var fDuration;
		var sSpanWarn;

		if (oSection.initial != undefined) {

			html = '<span  style="float: right;margin-right: 5px;" >' + oSection.initial + '</span>';
			return html;
		}

		//** folder row **/
		if (oSection.children != undefined) {
			
			var sAddLine = "";
			// Checking Roles. If true then a new Line will be added, else not
	    	if( sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/STATION_GANTT_CREATE") ) {
	    	
	    		sAddLine = '<span id= add_' + oSection.key + ' class="fa fa-plus custom" onclick="airbus.mes.stationtracker.util.AssignmentManager.newLine(\'' + oSection.key + '\')"></span>'
	    	}
	    	
			html = '<div><span id= folder_' + oSection.key + ' class="' + airbus.mes.stationtracker.util.Formatter.openFolder(oSection.open)
				+ '"></span><div title=' + airbus.mes.stationtracker.util.Formatter.spaceInsecable(oSection.label) + ' class="ylabelfolder">' + oSection.label
				+ '</div>' + sAddLine + '</div>';
			return html;
		}

		// user affected
		var sshiftID = airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID;
		// Check if there is one operation not totally confirmed in previous shift
		var sNotConfirmedOpLS = "";
		var bNotConfirmedOpLS = airbus.mes.stationtracker.util.ShiftManager.noTotalConfLastShift(oSection);

		if (bNotConfirmedOpLS) {
			// Count number of not confirmed operation
			var countNoConf = airbus.mes.stationtracker.util.ShiftManager.countNoTotalConfLastShif(oSection);
			sNotConfirmedOpLS = '<span class="classNotConfirmedOperation" onclick="airbus.mes.stationtracker.util.ModelManager.rescheduleLine(\''+ oSection.avlLine + '\',' + countNoConf + ')"></span>';
		}

		if (airbus.mes.stationtracker.util.AssignmentManager.affectationHierarchy[oSection.avlLine]) {

			if (airbus.mes.stationtracker.util.AssignmentManager.affectationHierarchy[oSection.avlLine][sshiftID]) {

				// See SD there is only one user affected for the couple of shift id + avlLine
				var oCurrentAffectedUser = airbus.mes.stationtracker.util.AssignmentManager.affectationHierarchy[oSection.avlLine][sshiftID][0];
				oHierarchyDelay = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchyDelay;
				fProgress = oHierarchyDelay[oSection.group][oSection.avlLine].progress;
				fDuration = oHierarchyDelay[oSection.group][oSection.avlLine].duration;
				sSpanWarn = "";

				if (oCurrentAffectedUser.warn === "true") {

					sSpanWarn = '<span class="fa fa-exclamation-triangle" style="padding-right: 5px;" onclick="airbus.mes.stationtracker.oView.getController().onCheckQA()"></span>';

				}

				if (oSection.rescheduled) {
					
					html = sNotConfirmedOpLS + '<div>';

					if (airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY")) { // Check if user image to be displayed  or not

						var imgId = sap.ui.getCore().byId("stationTrackerView").createId("folder_" + oSection.key + "Image--" + oCurrentAffectedUser.picture);

						html += '<img  onerror = "airbus.mes.shell.UserImageManager.getErrorUserImage(this)" id="' + imgId + '" src='
							+ airbus.mes.shell.UserImageManager.getUserImage(imgId, oCurrentAffectedUser.picture) + ' class="ylabelUserImage"/>' // To display User Image
					}

					html += '<div><span class="avlLine" title="' + oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0] + '">'
						+ oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0] + '</span>';

					if (airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_NAME")) { // Check if user image to be displayed  or not

						html += '<br><span class="ylabelUser" title='
							+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(oCurrentAffectedUser.firstName + " " + oCurrentAffectedUser.lastName)
							+ '>' + oCurrentAffectedUser.firstName + " " + oCurrentAffectedUser.lastName + '</span>';
					}
					// value used in localhost
					if (airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_NAME") === undefined) {

						html += '<br><span class="ylabelUser" title='
							+ airbus.mes.stationtracker.util.Formatter.spaceInsecable(oCurrentAffectedUser.firstName + " " + oCurrentAffectedUser.lastName)
							+ '>' + oCurrentAffectedUser.firstName + " " + oCurrentAffectedUser.lastName + '</span>';
					}

					html += airbus.mes.stationtracker.util.Formatter.createDelaySpan(fProgress, fDuration, sSpanWarn);

					return html + '</div>';

				}

			} else {
				//** no user affected **/
				html = sNotConfirmedOpLS + '<div>';

				html += '<i class="fa  fa-pencil ylabelEditIcon"></i>';

				html += '<div class="yText">' + '<span class="avlLine" title="' + oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0]
					+ '">' + oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0] + '</span>' + '<br><span class="ylabel">'
					+ airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("SelectOperator") + '</span></br></div>';

				oHierarchyDelay = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchyDelay;
				//console.log(oHierarchyDelay);

				if (oHierarchyDelay[oSection.group] != undefined) {
					// Check if the avl exist in the model from mii it check if the avl is not a avlLine just creatd by a user
					if (oHierarchyDelay[oSection.group][oSection.avlLine] != undefined) {

						fProgress = oHierarchyDelay[oSection.group][oSection.avlLine].progress;
						fDuration = oHierarchyDelay[oSection.group][oSection.avlLine].duration;

					} else {

						fProgress = 0;
						fDuration = 0;

					}

				}

				sSpanWarn = "";

				html += airbus.mes.stationtracker.util.Formatter.createDelaySpan(fProgress, fDuration, sSpanWarn);

				return html + '</div>';

			}

		} else {
			//** no user affected **/

			html = sNotConfirmedOpLS + '<div>';

			html += '<i class="fa  fa-pencil ylabelEditIcon"></i>';

			html += '<div class="yText">' + '<span class="avlLine" title="' + oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0] + '">'
				+ oSection.avlLine.split("_")[1] + " - " + oSection.avlLine.split("_")[0] + '</span>' + '<br><span class="ylabel">'
				+ airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("SelectOperator") + '</span></br></div>';

			oHierarchyDelay = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchyDelay;

			if (oHierarchyDelay[oSection.group] != undefined) {
				// Check if the avl exist in the model from mii it check if the avl is not a avlLine just creatd by a user
				if (oHierarchyDelay[oSection.group][oSection.avlLine] != undefined) {

					fProgress = oHierarchyDelay[oSection.group][oSection.avlLine].progress;
					fDuration = oHierarchyDelay[oSection.group][oSection.avlLine].duration;

				} else {

					fProgress = 0;
					fDuration = 0;

				}

			}

			sSpanWarn = "";

			html += airbus.mes.stationtracker.util.Formatter.createDelaySpan(fProgress, fDuration, sSpanWarn);
			return html + '</div>';

		}

		//                default mode
		html = "";
		return html;
	},

	/*
	 * Sort worklist according to business rule.
	 *
	 * Rule in detail: the operations shall be grouped by WO. These WO groups
	 * shall be sorted using the start date/time of their box in the Gantt, then
	 * using the schedule start date/time and then numerical order, ascending
	 * order. Within one group of operations belonging to the same WO,
	 * operations shall be sorted by ascending operation number.
	 *
	 * UPDATE : order operations in oWorkList by start-time
	 * @param oWorkList
	 */
	sortWorkList: function (oWorkList) {
		/*  var oWL2 = [];
		  var oWOList = [];
		  var i;*/

		// Sort by WO number (to group operations with same WO)
		// Also group by operation, because the sort order is kept for
		// operations
		oWorkList.sort(this.fieldComparator(['START_TIME']));

		//                   // Constitute a table of WO groups with operations associated
		//                   // The group object has template bellow.
		//                   var currentWO = {
		//
		//                          shopOrder : undefined,
		//                          dynamicStartDate : undefined,
		//                          scheduledStartDate : undefined,
		//                          operationsID : [],
		//                   };
		//
		//                   for (i = 0; i < oWorkList.length; i++) {
		//                          if (currentWO.shopOrder !== oWorkList[i].shopOrder) {
		//
		//                                 if (currentWO.operationsID.length > 0) {
		//                                        oWOList.push(currentWO);
		//                                 }
		//
		//                                 currentWO = {
		//                                         shopkOrder : oWorkList[i].shopOrder,
		//                                        startDate : oWorkList[i].startDate,
		////                                        scheduledStartDate : oWorkList[i].start,
		//                                        operationsID : [ oWorkList[i] ],
		//                                 };
		//
		//                          } else {
		//
		//                                 if (oWorkList[i].startDate < currentWO.startDate) {
		//                                        currentWO.startDate = oWorkList[i].startDate;
		//                                 }
		//
		////                                 if (oWorkList[i].start < currentWO.scheduledStartDate) {
		////                                        currentWO.scheduledStartDate = oWorkList[i].start;
		////                                 }
		//
		//                                 currentWO.operationsID.push(oWorkList[i]);
		//
		//                          }
		//                   }
		//
		//                   oWOList.push(currentWO);
		//
		//                   // Sort each groups (Work Orders)
		//                   // The operations inside each groups should still be in the same order
		//                   // (ascending order preserved)
		//                   oWOList.sort(this.fieldComparator([ 'startDate', 'workOrder' ]));
		//
		//                   // Flatten worklist (take operations of each groups)
		//                   oWL2 = oWOList.reduce(function(prev, curr) {
		//                          return prev.concat(curr.operationsID);
		//                   }, []);

		// Keep the index, for stable sorting on WorkList screen (as sorter is
		// also used for grouping)
		/*oWorkList.forEach(function(el, i) {
		       el.index = i;
		});*/

		return oWorkList;
	},

	//////////////////////////////////////

	/*
	 * Sort worklist according to business rule.
	 * Rules in details :
	         The groups should be sorted by rescheduled start date/time of the earliest operation within the group.
	        The operations within one group should also be sorted by rescheduled starting date/time.
	 * @param pathSorter : attribute to sort the worklist (workorder_id for example)
	 * @param aModel (optional) : data source of worklist.
	 */
	sortWorklistAndBind: function (pathSorter, aModel) {

		// sort worklist according start_time
		airbus.mes.stationtracker.worklistPopover.aModel = airbus.mes.stationtracker.util.Formatter.sortWorkList(aModel);

		// get workorder_id without duplicate, to make easier the comparator during ordering
		airbus.mes.stationtracker.worklistPopover.groupedWorkList = aModel.reduce(function (acc, obj) {
			var d1 = obj.START_TIME;
			var d2 = acc[obj[pathSorter].toUpperCase()];
			if (d2 === undefined) {
				acc[obj[pathSorter].toUpperCase()] = d1;
			} else if (d1 < d2) {
				acc[obj[pathSorter].toUpperCase()] = d1;
			}
			return acc; //array(key : value of pathSorter ; value : the earlier start-time
		}, {});

		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
			path: "WorkListModel>/",
			template: sap.ui.getCore().byId("worklistPopover--sorterList"),
			sorter: [

				new sap.ui.model.Sorter({
					path: pathSorter,
					group: function (oContext) {
						var v = oContext.getProperty(pathSorter);

						return {
							key: v,
							text: v
						};
					},
					descending: false,
					comparator: function (a, b) {
						var earlierDateA = airbus.mes.stationtracker.worklistPopover.groupedWorkList[a];
						var earlierDateB = airbus.mes.stationtracker.worklistPopover.groupedWorkList[b];

						if (earlierDateA < earlierDateB) {
							return -1;
						}

						if (earlierDateA > earlierDateB) {
							return 1;
						}

						if (earlierDateA === earlierDateB) { //as worklist is already sorted, when 2 operations belong the same group, order is ok
							return 0;
						}

					}
				})

			]

		});

	},

	/**
	 * Returns a comparator function on the provided fields, in the provided
	 * order of priority, to be used for example by an Array.sort() function.
	 *
	 * @param {Array}
	 *            fields, Array of object
	 * @returns {Function} comparator
	 */
	fieldComparator: function (fields) {
		return function (a, b) {
			return fields.map(function (o) {
				var dir = 1;
				if (o[0] === '-') {
					dir = -1;
					o = o.substring(1);
				}
				if (a[o] > b[o])
					return dir;
				if (a[o] < b[o])
					return -(dir);
				return 0;
			}).reduce(function firstNonZeroValue(p, n) {
				return p ? p : n;
			}, 0);
		};
	},

	/*
	 * This work is licensed under Creative Commons GNU LGPL License.
	 *
	 * License: http://creativecommons.org/licenses/LGPL/2.1/ Version: 0.9
	 * Author: Stefan Goessner/2006 Web:
	 * http://goessner.net/download/prj/jsonxml/json2xml.js
	 */
	json2xml: function (o, tab) {
		var toXml = function (v, name, ind) {
			var xml = "";
			if (v instanceof Array) {
				for (var i = 0, n = v.length; i < n; i++)
					xml += ind + toXml(v[i], name, ind + "\t") + "\n";
			} else if (typeof (v) == "object") {
				var hasChild = false;
				xml += ind + "<" + name;
				for (var m in v) {
					if (m.charAt(0) == "@")
						xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
					else
						hasChild = true;
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					for (var m in v) {
						if (m == "#text")
							xml += v[m];
						else if (m == "#cdata")
							xml += "<![CDATA[" + v[m] + "]]>";
						else if (m.charAt(0) != "@")
							xml += toXml(v[m], m, ind + "\t");
					}
					xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
				}
			} else {
				xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
			}
			return xml;
		}, xml = "";
		for (var m in o)
			xml += toXml(o[m], m, "");
		return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	},

	datepicker: function (sString) {
		return "toto";
	},
	productionGroup: function (sProductionG) {

		return sProductionG;

	},

	msToTime: function (s) {
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;

		if (hrs == 0)
			hrs = "00";
		if (mins == 0)
			mins = "00";
		if (secs == 0)
			secs = "00";
		return hrs + ':' + mins + ':' + secs;
	},

	computeDelay: function (fProgress, fDuration) {

		var sBlank = "";
		if (fProgress === undefined || fDuration === undefined) {
			return sBlank;
		}

		//sec Gap
		var sGap = Math.round((fProgress - fDuration)) / 1000 / 60 / 60;
		var sGapHour = parseInt(sGap, 10);
		//Transfomr in hour
		var sGapMin = Math.abs(Math.round((sGap - sGapHour) * 60));

		//                  Conversion from minutes to industrial minutes
		sGapMin = Math.round((sGapMin / 3) * 5);

		if (sGapMin < 10) {
			sGapMin = "0" + sGapMin;
		}

		if (sGapHour === 0 && sGap < 0) {

			sGapHour = "-" + sGapHour;
		}

		return sGapHour + "," + sGapMin + "h";

	},
	//                Calculate Total Takt
	totalTakt: function (inTakt, outTakt, notAck) {
		var total;
		total = inTakt + outTakt + notAck;
		return total;

	},
	createDelaySpan: function (fProgress, fDuration, sSpanWarn) {
		var html = "";
		if (sSpanWarn === undefined) {
			sSpanWarn = "";
		}
		return html += '<span  class="yMoreLabel" >' + sSpanWarn + '<span title=' + airbus.mes.stationtracker.util.Formatter.computeDelay(fProgress, fDuration)
			+ '>' + airbus.mes.stationtracker.util.Formatter.computeDelay(fProgress, fDuration) + '</span>' + '</span>';
	},
	sumKPI: function (value1, value2, value3) {
		return parseFloat(value1) + parseFloat(value2) + parseFloat(value3);
	}
};
