"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.util.GraphManager");
airbus.mes.stationtracker.util.GraphManager = {

	loadGraph: function () {

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

		for (var i = 0; i < data.length; i++) {
			data[i].x = parseFloat(data[i].x);
			data[i].y = parseFloat(data[i].y);
		}

		var realData = oCtrl.getRealData().map(bindingToArray);
		var bDisplayCircles = true;
		var maxData = data;

		if (data.length < realData.length) {
			for (var i = 0; i < (realData.length - data.length); i++) {
				// Deep clone last object of data and increment its x value
				// by 1
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
		/*******************************************************************
		 * Chart creation
		 ******************************************************************/
		var contHeight = 119;
		var contWidth = chart.width();
		var margin = { top: 10, right: 5, bottom: 5, left: 20 },
			width = contWidth - margin.left - margin.right,
			height = contHeight - margin.top - margin.bottom;

		// axes
		var x = d3.scale.linear()
			.domain([0, d3.max(maxData, function (d) { return d.x; })])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, d3.max(maxData, function (d) { return d.y; })])
			.range([height, 0]);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		// area
		var area = d3.svg.area()
			.x(function (d) { return x(d.x); })
			.y0(height)
			.y1(function (d) { return y(d.y); });
		// line
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
		// background
		var rectangle = groupe.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height)
			.style('fill', '#84BD00');

		// add area to svg
		groupe.append("path")
			.attr("width", width)
			.attr("height", height)
			.datum(data)
			.attr("class", "area")
			.attr("d", area);
		// add y axis
		svg.append("g")
			.attr("class", "yaxis y axis")
			.call(yAxis);
		// add y grid
		svg.append("g")
			.attr("class", "ygrid")
			.call(makeYaxis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			);
		// y axe label
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("class", "yaxelabel")
			.attr("transform", "translate(-4,-4)")
			.text("Hrs");
		// add line to svg
		svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
		// add real line to svg
		svg.append("path")
			.datum(realData)
			.attr("class", "realLine")
			.attr("d", line);

		if (bDisplayCircles) {
			// Draw vertical line
			svg.append("line")
				.attr("id", "verticalLine")
				.attr("x1", function () { return x(realData[realData.length - 1].x); })
				.attr("y1", function () { return y(0); })
				.attr("x2", function () { return x(realData[realData.length - 1].x); })
				.attr("y2", function () { return y(d3.max(data, function (d) { return d.y; })); })
				.style("stroke-width", 1)
				.style("stroke", "white");
			// Draw the blue Circle
			var circle = svg.append("circle") // FIXME : ESLint (Not used)
				// but needed
				.attr("id", "blueCircle")
				.attr("cx", function () { return x(data[realData.length - 1].x); })
				.attr("cy", function () { return y(data[realData.length - 1].y); })
				.attr("r", 3)
				.attr("fill", "#0D2C63");
			// Draw the white Circle
			var circle = svg.append("circle")
				.attr("id", "whiteCircle")
				.attr("cx", function () { return x(realData[realData.length - 1].x); })
				.attr("cy", function () { return y(realData[realData.length - 1].y); })
				.attr("r", 3)
				.attr("fill", "white");
		}

		$(window).on("resize", function () {
			chart = $("#stationTrackerView--chartId");
			contWidth = chart.width();
			if (contWidth > 0) {
				// var resize
				width = contWidth - margin.left - margin.right;
				x.range([0, width]);
				area.x(function (d) { return x(d.x); });
				line.x(function (d) { return x(d.x); });

				//container changes
				var svg = d3.select("svg.takt_adherence_area_chart")
					.attr("width", contWidth)
					.attr("viewBox", "0 0 " + contWidth + " " + contHeight);

				var gContainer = svg.select("g")
					.attr("width", width);

				groupe = gContainer.select("g")
					.attr("width", width);

				//chart changes
				groupe.select("rect")
					.attr("width", width);

				groupe.select("path")
					.attr("d", area);

				svg.select(".ygrid")
					.call(makeYaxis()
						.tickSize(-width, 0, 0)
						.tickFormat("")
					);

				gContainer.select(".line")
					.attr("d", line);

				gContainer.select(".realLine")
					.attr("d", line);

				if (bDisplayCircles) {
					gContainer.select("#verticalLine")
						.attr("x1", function () { return x(realData[realData.length - 1].x); })
						.attr("x2", function () { return x(realData[realData.length - 1].x); });

					gContainer.select("#blueCircle")
						.attr("cx", function () { return x(data[realData.length - 1].x); });

					gContainer.select("#whiteCircle")
						.attr("cx", function () { return x(realData[realData.length - 1].x); });
				}
			}
		});
	}



}