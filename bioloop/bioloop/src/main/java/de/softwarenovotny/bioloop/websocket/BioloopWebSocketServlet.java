package de.softwarenovotny.bioloop.websocket;


import javax.servlet.annotation.WebServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
 
/**
 * Web socket servlet for client update events.
 * 
 * WebSocket tutorials & examples:
 *   - http://jansipke.nl/websocket-tutorial-with-java-server-jetty-and-javascript-client/
 *   - https://github.com/jetty-project/embedded-jetty-websocket-examples
 * 
 * @author novotny
 * @since 09.10.2015
 */
@SuppressWarnings("serial")
@WebServlet("/ws_update")
public class BioloopWebSocketServlet extends WebSocketServlet {
 
    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.getPolicy().setIdleTimeout(10000);
        factory.register(EventSocket.class);
    }
}
