package de.softwarenovotny.bioloop.websocket;

import java.io.IOException;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

/**
 * The websocket that is being created for every client that connects to this server.
 * 
 * 
 * @author novotny
 * @since 09.10.2015
 */
public class EventSocket extends WebSocketAdapter
{
	/**
	 * Store the session as static variable.
	 * This works until only one client is connected.
	 */
	private static Session session = null;
	
    @Override
    public void onWebSocketConnect(Session sess)
    {
    	session = sess;
        super.onWebSocketConnect(sess);
        System.out.println("WebSocket Connected");
    }
    
    @Override
    public void onWebSocketText(String message)
    {
        super.onWebSocketText(message);
        System.out.println("Received TEXT message: " + message);
    }
    
    @Override
    public void onWebSocketClose(int statusCode, String reason)
    {
    	session = null;
        super.onWebSocketClose(statusCode,reason);
        System.out.println("Socket Closed: [" + statusCode + "] " + reason);
    }
    
    @Override
    public void onWebSocketError(Throwable cause)
    {
        super.onWebSocketError(cause);
        cause.printStackTrace(System.err);
    }
    
    /**
     * Sends the given string to the client (that has logged in at least)
     * @param str
     */
    public void sendClient(String str) {
    	if(session == null) {
    		return;
    	}
    	
        try {
            session.getRemote().sendString(str);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}