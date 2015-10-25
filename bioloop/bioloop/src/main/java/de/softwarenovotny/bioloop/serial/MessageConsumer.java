package de.softwarenovotny.bioloop.serial;

import java.util.List;
import java.util.StringTokenizer;

import de.softwarenovotny.bioloop.ClientInterface;

/**
 * Consumes received messages.
 * 
 * @author novotny
 *
 */
public class MessageConsumer {

	/**
	 * The delimiter of data fieds within a message.
	 */
	private final static String FIELD_DELIMITER = ";";

	/**
	 * The number of data fields.
	 */
	private final static int FIELD_COUNT = 4;
	
	/**
	 * The client that will be updated with new message data.
	 */
	private ClientInterface clientInterface = null;
	
	/**
	 * Constructor.
	 * @param client The client interface
	 */
	public MessageConsumer(ClientInterface client) {
		this.clientInterface = client;
	}

	/**
	 * Consumes the received messages.
	 * 
	 * @param messages
	 *            the messages to be consumed.
	 */
	public void consume(List<String> messages) {
		for (String message : messages) {
			try {
				consumeMessage(message);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * Consumes the given message
	 * 
	 * @param message
	 *            The message to consume
	 * @throws Exception in case of an error
	 */
	private void consumeMessage(String message) throws Exception {
		//System.out.println("Consuming message: " + message);

		StringTokenizer tokenizer = new StringTokenizer(message.substring(1, message.length() - 1), FIELD_DELIMITER);

		if (tokenizer.countTokens() != FIELD_COUNT) {
			throw new Exception("Invalid field count in message " + message);
		}

		// Extract GSR:
		int gsrValue = Integer.parseInt(tokenizer.nextToken());
		// Extract HRV:
		int hrvValue = Integer.parseInt(tokenizer.nextToken());
		// Extract EMG:
		int emgValue = Integer.parseInt(tokenizer.nextToken());
		
		// Notify Client:
		// TODO do this in a thread!
		clientInterface.update(gsrValue, emgValue, hrvValue);
	}

}
