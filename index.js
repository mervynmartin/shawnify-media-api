'use strict';

const request = require('sonarr-api');

class ShawnifyMediaAPI
{
    constructor(credentails, parameters)
    {
        this.sonarrCredentials = credentials.sonarr;
        this.radarrCredentials = credentials.radarr;
        this.parameters = parameters;

        this.userLookups = [];

        this.sonarr = new SonarrAPI({
            hostname:   this.sonarrCredentials.hostname,
            apiKey:     this.sonarrCredentials.apiKey,
            port:       this.sonarrCredentials.port,   
            urlBase:    this.sonarrCredentials.urlBase
        });

    }

    seriesLookup(attributes, callback)
    {
        var test = this;

        this.sonarr.get("series/lookup", { "term": attributes.term}).then(function (result) {
            
            //Remeber search by user
            var userLookup = {};
        
            userLookup.user         = attributes.user;
            userLookup.lastSearch   = result;
            
            test.userLookups.push(userLookup);
            return userLookup;
                    
        }).catch(function (err) {
            throw new Error("There was a error processing the request: " + err);
        });

    }
    userGetSeriesFromLookup(user)
    {
        var localUserLookups = this.userLookups;
        
        for(var i=0; i<= localUserLookups.length; i++)
        {
            if(localUserLookups[i].user == user)
            {
                return localUserLookups[i];
            }
            
        }

        return {};

    }

    seriesAdd(user, id)
    {
        var mediaAPI = this;

        var userSeriesLookup = mediaAPI.userGetSeriesFromLookup(user);
        var selectedSeries = userSeriesLookup.lastSearch[id-1];

        //this.sonarr.post("series", 
        //                { tvdbId: selectedSeries.tvdbId, title: selectedSeries.title, qualityProfile: 0, titleSlug: selectedSeries.titleSlug, images: selectedSeries.images, seasons: selectedSeries.seasons }
        this.sonarr.post("series", { tvdbId: 80379, title: "The Big Bang Theory", qualityProfile: 0, titleSlug: "the-big-bang-theory", images: [], seasons: [] }
        ).then(function (result) {
            
            //console.log("Added series " + result.title);
                    
        }).catch(function (err) {
            throw new Error("There was a error processing the request: " + err);
        });

    }

}

module.exports = ShawnifyMediaAPI;