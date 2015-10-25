package de.softwarenovotny.bioloop;

import org.json.JSONObject;

import de.softwarenovotny.bioloop.websocket.EventSocket;

/**
 * The (web) client delegate.
 * @author novotny
 *
 */
public class ClientInterface {
	private EventSocket eventWebSocket;
	private GradingFilter gsrGradingFilter = new GradingFilter(5); 
	private GradingFilter emgGradingFilter = new GradingFilter(1);
	private GradingFilter heartRateGradingFilter = new GradingFilter(50);

	public ClientInterface(EventSocket eventWebSocket) {
		this.eventWebSocket = eventWebSocket;
	}

	/**
	 * Call this method each time the client UI shall be updated.
	 * @param gsrValue
	 * @param emgValue
	 * @param hrvValue 
	 */
	public void update(int gsrValue, int emgValue, int hrvValue) {
		
		long timestamp = System.currentTimeMillis();
		
		// Apply grading of the received values:
		int gradedGrsValue = gsrGradingFilter.filter(gsrValue);
		int gradedEmgValue = emgGradingFilter.filter(emgValue);
		int heartRate = heartRateGradingFilter.filter(getHeartRate(hrvValue));
		
		// Create JSON string:
		UpdateData updateData = new UpdateData();
		updateData.setTimestamp(timestamp);
		updateData.setGsrValue(gradedGrsValue);
		updateData.setEmgValue(gradedEmgValue);
		updateData.setHrvValue(hrvValue);
		updateData.setHeartRate(heartRate);
		
		// Convert to JSON:
		JSONObject jsonObj = new JSONObject( updateData );
		
		eventWebSocket.sendClient(jsonObj.toString());
	}

	/**
	 * Computes the heart rate (beats per minute)
	 * @param hrvValue The current HRV value (distance of 2 heartbeats in ms)
	 * @return the current heartrate or 0
	 */
	private int getHeartRate(int hrvValue) {
		
		if(hrvValue == 0) {
			// not available
			return 0;
		}
		
		int heartRate = Math.round(1/((float)hrvValue / 1000) * 60);
		
		return heartRate;
	}

}
