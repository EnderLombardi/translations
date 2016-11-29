"use strict";

//jQuery.sap.require("airbus.mes.stationtracker.Coordinates")
sap.ui.core.Control.extend("airbus.mes.stationtracker.TaktAdherenceAreaChart", {
	metadata : {
		aggregations : {
			"data" : {
				type : "airbus.mes.stationtracker.Coordinates",
//				multiple : false,
				singularName : "data",
//				bindable: "bindable"
			},
			"realData" : {
				type : "airbus.mes.stationtracker.Coordinates",
//				multiple : false,
				singularName : "realData",
//				bindable: "bindable"
			}
		}
     },
     
	renderer: function (oRm, oControl) {

		oRm.write("<svg ");
		oRm.writeControlData(oControl);
		oRm.write(" class='takt_adherence_area_chart' viewBox='0 0 " + $('#stationTrackerView--chartId').width() + " 119' perserveAspectRatio='xMinYMid'");
		oRm.write(" />");
	},

	onAfterRendering: function onAfterRendering(oEvt){

		function makeYaxis() {
			return d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(8);
		}
		
		function bindingToArray(c) {
			return {x : c.getX(), y : c.getY()}
		}
		
		var oCtrl = airbus.mes.stationtracker.oView.byId("stationTrackerView--takt_adherence_area_chart");
//		var oCtrl = oEvt.srcControl; 
		var data = oCtrl.getData().map(bindingToArray);
		var realData = oCtrl.getRealData().map(bindingToArray);
		var bDisplayCircles = true;
		var maxData = data;
		
		if(data.length < realData.length){
			for(var i=0; i<(realData.length - data.length); i++){
				//Deep clone last object of data and increment its x value by 1
				data.push(JSON.parse(JSON.stringify(data[data.length-1])));
				data[data.length-1].x = (parseInt(data[data.length-1].x, 10)+1).toString();
				bDisplayCircles = false;
				maxData = realData;
			}
		}else if(data.length == 0){
			data=[{x:"0", y:"0"}, {x:"0", y:"0"}];
			realData=[{x:"0", y:"0"}, {x:"0", y:"0"}];
			bDisplayCircles = false;
		}else if(realData.length == 0 || data.length == realData.length){
			bDisplayCircles = false;
		}
		
		
		
//		var data = [
//			{ x: 0, y: 5, },
//			{ x: 1, y: 15, },
//			{ x: 2, y: 20, },
//			{ x: 3, y: 35, },
//			{ x: 4, y: 40, },
//		];
//
//		var realData = [
//			{ x: 0, y: 0, },
//			{ x: 1, y: 20, },
//			{ x: 2, y: 20, },
//			{ x: 3, y: 25, },
//		];
//		var estimateData = [
//			{ x: 2, y: 20, },
//			{ x: 3, y: 25, },
//		];


		var chart = $("#stationTrackerView--chartId");

		//in progress
		$(window).on("resize", function() {
			if (chart.width() > 0){
				 var contWidth = chart.width();
				 chart.attr("width", contWidth);
				 chart.attr("height", contHeight);
				 onAfterRendering();
			}
		});



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
//		//add esttimate line to svg
//		svg.append("path")
//			.datum(estimateData)
//			.attr("class", "estimateLine")
//			.attr("d", line);
//		//Draw vertical line
//		svg.append("line")
//			.attr("x1", function () { return x(data[data.length - 2].x); })
//			.attr("y1", function () { return y(0); })
//			.attr("x2", function () { return x(data[data.length - 2].x); })
//			.attr("y2", function () { return y(d3.max(data, function (d) { return d.y; })); })
//			.style("stroke-width", 1)
//			.style("stroke", "white");
//		//Draw the blue Circle
//		var circle = svg.append("circle") //FIXME : ESLint (Not used) but needed
//			.attr("cx", function () { return x(data[data.length - 2].x); })
//			.attr("cy", function () { return y(data[data.length - 2].y); })
//			.attr("r", 3)
//			.attr("fill", "#0D2C63");
		
		if(bDisplayCircles){
			//Draw vertical line
			svg.append("line")
			.attr("x1", function () { return x(realData[realData.length - 1].x); })
			.attr("y1", function () { return y(0); })
			.attr("x2", function () { return x(realData[realData.length - 1].x); })
			.attr("y2", function () { return y(d3.max(data, function (d) { return d.y; })); })
			.style("stroke-width", 1)
			.style("stroke", "white");
			//Draw the blue Circle
			var circle = svg.append("circle") //FIXME : ESLint (Not used) but needed
			.attr("cx", function () { return x(data[realData.length - 1].x); })
			.attr("cy", function () { return y(data[realData.length - 1].y); })
			.attr("r", 3)
			.attr("fill", "#0D2C63");
			//Draw the white Circle
			var circle = svg.append("circle")
			.attr("cx", function () { return x(realData[realData.length - 1].x); })
			.attr("cy", function () { return y(realData[realData.length - 1].y); })
			.attr("r", 3)
			.attr("fill", "white");
		}
	}
});
