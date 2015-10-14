/**
 * Controller for flot diagrams.
 * 
 * @author http://software-novotny.de
 * @since 10.10.2015
 */

'use strict';

/**
 * Constructor.
 * 
 * @param diagramPlaceHolderId
 *            {String} the HTML id of the diagram's placeholder incl. #
 * @constructor
 */
bioloop.DiagramController = function(diagramPlaceHolderId) {
	
	this.gsrProperties = {
			minY : 999999,
			maxY : 0,
			yFormatter : function(val, axis) {
				// formatter for the y-axis description
				return val.toFixed(axis.tickDecimals) + ' GSR';
			},
			diagramData : []
	};
	
	this.hrvProperties = {
			minY : 999999,
			maxY : 0,
			yFormatter : function(val, axis) {
				// formatter for the y-axis description
				return val.toFixed(axis.tickDecimals) + ' ms';
			},
			diagramData : []
	};
	
	this.heartRateProperties = {
			minY : 999999,
			maxY : 0,
			yFormatter : function(val, axis) {
				// formatter for the y-axis description
				return val.toFixed(axis.tickDecimals) + ' Hz';
			},
			diagramData : []
	};
	
	this.diagramPlaceHolderId = diagramPlaceHolderId;
	this.plot = null;
	
	this.markers = [];
	this.addMarker = false;
	
	var that = this;
	
	$('#button_add_marker').click(function() {
		that.addMarker = true;
	});
};

/** Maximum number of points in the diagram: */
bioloop.DiagramController.MAX_POINTS = 3000;

/**
 * Setup the plotting diagram.
 */
bioloop.DiagramController.prototype._updateDiagram = function() {
	var that = this;

	// Initialize diagram
	var placeholder = $(this.diagramPlaceHolderId);
	
	if(this.addMarker === true) {
		this.addMarker = false; // reset flag
		var timestamp = (new Date()).getTime();
		
		this.markers.push({ color: "#000", lineWidth: 1, xaxis: { from: timestamp, to: timestamp } });
	}
	
	var options = {
		series : {
			shadowSize : 3
		// Drawing is faster without shadows => set this to 0 to improve
		// performance
		},
		grid : {
			color : "#545454",
			borderWidth : 1,
			borderColor : "#545454",
			markings: that.markers
		},
		xaxis : {
			show : true,
			mode : "time",
			timezone : "browser", // "browser" for local timezone of the browser (and thus user)
			tickSize: [10, "second"]
		},
		yaxes : [{
			position: "left",
			axisLabel : "GSR",
			min : that.gsrProperties.minY,
			max : that.gsrProperties.maxY,
			tickFormatter : that.gsrProperties.yFormatter
		},{
			position: "right",
			axisLabel : "HRV",
			min : that.hrvProperties.minY,
			max : that.hrvProperties.maxY,
			tickFormatter : that.hrvProperties.yFormatter
		},{
			//position: "right",
			axisLabel : "Heart Rate",
			min : that.heartRateProperties.minY,
			max : that.heartRateProperties.maxY,
			tickFormatter : that.heartRateProperties.yFormatter
		}],
		legend: { 
			position: "sw" 
		}
	};
	
	var data = [
            { 
            	data: that.gsrProperties.diagramData, 
            	label: "GSR" 
            },{ 
            	data: that.hrvProperties.diagramData, 
            	label: "HRV", 
            	yaxis: 2 
            },{ 
            	data: that.heartRateProperties.diagramData, 
            	label: "Heart Rate", 
            	yaxis: 3 
            }
        ];

	this.plot = $.plot(placeholder, data, options);
};

/**
 * Updates the diagram with a new date
 * 
 * @param {String}
 *            date the new date to add to the diagram
 */
bioloop.DiagramController.prototype.update = function(date) {
	var timestamp = parseInt(date.timestamp);
	var gsrValue = parseInt(date.gsrValue);
	var hrvValue = parseInt(date.hrvValue);
	var heartRateValue = parseInt(date.heartRate);

	// Adjust the y-Axes
	this._adjustYAxisScaling(gsrValue, hrvValue, heartRateValue);
	
	if (this.gsrProperties.diagramData.length > bioloop.DiagramController.MAX_POINTS) {
		this.gsrProperties.diagramData.shift();
		this.hrvProperties.diagramData.shift();
		this.heartRateProperties.diagramData.shift();
	}

	this.gsrProperties.diagramData.push([ timestamp, gsrValue ]);
	this.hrvProperties.diagramData.push([ timestamp, hrvValue ]);
	this.heartRateProperties.diagramData.push([ timestamp, heartRateValue ]);

	this._updateDiagram();
};

/**
 * Resets (clears) the diagram.
 */
bioloop.DiagramController.prototype.clear = function() {
	this.gsrProperties.diagramData = [];
	this.hrvProperties.diagramData = [];
	this.heartRateProperties.diagramData = [];
	
	this._updateDiagram();
};

/**
 * Adjusts the scaling of the y axis.
 */
bioloop.DiagramController.prototype._adjustYAxisScaling = function(gsrValue, hrvValue, heartRateValue) {
	
	// Adjust min/max values of y-axis scaling for GSR:
	if (gsrValue > this.gsrProperties.maxY) {
		this.gsrProperties.maxY = gsrValue + 25; // set new max value
	}

	if (gsrValue < this.gsrProperties.minY) {
		this.gsrProperties.minY = gsrValue - 25; // set new min value
	}
	
	// Adjust min/max values of y-axis scaling for HRV:
	if (hrvValue > this.hrvProperties.maxY) {
		this.hrvProperties.maxY = hrvValue + 25; // set new max value
	}

	if (hrvValue < this.hrvProperties.minY) {
		this.hrvProperties.minY = hrvValue - 25; // set new min value
	}
	
	// Adjust min/max values of y-axis scaling for Heart Rate:
	if (heartRateValue > this.heartRateProperties.maxY) {
		this.heartRateProperties.maxY = heartRateValue + 50; // set new max value
	}

	if (heartRateValue < this.heartRateProperties.minY) {
		this.heartRateProperties.minY = heartRateValue - 50; // set new min value
	}
};


