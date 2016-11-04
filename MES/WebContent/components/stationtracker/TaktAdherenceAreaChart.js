sap.ui.core.Control.extend("airbus.mes.stationtracker.TaktAdherenceAreaChart", {

	renderer: function (oRm, oControl) {

		oRm.write("<svg ");
		oRm.writeControlData(oControl);
		oRm.write(" class='takt_adherence_area_chart' viewBox='0 0 180 60' perserveAspectRatio='xMinYMid'");
		oRm.write(" />");
	},

	onAfterRendering: function onAfterRendering(){

		function make_y_axis() {
			return d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(8);
		}

		var data = [
			{ x: 0, y: 10, },
			{ x: 1, y: 15, },
			{ x: 2, y: 25, },
			{ x: 3, y: 35, },
		];

		var realData = [
			{ x: 0, y: 0, },
			{ x: 1, y: 20, },
			{ x: 2, y: 20, },
		];

		var estimateData = [
			{ x: 2, y: 20, },
			{ x: 3, y: 25, },
		];

		var parent = $("#stationTrackerView--chartId");
		var chart = $("#stationTrackerView--takt_adherence_area_chart"),
			aspect = 0.3,
			container = chart.parent();
		
		var contWidth = container.width();
		if (contWidth === 0){
			contWidth = 200;
		}
		var margin = { top: 10, right: 0, bottom: 10, left: 30 },
			width = contWidth - margin.left - margin.right - 15,
			height = Math.min(80, Math.round(contWidth / aspect)) - margin.top - margin.bottom;

		$(window).on("resize", function() {
			if (container.width() > 0){
				var targetWidth = container.width() - 15;
				chart.attr("width", targetWidth);
				chart.attr("height", Math.min(80, Math.round(targetWidth / aspect)));
			}
		}).trigger("resize");


		//axes
		var x = d3.scale.linear()
			.domain([0, d3.max(data, function (d) { return d.x; })])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function (d) { return d.y; })])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

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
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var groupe = svg.append("g");
		//background
		var rectangle = groupe.append("rect")
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
			.call(make_y_axis()
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
		//add esttimate line to svg
		svg.append("path")
			.datum(estimateData)
			.attr("class", "estimateLine")
			.attr("d", line);
		//Draw vertical line
		svg.append("line")
			.attr("x1", function () { return x(data[data.length - 2].x); })
			.attr("y1", function () { return y(0); })
			.attr("x2", function () { return x(data[data.length - 2].x); })
			.attr("y2", function () { return y(d3.max(data, function (d) { return d.y; })); })
			.style("stroke-width", 1)
			.style("stroke", "white");
		//Draw the blue Circle
		var circle = svg.append("circle")
			.attr("cx", function () { return x(data[data.length - 2].x); })
			.attr("cy", function () { return y(data[data.length - 2].y); })
			.attr("r", 3)
			.attr("fill", "#0D2C63");
		//Draw the white Circle
		var circle = svg.append("circle")
			.attr("cx", function () { return x(realData[realData.length - 1].x); })
			.attr("cy", function () { return y(realData[realData.length - 1].y); })
			.attr("r", 3)
			.attr("fill", "white");
	}
});
