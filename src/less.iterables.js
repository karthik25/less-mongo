/*
 * less.iterables - set of utilities that supports iterating through the results
 *
 *      Version 1.0.0
 *
 *  Copyright 2015 
 *
 */
(function (global){
    'use strict';    
    
    var extend = function (settings, options) {
      for (var key in settings) {
        if (options.hasOwnProperty(key)) {
             settings[key] = options[key];   
        }
      }
      return settings;
    };
    
    /*
     * function  : it()
     * 
     * if a previous findInArray2 was performed and there are more results, they are printed
     * could be called numerous times - if there are no more results to be displayed, prints a
     * corresponding message
     *
     */    
    global.it = function () {
        var state = global.state;
        
        if (state.results == null || state.results.length === 0) {
            print("iterator exhausted");
            return;
        }
        
        var spliceCount = state.results.length >= state.count ? state.count : state.results.length;
        var part = _.first(state.results, spliceCount);
        state.results.splice(0, spliceCount);
        global.state = state;
        return part;
    };
    
    /*
     * function  : findInArray2
     * called on : a collection - db.<collection-name>.findInArray2()
     * params    : options object
     * 
     * provides the ability to filter arrays and return them as the result using simple key/value pairs
     * this is an add-on to findInArray, where you get to see a subset of the results
     * to print the remainder of the results, use it() - see above
     *
     */
    DBCollection.prototype.findInArray2 = function (options) {
        var settings = extend({
            defaultCount: 10
        }, options || {}); 
        
        var matchedEntries = this.findInArray(options);
        var spliceCount = matchedEntries.length >= settings.defaultCount ? settings.defaultCount : matchedEntries.length;
        var part = _.first(matchedEntries, spliceCount);
        matchedEntries.splice(0, spliceCount);
        var state = { results: matchedEntries, count: settings.defaultCount };
        global.state = state;
        return part;
    };
}(this));
