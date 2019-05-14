'use strict';

var d3 = Object.assign( require('d3'), require('d3-fetch'), require('d3-scale-chromatic'), require('d3-geo') );
var moment = require('moment');
var topojson = require('topojson');

class CasesByGeo {

    /**
     * Given an id of a parent html element to attach to,
     * setup an SVG element ready for subsequent drawing.
     *
     */
    constructor(jsonFilePath, width, height) {

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

    generateVisualization() {

      d3  .json('/static/data/' + this.jsonFilePath )
          .then( this.getMaxCaseCount.bind(this) )
          .then( this.renderTextDesc.bind(this) );

      d3  .json( "https://d3js.org/us-10m.v1.json" )
          .then( this.renderGeo.bind(this) );

    }

    renderTextDesc( data ) {

      // I need to iterate through a list of year ranges
      // and for each range, I draw a block
      // that block will contain two lines

      // increase of n cases
      // n cases total


      const ranges = [
        {start_year: 1657, end_year: 1657}, {start_year: 1658, end_year: 1659},
        {start_year: 1660, end_year: 1669}, {start_year: 1670, end_year: 1679},
        {start_year: 1680, end_year: 1689}, {start_year: 1690, end_year: 1699},
        {start_year: 1700, end_year: 1709}, {start_year: 1710, end_year: 1719},
        {start_year: 1720, end_year: 1729}, {start_year: 1730, end_year: 1739},
        {start_year: 1740, end_year: 1749},
        {start_year: 1750, end_year: 1759}, {start_year: 1760, end_year: 1769},
        {start_year: 1770, end_year: 1779}, {start_year: 1780, end_year: 1789},
        {start_year: 1790, end_year: 1799}, {start_year: 1800, end_year: 1809},
        {start_year: 1810, end_year: 1819}, {start_year: 1820, end_year: 1829},
        {start_year: 1830, end_year: 1839}, {start_year: 1840, end_year: 1849},
        {start_year: 1850, end_year: 1859}, {start_year: 1860, end_year: 1869},
        {start_year: 1870, end_year: 1879}, {start_year: 1880, end_year: 1889},
        {start_year: 1890, end_year: 1899}, {start_year: 1900, end_year: 1909},
        {start_year: 1910, end_year: 1919}, {start_year: 1920, end_year: 1929},
        {start_year: 1930, end_year: 1939}, {start_year: 1940, end_year: 1949},
        {start_year: 1950, end_year: 1959}, {start_year: 1960, end_year: 1969},
        {start_year: 1970, end_year: 1979}, {start_year: 1980, end_year: 1989},
        {start_year: 1990, end_year: 1999}, {start_year: 2000, end_year: 2009},
        {start_year: 2010, end_year: 2019}
      ];

      var row_position = 0;
      var column_position = 0;
      var case_count = 0;
      for (let range in ranges) {
        let ranged_data = this.get_counts( data, ranges[range].start_year, ranges[range].end_year );

        case_count = case_count + ranged_data.case_count;
        this.svg
            .append('text')
            .classed('year-delta', true)
            .attr('x', 150 + (300 * column_position) )
            .attr('y', 250 + (300 * row_position ))
            .text( ranges[range].start_year + ' to ' + ranges[range].end_year);

        this.svg
            .append('text')
            .classed('year-delta', true)
            .attr('x', 150 + (300 * column_position) )
            .attr('y', 250 + (300 * row_position ) +20)
            .text( 'increase of ' + ranged_data.case_count + ' cases');

        this.svg
            .append('text')
            .classed('year-delta', true)
            .attr('x', 150 + (300 * column_position) )
            .attr('y', 250 + (300 * row_position ) + 40)
            .text( case_count + ' cases in total');


        column_position = column_position + 1;

        if (column_position === 6) {
          column_position = 0;
          row_position = row_position + 1;
        }

      }

    }

    get_counts( data, start_year, end_year ) {

        var bundle = {};
        var case_count = 0;
        for ( let d in data ) {

          var case_year = parseInt(d, 10);

          if (case_year >= start_year && case_year <= end_year) {

            for (let jurisdiction in data[d]) {

              if (jurisdiction in bundle) {
                  bundle[jurisdiction] = bundle[jurisdiction] + data[d][jurisdiction];
              } else {
                bundle[jurisdiction] = 1;
              }
              case_count = case_count + bundle[jurisdiction];

            }


          }

        }
        console.log(case_count);
        return {case_count: case_count, bundle: bundle};
    }

    getMaxCaseCount(data) {

      var bundle = {};
      for ( let d in data ) {

          for (let jurisdiction in data[d]) {

            if (jurisdiction in bundle) {
                bundle[jurisdiction] = bundle[jurisdiction] + data[d][jurisdiction];
            } else {
              bundle[jurisdiction] = data[d][jurisdiction];
            }

          }


        }


        this.maxCaseCount = d3.max(d3.values(bundle));
        //console.log(this.maxCaseCount)


      }














    renderGeo(data) {

      function scale (scaleFactor) {
          return d3.geoTransform({
              point: function(x, y) {
                  this.stream.point(x * scaleFactor, y  * scaleFactor);
              }
          });
      }

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }


      var getCountsFromId = (stateId) => {
        d3  .json('/static/data/' + this.jsonFilePath )
            .then(

            function(data) {
              console.log(stateId);

            }


          )
      }

      let path   = d3.geoPath()
                 .projection(scale(.15));

      let color = d3.scaleLinear()
         .domain([1, 101])
         .range(["white", "steelblue"]);

      let row_position = 0;
      let column_position = 0;
      let x = 0;
      let y = 0;

      for (let i = 0; i < 38; i++) { // match our decade descriptions

        x = 100 + (300 * column_position);
        y = 100 + (300 * row_position );

        this.svg.append("g")
            .attr("class", "states-choropleth")
            .selectAll("path")
            .data(topojson.feature(data, data.objects.states).features)
            .enter()
            .append("path")
            .attr("fill", function(d) {
                getCountsFromId(d.id);
            // make function that accepts d.id, maps it to cap state abrev.
            // and then returns the count for that state
            // we then pass that value to our color function

            return color(getRandomInt(1,100));

          })
          .attr('transform', 'translate(' + x + ',' + y + ')')
           .attr("d", path);


        this.svg.append("path")
            .attr("class", "states")
            .attr('transform', 'translate(' + 100 + (300 * column_position) + ',' + 100 + (300 * row_position )  + ')')
            .attr('transform', 'translate(' + x + ',' + y + ')')
            .attr("d", path(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; })));


        column_position = column_position + 1;

        if (column_position === 6) {
          column_position = 0;
          row_position = row_position + 1;
        }



      }


     }
}

export { CasesByGeo };
