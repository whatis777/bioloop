/**
 * The JavaScript file for the Bioloop App.
 * 
 * @author http://software-novotny.de
 * @since 10.10.2015
 */

'use strict';

var bioloop = {}; // Create namespace

/**
 * Constructor.
 * 
 * @constructor
 */
bioloop.Bioloop = function() {
	this.diagramController = null;
	this.webSocket = null;
	this.started = false;
};

/**
 * The transition time in milliseconds of hiding or showing views.
 */
bioloop.Bioloop.VIEW_TRANSITION_TIME = 100;

/**
 * Initializes the application.
 */
bioloop.Bioloop.prototype.init = function() {

	var that = this;

	// Setup the diagram:
	this.diagramController = new bioloop.DiagramController('#diagram_1');
	// this.diagramController.setupDiagram();

	$('#menu_start').click(function(evt) {

		if (that.started === true) {
			return; // nothing to do: already started
		}

		that.started = true;

		that.diagramController.clear();

		// Initialize the websocket connection for client updates:
		var hostIP = '192.168.2.116';
		var port = 8080;
		var url = '/ws_update';
		that.webSocket = that.initWebSocket(hostIP, port, url);
	});

	$('#menu_stop').click(function(evt) {
		if (that.started === false) {
			return; // nothing to do: already stopped
		}

		that.started = false;

		that.webSocket.close();
	});

	$('#menu_measure').click(function(evt) {
		that.displayMeasurementView();
	});
	
	$('#menu_configure').click(function(evt) {
		
		if(that.started === true) {
			alert('Please stop running measurements before changing configuration');
			return;
		}
		
		that.displayConfigurationView();
	});
	
	$('#optionsTimeRangeMinimum').click(function(evt) {
		bioloop.DiagramController.MAX_POINTS = 1000;
		bioloop.DiagramController.UPDATE_DIVIDER = 1;
	});
	
	$('#optionsTimeRangeMedium').click(function(evt) {
		bioloop.DiagramController.MAX_POINTS = 3000;
		bioloop.DiagramController.UPDATE_DIVIDER = 2;
	});
	
	$('#optionsTimeRangeMaximum').click(function(evt) {
		bioloop.DiagramController.MAX_POINTS = 6000;
		bioloop.DiagramController.UPDATE_DIVIDER = 10;
	});
	
	$('#optionsTimeRangeMedium').click();
};

/**
 * Changes to the measurement view.
 */
bioloop.Bioloop.prototype.displayMeasurementView = function() {
	$('#configure_div').hide(bioloop.Bioloop.VIEW_TRANSITION_TIME, function() {
		$('#measure_div').show(bioloop.Bioloop.VIEW_TRANSITION_TIME);
	});
	
	$('#measure_subheader').show(bioloop.Bioloop.VIEW_TRANSITION_TIME);
};

/**
 * Changes to the configuration view.
 */
bioloop.Bioloop.prototype.displayConfigurationView = function() {
	$('#measure_div').hide(bioloop.Bioloop.VIEW_TRANSITION_TIME, function() {
		$('#configure_div').show(bioloop.Bioloop.VIEW_TRANSITION_TIME);
	});
	
	$('#measure_subheader').hide(bioloop.Bioloop.VIEW_TRANSITION_TIME);
};

/**
 * Initializes and connects the WebSocket to the server.
 */
bioloop.Bioloop.prototype.initWebSocket = function(ip, port, url) {
	var that = this;
	var webSocket = new WebSocket('ws://' + ip + ':' + port + url);

	webSocket.onopen = function() {
		// webSocket.send("Hello Server");
		console.log('WebSocket connected');
	};

	webSocket.onmessage = function(evt) {
		var dataContainer = that.parseData(evt.data);

		$('#pulse_display').html(dataContainer.heartRate);

		that.diagramController.update(dataContainer);
	};

	webSocket.onclose = function() {
		console.log('WebSocket closed');
	};

	webSocket.onerror = function(err) {
		alert("Error: " + err);
	};

	return webSocket;
}

/**
 * Parses the received string into an object.
 * 
 * @param {String}
 *            dataString The received data string
 * @return {Object} the object containing the data
 */
bioloop.Bioloop.prototype.parseData = function(dataString) {
	// console.log('Received message from Server: ' + dataString);
	return JSON.parse(dataString);
};

// ========================================================================
// ==================== Entry Point "main()" ==============================
// ========================================================================

// Create a new instance of the application to run:
bioloop.app = undefined;

/**
 * Called when the DOM is ready - called by jQuery.
 */
$(document).ready(function() // called when DOM is ready
{
	// initialize the application
	bioloop.app = new bioloop.Bioloop();
	bioloop.app.init();
});
