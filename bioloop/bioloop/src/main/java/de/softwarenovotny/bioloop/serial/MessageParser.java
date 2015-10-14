package de.softwarenovotny.bioloop.serial;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

/**
 * Custom parser for processing serial messages.
 * 
 * @author novotny
 * @since 09.10.2015
 */
public class MessageParser implements ISerialMessageParser {

	/**
	 * Marks the beginning of a message. 
	 */
	private final static String MESSAGE_INTRO = "{";

	/**
	 * Marks the end of a message.
	 */
	private final static String MESSAGE_OUTRO = "}";

	/**
	 * The delimiter between two messages.
	 */
	private final static String MESSAGE_DELIMITER = "\r\n";

	/**
	 * The buffer for incoming message fragments.
	 */
	private ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

	/**
	 * The consumer of received messages.
	 */
	private MessageConsumer messageConsumer;

	public void init(MessageConsumer messageConsumer) {
		this.messageConsumer = messageConsumer;
	}

	@Override
	public void fragmentReceived(byte[] data, int length) {

		// System.out.println("Read " + length + " bytes: " + new String(data));
		outputStream.write(data, 0, length);
		parseForMessages(outputStream);
	}

	/**
	 * Parses the given byte array for contained messages
	 * 
	 * @param outputStream
	 *            the byte array to parse for messages
	 */
	private void parseForMessages(ByteArrayOutputStream outputStream) {
		List<String> messages = new ArrayList<String>();

		String messageBuffer = outputStream.toString();
		outputStream.reset();

		StringTokenizer tokenizer = new StringTokenizer(messageBuffer, MESSAGE_DELIMITER);
		while (tokenizer.hasMoreTokens()) {
			String token = tokenizer.nextToken();

			if (token.startsWith(MESSAGE_INTRO) && token.endsWith(MESSAGE_OUTRO)) {
				// found complete message
				messages.add(token);
			} else if (!tokenizer.hasMoreTokens() && token.startsWith(MESSAGE_INTRO)) {
				// Found incomplete message fragment - put this to the buffer
				// for the next run....
				try {
					outputStream.write(token.getBytes(Charset.forName("UTF-8")));
				} catch (IOException e) {
					e.printStackTrace();
				}
			} else {
				// Invalid message received....
				//System.err.println("MessageParser.parseForMessages(): Received invalid message fragment: '" + Arrays.toString(token.getBytes()) + "'");
				System.err.println("MessageParser.parseForMessages(): Received invalid message fragment: '" + token + "'");
			}
		}

		messageConsumer.consume(messages);
	}

}
