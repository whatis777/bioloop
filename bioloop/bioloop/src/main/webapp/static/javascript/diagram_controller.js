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
 * @constructor
 */
bioloop.DiagramController = function() {
	
	this.gsrProperties = {
			minY : 999999,
			maxY : 0,
			yFormatter : function(val, axis) {
				// formatter for the y-axis description
				return val.toFixed(axis.tickDecimals) + ' GSR';
			},
			diagramData : []
	};
	
	this.emgProperties = {
			minY : 999999,
			maxY : 0,
			yFormatter : function(val, axis) {
				// formatter for the y-axis description
				return val.toFixed(axis.tickDecimals) + ' EMG';
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
	
	this.diagramPlaceHolderId1 = '#diagram_1';
	this.diagramPlaceHolderId2 = '#diagram_2';
	
	this.markers = [];
	this.addMarker = false;
	this.updateCounter = 0;
	
	var that = this;
	
	$('#button_add_marker').click(function() {
		that.addMarker = true;
	});
};

/** Maximum number of points in the diagram: */
bioloop.DiagramController.MAX_POINTS = 3000;


/** The update divider for performance regulation. */
bioloop.DiagramController.UPDATE_DIVIDER = 1;

/** THe width of y-axis label. */
bioloop.DiagramController.Y_AXIS_LABEL_WIDTH = 75;

/**
 * Setup the plotting diagram.
 */
bioloop.DiagramController.prototype._updateDiagrams = function() {
	
	if(this.addMarker === true) {
		this.addMarker = false; // reset flag
		var timestamp = (new Date()).getTime();
		
		this.markers.push({ color: "#000", lineWidth: 1, xaxis: { from: timestamp, to: timestamp } });
	}
	
	this._updateDiagram1();
	this._updateDiagram2();
};


/**
 * Update diagram 1.
 */
bioloop.DiagramController.prototype._updateDiagram1 = function() {
	var that = this;

	// Initialize diagram
	var placeholder = $(this.diagramPlaceHolderId1);
	
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
			axisLabel : "HRV",
			labelWidth: bioloop.DiagramController.Y_AXIS_LABEL_WIDTH,
			min : that.hrvProperties.minY,
			max : that.hrvProperties.maxY,
			tickFormatter : that.hrvProperties.yFormatter
		},{
			position: "right",
			axisLabel : "Heart Rate",
			labelWidth: bioloop.DiagramController.Y_AXIS_LABEL_WIDTH,
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
            	data: that.hrvProperties.diagramData, 
            	label: "HRV", 
            	yaxis: 1 
            },{ 
            	data: that.heartRateProperties.diagramData, 
            	label: "Heart Rate", 
            	yaxis: 2 
            }
        ];

	$.plot(placeholder, data, options);
};


/**
 * Update diagram 2.
 */
bioloop.DiagramController.prototype._updateDiagram2 = function() {
	var that = this;

	// Initialize diagram
	var placeholder = $(this.diagramPlaceHolderId2);
	
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
			labelWidth: bioloop.DiagramController.Y_AXIS_LABEL_WIDTH,
			min : that.gsrProperties.minY,
			max : that.gsrProperties.maxY,
			tickFormatter : that.gsrProperties.yFormatter
		},{
			position: "right",
			axisLabel : "EMG",
			labelWidth: bioloop.DiagramController.Y_AXIS_LABEL_WIDTH,
			min : that.emgProperties.minY,
			max : that.emgProperties.maxY,
			tickFormatter : that.emgProperties.yFormatter
		}],
		legend: { 
			position: "sw" 
		}
	};
	
	var data = [
            { 
            	data: that.gsrProperties.diagramData, 
            	label: "GSR", 
            	color: "#1a8e12",
            	yaxis: 1 
            },{ 
            	data: that.emgProperties.diagramData, 
            	label: "EMG", 
            	color: "#f7ac76",
            	yaxis: 2  
            }];

	$.plot(placeholder, data, options);
};



/**
 * Updates the diagram with a new date
 * 
 * @param {String}
 *            date the new date to add to the diagram
 */
bioloop.DiagramController.prototype.update = function(date) {
	
	this.updateCounter++;
	
	var timestamp = parseInt(date.timestamp);
	var gsrValue = parseInt(date.gsrValue);
	var emgValue = parseInt(date.emgValue);
	var hrvValue = parseInt(date.hrvValue);
	var heartRateValue = parseInt(date.heartRate);
	
	if (this.gsrProperties.diagramData.length > bioloop.DiagramController.MAX_POINTS) {
		this.gsrProperties.diagramData.shift();
		this.emgProperties.diagramData.shift();
		this.hrvProperties.diagramData.shift();
		this.heartRateProperties.diagramData.shift();
	}

	this.gsrProperties.diagramData.push([ timestamp, gsrValue ]);
	this.emgProperties.diagramData.push([ timestamp, emgValue ]);
	this.hrvProperties.diagramData.push([ timestamp, hrvValue ]);
	this.heartRateProperties.diagramData.push([ timestamp, heartRateValue ]);
	
	if(this.updateCounter % bioloop.DiagramController.UPDATE_DIVIDER != 0) {
		return; // no update required yet (to save performance)
	} 
	
	// Adjust the y-Axes
	this._adjustYAxisScaling(gsrValue, emgValue, hrvValue, heartRateValue);

	this._updateDiagrams();
};

/**
 * Resets (clears) the diagram.
 */
bioloop.DiagramController.prototype.clear = function() {
	this.gsrProperties.diagramData = [];
	this.emgProperties.diagramData = [];
	this.hrvProperties.diagramData = [];
	this.heartRateProperties.diagramData = [];
	
	this._updateDiagrams();
};

/**
 * Adjusts the scaling of the y axis.
 */
bioloop.DiagramController.prototype._adjustYAxisScaling = function(gsrValue, emgValue, hrvValue, heartRateValue) {
	
	// Adjust min/max values of y-axis scaling for GSR:
	if (gsrValue > this.gsrProperties.maxY) {
		this.gsrProperties.maxY = gsrValue + 25; // set new max value
	}

	if (gsrValue < this.gsrProperties.minY) {
		this.gsrProperties.minY = gsrValue - 25; // set new min value
	}
	
	// Adjust min/max values of y-axis scaling for EMG:
	if (emgValue > this.emgProperties.maxY) {
		this.emgProperties.maxY = emgValue + 25; // set new max value
	}

	if (emgValue < this.emgProperties.minY) {
		this.emgProperties.minY = emgValue - 25; // set new min value
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


