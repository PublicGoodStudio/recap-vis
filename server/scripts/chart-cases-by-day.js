'use strict';

var d3 = Object.assign( require('d3'), require('d3-fetch'), require('d3-scale-chromatic') );
var groupArray = require('group-array');

import { daysInYear, dayOfYear, monthNames } from './utility-day-of-year.js';

const p = 0.8;

class CasesByDay {

    /**
     * Given an id of a parent html element to attach to,
     * setup an SVG element ready for subsequent drawing.
     *
     */
    constructor(tsv, width, height) {

        this.parentElementID = '#visualization';
        this.svgWidth = width;
        this.svgheight = height;

        this.tsv = tsv;

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

        d3  .tsv('/static/data/' + this.tsv )
            .then( this.renderYears.bind(this) );

    }


    getThirdQuartile( data ) {
        data = data.map( ( d ) => { return parseFloat( d['Case Count'] ); });
        data.sort( function( a,b ) { return a - b; } );

        return d3.quantile( data, p );
    }


    renderYears( data ) {

        const thirdQuartile = this.getThirdQuartile( data );
        const max = d3.max( data.map( function( d ) { return parseInt( d['Case Count'] ); }) );
        const median = d3.median( data.map( function( d ) { return parseInt( d['Case Count']); }) );

        console.log( median, thirdQuartile, max );

        const grouped = groupArray( data, 'Year' );

        const parentWidth = this.svg.node().getBoundingClientRect().width;
        const parentHeight = this.svg.node().getBoundingClientRect().height;
        const yearHeight = ((parentHeight - this.margins.top - this.margins.bottom) / Object.keys( grouped ).length) - this.margins.year;
        const gWidth = parentWidth - this.margins.left - this.margins.right;


        this.renderMonthTick( this.svg, gWidth );

        let i = 0;

        for ( var year in grouped ) {

            const placement = {
                gTop: this.margins.top + i * (yearHeight + this.margins.year),
                gLeft: this.margins.left,
                gHeight: yearHeight,
                gWidth: gWidth
            };

            this.renderYearTick(
                this.svg,
                year,
                placement
            );

            this.renderYear(
                this.svg,
                {
                    Year: year,
                    data: grouped[ year ]
                },
                max,
                thirdQuartile,
                placement
            );

            i += 1;

        }

    }

    renderMonthTick( parent, gWidth ) {

        const x = d3.scaleLinear().domain([0, daysInYear]).range([0, gWidth]);

        parent.selectAll('.month-tick')
            .data( monthNames )
            .enter()
                .append( 'text' )
                .classed('reference-tick', true)
                .classed('month-tick', true)
                .attr('x', (d) => { return this.margins.left + x( dayOfYear( 1, d.number ) ); })
                .attr('y', 3 * this.margins.top / 4 )
                .text( function( d ) { return d.name; });

    }

    renderYearTick( parent, year, placement ) {

        parent
            .append('text')
            .classed('reference-tick', true)
            .classed('year-tick', true)
            .attr('x', this.margins.left / 4 )
            .attr('y', placement.gTop + placement.gHeight / 2)
            .text( year );

    }

    renderYear( parent, data, maxCases, targetQuantile, placement ) {


        const dayClass = 'day-in-' + data.Year;

        const dayWidth =  placement.gWidth / daysInYear / 2;

        const x = d3.scaleLinear().domain([1, daysInYear]).range([0, placement.gWidth]);
        let h = d3.scaleLinear().domain([1, targetQuantile]).range([1, placement.gHeight]);
        const o = d3.scaleLinear().domain([1, targetQuantile]).range([0.0,1.0]);
        const c = ( t ) => { return d3.interpolateSpectral( (1 - d3.scaleLinear().domain([1, targetQuantile]).range([0,1])(t)) / 2 ); };

        const g = parent.append('g')
            .attr('id', 'year-' + data.Year )
            .attr('width', placement.gWidth )
            .attr('height', placement.gHeight)
            .attr('transform', 'translate(' + [placement.gLeft,placement.gTop] + ')');

        this.renderDayAsCenteredRect( data.data, g, x, h, c, targetQuantile, dayWidth, placement.gHeight, dayClass );

    }


    renderDayAsTopAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls ) {
        return this.renderDayAsAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls, 0 );
    }

    renderDayAsBottomAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls ) {
        const yPlacement = function( d ) { return (gh - h( Math.min( parseInt( d['Case Count'] ), hScaleMax) )); };

        return this.renderDayAsAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls, yPlacement );
    }


    renderDayAsCenteredRect( data, g, x, h, o, hScaleMax, gw, gh, cls ) {

        const yPlacement = function( d ) { return (gh - h( Math.min( parseInt( d['Case Count'] ), hScaleMax) )) / 2; };
        return this.renderDayAsAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls, yPlacement );

    }


    renderDayAsAlignedRect( data, g, x, h, o, hScaleMax, gw, gh, cls, yPlacement ) {
        return g
            .selectAll( '.' + cls )
            .data( data )
            .enter()
                .append('rect')
                .classed('day', true)
                .classed(cls, true)
                .attr('x', function( d ) { return x( dayOfYear( parseInt( d.Day ), parseInt( d.Month ) ) ) + gw / 4; } )
                .attr('y', yPlacement )
                .attr('width', gw )
                .attr('height', function( d ) { return h( Math.min( parseInt( d['Case Count'] ), hScaleMax ) ); } )
                .attr('fill', function( d ) { return o( parseInt( d['Case Count'] ) ); });
    }

}

export { CasesByDay };
