package de.softwarenovotny.bioloop.serial;

/**
 * Interface for serial message parsers.
 * @author novotny
 *
 */
public interface ISerialMessageParser {
	/**
	 * Parses and processes the given data. 
	 * @param data The received serial port data
	 * @param length the length of the received byte array
	 */
	void fragmentReceived(byte[] data, int length);
}