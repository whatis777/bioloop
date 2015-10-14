/**
 * 
 */
package de.softwarenovotny.bioloop;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import de.softwarenovotny.bioloop.serial.MessageConsumer;
import de.softwarenovotny.bioloop.serial.MessageParser;
import de.softwarenovotny.bioloop.websocket.EventSocket;

/**
 * The servlet context listener for the bioloop web app.
 * This class is attached to the servlet container's lifecycle and will be called on startup or teardown.
 * 
 * @author novotny
 * @since 09.10.2015
 */
@WebListener
public class BioloopServletContextListener implements ServletContextListener {

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		EventSocket eventWebSocket = new EventSocket();
		ClientInterface clientDelegate = new ClientInterface(eventWebSocket);
		MessageParser parser = new MessageParser();
		MessageConsumer consumer = new MessageConsumer(clientDelegate);
		parser.init(consumer);
		
		try {
			Bioloop.getInstance().getSerialListener().init("ttyUSB0", parser);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		Bioloop.getInstance().getSerialListener().teardown();
	}

}
