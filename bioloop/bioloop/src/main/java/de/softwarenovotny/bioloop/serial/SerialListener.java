package de.softwarenovotny.bioloop.serial;

import com.fazecast.jSerialComm.SerialPort;

/**
 * Listener for unidirectional serial communication.
 * 
 * Note: This implementation uses the blocking mode of jSerialComm, as the
 * event-based mode ended in 100% CPU duty.
 * 
 * jSerialComm Wiki: https://github.com/Fazecast/jSerialComm/wiki jSerialComm
 * API documentation: http://fazecast.github.io/jSerialComm/javadoc/
 * 
 * @author novotny
 * @since 10.10.2015
 */
public class SerialListener {

	/**
	 * The serial port to be used.
	 */
	private SerialPort comPort = null;

	/**
	 * The parser for the received serial data.
	 */
	private ISerialMessageParser messageParser = null;

	/**
	 * The thread that reads the serial port in blocking mode.
	 */
	Thread readerThread = null;
	
	/**
	 * Flag that indicates whether to stop the thread.
	 */
	boolean stop = false;

	/**
	 * Initializes this serial port listener.
	 * 
	 * @param portName
	 *            The name of the serial port to be used
	 * @param baudrate The baudrate of the port 
	 * @throws Exception
	 *             in case of an error or if the serial port cannot be found
	 */
	public void init(final String portName, final int baudrate, final ISerialMessageParser parser) throws Exception {
		messageParser = parser;
		stop = false;
		boolean portFound = false;
		for (SerialPort port : SerialPort.getCommPorts()) {
			System.out.println("Detected serial port: " + port.getSystemPortName());
			if (port.getSystemPortName().equals(portName)) {
				comPort = port;
				portFound = true;
			}
		}

		if (!portFound) {
			throw new Exception("Serial port " + portName + " not found");
		}

		// Open this port for communication:
		if (!comPort.openPort()) {
			throw new Exception("Serial port " + portName + " cannot be opened");
		}

		comPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 0, 0);
		comPort.setBaudRate(baudrate);

		/*
		 * Define the asynchronous reader thread:
		 */
		readerThread = new Thread(new Runnable() {

			/** The buffer to store received data. */
			private byte[] readBuffer = new byte[1024];

			@Override
			public void run() {
				while (!stop) {
					int bytesRead = 0;
					try {
						bytesRead = comPort.readBytes(readBuffer, readBuffer.length);
						if ( bytesRead == -1) {
							System.err.println("Failed reading data from serial port");
							continue;
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
					
					// Delegate to parser:
					messageParser.fragmentReceived(readBuffer, bytesRead);
				}
			}
		});
		
		readerThread.start();
	}

	/**
	 * Closes the serial communication port.
	 */
	public void teardown() {
		stop = true;
		
		if (comPort != null && comPort.isOpen()) {
			if(!comPort.closePort()) {
				System.err.println("Warning: unable to close serial port!");
			}
		}
	}

}
