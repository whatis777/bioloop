/**
 * 
 */
package de.softwarenovotny.bioloop;

import java.util.ArrayList;
import java.util.List;

/**
 * Filter for value grading.
 * @author novotny
 * @since 12.10.2015
 */
public class GradingFilter {
	
	/** The number of values to be used for grading. */
	private int valueCount;
	
	/** The last measured values used for grading. */
	private List<Integer> accumulatedValues = new ArrayList<Integer>();

	/**
	 * Constructor.
	 * @param valueCount the number of values to be used for grading.
	 */
	public GradingFilter(int valueCount) {
		this.valueCount = valueCount;
	}
	
	/**
	 * Adds a new value and returns the current, graded value.
	 * 
	 * @param newValue The new value to be added
	 * @return The graded value
	 */
	int filter(int newValue) {
		accumulatedValues.add(newValue);
		
		if(accumulatedValues.size() > valueCount) {
			accumulatedValues.remove(0);
		}
		
		int sum = 0;
		for (Integer value : accumulatedValues) {
			sum += value;
		}
		
		return Math.round(sum / valueCount);
	}
	
	
	
	
	
}
