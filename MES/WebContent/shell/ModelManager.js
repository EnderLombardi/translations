"use strict";
jQuery.sap.declare("airbus.mes.shell.ModelManager")
airbus.mes.shell.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {

			airbus.mes.shell.ModelManager.createJsonModel(core,["userDetailModel","userSettingModel"]);

			var dest;

			switch (window.location.hostname) {
			case "localhost":
				dest = "local";
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
				bundleName : "airbus.mes.shell.config.url_config",
				bundleLocale : dest
			});
			
			if (  dest === "sopra" ) {

				var oModel = airbus.mes.shell.ModelManager.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
					
				for (var prop in oModel) {
					if (oModel[prop].slice(-5) != ".json" ) {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
					}
				}
			}
							
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadUserDetail();		
			//this.loadUserSettings();
			
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleName : "airbus.mes.shell.i18n.i18n",
	         });
			
			core.setModel(i18nModel, "ShellI18n");
			
			var MIIi18nModel = new sap.ui.model.resource.ResourceModel({
				bundleName : "airbus.mes.shell.i18n.mii_i18n",
	         });
			core.setModel(MIIi18nModel, "miiI18n");
		},
				
		loadUserDetail : function() {
			
			var oViewModel = sap.ui.getCore().getModel("userDetailModel");
			oViewModel.loadData(this.urlModel.getProperty("urluserdetail"), null, false);
		
		},


		getRoles : function() {
			var rep = jQuery.ajax({
				async : false,
				url : this.urlModel.getProperty('urlgetroles'),
				type : 'GET',
			});

			return JSON.parse(rep.responseText);
		},

		json2xml : function(o, tab) {
			var toXml = function(v, name, ind) {
				var m;
				var xml = "";
				if (v == undefined) {
					v = "";
				}
				if (v instanceof Array) {
					for (var i = 0, n = v.length; i < n; i++)
						xml += ind + toXml(v[i], name, ind + "\t") + "\n";
				} else if (typeof (v) == "object") {
					var hasChild = false;
					xml += ind + "<" + name;
					for (m in v) {
						if (m.charAt(0) == "@")
							xml += " " + m.substr(1) + "=\"" + v[m].toString()
									+ "\"";
						else
							hasChild = true;
					}
					xml += hasChild ? ">" : "/>";
					if (hasChild) {
						for (m in v) {
							if (m == "#text")
								xml += v[m];
							else if (m == "#cdata")
								xml += "<![CDATA[" + v[m] + "]]>";
							else if (m.charAt(0) != "@")
								xml += toXml(v[m], m, ind + "\t");
						}
						xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "")
								+ "</" + name + ">";
					}
				} else {
					xml += ind + "<" + name + ">" + v.toString() + "</" + name
							+ ">";
				}
				return xml;
			}, xml = "";
			for ( var m in o)
				xml += toXml(o[m], m, "");
			xml =  xml.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
			return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
		},

		/* *********************************************************************** *
		 *  Replace URL Parameters                                                 *
		 * *********************************************************************** */
		replaceURI : function(sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		},
		
		/* ******************************* *
		 *  Show message Toast             *
		 * ******************************* */
		messageShow : function(text) {
			sap.m.MessageToast
				.show(text,  {
                         duration : 3000,
                         width : "25em",
                         my : "center center",
                         at : "center center",
                         of : window,
                         offset : "0 0",
                         collision : "fit fit",
                         onClose : null,
                         autoClose : true,
                         animationTimingFunction : "ease",
                         animationDuration : 1000,
                         closeOnBrowserNavigation : true
				});
	               
	  },
	  
	  /* **************************** *
	   * Get URL for My Profile       *
	   * **************************** */
	  getMyProfileUrl: function(bID,user,pass,pinCode,uID) {
		  var myProfileUrl = this.urlModel.getProperty("urlMyProfileSave");
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$badgeID", bID);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$userID", user);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$password", pass);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$pinCode", pinCode);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$UID", uID);
		  return myProfileUrl;		  
	  },
	  
		/* *********************** *
		 *  BadeReader functions   *
		 * *********************** */
	  connectBadgeReader: function(brOnMessageCallBack, response, error){
			
			if(!this.badgeReader || airbus.mes.shell.ModelManager.badgeReader.readyState==3){
			
			var wsUrl; 
				
			if(location.protocal = "https:"){
				//wsUrl = "wss://" + this.urlModel.getProperty("badgeReader");
				wsUrl = "ws://" + this.urlModel.getProperty("badgeReader");
			} else {
				wsUrl = "ws://" + this.urlModel.getProperty("badgeReader");
			}
			if(window.location.hostname =="localhost"  || window.location.hostname =="wsapbpc01.ptx.fr.sopra")
				wsUrl = "ws://localhost:754/TouchNTag";
			this.badgeReader = new WebSocket(wsUrl);
			
			this.badgeReader.onopen = this.brOnOpen;
			this.badgeReader.onerror = this.brOnError;
			this.badgeReader.onclose = this.brOnClose;
			this.badgeReader.onmessage = this.brOnMessage;
			}
			if(brOnMessageCallBack)
				this.brOnMessageCallBack = brOnMessageCallBack;
			if(response)
				this.brResponseMessage = response;
			if(error)
				this.brResponseError = error;
		},

		brOnOpen: function(){	
			console.log("Connection is opened..."); 
			if(airbus.mes.shell.ModelManager.brOnMessageCallBack)
				airbus.mes.shell.ModelManager.brOnMessageCallBack();	
		},
		
		brOpen : function(){
			 var msgData = {"BadgeOrRFID":"BADGE","CommandName":"CONNECT","Language":null,"ReaderName":null};
			  if(this.badgeReader)
				  this.badgeReader.send(JSON.stringify(msgData));
		},

		brOnMessage : function (evt){ 
		 var scanData = JSON.parse(evt.data);	
		console.log(scanData);

		if(airbus.mes.shell.ModelManager.brResponseMessage && scanData.Message)
			airbus.mes.shell.ModelManager.brResponseMessage(scanData);	

		},
		
		brStartReading: function() {
			var msgData = {"BadgeOrRFID":"BADGE","CommandName":"START_READING","Language":null,"ReaderName":null};
			if(this.badgeReader) {
				this.badgeReader.send(JSON.stringify(msgData));
			}
		},
		
		brStopReading: function() {
			var msgData = {"BadgeOrRFID":"BADGE","CommandName":"STOP_READING","Language":null,"ReaderName":null};
			if(this.badgeReader) {
				this.badgeReader.send(JSON.stringify(msgData));
			}
		},
		
		brClose: function() {
			var msgData = {"BadgeOrRFID":"BADGE","CommandName":"DISCONNECT","Language":null,"ReaderName":null};
			if (this.badgeReader) {
				this.badgeReader.send(JSON.stringify(msgData));
			}
		},
		
		brOnError : function(evnt){
			airbus.mes.shell.ModelManager.badgeReader =undefined;
			if(airbus.mes.shell.ModelManager.brResponseError)
				airbus.mes.shell.ModelManager.brResponseError();	
		   //alert("Error has occured In Badge Reader Connection");
		},

		brOnClose : function(){ 
		 // websocket is closed.
		  console.log("Connection is closed..."); 
		},
		/**
	     * Permit to create new sap ui5 json model
	     *
	     * @param{OBEJCT} oController, Object used in parameter in all ModelManager
	     * @param{ARRAY} aName, Array of all id of your model
	     */
		createJsonModel : function(oController,aName) {
			
			aName.forEach(function(el){
			
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit(10000);
				oController.setModel(oModel,el);	
							
			})
				
		},
		
		loadGragph : function() {
			
			function makeYaxis() {
				return d3.svg.axis()
					.scale(y)
					.orient("left")
					.ticks(8);
			}

			function bindingToArray(c) {
				return { x: c.getX(), y: c.getY() }
			}

			var oCtrl = airbus.mes.stationtracker.oView.byId("stationTrackerView--takt_adherence_area_chart");
			var data = oCtrl.getData().map(bindingToArray);
			var realData = oCtrl.getRealData().map(bindingToArray);
			var bDisplayCircles = true;
			var maxData = data;

			if (data.length < realData.length) {
				for (var i = 0; i < (realData.length - data.length); i++) {
					//Deep clone last object of data and increment its x value by 1
					data.push(JSON.parse(JSON.stringify(data[data.length - 1])));
					data[data.length - 1].x = (parseInt(data[data.length - 1].x, 10) + 1).toString();
					bDisplayCircles = false;
					maxData = realData;
				}
			} else if (data.length == 0) {
				data = [{ x: "0", y: "0" }, { x: "0", y: "0" }];
				realData = [{ x: "0", y: "0" }, { x: "0", y: "0" }];
				bDisplayCircles = false;
			} else if (realData.length == 0 || data.length == realData.length) {
				bDisplayCircles = false;
			}

			var chart = $("#stationTrackerView--chartId");

//			$(window).on("resize", function () {
//				chart = $("#stationTrackerView--chartId");
//				contWidth = chart.width();
//				if (contWidth > 0) {
//					// var resize
//					width = contWidth - margin.left - margin.right;
//					x.range([0, width]);
//					area.x(function (d) { return x(d.x); });
//					line.x(function (d) { return x(d.x); });
	//
//					//container changes
//					var svg = d3.select("svg.takt_adherence_area_chart")
//						.attr("width", contWidth)
//						.attr("viewBox", "0 0 " + contWidth + " " + contHeight);
	//
//					var gContainer = svg.select("g")
//						.attr("width", width);
	//
//					groupe = gContainer.select("g")
//						.attr("width", width);
	//
//					//chart changes
//					groupe.select("rect")
//						.attr("width", width);
	//
//					groupe.select("path")
//						.attr("d", area);
	//
//					svg.select(".ygrid")
//						.call(makeYaxis()
//							.tickSize(-width, 0, 0)
//							.tickFormat("")
//						);
	//
//					gContainer.select(".line")
//						.attr("d", line);
	//
//					gContainer.select(".realLine")
//						.attr("d", line);
	//
//					if (bDisplayCircles) {
//						gContainer.select("#verticalLine")
//							.attr("x1", function () { return x(realData[realData.length - 1].x); })
//							.attr("x2", function () { return x(realData[realData.length - 1].x); });
	//
//						gContainer.select("#blueCircle")
//							.attr("cx", function () { return x(data[realData.length - 1].x); });
	//
//						gContainer.select("#whiteCircle")
//							.attr("cx", function () { return x(realData[realData.length - 1].x); });
//					}
//				}
//			});

			/********************
			Chart creation
			*********************/
			var contHeight = 119;
			var contWidth = chart.width();
			var margin = { top: 10, right: 5, bottom: 5, left: 20 },
				width = contWidth - margin.left - margin.right,
				height = contHeight - margin.top - margin.bottom;

			//axes
			var x = d3.scale.linear()
							.domain([0, d3.max(maxData, function (d) { return d.x; })])
							.range([0, width]);

			var y = d3.scale.linear()
							.domain([0, d3.max(maxData, function (d) { return d.y; })])
							.range([height, 0]);

			var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

			//area
			var area = d3.svg.area()
							.x(function (d) { return x(d.x); })
							.y0(height)
							.y1(function (d) { return y(d.y); });
			//line
			var line = d3.svg.line()
							.x(function (d) { return x(d.x); })
							.y(function (d) { return y(d.y); });

			var svg = d3.select("svg.takt_adherence_area_chart")
						.attr("width", contWidth)
						.attr("height", contHeight)
						.attr("viewBox", "0 0 " + contWidth + " " + contHeight)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
						.attr("width", width)
						.attr("height", height);

			var groupe = svg.append("g")
							.attr("width", width)
							.attr("height", height);
			//background
			var rectangle = groupe.append("rect") //FIXME : ESLint (Not used) but needed
									.attr("x", 0)
									.attr("y", 0)
									.attr("width", width)
									.attr("height", height)
									.style('fill', '#84BD00');
			//add area to svg
			groupe.append("path")
					.datum(data)
					.attr("class", "area")
					.attr("d", area);
			//add y axis
			svg.append("g")
				.attr("class", "yaxis y axis")
				.call(yAxis);
			//add y grid
			svg.append("g")
				.attr("class", "ygrid")
				.call(makeYaxis()
						.tickSize(-width, 0, 0)
						.tickFormat("")
				);
			//y axe label
			svg.append("text")
				.attr("text-anchor", "end")
				.attr("class", "yaxelabel")
				.attr("transform", "translate(-4,-4)")
				.text("Hrs");
			//add line to svg
			svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", line);
			//add real line to svg
			svg.append("path")
				.datum(realData)
				.attr("class", "realLine")
				.attr("d", line);

			if (bDisplayCircles) {
				//Draw vertical line
				svg.append("line")
					.attr("id", "verticalLine")
					.attr("x1", function () { return x(realData[realData.length - 1].x); })
					.attr("y1", function () { return y(0); })
					.attr("x2", function () { return x(realData[realData.length - 1].x); })
					.attr("y2", function () { return y(d3.max(data, function (d) { return d.y; })); })
					.style("stroke-width", 1)
					.style("stroke", "white");
				//Draw the blue Circle
				var circle = svg.append("circle") //FIXME : ESLint (Not used) but needed
					.attr("id", "blueCircle")
					.attr("cx", function () { return x(data[realData.length - 1].x); })
					.attr("cy", function () { return y(data[realData.length - 1].y); })
					.attr("r", 3)
					.attr("fill", "#0D2C63");
				//Draw the white Circle
				var circle = svg.append("circle")
					.attr("id", "whiteCircle")
					.attr("cx", function () { return x(realData[realData.length - 1].x); })
					.attr("cy", function () { return y(realData[realData.length - 1].y); })
					.attr("r", 3)
					.attr("fill", "white");
			}
		}
}
