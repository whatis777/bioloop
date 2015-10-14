package de.softwarenovotny.bioloop;

/**
 * POJO containing the data to update the Client with.
 * This will be converted to JSON.
 * 
 * @author novotny
 * @since 10.10.2015
 */
public class UpdateData {
	/**
	 * The timestamp of the measurement.
	 */
	long timestamp;
	
	/**
	 * @return the timestamp
	 */
	public long getTimestamp() {
		return timestamp;
	}

	/**
	 * @param timestamp the timestamp to set
	 */
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	/**
	 * @return the heartRate
	 */
	public int getHeartRate() {
		return heartRate;
	}

	/**
	 * @param heartRate the heartRate to set
	 */
	public void setHeartRate(int heartRate) {
		this.heartRate = heartRate;
	}

	/**
	 * The GSR value (Galvanic skin response).
	 */
	private int gsrValue;
	
	/**
	 * The HRV value (Heart Rate Variability).
	 */
	private int hrvValue;
	
	/**
	 * The current heart rate.
	 */
	int heartRate;

	/**
	 * @return the hrvValue
	 */
	public int getHrvValue() {
		return hrvValue;
	}

	/**
	 * @param hrvValue the hrvValue to set
	 */
	public void setHrvValue(int hrvValue) {
		this.hrvValue = hrvValue;
	}

	/**
	 * @return the gsrValue
	 */
	public int getGsrValue() {
		return gsrValue;
	}

	/**
	 * @param gsrValue the gsrValue to set
	 */
	public void setGsrValue(int gsrValue) {
		this.gsrValue = gsrValue;
	}

}
