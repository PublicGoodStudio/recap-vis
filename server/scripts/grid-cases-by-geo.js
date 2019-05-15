'use strict';

var d3 = Object.assign( require('d3'), require('d3-fetch'), require('d3-scale-chromatic'), require('d3-geo') );
var topojson = require('topojson');
require("babel-polyfill");

import { ranges, jurisdictionAssociations } from './utility-geo.js';


class CasesByGeo {

    /**
     * Given an id of a parent html element to attach to,
     * setup an SVG element ready for subsequent drawing.
     */
    constructor( jsonFilePath, width, height ) {

        this.parentElementID = '#geo-vis';
        this.svgWidth = width;
        this.svgheight = height;

        this.jsonFilePath = jsonFilePath;

        this.margins = {
            top: 100,
            left: 100,
            bottom: 50,
            right: 50,
            year: 2
        };

        this.svg =
            d3.select( this.parentElementID )
                .append('svg')
                .attr('width', width + 'px')
                .attr('height', height + 'px');

    }

    async generateVisualization() {

        // Load our data and store in this objects
        await this.loadData();

        this.renderTextDesc();
        this.getMaxCaseCount();
        this.renderGeo();

    }

    async loadData() {

        await d3.json( 'https://d3js.org/us-10m.v1.json' ).then(
          ( data ) => { this.stateGeoData = data; }
        )

        await d3.json( '/static/data/' + this.jsonFilePath ).then(
          ( data ) => { this.crunchedCapData = data; }
        )

    }

    renderTextDesc() {

        let rowPosition = 0;
        let columnPosition = 0;
        let caseCount = 0;

        for ( let range in ranges ) {

            let ranged_data = this.getCounts( ranges[range].startYear, ranges[range].endYear );
            caseCount = caseCount + ranged_data.caseCount;

            this.svg
                .append('text')
                .classed('year-delta', true)
                .attr('x', 150 + (300 * columnPosition) )
                .attr('y', 250 + (300 * rowPosition ))
                .text( ranges[range].startYear + ' to ' + ranges[range].endYear);

            this.svg
                .append('text')
                .classed('year-delta', true)
                .attr('x', 150 + (300 * columnPosition) )
                .attr('y', 250 + (300 * rowPosition ) +20)
                .text( 'increase of ' + ranged_data.caseCount + ' cases');

            this.svg
                .append('text')
                .classed('year-delta', true)
                .attr('x', 150 + (300 * columnPosition) )
                .attr('y', 250 + (300 * rowPosition ) + 40)
                .text( caseCount + ' cases in total');

            columnPosition = columnPosition + 1;

            if ( columnPosition === 6 ) {

              columnPosition = 0;
              rowPosition = rowPosition + 1;

            }

        }

    }

    getCounts(startYear, endYear ) {

        var bundle = {};
        var caseCount = 0;

        for ( let d in this.crunchedCapData ) {

          var case_year = parseInt(d, 10);

          if (case_year >= startYear && case_year <= endYear) {

            for (let jurisdiction in this.crunchedCapData[d]) {

              if (jurisdiction in bundle) {
                  bundle[jurisdiction] = bundle[jurisdiction] + this.crunchedCapData[d][jurisdiction];
              } else {
                bundle[jurisdiction] = this.crunchedCapData[d][jurisdiction];
              }

              caseCount = caseCount + bundle[jurisdiction];

            }


          }

        }

        return {caseCount: caseCount, bundle: bundle};
    }



    // Find the largest case count (per jurisdiction) over
    // all year ranes. We use this as our upper domain
    // for our color shading
    getMaxCaseCount() {

      // loop through all
      // get sums for jurisdictions over all years

        let bundle = {};
        let caseCount = 0;

        for ( let d in this.crunchedCapData ) {

              for ( let jurisdiction in this.crunchedCapData[d] ) {

                  if ( jurisdiction in bundle ) {
                      bundle[jurisdiction] = bundle[jurisdiction] + this.crunchedCapData[d][jurisdiction];
                  } else {
                      bundle[jurisdiction] = this.crunchedCapData[d][jurisdiction];
                  }

              }

        }

        this.maxCaseCount = d3.max( d3.values( bundle ) );

    }

    renderGeo(data) {

        // helper function
        // scales down the topojson paths we drawing
        // for our us states
        function scale( scaleFactor ) {
            return d3.geoTransform({
                point: function(x, y) {
                    this.stream.point(x * scaleFactor, y  * scaleFactor);
                }
            });
        }

        var getCountsFromId =  (stateId, startYear, endYear) => {
        // a numeric, two digit stateid from toppjson enters

            var bundle = {};
            for ( let d in this.crunchedCapData ) {
                let caseYear = parseInt(d, 10);

                if (caseYear <= endYear) {

                    for (let jurisdiction in this.crunchedCapData[d]) {

                        if (jurisdiction in bundle) {
                            bundle[jurisdiction] = bundle[jurisdiction] + this.crunchedCapData[d][jurisdiction];
                        } else {
                          bundle[jurisdiction] = this.crunchedCapData[d][jurisdiction];
                        }
                    }
                }
            }

            let count = bundle[jurisdictionAssociations[stateId]];

            if ( typeof count === 'undefined' ) {
              count = 1;
            }

            return count;
      }

      let path = d3.geoPath()
                   .projection(scale(.15));

      let color = d3.scaleLinear()
                    .domain([1, this.maxCaseCount])
                    .range(["white", "steelblue"]);

      console.log(this.maxCaseCount)
      let row_position = 0;
      let column_position = 0;
      let x = 0;
      let y = 0;

      for ( let range in ranges ) {

          x = 100 + (300 * column_position);
          y = 100 + (300 * row_position );

          this.svg.append("g")
              .attr("class", "states-choropleth")
              .selectAll("path")
              .data( topojson.feature( this.stateGeoData, this.stateGeoData.objects.states ).features )
              .enter()
              .append( "path" )

              .attr( 'fill', function( d ) {
                      // kludge: ignoring dc in the topojson since
                      // we don't draw it in this vis
                      if ( d.id == '11' ) {
                        return
                      }
                      console.log(color(getCountsFromId(d.id, ranges[range].startYear, ranges[range].endYear)))
                      return color(getCountsFromId(d.id, ranges[range].startYear, ranges[range].endYear))
                  })

              .attr('transform', 'translate(' + x + ',' + y + ')')
              .attr("d", path);


          this.svg.append("path")
              .attr("class", "states")
              .attr('transform', 'translate(' + 100 + (300 * column_position) + ',' + 100 + (300 * row_position )  + ')')
              .attr('transform', 'translate(' + x + ',' + y + ')')
              .attr("d", path(topojson.mesh(this.stateGeoData, this.stateGeoData.objects.states, function(a, b) { return a !== b; })));


          column_position = column_position + 1;

          if (column_position === 6) {
            column_position = 0;
            row_position = row_position + 1;
          }

      }

     }
}

export { CasesByGeo };
