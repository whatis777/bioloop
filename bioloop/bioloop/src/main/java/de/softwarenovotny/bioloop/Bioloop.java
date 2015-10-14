package de.softwarenovotny.bioloop;

import de.softwarenovotny.bioloop.serial.SerialListener;

/**
 * The main class of the bioloop web application.
 * @author novotny
 * @since 09.10.2015
 */
public class Bioloop {
	private static Bioloop instance = null;
	
	private SerialListener serialListener = new SerialListener();
	
	public static Bioloop getInstance() {
		if(instance == null) {
			instance = new Bioloop();
		}
		return instance;
	}
	
	public SerialListener getSerialListener() {
		return serialListener;
	}
	
	
}
