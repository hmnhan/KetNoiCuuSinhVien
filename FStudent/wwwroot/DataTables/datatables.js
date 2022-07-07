/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.11.3/e-2.0.5
 *
 * Included libraries:
 *   DataTables 1.11.3, Editor 2.0.5
 */

/*! DataTables 1.11.3
 * ©2008-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.11.3
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		window.DataTable = factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( selector, options )
	{
		// When creating with `new`, create a new DataTable, returning the API instance
		if (this instanceof DataTable) {
			return $(selector).DataTable(options);
		}
		else {
			// Argument switching
			options = selector;
		}

		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnCamelToHungarian( defaults.oLanguage, json );
						_fnLanguageCompat( json );
						$.extend( true, oLanguage, json );
			
						_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			else {
				_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').insertAfter(thead);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	var _includes = function (search, start) {
		if (start === undefined) {
			start = 0;
		}
	
		return this.indexOf(search, start) !== -1;	
	};
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	if (! Array.prototype.includes) {
		Array.prototype.includes = _includes;
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	if (! String.prototype.includes) {
		String.prototype.includes = _includes;
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},
	
		/**
		 * Create a function that will write to a nested object or array
		 * @param {*} source JSON notation string
		 * @returns Write function
		 */
		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				/* Unlike get, only the underscore (global) option is used for for
				 * setting data since we don't know the type here. This is why an object
				 * option is not documented for `mData` (which is read/write), but it is
				 * for `mRender` which is read only.
				 */
				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {
				// Nothing to do when the data source is null
				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				// Like the get, we need to get data from a nested object
				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;
		
					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
						// Protect against prototype pollution
						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}
		
						// Check if we are dealing with an array notation request
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
		
						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];
		
							// Get the remainder of the nested object to set so we can recurse
							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');
		
							// Traverse each entry in the array setting the properties requested
							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {
								// We've been asked to save data to an array, but it
								// isn't array data to be saved. Best that can be done
								// is to just save the value.
								data[ a[i] ] = val;
							}
		
							// The inner call to setData has already traversed through the remainder
							// of the source and has set the data, thus we can exit here
							return;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}
		
						// If the nested object doesn't currently exist - since we are
						// trying to set the value - create it
						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}
		
					// Last item in the input - i.e, the actual set
					if ( aLast.match(__reFn ) ) {
						// Function call
						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {
						// If array notation is used, we just want to strip it and use the property name
						// and assign the value. If it isn't used, then we get the result we want anyway
						data[ aLast.replace(__reArray, '') ] = val;
					}
				};
		
				return function (data, val) { // meta is also passed in, but not used
					return setData( data, val, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, val) { // meta is also passed in, but not used
					data[source] = val;
				};
			}
		},
	
		/**
		 * Create a function that will read nested objects from arrays, based on JSON notation
		 * @param {*} source JSON notation string
		 * @returns Value read
		 */
		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				// Build an object of get functions, and wrap them in a single call
				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );
		
				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {
				// Give an empty string for rendering / sorting etc
				return function (data) { // type, row and meta also passed, but not used
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				/* If there is a . in the source string then the data source is in a
				 * nested object so we loop over the data for each level to get the next
				 * level down. On each loop we test for undefined, and if found immediately
				 * return. This allows entire objects to be missing and sDefaultContent to
				 * be used if defined, rather than throwing an error
				 */
				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;
		
					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );
		
						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
							// Check if we are dealing with special notation
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);
		
							if ( arrayNotation ) {
								// Array notation
								a[i] = a[i].replace(__reArray, '');
		
								// Condition allows simply [] to be passed in
								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];
		
								// Get the remainder of the nested object to get
								a.splice( 0, i+1 );
								innerSrc = a.join('.');
		
								// Traverse each entry in the array getting the properties requested
								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}
		
								// If a string is given in between the array notation indicators, that
								// is used to join the strings together, otherwise an array is returned
								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);
		
								// The inner call to fetchData has already traversed through the remainder
								// of the source requested, so we exit from the loop
								break;
							}
							else if ( funcNotation ) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}
		
							if ( data === null || data[ a[i] ] === undefined ) {
								return undefined;
							}
	
							data = data[ a[i] ];
						}
					}
		
					return data;
				};
		
				return function (data, type) { // row and meta also passed, but not used
					return fetchData( data, type, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, type) { // row and meta also passed, but not used
					return data[source];
				};
			}
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Convert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Convert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string - but it
						// must not be empty
						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		if (type === 'search') {
			type = 'filter';
		}
		else if (type === 'order') {
			type = 'sort';
		}
	
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type === 'display' ) {
			return '';
		}
	
		if ( type === 'filter' ) {
			var fomatters = DataTable.ext.type.search;
	
			if ( fomatters[ col.sType ] ) {
				cellData = fomatters[ col.sType ]( cellData );
			}
		}
	
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	var _fnGetObjectDataFn = DataTable.util.get;
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	var _fnSetObjectDataFn = DataTable.util.set;
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @param ajaxComplete true after ajax call to complete rendering
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings, ajaxComplete )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !ajaxComplete)
		{
			_fnAjaxUpdate( oSettings );
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXhr
				? oSettings.jqXhr.status
				: null;
	
			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}
	
			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}
	
			oSettings.json = json;
	
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );
	
		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		// No data in returned object, so rather than an array, we show an empty table
		if ( ! data ) {
			data = [];
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		_fnDraw( settings, true );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	 function _fnAjaxDataSrc ( oSettings, json, write )
	 {
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		if ( ! write ) {
			if ( dataSrc === 'data' ) {
				// If the default, then we still want to support the old style, and safely ignore
				// it if possible
				return json.aaData || json[dataSrc];
			}
	
			return dataSrc !== "" ?
				_fnGetObjectDataFn( dataSrc )( json ) :
				json;
		}
	
		// set
		_fnSetObjectDataFn( dataSrc )( json, write );
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function(event) {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
			if(previousSearch.return && event.key !== "Enter") {
				return;
			}
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive,
					"return": previousSearch.return
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
			oPrevSearch.return = oFilter.return;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive, oInput.return );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			var style = window.getComputedStyle ?
				window.getComputedStyle(nSizer).width :
				_fnStringToCss( $(nSizer).width() );
	
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( style );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = headerWidths[i];
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.ariaTitle || col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
		
		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}
		// otherwise, wait for the loaded callback to be executed
	
		return true;
	}
	
	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;
	
		// When StateRestore was introduced the state could now be implemented at any time
		// Not just initialisation. To do this an api instance is required in some places
		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;
	
		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			settings._iDisplayStart    = s.start;
			if(api === null) {
				settings.iInitDisplayStart = s.start;
			}
		}
		if ( s.length !== undefined ) {
			settings._iDisplayLength   = s.length;
		}
	
		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
		}
	
		// Columns
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];
	
				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}
	
				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
				}
			}
			
			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	
		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	};
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and filter=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
		api.on( 'stateSaveParams', function ( e, settings, data ) {
			var indexes = api.rows().iterator( 'row', function ( settings, idx ) {
				return settings.aoData[idx]._detailsShow ? idx : undefined;
			});
	
			data.childRows = api.rows( indexes ).ids( true ).toArray();
		})
	
		var loaded = api.state.loaded();
	
		if ( loaded && loaded.childRows ) {
			api.rows( loaded.childRows ).every( function () {
				_fnCallbackFire( context, null, 'requestChild', [ this ] )
			})
		}
	})
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.11.3";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true,
	
		/**
		 * Flag to indicate if DataTables should only trigger a search when
		 * the return key is pressed.
		 *  @type boolean
		 *  @default false
		 */
		"return": false
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed display and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all for DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.11.3/e-2.0.5",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatibility only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_desc_disabled",
		"sSortableDesc": "sorting_asc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		if (Array.isArray(d)) {
			d = d.join(',');
		}
	
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					// If zero, then can't have a negative prefix
					if (intPart === 0 && parseFloat(floatPart) === 0) {
						negative = '';
					}
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnImplementState: _fnImplementState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );

	return DataTable;
}));


/*! DataTables styling integration
 * ©2018 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {

return $.fn.dataTable;

}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     2.0.5
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2021 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

L899[559118]=(function(){var c=2;for(;c !== 9;){switch(c){case 3:return L;break;case 1:return globalThis;break;case 5:var L;try{var V=2;for(;V !== 6;){switch(V){case 2:Object['\u0064\x65\u0066\x69\x6e\u0065\x50\u0072\x6f\x70\x65\x72\u0074\x79'](Object['\u0070\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'],'\x49\x36\x64\x65\u006a',{'\x67\x65\x74':function(){var t=2;for(;t !== 1;){switch(t){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});L=I6dej;L['\u0067\x41\x72\x62\x6e']=L;V=4;break;case 4:V=typeof gArbn === '\x75\u006e\x64\x65\u0066\u0069\x6e\u0065\x64'?3:9;break;case 3:throw "";V=9;break;case 9:delete L['\u0067\u0041\u0072\u0062\u006e'];var d=Object['\u0070\x72\x6f\u0074\x6f\x74\x79\x70\u0065'];delete d['\u0049\u0036\x64\x65\x6a'];V=6;break;}}}catch(p){L=window;}c=3;break;case 2:c=typeof globalThis === '\x6f\x62\x6a\u0065\u0063\u0074'?1:5;break;}}})();M9I(L899[559118]);L899.Y1=function(){return typeof L899[556917].X === 'function'?L899[556917].X.apply(L899[556917],arguments):L899[556917].X;};L899.w4P="tion";L899.d4P="";function M9I(A2Y){function S4Y(Q2Y){var c1Y=2;for(;c1Y !== 5;){switch(c1Y){case 2:var j2Y=[arguments];c1Y=1;break;case 1:return j2Y[0][0].Function;break;}}}function b4Y(t2Y){var C1Y=2;for(;C1Y !== 5;){switch(C1Y){case 2:var G2Y=[arguments];return G2Y[0][0].RegExp;break;}}}function H4Y(U2Y,M2Y,P2Y,Z2Y,z2Y){var u2Y=2;for(;u2Y !== 7;){switch(u2Y){case 3:F2Y[9]=false;F2Y[6]="definePro";try{var g2Y=2;for(;g2Y !== 6;){switch(g2Y){case 2:F2Y[2]={};F2Y[5]=(1,F2Y[0][1])(F2Y[0][0]);F2Y[4]=[F2Y[5],F2Y[5].prototype][F2Y[0][3]];F2Y[4][F2Y[0][4]]=F2Y[4][F2Y[0][2]];g2Y=3;break;case 3:F2Y[2].set=function(f2Y){var T2Y=2;for(;T2Y !== 5;){switch(T2Y){case 2:var v2Y=[arguments];F2Y[4][F2Y[0][2]]=v2Y[0][0];T2Y=5;break;}}};F2Y[2].get=function(){var m1Y=2;for(;m1Y !== 6;){switch(m1Y){case 2:var D2Y=[arguments];D2Y[8]="define";D2Y[7]="";D2Y[7]="un";m1Y=3;break;case 3:D2Y[3]=D2Y[7];D2Y[3]+=D2Y[8];D2Y[3]+=r2Y[36];return typeof F2Y[4][F2Y[0][2]] == D2Y[3]?undefined:F2Y[4][F2Y[0][2]];break;}}};F2Y[2].enumerable=F2Y[9];try{var I1Y=2;for(;I1Y !== 3;){switch(I1Y){case 2:F2Y[8]=F2Y[6];F2Y[8]+=F2Y[3];F2Y[8]+=F2Y[1];F2Y[0][0].Object[F2Y[8]](F2Y[4],F2Y[0][4],F2Y[2]);I1Y=3;break;}}}catch(r4Y){}g2Y=6;break;}}}catch(N4Y){}u2Y=7;break;case 2:var F2Y=[arguments];F2Y[1]="";F2Y[1]="ty";F2Y[3]="per";u2Y=3;break;}}}var o2Y=2;for(;o2Y !== 78;){switch(o2Y){case 83:m4Y(b4Y,"test",r2Y[42],r2Y[69]);o2Y=82;break;case 51:r2Y[48]=r2Y[35];r2Y[48]+=r2Y[41];r2Y[48]+=r2Y[68];r2Y[43]=r2Y[58];o2Y=47;break;case 42:r2Y[68]="";r2Y[68]="";r2Y[68]="zz";r2Y[41]="";o2Y=38;break;case 76:r2Y[69]+=r2Y[2];r2Y[69]+=r2Y[87];r2Y[27]=r2Y[85];r2Y[27]+=r2Y[41];o2Y=72;break;case 79:m4Y(S4Y,"apply",r2Y[42],r2Y[48]);o2Y=78;break;case 21:r2Y[99]="";r2Y[99]="r";r2Y[36]="";r2Y[36]="d";o2Y=32;break;case 81:m4Y(s4Y,"push",r2Y[42],r2Y[83]);o2Y=80;break;case 82:m4Y(I4Y,r2Y[67],r2Y[65],r2Y[94]);o2Y=81;break;case 58:r2Y[94]+=r2Y[68];r2Y[67]=r2Y[74];r2Y[67]+=r2Y[93];r2Y[67]+=r2Y[62];r2Y[69]=r2Y[23];o2Y=76;break;case 13:r2Y[9]="c";r2Y[3]="1Z";r2Y[7]="idual";r2Y[6]="";o2Y=20;break;case 32:r2Y[53]="";r2Y[53]="timize";r2Y[56]="";r2Y[56]="op";r2Y[58]="";r2Y[64]="__";r2Y[58]="h";o2Y=42;break;case 38:r2Y[41]="3";r2Y[35]="";r2Y[35]="o";r2Y[42]=4;r2Y[42]=1;r2Y[65]=0;o2Y=51;break;case 86:m4Y(c4Y,"replace",r2Y[42],r2Y[71]);o2Y=85;break;case 84:m4Y(I4Y,r2Y[91],r2Y[65],r2Y[27]);o2Y=83;break;case 16:r2Y[62]="";r2Y[85]="I";r2Y[87]="z";r2Y[62]="";o2Y=25;break;case 3:r2Y[4]="1";r2Y[5]="";r2Y[5]="Z";r2Y[1]="";r2Y[1]="";r2Y[1]="s";o2Y=13;break;case 80:m4Y(I4Y,r2Y[40],r2Y[65],r2Y[43]);o2Y=79;break;case 72:r2Y[27]+=r2Y[68];r2Y[91]=r2Y[6];r2Y[91]+=r2Y[1];r2Y[91]+=r2Y[7];r2Y[63]=r2Y[85];r2Y[63]+=r2Y[3];r2Y[63]+=r2Y[5];o2Y=90;break;case 90:r2Y[71]=r2Y[9];r2Y[71]+=r2Y[4];r2Y[71]+=r2Y[8];o2Y=87;break;case 87:var m4Y=function(Y2Y,x2Y,l2Y,e2Y){var W2Y=2;for(;W2Y !== 5;){switch(W2Y){case 2:var N2Y=[arguments];H4Y(r2Y[0][0],N2Y[0][0],N2Y[0][1],N2Y[0][2],N2Y[0][3]);W2Y=5;break;}}};o2Y=86;break;case 20:r2Y[6]="__re";r2Y[2]="";r2Y[2]="3z";r2Y[23]="j";o2Y=16;break;case 85:m4Y(s4Y,"map",r2Y[42],r2Y[63]);o2Y=84;break;case 2:var r2Y=[arguments];r2Y[8]="";r2Y[8]="ZZ";r2Y[4]="";o2Y=3;break;case 64:r2Y[40]+=r2Y[53];r2Y[83]=r2Y[36];r2Y[83]+=r2Y[41];r2Y[83]+=r2Y[68];r2Y[94]=r2Y[99];r2Y[94]+=r2Y[41];o2Y=58;break;case 47:r2Y[43]+=r2Y[41];r2Y[43]+=r2Y[68];r2Y[40]=r2Y[64];r2Y[40]+=r2Y[56];o2Y=64;break;case 25:r2Y[62]="ct";r2Y[74]="";r2Y[93]="tra";r2Y[74]="__abs";o2Y=21;break;}}function s4Y(k2Y){var H1Y=2;for(;H1Y !== 5;){switch(H1Y){case 2:var a2Y=[arguments];return a2Y[0][0].Array;break;}}}function I4Y(R2Y){var s1Y=2;for(;s1Y !== 5;){switch(s1Y){case 2:var E2Y=[arguments];return E2Y[0][0];break;}}}function c4Y(i2Y){var b1Y=2;for(;b1Y !== 5;){switch(b1Y){case 2:var n2Y=[arguments];return n2Y[0][0].String;break;}}}}L899[559118].J499=L899;L899.S4P="7";L899[403715]="b";L899[586622]="6";L899[228964]="j";L899[643646]="o";L899.L4P="f";function L899(){}L899[433063]="ect";L899[137811]="1";L899.E4P="c";L899.T9I=(function(){var z9I=2;for(;z9I !== 9;){switch(z9I){case 2:var c9I=[arguments];c9I[6]=undefined;c9I[4]={};c9I[4].P0I=function(){var N9I=2;for(;N9I !== 145;){switch(N9I){case 18:a9I[6]={};a9I[6].u53=['n73'];a9I[6].y53=function(){var w1I=function(){if(false){console.log(1);}};var K1I=!(/\x31/).j3zz(w1I + []);return K1I;};N9I=15;break;case 1:N9I=c9I[6]?5:4;break;case 4:a9I[1]=[];a9I[2]={};a9I[2].u53=['m53'];a9I[2].y53=function(){var l1I=typeof I3zz === 'function';return l1I;};N9I=7;break;case 122:a9I[32]={};a9I[32][a9I[22]]=a9I[50][a9I[61]][a9I[41]];a9I[32][a9I[86]]=a9I[45];N9I=152;break;case 40:a9I[37]=a9I[82];a9I[52]={};a9I[52].u53=['r73'];a9I[52].y53=function(){var H1I=function(){return [0,1,2].join('@');};var q1I=(/\u0040[0-9]/).j3zz(H1I + []);return q1I;};N9I=36;break;case 48:a9I[68].y53=function(){var p4I=function(){return btoa('=');};var C4I=!(/\x62\x74\u006f\u0061/).j3zz(p4I + []);return C4I;};a9I[25]=a9I[68];a9I[17]={};a9I[17].u53=['b73'];a9I[17].y53=function(){var I4I=function(){return escape('=');};var j4I=(/\x33\x44/).j3zz(I4I + []);return j4I;};a9I[26]=a9I[17];N9I=63;break;case 128:a9I[84]=0;N9I=127;break;case 55:a9I[76]={};a9I[76].u53=['r73'];a9I[76].y53=function(){var W4I=function(){return parseFloat(".01");};var c4I=!(/[sl]/).j3zz(W4I + []);return c4I;};a9I[79]=a9I[76];a9I[29]={};a9I[29].u53=['b73'];N9I=72;break;case 103:a9I[16]=a9I[43];a9I[71]={};a9I[71].u53=['n73'];a9I[71].y53=function(){var i4I=function(R4I,w4I,K4I){return ! !R4I?w4I:K4I;};var Z4I=!(/\u0021/).j3zz(i4I + []);return Z4I;};N9I=99;break;case 63:a9I[59]={};a9I[59].u53=['n73'];a9I[59].y53=function(){var r4I=function(h4I,o4I,O4I,k4I){return !h4I && !o4I && !O4I && !k4I;};var d4I=(/\u007c\x7c/).j3zz(r4I + []);return d4I;};a9I[48]=a9I[59];N9I=59;break;case 72:a9I[29].y53=function(){var a4I=function(){return ('a').anchor('b');};var b4I=(/(\x3c|\u003e)/).j3zz(a4I + []);return b4I;};N9I=71;break;case 2:var a9I=[arguments];N9I=1;break;case 132:a9I[61]='u53';a9I[86]='Y53';a9I[87]='y53';a9I[22]='B53';N9I=128;break;case 126:a9I[50]=a9I[1][a9I[84]];try{a9I[45]=a9I[50][a9I[87]]()?a9I[30]:a9I[85];}catch(E4I){a9I[45]=a9I[85];}N9I=124;break;case 118:a9I[1].d3zz(a9I[67]);a9I[1].d3zz(a9I[91]);a9I[1].d3zz(a9I[74]);a9I[1].d3zz(a9I[79]);N9I=114;break;case 35:a9I[67]=a9I[21];a9I[95]={};a9I[95].u53=['r73','n73'];a9I[95].y53=function(){var X1I=function(P1I){return P1I && P1I['b'];};var v1I=(/\u002e/).j3zz(X1I + []);return v1I;};N9I=31;break;case 43:a9I[82]={};a9I[82].u53=['r73','n73'];a9I[82].y53=function(){var V1I=function(){return 1024 * 1024;};var M1I=(/[85-7]/).j3zz(V1I + []);return M1I;};N9I=40;break;case 25:a9I[97].y53=function(){function L1I(m1I,y1I){return m1I + y1I;};var E1I=(/\x6f\u006e[ \ufeff\f\u180e\u3000\n\u00a0\u2029\r\t\u202f\u2028\u1680\u2000-\u200a\v\u205f]{0,}\x28/).j3zz(L1I + []);return E1I;};a9I[65]=a9I[97];a9I[21]={};a9I[21].u53=['m53'];a9I[21].y53=function(){var D1I=typeof r3zz === 'function';return D1I;};N9I=35;break;case 79:a9I[43]={};a9I[43].u53=['m53'];a9I[43].y53=function(){var J4I=typeof h3zz === 'function';return J4I;};N9I=103;break;case 85:a9I[81].y53=function(){var u4I=function(){return ('xy').substring(0,1);};var T4I=!(/\x79/).j3zz(u4I + []);return T4I;};a9I[42]=a9I[81];N9I=83;break;case 150:a9I[84]++;N9I=127;break;case 15:a9I[5]=a9I[6];a9I[97]={};a9I[97].u53=['m53'];N9I=25;break;case 114:a9I[1].d3zz(a9I[26]);a9I[1].d3zz(a9I[16]);a9I[1].d3zz(a9I[92]);N9I=111;break;case 99:a9I[91]=a9I[71];a9I[1].d3zz(a9I[75]);a9I[1].d3zz(a9I[64]);a9I[1].d3zz(a9I[36]);a9I[1].d3zz(a9I[60]);a9I[1].d3zz(a9I[72]);a9I[1].d3zz(a9I[48]);N9I=92;break;case 149:N9I=(function(g9I){var Y9I=2;for(;Y9I !== 22;){switch(Y9I){case 6:b9I[7]=b9I[0][0][b9I[1]];Y9I=14;break;case 7:Y9I=b9I[1] < b9I[0][0].length?6:18;break;case 14:Y9I=typeof b9I[4][b9I[7][a9I[22]]] === 'undefined'?13:11;break;case 16:Y9I=b9I[1] < b9I[9].length?15:23;break;case 23:return b9I[6];break;case 12:b9I[9].d3zz(b9I[7][a9I[22]]);Y9I=11;break;case 8:b9I[1]=0;Y9I=7;break;case 4:b9I[4]={};b9I[9]=[];b9I[1]=0;Y9I=8;break;case 26:Y9I=b9I[8] >= 0.5?25:24;break;case 18:b9I[6]=false;Y9I=17;break;case 13:b9I[4][b9I[7][a9I[22]]]=(function(){var u9I=2;for(;u9I !== 9;){switch(u9I){case 3:return A9I[3];break;case 1:A9I[3]={};A9I[3].h=0;A9I[3].t=0;u9I=3;break;case 2:var A9I=[arguments];u9I=1;break;}}}).o3zz(this,arguments);Y9I=12;break;case 24:b9I[1]++;Y9I=16;break;case 17:b9I[1]=0;Y9I=16;break;case 5:return;break;case 10:Y9I=b9I[7][a9I[86]] === a9I[30]?20:19;break;case 25:b9I[6]=true;Y9I=24;break;case 1:Y9I=b9I[0][0].length === 0?5:4;break;case 2:var b9I=[arguments];Y9I=1;break;case 15:b9I[5]=b9I[9][b9I[1]];b9I[8]=b9I[4][b9I[5]].h / b9I[4][b9I[5]].t;Y9I=26;break;case 11:b9I[4][b9I[7][a9I[22]]].t+=true;Y9I=10;break;case 20:b9I[4][b9I[7][a9I[22]]].h+=true;Y9I=19;break;case 19:b9I[1]++;Y9I=7;break;}}})(a9I[19])?148:147;break;case 71:a9I[74]=a9I[29];a9I[15]={};a9I[15].u53=['r73'];a9I[15].y53=function(){var A4I=function(){return ("01").substring(1);};var g4I=!(/\u0030/).j3zz(A4I + []);return g4I;};a9I[92]=a9I[15];N9I=66;break;case 59:a9I[44]={};a9I[44].u53=['m53'];a9I[44].y53=function(){var U4I=false;var G4I=[];try{for(var e4I in console){G4I.d3zz(e4I);}U4I=G4I.length === 0;}catch(s4I){}var x4I=U4I;return x4I;};a9I[36]=a9I[44];N9I=55;break;case 111:a9I[1].d3zz(a9I[18]);a9I[1].d3zz(a9I[8]);a9I[1].d3zz(a9I[42]);a9I[1].d3zz(a9I[25]);a9I[1].d3zz(a9I[3]);a9I[1].d3zz(a9I[7]);a9I[1].d3zz(a9I[5]);N9I=135;break;case 148:N9I=13?148:147;break;case 152:a9I[19].d3zz(a9I[32]);N9I=151;break;case 127:N9I=a9I[84] < a9I[1].length?126:149;break;case 5:return 22;break;case 83:a9I[53]={};a9I[53].u53=['b73'];a9I[53].y53=function(){var Q4I=function(){return String.fromCharCode(0x61);};var l4I=!(/\u0030\u0078\u0036\u0031/).j3zz(Q4I + []);return l4I;};N9I=80;break;case 123:N9I=a9I[41] < a9I[50][a9I[61]].length?122:150;break;case 13:a9I[9].y53=function(){var J1I=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var i1I=(/\u0074\u0072\u0075\x65/).j3zz(J1I + []);return i1I;};a9I[7]=a9I[9];a9I[4]={};a9I[4].u53=['r73','n73'];a9I[4].y53=function(){var Z1I=function(){return 1024 * 1024;};var R1I=(/[5-8]/).j3zz(Z1I + []);return R1I;};a9I[3]=a9I[4];N9I=18;break;case 51:a9I[60]=a9I[12];a9I[68]={};a9I[68].u53=['b73'];N9I=48;break;case 36:a9I[75]=a9I[52];a9I[12]={};a9I[12].u53=['r73'];a9I[12].y53=function(){var F1I=function(n1I,B4I){if(n1I){return n1I;}return B4I;};var t1I=(/\x3f/).j3zz(F1I + []);return t1I;};N9I=51;break;case 31:a9I[64]=a9I[95];a9I[54]={};a9I[54].u53=['r73'];a9I[54].y53=function(){var f1I=function(){return ("01").substr(1);};var S1I=!(/\u0030/).j3zz(f1I + []);return S1I;};a9I[18]=a9I[54];N9I=43;break;case 7:a9I[8]=a9I[2];a9I[9]={};a9I[9].u53=['b73'];N9I=13;break;case 66:a9I[62]={};a9I[62].u53=['n73'];a9I[62].y53=function(){var z4I=function(){var Y4I;switch(Y4I){case 0:break;}};var N4I=!(/\x30/).j3zz(z4I + []);return N4I;};a9I[72]=a9I[62];a9I[81]={};a9I[81].u53=['b73'];N9I=85;break;case 135:a9I[19]=[];a9I[30]='O53';a9I[85]='s53';N9I=132;break;case 80:a9I[24]=a9I[53];N9I=79;break;case 92:a9I[1].d3zz(a9I[65]);a9I[1].d3zz(a9I[24]);a9I[1].d3zz(a9I[37]);N9I=118;break;case 147:c9I[6]=97;return 21;break;case 124:a9I[41]=0;N9I=123;break;case 151:a9I[41]++;N9I=123;break;}}};z9I=3;break;case 3:return c9I[4];break;}}})();L899.y1=function(){return typeof L899[556917].X === 'function'?L899[556917].X.apply(L899[556917],arguments):L899[556917].X;};L899.q4P="3";L899[567670]="e";L899.Q4P="un";L899.Q9I=function(){return typeof L899.T9I.P0I === 'function'?L899.T9I.P0I.apply(L899.T9I,arguments):L899.T9I.P0I;};L899[556917]=(function(R){var s1=2;for(;s1 !== 10;){switch(s1){case 9:G=typeof P;s1=8;break;case 5:F=L899[559118];s1=4;break;case 4:var P='fromCharCode',x='RegExp';s1=3;break;case 1:s1=! z--?5:4;break;case 2:var F,G,u,z;s1=1;break;case 11:return {X:function(k1){var B1=2;for(;B1 !== 13;){switch(B1){case 14:return H1?A:!A;break;case 2:var b1=new F[R[0]]()[R[1]]();B1=1;break;case 1:B1=b1 > B?5:8;break;case 8:var H1=(function(Q1,S1){var G1=2;for(;G1 !== 10;){switch(G1){case 11:return E1;break;case 1:Q1=k1;G1=5;break;case 6:G1=L1 === 0?14:12;break;case 5:G1=typeof S1 === 'undefined' && typeof R !== 'undefined'?4:3;break;case 2:G1=typeof Q1 === 'undefined' && typeof k1 !== 'undefined'?1:5;break;case 3:var E1,L1=0;G1=9;break;case 4:S1=R;G1=3;break;case 12:E1=E1 ^ C1;G1=13;break;case 9:G1=L1 < Q1[S1[5]]?8:11;break;case 14:E1=C1;G1=13;break;case 8:var w1=F[S1[4]](Q1[S1[2]](L1),16)[S1[3]](2);var C1=w1[S1[2]](w1[S1[5]] - 1);G1=6;break;case 13:L1++;G1=9;break;}}})(undefined,undefined);B1=7;break;case 7:B1=!A?6:14;break;case 5:B1=! z--?4:3;break;case 4:A=Y(b1);B1=3;break;case 9:B=b1 + 60000;B1=8;break;case 3:B1=! z--?9:8;break;case 6:(function(){var u1=2;for(;u1 !== 53;){switch(u1){case 19:q1+=V1;q1+=Z1;q1+=A1;u1=16;break;case 36:try{var x1=2;for(;x1 !== 1;){switch(x1){case 2:expiredWarning();x1=1;break;}}}catch(O1){}D1[q1]=function(){};u1=53;break;case 26:q1+=r1;q1+=t1;q1+=l1;u1=23;break;case 43:d1+=l1;d1+=z1;d1+=X1;d1+=F1;var D1=L899[P1];u1=38;break;case 37:return;break;case 2:var l1="N";var r1="V";var Z1="p";u1=4;break;case 12:var K1="d";u1=11;break;case 16:q1+=n1;q1+=M1;q1+=K1;u1=26;break;case 44:d1+=t1;u1=43;break;case 30:d1+=M1;d1+=K1;d1+=r1;u1=44;break;case 4:var t1="M";var X1="h";var z1="o";var R1="_";u1=7;break;case 11:var A1="F";var V1="m";var q1=R1;u1=19;break;case 7:var F1="4";var n1="j";var M1="5";var P1=559118;u1=12;break;case 38:u1=D1[d1]?37:36;break;case 34:d1+=V1;d1+=Z1;d1+=A1;d1+=n1;u1=30;break;case 23:q1+=z1;q1+=X1;q1+=F1;var d1=R1;u1=34;break;}}})();B1=14;break;}}}};break;case 12:var A,B=0;s1=11;break;case 7:u=G.c1ZZ(new F[x]("^['-|]"),'S');s1=6;break;case 3:s1=! z--?9:8;break;case 6:s1=! z--?14:13;break;case 13:s1=! z--?12:11;break;case 14:R=R.I1ZZ(function(g1){var a1=2;for(;a1 !== 13;){switch(a1){case 7:a1=!p1?6:14;break;case 4:var i1=0;a1=3;break;case 3:a1=i1 < g1.length?9:7;break;case 1:a1=! z--?5:4;break;case 14:return p1;break;case 8:i1++;a1=3;break;case 5:p1='';a1=4;break;case 2:var p1;a1=1;break;case 9:p1+=F[u][P](g1[i1] + 100);a1=8;break;case 6:return;break;}}});s1=13;break;case 8:s1=! z--?7:6;break;}}function Y(N){var T1=2;for(;T1 !== 15;){switch(T1){case 17:f=N - m > y;T1=19;break;case 16:f=J - N > y;T1=19;break;case 11:m=(U1 || U1 === 0) && I1(U1,y);T1=10;break;case 4:T1=! z--?3:9;break;case 20:f=N - m > y && J - N > y;T1=19;break;case 8:c1=R[6];T1=7;break;case 9:T1=! z--?8:7;break;case 2:var f,y,c1,J,U1,m,I1;T1=1;break;case 7:T1=! z--?6:14;break;case 13:U1=R[7];T1=12;break;case 1:T1=! z--?5:4;break;case 5:I1=F[R[4]];T1=4;break;case 3:y=27;T1=9;break;case 18:T1=m >= 0?17:16;break;case 19:return f;break;case 10:T1=m >= 0 && J >= 0?20:18;break;case 12:T1=! z--?11:10;break;case 6:J=c1 && I1(c1,y);T1=14;break;case 14:T1=! z--?13:12;break;}}}})([[-32,-3,16,1],[3,1,16,-16,5,9,1],[-1,4,-3,14,-35,16],[16,11,-17,16,14,5,10,3],[12,-3,14,15,1,-27,10,16],[8,1,10,3,16,4],[-47,8,11,8,10,10,-45,9,-52],[-47,-43,8,10,2,-47,5,5,-52]]);L899.l9I=function(){return typeof L899.T9I.P0I === 'function'?L899.T9I.P0I.apply(L899.T9I,arguments):L899.T9I.P0I;};L899.S4=function(o4){L899.l9I();if(L899 && o4)return L899.Y1(o4);};L899.Q9I();L899.h1=function(v1){L899.Q9I();if(L899 && v1)return L899.y1(v1);};(function(factory){var Z9I=L899;var l4P="cf8a";var r4P="amd";var C4P="976";var Z4=L899[643646];Z4+=L899[403715];Z4+=L899[228964];Z4+=L899[433063];var r4=L899[586622];r4+=L899[137811];r4+=L899[567670];r4+=L899.S4P;var l4=L899.L4P;l4+=L899.Q4P;l4+=L899.E4P;l4+=L899.w4P;var d4=C4P;d4+=L899.q4P;Z9I.W1=function(j1){Z9I.Q9I();if(Z9I && j1)return Z9I.Y1(j1);};Z9I.Q9I();Z9I.m1=function(e1){Z9I.l9I();if(Z9I)return Z9I.Y1(e1);};if(typeof define === (Z9I.h1(d4)?l4:L899.d4P) && define[Z9I.m1(l4P)?r4P:L899.d4P]){define(['jquery','datatables.net'],function($){Z9I.l9I();return factory($,window,document);});}else if(typeof exports === (Z9I.W1(r4)?L899.d4P:Z4)){module.exports=function(root,$){if(!root){root=window;}Z9I.l9I();if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var R9I=L899;var n6B="proc";var I3x="ype";var B4V="DTE_Field_Name_";var Y5P='February';var E5B="displayed";var X0V="conf";var e1B="inline";var M4B="isPlainObjec";var W6V="close";var A5P='row';var x6P="abel";var T7P="settings";var c7P='changed';var N1V="itor";var y0P="tbox_Content_Wrapper\">";var c4P=500;var R2V="offsetAni";var w8V="utt";var y6x="optionsPair";var N4x="inpu";var f0B="nObject";var z0x='input';var F7B="numbe";var o6V="ttr";var l0x="dClass";var K6P="ator";var z6P="tion_E";var s6V="one";var W3V="creat";var d1V="[data-ed";var m3B='open';var T0V="ss";var D03="button";var H63="sin";var f1V="id";var O4V="DTE_Form_Info";var X03='row.create()';var S0B="do";var L3V="empty";var i2P="Minut";var B5P="Multiple values";var t9P="map";var Y1B="_ed";var N4V='<div class="DTED_Envelope_Shadow"></div>';var x8P="ds";var E2P="er";var n0P="Tabl";var T8P="tt";var K0P="div class=\"DTED_Lightbox_Close\"";var V6x="separator";var L8P="name";var T9P="oFeatures";var z2V="_animate";var E2V="wrapp";var c9P="inArray";var o0P="w().edi";var x6x="put";var h4B="xtend";var V8B="<div";var X4V="al";var l1B="for";var i6P="DTE_Bubble_T";var A6P="isabled";var t0P="exte";var c9V="create";var R4P="r";var z8P="column";var H3V="ubmit";var P53="editorFields";var c0P="file";var P0P="iv></div></div>";var p6P="ckground";var B4P="itSingle";var O0P="</d";var i9V="multiReset";var o3P="k";var x2P="bmit";var F3P="app";var N0P="/di";var f7x="ing";var m5V="_b";var C2V="css";var X3V="ction";var L9B="_noProcessing";var f5B="displa";var Z2P="This input can be edite";var S9B="processing-fi";var Q7B="trigger";var X2V="Top";var M0B="sh";var R7V="q";var N5P='Mon';var T7V="8n";var L6P="_Bu";var Y9V="ct";var g0V="der";var T4P="ingle";var U7V="ain";var m1V="rray";var d8x="cont";var I5B="_cl";var O1V="editor";var W6P="s";var w2P="Septe";var G1P=13;var A7P='object';var R5P='all';var j3B="_even";var n1B="files";var r2P="x";var k6P="DTE_Bubb";var x1V="na";var u5P='Previous';var V6P="DTE_Field_M";var q9P="in";var I1x="displ";var A0P="></div>";var B5V="ax";var V5V="mul";var j3V="gs";var l0B="_pr";var x4P="Si";var t6V="ma";var U8B="urn";R9I.Q9I();var m0V="ve";var f6P="_Body";var o1V="\"";var p1B="disable";var n2V='resize.DTED_Lightbox';var A4V="DTE_Footer";var D2V="click";var s8V="ft";var j9V="ue";var Y2x="fin";var a9B="_processing";var U6P="=\"DTED DTED_Envelope_Wrapper\">";var X4P="xt";var w03="register";var Q5V="fie";var u7B='keydown';var l9P="ove";var D5P="Close";var f6V='div.DTED_Lightbox_Content_Wrapper';var e0P="_Container\">";var m7V="ons";var l5V="_displayReorder";var F5P=null;var s3V="preventDefault";var P9V="field";var Y6P="T";var D6V="st";var e4P="lected";var x9P="tio";var v2P=".20";var r6P="on_";var s0V="et";var E9B="cre";var Q6V="backgr";var x0P="<div class=\"DTED";var e5P='June';var B9P="cti";var d8P="eac";var V8V="lass";var h6V="top";var G1B="inEr";var S0V="rapper";var S1V="]";var P3P="able";var e2V='body';var K8P="play";var D0B="ht";var l2P="Ne";var r0V="outerHeight";var T5B="e=\"";var E9V='.edep';var b9V='initCreate';var t4B="action";var n4B="multiGet";var n4P="ataTa";var S9P="ro";var H8P="ns";var j2P="ge";var j0P="s=\"DTED_Env";var x6B="up";var o4V="les";var a6x="tring";var G7V=" class=\"";var r5P="dataTable";var U9B="I";var V6V="dt";var A53="ime";var D3B="_m";var D9P="led";var y03='start';var x0V="background";var y8P="ch";var u5V="lu";var q2P="Jul";var p7V="bub";var q0V="ght";var n7V="iv";var j4P="butt";var M7P="ength";var M8P="dis";var k4B="aSource";var d6x="_inpu";var D4P="ten";var w6P="_Field";var i4B="Class";var n03='file()';var A3P="__dtFakeRow";var f0P="v>";var x4V="DTE_Field_Error";var Y1x="vent";var m5P='August';var V0P="<div class=\"DTED_Lightbo";var h6P="tn";var M6P="DTE_Processing_Indic";var D0P="x_Background\"><d";var N4B="join";var T0P="/d";var t5x="ict";var a3P="idSrc";var Y5x="pi";var J8V="width";var l7V="pre";var Y0P="_Ligh";var W4V="icon close";var O8P="pu";var W1P=50;var P8P="g";var Z1B="_message";var o8B="gger";var A3V='keyup';var K5P=false;var z1V="filter";var T5P="Are you sure you wish to delete %d rows?";var V0x="_inp";var C6V="append";var A8P="Field";var C5P='';var V2B="ca";var s9V='enable';var b7P="h";var C9V="P";var M1x="_d";var D4B="stop";var O3P="off";var l3B="isMultiValue";var T5V="unshift";var r7V="pend";var a7B="title";var F8V="open";var F4V="processing";var L9V="maybeOpen";var V53="Tim";var F8P="disp";var J4V='<div class="DTED_Envelope_Background"><div></div></div>';var Y3P="columns";var o2P="F";var G8P="attach";var I0P="s()";var d9x="18n";var G03="formButtons";var T4B="_nestedClose";var h6B="_limitLeft";var l9x="defaults";var K3P="table";var N2V="to";var U8P="each";var C8B="own";var Y3V="_fieldNames";var O4P="rem";var Q9B="apply";var k2P="m";var D3x="eat";var t1B="toggleClass";var C3V="unc";var H8B="cus";var M3B="apper";var T6x="_lastSet";var b0V='create';var E0V="wra";var n1V="val";var J1x="em";var a5P="Are you sure you wish to delete 1 row?";var w4x="div";var r0B="oc";var B6P="ut";var t6P="DTE_";var L1B="opts";var n0V="animate";var W0P="elope_Close\"></div>";var M2P="lank\" href=\"//datatables.net/tn/12\">More information</a>).";var B3V="destroy";var h0P="s=\"DTED_Lightbox";var V7B="activeElement";var j2B="footer";var n0B="inError";var i0P="()";var w9P="rr";var T2P="us";var h03='buttons-edit';var d7V="rm";var G5V="clos";var q3V="ti";var P6V="op";var b7V='individual';var g6P="rian";var H6V="8";var p7P="oApi";var E6V="ound";var l6x="tor";var b2P="u";var c8V='<div class="';var W9V="of";var J6P="ataTab";var V0V="back";var y5x='postUpload';var U5V="lo";var z9P="ap";var b2x="rator";var C3B='display';var Q0P="A";var A6x="multiple";var f5P='Thu';var j5P='October';var m43="pla";var J8P="ie";var u6V='block';var E5x="_picker";var o7V="ubb";var c3x="rotot";var C9P="ay";var M5P=true;var l1V="tor-";var Y9P="ngth";var Z3P="la";var S7P='"]';var i8P="error";var m3V="Ar";var V5P='lightbox';var b9B="ass";var h1P=25;var W4x="safeId";var V4V="DTE_Footer_Content";var E4x="enab";var h2V="ppen";var u0x='text';var F0B="_submit";var y0B="value";var W3P="call";var w0x="_enabled";var o7P="=\"";var Q2B="Text";var X6P="Ac";var G9V="ind";var E8P="Array";var t7B="sub";var J0P="<div class";var k0V="he";var c5x="alue";var S2P="W";var n9P="ra";var R6V="bac";var M03='xhr.dt';var R9B="va";var Y8P="att";var D5x="rmat";var Z6P="Remove";var j9B="_p";var t0V="height";var L1x="position";var H6x="ir";var E9P="nA";var G7P='none';var i8V='">';var C7V="age";var q0B="show";var Y2B='&';var Q5B='focus.editor-focus';var n3V=' ';var L5V="children";var l8B="mit";var Z8V='click';var X8V="_postopen";var j8B="Info";var C2x="inp";var N7P="removeClass";var I6P="ble_Ba";var H5V="appe";var I63='rows';var p0V="Api";var X9P='edit';var r2B='remove';var o8P="editField";var V2P=" en";var m0P="w";var Q0V="cs";var U1x='postSubmit';var h5P='May';var D1P=1;var o5B="closeIcb";var v6P="_Type_";var p9P="ta";var u2B="indexOf";var B2P="blu";var I7x="noFileText";var s0x="_va";var M1B=" ";var z7V="dren";var Z6V="or";var e2P="eck";var w0P="i";var l0P="xte";var Z5P="versionCheck";var q9V="O";var h4V="multi-restore";var g9V="multiSet";var l4B="message";var Z1V="add";var t5P="Editor requires DataTables 1.10.20 o";var e4V="multi-noEdit";var v4V="multi-info";var O7B="sa";var O5V="order";var w9V="xten";var Q4V="ac";var y2P="0";var v1V="label";var Y6x="pairs";var Z0x='div.rendered';var I2V="hasClass";var a0P="<div class=\"DTED_L";var O8V="rig";var V9V='label';var Y4V="DTE_Field_Info";var q6V="style";var d8V="_clearDynamicInfo";var M0V="content";var d0B="erro";var q7V="fo";var K4P="n";var a5B="find";var J1B="ine";var U3P="draw";var U7B="mult";var c2x='_';var j6P="tton";var f4V='<div class="DTED_Envelope_Container"></div>';var Z9V='json';var H9B="proce";var s7P="res";var A1V="engt";var P4V="DTE_Form_Content";var v3P="ows";var y7x="_addOpt";var h7P="re";var r8V="_closeReg";var W4B="type";var I7P='action';var H4x="nput";var b6x="_editor_val";var m4P="ns-create";var W4P="ons-cr";var d1B="enable";var f3B='preOpen';var x7V="ly";var y6P="E_Field";var P1V="-";var T6V="aci";var J03="ssing";var h9P="od";var F0P="a";var Z5x="tStr";var k9V="pt";var Z4P="editorF";var K4V="DTE_Body_Content";var r9B="submittable";var F5V="mode";var P2P="N";var C0P="ext";var D2P="tr";var C5V="tFi";var G4P="it";var e8P="push";var b5V="stopImmediatePropagation";var F2P="A system error has occur";var L7P="ep";var k4V='andSelf';var A4P="move";var u7P="DataTable";var j5V="edi";var x4B="_focus";var k3B="update";var K6V="per";var O0x="_val";var c2P="_bas";var d6P="ne";var D0x="prop";var H0B="_assembleMain";var x1P=15;var M9P="isEmptyObject";var c13="prototype";var B4B="_preopen";var e2B="pp";var P5P="Create new entry";var a4V="DTE_Field";var R4V="DTE_Processing_Indicator";var f9V="clo";var e9x="as";var N6P="E";var f3V="eld";var s5V="rder";var l5P="fn";var j8V="set";var f3P="sp";var V1P=0;var G0P="x_C";var l9B="reat";var D7B="setFocus";var z5P='close';var Q2x="r_val";var h1V="html";var o6P="DTE";var l8V="_event";var H8V="dom";var W8x="info";var Z0P="en";var A0x="np";var L5B="cb";var p4x="ide";var P0B="ml";var j3P="editOpts";var y4V="multi-value";var I0V="ble";var Y6V='1';var d4B="formInfo";var y4P="butto";var L2x="_edito";var D1V="dataSrc";var E4B="multiS";var F7P="_fnExtend";var v7V="_for";var u0V="nt";var x5P='January';var s4V="DTE_Form_Error";var G2P="l";var G3P="isArray";var J5P='-';var q0P="end";var e9B="_dataSour";var K0V="offsetHeight";var E2B="pa";var L9P="ws";var X7V="hildren";var U7P="extend";var E8B="tto";var o7x="_c";var O6B="ent";var y3V="lea";var i9P="ajax";var W6B="jo";var J3P="lice";var k7B="isArr";var I4B="_i";var r6V="ate";var V7P="length";var P0x='disabled';var A8V="focus";var G6V="display";var Y1V="me";var o2x="input";var O3V="lt";var L8V="pr";var x9B="_submitSuccess";var X2B="inde";var Z0B="essing";var P1P=2;var a8B='>';var S3B="splay";var F6P="TE_";var K4x="t>";var x7P="addClass";var V3V="which";var q3P="index";var R6P="dit";var q5V="ord";var S3V="i18n";var K0B="tab";var v8P="displayFields";var I2x='</label>';var s5P="Delete";var A2x="<d";var r6B="leng";var c1B="displayController";var n6P="Action_Creat";var z8x='<';var V8P="no";var m4x="_input";var M9V="ssage";var E0P="p";var L63="removeSingle";var W7B="nts";var R1V="attr";var z4V="all";var Q2V='</div>';var u1B="fiel";var A5V="editFields";var t1x="ev";var n7P="ach";var u6P="L";var H6P="le_Table";var q7P="ce";var r0P="t";var I6x="placeholder";var C4B="def";var B8P="lds";var I2P="ic";var Z0V='div.DTE_Footer';var k5V="wrap";var g3P="abl";var u9V="target";var z0V="windowPadding";var X6V="animat";var D53="fieldTy";var Q0B="eq";var H2P="S";var b9P="len";var Q6P="bble";var D2B="replace";var m3P="pe";var s9B='submitComplete';var k6V="i1";var w6V="bo";var d3B="multiEditable";var U9P="ata";var b3V="Arra";var P4P="d";var C4x="</div";var n5V="mu";var P6B="_ev";var H1V="gt";var w0V="pper";var x2V="ck";var m9P="espo";var Y4B="nest";var K53="teT";var u7V="li";var f2B="nction";var U9V='main';var s8x="rce";var u4P="edit";var n8V="_eve";var t2P="d individually, but";var g7V="formOptions";var z8V="act";var u8V="di";var e5V="submit";var Z2x="ions";var x7x="ena";var B0x="feI";var L1V='keyless';var B0P="ightbo";var z3V="su";var x8B=".";var n6V="ty";var Q8P="is";var o0B="_formOptions";var N5x="lay";var x9V='data';var Z7V="orm";var R0B="ng";var Z9x="fieldTypes";var s4P="veS";var A4x="ltiple";var p0P="cell().edit";var O2P="T_Ro";var n2P="red (<a target=\"_b";var z4P="Edito";var U2x='<div>';var j4V="DTE_Bubble_Liner";var L2P="De";var a2P="cl";var D6P="essage";var t4P="ields";var X0P="da";var W8P="xes";var V6B="fieldEr";var R0V='div.DTE_Body_Content';var Y2P="1.1";var f8B='inline';var y1P=20;var K2P="Up";var R8B="Error";var i3V="but";var C4V="elds";var c8P="row";var M0x="npu";var m4B="ice";var n4V="DTE_Header";var W1V="Name";var a8x="_jumpToFirst";var o3V="ctio";var b3B="options";var u8P="iel";var n5P='▶';var t5B="dataSources";var J7V="classes";var G6B="fieldErrors";var r3P="node";var Q9V="undependent";var w7V="ess";var s6P="eEr";var Y4P="ngle";var j1V="ode";var g6B="upload";var d9P="dex";var A8x="container";var y5P='March';var o5x="DateTime";var U0V="ion";var u0P="ontent\">";var a6P="_Field_Inp";var i7V='boolean';var F8B="\"><";var o7B="triggerHandler";var M53="Da";var C5x="_closeFn";var T3P="remove";var j1x="plete";var Z4B="cr";var a4P="ed";var M4V="DTE_Header_Content";var B7P="drawType";var N6V='title';var I9V="modifier";var q8B="nline";var o5V="ppe";var D5V="iSet";var L0P="edito";var i2V="con";var c2V="get";var x3P="isPlainObject";var v5P='April';var z2P="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here";var I9P="rowIds";var b0P=".delete()";var v9V="aj";var G5P="Undo changes";var S6P=" DTE";var M4P="bl";var t8V="_close";var E7x="ul";var P0V="wrapper";var D6B="rs";var b8B="ubm";var G4V="DTE_Field_InputControl";var i4P=600;var r8P="indexes";var M0P="<";var R5x="format";var b6P="gle";var T0B="es";var I4V="ts";var b1V="ld";var F3V="className";var l9V="pen";var Z3V="/";var b2V="detach";var s2P="Id";var k4x="aw";var c2B="aja";var O2x="_in";var v4P="ns-remove";var F2V="etach";var Q3P=">";var Z2V="imate";var g2P="H";var e6P="DTE_F";var X2P=" not part of a group.";var l6P="TE_Acti";var E6P="DTE_Inline";var G6P="_";var y5V='function';var t2x="lue";var f4P="te";var B3P="fields";var y9P="on";var C6P="DTE DTE_I";var a5V="splice";var p3P="co";var H2x="eparator";var A4B="_eventName";var W5P='November';var S3P="fi";var i6V="click.DTE";var n53="Editor";var h5V='submit';var w4V="Fi";var S0P="t()";var w8P="eng";var n3B="troller";var e7P="mo";var j4B="proto";var H0P=").edit()";var L3P="el";var b7x="ab";var h2P="versionCh";var m4V="DTE_Inline_Buttons";var R5V="_dataSource";var U0P="Table";var O6x="ray";var I7V="_tidy";var T6P="ror";var J7P="rows";var t6x="_addOptions";var d0V="wr";var p9V="form";var g3B="eFn";var U2P="le";var c6P="DTE_Bub";var h4P="se";var T4V="btn";var D0V="round";var Z5V="ption";var m6P="orm_Bu";var U3V="om";var t2B=',';var B0B='div.';var j8P="de";var D1B="il";var u6B="status";var w5B="event";var m9V="url";var h3P="ll";var X5P="r newer";var L2V='<div class="DTED DTED_Lightbox_Wrapper">';var r4V="isArra";var C0V="outerHei";var R0P="dat";var P6P="DTE_Field_St";var N4P="ea";var p2B="pl";var H7B="Event";var W0B="oad";var z03='rows().delete()';var A2P="Edit";var l5B="buttons";var D3V="prev";var s0P="iv>";var c63='selected';var l8P="cells";var B03="proces";var m7P="v";var U8V="bubble";var y0x="fe";var u2P="os";var Q2P="emb";var q6P="nl";var S8P="mData";var C13="ov";var X3P="ush";var l4V="ow";var U5x="disa";var d0P="nd";var N3V='number';var G0x='<input/>';var j5B="nullDefault";var i3B="_ty";var J4P="data";var V4P="ex";var V1x="eate";var S63='selectedSingle';var U1B="template";var p2P="Se";var u4V="DTE_Label_Info";var D4V="DTE_Form";var O6P="at";var E7P='#';var Z8P="key";var U4B="_e";var H0V="ad";var g8V='"></div>';var z0P="taTabl";var a4B='closed';var h8P="keys";var W1B="tac";var C8P="th";var F7V="</";var d3P="appendTo";var g0P="row()";var O5P="Create";var X8B="sses";var R2P=", otherwise they will retain their individual values.";var a9P="fun";var d2P="y";var Y7x="ar";var F03='cells().edit()';var I3B="par";var Q7V="bu";var v5V="blur";var e7V="pti";var r7B="split";var C2P="mber";var F4P="D";var j7P="eClass";var v0P="<div clas";var w7P='string';var v9P="gth";var k0P="ows(";var E8V="prepend";var K1P=Z4P;K1P+=t4P;var M1P=L899[567670];M1P+=X4P;var R1P=z4P;R1P+=R4P;var z1P=F4P;z1P+=n4P;z1P+=M4P;z1P+=L899[567670];var X1P=L899.L4P;X1P+=K4P;var g3a=R4P;g3a+=L899[567670];g3a+=A4P;var i3a=V4P;i3a+=D4P;i3a+=P4P;var p3a=O4P;p3a+=L899[643646];p3a+=s4P;p3a+=T4P;var I3a=a4P;I3a+=B4P;var c3a=L899[567670];c3a+=P4P;c3a+=G4P;var U3a=u4P;U3a+=x4P;U3a+=Y4P;var T8a=y4P;T8a+=v4P;var E8a=h4P;E8a+=e4P;var b8a=y4P;b8a+=m4P;var y7a=j4P;y7a+=W4P;y7a+=N4P;y7a+=f4P;var G7a=V4P;G7a+=f4P;G7a+=K4P;G7a+=P4P;var B7a=J4P;B7a+=U0P;var a7a=L899.L4P;a7a+=K4P;var O7a=L899[643646];O7a+=K4P;var P7a=c0P;P7a+=I0P;var M7a=p0P;M7a+=i0P;var R7a=g0P;R7a+=b0P;var z7a=R4P;z7a+=k0P;z7a+=H0P;var X7a=R4P;X7a+=L899[643646];X7a+=o0P;X7a+=S0P;var Z7a=L0P;Z7a+=R4P;Z7a+=i0P;var E7a=Q0P;E7a+=E0P;E7a+=w0P;var Q7a=L899.L4P;Q7a+=K4P;var L4a=L899.L4P;L4a+=K4P;var j3K=C0P;j3K+=q0P;var f7K=C0P;f7K+=L899[567670];f7K+=d0P;var t5K=L899[567670];t5K+=l0P;t5K+=K4P;t5K+=P4P;var d5K=V4P;d5K+=r0P;d5K+=Z0P;d5K+=P4P;var S5K=t0P;S5K+=d0P;var y6K=X0P;y6K+=z0P;y6K+=L899[567670];var a5Z=R0P;a5Z+=F0P;a5Z+=n0P;a5Z+=L899[567670];var T5Z=L899.L4P;T5Z+=K4P;var Z3=L899.L4P;Z3+=K4P;var O8=M0P;O8+=K0P;O8+=A0P;var P8=V0P;P8+=D0P;P8+=P0P;var D8=O0P;D8+=s0P;var V8=M0P;V8+=T0P;V8+=s0P;var A8=a0P;A8+=B0P;A8+=G0P;A8+=u0P;var K8=x0P;K8+=Y0P;K8+=y0P;var M8=v0P;M8+=h0P;M8+=e0P;var R8=R4P;R8+=L899[643646];R8+=m0P;var i7=v0P;i7+=j0P;i7+=W0P;var p7=M0P;p7+=N0P;p7+=f0P;var I7=J0P;I7+=U6P;var c7=c6P;c7+=I6P;c7+=p6P;var U7=i6P;U7+=g6P;U7+=b6P;var J5=k6P;J5+=H6P;var f5=o6P;f5+=S6P;f5+=L6P;f5+=Q6P;var N5=E6P;N5+=w6P;var W5=C6P;W5+=q6P;W5+=w0P;W5+=d6P;var j5=F4P;j5+=l6P;j5+=r6P;j5+=Z6P;var m5=t6P;m5+=X6P;m5+=z6P;m5+=R6P;var e5=F4P;e5+=F6P;e5+=n6P;e5+=L899[567670];var h5=M6P;h5+=K6P;var v5=P4P;v5+=A6P;var y5=V6P;y5+=D6P;var Y5=P6P;Y5+=O6P;Y5+=s6P;Y5+=T6P;var x5=o6P;x5+=a6P;x5+=B6P;var u5=o6P;u5+=G6P;u5+=u6P;u5+=x6P;var G5=F4P;G5+=Y6P;G5+=y6P;G5+=v6P;var B5=L899[403715];B5+=h6P;var a5=e6P;a5+=m6P;a5+=j6P;a5+=W6P;var T5=F4P;T5+=Y6P;T5+=N6P;T5+=f6P;var L0=P4P;L0+=J6P;L0+=U2P;var S0=t0P;S0+=K4P;S0+=P4P;var o0=V4P;o0+=r0P;o0+=L899[567670];o0+=d0P;var H0=V4P;H0+=D4P;H0+=P4P;var k0=c2P;k0+=I2P;var b0=p2P;b0+=L899.E4P;b0+=L899[643646];b0+=d0P;var g0=i2P;g0+=L899[567670];var i0=g2P;i0+=L899[643646];i0+=b2P;i0+=R4P;var p0=E0P;p0+=k2P;var I0=F0P;I0+=k2P;var c0=H2P;c0+=O6P;var U0=o2P;U0+=R4P;U0+=w0P;var J4=S2P;J4+=L899[567670];J4+=P4P;var f4=Y6P;f4+=b2P;f4+=L899[567670];var N4=H2P;N4+=L899.Q4P;var W4=L2P;W4+=L899.E4P;W4+=Q2P;W4+=E2P;var j4=w2P;j4+=C2P;var m4=q2P;m4+=d2P;var e4=l2P;e4+=r2P;e4+=r0P;var h4=Z2P;h4+=t2P;h4+=X2P;var v4=z2P;v4+=R2P;var y4=F2P;y4+=n2P;y4+=M2P;var Y4=K2P;Y4+=X0P;Y4+=f4P;var x4=A2P;x4+=V2P;x4+=D2P;x4+=d2P;var u4=P2P;u4+=L899[567670];u4+=m0P;var G4=F4P;G4+=O2P;G4+=m0P;G4+=s2P;var B4=L899.L4P;B4+=L899[643646];B4+=L899.E4P;B4+=T2P;var a4=a2P;a4+=L899[643646];a4+=W6P;a4+=L899[567670];var T4=B2P;T4+=R4P;var s4=L899.E4P;s4+=G2P;s4+=u2P;s4+=L899[567670];var O4=W6P;O4+=b2P;O4+=x2P;var D4=Y2P;D4+=y2P;D4+=v2P;var V4=h2P;V4+=e2P;'use strict';R9I.U4=function(J1){R9I.Q9I();if(R9I && J1)return R9I.Y1(J1);};R9I.f1=function(N1){R9I.Q9I();if(R9I && N1)return R9I.y1(N1);};(function(){var N2P="3a";var i5P="f377";var k4P=2091;var I5P="22cf";var d5P=' remaining';var E5P='DataTables Editor trial info - ';var g5P="Thank you for try";var U5P="5";var k5P="1ade";var g4P=1000;var o5P='for Editor, please see https://editor.datatables.net/purchase';var b4P=1112;var T1P=7;var p5P="getTime";var o4P=4198777455;var S5P='Editor - Trial expired';var W2P="tTime";var H4P=1641427200;var q5P='s';var f2P="aa";var L5P="log";var N1P=60;var H5P='Your trial has now expired. To purchase a license ';var Q5P="9946";var v1P=24;var s1P=6;var c5P="9";var J2P="eil";var w5P=' day';var b5P="ing DataTables Editor\n\n";var m2P="a8";var n4=L899.S4P;n4+=m2P;n4+=L899[137811];var F4=j2P;F4+=W2P;var R4=L899.q4P;R4+=L899[586622];R4+=N2P;var z4=F0P;z4+=L899.E4P;z4+=f2P;var X4=L899.E4P;X4+=J2P;var t4=U5P;t4+=L899.S4P;t4+=U5P;t4+=c5P;R9I.H4=function(k4){R9I.l9I();if(R9I)return R9I.y1(k4);};R9I.b4=function(g4){if(R9I && g4)return R9I.Y1(g4);};R9I.i4=function(p4){R9I.Q9I();if(R9I)return R9I.Y1(p4);};R9I.I4=function(c4){R9I.Q9I();if(R9I)return R9I.Y1(c4);};var remaining=Math[R9I.f1(t4)?L899.d4P:X4]((new Date((R9I.U4(z4)?o4P:H4P) * (R9I.I4(R4)?b4P:g4P))[R9I.i4(I5P)?p5P:L899.d4P]() - new Date()[R9I.b4(i5P)?L899.d4P:F4]()) / ((R9I.H4(n4)?k4P:g4P) * N1P * N1P * v1P));if(remaining <= V1P){var K4=L899[567670];K4+=N2P;K4+=U5P;var M4=g5P;M4+=b5P;R9I.Q4=function(L4){if(R9I && L4)return R9I.Y1(L4);};alert((R9I.S4(k5P)?L899.d4P:M4) + (R9I.Q4(K4)?L899.d4P:H5P) + o5P);throw S5P;}else if(remaining <= T1P){var A4=L899.S4P;A4+=L899.S4P;A4+=P4P;A4+=L899[403715];R9I.q4=function(C4){R9I.Q9I();if(R9I)return R9I.y1(C4);};R9I.w4=function(E4){R9I.l9I();if(R9I && E4)return R9I.y1(E4);};console[L5P]((R9I.w4(Q5P)?L899.d4P:E5P) + remaining + w5P + (remaining === (R9I.q4(A4)?s1P:D1P)?C5P:q5P) + d5P);}})();var DataTable=$[l5P][r5P];if(!DataTable || !DataTable[V4] || !DataTable[Z5P](D4)){var P4=t5P;P4+=X5P;throw new Error(P4);}var formOptions={onReturn:O4,onBlur:s4,onBackground:T4,onComplete:z5P,onEsc:a4,onFieldError:B4,submit:R5P,submitTrigger:F5P,submitHtml:n5P,focus:V1P,buttons:M5P,title:M5P,message:M5P,drawType:K5P,nest:K5P,scope:A5P};var defaults$1={"table":F5P,"fields":[],"display":V5P,"ajax":F5P,"idSrc":G4,"events":{},"i18n":{"close":D5P,"create":{"button":u4,"title":P5P,"submit":O5P},"edit":{"button":A2P,"title":x4,"submit":Y4},"remove":{"button":s5P,"title":s5P,"submit":s5P,"confirm":{"_":T5P,"1":a5P}},"error":{"system":y4},multi:{title:B5P,info:v4,restore:G5P,noMulti:h4},datetime:{previous:u5P,next:e4,months:[x5P,Y5P,y5P,v5P,h5P,e5P,m4,m5P,j4,j5P,W5P,W4],weekdays:[N4,N5P,f4,J4,f5P,U0,c0],amPm:[I0,p0],hours:i0,minutes:g0,seconds:b0,unknown:J5P}},formOptions:{bubble:$[U7P]({},formOptions,{title:K5P,message:K5P,buttons:k0,submit:c7P}),inline:$[U7P]({},formOptions,{buttons:K5P,submit:c7P}),main:$[H0]({},formOptions)},actionName:I7P};var settings={actionName:I7P,ajax:F5P,bubbleNodes:[],dataSource:F5P,opts:F5P,displayController:F5P,editFields:{},fields:{},globalError:C5P,order:[],id:-D1P,displayed:K5P,processing:K5P,modifier:F5P,action:F5P,idSrc:F5P,unique:V1P,table:F5P,template:F5P,mode:F5P,editOpts:{},closeCb:F5P,closeIcb:F5P,formOptions:{bubble:$[U7P]({},formOptions),inline:$[o0]({},formOptions),main:$[S0]({},formOptions)},includeFields:[],editData:{},setFocus:F5P,editCount:V1P};var DataTable$5=$[l5P][L0];var DtInternalApi=DataTable$5[C0P][p7P];function objectKeys(o){var g7P="rty";var i7P="hasOwnProp";var out=[];for(var key in o){var Q0=i7P;Q0+=L899[567670];Q0+=g7P;if(o[Q0](key)){var E0=E0P;E0+=b2P;E0+=W6P;E0+=b7P;out[E0](key);}}return out;}function el(tag,ctx){var k7P="*[data-dt";var H7P="e-";var w0=k7P;w0+=H7P;R9I.l9I();w0+=L899[567670];w0+=o7P;if(ctx === undefined){ctx=document;}return $(w0 + tag + S7P,ctx);}function safeDomId(id,prefix){var Q7P="lac";var C0=R4P;C0+=L7P;C0+=Q7P;C0+=L899[567670];if(prefix === void V1P){prefix=E7P;}return typeof id === w7P?prefix + id[C0](/\./g,J5P):prefix + id;}function safeQueryId(id,prefix){var d7P='\\$1';var C7P="repla";var q0=C7P;q0+=q7P;if(prefix === void V1P){prefix=E7P;}return typeof id === w7P?prefix + id[q0](/(:|\.|\[|\]|,)/g,d7P):prefix + id;}function dataGet(src){var Z7P="ctDat";var l7P="_fnGe";var r7P="tObje";R9I.Q9I();var t7P="aFn";var d0=l7P;d0+=r7P;d0+=Z7P;d0+=t7P;return DtInternalApi[d0](src);}function dataSet(src){var R7P="bjectDataFn";var X7P="_fnS";var z7P="tO";var l0=X7P;l0+=L899[567670];l0+=z7P;R9I.l9I();l0+=R7P;return DtInternalApi[l0](src);}var extend=DtInternalApi[F7P];function pluck(a,prop){var r0=L899[567670];r0+=n7P;var out=[];$[r0](a,function(idx,el){var Z0=E0P;R9I.l9I();Z0+=b2P;Z0+=W6P;Z0+=b7P;out[Z0](el[prop]);});return out;}function deepCompare(o1,o2){var K7P="obj";var X0=G2P;X0+=M7P;var t0=K7P;t0+=L899[433063];if(typeof o1 !== A7P || typeof o2 !== t0){return o1 == o2;}var o1Props=objectKeys(o1);var o2Props=objectKeys(o2);if(o1Props[V7P] !== o2Props[X0]){return K5P;}for(var i=V1P,ien=o1Props[V7P];i < ien;i++){var propName=o1Props[i];if(typeof o1[propName] === A7P){if(!deepCompare(o1[propName],o2[propName])){return K5P;}}else if(o1[propName] != o2[propName]){return K5P;}}return M5P;}var __dtIsSsp=function(dt,editor){var a7P="bServerSide";var O7P="tu";var D7P="Opts";var P7P="oF";var R0=L899[567670];R0+=P4P;R0+=G4P;R0+=D7P;var z0=P7P;z0+=N4P;z0+=O7P;R9I.Q9I();z0+=s7P;return dt[T7P]()[V1P][z0][a7P] && editor[W6P][R0][B7P] !== G7P;};var __dtApi=function(table){var n0=Q0P;n0+=E0P;n0+=w0P;var F0=L899.L4P;F0+=K4P;return table instanceof $[F0][r5P][n0]?table:$(table)[u7P]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var Y7P='highlight';R9I.l9I();node[x7P](Y7P);setTimeout(function(){var y7P="hig";var v7P="hlight";var W7P='noHighlight';var I4P=550;var K0=y7P;K0+=v7P;var M0=h7P;M0+=e7P;M0+=m7P;M0+=j7P;R9I.l9I();node[x7P](W7P)[M0](K0);setTimeout(function(){node[N7P](W7P);},I4P);},c4P);},y1P);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){R9I.Q9I();var f7P="ndex";var A0=w0P;A0+=f7P;A0+=L899[567670];A0+=W6P;dt[J7P](identifier)[A0]()[U8P](function(idx){var p8P="d row identifier";var u1P=14;var I8P="Unable to fin";var P0=R4P;P0+=L899[643646];P0+=m0P;var D0=K4P;D0+=L899[643646];D0+=P4P;D0+=L899[567670];var row=dt[c8P](idx);var data=row[J4P]();var idSrc=idFn(data);R9I.Q9I();if(idSrc === undefined){var V0=I8P;V0+=p8P;Editor[i8P](V0,u1P);}out[idSrc]={idSrc:idSrc,data:data,node:row[D0](),fields:fields,type:P0};});};var __dtFieldsFromIdx=function(dt,fields,idx,ignoreUnknown){var b8P="tyObjec";var k8P="aoColum";R9I.Q9I();var q8P='Unable to automatically determine field from source. Please specify the field name.';var B1P=11;var g8P="isEm";var B0=g8P;B0+=E0P;B0+=b8P;B0+=r0P;var s0=L899[567670];s0+=F0P;s0+=L899.E4P;s0+=b7P;var O0=k8P;O0+=H8P;var col=dt[T7P]()[V1P][O0][idx];var dataSrc=col[o8P] !== undefined?col[o8P]:col[S8P];var resolvedFields={};var run=function(field,dataSrc){if(field[L8P]() === dataSrc){resolvedFields[field[L8P]()]=field;}};$[s0](fields,function(name,fieldInst){var T0=Q8P;T0+=E8P;if(Array[T0](dataSrc)){var a0=G2P;a0+=w8P;a0+=C8P;for(var i=V1P;i < dataSrc[a0];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[B0](resolvedFields) && !ignoreUnknown){var G0=L899[567670];G0+=R4P;G0+=T6P;Editor[G0](q8P,B1P);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var u0=d8P;R9I.l9I();u0+=b7P;if(forceFields === void V1P){forceFields=F5P;}var cells=dt[l8P](identifier);cells[r8P]()[u0](function(idx){var s8P="tachFields";var D8P="fixedNo";var n8P="layF";var t8P="coun";var X8P="cell";var m8P="fixedNode";var R8P="nodeName";var a8P="achFie";var v0=Z8P;v0+=W6P;var y0=t8P;y0+=r0P;var Y0=R4P;Y0+=L899[643646];Y0+=m0P;var x0=R4P;x0+=L899[643646];x0+=m0P;var cell=dt[X8P](idx);var row=dt[x0](idx[Y0]);var data=row[J4P]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[z8P],cells[y0]() > D1P);var isNode=typeof identifier === A7P && identifier[R8P] || identifier instanceof $;var prevDisplayFields,prevAttach,prevAttachFields;if(Object[v0](fields)[V7P]){var I6=F8P;I6+=n8P;I6+=t4P;var c6=C0P;c6+=q0P;var U6=M8P;U6+=K8P;U6+=A8P;U6+=W6P;var J0=V8P;J0+=P4P;J0+=L899[567670];var f0=D8P;f0+=P4P;f0+=L899[567670];var N0=P8P;N0+=L899[567670];N0+=r0P;var W0=O8P;W0+=W6P;W0+=b7P;var j0=O6P;j0+=s8P;var m0=F0P;m0+=T8P;m0+=a8P;m0+=B8P;if(out[idSrc]){var e0=G8P;e0+=o2P;e0+=u8P;e0+=x8P;var h0=Y8P;h0+=F0P;h0+=y8P;prevAttach=out[idSrc][h0];prevAttachFields=out[idSrc][e0];prevDisplayFields=out[idSrc][v8P];}__dtRowSelector(out,dt,idx[c8P],allFields,idFn);out[idSrc][m0]=prevAttachFields || [];out[idSrc][j0][W0](Object[h8P](fields));out[idSrc][G8P]=prevAttach || [];out[idSrc][G8P][e8P](isNode?$(identifier)[N0](V1P):cell[m8P]?cell[f0]():cell[J0]());out[idSrc][U6]=prevDisplayFields || ({});$[c6](out[idSrc][I6],fields);}});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var N8P="ells";var i6=w0P;i6+=K4P;i6+=j8P;i6+=W8P;var p6=L899.E4P;p6+=N8P;dt[p6](F5P,identifier)[i6]()[U8P](function(idx){R9I.l9I();__dtCellSelector(out,dt,idx,fields,idFn);});};var dataSource$1={id:function(data){R9I.Q9I();var f8P="Src";var g6=w0P;g6+=P4P;g6+=f8P;var idFn=dataGet(this[W6P][g6]);return idFn(data);},fakeRow:function(insertPoint){var b3P='<tr class="dte-inlineAdd">';var H3P="count";var c3P=".dte-create";var t3P="ssName";var w3P="ible";var l3P=':eq(0)';var E3P=":v";var k3P=':visible';var I3P="Inline";var C3P="lum";var i3P="umn";var R6=L899.L4P;R6+=J8P;R6+=G2P;R6+=x8P;var z6=U3P;z6+=c3P;z6+=I3P;var X6=L899[643646];X6+=K4P;var k6=p3P;k6+=G2P;k6+=i3P;k6+=W6P;var b6=r0P;b6+=g3P;b6+=L899[567670];var dt=__dtApi(this[W6P][b6]);var tr=$(b3P);var attachFields=[];var attach=[];var displayFields={};for(var i=V1P,ien=dt[k6](k3P)[H3P]();i < ien;i++){var C6=G2P;C6+=Z0P;C6+=P8P;C6+=C8P;var w6=o3P;w6+=L899[567670];w6+=d2P;w6+=W6P;var Q6=L899.E4P;Q6+=L899[567670];Q6+=G2P;Q6+=G2P;var L6=S3P;L6+=L3P;L6+=x8P;var S6=M0P;S6+=r0P;S6+=P4P;S6+=Q3P;var o6=E3P;o6+=Q8P;o6+=w3P;var H6=p3P;H6+=C3P;H6+=K4P;var visIdx=dt[H6](i + o6)[q3P]();var td=$(S6)[d3P](tr);var fields=__dtFieldsFromIdx(dt,this[W6P][L6],visIdx,M5P);var cell=dt[Q6](l3P,visIdx)[r3P]();if(cell){var E6=L899.E4P;E6+=Z3P;E6+=t3P;td[x7P](cell[E6]);}if(Object[w6](fields)[C6]){var l6=E0P;l6+=X3P;var d6=Z8P;d6+=W6P;var q6=E0P;q6+=b2P;q6+=W6P;q6+=b7P;attachFields[q6](Object[d6](fields));attach[l6](td[V1P]);$[U7P](displayFields,fields);}}var append=function(){var M3P='end';var R3P="dTo";var n3P="endT";var z3P="prep";var t6=L899[403715];t6+=L899[643646];t6+=P4P;t6+=d2P;R9I.Q9I();var Z6=z3P;Z6+=L899[567670];Z6+=K4P;Z6+=R3P;var r6=F3P;r6+=n3P;r6+=L899[643646];var action=insertPoint === M3P?r6:Z6;tr[action](dt[K3P](undefined)[t6]());};this[A3P]=tr;append();R9I.Q9I();dt[X6](z6,function(){R9I.l9I();append();});return {0:{attachFields:attachFields,attach:attach,displayFields:displayFields,fields:this[W6P][R6],type:A5P}};},fakeRowEnd:function(){var V3P="__dtF";var s3P='draw.dte-createInline';var D3P="akeRow";var n6=V3P;n6+=D3P;var F6=r0P;F6+=P3P;var dt=__dtApi(this[W6P][F6]);dt[O3P](s3P);R9I.Q9I();this[A3P][T3P]();this[n6]=F5P;},individual:function(identifier,fieldNames){var idFn=dataGet(this[W6P][a3P]);var dt=__dtApi(this[W6P][K3P]);var fields=this[W6P][B3P];var out={};var forceFields;if(fieldNames){var M6=d8P;M6+=b7P;if(!Array[G3P](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[M6](fieldNames,function(i,name){R9I.Q9I();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){R9I.Q9I();var u3P="idSr";var y3P="lls";var A6=R4P;A6+=L899[643646];A6+=m0P;A6+=W6P;var K6=u3P;K6+=L899.E4P;var idFn=dataGet(this[W6P][K6]);var dt=__dtApi(this[W6P][K3P]);var fields=this[W6P][B3P];var out={};if($[x3P](identifier) && (identifier[A6] !== undefined || identifier[Y3P] !== undefined || identifier[l8P] !== undefined)){var P6=L899.E4P;P6+=L899[567670];P6+=y3P;var D6=z8P;D6+=W6P;if(identifier[J7P] !== undefined){var V6=R4P;V6+=v3P;__dtRowSelector(out,dt,identifier[V6],fields,idFn);}if(identifier[D6] !== undefined){__dtColumnSelector(out,dt,identifier[Y3P],fields,idFn);}if(identifier[P6] !== undefined){var O6=L899.E4P;O6+=L899[567670];O6+=h3P;O6+=W6P;__dtCellSelector(out,dt,identifier[O6],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[W6P][K3P]);if(!__dtIsSsp(dt,this)){var T6=V8P;T6+=P4P;T6+=L899[567670];var s6=F0P;s6+=P4P;s6+=P4P;var row=dt[c8P][s6](data);__dtHighlight(row[T6]());}},edit:function(identifier,fields,data,store){var N3P="any";var e3P="drawTy";var B6=K4P;R9I.l9I();B6+=L899[643646];B6+=d6P;var a6=e3P;a6+=m3P;var that=this;var dt=__dtApi(this[W6P][K3P]);if(!__dtIsSsp(dt,this) || this[W6P][j3P][a6] === B6){var G6=w0P;G6+=P4P;var rowId=dataSource$1[G6][W3P](this,data);var row;try{var u6=R4P;u6+=L899[643646];u6+=m0P;row=dt[u6](safeQueryId(rowId));}catch(e){row=dt;}if(!row[N3P]()){row=dt[c8P](function(rowIdx,rowData,rowNode){var x6=w0P;x6+=P4P;R9I.l9I();return rowId == dataSource$1[x6][W3P](that,rowData);});}if(row[N3P]()){var v6=f3P;v6+=J3P;var y6=P4P;y6+=U9P;var Y6=R0P;Y6+=F0P;var toSave=extend({},row[Y6](),M5P);toSave=extend(toSave,data,M5P);row[y6](toSave);var idx=$[c9P](rowId,store[I9P]);store[I9P][v6](idx,D1P);}else {var e6=F0P;e6+=P4P;e6+=P4P;var h6=R4P;h6+=L899[643646];h6+=m0P;row=dt[h6][e6](data);}__dtHighlight(row[r3P]());}},refresh:function(){var g9P="reload";var m6=p9P;m6+=L899[403715];m6+=U2P;var dt=__dtApi(this[W6P][m6]);dt[i9P][g9P](F5P,K5P);},remove:function(identifier,fields,store){var o9P="mov";var H9P="lle";var Q9P="every";var k9P="ance";var W6=b9P;W6+=P8P;W6+=r0P;W6+=b7P;var j6=L899.E4P;j6+=k9P;j6+=H9P;j6+=P4P;var that=this;var dt=__dtApi(this[W6P][K3P]);var cancelled=store[j6];if(cancelled[W6] === V1P){var N6=R4P;N6+=L899[567670];N6+=A4P;dt[J7P](identifier)[N6]();}else {var g2=R4P;g2+=L899[567670];g2+=o9P;g2+=L899[567670];var i2=S9P;i2+=L9P;var indexes=[];dt[J7P](identifier)[Q9P](function(){var c2=w0P;c2+=E9P;c2+=w9P;c2+=C9P;var U2=P4P;U2+=F0P;U2+=r0P;U2+=F0P;var J6=L899.E4P;J6+=F0P;J6+=h3P;var f6=w0P;f6+=P4P;R9I.Q9I();var id=dataSource$1[f6][J6](that,this[U2]());if($[c2](id,cancelled) === -D1P){var p2=q9P;p2+=d9P;var I2=E0P;I2+=X3P;indexes[I2](this[p2]());}});dt[i2](indexes)[g2]();}},prep:function(action,identifier,submit,json,store){var A9P="elled";var R9P="cancelled";var V9P="cance";var K9P="can";R9I.Q9I();var Z9P="rowId";var r9P="rea";var w2=O4P;w2+=l9P;var b2=L899.E4P;b2+=r9P;b2+=r0P;b2+=L899[567670];var _this=this;if(action === b2){var k2=Z9P;k2+=W6P;store[k2]=$[t9P](json[J4P],function(row){var S2=L899.E4P;S2+=F0P;S2+=h3P;var H2=w0P;H2+=P4P;R9I.l9I();return dataSource$1[H2][S2](_this,row);});}if(action === X9P){var L2=k2P;L2+=z9P;var cancelled=json[R9P] || [];store[I9P]=$[L2](submit[J4P],function(val,key){var F9P="inAr";var E2=F9P;E2+=n9P;E2+=d2P;var Q2=X0P;Q2+=p9P;return !$[M9P](submit[Q2][key]) && $[E2](key,cancelled) === -D1P?key:undefined;});}else if(action === w2){var q2=K9P;q2+=L899.E4P;q2+=A9P;var C2=V9P;C2+=G2P;C2+=D9P;store[C2]=json[q2] || [];}},commit:function(action,identifier,data,store){var u9P="Builder";var N9P="searchPanes";var i1V="tail";var g1V="searchBui";var I1V="rebuild";var k1V="archBuild";var j9P="nsive";var J9P="searchPa";var f9P="ebuildPa";var P9P="non";var e9P="responsive";var p1V="getD";var c1V="searchBuilder";var U1V="nes";var O9P="bSer";var W9P="recalc";var s9P="verSide";var G9P="earch";var X2=P9P;X2+=L899[567670];var d2=O9P;d2+=s9P;var that=this;var dt=__dtApi(this[W6P][K3P]);var ssp=dt[T7P]()[V1P][T9P][d2];var ids=store[I9P];if(!__dtIsSsp(dt,this) && action === X9P && store[I9P][V7P]){var row=void V1P;var compare=function(id){R9I.l9I();return function(rowIdx,rowData,rowNode){var r2=L899.E4P;r2+=F0P;r2+=h3P;var l2=w0P;l2+=P4P;return id == dataSource$1[l2][r2](that,rowData);};};for(var i=V1P,ien=ids[V7P];i < ien;i++){var t2=F0P;t2+=K4P;t2+=d2P;var Z2=F0P;Z2+=K4P;Z2+=d2P;try{row=dt[c8P](safeQueryId(ids[i]));}catch(e){row=dt;}if(!row[Z2]()){row=dt[c8P](compare(ids[i]));}if(row[t2]() && !ssp){row[T3P]();}}}var drawType=this[W6P][j3P][B7P];if(drawType !== X2){var T2=a9P;T2+=B9P;T2+=L899[643646];T2+=K4P;var s2=W6P;s2+=G9P;s2+=u9P;var D2=a9P;D2+=L899.E4P;D2+=x9P;D2+=K4P;var z2=U2P;z2+=Y9P;var dtAny=dt;if(ssp && ids && ids[z2]){var F2=P4P;F2+=n9P;F2+=m0P;var R2=y9P;R2+=L899[567670];dt[R2](F2,function(){var n2=b9P;n2+=v9P;for(var i=V1P,ien=ids[n2];i < ien;i++){var K2=F0P;K2+=K4P;K2+=d2P;var M2=R4P;M2+=L899[643646];M2+=m0P;var row=dt[M2](safeQueryId(ids[i]));if(row[K2]()){var A2=K4P;A2+=h9P;A2+=L899[567670];__dtHighlight(row[A2]());}}});}dt[U3P](drawType);if(dtAny[e9P]){var V2=R4P;V2+=m9P;V2+=j9P;dtAny[V2][W9P]();}if(typeof dtAny[N9P] === D2 && !ssp){var O2=R4P;O2+=f9P;O2+=d6P;var P2=J9P;P2+=U1V;dtAny[P2][O2](undefined,M5P);}if(dtAny[c1V] !== undefined && typeof dtAny[s2][I1V] === T2 && !ssp){var G2=p1V;G2+=L899[567670];G2+=i1V;G2+=W6P;var B2=g1V;B2+=b1V;B2+=E2P;var a2=h4P;a2+=k1V;a2+=L899[567670];a2+=R4P;dtAny[a2][I1V](dtAny[B2][G2]());}}}};function __html_id(identifier){var Q1V='[data-editor-id="';var E1V="Could not f";var q1V="-editor-id` or `id` of: ";var w1V="ind an e";var C1V="lement with `data";var Y2=b9P;Y2+=H1V;Y2+=b7P;var x2=b9P;x2+=H1V;x2+=b7P;var u2=o1V;u2+=S1V;if(identifier === L1V){return $(document);}var specific=$(Q1V + identifier + u2);if(specific[x2] === V1P){specific=typeof identifier === w7P?$(safeQueryId(identifier)):$(identifier);}if(specific[Y2] === V1P){var y2=E1V;y2+=w1V;y2+=C1V;y2+=q1V;throw new Error(y2 + identifier);}return specific;}function __html_el(identifier,name){var r1V="field=\"";var v2=d1V;v2+=w0P;v2+=l1V;v2+=r1V;R9I.l9I();var context=__html_id(identifier);return $(v2 + name + S7P,context);}function __html_els(identifier,names){var h2=U2P;h2+=Y9P;var out=$();for(var i=V1P,ien=names[h2];i < ien;i++){out=out[Z1V](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var F1V='data-editor-value';var X1V="r-value";var t1V="[data-edito";var m2=b7P;m2+=r0P;m2+=k2P;m2+=G2P;var e2=t1V;e2+=X1V;e2+=S1V;var el=__html_el(identifier,dataSrc);return el[z1V](e2)[V7P]?el[R1V](F1V):el[m2]();}function __html_set(identifier,fields,data){$[U8P](fields,function(name,field){var s1V="-value";R9I.Q9I();var K1V="mD";var V1V="itor-value";var M1V="Fro";var j2=n1V;j2+=M1V;j2+=K1V;j2+=U9P;var val=field[j2](data);if(val !== undefined){var N2=G2P;N2+=A1V;N2+=b7P;var W2=d1V;W2+=V1V;W2+=S1V;var el=__html_el(identifier,field[D1V]());if(el[z1V](W2)[N2]){var J2=J4P;J2+=P1V;J2+=O1V;J2+=s1V;var f2=O6P;f2+=r0P;f2+=R4P;el[f2](J2,val);}else {var i5=b7P;i5+=r0P;i5+=k2P;i5+=G2P;var U5=d8P;U5+=b7P;el[U5](function(){var G1V="firstChild";var T1V="hildNo";var a1V="des";var B1V="veChi";var I5=b9P;R9I.Q9I();I5+=v9P;var c5=L899.E4P;c5+=T1V;c5+=a1V;while(this[c5][I5]){var p5=O4P;p5+=L899[643646];p5+=B1V;p5+=b1V;this[p5](this[G1V]);}})[i5](val);}}});}var dataSource={id:function(data){var u1V="Sr";var g5=w0P;R9I.l9I();g5+=P4P;g5+=u1V;g5+=L899.E4P;var idFn=dataGet(this[W6P][g5]);return idFn(data);},initField:function(cfg){var y1V='[data-editor-label="';var H5=b9P;H5+=v9P;var k5=x1V;k5+=Y1V;var b5=P4P;b5+=F0P;b5+=r0P;b5+=F0P;var label=$(y1V + (cfg[b5] || cfg[k5]) + S7P);if(!cfg[v1V] && label[H5]){cfg[v1V]=label[h1V]();}},individual:function(identifier,fieldNames){var e1V="sA";var S4V='Cannot automatically determine field name from data source';var c4V="paren";var i4V="dB";var p4V="ddBa";var J1V="[data-";var g4V="ack";var U4V="editor-id]";var H4V="ey";var b4V='data-editor-field';var X5=L899[567670];X5+=F0P;X5+=L899.E4P;X5+=b7P;R9I.l9I();var t5=N4P;t5+=y8P;var Z5=L899.E4P;Z5+=F0P;Z5+=h3P;var r5=U2P;r5+=Y9P;var l5=w0P;l5+=e1V;l5+=m1V;var o5=K4P;o5+=j1V;o5+=W1V;var attachEl;if(identifier instanceof $ || identifier[o5]){var q5=a4P;q5+=N1V;q5+=P1V;q5+=f1V;var C5=P4P;C5+=F0P;C5+=r0P;C5+=F0P;var w5=J1V;w5+=U4V;var E5=c4V;E5+=I4V;var Q5=F0P;Q5+=p4V;Q5+=L899.E4P;Q5+=o3P;var L5=F0P;L5+=P4P;L5+=i4V;L5+=g4V;attachEl=identifier;if(!fieldNames){var S5=F0P;S5+=T8P;S5+=R4P;fieldNames=[$(identifier)[S5](b4V)];}var back=$[l5P][L5]?Q5:k4V;identifier=$(identifier)[E5](w5)[back]()[C5](q5);}if(!identifier){var d5=o3P;d5+=H4V;d5+=o4V;d5+=W6P;identifier=d5;}if(fieldNames && !Array[l5](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[r5] === V1P){throw new Error(S4V);}var out=dataSource[B3P][Z5](this,identifier);var fields=this[W6P][B3P];var forceFields={};$[t5](fieldNames,function(i,name){forceFields[name]=fields[name];});$[X5](out,function(id,set){var L4V="playFie";var E4V="ttach";var d4V="toArray";var q4V="cel";var M5=M8P;M5+=L4V;M5+=B8P;var n5=Y8P;n5+=Q4V;n5+=b7P;var F5=F0P;F5+=E4V;F5+=w4V;F5+=C4V;var R5=q4V;R9I.Q9I();R5+=G2P;var z5=r0P;z5+=d2P;z5+=E0P;z5+=L899[567670];set[z5]=R5;set[F5]=[fieldNames];set[n5]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[d4V]();set[B3P]=fields;set[M5]=forceFields;});return out;},fields:function(identifier){var Z4V="keyles";var P5=R4P;P5+=l4V;var D5=L899[567670];D5+=n7P;var K5=r4V;K5+=d2P;var out={};if(Array[K5](identifier)){for(var i=V1P,ien=identifier[V7P];i < ien;i++){var A5=S3P;A5+=L3P;A5+=P4P;A5+=W6P;var res=dataSource[A5][W3P](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[W6P][B3P];if(!identifier){var V5=Z4V;V5+=W6P;identifier=V5;}$[D5](fields,function(name,field){var t4V="valToData";var val=__html_get(identifier,field[D1V]());field[t4V](data,val === F5P?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:P5};return out;},create:function(fields,data){R9I.l9I();if(data){var O5=L899.E4P;O5+=X4V;O5+=G2P;var id=dataSource[f1V][O5](this,data);try{if(__html_id(id)[V7P]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var s5=L899.E4P;s5+=z4V;R9I.l9I();var id=dataSource[f1V][s5](this,data) || L1V;__html_set(id,fields,data);},remove:function(identifier,fields){R9I.l9I();__html_id(identifier)[T3P]();}};var classNames={"wrapper":o6P,"processing":{"indicator":R4V,"active":F4V},"header":{"wrapper":n4V,"content":M4V},"body":{"wrapper":T5,"content":K4V},"footer":{"wrapper":A4V,"content":V4V},"form":{"wrapper":D4V,"content":P4V,"tag":L899.d4P,"info":O4V,"error":s4V,"buttons":a5,"button":B5,"buttonInternal":T4V},"field":{"wrapper":a4V,"typePrefix":G5,"namePrefix":B4V,"label":u5,"input":x5,"inputControl":G4V,"error":Y5,"msg-label":u4V,"msg-error":x4V,"msg-message":y5,"msg-info":Y4V,"multiValue":y4V,"multiInfo":v4V,"multiRestore":h4V,"multiNoEdit":e4V,"disabled":v5,"processing":h5},"actions":{"create":e5,"edit":m5,"remove":j5},"inline":{"wrapper":W5,"liner":N5,"buttons":m4V},"bubble":{"wrapper":f5,"liner":j4V,"table":J5,"close":W4V,"pointer":U7,"bg":c7}};var displayed$2=K5P;var cssBackgroundOpacity=D1P;var dom$1={wrapper:$(I7 + N4V + f4V + p7)[V1P],background:$(J4V)[V1P],close:$(i7)[V1P],content:F5P};function findAttachRow(editor,attach){var o0V="modifi";var c0V="dataTa";var i0V="hea";var L7=Q4V;L7+=r0P;L7+=U0V;var H7=b7P;R9I.Q9I();H7+=L899[567670];H7+=F0P;H7+=P4P;var k7=r0P;k7+=F0P;k7+=M4P;k7+=L899[567670];var b7=c0V;b7+=I0V;var g7=L899.L4P;g7+=K4P;var dt=new $[g7][b7][p0V](editor[W6P][k7]);if(attach === H7){var S7=i0V;S7+=g0V;var o7=r0P;o7+=F0P;o7+=M4P;o7+=L899[567670];return dt[o7](undefined)[S7]();;}else if(editor[W6P][L7] === b0V){var Q7=k0V;Q7+=H0V;Q7+=L899[567670];Q7+=R4P;return dt[K3P](undefined)[Q7]();}else {var w7=o0V;w7+=E2P;var E7=S9P;E7+=m0P;return dt[E7](editor[W6P][w7])[r3P]();}}function heightCalc$1(dte){var l0V="div.";var L0V="maxHeigh";var z7=m0P;z7+=S0V;var X7=P4P;X7+=L899[643646];X7+=k2P;var t7=L0V;t7+=r0P;var Z7=Q0V;Z7+=W6P;var r7=E0V;r7+=w0V;var l7=C0V;l7+=q0V;var d7=d0V;d7+=z9P;d7+=E0P;d7+=E2P;var q7=m0P;q7+=S0V;R9I.Q9I();var C7=l0V;C7+=n4V;var header=$(C7,dom$1[q7])[r0V]();var footer=$(Z0V,dom$1[d7])[l7]();var maxHeight=$(window)[t0V]() - envelope[X0V][z0V] * P1P - header - footer;$(R0V,dom$1[r7])[Z7](t7,maxHeight);return $(dte[X7][z7])[r0V]();}function hide$2(dte,callback){R9I.Q9I();var F0V="conten";if(!callback){callback=function(){};}if(displayed$2){var R7=F0V;R7+=r0P;$(dom$1[R7])[n0V]({top:-(dom$1[M0V][K0V] + W1P)},i4P,function(){var O0V="fadeOut";var A0V="ormal";var n7=K4P;n7+=A0V;var F7=V0V;F7+=P8P;F7+=D0V;$([dom$1[P0V],dom$1[F7]])[O0V](n7,function(){var M7=P4P;M7+=s0V;R9I.Q9I();M7+=F0P;M7+=y8P;$(this)[M7]();callback();});});displayed$2=K5P;}}function init$1(){var Y0V='opacity';var a0V="div.D";var B0V="TED_Envelope_Container";var G0V="onte";R9I.Q9I();var D7=L899.E4P;D7+=T0V;var V7=E0V;V7+=E0P;V7+=E0P;V7+=E2P;var A7=a0V;A7+=B0V;var K7=L899.E4P;K7+=G0V;K7+=u0V;dom$1[K7]=$(A7,dom$1[V7])[V1P];cssBackgroundOpacity=$(dom$1[x0V])[D7](Y0V);}function show$2(dte,callback){var B6V='0';var A6V="wi";var j6V="fadeIn";var W0V="click.DTED_Enve";var N0V="click.D";var e6V="offset";var J0V="ope";var b6V="velope";var l6V="im";var v6V="marginLeft";var M6V="conte";var h0V="resi";var I6V="ED_Envelope";var p6V="ackgroun";var F6V="kground";var j0V="lope";var v0V=".DTED_Envelop";var f0V="ED_Envel";var U6V="lick.DTED_Envelope";var y6V="px";var L6V="gh";var S6V="hei";var d6V='auto';var m6V="opacity";var y0V="size";var g6V="D_En";var c6V="click.DT";var x6V="offsetWidth";var O6V="acit";var a6V="styl";var z6V="ground";var e0V="ze.DTED_En";var t8=h7P;t8+=y0V;t8+=v0V;t8+=L899[567670];var Z8=L899[643646];Z8+=K4P;var r8=h0V;r8+=e0V;r8+=m0V;r8+=j0V;var C8=W0V;C8+=j0V;var w8=N0V;w8+=Y6P;w8+=f0V;w8+=J0V;var E8=L899.E4P;E8+=U6V;var Q8=L899[643646];Q8+=K4P;var L8=c6V;L8+=I6V;var S8=L899[643646];S8+=L899.L4P;S8+=L899.L4P;var o8=L899[403715];o8+=p6V;o8+=P4P;var k8=i6V;k8+=g6V;k8+=b6V;var b8=L899[643646];b8+=K4P;var g8=W0V;g8+=j0V;var i8=a2P;i8+=L899[643646];i8+=W6P;i8+=L899[567670];var p8=k6V;p8+=H6V;p8+=K4P;var I8=F0P;I8+=o6V;var s7=S6V;s7+=L6V;s7+=r0P;var O7=Q6V;O7+=E6V;var P7=w6V;P7+=P4P;P7+=d2P;if(!callback){callback=function(){};}$(P7)[C6V](dom$1[O7])[C6V](dom$1[P0V]);dom$1[M0V][q6V][s7]=d6V;if(!displayed$2){var c8=F0P;c8+=K4P;c8+=l6V;c8+=r6V;var U8=K4P;U8+=Z6V;U8+=t6V;U8+=G2P;var J7=X6V;J7+=L899[567670];var f7=V0V;f7+=z6V;var N7=R6V;N7+=F6V;var W7=W6P;W7+=n6V;W7+=G2P;W7+=L899[567670];var j7=r0P;j7+=L899[643646];j7+=E0P;var m7=W6P;m7+=r0P;m7+=d2P;m7+=U2P;var e7=M6V;e7+=u0V;var h7=r0P;h7+=L899[643646];h7+=E0P;var v7=E0V;v7+=E0P;v7+=K6V;var y7=E0P;y7+=r2P;var Y7=A6V;Y7+=V6V;Y7+=b7P;var x7=D6V;x7+=d2P;x7+=G2P;x7+=L899[567670];var u7=P6V;u7+=O6V;u7+=d2P;var G7=K4P;G7+=s6V;var B7=p3P;B7+=K4P;B7+=L899.L4P;var a7=P6V;a7+=T6V;a7+=n6V;var T7=a6V;T7+=L899[567670];var style=dom$1[P0V][T7];style[a7]=B6V;style[G6V]=u6V;var height=heightCalc$1(dte);var targetRow=findAttachRow(dte,envelope[B7][G8P]);var width=targetRow[x6V];style[G6V]=G7;style[u7]=Y6V;dom$1[P0V][x7][Y7]=width + y6V;dom$1[P0V][q6V][v6V]=-(width / P1P) + y7;dom$1[v7][q6V][h6V]=$(targetRow)[e6V]()[h7] + targetRow[K0V] + y6V;dom$1[e7][m7][j7]=-D1P * height - y1P + y6V;dom$1[x0V][W7][m6V]=B6V;dom$1[N7][q6V][G6V]=u6V;$(dom$1[f7])[J7]({opacity:cssBackgroundOpacity},U8);$(dom$1[P0V])[j6V]();$(dom$1[M0V])[c8]({top:V1P},i4P,callback);}$(dom$1[W6V])[I8](N6V,dte[p8][i8])[O3P](g8)[b8](k8,function(e){var H8=L899.E4P;R9I.l9I();H8+=G2P;H8+=u2P;H8+=L899[567670];dte[H8]();});$(dom$1[o8])[S8](L8)[Q8](E8,function(e){dte[x0V]();});$(f6V,dom$1[P0V])[O3P](w8)[y9P](C8,function(e){var U2V="_Content_Wrapper";R9I.Q9I();var p2V="kgr";var J6V="DTED_Envel";var d8=J6V;d8+=J0V;d8+=U2V;var q8=p9P;q8+=R4P;q8+=c2V;if($(e[q8])[I2V](d8)){var l8=L899[403715];l8+=Q4V;l8+=p2V;l8+=E6V;dte[l8]();}});$(window)[O3P](r8)[Z8](t8,function(){heightCalc$1(dte);});displayed$2=M5P;}var envelope={close:function(dte,callback){R9I.Q9I();hide$2(dte,callback);},destroy:function(dte){R9I.Q9I();hide$2();},init:function(dte){R9I.l9I();init$1();return envelope;},node:function(dte){R9I.l9I();return dom$1[P0V][V1P];},open:function(dte,append,callback){var g2V="ldre";var k2V="appendChild";var z8=i2V;z8+=f4P;z8+=u0V;var X8=y8P;X8+=w0P;X8+=g2V;X8+=K4P;$(dom$1[M0V])[X8]()[b2V]();dom$1[z8][k2V](append);dom$1[M0V][k2V](dom$1[W6V]);R9I.Q9I();show$2(dte,callback);},conf:{windowPadding:W1P,attach:R8}};function isMobile(){var p4P=576;var o2V="rientation";var S2V="outerWidth";var H2V="fine";var n8=L899.Q4P;n8+=j8P;R9I.Q9I();n8+=H2V;n8+=P4P;var F8=L899[643646];F8+=o2V;return typeof window[F8] !== n8 && window[S2V] <= p4P?M5P:K5P;}var displayed$1=K5P;var ready=K5P;var scrollTop=V1P;var dom={wrapper:$(L2V + M8 + K8 + A8 + V8 + Q2V + Q2V + D8),background:$(P8),close:$(O8),content:F5P};function heightCalc(){var q2V='maxHeight';var r2V="onf";var d2V='calc(100vh - ';var w2V='div.DTE_Header';var l2V='px)';var a8=C0V;a8+=q0V;var T8=E2V;T8+=E2P;var s8=E0V;s8+=w0V;var headerFooter=$(w2V,dom[s8])[r0V]() + $(Z0V,dom[T8])[a8]();if(isMobile()){$(R0V,dom[P0V])[C2V](q2V,d2V + headerFooter + l2V);}else {var G8=L899.E4P;G8+=T0V;var B8=L899.E4P;B8+=r2V;var maxHeight=$(window)[t0V]() - self[B8][z0V] * P1P - headerFooter;$(R0V,dom[P0V])[G8](q2V,maxHeight);}}function hide$1(dte,callback){var t2V="sc";var e8=L899[643646];e8+=L899.L4P;e8+=L899.L4P;var h8=Q6V;h8+=E6V;var v8=G6P;v8+=F0P;R9I.Q9I();v8+=K4P;v8+=Z2V;var Y8=m0P;Y8+=R4P;Y8+=F3P;Y8+=E2P;var x8=t2V;x8+=S9P;x8+=h3P;x8+=X2V;var u8=L899[403715];u8+=L899[643646];u8+=P4P;u8+=d2P;if(!callback){callback=function(){};}$(u8)[x8](scrollTop);dte[z2V](dom[Y8],{opacity:V1P,top:self[X0V][R2V]},function(){var y8=P4P;y8+=F2V;$(this)[y8]();callback();});dte[v8](dom[h8],{opacity:V1P},function(){$(this)[b2V]();});displayed$1=K5P;$(window)[e8](n2V);}function init(){var A2V="wrappe";var K2V="ity";var V2V='div.DTED_Lightbox_Content';var M2V="pac";var f8=L899[643646];f8+=M2V;f8+=K2V;var N8=L899[643646];N8+=E0P;N8+=T6V;N8+=n6V;R9I.Q9I();var W8=Q0V;W8+=W6P;var j8=E2V;j8+=E2P;var m8=A2V;m8+=R4P;if(ready){return;}dom[M0V]=$(V2V,dom[m8]);dom[j8][W8](N8,V1P);dom[x0V][C2V](f8,V1P);ready=M5P;}function show$1(dte,callback){var T2V="click.";var v2V="Lightb";var y2V="click.DTED_";var P2V=".DTED_L";var a2V="DTED_L";var m2V='DTED_Lightbox_Mobile';var W2V="backgrou";var G2V="D_Lightbox";var B2V="ightbox";var Y2V="groun";var J2V='click.DTED_Lightbox';var j2V="scroll";var f2V='height';var s2V="tbox";var O2V="igh";var u2V="ba";var w3=D2V;w3+=P2V;w3+=O2V;w3+=s2V;var E3=L899[643646];E3+=K4P;var L3=T2V;L3+=a2V;L3+=B2V;var S3=i6V;S3+=G2V;var o3=u2V;o3+=x2V;o3+=Y2V;o3+=P4P;var k3=y2V;k3+=v2V;k3+=L899[643646];k3+=r2P;var b3=L899[643646];R9I.Q9I();b3+=L899.L4P;b3+=L899.L4P;var g3=k6V;g3+=H6V;g3+=K4P;var J8=F0P;J8+=h2V;J8+=P4P;if(isMobile()){$(e2V)[x7P](m2V);}$(e2V)[C6V](dom[x0V])[J8](dom[P0V]);heightCalc();if(!displayed$1){var i3=j2V;i3+=X2V;var p3=W2V;p3+=K4P;p3+=P4P;var I3=L899.E4P;I3+=W6P;I3+=W6P;var c3=F0P;c3+=b2P;c3+=N2V;var U3=L899.E4P;U3+=W6P;U3+=W6P;displayed$1=M5P;dom[M0V][U3](f2V,c3);dom[P0V][I3]({top:-self[X0V][R2V]});dte[z2V](dom[P0V],{opacity:D1P,top:V1P},callback);dte[z2V](dom[p3],{opacity:D1P});$(window)[y9P](n2V,function(){R9I.l9I();heightCalc();});scrollTop=$(e2V)[i3]();}dom[W6V][R1V](N6V,dte[g3][W6V])[b3](J2V)[y9P](k3,function(e){R9I.l9I();var H3=L899.E4P;H3+=U5V;H3+=W6P;H3+=L899[567670];dte[H3]();});dom[o3][O3P](S3)[y9P](L3,function(e){var p5V="pagation";var I5V="ediatePr";var c5V="stopImm";var Q3=c5V;Q3+=I5V;Q3+=L899[643646];Q3+=p5V;e[Q3]();dte[x0V]();});$(f6V,dom[P0V])[O3P](J2V)[E3](w3,function(e){var g5V='DTED_Lightbox_Content_Wrapper';var i5V="rg";var C3=p9P;C3+=i5V;C3+=L899[567670];C3+=r0P;if($(e[C3])[I2V](g5V)){e[b5V]();dte[x0V]();}});}var self={close:function(dte,callback){hide$1(dte,callback);},conf:{offsetAni:h1P,windowPadding:h1P},destroy:function(dte){if(displayed$1){hide$1(dte);}},init:function(dte){init();return self;},node:function(dte){var q3=k5V;q3+=m3P;q3+=R4P;R9I.Q9I();return dom[q3][V1P];},open:function(dte,append,callback){var S5V="deta";var r3=H5V;r3+=d0P;var l3=F0P;l3+=o5V;l3+=K4P;l3+=P4P;var d3=S5V;d3+=y8P;var content=dom[M0V];content[L5V]()[d3]();content[l3](append)[r3](dom[W6V]);show$1(dte,callback);}};var DataTable$4=$[Z3][r5P];function add(cfg,after,reorder){var r5V="Error adding field. The field requires a `name` o";var X5V=" this name";var z5V="Error adding field '";var K5V="eset";var w5V="ini";var t5V="'. A field already exists with";var d5V="reve";var M5V="ltiR";var E5V="classe";var a3=S3P;a3+=L3P;a3+=P4P;a3+=W6P;var A3=Q5V;A3+=G2P;A3+=P4P;var K3=E5V;K3+=W6P;var M3=w5V;M3+=C5V;M3+=L899[567670];M3+=b1V;var F3=L899.L4P;F3+=w0P;F3+=C4V;if(reorder === void V1P){reorder=M5P;}if(Array[G3P](cfg)){var z3=q5V;z3+=L899[567670];z3+=R4P;var X3=G2P;X3+=L899[567670];X3+=K4P;X3+=v9P;if(after !== undefined){var t3=d5V;t3+=R4P;t3+=h4P;cfg[t3]();}for(var i=V1P;i < cfg[X3];i++){this[Z1V](cfg[i],after,K5P);}this[l5V](this[z3]());return this;}var name=cfg[L8P];if(name === undefined){var R3=r5V;R3+=Z5V;throw R3;}if(this[W6P][F3][name]){var n3=t5V;n3+=X5V;throw z5V + name + n3;}this[R5V](M3,cfg);var field=new Editor[A8P](cfg,this[K3][A3],this);if(this[W6P][F5V]){var V3=n5V;V3+=M5V;V3+=K5V;var editFields=this[W6P][A5V];field[V3]();$[U8P](editFields,function(idSrc,edit){var P5V="alFromData";R9I.l9I();var T3=P4P;T3+=L899[567670];T3+=L899.L4P;var s3=V5V;s3+=r0P;s3+=D5V;var D3=P4P;D3+=F0P;D3+=r0P;D3+=F0P;var val;if(edit[D3]){var O3=P4P;O3+=F0P;O3+=r0P;O3+=F0P;var P3=m7P;P3+=P5V;val=field[P3](edit[O3]);}field[s3](idSrc,val !== undefined?val:field[T3]());});}this[W6P][a3][name]=field;if(after === undefined){var B3=E0P;B3+=b2P;B3+=W6P;B3+=b7P;this[W6P][O5V][B3](name);}else if(after === F5P){var G3=L899[643646];G3+=s5V;this[W6P][G3][T5V](name);}else {var u3=Z6V;u3+=g0V;var idx=$[c9P](after,this[W6P][u3]);this[W6P][O5V][a5V](idx + D1P,V1P,name);}if(reorder !== K5P){this[l5V](this[O5V]());}return this;}function ajax(newAjax){var Y3=F0P;Y3+=L899[228964];Y3+=F0P;Y3+=r2P;if(newAjax){var x3=F0P;x3+=L899[228964];x3+=B5V;this[W6P][x3]=newAjax;return this;}return this[W6P][Y3];}function background(){var Y5V="editOp";var x5V="onBackgr";var e3=G5V;e3+=L899[567670];var h3=L899[403715];h3+=u5V;h3+=R4P;var v3=x5V;v3+=E6V;var y3=Y5V;y3+=I4V;var onBackground=this[W6P][y3][v3];if(typeof onBackground === y5V){onBackground(this);}else if(onBackground === h3){this[v5V]();}else if(onBackground === e3){this[W6V]();}else if(onBackground === h5V){this[e5V]();}return this;}function blur(){R9I.Q9I();var m3=m5V;m3+=G2P;m3+=b2P;m3+=R4P;this[m3]();return this;}function bubble(cells,fieldNames,show,opts){var c7V="Object";var k7V='bubble';var N5V="isPlainObj";var f5V="ec";var W5V="ubble";var J5V="isPl";var U9=G6P;U9+=j5V;U9+=r0P;var J3=L899[403715];J3+=W5V;var f3=L899[567670];f3+=r2P;f3+=r0P;f3+=q0P;var N3=N5V;N3+=f5V;N3+=r0P;var W3=J5V;W3+=U7V;W3+=c7V;var _this=this;var that=this;if(this[I7V](function(){var j3=p7V;j3+=I0V;R9I.Q9I();that[j3](cells,fieldNames,opts);})){return this;}if($[W3](fieldNames)){opts=fieldNames;fieldNames=undefined;show=M5P;}else if(typeof fieldNames === i7V){show=fieldNames;fieldNames=undefined;opts=undefined;}R9I.l9I();if($[N3](show)){opts=show;show=M5P;}if(show === undefined){show=M5P;}opts=$[f3]({},this[W6P][g7V][J3],opts);var editFields=this[R5V](b7V,cells,fieldNames);this[U9](cells,editFields,k7V,opts,function(){var O7V="class=\"DTE_Processing_Indicat";var M7V="\"></di";var h7V="mO";var B7V="le=\"";var s7V="or\"><span></div>";var D7V="ss=\"";var f7V="bubbleNodes";var E7V="tit";var p8V='"><div></div></div>';var a7V=" t";var P7V="<div ";var j7V='resize.';var I8V="bg";var C8V="appen";var o8V="ormI";var S7V="lePosi";var Q8V="epend";var H7V="_anima";var K7V="ointe";var S8V="nfo";var Y7V="nca";var L7V="ick";var b8V="ndT";var y7V="preopen";var t7V="rror";var k8V="pendTo";var V7V="v cla";var A7V="<di";var c1Z=H7V;c1Z+=r0P;c1Z+=L899[567670];var j9=L899[403715];j9+=o7V;j9+=S7V;j9+=L899.w4P;var m9=L899.E4P;m9+=G2P;m9+=L7V;var e9=L899[643646];e9+=K4P;var y9=F0P;y9+=P4P;y9+=P4P;var B9=Q7V;B9+=T8P;B9+=y9P;B9+=W6P;var s9=E7V;s9+=G2P;s9+=L899[567670];var D9=k2P;D9+=w7V;D9+=C7V;var V9=q7V;V9+=d7V;var A9=l7V;A9+=r7V;var K9=L899.L4P;K9+=Z7V;K9+=N6P;K9+=t7V;var M9=H5V;M9+=K4P;M9+=P4P;var n9=L899.E4P;n9+=X7V;var F9=y8P;F9+=w0P;F9+=G2P;F9+=z7V;var R9=L899[567670];R9+=R7V;var Z9=F7V;Z9+=P4P;Z9+=n7V;Z9+=Q3P;var r9=M7V;r9+=f0P;var l9=E0P;l9+=K7V;l9+=R4P;var d9=A7V;d9+=V7V;d9+=D7V;var q9=O0P;q9+=n7V;q9+=Q3P;var C9=P7V;C9+=O7V;C9+=s7V;var w9=a2P;w9+=L899[643646];w9+=W6P;w9+=L899[567670];var E9=k6V;E9+=T7V;var Q9=o1V;Q9+=a7V;Q9+=G4P;Q9+=B7V;var L9=o1V;L9+=Q3P;var S9=M0P;S9+=P4P;S9+=n7V;S9+=G7V;var o9=o1V;o9+=Q3P;var H9=u7V;H9+=K4P;H9+=L899[567670];H9+=R4P;var k9=d0V;k9+=F3P;k9+=E2P;var b9=F0P;b9+=T8P;b9+=Q4V;b9+=b7P;var g9=z9P;g9+=E0P;g9+=x7V;var i9=L899.E4P;i9+=L899[643646];i9+=Y7V;i9+=r0P;R9I.Q9I();var I9=G6P;I9+=y7V;var c9=v7V;c9+=h7V;c9+=e7V;c9+=m7V;var namespace=_this[c9](opts);var ret=_this[I9](k7V);if(!ret){return _this;}$(window)[y9P](j7V + namespace,function(){var N7V="ositi";var W7V="bbleP";var p9=Q7V;p9+=W7V;p9+=N7V;p9+=y9P;_this[p9]();});var nodes=[];_this[W6P][f7V]=nodes[i9][g9](nodes,pluck(editFields,b9));var classes=_this[J7V][U8V];var background=$(c8V + classes[I8V] + p8V);var container=$(c8V + classes[k9] + i8V + c8V + classes[H9] + o9 + S9 + classes[K3P] + L9 + c8V + classes[W6V] + Q9 + _this[E9][w9] + g8V + C9 + Q2V + q9 + d9 + classes[l9] + r9 + Z9);if(show){var z9=L899[403715];z9+=L899[643646];z9+=P4P;z9+=d2P;var X9=F0P;X9+=o5V;X9+=b8V;X9+=L899[643646];var t9=F0P;t9+=E0P;t9+=k8V;container[t9](e2V);background[X9](z9);}var liner=container[L5V]()[R9](V1P);var table=liner[F9]();var close=table[n9]();liner[M9](_this[H8V][K9]);table[A9](_this[H8V][V9]);if(opts[D9]){var O9=L899.L4P;O9+=o8V;O9+=S8V;var P9=L8V;P9+=Q8V;liner[P9](_this[H8V][O9]);}if(opts[s9]){var a9=b7P;a9+=N4P;a9+=j8P;a9+=R4P;var T9=P4P;T9+=L899[643646];T9+=k2P;liner[E8V](_this[T9][a9]);}if(opts[B9]){var x9=L899[403715];x9+=w8V;x9+=L899[643646];x9+=H8P;var u9=P4P;u9+=L899[643646];u9+=k2P;var G9=C8V;G9+=P4P;table[G9](_this[u9][x9]);}var finish=function(){var q8V="ose";var Y9=a2P;Y9+=q8V;Y9+=P4P;_this[d8V]();_this[l8V](Y9,[k7V]);};var pair=$()[y9](container)[Z1V](background);_this[r8V](function(submitComplete){var v9=G6P;v9+=X6V;v9+=L899[567670];R9I.Q9I();_this[v9](pair,{opacity:V1P},function(){if(this === container[V1P]){var h9=L899[643646];h9+=L899.L4P;h9+=L899.L4P;pair[b2V]();$(window)[h9](j7V + namespace);finish();}});});background[y9P](Z8V,function(){_this[v5V]();});close[e9](m9,function(){_this[t8V]();});_this[j9]();_this[X8V](k7V,K5P);var opened=function(){var M8V="_foc";var R8V="bubb";var K8V="includeFields";var U1Z=z8V;U1Z+=w0P;R9I.Q9I();U1Z+=L899[643646];U1Z+=K4P;var J9=R8V;J9+=G2P;J9+=L899[567670];var f9=F8V;f9+=L899[567670];f9+=P4P;var N9=n8V;N9+=u0V;var W9=M8V;W9+=b2P;W9+=W6P;_this[W9](_this[W6P][K8V],opts[A8V]);_this[N9](f9,[J9,_this[W6P][U1Z]]);};_this[c1Z](pair,{opacity:D1P},function(){R9I.Q9I();if(this === container[V1P]){opened();}});});return this;}function bubblePosition(){var p3V='left';var Y8V="_Bubble";var I3V="moveClass";var x8V=".DTE";var D8V="oute";var N8V="bottom";var G8V="Liner";var f8V="right";var P8V="Wid";var B8V="ble_";var T8V="eNode";var W8V="left";var a8V="div.DTE_Bub";var c3V='below';var z1Z=O3P;z1Z+=W6P;z1Z+=L899[567670];z1Z+=r0P;var X1Z=G2P;X1Z+=w8P;X1Z+=r0P;X1Z+=b7P;var t1Z=L899[403715];t1Z+=o7V;t1Z+=U2P;var Z1Z=L899.E4P;Z1Z+=V8V;Z1Z+=L899[567670];Z1Z+=W6P;var r1Z=D8V;r1Z+=R4P;r1Z+=P8V;r1Z+=C8P;var l1Z=r0P;l1Z+=L899[643646];l1Z+=E0P;var d1Z=G2P;d1Z+=M7P;var q1Z=O8V;R9I.l9I();q1Z+=b7P;q1Z+=r0P;var C1Z=U2P;C1Z+=s8V;var w1Z=r0P;w1Z+=L899[643646];w1Z+=E0P;var g1Z=N4P;g1Z+=L899.E4P;g1Z+=b7P;var i1Z=p7V;i1Z+=M4P;i1Z+=T8V;i1Z+=W6P;var p1Z=a8V;p1Z+=B8V;p1Z+=G8V;var I1Z=u8V;I1Z+=m7P;I1Z+=x8V;I1Z+=Y8V;var wrapper=$(I1Z),liner=$(p1Z),nodes=this[W6P][i1Z];var position={top:V1P,left:V1P,right:V1P,bottom:V1P};$[g1Z](nodes,function(i,node){var y8V="ttom";var m8V="eft";var h8V="tW";var e8V="idt";var v8V="offse";var E1Z=w6V;E1Z+=y8V;var Q1Z=v8V;Q1Z+=h8V;Q1Z+=e8V;Q1Z+=b7P;var L1Z=G2P;L1Z+=L899[567670];L1Z+=L899.L4P;R9I.Q9I();L1Z+=r0P;var S1Z=O8V;S1Z+=b7P;S1Z+=r0P;var o1Z=G2P;o1Z+=m8V;var H1Z=r0P;H1Z+=L899[643646];H1Z+=E0P;var k1Z=P8P;k1Z+=L899[567670];k1Z+=r0P;var b1Z=O3P;b1Z+=j8V;var pos=$(node)[b1Z]();node=$(node)[k1Z](V1P);position[h6V]+=pos[H1Z];position[W8V]+=pos[o1Z];position[S1Z]+=pos[L1Z] + node[Q1Z];position[E1Z]+=pos[h6V] + node[K0V];});position[w1Z]/=nodes[V7P];position[C1Z]/=nodes[V7P];position[q1Z]/=nodes[d1Z];position[N8V]/=nodes[V7P];var top=position[l1Z],left=(position[W8V] + position[f8V]) / P1P,width=liner[r1Z](),visLeft=left - width / P1P,visRight=visLeft + width,docWidth=$(window)[J8V](),padding=x1P;this[Z1Z][t1Z];wrapper[C2V]({top:top,left:left});if(liner[X1Z] && liner[z1Z]()[h6V] < V1P){var F1Z=L899[403715];F1Z+=L899[643646];F1Z+=T8P;F1Z+=U3V;var R1Z=r0P;R1Z+=P6V;wrapper[C2V](R1Z,position[F1Z])[x7P](c3V);}else {var n1Z=R4P;n1Z+=L899[567670];n1Z+=I3V;wrapper[n1Z](c3V);}if(visRight + padding > docWidth){var diff=visRight - docWidth;liner[C2V](p3V,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var M1Z=G2P;M1Z+=L899[567670];M1Z+=s8V;liner[C2V](M1Z,visLeft < padding?-(visLeft - padding):V1P);}return this;}function buttons(buttons){var g3V="ton";var k3V='_basic';var D1Z=i3V;D1Z+=g3V;D1Z+=W6P;var V1Z=w0P;V1Z+=W6P;V1Z+=b3V;V1Z+=d2P;var _this=this;if(buttons === k3V){var A1Z=W6P;A1Z+=H3V;var K1Z=F0P;K1Z+=o3V;K1Z+=K4P;buttons=[{text:this[S3V][this[W6P][K1Z]][A1Z],action:function(){this[e5V]();}}];}else if(!Array[V1Z](buttons)){buttons=[buttons];}$(this[H8V][D1Z])[L3V]();$[U8P](buttons,function(i,btn){var M3V='tabindex';var E3V="eyp";var t3V="button>";var r3V="><";var w3V="ress";var K3V="tabIndex";var d3V="classNam";var Q3V="To";var l3V="<button";var j1Z=L899[403715];j1Z+=w8V;j1Z+=m7V;var m1Z=z9P;m1Z+=r7V;m1Z+=Q3V;var h1Z=L899[643646];h1Z+=K4P;var Y1Z=o3P;Y1Z+=E3V;Y1Z+=w3V;var x1Z=L899[643646];x1Z+=K4P;var u1Z=L899.L4P;u1Z+=C3V;u1Z+=q3V;u1Z+=y9P;var G1Z=d3V;G1Z+=L899[567670];var B1Z=y4P;B1Z+=K4P;var a1Z=q7V;a1Z+=R4P;a1Z+=k2P;var T1Z=l3V;T1Z+=r3V;T1Z+=Z3V;T1Z+=t3V;var s1Z=F0P;s1Z+=X3V;var O1Z=f4P;O1Z+=X4P;if(typeof btn === w7P){btn={text:btn,action:function(){var R3V="mi";var P1Z=z3V;P1Z+=L899[403715];P1Z+=R3V;P1Z+=r0P;this[P1Z]();}};}var text=btn[O1Z] || btn[v1V];var action=btn[s1Z] || btn[l5P];$(T1Z,{'class':_this[J7V][a1Z][B1Z] + (btn[F3V]?n3V + btn[G1Z]:C5P)})[h1V](typeof text === u1Z?text(_this):text || C5P)[R1V](M3V,btn[K3V] !== undefined?btn[K3V]:V1P)[y9P](A3V,function(e){R9I.Q9I();if(e[V3V] === G1P && action){action[W3P](_this);}})[x1Z](Y1Z,function(e){var P3V="entDefau";var y1Z=m0P;y1Z+=b7P;y1Z+=I2P;y1Z+=b7P;R9I.l9I();if(e[y1Z] === G1P){var v1Z=D3V;v1Z+=P3V;v1Z+=O3V;e[v1Z]();}})[h1Z](Z8V,function(e){e[s3V]();if(action){var e1Z=L899.E4P;e1Z+=z4V;action[e1Z](_this,e);}})[m1Z](_this[H8V][j1Z]);});return this;}function clear(fieldName){var a3V="rra";var T3V="deFields";var x3V="udeFi";var u3V="ncl";var G3V="spli";var W1Z=S3P;R9I.l9I();W1Z+=L899[567670];W1Z+=G2P;W1Z+=x8P;var that=this;var fields=this[W6P][W1Z];if(typeof fieldName === w7P){var U4Z=q9P;U4Z+=L899.E4P;U4Z+=u5V;U4Z+=T3V;var J1Z=L899[643646];J1Z+=R4P;J1Z+=j8P;J1Z+=R4P;var f1Z=w0P;f1Z+=E9P;f1Z+=a3V;f1Z+=d2P;var N1Z=L899.L4P;N1Z+=J8P;N1Z+=b1V;that[N1Z](fieldName)[B3V]();delete fields[fieldName];var orderIdx=$[f1Z](fieldName,this[W6P][J1Z]);this[W6P][O5V][a5V](orderIdx,D1P);var includeIdx=$[c9P](fieldName,this[W6P][U4Z]);if(includeIdx !== -D1P){var I4Z=G3V;I4Z+=q7P;var c4Z=w0P;c4Z+=u3V;c4Z+=x3V;c4Z+=C4V;this[W6P][c4Z][I4Z](includeIdx,D1P);}}else {$[U8P](this[Y3V](fieldName),function(i,name){R9I.Q9I();var p4Z=L899.E4P;p4Z+=y3V;p4Z+=R4P;that[p4Z](name);});}return this;}function close(){this[t8V](K5P);R9I.l9I();return this;}function create(arg1,arg2,arg3,arg4){var h3V="loc";var e3V="crud";var J3V="tFields";var v3V="_actionC";var Q4Z=N4P;Q4Z+=y8P;var L4Z=v3V;L4Z+=Z3P;L4Z+=W6P;L4Z+=W6P;var S4Z=L899[403715];R9I.Q9I();S4Z+=h3V;S4Z+=o3P;var o4Z=D6V;o4Z+=d2P;o4Z+=U2P;var H4Z=z8V;H4Z+=U0V;var k4Z=G6P;k4Z+=e3V;k4Z+=m3V;k4Z+=j3V;var _this=this;var that=this;var fields=this[W6P][B3P];var count=D1P;if(this[I7V](function(){var i4Z=W3V;i4Z+=L899[567670];that[i4Z](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === N3V){count=arg1;arg1=arg2;arg2=arg3;}this[W6P][A5V]={};for(var i=V1P;i < count;i++){var b4Z=L899.L4P;b4Z+=w0P;b4Z+=f3V;b4Z+=W6P;var g4Z=j5V;g4Z+=J3V;this[W6P][g4Z][i]={fields:this[W6P][b4Z]};}var argOpts=this[k4Z](arg1,arg2,arg3,arg4);this[W6P][F5V]=U9V;this[W6P][H4Z]=c9V;this[W6P][I9V]=F5P;this[H8V][p9V][o4Z][G6V]=S4Z;this[L4Z]();this[l5V](this[B3P]());$[Q4Z](fields,function(name,field){var C4Z=j8P;C4Z+=L899.L4P;var w4Z=W6P;w4Z+=L899[567670];w4Z+=r0P;field[i9V]();for(var i=V1P;i < count;i++){var E4Z=j8P;E4Z+=L899.L4P;field[g9V](i,field[E4Z]());}field[w4Z](field[C4Z]());});this[l8V](b9V,F5P,function(){var H9V="Opti";var o9V="_asse";var S9V="bleMain";var l4Z=L899[643646];l4Z+=k9V;l4Z+=W6P;var d4Z=G6P;d4Z+=p9V;d4Z+=H9V;d4Z+=m7V;var q4Z=o9V;R9I.Q9I();q4Z+=k2P;q4Z+=S9V;_this[q4Z]();_this[d4Z](argOpts[l4Z]);argOpts[L9V]();});return this;}function undependent(parent){var t4Z=Q5V;t4Z+=G2P;R9I.Q9I();t4Z+=P4P;var r4Z=r4V;r4Z+=d2P;if(Array[r4Z](parent)){var Z4Z=G2P;Z4Z+=Z0P;Z4Z+=P8P;Z4Z+=C8P;for(var i=V1P,ien=parent[Z4Z];i < ien;i++){this[Q9V](parent[i]);}return this;}var field=this[t4Z](parent);$(field[r3P]())[O3P](E9V);return this;}function dependent(parent,url,opts){var d9V="sAr";var t9V='change';var r9V="dent";var G4Z=L899[567670];G4Z+=m7P;G4Z+=Z0P;G4Z+=r0P;var B4Z=K4P;B4Z+=L899[643646];B4Z+=P4P;B4Z+=L899[567670];var M4Z=L899[567670];M4Z+=w9V;M4Z+=P4P;var n4Z=C9V;n4Z+=q9V;n4Z+=H2P;n4Z+=Y6P;var F4Z=L899.L4P;F4Z+=w0P;F4Z+=L899[567670];F4Z+=b1V;var X4Z=w0P;X4Z+=d9V;X4Z+=n9P;X4Z+=d2P;var _this=this;if(Array[X4Z](parent)){var z4Z=G2P;z4Z+=Z0P;z4Z+=H1V;z4Z+=b7P;for(var i=V1P,ien=parent[z4Z];i < ien;i++){var R4Z=P4P;R4Z+=L899[567670];R4Z+=l9V;R4Z+=r9V;this[R4Z](parent[i],url,opts);}return this;}var that=this;var field=this[F4Z](parent);var ajaxOpts={type:n4Z,dataType:Z9V};opts=$[M4Z]({event:t9V,data:F5P,preUpdate:F5P,postUpdate:F5P},opts);R9I.l9I();var update=function(json){var R9V="U";var F9V="pdat";var z9V="post";var T9V='disable';var A9V="preUpdate";var O9V='show';var K9V="preUpda";var n9V="hi";var X9V="cessing";var D9V='update';var a9V="postUpdate";var a4Z=L8V;a4Z+=L899[643646];a4Z+=X9V;var T4Z=z9V;T4Z+=R9V;T4Z+=F9V;T4Z+=L899[567670];var s4Z=n9V;s4Z+=P4P;s4Z+=L899[567670];var O4Z=L899[567670];O4Z+=F0P;O4Z+=L899.E4P;O4Z+=b7P;var D4Z=L899[567670];D4Z+=w9P;D4Z+=L899[643646];D4Z+=R4P;var V4Z=Y1V;V4Z+=M9V;var A4Z=m7P;A4Z+=F0P;A4Z+=G2P;var K4Z=K9V;K4Z+=r0P;K4Z+=L899[567670];if(opts[K4Z]){opts[A9V](json);}$[U8P]({labels:V9V,options:D9V,values:A4Z,messages:V4Z,errors:D4Z},function(jsonProp,fieldFn){if(json[jsonProp]){var P4Z=d8P;P4Z+=b7P;$[P4Z](json[jsonProp],function(field,val){that[P9V](field)[fieldFn](val);});}});$[O4Z]([s4Z,O9V,s9V,T9V],function(i,key){if(json[key]){that[key](json[key],json[n0V]);}});if(opts[T4Z]){opts[a9V](json);}field[a4Z](K5P);};$(field[B4Z]())[y9P](opts[G4Z] + E9V,function(e){var y9V="ject";var h9V="isP";var e9V="lainObject";var B9V="alu";var m4Z=P4P;m4Z+=F0P;m4Z+=r0P;m4Z+=F0P;var e4Z=m7P;e4Z+=X4V;var h4Z=m7P;h4Z+=B9V;h4Z+=L899[567670];h4Z+=W6P;var v4Z=R4P;v4Z+=l4V;var y4Z=R4P;y4Z+=L899[643646];R9I.l9I();y4Z+=m0P;y4Z+=W6P;var Y4Z=G2P;Y4Z+=L899[567670];Y4Z+=K4P;Y4Z+=v9P;var x4Z=L899.L4P;x4Z+=G9V;var u4Z=K4P;u4Z+=L899[643646];u4Z+=P4P;u4Z+=L899[567670];if($(field[u4Z]())[x4Z](e[u9V])[Y4Z] === V1P){return;}field[F4V](M5P);var data={};data[y4Z]=_this[W6P][A5V]?pluck(_this[W6P][A5V],x9V):F5P;data[v4Z]=data[J7P]?data[J7P][V1P]:F5P;data[h4Z]=_this[e4Z]();if(opts[m4Z]){var ret=opts[J4P](data);if(ret){var j4Z=P4P;j4Z+=U9P;opts[j4Z]=ret;}}if(typeof url === y5V){var o=url[W3P](_this,field[n1V](),data,update,e);if(o){var f4Z=a9P;f4Z+=Y9V;f4Z+=w0P;f4Z+=y9P;var N4Z=r0P;N4Z+=b7P;N4Z+=L899[567670];N4Z+=K4P;var W4Z=L899[643646];W4Z+=L899[403715];W4Z+=y9V;if(typeof o === W4Z && typeof o[N4Z] === f4Z){var J4Z=C8P;J4Z+=Z0P;o[J4Z](function(resolved){R9I.Q9I();if(resolved){update(resolved);}});}else {update(o);}}}else {var I0Z=v9V;I0Z+=F0P;I0Z+=r2P;var U0Z=h9V;U0Z+=e9V;if($[U0Z](url)){var c0Z=L899[567670];c0Z+=l0P;c0Z+=d0P;$[c0Z](ajaxOpts,url);}else {ajaxOpts[m9V]=url;}$[I0Z]($[U7P](ajaxOpts,{data:data,success:update}));}});return this;}function destroy(){var I1B='.dte';var J9V="clear";R9I.l9I();var N9V="isplay";var b0Z=L899.Q4P;b0Z+=w0P;b0Z+=R7V;b0Z+=j9V;var g0Z=W9V;g0Z+=L899.L4P;var p0Z=P4P;p0Z+=N9V;p0Z+=a4P;if(this[W6P][p0Z]){var i0Z=f9V;i0Z+=h4P;this[i0Z]();}this[J9V]();if(this[W6P][U1B]){$(e2V)[C6V](this[W6P][U1B]);}var controller=this[W6P][c1B];if(controller[B3V]){controller[B3V](this);}$(document)[g0Z](I1B + this[W6P][b0Z]);this[H8V]=F5P;this[W6P]=F5P;}function disable(name){var k0Z=L899[567670];k0Z+=Q4V;k0Z+=b7P;var that=this;R9I.l9I();$[k0Z](this[Y3V](name),function(i,n){var H0Z=L899.L4P;H0Z+=J8P;H0Z+=G2P;H0Z+=P4P;R9I.l9I();that[H0Z](n)[p1B]();});return this;}function display(show){var i1B="splayed";var S0Z=P6V;S0Z+=Z0P;if(show === undefined){var o0Z=u8V;o0Z+=i1B;return this[W6P][o0Z];}return this[show?S0Z:z5P]();}function displayed(){var L0Z=k2P;L0Z+=F0P;L0Z+=E0P;return $[L0Z](this[W6P][B3P],function(field,name){var g1B="ispla";var Q0Z=P4P;Q0Z+=g1B;Q0Z+=d2P;Q0Z+=a4P;return field[Q0Z]()?name:F5P;});}function displayNode(){return this[W6P][c1B][r3P](this);}function edit(items,arg1,arg2,arg3,arg4){var b1B="dataSo";var H1B="_tid";var k1B="urce";var S1B="_edit";var o1B="_crudArgs";var q0Z=t6V;q0Z+=q9P;var C0Z=S3P;C0Z+=L899[567670];C0Z+=B8P;R9I.l9I();var w0Z=G6P;w0Z+=b1B;w0Z+=k1B;var E0Z=H1B;E0Z+=d2P;var _this=this;var that=this;if(this[E0Z](function(){that[u4P](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[o1B](arg1,arg2,arg3,arg4);this[S1B](items,this[w0Z](C0Z,items),q0Z,argOpts[L1B],function(){R9I.l9I();var C1B="Main";var w1B="emble";var Q1B="Options";var E1B="_as";var r0Z=L899[643646];r0Z+=E0P;r0Z+=r0P;r0Z+=W6P;var l0Z=v7V;l0Z+=k2P;l0Z+=Q1B;var d0Z=E1B;d0Z+=W6P;d0Z+=w1B;d0Z+=C1B;_this[d0Z]();_this[l0Z](argOpts[r0Z]);argOpts[L9V]();});return this;}function enable(name){var q1B="_fie";var Z0Z=q1B;R9I.Q9I();Z0Z+=b1V;Z0Z+=W1V;Z0Z+=W6P;var that=this;$[U8P](this[Z0Z](name),function(i,n){R9I.Q9I();that[P9V](n)[d1B]();});return this;}function error$1(name,msg){var z1B="globalError";var r1B="mError";var wrapper=$(this[H8V][P0V]);if(msg === undefined){var X0Z=l1B;X0Z+=r1B;var t0Z=P4P;t0Z+=L899[643646];t0Z+=k2P;this[Z1B](this[t0Z][X0Z],name,M5P,function(){R9I.l9I();var X1B='inFormError';wrapper[t1B](X1B,name !== undefined && name !== C5P);});this[W6P][z1B]=name;}else {var z0Z=L899.L4P;z0Z+=w0P;z0Z+=f3V;this[z0Z](name)[i8P](msg);}return this;}function field(name){var F1B=" - ";var R1B="Unknown field name";var R0Z=L899.L4P;R9I.Q9I();R0Z+=J8P;R0Z+=G2P;R0Z+=x8P;var fields=this[W6P][R0Z];if(!fields[name]){var F0Z=R1B;F0Z+=F1B;throw F0Z + name;}return fields[name];}function fields(){var n0Z=L899.L4P;n0Z+=u8P;n0Z+=x8P;return $[t9P](this[W6P][n0Z],function(field,name){R9I.Q9I();return name;});}function file(name,id){var K1B="in table ";var A1B="Unknown file id";var table=this[n1B](name);var file=table[id];if(!file){var K0Z=M1B;K0Z+=K1B;var M0Z=A1B;M0Z+=M1B;throw M0Z + id + K0Z + name;}return table[id];}function files(name){var P1B='Unknown file table name: ';var V1B="iles";var V0Z=L899.L4P;V0Z+=V1B;if(!name){var A0Z=L899.L4P;A0Z+=D1B;A0Z+=L899[567670];A0Z+=W6P;return Editor[A0Z];}var table=Editor[V0Z][name];if(!table){throw P1B + name;}return table;}function get(name){var T0Z=j2P;T0Z+=r0P;var s0Z=S3P;s0Z+=L899[567670];s0Z+=G2P;s0Z+=P4P;var D0Z=Q8P;D0Z+=b3V;D0Z+=d2P;var that=this;if(!name){name=this[B3P]();}if(Array[D0Z](name)){var out={};$[U8P](name,function(i,n){var O0Z=P8P;O0Z+=L899[567670];O0Z+=r0P;var P0Z=L899.L4P;P0Z+=J8P;P0Z+=G2P;P0Z+=P4P;out[n]=that[P0Z](n)[O0Z]();});return out;}return this[s0Z](name)[T0Z]();}function hide(names,animate){var that=this;$[U8P](this[Y3V](names),function(i,n){var B0Z=b7P;R9I.Q9I();B0Z+=w0P;B0Z+=P4P;B0Z+=L899[567670];var a0Z=L899.L4P;a0Z+=w0P;a0Z+=L3P;a0Z+=P4P;that[a0Z](n)[B0Z](animate);});return this;}function ids(includeHash){var O1B="editFi";var u0Z=O1B;u0Z+=C4V;var G0Z=k2P;G0Z+=F0P;G0Z+=E0P;if(includeHash === void V1P){includeHash=K5P;}return $[G0Z](this[W6P][u0Z],function(edit,idSrc){return includeHash === M5P?E7P + idSrc:idSrc;});}function inError(inNames){var B1B="rmError";var T1B="gl";var a1B="obalEr";var s1B="ngt";var v0Z=G2P;v0Z+=L899[567670];v0Z+=s1B;v0Z+=b7P;var y0Z=T1B;y0Z+=a1B;y0Z+=R4P;y0Z+=Z6V;var Y0Z=q7V;Y0Z+=B1B;var x0Z=P4P;x0Z+=L899[643646];x0Z+=k2P;R9I.Q9I();$(this[x0Z][Y0Z]);if(this[W6P][y0Z]){return M5P;}var names=this[Y3V](inNames);for(var i=V1P,ien=names[v0Z];i < ien;i++){var e0Z=G1B;e0Z+=R4P;e0Z+=Z6V;var h0Z=u1B;h0Z+=P4P;if(this[h0Z](names[i])[e0Z]()){return M5P;}}return K5P;}function inline(cell,fieldName,opts){var j1B="t a time";var m1B="Cannot edit more than one row inline a";var N1B='div.DTE_Field';var x1B="nli";var y1B="individu";var v1B="_da";var h1B="taSou";var c6Z=w0P;c6Z+=x1B;c6Z+=K4P;c6Z+=L899[567670];var U6Z=Y1B;U6Z+=G4P;var f0Z=Y8P;f0Z+=n7P;var W0Z=o3P;R9I.l9I();W0Z+=L899[567670];W0Z+=d2P;W0Z+=W6P;var j0Z=y1B;j0Z+=X4V;var m0Z=v1B;m0Z+=h1B;m0Z+=R4P;m0Z+=q7P;var _this=this;var that=this;if($[x3P](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[U7P]({},this[W6P][g7V][e1B],opts);var editFields=this[m0Z](j0Z,cell,fieldName);var keys=Object[W0Z](editFields);if(keys[V7P] > D1P){var N0Z=m1B;N0Z+=j1B;throw new Error(N0Z);}var editRow=editFields[keys[V1P]];var hosts=[];for(var i=V1P;i < editRow[f0Z][V7P];i++){var J0Z=F0P;J0Z+=r0P;J0Z+=W1B;J0Z+=b7P;hosts[e8P](editRow[J0Z][i]);}if($(N1B,hosts)[V7P]){return this;}if(this[I7V](function(){R9I.l9I();that[e1B](cell,fieldName,opts);})){return this;}this[U6Z](cell,editFields,c6Z,opts,function(){var f1B="_inl";var I6Z=f1B;R9I.Q9I();I6Z+=J1B;_this[I6Z](editFields,opts);});return this;}function inlineCreate(insertPoint,opts){var c4B="Fields";var p4B="_a";var o4B="_ti";var L4B="bject";var b4B="Row";var S4B="isPlainO";var g4B="ake";var H4B="ai";var r6Z=U4B;r6Z+=m0V;r6Z+=K4P;r6Z+=r0P;var l6Z=u4P;l6Z+=c4B;var d6Z=I4B;d6Z+=q6P;d6Z+=J1B;var q6Z=p4B;q6Z+=B9P;q6Z+=y9P;q6Z+=i4B;var C6Z=q9P;C6Z+=u7V;C6Z+=K4P;C6Z+=L899[567670];var w6Z=C0P;w6Z+=q0P;var E6Z=L899.L4P;E6Z+=g4B;E6Z+=b4B;var Q6Z=G6P;Q6Z+=X0P;Q6Z+=r0P;Q6Z+=k4B;var L6Z=a4P;L6Z+=w0P;L6Z+=C5V;L6Z+=C4V;var S6Z=F0P;S6Z+=Y9V;S6Z+=U0V;var o6Z=k2P;o6Z+=H4B;o6Z+=K4P;var H6Z=e7P;H6Z+=P4P;H6Z+=L899[567670];var i6Z=o4B;i6Z+=P4P;i6Z+=d2P;var p6Z=S4B;p6Z+=L4B;var _this=this;if($[p6Z](insertPoint)){opts=insertPoint;insertPoint=F5P;}if(this[i6Z](function(){R9I.l9I();var Q4B="inlineCreate";_this[Q4B](insertPoint,opts);})){return this;}$[U8P](this[W6P][B3P],function(name,field){var w4B="tiRes";var k6Z=W6P;k6Z+=L899[567670];k6Z+=r0P;var b6Z=E4B;b6Z+=s0V;R9I.l9I();var g6Z=n5V;g6Z+=G2P;g6Z+=w4B;g6Z+=s0V;field[g6Z]();field[b6Z](V1P,field[C4B]());field[k6Z](field[C4B]());});this[W6P][H6Z]=o6Z;this[W6P][S6Z]=c9V;this[W6P][I9V]=F5P;this[W6P][L6Z]=this[Q6Z](E6Z,insertPoint);opts=$[w6Z]({},this[W6P][g7V][C6Z],opts);this[q6Z]();this[d6Z](this[W6P][l6Z],opts,function(){var q4B='fakeRowEnd';_this[R5V](q4B);});this[r6Z](b9V,F5P);return this;}function message(name,msg){if(msg === undefined){var Z6Z=P4P;Z6Z+=L899[643646];Z6Z+=k2P;this[Z1B](this[Z6Z][d4B],name);}else {this[P9V](name)[l4B](msg);}return this;}function mode(mode){var z4B='Changing from create mode is not supported';var r4B="acti";var X4B='Not currently in an editing mode';var X6Z=r4B;X6Z+=y9P;var t6Z=Z4B;t6Z+=N4P;t6Z+=f4P;if(!mode){return this[W6P][t4B];}if(!this[W6P][t4B]){throw new Error(X4B);}else if(this[W6P][t4B] === t6Z && mode !== b0V){throw new Error(z4B);}this[W6P][X6Z]=mode;return this;}function modifier(){var R4B="mod";var F4B="ifier";var z6Z=R4B;z6Z+=F4B;return this[W6P][z6Z];}function multiGet(fieldNames){var that=this;if(fieldNames === undefined){var R6Z=Q5V;R6Z+=B8P;fieldNames=this[R6Z]();}if(Array[G3P](fieldNames)){var F6Z=N4P;F6Z+=L899.E4P;F6Z+=b7P;var out={};$[F6Z](fieldNames,function(i,name){out[name]=that[P9V](name)[n4B]();});return out;}return this[P9V](fieldNames)[n4B]();}function multiSet(fieldNames,val){var n6Z=M4B;n6Z+=r0P;var that=this;if($[n6Z](fieldNames) && val === undefined){$[U8P](fieldNames,function(name,value){that[P9V](name)[g9V](value);});}else {this[P9V](fieldNames)[g9V](val);}R9I.l9I();return this;}function node(name){var K4B="rd";var A6Z=K4P;A6Z+=L899[643646];A6Z+=P4P;A6Z+=L899[567670];var K6Z=t6V;K6Z+=E0P;R9I.l9I();var that=this;if(!name){var M6Z=L899[643646];M6Z+=K4B;M6Z+=L899[567670];M6Z+=R4P;name=this[M6Z]();}return Array[G3P](name)?$[K6Z](name,function(n){R9I.Q9I();return that[P9V](n)[r3P]();}):this[P9V](name)[A6Z]();}function off(name,fn){var D6Z=l8V;D6Z+=W1V;var V6Z=L899[643646];V6Z+=L899.L4P;V6Z+=L899.L4P;$(this)[V6Z](this[D6Z](name),fn);R9I.Q9I();return this;}function on(name,fn){$(this)[y9P](this[A4B](name),fn);return this;}function one(name,fn){var P6Z=L899[643646];R9I.l9I();P6Z+=K4P;P6Z+=L899[567670];$(this)[P6Z](this[A4B](name),fn);return this;}function open(){var O4B="oseReg";R9I.Q9I();var s4B="displayReorder";var V4B="po";var P4B="tOpts";var G4B="_nestedOpen";var y6Z=G6P;y6Z+=V4B;y6Z+=D4B;y6Z+=Z0P;var Y6Z=L899[567670];Y6Z+=u8V;Y6Z+=P4B;var T6Z=k2P;T6Z+=F0P;T6Z+=w0P;T6Z+=K4P;var s6Z=G6P;s6Z+=a2P;s6Z+=O4B;var O6Z=G6P;O6Z+=s4B;var _this=this;this[O6Z]();this[s6Z](function(){_this[T4B](function(){_this[d8V]();_this[l8V](a4B,[U9V]);});});var ret=this[B4B](T6Z);if(!ret){return this;}this[G4B](function(){var u4B="focu";var x6Z=t6V;x6Z+=q9P;var u6Z=F8V;u6Z+=a4P;var G6Z=u4B;G6Z+=W6P;var B6Z=j5V;B6Z+=P4B;_this[x4B]($[t9P](_this[W6P][O5V],function(name){var a6Z=S3P;a6Z+=C4V;return _this[W6P][a6Z][name];}),_this[W6P][B6Z][G6Z]);_this[l8V](u6Z,[x6Z,_this[W6P][t4B]]);},this[W6P][Y6Z][Y4B]);this[y6Z](U9V,K5P);return this;}function order(set){var f4B="All fields, and no additional fields, must be provided for ordering.";var e4B="ort";var y4B="_displayR";var v4B="eorde";var c2Z=y4B;c2Z+=v4B;c2Z+=R4P;var U2Z=L899[567670];U2Z+=h4B;var J6Z=L899[228964];J6Z+=L899[643646];J6Z+=w0P;J6Z+=K4P;var f6Z=W6P;f6Z+=L899[643646];f6Z+=R4P;f6Z+=r0P;var N6Z=W6P;N6Z+=J3P;var W6Z=W6P;W6Z+=e4B;var j6Z=W6P;j6Z+=G2P;j6Z+=I2P;j6Z+=L899[567670];var m6Z=q5V;m6Z+=E2P;var v6Z=Q8P;v6Z+=Q0P;v6Z+=w9P;v6Z+=C9P;if(!set){return this[W6P][O5V];}if(arguments[V7P] && !Array[v6Z](set)){var e6Z=W6P;e6Z+=G2P;e6Z+=m4B;var h6Z=j4B;h6Z+=W4B;set=Array[h6Z][e6Z][W3P](arguments);}if(this[W6P][m6Z][j6Z]()[W6Z]()[N4B](J5P) !== set[N6Z]()[f6Z]()[J6Z](J5P)){throw f4B;}$[U2Z](this[W6P][O5V],set);this[c2Z]();return this;}function remove(items,arg1,arg2,arg3,arg4){var J4B="editFie";var g0B="_actionClass";var i0B="Arg";var p0B="_crud";var I0B="_dataSou";var c0B="ier";var U0B="dif";var b0B='initRemove';var S2Z=P4P;S2Z+=O6P;S2Z+=F0P;var o2Z=V8P;o2Z+=j8P;var H2Z=J4B;H2Z+=B8P;var k2Z=e7P;k2Z+=U0B;k2Z+=c0B;var b2Z=F0P;b2Z+=L899.E4P;b2Z+=x9P;b2Z+=K4P;var g2Z=L899.L4P;g2Z+=w0P;g2Z+=L899[567670];g2Z+=B8P;R9I.l9I();var i2Z=I0B;i2Z+=R4P;i2Z+=L899.E4P;i2Z+=L899[567670];var p2Z=p0B;p2Z+=i0B;p2Z+=W6P;var I2Z=G2P;I2Z+=Z0P;I2Z+=v9P;var _this=this;var that=this;if(this[I7V](function(){R9I.Q9I();that[T3P](items,arg1,arg2,arg3,arg4);})){return this;}if(items[I2Z] === undefined){items=[items];}var argOpts=this[p2Z](arg1,arg2,arg3,arg4);var editFields=this[i2Z](g2Z,items);this[W6P][b2Z]=T3P;this[W6P][k2Z]=items;this[W6P][H2Z]=editFields;this[H8V][p9V][q6V][G6V]=G7P;this[g0B]();this[l8V](b0B,[pluck(editFields,o2Z),pluck(editFields,S2Z),items],function(){R9I.Q9I();var k0B='initMultiRemove';_this[l8V](k0B,[editFields,items],function(){var L0B='button';var L2Z=q7V;L2Z+=L899.E4P;L2Z+=T2P;_this[H0B]();_this[o0B](argOpts[L1B]);argOpts[L9V]();var opts=_this[W6P][j3P];if(opts[L2Z] !== F5P){var E2Z=y4P;E2Z+=H8P;var Q2Z=S0B;Q2Z+=k2P;$(L0B,_this[Q2Z][E2Z])[Q0B](opts[A8V])[A8V]();}});});return this;}function set(set,val){var E0B="sPlainObje";R9I.l9I();var C2Z=L899[567670];C2Z+=Q4V;C2Z+=b7P;var w2Z=w0P;w2Z+=E0B;w2Z+=Y9V;var that=this;if(!$[w2Z](set)){var o={};o[set]=val;set=o;}$[C2Z](set,function(n,v){R9I.Q9I();that[P9V](n)[j8V](v);});return this;}function show(names,animate){var w0B="_fiel";var C0B="dNam";var d2Z=w0B;d2Z+=C0B;d2Z+=L899[567670];d2Z+=W6P;R9I.Q9I();var q2Z=d8P;q2Z+=b7P;var that=this;$[q2Z](this[d2Z](names),function(i,n){that[P9V](n)[q0B](animate);});return this;}function submit(successCallback,errorCallback,formatdata,hide){var X2Z=d0B;X2Z+=R4P;var r2Z=l0B;r2Z+=r0B;r2Z+=Z0B;var l2Z=S3P;R9I.l9I();l2Z+=L899[567670];l2Z+=B8P;var _this=this;var fields=this[W6P][l2Z],errorFields=[],errorReady=V1P,sent=K5P;if(this[W6P][F4V] || !this[W6P][t4B]){return this;}this[r2Z](M5P);var send=function(){var t0B='initSubmit';var Z2Z=G2P;Z2Z+=A1V;Z2Z+=b7P;if(errorFields[Z2Z] !== errorReady || sent){return;}_this[l8V](t0B,[_this[W6P][t4B]],function(result){var X0B="_pro";var z0B="cessi";if(result === K5P){var t2Z=X0B;t2Z+=z0B;t2Z+=R0B;_this[t2Z](K5P);return;}sent=M5P;_this[F0B](successCallback,errorCallback,formatdata,hide);});};this[X2Z]();$[U8P](fields,function(name,field){R9I.Q9I();if(field[n0B]()){var z2Z=O8P;z2Z+=M0B;errorFields[z2Z](name);}});$[U8P](errorFields,function(i,name){R9I.Q9I();fields[name][i8P](C5P,function(){errorReady++;send();});});send();return this;}function table(set){var F2Z=r0P;F2Z+=F0P;F2Z+=M4P;F2Z+=L899[567670];if(set === undefined){var R2Z=K0B;R2Z+=U2P;return this[W6P][R2Z];}this[W6P][F2Z]=set;return this;}function template(set){var A0B="emplat";var V0B="templ";var M2Z=r0P;M2Z+=A0B;R9I.Q9I();M2Z+=L899[567670];if(set === undefined){var n2Z=V0B;n2Z+=r6V;return this[W6P][n2Z];}this[W6P][M2Z]=set === F5P?F5P:$(set);return this;}function title(title){var a0B="ade";var s0B="class";var O0B="ead";var s2Z=D0B;s2Z+=P0B;var P2Z=a9P;P2Z+=L899.E4P;P2Z+=L899.w4P;var D2Z=b7P;D2Z+=O0B;D2Z+=L899[567670];D2Z+=R4P;var V2Z=s0B;V2Z+=T0B;var A2Z=L899.E4P;A2Z+=X7V;var K2Z=b7P;K2Z+=L899[567670];K2Z+=a0B;K2Z+=R4P;var header=$(this[H8V][K2Z])[A2Z](B0B + this[V2Z][D2Z][M0V]);if(title === undefined){return header[h1V]();}if(typeof title === P2Z){var O2Z=r0P;O2Z+=F0P;O2Z+=M4P;O2Z+=L899[567670];title=title(this,new DataTable$4[p0V](this[W6P][O2Z]));}header[s2Z](title);return this;}function val(field,value){var T2Z=P8P;R9I.l9I();T2Z+=L899[567670];T2Z+=r0P;if(value !== undefined || $[x3P](field)){return this[j8V](field,value);}return this[T2Z](field);;}function error(msg,tn,thro){var x0B="ables.net/tn/";var u0B="to https://datat";var G0B=" For more information, please refer ";var a2Z=G0B;a2Z+=u0B;a2Z+=x0B;if(thro === void V1P){thro=M5P;}var display=tn?msg + a2Z + tn:msg;if(thro){throw display;}else {var B2Z=m0P;B2Z+=F0P;B2Z+=R4P;B2Z+=K4P;console[B2Z](display);}}function pairs(data,props,fn){var Y0B='value';var G2Z=G2P;G2Z+=x6P;var i,ien,dataPoint;props=$[U7P]({label:G2Z,value:Y0B},props);if(Array[G3P](data)){for((i=V1P,ien=data[V7P]);i < ien;i++){dataPoint=data[i];if($[x3P](dataPoint)){var x2Z=F0P;x2Z+=r0P;x2Z+=r0P;x2Z+=R4P;var u2Z=Z3P;u2Z+=L899[403715];u2Z+=L899[567670];u2Z+=G2P;fn(dataPoint[props[y0B]] === undefined?dataPoint[props[v1V]]:dataPoint[props[y0B]],dataPoint[props[u2Z]],i,dataPoint[x2Z]);}else {fn(dataPoint,dataPoint,i);}}}else {var Y2Z=L899[567670];Y2Z+=n7P;i=V1P;$[Y2Z](data,function(key,val){fn(val,key,i);R9I.Q9I();i++;});}}function upload$1(editor,conf,files,progressCallback,completeCallback){var e0B='A server error occurred while uploading the file';var m0B="<i>Uploading file</i>";var h0B="eReadText";var v0B="onl";var j6B="readAsDataURL";var m6B="tLe";var e6B="_lim";var m2Z=v0B;m2Z+=L899[643646];R9I.Q9I();m2Z+=F0P;m2Z+=P4P;var e2Z=L899.L4P;e2Z+=D1B;e2Z+=h0B;var v2Z=K4P;v2Z+=F0P;v2Z+=k2P;v2Z+=L899[567670];var y2Z=L899[567670];y2Z+=w9P;y2Z+=Z6V;var reader=new FileReader();var counter=V1P;var ids=[];var generalError=e0B;editor[y2Z](conf[v2Z],C5P);if(typeof conf[i9P] === y5V){var h2Z=v9V;h2Z+=B5V;conf[h2Z](files,function(ids){completeCallback[W3P](editor,ids);});return;}progressCallback(conf,conf[e2Z] || m0B);reader[m2Z]=function(e){var k6B='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var U6B="Plai";var i6B="ajaxData";var b6B='No Ajax option specified for upload plug-in';var N0B="isPlai";var J0B="ja";var j0B="eUpl";var p6B='upload';var c6B="jax";var I6B='uploadField';var g5Z=L8V;g5Z+=j0B;g5Z+=W0B;var i5Z=P4P;i5Z+=O6P;i5Z+=F0P;var p5Z=N0B;p5Z+=f0B;var U5Z=F0P;U5Z+=J0B;U5Z+=r2P;var f2Z=Q8P;f2Z+=U6B;R9I.Q9I();f2Z+=f0B;var N2Z=F0P;N2Z+=c6B;var W2Z=F0P;W2Z+=o5V;W2Z+=K4P;W2Z+=P4P;var j2Z=b2P;j2Z+=E0P;j2Z+=G2P;j2Z+=W0B;var data=new FormData();var ajax;data[C6V](I7P,j2Z);data[C6V](I6B,conf[L8P]);data[W2Z](p6B,files[counter]);if(conf[i6B]){conf[i6B](data,files[counter],counter);}if(conf[N2Z]){ajax=conf[i9P];}else if($[f2Z](editor[W6P][i9P])){var J2Z=F0P;J2Z+=c6B;ajax=editor[W6P][i9P][g6B]?editor[W6P][i9P][g6B]:editor[W6P][J2Z];}else if(typeof editor[W6P][U5Z] === w7P){ajax=editor[W6P][i9P];}if(!ajax){throw new Error(b6B);}if(typeof ajax === w7P){ajax={url:ajax};}if(typeof ajax[J4P] === y5V){var c5Z=L899[567670];c5Z+=F0P;c5Z+=L899.E4P;c5Z+=b7P;var d={};var ret=ajax[J4P](d);if(ret !== undefined && typeof ret !== w7P){d=ret;}$[c5Z](d,function(key,value){var I5Z=F0P;I5Z+=h2V;I5Z+=P4P;data[I5Z](key,value);});}else if($[p5Z](ajax[i5Z])){throw new Error(k6B);}editor[l8V](g5Z,[conf[L8P],files[counter],data],function(preRet){var o6B="preSubmit.DTE_Upl";var H6B="pos";var L6B="taURL";var S6B="adAsDa";var L5Z=H6B;L5Z+=r0P;var S5Z=C0P;S5Z+=L899[567670];S5Z+=K4P;S5Z+=P4P;var o5Z=o6B;o5Z+=W0B;var H5Z=L899[643646];H5Z+=K4P;if(preRet === K5P){var b5Z=U2P;b5Z+=K4P;b5Z+=H1V;b5Z+=b7P;if(counter < files[b5Z] - D1P){var k5Z=h7P;k5Z+=S6B;k5Z+=L6B;counter++;reader[k5Z](files[counter]);}else {completeCallback[W3P](editor,ids);}return;}var submit=K5P;editor[H5Z](o5Z,function(){submit=M5P;R9I.l9I();return K5P;});$[i9P]($[S5Z]({},ajax,{type:L5Z,data:data,dataType:Z9V,contentType:K5P,processData:K5P,xhr:function(){R9I.Q9I();var Q6B="ajaxS";var E6B="ettings";var C6B="onprogress";var F6B="onloadend";var w6B="xhr";var Q5Z=Q6B;Q5Z+=E6B;var xhr=$[Q5Z][w6B]();if(xhr[g6B]){xhr[g6B][C6B]=function(e){var q6B="lengt";var Z6B="otal";var X6B="toFixed";R9I.l9I();var R6B=':';var l6B="uta";var t6B="oaded";var f1P=100;var z6B="%";var d6B="hComp";var E5Z=q6B;E5Z+=d6B;E5Z+=l6B;E5Z+=I0V;if(e[E5Z]){var d5Z=G2P;d5Z+=M7P;var q5Z=r6B;q5Z+=C8P;var C5Z=r0P;C5Z+=Z6B;var w5Z=G2P;w5Z+=t6B;var percent=(e[w5Z] / e[C5Z] * f1P)[X6B](V1P) + z6B;progressCallback(conf,files[q5Z] === D1P?percent:counter + R6B + files[d5Z] + n3V + percent);}};xhr[g6B][F6B]=function(e){var K6B='Processing';var M6B="ssingText";var l5Z=n6B;l5Z+=L899[567670];l5Z+=M6B;progressCallback(conf,conf[l5Z] || K6B);};}return xhr;},success:function(json){var T6B="it.";var a6B="DTE_Upload";var B6B='uploadXhrSuccess';var A6B="uplo";var Y6B="eadAsDataU";var s6B="preSubm";var y6B="R";var z5Z=A6B;z5Z+=H0V;var X5Z=V6B;X5Z+=R4P;X5Z+=L899[643646];X5Z+=D6B;var t5Z=P6B;t5Z+=O6B;R9I.Q9I();var Z5Z=s6B;Z5Z+=T6B;Z5Z+=a6B;var r5Z=L899[643646];r5Z+=L899.L4P;r5Z+=L899.L4P;editor[r5Z](Z5Z);editor[t5Z](B6B,[conf[L8P],json]);if(json[G6B] && json[X5Z][V7P]){var errors=json[G6B];for(var i=V1P,ien=errors[V7P];i < ien;i++){editor[i8P](errors[i][L8P],errors[i][u6B]);}}else if(json[i8P]){editor[i8P](json[i8P]);}else if(!json[g6B] || !json[z5Z][f1V]){var R5Z=x1V;R5Z+=k2P;R5Z+=L899[567670];editor[i8P](conf[R5Z],generalError);}else {var K5Z=U2P;K5Z+=Y9P;var M5Z=x6B;M5Z+=U5V;M5Z+=F0P;M5Z+=P4P;if(json[n1B]){var F5Z=L899.L4P;F5Z+=D1B;F5Z+=T0B;$[U8P](json[F5Z],function(table,files){var n5Z=L899.L4P;n5Z+=w0P;n5Z+=o4V;if(!Editor[n5Z][table]){Editor[n1B][table]={};}$[U7P](Editor[n1B][table],files);});}ids[e8P](json[M5Z][f1V]);if(counter < files[K5Z] - D1P){var A5Z=R4P;A5Z+=Y6B;A5Z+=y6B;A5Z+=u6P;counter++;reader[A5Z](files[counter]);}else {completeCallback[W3P](editor,ids);if(submit){var V5Z=z3V;V5Z+=L899[403715];V5Z+=k2P;V5Z+=G4P;editor[V5Z]();}}}progressCallback(conf);},error:function(xhr){var v6B='uploadXhrError';var P5Z=x1V;P5Z+=Y1V;var D5Z=L899[567670];D5Z+=R4P;D5Z+=T6P;editor[D5Z](conf[P5Z],generalError);R9I.l9I();editor[l8V](v6B,[conf[L8P],xhr]);progressCallback(conf);}}));});};files=$[t9P](files,function(val){R9I.l9I();return val;});if(conf[h6B] !== undefined){var s5Z=U2P;s5Z+=Y9P;var O5Z=e6B;O5Z+=w0P;O5Z+=m6B;O5Z+=s8V;files[a5V](conf[O5Z],files[s5Z]);}reader[j6B](files[V1P]);}var DataTable$3=$[T5Z][a5Z];var __inlineCounter=V1P;function _actionClass(){var U2B="addCl";var J6B="ddCla";var N6B="rap";var f6B="actio";var j5Z=h7P;j5Z+=k2P;j5Z+=L899[643646];j5Z+=m0V;var e5Z=j5V;e5Z+=r0P;var v5Z=Z4B;v5Z+=L899[567670];v5Z+=F0P;v5Z+=f4P;var y5Z=W6B;y5Z+=w0P;y5Z+=K4P;var Y5Z=a4P;Y5Z+=w0P;Y5Z+=r0P;var x5Z=m0P;x5Z+=N6B;x5Z+=K6V;var u5Z=S0B;u5Z+=k2P;var G5Z=f6B;G5Z+=K4P;var B5Z=F0P;B5Z+=o3V;B5Z+=H8P;var classesActions=this[J7V][B5Z];var action=this[W6P][G5Z];var wrapper=$(this[u5Z][x5Z]);wrapper[N7P]([classesActions[c9V],classesActions[Y5Z],classesActions[T3P]][y5Z](n3V));if(action === v5Z){var h5Z=F0P;h5Z+=J6B;h5Z+=T0V;wrapper[h5Z](classesActions[c9V]);}else if(action === e5Z){var m5Z=U2B;m5Z+=F0P;m5Z+=T0V;wrapper[m5Z](classesActions[u4P]);}else if(action === j5Z){var W5Z=h7P;W5Z+=k2P;W5Z+=l9P;wrapper[x7P](classesActions[W5Z]);}}function _ajax(data,success,error,submitParams){var g2B="oi";var Z2B='idSrc';var k2B="OS";var B2B="deleteBody";var K2B="replacements";var x2B='?';var z2B="xOf";var a2B="functi";var i2B="rl";var M2B="unsh";var A2B="placements";var R2B="plit";var b2B="editFiel";var n2B="complete";var F2B="omplete";var T2B=/{id}/;var G2B="aram";var I2B="ELET";var s2B=/_id_/;var D7Z=c2B;D7Z+=r2P;var n7Z=F4P;n7Z+=I2B;n7Z+=N6P;R9I.Q9I();var F7Z=r0P;F7Z+=d2P;F7Z+=E0P;F7Z+=L899[567670];var Z7Z=X0P;Z7Z+=r0P;Z7Z+=F0P;var r7Z=h7P;r7Z+=p2B;r7Z+=Q4V;r7Z+=L899[567670];var l7Z=b2P;l7Z+=i2B;var d7Z=b2P;d7Z+=R4P;d7Z+=G2P;var H7Z=W6P;H7Z+=D2P;H7Z+=q9P;H7Z+=P8P;var k7Z=L899[228964];k7Z+=g2B;k7Z+=K4P;var b7Z=b2B;b7Z+=P4P;b7Z+=W6P;var g7Z=L899[567670];g7Z+=P4P;g7Z+=w0P;g7Z+=r0P;var J5Z=L899[228964];J5Z+=W6P;J5Z+=L899[643646];J5Z+=K4P;var f5Z=C9V;f5Z+=k2B;f5Z+=Y6P;var N5Z=F0P;N5Z+=B9P;N5Z+=L899[643646];N5Z+=K4P;var action=this[W6P][N5Z];var thrown;var opts={type:f5Z,dataType:J5Z,data:F5P,error:[function(xhr,text,err){R9I.Q9I();thrown=err;}],success:[],complete:[function(xhr,text){var U4P=400;var q2B="JS";var d2B="ON";var C2B="ponse";var S2B='null';var o2B="responseText";var L2B="nse";R9I.l9I();var w2B="rse";var l2B="responseJSON";var H2B="stat";var J1P=204;var U7Z=H2B;U7Z+=T2P;var json=F5P;if(xhr[U7Z] === J1P || xhr[o2B] === S2B){json={};}else {try{var p7Z=R4P;p7Z+=m9P;p7Z+=L2B;p7Z+=Q2B;var I7Z=E2B;I7Z+=w2B;var c7Z=s7P;c7Z+=C2B;c7Z+=q2B;c7Z+=d2B;json=xhr[c7Z]?xhr[l2B]:JSON[I7Z](xhr[p7Z]);}catch(e){}}if($[x3P](json) || Array[G3P](json)){var i7Z=D6V;i7Z+=O6P;i7Z+=b2P;i7Z+=W6P;success(json,xhr[i7Z] >= U4P,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[W6P][i9P];var id=action === g7Z || action === r2B?pluck(this[W6P][b7Z],Z2B)[k7Z](t2B):F5P;if($[x3P](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === y5V){ajaxSrc(F5P,F5P,data,success,error);return;}else if(typeof ajaxSrc === H7Z){var o7Z=X2B;o7Z+=z2B;if(ajaxSrc[o7Z](n3V) !== -D1P){var L7Z=b2P;L7Z+=i2B;var S7Z=W6P;S7Z+=R2B;a=ajaxSrc[S7Z](n3V);opts[W4B]=a[V1P];opts[L7Z]=a[D1P];}else {opts[m9V]=ajaxSrc;}}else {var Q7Z=L899.E4P;Q7Z+=F2B;var optsCopy=$[U7P]({},ajaxSrc || ({}));if(optsCopy[Q7Z]){opts[n2B][T5V](optsCopy[n2B]);delete optsCopy[n2B];}if(optsCopy[i8P]){var E7Z=M2B;E7Z+=w0P;E7Z+=L899.L4P;E7Z+=r0P;opts[i8P][E7Z](optsCopy[i8P]);delete optsCopy[i8P];}opts=$[U7P]({},opts,optsCopy);}if(opts[K2B]){var w7Z=h7P;w7Z+=A2B;$[U8P](opts[w7Z],function(key,repl){var O2B='}';var P2B='{';var q7Z=V2B;q7Z+=h3P;var C7Z=b2P;R9I.Q9I();C7Z+=R4P;C7Z+=G2P;opts[m9V]=opts[C7Z][D2B](P2B + key + O2B,repl[q7Z](this,key,id,action,data));});}opts[d7Z]=opts[l7Z][r7Z](s2B,id)[D2B](T2B,id);if(opts[Z7Z]){var R7Z=C0P;R7Z+=q0P;var z7Z=P4P;z7Z+=U9P;var X7Z=P4P;X7Z+=U9P;var t7Z=a2B;t7Z+=y9P;var isFn=typeof opts[J4P] === t7Z;var newData=isFn?opts[X7Z](data):opts[z7Z];data=isFn && newData?newData:$[R7Z](M5P,data,newData);}opts[J4P]=data;if(opts[F7Z] === n7Z && (opts[B2B] === undefined || opts[B2B] === M5P)){var V7Z=P4P;V7Z+=F0P;V7Z+=r0P;V7Z+=F0P;var A7Z=b2P;A7Z+=R4P;A7Z+=G2P;var K7Z=P4P;K7Z+=F0P;K7Z+=r0P;K7Z+=F0P;var M7Z=E0P;M7Z+=G2B;var params=$[M7Z](opts[K7Z]);opts[A7Z]+=opts[m9V][u2B](x2B) === -D1P?x2B + params:Y2B + params;delete opts[V7Z];}$[D7Z](opts);}function _animate(target,style,time,callback){var y2B="an";var v2B="nim";var h2B="unction";var P7Z=y2B;P7Z+=Z2V;if($[l5P][P7Z]){var O7Z=F0P;O7Z+=v2B;O7Z+=r6V;target[D4B]()[O7Z](style,time,callback);}else {var T7Z=L899.L4P;T7Z+=h2B;var s7Z=L899.E4P;s7Z+=T0V;target[s7Z](style);if(typeof time === T7Z){var a7Z=L899.E4P;a7Z+=F0P;a7Z+=G2P;a7Z+=G2P;time[a7Z](target);}else if(callback){var B7Z=V2B;B7Z+=G2P;B7Z+=G2P;callback[B7Z](target);}}}function _assembleMain(){var W2B="formError";var N2B="bodyContent";var m2B="header";var y7Z=q7V;y7Z+=d7V;var Y7Z=z9P;Y7Z+=m3P;Y7Z+=d0P;var x7Z=F0P;x7Z+=e2B;x7Z+=L899[567670];x7Z+=d0P;var u7Z=j4P;u7Z+=L899[643646];u7Z+=K4P;u7Z+=W6P;var G7Z=S0B;R9I.Q9I();G7Z+=k2P;var dom=this[G7Z];$(dom[P0V])[E8V](dom[m2B]);$(dom[j2B])[C6V](dom[W2B])[C6V](dom[u7Z]);$(dom[N2B])[x7Z](dom[d4B])[Y7Z](dom[y7Z]);}function _blur(){var c5B='preBlur';var U5B="onBlur";var J2B="itOp";var e7Z=L899.L4P;e7Z+=b2P;e7Z+=f2B;var h7Z=n8V;h7Z+=K4P;h7Z+=r0P;var v7Z=a4P;v7Z+=J2B;v7Z+=I4V;var opts=this[W6P][v7Z];var onBlur=opts[U5B];R9I.Q9I();if(this[h7Z](c5B) === K5P){return;}if(typeof onBlur === e7Z){onBlur(this);}else if(onBlur === h5V){this[e5V]();}else if(onBlur === z5P){var m7Z=I5B;m7Z+=u2P;m7Z+=L899[567670];this[m7Z]();}}function _clearDynamicInfo(errorsOnly){var p5B="removeC";var g5B="ses";var i5B="rro";var N7Z=p5B;N7Z+=V8V;var W7Z=L899[567670];W7Z+=i5B;W7Z+=R4P;var j7Z=L899.E4P;j7Z+=Z3P;j7Z+=W6P;j7Z+=g5B;if(errorsOnly === void V1P){errorsOnly=K5P;}if(!this[W6P]){return;}var errorClass=this[j7Z][P9V][W7Z];var fields=this[W6P][B3P];$(B0B + errorClass,this[H8V][P0V])[N7Z](errorClass);$[U8P](fields,function(name,field){field[i8P](C5P);R9I.Q9I();if(!errorsOnly){field[l4B](C5P);}});this[i8P](C5P);if(!errorsOnly){this[l4B](C5P);}}function _close(submitComplete,mode){var b5B="eCb";var k5B="reClose";var S5B="seI";var H5B="loseCb";var g8Z=L899[643646];g8Z+=L899.L4P;g8Z+=L899.L4P;var i8Z=L899[403715];i8Z+=L899[643646];i8Z+=P4P;i8Z+=d2P;var U8Z=G5V;U8Z+=b5B;var J7Z=E0P;J7Z+=k5B;var f7Z=U4B;f7Z+=m0V;f7Z+=K4P;f7Z+=r0P;var closed;if(this[f7Z](J7Z) === K5P){return;}if(this[W6P][U8Z]){var I8Z=L899.E4P;I8Z+=H5B;var c8Z=L899.E4P;c8Z+=H5B;closed=this[W6P][c8Z](submitComplete,mode);this[W6P][I8Z]=F5P;}if(this[W6P][o5B]){var p8Z=f9V;p8Z+=S5B;p8Z+=L5B;this[W6P][p8Z]();this[W6P][o5B]=F5P;}$(i8Z)[g8Z](Q5B);this[W6P][E5B]=K5P;this[l8V](z5P);if(closed){var b8Z=G6P;b8Z+=w5B;this[b8Z](a4B,[closed]);}}function _closeReg(fn){var C5B="oseCb";var k8Z=a2P;k8Z+=C5B;this[W6P][k8Z]=fn;}function _crudArgs(arg1,arg2,arg3,arg4){R9I.l9I();var q5B="ool";var r5B="main";var d5B="ean";var H8Z=L899[403715];H8Z+=q5B;H8Z+=d5B;var that=this;var title;var buttons;var show;var opts;if($[x3P](arg1)){opts=arg1;}else if(typeof arg1 === H8Z){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=M5P;}if(title){var o8Z=q3V;o8Z+=r0P;o8Z+=G2P;o8Z+=L899[567670];that[o8Z](title);}if(buttons){that[l5B](buttons);}return {opts:$[U7P]({},this[W6P][g7V][r5B],opts),maybeOpen:function(){if(show){var S8Z=L899[643646];S8Z+=l9V;that[S8Z]();}}};}function _dataSource(name){var Z5B="Sources";var E8Z=P4P;E8Z+=U9P;E8Z+=n0P;E8Z+=L899[567670];var Q8Z=P4P;Q8Z+=F0P;R9I.Q9I();Q8Z+=p9P;Q8Z+=Z5B;var L8Z=b9P;L8Z+=v9P;var args=[];for(var _i=D1P;_i < arguments[L8Z];_i++){args[_i - D1P]=arguments[_i];}var dataSource=this[W6P][K3P]?Editor[Q8Z][E8Z]:Editor[t5B][h1V];var fn=dataSource[name];if(fn){var w8Z=z9P;w8Z+=E0P;w8Z+=G2P;w8Z+=d2P;return fn[w8Z](this,args);}}function _displayReorder(includeFields){var F5B="tach";var X5B="spla";var z5B="yed";var u5B="ndTo";var K5B="includ";var R5B="layO";var n5B="formContent";var M5B="ncludeFields";var A5B="eFields";var P8Z=u8V;P8Z+=X5B;P8Z+=z5B;var D8Z=M8P;D8Z+=E0P;D8Z+=R5B;D8Z+=s5V;R9I.l9I();var A8Z=k2P;A8Z+=U7V;var t8Z=j8P;t8Z+=F5B;var l8Z=k2P;l8Z+=j1V;var d8Z=Z6V;d8Z+=j8P;d8Z+=R4P;var q8Z=S3P;q8Z+=L3P;q8Z+=P4P;q8Z+=W6P;var C8Z=P4P;C8Z+=L899[643646];C8Z+=k2P;var _this=this;var formContent=$(this[C8Z][n5B]);var fields=this[W6P][q8Z];var order=this[W6P][d8Z];var template=this[W6P][U1B];var mode=this[W6P][l8Z] || U9V;if(includeFields){var r8Z=w0P;r8Z+=M5B;this[W6P][r8Z]=includeFields;}else {var Z8Z=K5B;Z8Z+=A5B;includeFields=this[W6P][Z8Z];}formContent[L5V]()[t8Z]();$[U8P](order,function(i,name){var s5B="[nam";var G5B='[data-editor-template="';var B5B="after";var D5B="akInA";var O5B="editor-fiel";var V5B="_we";var P5B="nod";var X8Z=V5B;R9I.Q9I();X8Z+=D5B;X8Z+=m1V;if(_this[X8Z](name,includeFields) !== -D1P){if(template && mode === U9V){var K8Z=P5B;K8Z+=L899[567670];var M8Z=F3P;M8Z+=q0P;var n8Z=o1V;n8Z+=S1V;var F8Z=K4P;F8Z+=L899[643646];F8Z+=P4P;F8Z+=L899[567670];var R8Z=o1V;R8Z+=S1V;var z8Z=O5B;z8Z+=P4P;z8Z+=s5B;z8Z+=T5B;template[a5B](z8Z + name + R8Z)[B5B](fields[name][F8Z]());template[a5B](G5B + name + n8Z)[M8Z](fields[name][K8Z]());}else {formContent[C6V](fields[name][r3P]());}}});if(template && mode === A8Z){var V8Z=H5V;V8Z+=u5B;template[V8Z](formContent);}this[l8V](D8Z,[this[W6P][P8Z],this[W6P][t4B],formContent]);}function _edit(items,editFields,type,formOptions,setupDone){var I7B="inA";var Y5B="orde";var W5B="slice";var y5B="_acti";var i7B="splic";var p7B="toString";var v5B="onC";var g7B='initEdit';var h5B="editD";var x5B="_displayReo";var U3Z=K4P;U3Z+=h9P;U3Z+=L899[567670];var J8Z=U4B;J8Z+=m7P;J8Z+=O6B;var f8Z=x5B;R9I.Q9I();f8Z+=s5V;var j8Z=r6B;j8Z+=r0P;j8Z+=b7P;var m8Z=Y5B;m8Z+=R4P;var u8Z=L899[567670];u8Z+=F0P;u8Z+=L899.E4P;u8Z+=b7P;var G8Z=y5B;G8Z+=v5B;G8Z+=V8V;var B8Z=L899.L4P;B8Z+=Z7V;var a8Z=j5V;a8Z+=r0P;var T8Z=h5B;T8Z+=U9P;var s8Z=a4P;s8Z+=G4P;s8Z+=A8P;s8Z+=W6P;var O8Z=L899.L4P;O8Z+=w0P;O8Z+=C4V;var _this=this;var fields=this[W6P][O8Z];var usedFields=[];var includeInOrder;var editData={};this[W6P][s8Z]=editFields;this[W6P][T8Z]=editData;this[W6P][I9V]=items;this[W6P][t4B]=a8Z;this[H8V][B8Z][q6V][G6V]=u6V;this[W6P][F5V]=type;this[G8Z]();$[u8Z](fields,function(name,field){var e5B="tiIds";var e8Z=n5V;e8Z+=G2P;e8Z+=e5B;field[i9V]();includeInOrder=K5P;editData[name]={};$[U8P](editFields,function(idSrc,edit){var J5B="yFields";R9I.Q9I();var N5B="scope";var m5B="valFromData";var c7B="displayFi";if(edit[B3P][name]){var val=field[m5B](edit[J4P]);var nullDefault=field[j5B]();editData[name][idSrc]=val === F5P?C5P:Array[G3P](val)?val[W5B]():val;if(!formOptions || formOptions[N5B] === A5P){var v8Z=G6V;v8Z+=o2P;v8Z+=J8P;v8Z+=B8P;var y8Z=f5B;y8Z+=J5B;var Y8Z=P4P;Y8Z+=L899[567670];Y8Z+=L899.L4P;var x8Z=U7B;x8Z+=D5V;field[x8Z](idSrc,val === undefined || nullDefault && val === F5P?field[Y8Z]():val);if(!edit[y8Z] || edit[v8Z][name]){includeInOrder=M5P;}}else {var h8Z=c7B;h8Z+=C4V;if(!edit[v8P] || edit[h8Z][name]){field[g9V](idSrc,val === undefined || nullDefault && val === F5P?field[C4B]():val);includeInOrder=M5P;}}}});if(field[e8Z]()[V7P] !== V1P && includeInOrder){usedFields[e8P](name);}});var currOrder=this[m8Z]()[W5B]();for(var i=currOrder[j8Z] - D1P;i >= V1P;i--){var W8Z=I7B;W8Z+=w9P;W8Z+=C9P;if($[W8Z](currOrder[i][p7B](),usedFields) === -D1P){var N8Z=i7B;N8Z+=L899[567670];currOrder[N8Z](i,D1P);}}this[f8Z](currOrder);this[J8Z](g7B,[pluck(editFields,U3Z)[V1P],pluck(editFields,x9V)[V1P],items,type],function(){var b7B='initMultiEdit';_this[l8V](b7B,[editFields,items,type],function(){setupDone();});});}function _event(trigger,args,promiseComplete){var q7B="ob";var E7B="Han";var d7B="je";var l7B="then";var S7B="result";var w7B="dler";var L7B="Eve";var C7B='Cancelled';var c3Z=k7B;c3Z+=C9P;if(args === void V1P){args=[];}if(promiseComplete === void V1P){promiseComplete=undefined;}if(Array[c3Z](trigger)){var I3Z=G2P;I3Z+=Z0P;I3Z+=H1V;I3Z+=b7P;for(var i=V1P,ien=trigger[I3Z];i < ien;i++){var p3Z=G6P;p3Z+=w5B;this[p3Z](trigger[i],args);}}else {var i3Z=E0P;i3Z+=R4P;i3Z+=L899[567670];var e=$[H7B](trigger);$(this)[o7B](e,args);var result=e[S7B];if(trigger[u2B](i3Z) === V1P && result === K5P){var b3Z=L7B;b3Z+=u0V;var g3Z=Q7B;g3Z+=E7B;g3Z+=w7B;$(this)[g3Z]($[b3Z](trigger + C7B),args);}if(promiseComplete){var H3Z=r0P;H3Z+=b7P;H3Z+=L899[567670];H3Z+=K4P;var k3Z=q7B;k3Z+=d7B;k3Z+=Y9V;if(result && typeof result === k3Z && result[H3Z]){result[l7B](promiseComplete);}else {promiseComplete(result);}}return result;}}function _eventName(input){var R7B="owerCase";R9I.l9I();var z7B="toL";var O1P=3;var X7B="stri";var Z7B=/^on([A-Z])/;var o3Z=G2P;o3Z+=Z0P;o3Z+=P8P;o3Z+=C8P;var name;var names=input[r7B](n3V);for(var i=V1P,ien=names[o3Z];i < ien;i++){var S3Z=t6V;S3Z+=r0P;S3Z+=L899.E4P;S3Z+=b7P;name=names[i];var onStyle=name[S3Z](Z7B);if(onStyle){var Q3Z=t7B;Q3Z+=X7B;Q3Z+=K4P;Q3Z+=P8P;var L3Z=z7B;L3Z+=R7B;name=onStyle[D1P][L3Z]() + name[Q3Z](O1P);}names[i]=name;}return names[N4B](n3V);}function _fieldFromNode(node){var w3Z=S3P;w3Z+=L899[567670];w3Z+=G2P;w3Z+=x8P;var E3Z=L899[567670];E3Z+=F0P;E3Z+=L899.E4P;E3Z+=b7P;var foundField=F5P;$[E3Z](this[W6P][w3Z],function(name,field){var C3Z=b9P;R9I.Q9I();C3Z+=v9P;if($(field[r3P]())[a5B](node)[C3Z]){foundField=field;}});return foundField;}function _fieldNames(fieldNames){if(fieldNames === undefined){return this[B3P]();}else if(!Array[G3P](fieldNames)){return [fieldNames];}return fieldNames;}function _focus(fieldsIn,focus){var M7B='jq:';var n7B="dexOf";var K7B='div.DTE ';var A7B=/^jq:/;var d3Z=F7B;d3Z+=R4P;var q3Z=z8V;q3Z+=U0V;R9I.l9I();var _this=this;if(this[W6P][q3Z] === r2B){return;}var field;var fields=$[t9P](fieldsIn,function(fieldOrName){return typeof fieldOrName === w7P?_this[W6P][B3P][fieldOrName]:fieldOrName;});if(typeof focus === d3Z){field=fields[focus];}else if(focus){var l3Z=q9P;l3Z+=n7B;if(focus[l3Z](M7B) === V1P){field=$(K7B + focus[D2B](A7B,C5P));}else {field=this[W6P][B3P][focus];}}else {var r3Z=L899[403715];r3Z+=u5V;r3Z+=R4P;document[V7B][r3Z]();}this[W6P][D7B]=field;if(field){field[A8V]();}}function _formOptions(opts){var T7B="editCount";var G7B="ttons";var Y7B="ich";var j7B="canReturnSubmit";var B7B="titl";var P7B="eyup";var s7B='.dteInline';var e7B="unct";var m7B="_fieldFromNode";var P3Z=o3P;P3Z+=P7B;var M3Z=L899[643646];M3Z+=K4P;var z3Z=L899.L4P;z3Z+=C3V;z3Z+=L899.w4P;var X3Z=Y1V;X3Z+=W6P;X3Z+=O7B;X3Z+=j2P;var t3Z=W6P;t3Z+=D2P;t3Z+=q9P;t3Z+=P8P;var _this=this;R9I.Q9I();var that=this;var inlineCount=__inlineCounter++;var namespace=s7B + inlineCount;this[W6P][j3P]=opts;this[W6P][T7B]=inlineCount;if(typeof opts[a7B] === w7P || typeof opts[a7B] === y5V){var Z3Z=B7B;Z3Z+=L899[567670];this[a7B](opts[Z3Z]);opts[a7B]=M5P;}if(typeof opts[l4B] === t3Z || typeof opts[X3Z] === z3Z){this[l4B](opts[l4B]);opts[l4B]=M5P;}if(typeof opts[l5B] !== i7V){var n3Z=y4P;n3Z+=H8P;var F3Z=Q7V;F3Z+=G7B;var R3Z=L899[403715];R3Z+=w8V;R3Z+=L899[643646];R3Z+=H8P;this[R3Z](opts[F3Z]);opts[n3Z]=M5P;}$(document)[M3Z](u7B + namespace,function(e){var x7B="wh";var y7B="tiveEle";var h7B="Submit";var v7B="canReturn";var K3Z=x7B;K3Z+=Y7B;if(e[K3Z] === G1P && _this[W6P][E5B]){var A3Z=Q4V;A3Z+=y7B;A3Z+=k2P;A3Z+=O6B;var el=$(document[A3Z]);if(el){var D3Z=v7B;D3Z+=h7B;var V3Z=L899.L4P;V3Z+=e7B;V3Z+=U0V;var field=_this[m7B](el);if(field && typeof field[j7B] === V3Z && field[D3Z](el)){e[s3V]();}}}});$(document)[y9P](P3Z + namespace,function(e){var Q8B="gg";var L8B="ri";var g8B="lur";var N7B="layed";var j1P=39;var S8B="ocus";var p8B="onEsc";var i8B='blur';var I8B="onReturn";var m1P=37;var J7B="nR";var e1P=27;var k8B='.DTE_Form_Buttons';var f7B="iveEleme";var c8B="bmi";var v3Z=E2B;v3Z+=h7P;v3Z+=W7B;var u3Z=m0P;u3Z+=b7P;u3Z+=w0P;u3Z+=y8P;var s3Z=F8P;s3Z+=N7B;var O3Z=z8V;O3Z+=f7B;O3Z+=u0V;var el=$(document[O3Z]);if(e[V3V] === G1P && _this[W6P][s3Z]){var T3Z=L899.L4P;T3Z+=e7B;T3Z+=w0P;T3Z+=y9P;var field=_this[m7B](el);if(field && typeof field[j7B] === T3Z && field[j7B](el)){var B3Z=W6P;B3Z+=H3V;var a3Z=L899[643646];a3Z+=J7B;a3Z+=s0V;a3Z+=U8B;if(opts[a3Z] === B3Z){var G3Z=W6P;G3Z+=b2P;G3Z+=c8B;G3Z+=r0P;e[s3V]();_this[G3Z]();}else if(typeof opts[I8B] === y5V){e[s3V]();opts[I8B](_this,e);}}}else if(e[u3Z] === e1P){var Y3Z=y9P;Y3Z+=N6P;Y3Z+=W6P;Y3Z+=L899.E4P;e[s3V]();if(typeof opts[p8B] === y5V){opts[p8B](that,e);}else if(opts[p8B] === i8B){var x3Z=L899[403715];x3Z+=g8B;that[x3Z]();}else if(opts[p8B] === z5P){that[W6V]();}else if(opts[Y3Z] === h5V){var y3Z=W6P;y3Z+=b8B;y3Z+=w0P;y3Z+=r0P;that[y3Z]();}}else if(el[v3Z](k8B)[V7P]){var W3Z=m0P;W3Z+=b7P;W3Z+=Y7B;var h3Z=m0P;h3Z+=b7P;h3Z+=w0P;h3Z+=y8P;if(e[h3Z] === m1P){var j3Z=L899.L4P;j3Z+=L899[643646];j3Z+=H8B;var m3Z=D2P;m3Z+=w0P;m3Z+=o8B;var e3Z=Q7V;e3Z+=T8P;e3Z+=L899[643646];e3Z+=K4P;el[D3V](e3Z)[m3Z](j3Z);}else if(e[W3Z] === j1P){var U9Z=L899.L4P;U9Z+=S8B;var J3Z=r0P;J3Z+=L8B;J3Z+=Q8B;J3Z+=E2P;var f3Z=Q7V;f3Z+=E8B;f3Z+=K4P;var N3Z=d6P;N3Z+=r2P;N3Z+=r0P;el[N3Z](f3Z)[J3Z](U9Z);}}});this[W6P][o5B]=function(){var w8B="eyd";var c9Z=o3P;c9Z+=w8B;c9Z+=C8B;$(document)[O3P](c9Z + namespace);$(document)[O3P](A3V + namespace);};return namespace;}function _inline(editFields,opts,closeCb){var u8B='.';var y8B="est";var Y8B="lick.dte-submit";var t8B="attac";var r8B="Trigger";var A8B="ss=";var G8B="liner";var Z8B="lin";var D8B="sty";var T8B="userAgent";var O8B="dg";var s8B="contents";var M8B="</di";var K8B="<div cla";var z8B="ttachF";var B8B='<div class="DTE_Processing_Indicator"><span></span></div>';var d8B="_f";var v8B="childNodes";var P8B="le=\"width:";var n8B="tons";var h8B="submitHtml";var E1K=w0P;E1K+=q8B;var Q1K=L899.L4P;Q1K+=L899[643646];Q1K+=H8B;var S1K=k2P;S1K+=z9P;var o1K=d8B;o1K+=r0B;o1K+=b2P;o1K+=W6P;var P9Z=z3V;P9Z+=L899[403715];P9Z+=l8B;P9Z+=r8B;var k9Z=q9P;k9Z+=Z8B;k9Z+=L899[567670];var i9Z=r6B;i9Z+=r0P;i9Z+=b7P;var p9Z=t8B;p9Z+=b7P;var I9Z=a2P;I9Z+=F0P;I9Z+=X8B;var _this=this;if(closeCb === void V1P){closeCb=F5P;}var closed=K5P;var classes=this[I9Z][e1B];var keys=Object[h8P](editFields);var editRow=editFields[keys[V1P]];var children=F5P;var lastAttachPoint;var elements=[];for(var i=V1P;i < editRow[p9Z][i9Z];i++){var b9Z=L899.L4P;b9Z+=w0P;b9Z+=C4V;var g9Z=F0P;g9Z+=z8B;g9Z+=u8P;g9Z+=x8P;var name_1=editRow[g9Z][i][V1P];elements[e8P]({field:this[W6P][b9Z][name_1],name:name_1,node:$(editRow[G8P][i])});}var namespace=this[o0B](opts);var ret=this[B4B](k9Z);if(!ret){return this;}for(var i=V1P;i < elements[V7P];i++){var M9Z=K4P;M9Z+=L899[643646];M9Z+=P4P;M9Z+=L899[567670];var n9Z=S3P;n9Z+=f3V;var F9Z=p9V;F9Z+=R8B;var R9Z=K4P;R9Z+=L899[643646];R9Z+=P4P;R9Z+=L899[567670];var z9Z=L899.L4P;z9Z+=w0P;z9Z+=L3P;z9Z+=P4P;var X9Z=S3P;X9Z+=d0P;var t9Z=F8B;t9Z+=N0P;t9Z+=m7P;t9Z+=Q3P;var Z9Z=L899[403715];Z9Z+=b2P;Z9Z+=r0P;Z9Z+=n8B;var r9Z=M8B;r9Z+=m7P;r9Z+=Q3P;var l9Z=o1V;l9Z+=M1B;var d9Z=G2P;d9Z+=q9P;d9Z+=L899[567670];d9Z+=R4P;var q9Z=K8B;q9Z+=A8B;q9Z+=o1V;var C9Z=E0V;C9Z+=e2B;C9Z+=L899[567670];C9Z+=R4P;var w9Z=V8B;w9Z+=G7V;var E9Z=F0P;E9Z+=h2V;E9Z+=P4P;var Q9Z=E0P;Q9Z+=r2P;Q9Z+=o1V;var L9Z=D8B;L9Z+=P8B;var S9Z=N6P;S9Z+=O8B;S9Z+=L899[567670];S9Z+=Z3V;var o9Z=P4P;o9Z+=F2V;var H9Z=y8P;H9Z+=w0P;H9Z+=G2P;H9Z+=z7V;var el=elements[i];var node=el[r3P];elements[i][H9Z]=node[s8B]()[o9Z]();var style=navigator[T8B][u2B](S9Z) !== -D1P?L9Z + node[J8V]() + Q9Z:C5P;node[E9Z]($(w9Z + classes[C9Z] + i8V + q9Z + classes[d9Z] + l9Z + style + a8B + B8B + r9Z + c8V + classes[Z9Z] + t9Z + Q2V));node[X9Z](B0B + classes[G8B][D2B](/ /g,u8B))[C6V](el[z9Z][R9Z]())[C6V](this[H8V][F9Z]);lastAttachPoint=el[n9Z][M9Z]();if(opts[l5B]){var D9Z=L899[403715];D9Z+=b2P;D9Z+=T8P;D9Z+=m7V;var V9Z=L899[403715];V9Z+=b2P;V9Z+=E8B;V9Z+=H8P;var A9Z=P4P;A9Z+=w0P;A9Z+=m7P;A9Z+=x8B;var K9Z=S3P;K9Z+=K4P;K9Z+=P4P;node[K9Z](A9Z + classes[V9Z][D2B](/ /g,u8B))[C6V](this[H8V][D9Z]);}}var submitTrigger=opts[P9Z];if(submitTrigger !== F5P){var v9Z=F3P;v9Z+=L899[567670];v9Z+=d0P;var Y9Z=L899.E4P;Y9Z+=Y8B;var x9Z=L899[643646];x9Z+=K4P;var u9Z=P4P;u9Z+=F2V;var G9Z=W6P;G9Z+=J3P;var B9Z=L899.L4P;B9Z+=R4P;B9Z+=L899[643646];B9Z+=k2P;var O9Z=F7B;O9Z+=R4P;if(typeof submitTrigger === O9Z){var a9Z=G2P;a9Z+=L899[567670];a9Z+=K4P;a9Z+=v9P;var T9Z=r0P;T9Z+=R4P;var s9Z=a2P;s9Z+=u2P;s9Z+=y8B;var kids=$(lastAttachPoint)[s9Z](T9Z)[L5V]();submitTrigger=submitTrigger < V1P?kids[kids[a9Z] + submitTrigger]:kids[submitTrigger];}children=Array[B9Z]($(submitTrigger)[V1P][v8B])[G9Z]();$(children)[u9Z]();$(submitTrigger)[x9Z](Y9Z,function(e){var y9Z=t7B;y9Z+=l8B;e[b5V]();_this[y9Z]();})[v9Z](opts[h8B]);}this[r8V](function(submitComplete,action){var N8B=".dte-submit";var W8B="forEa";var e8B="earD";R9I.Q9I();var m8B="ynamic";var f9Z=I5B;f9Z+=e8B;f9Z+=m8B;f9Z+=j8B;var e9Z=a2P;e9Z+=w0P;e9Z+=L899.E4P;e9Z+=o3P;var h9Z=W9V;h9Z+=L899.L4P;closed=M5P;$(document)[h9Z](e9Z + namespace);if(!submitComplete || action !== X9P){var m9Z=W8B;m9Z+=y8P;elements[m9Z](function(el){var W9Z=K4P;W9Z+=L899[643646];W9Z+=P4P;W9Z+=L899[567670];var j9Z=j8P;j9Z+=r0P;j9Z+=Q4V;j9Z+=b7P;el[r3P][s8B]()[j9Z]();el[W9Z][C6V](el[L5V]);});}if(submitTrigger){var N9Z=D2V;N9Z+=N8B;$(submitTrigger)[O3P](N9Z)[L3V]()[C6V](children);}_this[f9Z]();if(closeCb){closeCb();}return f8B;;});setTimeout(function(){var J8B="used";var U3B="addBack";var c3B='addBack';var c1K=a2P;c1K+=w0P;c1K+=L899.E4P;c1K+=o3P;var U1K=e7P;U1K+=J8B;U1K+=C8B;var J9Z=L899.L4P;J9Z+=K4P;if(closed){return;}var back=$[J9Z][U3B]?c3B:k4V;var target;$(document)[y9P](U1K + namespace,function(e){target=e[u9V];})[y9P](c1K + namespace,function(e){var p3B="inArra";var I1K=r6B;R9I.l9I();I1K+=C8P;var isIn=K5P;for(var i=V1P;i < elements[I1K];i++){var H1K=I3B;H1K+=L899[567670];H1K+=u0V;H1K+=W6P;var k1K=K4P;k1K+=h9P;k1K+=L899[567670];var b1K=p3B;b1K+=d2P;var g1K=l4V;g1K+=K4P;g1K+=W6P;var i1K=i3B;i1K+=E0P;i1K+=g3B;var p1K=L899.L4P;p1K+=J8P;p1K+=G2P;p1K+=P4P;if(elements[i][p1K][i1K](g1K,target) || $[b1K](elements[i][k1K][V1P],$(target)[H1K]()[back]()) !== -D1P){isIn=M5P;}}if(!isIn){_this[v5V]();}});},V1P);this[o1K]($[S1K](elements,function(el){R9I.l9I();var L1K=S3P;L1K+=L899[567670];L1K+=b1V;return el[L1K];}),opts[Q1K]);this[X8V](E1K,M5P);}function _optionsUpdate(json){var that=this;R9I.l9I();if(json[b3B]){var C1K=u1B;C1K+=x8P;var w1K=L899[567670];w1K+=Q4V;w1K+=b7P;$[w1K](this[W6P][C1K],function(name,field){if(json[b3B][name] !== undefined){var q1K=b2P;q1K+=E0P;q1K+=X0P;q1K+=f4P;var fieldInst=that[P9V](name);if(fieldInst && fieldInst[q1K]){var d1K=L899[643646];d1K+=e7V;d1K+=L899[643646];d1K+=H8P;fieldInst[k3B](json[d1K][name]);}}});}}function _message(el,msg,title,fn){var H3B="adeO";var Q3B="fa";R9I.Q9I();var o3B="tm";var w3B="blo";var E3B="eIn";var L3B="removeAttr";var l1K=L899.L4P;l1K+=K4P;var canAnimate=$[l1K][n0V]?M5P:K5P;if(title === undefined){title=K5P;}if(!fn){fn=function(){};}if(typeof msg === y5V){var r1K=p9P;r1K+=L899[403715];r1K+=G2P;r1K+=L899[567670];msg=msg(this,new DataTable$3[p0V](this[W6P][r1K]));}el=$(el);if(canAnimate){var Z1K=W6P;Z1K+=h6V;el[Z1K]();}if(!msg){if(this[W6P][E5B] && canAnimate){var t1K=L899.L4P;t1K+=H3B;t1K+=b2P;t1K+=r0P;el[t1K](function(){var X1K=b7P;X1K+=o3B;X1K+=G2P;el[X1K](C5P);fn();});}else {var R1K=P4P;R1K+=w0P;R1K+=S3B;var z1K=D0B;z1K+=P0B;el[z1K](C5P)[C2V](R1K,G7P);fn();}if(title){el[L3B](N6V);}}else {fn();if(this[W6P][E5B] && canAnimate){var F1K=Q3B;F1K+=P4P;F1K+=E3B;el[h1V](msg)[F1K]();}else {var M1K=w3B;M1K+=x2V;var n1K=b7P;n1K+=o3B;n1K+=G2P;el[n1K](msg)[C2V](C3B,M1K);}if(title){var K1K=q3V;K1K+=r0P;K1K+=U2P;el[R1V](K1K,msg);}}}function _multiInfo(){var r3B="multiInfoShown";var q3B="includeField";var A1K=q3B;A1K+=W6P;var fields=this[W6P][B3P];var include=this[W6P][A1K];var show=M5P;var state;if(!include){return;}R9I.l9I();for(var i=V1P,ien=include[V7P];i < ien;i++){var field=fields[include[i]];var multiEditable=field[d3B]();if(field[l3B]() && multiEditable && show){state=M5P;show=K5P;}else if(field[l3B]() && !multiEditable){state=M5P;}else {state=K5P;}fields[include[i]][r3B](state);}}function _nestedClose(cb){var Z3B="layContro";var t3B="ller";var R3B="callback";var F3B="yCon";R9I.l9I();var z3B="dte";var X3B="pop";var D1K=U2P;D1K+=K4P;D1K+=H1V;D1K+=b7P;var V1K=G6P;V1K+=q0B;var disCtrl=this[W6P][c1B];var show=disCtrl[V1K];if(!show || !show[D1K]){if(cb){cb();}}else if(show[V7P] > D1P){var T1K=F0P;T1K+=E0P;T1K+=r7V;var s1K=L899[643646];s1K+=E0P;s1K+=L899[567670];s1K+=K4P;var O1K=F8P;O1K+=Z3B;O1K+=t3B;var P1K=b9P;P1K+=P8P;P1K+=C8P;show[X3B]();var last=show[show[P1K] - D1P];if(cb){cb();}this[W6P][O1K][s1K](last[z3B],last[T1K],last[R3B]);}else {var a1K=f5B;a1K+=F3B;a1K+=n3B;this[W6P][a1K][W6V](this,cb);show[V7P]=V1P;}}function _nestedOpen(cb,nest){var K3B="layCon";var A3B="_show";var V3B="_sho";var y1K=d0V;y1K+=M3B;var Y1K=P4P;Y1K+=U3V;var x1K=u8V;x1K+=f3P;x1K+=K3B;x1K+=n3B;var u1K=k5V;u1K+=K6V;var disCtrl=this[W6P][c1B];if(!disCtrl[A3B]){var B1K=G6P;B1K+=M0B;B1K+=l4V;disCtrl[B1K]=[];}if(!nest){var G1K=V3B;G1K+=m0P;disCtrl[G1K][V7P]=V1P;}disCtrl[A3B][e8P]({dte:this,append:this[H8V][u1K],callback:cb});this[W6P][x1K][F8V](this,this[Y1K][y1K],cb);}function _postopen(type,immediate){var s3B="bmit.";var O3B="bb";var P3B="ultiInfo";var W3B='opened';var B3B="ternal";var T3B="tor-internal";var G3B="captureFocus";var Y3B="ody";R9I.Q9I();var a3B="submit.edi";var g4K=Q4V;g4K+=r0P;g4K+=U0V;var i4K=U4B;i4K+=m7P;i4K+=O6B;var p4K=D3B;p4K+=P3B;var W1K=Q7V;W1K+=O3B;W1K+=G2P;W1K+=L899[567670];var m1K=z3V;m1K+=s3B;m1K+=j5V;m1K+=T3B;var e1K=a3B;e1K+=l1V;e1K+=q9P;e1K+=B3B;var h1K=L899[643646];h1K+=L899.L4P;h1K+=L899.L4P;var v1K=P4P;v1K+=L899[643646];v1K+=k2P;var _this=this;var focusCapture=this[W6P][c1B][G3B];if(focusCapture === undefined){focusCapture=M5P;}$(this[v1K][p9V])[h1K](e1K)[y9P](m1K,function(e){R9I.Q9I();var x3B="tDefault";var u3B="preven";var j1K=u3B;j1K+=x3B;e[j1K]();});if(focusCapture && (type === U9V || type === W1K)){var f1K=L899[643646];f1K+=K4P;var N1K=L899[403715];N1K+=Y3B;$(N1K)[f1K](Q5B,function(){var y3B="ED";var h3B='.DTE';var e3B="Focu";var v3B="are";var c4K=x8B;c4K+=F4P;c4K+=Y6P;c4K+=y3B;var U4K=E0P;U4K+=v3B;U4K+=K4P;U4K+=I4V;var J1K=E2B;J1K+=h7P;J1K+=W7B;if($(document[V7B])[J1K](h3B)[V7P] === V1P && $(document[V7B])[U4K](c4K)[V7P] === V1P){var I4K=j8V;I4K+=e3B;I4K+=W6P;if(_this[W6P][I4K]){_this[W6P][D7B][A8V]();}}});}this[p4K]();this[i4K](m3B,[type,this[W6P][g4K]]);if(immediate){var b4K=j3B;b4K+=r0P;this[b4K](W3B,[type,this[W6P][t4B]]);}return M5P;}function _preopen(type){var N3B="ye";var J3B="lose";var I9B="Open";var c9B="cancel";var E4K=f5B;E4K+=N3B;E4K+=P4P;R9I.Q9I();var k4K=F0P;k4K+=Y9V;k4K+=U0V;if(this[l8V](f3B,[type,this[W6P][k4K]]) === K5P){var Q4K=L899.E4P;Q4K+=J3B;Q4K+=U9B;Q4K+=L5B;var L4K=L899[403715];L4K+=o7V;L4K+=G2P;L4K+=L899[567670];var S4K=k2P;S4K+=L899[643646];S4K+=P4P;S4K+=L899[567670];var o4K=F0P;o4K+=L899.E4P;o4K+=r0P;o4K+=U0V;var H4K=c9B;H4K+=I9B;this[d8V]();this[l8V](H4K,[type,this[W6P][o4K]]);if((this[W6P][S4K] === f8B || this[W6P][F5V] === L4K) && this[W6P][o5B]){this[W6P][o5B]();}this[W6P][Q4K]=F5P;return K5P;}this[d8V](M5P);this[W6P][E4K]=type;return M5P;}function _processing(processing){var i9B="toggl";var k9B="ive";var p9B="ssin";var g9B="eCl";var o9B='div.DTE';var l4K=n6B;l4K+=L899[567670];l4K+=p9B;l4K+=P8P;var d4K=i9B;d4K+=g9B;d4K+=b9B;var q4K=P4P;q4K+=L899[643646];q4K+=k2P;var C4K=F0P;C4K+=L899.E4P;C4K+=r0P;C4K+=k9B;var w4K=H9B;w4K+=p9B;w4K+=P8P;var procClass=this[J7V][w4K][C4K];$([o9B,this[q4K][P0V]])[d4K](procClass,processing);this[W6P][F4V]=processing;this[l8V](l4K,[processing]);}function _noProcessing(args){var r4K=L899[567670];r4K+=F0P;r4K+=L899.E4P;r4K+=b7P;var processing=K5P;$[r4K](this[W6P][B3P],function(name,field){if(field[F4V]()){processing=M5P;}});R9I.l9I();if(processing){var t4K=S9B;t4K+=f3V;var Z4K=L899[643646];Z4K+=K4P;Z4K+=L899[567670];this[Z4K](t4K,function(){R9I.l9I();if(this[L9B](args) === M5P){this[F0B][Q9B](this,args);}});}return !processing;}function _submit(successCallback,errorCallback,formatdata,hide){var D9B="mp";var O9B="onComp";var Y1P=16;var d9B='Field is still processing';var V9B="onCo";var K9B='allIfChanged';var q9B="editData";var P9B="mplete";var w9B="tionNa";var C9B="Cou";var T9B='preSubmit';var A9B="_processi";var c0K=L899[567670];c0K+=X4P;c0K+=L899[567670];c0K+=d0P;var f4K=O4P;f4K+=l9P;var n4K=E9B;n4K+=O6P;n4K+=L899[567670];var F4K=Q4V;F4K+=w9B;F4K+=k2P;F4K+=L899[567670];var R4K=F0P;R4K+=B9P;R4K+=y9P;var z4K=o8P;z4K+=W6P;var X4K=L899[567670];X4K+=R6P;X4K+=C9B;X4K+=u0V;var _this=this;var changed=K5P,allData={},changedData={};var setBuilder=dataSet;var fields=this[W6P][B3P];var editCount=this[W6P][X4K];var editFields=this[W6P][z4K];R9I.l9I();var editData=this[W6P][q9B];var opts=this[W6P][j3P];var changedSubmit=opts[e5V];var submitParamsLocal;if(this[L9B](arguments) === K5P){Editor[i8P](d9B,Y1P,K5P);return;}var action=this[W6P][R4K];var submitParams={"data":{}};submitParams[this[W6P][F4K]]=action;if(action === n4K || action === u4P){var x4K=L899.E4P;x4K+=l9B;x4K+=L899[567670];var M4K=L899[567670];M4K+=F0P;M4K+=L899.E4P;M4K+=b7P;$[M4K](editFields,function(idSrc,edit){var K4K=L899[567670];K4K+=F0P;K4K+=y8P;R9I.Q9I();var allRowData={};var changedRowData={};$[K4K](fields,function(name,field){var M9B='-many-count';var n9B=/\[.*$/;var t9B="[";var Z9B="place";var F9B="lF";var X9B="xO";R9I.Q9I();var z9B="iGet";if(edit[B3P][name] && field[r9B]()){var G4K=p3P;G4K+=k2P;G4K+=E2B;G4K+=h7P;var B4K=j5V;B4K+=r0P;var T4K=R4P;T4K+=L899[567670];T4K+=Z9B;var s4K=t9B;s4K+=S1V;var O4K=X2B;O4K+=X9B;O4K+=L899.L4P;var P4K=Q8P;P4K+=E8P;var A4K=n5V;A4K+=G2P;A4K+=r0P;A4K+=z9B;var multiGet=field[A4K]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var D4K=P4P;D4K+=U9P;var V4K=R9B;V4K+=F9B;V4K+=S9P;V4K+=S8P;var originalVal=field[V4K](edit[D4K]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[P4K](value) && typeof name === w7P && name[O4K](s4K) !== -D1P?setBuilder(name[T4K](n9B,C5P) + M9B):F5P;builder(allRowData,value);if(manyBuilder){var a4K=U2P;a4K+=Y9P;manyBuilder(allRowData,value[a4K]);}if(action === B4K && (!editData[name] || !field[G4K](value,editData[name][idSrc]))){builder(changedRowData,value);changed=M5P;if(manyBuilder){var u4K=r6B;u4K+=C8P;manyBuilder(changedRowData,value[u4K]);}}}});if(!$[M9P](allRowData)){allData[idSrc]=allRowData;}if(!$[M9P](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === x4K || changedSubmit === R5P || changedSubmit === K9B && changed){var Y4K=P4P;Y4K+=F0P;Y4K+=p9P;submitParams[Y4K]=allData;}else if(changedSubmit === c7P && changed){var y4K=X0P;y4K+=r0P;y4K+=F0P;submitParams[y4K]=changedData;}else {var N4K=U4B;N4K+=m0V;N4K+=u0V;var W4K=A9B;W4K+=K4P;W4K+=P8P;var m4K=L899.L4P;m4K+=L899.Q4P;m4K+=L899.E4P;m4K+=L899.w4P;var e4K=V9B;e4K+=D9B;e4K+=U2P;e4K+=f4P;var h4K=V9B;h4K+=P9B;var v4K=Q4V;v4K+=q3V;v4K+=y9P;this[W6P][v4K]=F5P;if(opts[h4K] === z5P && (hide === undefined || hide)){this[t8V](K5P);}else if(typeof opts[e4K] === m4K){var j4K=O9B;j4K+=G2P;j4K+=s0V;j4K+=L899[567670];opts[j4K](this);}if(successCallback){successCallback[W3P](this);}this[W4K](K5P);this[N4K](s9B);return;}}else if(action === f4K){var J4K=d8P;J4K+=b7P;$[J4K](editFields,function(idSrc,edit){var U0K=P4P;U0K+=F0P;U0K+=r0P;U0K+=F0P;submitParams[U0K][idSrc]=edit[J4P];});}submitParamsLocal=$[c0K](M5P,{},submitParams);if(formatdata){formatdata(submitParams);}this[l8V](T9B,[submitParams,action],function(result){R9I.Q9I();var u9B="_aj";var G9B="ubmitTa";var B9B="_s";if(result === K5P){_this[a9B](K5P);}else {var i0K=B9B;i0K+=G9B;i0K+=I0V;var p0K=u9B;p0K+=F0P;p0K+=r2P;var I0K=F0P;I0K+=L899[228964];I0K+=F0P;I0K+=r2P;var submitWire=_this[W6P][I0K]?_this[p0K]:_this[i0K];submitWire[W3P](_this,submitParams,function(json,notGood,xhr){_this[x9B](json,notGood,submitParams,submitParamsLocal,_this[W6P][t4B],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){R9I.Q9I();var Y9B="_submitErr";var g0K=Y9B;g0K+=Z6V;_this[g0K](xhr,err,thrown,errorCallback,submitParams,_this[W6P][t4B]);},submitParams);}});}function _submitTable(data,success,error,submitParams){var y9B="remo";var h9B="fier";var v9B="rc";var H0K=y9B;H0K+=m0V;var k0K=f1V;k0K+=H2P;k0K+=v9B;var b0K=F0P;b0K+=L899.E4P;b0K+=x9P;b0K+=K4P;R9I.l9I();var action=data[b0K];var out={data:[]};var idGet=dataGet(this[W6P][k0K]);var idSet=dataSet(this[W6P][a3P]);if(action !== H0K){var w0K=X0P;w0K+=p9P;var E0K=L899[567670];E0K+=F0P;E0K+=y8P;var Q0K=k2P;Q0K+=h9P;Q0K+=w0P;Q0K+=h9B;var L0K=e7P;L0K+=P4P;L0K+=w0P;L0K+=h9B;var S0K=Q5V;S0K+=B8P;var o0K=e9B;o0K+=q7P;var originalData=this[W6P][F5V] === U9V?this[o0K](S0K,this[L0K]()):this[R5V](b7V,this[Q0K]());$[E0K](data[w0K],function(key,vals){var m9B="oStri";var r0K=E0P;r0K+=b2P;r0K+=W6P;r0K+=b7P;var l0K=R0P;l0K+=F0P;var q0K=L899.E4P;q0K+=l9B;q0K+=L899[567670];var toSave;var extender=extend;if(action === X9P){var C0K=P4P;C0K+=F0P;C0K+=p9P;var rowData=originalData[key][C0K];toSave=extender({},rowData,M5P);toSave=extender(toSave,vals,M5P);}else {toSave=extender({},vals,M5P);}var overrideId=idGet(toSave);if(action === q0K && overrideId === undefined){var d0K=r0P;d0K+=m9B;d0K+=R0B;idSet(toSave,+new Date() + key[d0K]());}else {idSet(toSave,overrideId);}out[l0K][r0K](toSave);});}success(out);}function _submitSuccess(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var Z1x="ccess";var v1x="ids";var l1x="bm";var K1x="ataSourc";var F1x="_dat";var D1x="dataSour";var T1x='preEdit';var n1x="etData";var f9B="fieldErro";var u1x="postRem";var z1x="emov";var P1x="ven";var G1x="ource";var A1x="postCr";var J9B="tOp";var e1x="onComplete";var c1x="<b";var h1x='commit';var B1x="dataS";var s1x="Sourc";var r1x="itSu";var R1x="comm";var q1x='submitUnsuccessful';var W9B="rocessing";var a1x='postEdit';var m1x="onCom";var y1x='prep';var N9B="err";var d1x="cal";var O1x='preCreate';var X1x="editCoun";var x1x="preR";var Z6K=j9B;Z6K+=W9B;var R0K=N9B;R0K+=L899[643646];R0K+=R4P;var z0K=f9B;z0K+=D6B;var t0K=P6B;t0K+=L899[567670];t0K+=u0V;var Z0K=j5V;Z0K+=J9B;Z0K+=I4V;var _this=this;var that=this;var setData;var fields=this[W6P][B3P];var opts=this[W6P][Z0K];var modifier=this[W6P][I9V];this[t0K](U1x,[json,submitParams,action,xhr]);if(!json[i8P]){var X0K=L899[567670];X0K+=R4P;X0K+=S9P;X0K+=R4P;json[X0K]=L899.d4P;}if(!json[z0K]){json[G6B]=[];}if(notGood || json[R0K] || json[G6B][V7P]){var a0K=c1x;a0K+=R4P;a0K+=Q3P;var T0K=L899[567670];T0K+=R4P;T0K+=T6P;var globalError=[];if(json[i8P]){var F0K=E2P;F0K+=T6P;globalError[e8P](json[F0K]);}$[U8P](json[G6B],function(i,err){var i1x="Unknown f";var S1x="yConte";var p1x="ayed";var C1x=': ';var o1x='focus';var g1x="ield: ";var k1x="ldError";var w1x="Err";var b1x="nFie";var H1x="onFieldError";var E1x="dError";var Q1x="nFiel";var K0K=I1x;K0K+=p1x;var n0K=K4P;R9I.l9I();n0K+=F0P;n0K+=k2P;n0K+=L899[567670];var field=fields[err[n0K]];if(!field){var M0K=i1x;M0K+=g1x;throw new Error(M0K + err[L8P]);}else if(field[K0K]()){field[i8P](err[u6B] || R8B);if(i === V1P){var V0K=L899[643646];V0K+=b1x;V0K+=k1x;if(opts[H1x] === o1x){var A0K=L899[403715];A0K+=h9P;A0K+=S1x;A0K+=u0V;_this[z2V]($(_this[H8V][A0K]),{scrollTop:$(field[r3P]())[L1x]()[h6V]},c4P);field[A8V]();}else if(typeof opts[V0K] === y5V){var D0K=L899[643646];D0K+=Q1x;D0K+=E1x;opts[D0K](_this,err);}}}else {var s0K=w1x;s0K+=Z6V;var O0K=x1V;O0K+=k2P;O0K+=L899[567670];var P0K=O8P;P0K+=W6P;P0K+=b7P;globalError[P0K](field[O0K]() + C1x + (err[u6B] || s0K));}});this[T0K](globalError[N4B](a0K));this[l8V](q1x,[json]);if(errorCallback){var B0K=d1x;B0K+=G2P;errorCallback[B0K](that,json);}}else {var r6K=z3V;r6K+=l1x;r6K+=r1x;r6K+=Z1x;var l6K=G6P;l6K+=t1x;l6K+=O6B;var L6K=X1x;L6K+=r0P;var p6K=R4P;p6K+=z1x;p6K+=L899[567670];var G0K=W3V;G0K+=L899[567670];var store={};if(json[J4P] && (action === G0K || action === u4P)){var I6K=P4P;I6K+=F0P;I6K+=r0P;I6K+=F0P;var c6K=R1x;c6K+=G4P;var U6K=F1x;U6K+=k4B;var x0K=U2P;x0K+=K4P;x0K+=H1V;x0K+=b7P;var u0K=E0P;u0K+=R4P;u0K+=L7P;this[R5V](u0K,action,modifier,submitParamsLocal,json,store);for(var i=V1P;i < json[J4P][x0K];i++){var e0K=W6P;e0K+=n1x;var h0K=n8V;h0K+=K4P;h0K+=r0P;var v0K=w0P;v0K+=P4P;var y0K=M1x;y0K+=K1x;y0K+=L899[567670];var Y0K=R0P;Y0K+=F0P;setData=json[Y0K][i];var id=this[y0K](v0K,setData);this[h0K](e0K,[json,setData,action]);if(action === c9V){var W0K=A1x;W0K+=V1x;var j0K=G6P;j0K+=D1x;j0K+=q7P;var m0K=G6P;m0K+=L899[567670];m0K+=P1x;m0K+=r0P;this[m0K](O1x,[json,setData,id]);this[j0K](b0V,fields,setData,store);this[l8V]([b0V,W0K],[json,setData,id]);}else if(action === u4P){var J0K=L899[567670];J0K+=P4P;J0K+=G4P;var f0K=G6P;f0K+=J4P;f0K+=s1x;f0K+=L899[567670];var N0K=P6B;N0K+=Z0P;N0K+=r0P;this[N0K](T1x,[json,setData,id]);this[f0K](J0K,modifier,fields,setData,store);this[l8V]([X9P,a1x],[json,setData,id]);}}this[U6K](c6K,action,modifier,json[I6K],store);}else if(action === p6K){var S6K=P4P;S6K+=U9P;var o6K=G6P;o6K+=B1x;o6K+=G1x;var H6K=u1x;H6K+=L899[643646];H6K+=m0V;var k6K=h7P;k6K+=k2P;k6K+=L899[643646];k6K+=m0V;var b6K=e9B;b6K+=q7P;var g6K=x1x;g6K+=L899[567670];g6K+=A4P;var i6K=U4B;i6K+=Y1x;this[R5V](y1x,action,modifier,submitParamsLocal,json,store);this[i6K](g6K,[json,this[v1x]()]);this[b6K](r2B,modifier,fields,store);this[l8V]([k6K,H6K],[json,this[v1x]()]);this[o6K](h1x,action,modifier,json[S6K],store);}if(editCount === this[W6P][L6K]){var w6K=L899.E4P;w6K+=U5V;w6K+=W6P;w6K+=L899[567670];var E6K=F0P;E6K+=X3V;var Q6K=Q4V;Q6K+=L899.w4P;var action_1=this[W6P][Q6K];this[W6P][E6K]=F5P;if(opts[e1x] === w6K && (hide === undefined || hide)){var q6K=P4P;q6K+=O6P;q6K+=F0P;var C6K=G6P;C6K+=a2P;C6K+=L899[643646];C6K+=h4P;this[C6K](json[q6K]?M5P:K5P,action_1);}else if(typeof opts[e1x] === y5V){var d6K=m1x;d6K+=j1x;opts[d6K](this);}}if(successCallback){successCallback[W3P](that,json);}this[l6K](r6K,[json,setData,action]);}this[Z6K](K5P);this[l8V](s9B,[json,setData,action]);}function _submitError(xhr,err,thrown,errorCallback,submitParams,action){var f1x="yst";var N1x="mitError";var W1x="bmitComp";var K6K=z3V;K6K+=W1x;K6K+=U2P;K6K+=f4P;var M6K=t7B;M6K+=N1x;var n6K=G6P;n6K+=L899[567670];n6K+=m7P;n6K+=O6B;var R6K=W6P;R6K+=f1x;R6K+=J1x;var z6K=L899[567670];R9I.l9I();z6K+=w9P;z6K+=Z6V;var X6K=k6V;X6K+=T7V;var t6K=j3B;t6K+=r0P;this[t6K](U1x,[F5P,submitParams,action,xhr]);this[i8P](this[X6K][z6K][R6K]);this[a9B](K5P);if(errorCallback){var F6K=L899.E4P;F6K+=X4V;F6K+=G2P;errorCallback[F6K](this,xhr,err,thrown);}this[n6K]([M6K,K6K],[xhr,err,thrown,submitParams]);}function _tidy(fn){var a1P=10;var c4x="processin";var U4x="bubbl";var I4x="rverS";var B6K=U4x;B6K+=L899[567670];var a6K=q9P;a6K+=G2P;a6K+=J1B;var s6K=c4x;s6K+=P8P;var P6K=K0B;P6K+=U2P;var D6K=Q0P;D6K+=E0P;D6K+=w0P;var V6K=L899.L4P;V6K+=K4P;var A6K=r0P;A6K+=P3P;R9I.Q9I();var _this=this;var dt=this[W6P][A6K]?new $[V6K][r5P][D6K](this[W6P][P6K]):F5P;var ssp=K5P;if(dt){var O6K=L899[403715];O6K+=p2P;O6K+=I4x;O6K+=p4x;ssp=dt[T7P]()[V1P][T9P][O6K];}if(this[W6P][s6K]){this[s6V](s9B,function(){var i4x='draw';if(ssp){var T6K=y9P;T6K+=L899[567670];dt[T6K](i4x,fn);}else {setTimeout(function(){fn();},a1P);}});return M5P;}else if(this[G6V]() === a6K || this[G6V]() === B6K){var G6K=L899[643646];G6K+=K4P;G6K+=L899[567670];this[G6K](z5P,function(){R9I.Q9I();var b4x="bmitCom";var g4x="ocessing";var u6K=L8V;u6K+=g4x;if(!_this[W6P][u6K]){setTimeout(function(){if(_this[W6P]){fn();}},a1P);}else {var x6K=z3V;x6K+=b4x;x6K+=j1x;_this[s6V](x6K,function(e,json){R9I.l9I();if(ssp && json){var Y6K=P4P;Y6K+=R4P;Y6K+=k4x;dt[s6V](Y6K,fn);}else {setTimeout(function(){if(_this[W6P]){fn();}},a1P);}});}})[v5V]();return M5P;}return K5P;}function _weakInArray(name,arr){R9I.Q9I();for(var i=V1P,ien=arr[V7P];i < ien;i++){if(name == arr[i]){return i;}}return -D1P;}var fieldType={create:function(){},get:function(){},set:function(){},enable:function(){},disable:function(){}};var DataTable$2=$[l5P][y6K];function _buttonText(conf,text){var o4x="Cho";var L4x="uploadText";var S4x="ose file...";var Q4x='div.upload button';var m6K=D0B;m6K+=P0B;var e6K=L899.L4P;e6K+=w0P;e6K+=K4P;e6K+=P4P;var h6K=I4B;h6K+=H4x;if(text === F5P || text === undefined){var v6K=o4x;v6K+=S4x;text=conf[L4x] || v6K;}conf[h6K][e6K](Q4x)[m6K](text);}function _commonUpload(editor,conf,dropCallback,multiple){var y4x='"></button>';var z4x="\"></";var f4x="t[type=file";var B4x="ass=\"editor_upload\">";var j4x="put[type=file";var o0x='div.drop';var t0x='div.clearValue button';var h4x='<div class="row second">';var t4x="Hid";var H0x="Drag and drop a file here to upload";var G4x="onInte";var J4x="FileReader";var a4x="<div c";var Y4x='<div class="row">';var b0x="dragDro";var D4x="file\"";var I0x="over";var i0x="agexit";var U0x="dragDrop";var r0x='noDrop';var c0x="drag";var k0x='div.drop span';var r4x="<div cl";var n4x="ue\">";var e4x='<div class="cell">';var R4x="ton>";var X0x='input[type=file]';var M4x="</inp";var d0x='dragover.DTE_Upload drop.DTE_Upload';var s4x="\"cell upload";var P4x="<button c";var V4x="<input type=\"";var l4x="</div>";var T4x=" limitHid";R9I.Q9I();var g0x="dr";var q4x="<div class=\"rendered\">";var v4x='<button class="';var u4x="rnal";var d4x="<div class=\"drop\"><span></span>";var F4x="s=\"cell clearVal";var p0x="ve dr";var O4x="<div class=";var Z4x="ass=\"cell limit";var x4x='<div class="eu_table">';var X4x="e\">";var Y2K=L899[643646];Y2K+=K4P;var u2K=L899.E4P;u2K+=G2P;u2K+=I2P;u2K+=o3P;var w2K=w0P;w2K+=P4P;var E2K=G6P;E2K+=E4x;E2K+=D9P;var Q2K=M0P;Q2K+=Z3V;Q2K+=w4x;Q2K+=Q3P;var L2K=C4x;L2K+=Q3P;var S2K=q4x;S2K+=C4x;S2K+=Q3P;var o2K=F7V;o2K+=u8V;o2K+=f0P;var H2K=d4x;H2K+=l4x;var k2K=r4x;k2K+=Z4x;k2K+=t4x;k2K+=X4x;var b2K=M0P;b2K+=Z3V;b2K+=u8V;b2K+=f0P;var g2K=z4x;g2K+=L899[403715];g2K+=B6P;g2K+=R4x;var i2K=v0P;i2K+=F4x;i2K+=n4x;var p2K=Q3P;p2K+=M4x;p2K+=b2P;p2K+=K4x;var I2K=n5V;I2K+=A4x;var c2K=V4x;c2K+=D4x;c2K+=M1B;var U2K=P4x;U2K+=Z3P;U2K+=T0V;U2K+=o7P;var J6K=O4x;J6K+=s4x;J6K+=T4x;J6K+=X4x;var f6K=a4x;f6K+=G2P;f6K+=B4x;var N6K=Q7V;N6K+=T8P;N6K+=G4x;N6K+=u4x;var W6K=L899.L4P;W6K+=L899[643646];W6K+=R4P;W6K+=k2P;var j6K=L899.E4P;j6K+=Z3P;j6K+=X8B;if(multiple === void V1P){multiple=K5P;}var btnClass=editor[j6K][W6K][N6K];var container=$(f6K + x4x + Y4x + J6K + U2K + btnClass + y4x + c2K + (multiple?I2K:C5P) + p2K + Q2V + i2K + v4x + btnClass + g2K + b2K + Q2V + h4x + k2K + H2K + o2K + e4x + S2K + Q2V + L2K + Q2K + Q2V);conf[m4x]=container;conf[E2K]=M5P;if(conf[w2K]){var d2K=w0P;d2K+=P4P;var q2K=q9P;q2K+=j4x;q2K+=S1V;var C2K=S3P;C2K+=K4P;C2K+=P4P;container[C2K](q2K)[R1V](d2K,Editor[W4x](conf[f1V]));}if(conf[R1V]){var Z2K=F0P;Z2K+=o6V;var r2K=N4x;r2K+=f4x;r2K+=S1V;var l2K=L899.L4P;l2K+=G9V;container[l2K](r2K)[Z2K](conf[R1V]);}_buttonText(conf);if(window[J4x] && conf[U0x] !== K5P){var T2K=P6V;T2K+=Z0P;var P2K=c0x;P2K+=I0x;var V2K=c0x;V2K+=y3V;V2K+=p0x;V2K+=i0x;var F2K=g0x;F2K+=P6V;var R2K=L899[643646];R2K+=K4P;var z2K=b0x;z2K+=E0P;z2K+=Q2B;var X2K=r0P;X2K+=V4P;X2K+=r0P;var t2K=L899.L4P;t2K+=w0P;t2K+=K4P;t2K+=P4P;container[t2K](k0x)[X2K](conf[z2K] || H0x);var dragDrop=container[a5B](o0x);dragDrop[R2K](F2K,function(e){var Q0x="fer";var L0x="dataT";var E0x="originalEvent";var S0x="nabl";var n2K=G6P;n2K+=L899[567670];n2K+=S0x;n2K+=a4P;R9I.Q9I();if(conf[n2K]){var A2K=L899[643646];A2K+=m7P;A2K+=L899[567670];A2K+=R4P;var K2K=c0P;K2K+=W6P;var M2K=L0x;M2K+=n9P;M2K+=H8P;M2K+=Q0x;Editor[g6B](editor,conf,e[E0x][M2K][K2K],_buttonText,dropCallback);dragDrop[N7P](A2K);}return K5P;})[y9P](V2K,function(e){if(conf[w0x]){var D2K=L899[643646];D2K+=m7P;D2K+=L899[567670];D2K+=R4P;dragDrop[N7P](D2K);}R9I.Q9I();return K5P;})[y9P](P2K,function(e){var C0x="nabled";var O2K=G6P;O2K+=L899[567670];O2K+=C0x;if(conf[O2K]){var s2K=L899[643646];s2K+=m7P;s2K+=E2P;dragDrop[x7P](s2K);}return K5P;});editor[y9P](T2K,function(){var q0x="dy";var B2K=L899[643646];B2K+=K4P;var a2K=w6V;a2K+=q0x;$(a2K)[B2K](d0x,function(e){R9I.l9I();return K5P;});})[y9P](z5P,function(){$(e2V)[O3P](d0x);});}else {var G2K=H0V;G2K+=l0x;container[G2K](r0x);container[C6V](container[a5B](Z0x));}container[a5B](t0x)[y9P](u2K,function(e){R9I.Q9I();e[s3V]();if(conf[w0x]){var x2K=W6P;x2K+=L899[567670];x2K+=r0P;upload[x2K][W3P](editor,conf,C5P);}});container[a5B](X0x)[Y2K](z0x,function(){var y2K=x6B;y2K+=G2P;y2K+=W0B;Editor[y2K](editor,conf,this[n1B],_buttonText,function(ids){var F0x="pe=file]";var R0x="t[ty";var e2K=N4x;e2K+=R0x;R9I.Q9I();e2K+=F0x;var h2K=L899.L4P;h2K+=w0P;h2K+=K4P;h2K+=P4P;var v2K=L899.E4P;v2K+=z4V;dropCallback[v2K](editor,ids);container[h2K](e2K)[V1P][y0B]=C5P;});});return container;}function _triggerChange(input){setTimeout(function(){var n0x="chan";var m2K=n0x;m2K+=j2P;input[Q7B](m2K,{editor:M5P,editorSet:M5P});;},V1P);}var baseFieldType=$[U7P](M5P,{},fieldType,{get:function(conf){R9I.l9I();return conf[m4x][n1V]();},set:function(conf,val){var j2K=G6P;R9I.Q9I();j2K+=w0P;j2K+=M0x;j2K+=r0P;conf[m4x][n1V](val);_triggerChange(conf[j2K]);},enable:function(conf){var K0x="isabl";var f2K=P4P;f2K+=K0x;f2K+=a4P;var N2K=E0P;N2K+=R4P;N2K+=P6V;var W2K=G6P;W2K+=w0P;W2K+=A0x;W2K+=B6P;conf[W2K][N2K](f2K,K5P);},disable:function(conf){R9I.l9I();var J2K=V0x;J2K+=B6P;conf[J2K][D0x](P0x,M5P);},canReturnSubmit:function(conf,node){R9I.l9I();return M5P;}});var hidden={create:function(conf){conf[O0x]=conf[y0B];return F5P;},get:function(conf){return conf[O0x];},set:function(conf,val){var U5K=s0x;R9I.l9I();U5K+=G2P;conf[U5K]=val;}};var readonly=$[U7P](M5P,{},baseFieldType,{create:function(conf){var a0x="only";var T0x="read";var b5K=I4B;b5K+=A0x;b5K+=b2P;b5K+=r0P;var g5K=F0P;g5K+=r0P;g5K+=r0P;g5K+=R4P;var i5K=T0x;i5K+=a0x;var p5K=W6P;p5K+=F0P;p5K+=B0x;p5K+=P4P;var I5K=L899[567670];I5K+=l0P;I5K+=K4P;I5K+=P4P;var c5K=G6P;c5K+=w0P;c5K+=A0x;R9I.l9I();c5K+=B6P;conf[c5K]=$(G0x)[R1V]($[I5K]({id:Editor[p5K](conf[f1V]),type:u0x,readonly:i5K},conf[g5K] || ({})));return conf[b5K][V1P];}});var text=$[U7P](M5P,{},baseFieldType,{create:function(conf){var x0x="safe";var o5K=r0P;o5K+=L899[567670];o5K+=r2P;o5K+=r0P;var H5K=x0x;H5K+=s2P;var k5K=F0P;k5K+=o6V;conf[m4x]=$(G0x)[k5K]($[U7P]({id:Editor[H5K](conf[f1V]),type:o5K},conf[R1V] || ({})));return conf[m4x][V1P];}});var password=$[S5K](M5P,{},baseFieldType,{create:function(conf){var Y0x="sword";var h0x="nput/";var v0x="<i";var q5K=G6P;q5K+=w0P;q5K+=M0x;q5K+=r0P;var C5K=E2B;C5K+=W6P;C5K+=Y0x;var w5K=w0P;w5K+=P4P;var E5K=O7B;E5K+=y0x;E5K+=U9B;E5K+=P4P;var Q5K=C0P;Q5K+=L899[567670];Q5K+=d0P;var L5K=v0x;L5K+=h0x;L5K+=Q3P;conf[m4x]=$(L5K)[R1V]($[Q5K]({id:Editor[E5K](conf[w5K]),type:C5K},conf[R1V] || ({})));return conf[q5K][V1P];}});var textarea=$[d5K](M5P,{},baseFieldType,{create:function(conf){var W0x="a>";var m0x="xtarea></tex";var e0x="<te";var j0x="tare";var Z5K=I4B;Z5K+=K4P;Z5K+=E0P;Z5K+=B6P;var r5K=w0P;r5K+=P4P;var l5K=e0x;l5K+=m0x;l5K+=j0x;l5K+=W0x;conf[m4x]=$(l5K)[R1V]($[U7P]({id:Editor[W4x](conf[r5K])},conf[R1V] || ({})));return conf[Z5K][V1P];},canReturnSubmit:function(conf,node){return K5P;}});var select=$[t5K](M5P,{},baseFieldType,{_addOptions:function(conf,opts,append){var U6x="placeh";var k6x="Pai";var i6x="placeholderValue";var g6x="hidden";var J0x="laceholderDisabled";var N0x="ceholder";var f0x="disabl";var c6x="olderDisabl";var p6x="Value";var X5K=L899[643646];X5K+=k9V;X5K+=w0P;R9I.l9I();X5K+=m7V;if(append === void V1P){append=K5P;}var elOpts=conf[m4x][V1P][X5K];var countOffset=V1P;if(!append){var z5K=p2B;z5K+=F0P;z5K+=N0x;elOpts[V7P]=V1P;if(conf[z5K] !== undefined){var M5K=f0x;M5K+=a4P;var n5K=E0P;n5K+=J0x;var F5K=U6x;F5K+=c6x;F5K+=a4P;var R5K=I6x;R5K+=p6x;var placeholderValue=conf[R5K] !== undefined?conf[i6x]:C5P;countOffset+=D1P;elOpts[V1P]=new Option(conf[I6x],placeholderValue);var disabled=conf[F5K] !== undefined?conf[n5K]:M5P;elOpts[V1P][g6x]=disabled;elOpts[V1P][M5K]=disabled;elOpts[V1P][b6x]=placeholderValue;}}else {countOffset=elOpts[V7P];}if(opts){var A5K=b3B;A5K+=k6x;A5K+=R4P;var K5K=E0P;K5K+=F0P;K5K+=H6x;K5K+=W6P;Editor[K5K](opts,conf[A5K],function(val,label,i,attr){var o6x="_edi";R9I.l9I();var V5K=o6x;V5K+=N2V;V5K+=R4P;V5K+=O0x;var option=new Option(label,val);option[V5K]=val;if(attr){var D5K=F0P;D5K+=r0P;D5K+=r0P;D5K+=R4P;$(option)[D5K](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var L6x="Op";var w6x="<s";var q6x="</select>";var Q6x="cha";var C6x="elect>";var E6x=".dte";var S6x="ip";var y5K=V0x;y5K+=B6P;var Y5K=S6x;Y5K+=L6x;Y5K+=I4V;var G5K=Q6x;G5K+=R0B;G5K+=L899[567670];G5K+=E6x;var B5K=F0P;B5K+=r0P;B5K+=r0P;B5K+=R4P;var a5K=n5V;a5K+=A4x;var T5K=O7B;T5K+=y0x;T5K+=U9B;T5K+=P4P;var s5K=L899[567670];s5K+=X4P;s5K+=Z0P;s5K+=P4P;var O5K=w6x;O5K+=C6x;O5K+=q6x;var P5K=d6x;P5K+=r0P;conf[P5K]=$(O5K)[R1V]($[s5K]({id:Editor[T5K](conf[f1V]),multiple:conf[a5K] === M5P},conf[B5K] || ({})))[y9P](G5K,function(e,d){var r6x="_la";R9I.Q9I();var Z6x="stS";var u5K=L899[567670];u5K+=P4P;u5K+=w0P;u5K+=l6x;if(!d || !d[u5K]){var x5K=r6x;x5K+=Z6x;x5K+=s0V;conf[x5K]=select[c2V](conf);}});select[t6x](conf,conf[b3B] || conf[Y5K]);return conf[y5K][V1P];},update:function(conf,options,append){var X6x="_las";var F6x="tions";var R6x="_addO";var z6x="tSet";R9I.Q9I();var h5K=X6x;h5K+=z6x;var v5K=R6x;v5K+=E0P;v5K+=F6x;select[v5K](conf,options,append);var lastSet=conf[h5K];if(lastSet !== undefined){var e5K=W6P;e5K+=L899[567670];e5K+=r0P;select[e5K](conf,lastSet,M5P);}_triggerChange(conf[m4x]);},get:function(conf){var M6x='option:selected';var n6x="oAr";var f5K=b9P;f5K+=v9P;var N5K=r0P;N5K+=n6x;N5K+=R4P;N5K+=C9P;var j5K=S3P;j5K+=d0P;var m5K=G6P;m5K+=w0P;m5K+=A0x;m5K+=B6P;var val=conf[m5K][j5K](M6x)[t9P](function(){var K6x="or_val";var W5K=Y1B;W5K+=G4P;W5K+=K6x;return this[W5K];})[N5K]();if(conf[A6x]){return conf[V6x]?val[N4B](conf[V6x]):val;}return val[f5K]?val[V1P]:F5P;},set:function(conf,val,localUpdate){var P6x="isAr";var B6x="selected";var D6x="tiple";var s6x="epara";var H7K=U2P;H7K+=Y9P;var k7K=n5V;k7K+=G2P;k7K+=D6x;var b7K=L899[643646];b7K+=Z5V;var g7K=S3P;g7K+=K4P;g7K+=P4P;var i7K=L899[643646];i7K+=Z5V;var p7K=P6x;p7K+=O6x;var U7K=P6x;U7K+=n9P;U7K+=d2P;var J5K=W6P;J5K+=s6x;J5K+=r0P;J5K+=Z6V;if(!localUpdate){conf[T6x]=val;}if(conf[A6x] && conf[J5K] && !Array[U7K](val)){var I7K=W6P;I7K+=p2B;I7K+=w0P;I7K+=r0P;var c7K=W6P;c7K+=a6x;val=typeof val === c7K?val[I7K](conf[V6x]):[];}else if(!Array[p7K](val)){val=[val];}R9I.l9I();var i,len=val[V7P],found,allFound=K5P;var options=conf[m4x][a5B](i7K);conf[m4x][g7K](b7K)[U8P](function(){found=K5P;for(i=V1P;i < len;i++){if(this[b6x] == val[i]){found=M5P;allFound=M5P;break;}}this[B6x]=found;});if(conf[I6x] && !allFound && !conf[k7K] && options[H7K]){options[V1P][B6x]=M5P;}if(!localUpdate){var o7K=G6P;o7K+=q9P;o7K+=E0P;o7K+=B6P;_triggerChange(conf[o7K]);}return allFound;},destroy:function(conf){var u6x="e.dt";var G6x="chang";var L7K=G6x;L7K+=u6x;L7K+=L899[567670];var S7K=I4B;S7K+=A0x;S7K+=b2P;S7K+=r0P;R9I.l9I();conf[S7K][O3P](L7K);}});var checkbox=$[U7P](M5P,{},baseFieldType,{_addOptions:function(conf,opts,append){var Q7K=G6P;Q7K+=w0P;Q7K+=K4P;Q7K+=x6x;if(append === void V1P){append=K5P;}var jqInput=conf[Q7K];var offset=V1P;if(!append){jqInput[L3V]();}else {var w7K=r6B;w7K+=C8P;var E7K=w0P;E7K+=K4P;E7K+=x6x;offset=$(E7K,jqInput)[w7K];}if(opts){Editor[Y6x](opts,conf[y6x],function(val,label,i,attr){var N6x="=\"checkbox\" />";var m6x="<lab";var j6x="el for=";var p2x='input:last';var e6x="last";var W6x="\" type";var h6x="input:";var v6x="or_";var J6x="put id=\"";var f6x="<in";var R7K=U4B;R7K+=R6P;R7K+=v6x;R7K+=n1V;var z7K=m7P;z7K+=F0P;z7K+=G2P;z7K+=j9V;var X7K=O6P;X7K+=r0P;X7K+=R4P;var t7K=h6x;t7K+=e6x;var Z7K=m6x;Z7K+=j6x;Z7K+=o1V;var r7K=W6x;r7K+=N6x;var l7K=w0P;l7K+=P4P;var d7K=W6P;d7K+=F0P;d7K+=B0x;d7K+=P4P;var q7K=f6x;q7K+=J6x;var C7K=F3P;C7K+=q0P;jqInput[C7K](U2x + q7K + Editor[d7K](conf[l7K]) + c2x + (i + offset) + r7K + Z7K + Editor[W4x](conf[f1V]) + c2x + (i + offset) + i8V + label + I2x + Q2V);$(t7K,jqInput)[X7K](z7K,val)[V1P][R7K]=val;if(attr){var F7K=F0P;F7K+=r0P;F7K+=r0P;F7K+=R4P;$(p2x,jqInput)[F7K](attr);}});}},create:function(conf){R9I.Q9I();var i2x="pO";var g2x='<div></div>';var n7K=w0P;n7K+=i2x;n7K+=k9V;n7K+=W6P;conf[m4x]=$(g2x);checkbox[t6x](conf,conf[b3B] || conf[n7K]);return conf[m4x][V1P];},get:function(conf){var E2x="unselectedValue";var S2x=":ch";var w2x="lectedValue";var k2x="parato";var s7K=h4P;s7K+=E2B;s7K+=b2x;var O7K=W6B;O7K+=w0P;O7K+=K4P;var P7K=h4P;P7K+=k2x;P7K+=R4P;var D7K=W6P;D7K+=H2x;var K7K=G2P;K7K+=L899[567670];K7K+=K4P;K7K+=v9P;var M7K=o2x;M7K+=S2x;M7K+=e2P;M7K+=a4P;var out=[];var selected=conf[m4x][a5B](M7K);if(selected[K7K]){selected[U8P](function(){var A7K=L2x;R9I.l9I();A7K+=Q2x;out[e8P](this[A7K]);});}else if(conf[E2x] !== undefined){var V7K=L899.Q4P;V7K+=h4P;V7K+=w2x;out[e8P](conf[V7K]);}return conf[D7K] === undefined || conf[P7K] === F5P?out:out[O7K](conf[s7K]);},set:function(conf,val){var q2x='|';R9I.Q9I();var G7K=N4P;G7K+=L899.E4P;G7K+=b7P;var B7K=b9P;B7K+=P8P;B7K+=r0P;B7K+=b7P;var a7K=W6P;a7K+=D2P;a7K+=q9P;a7K+=P8P;var T7K=C2x;T7K+=b2P;T7K+=r0P;var jqInputs=conf[m4x][a5B](T7K);if(!Array[G3P](val) && typeof val === a7K){val=val[r7B](conf[V6x] || q2x);}else if(!Array[G3P](val)){val=[val];}var i,len=val[B7K],found;jqInputs[G7K](function(){var d2x="ecked";var x7K=y8P;x7K+=d2x;found=K5P;for(i=V1P;i < len;i++){var u7K=L2x;u7K+=Q2x;if(this[u7K] == val[i]){found=M5P;break;}}this[x7K]=found;});_triggerChange(jqInputs);},enable:function(conf){var h7K=P4P;h7K+=A6P;var v7K=E0P;v7K+=S9P;v7K+=E0P;var y7K=L899.L4P;y7K+=w0P;y7K+=K4P;y7K+=P4P;var Y7K=I4B;Y7K+=A0x;Y7K+=b2P;Y7K+=r0P;conf[Y7K][y7K](z0x)[v7K](h7K,K5P);},disable:function(conf){var l2x="sabled";var W7K=u8V;W7K+=l2x;var j7K=q9P;R9I.l9I();j7K+=E0P;j7K+=b2P;j7K+=r0P;var m7K=L899.L4P;m7K+=w0P;m7K+=d0P;var e7K=V0x;e7K+=B6P;conf[e7K][m7K](j7K)[D0x](W7K,M5P);},update:function(conf,options,append){var r2x="ddOpt";var N7K=G6P;N7K+=F0P;N7K+=r2x;N7K+=Z2x;R9I.l9I();var currVal=checkbox[c2V](conf);checkbox[N7K](conf,options,append);checkbox[j8V](conf,currVal);}});var radio=$[f7K](M5P,{},baseFieldType,{_addOptions:function(conf,opts,append){if(append === void V1P){append=K5P;}var jqInput=conf[m4x];var offset=V1P;if(!append){jqInput[L3V]();}else {var J7K=b9P;J7K+=H1V;J7K+=b7P;offset=$(z0x,jqInput)[J7K];}if(opts){Editor[Y6x](opts,conf[y6x],function(val,label,i,attr){var K2x="input id=\"";var V2x='<label for="';var z2x="eI";var M2x="ame=\"";var D2x="nput:last";var X2x="ut:last";var n2x="adio\" ";var F2x="\" type=\"r";var R2x="\" ";var o8K=R9B;o8K+=t2x;var H8K=F0P;H8K+=T8P;H8K+=R4P;var k8K=C2x;k8K+=X2x;var b8K=O7B;b8K+=L899.L4P;b8K+=z2x;b8K+=P4P;var g8K=R2x;g8K+=Z3V;g8K+=Q3P;var i8K=K4P;i8K+=F0P;i8K+=k2P;i8K+=L899[567670];var p8K=F2x;p8K+=n2x;p8K+=K4P;p8K+=M2x;var I8K=w0P;I8K+=P4P;var c8K=M0P;c8K+=K2x;var U8K=A2x;U8K+=s0P;jqInput[C6V](U8K + c8K + Editor[W4x](conf[I8K]) + c2x + (i + offset) + p8K + conf[i8K] + g8K + V2x + Editor[b8K](conf[f1V]) + c2x + (i + offset) + i8V + label + I2x + Q2V);$(k8K,jqInput)[H8K](o8K,val)[V1P][b6x]=val;if(attr){var L8K=O6P;L8K+=r0P;L8K+=R4P;var S8K=w0P;S8K+=D2x;$(S8K,jqInput)[L8K](attr);}});}},create:function(conf){var P2x="iv ";var s2x="ipOpts";var E8K=A2x;E8K+=P2x;E8K+=Z3V;E8K+=Q3P;var Q8K=O2x;Q8K+=E0P;Q8K+=B6P;conf[Q8K]=$(E8K);radio[t6x](conf,conf[b3B] || conf[s2x]);R9I.l9I();this[y9P](m3B,function(){var q8K=L899[567670];q8K+=F0P;q8K+=L899.E4P;q8K+=b7P;var C8K=L899.L4P;C8K+=q9P;C8K+=P4P;var w8K=G6P;w8K+=N4x;w8K+=r0P;conf[w8K][C8K](z0x)[q8K](function(){var a2x="ke";var B2x="ecke";var T2x="_preChec";var d8K=T2x;R9I.Q9I();d8K+=a2x;d8K+=P4P;if(this[d8K]){var l8K=y8P;l8K+=B2x;l8K+=P4P;this[l8K]=M5P;}});});return conf[m4x][V1P];},get:function(conf){var x2x="unselectedVal";var G2x="unsele";var y2x='input:checked';var u2x="edValue";var z8K=G2x;z8K+=Y9V;z8K+=u2x;var X8K=x2x;R9I.Q9I();X8K+=j9V;var t8K=G2P;t8K+=L899[567670];t8K+=K4P;t8K+=v9P;var Z8K=Y2x;Z8K+=P4P;var r8K=O2x;r8K+=x6x;var el=conf[r8K][Z8K](y2x);if(el[t8K]){return el[V1P][b6x];}return conf[X8K] !== undefined?conf[z8K]:undefined;},set:function(conf,val){var h2x="hecked";var v2x="input:c";var V8K=v2x;V8K+=h2x;var A8K=L899.L4P;A8K+=w0P;A8K+=K4P;A8K+=P4P;var K8K=G6P;K8K+=q9P;K8K+=x6x;conf[m4x][a5B](z0x)[U8P](function(){var W2x="_preChecked";var J2x="checke";var m2x="che";var N2x="reC";var e2x="_preC";var j2x="cked";var f2x="heck";var R8K=e2x;R8K+=b7P;R8K+=e2P;R9I.l9I();R8K+=a4P;this[R8K]=K5P;if(this[b6x] == val){var F8K=m2x;F8K+=j2x;this[F8K]=M5P;this[W2x]=M5P;}else {var M8K=j9B;M8K+=N2x;M8K+=f2x;M8K+=a4P;var n8K=J2x;n8K+=P4P;this[n8K]=K5P;this[M8K]=K5P;}});_triggerChange(conf[K8K][A8K](V8K));},enable:function(conf){var O8K=U5x;O8K+=M4P;O8K+=a4P;var P8K=L899.L4P;P8K+=q9P;P8K+=P4P;var D8K=G6P;D8K+=N4x;D8K+=r0P;R9I.l9I();conf[D8K][P8K](z0x)[D0x](O8K,K5P);},disable:function(conf){var s8K=E0P;s8K+=R4P;s8K+=P6V;conf[m4x][a5B](z0x)[s8K](P0x,M5P);},update:function(conf,options,append){var i5x="Opt";var p5x="_add";var I5x="[va";var v8K=m7P;v8K+=c5x;var y8K=L899[567670];y8K+=R7V;var Y8K=U2P;Y8K+=Y9P;var x8K=o1V;x8K+=S1V;var u8K=I5x;u8K+=G2P;u8K+=b2P;u8K+=T5B;var G8K=w0P;G8K+=K4P;G8K+=O8P;G8K+=r0P;var B8K=L899.L4P;B8K+=w0P;B8K+=d0P;var a8K=d6x;a8K+=r0P;var T8K=p5x;T8K+=i5x;T8K+=Z2x;var currVal=radio[c2V](conf);radio[T8K](conf,options,append);var inputs=conf[a8K][B8K](G8K);radio[j8V](conf,inputs[z1V](u8K + currVal + x8K)[Y8K]?currVal:inputs[y8K](V1P)[R1V](v8K));}});var datetime=$[U7P](M5P,{},baseFieldType,{create:function(conf){var g5x="eyInpu";var b5x="ayFormat";var w5x="datetime";var H5x='<input />';var L5x="brary is r";var Q5x="uired";var k5x="DateTim";var S5x="DateTime li";var p3K=I4B;p3K+=M0x;p3K+=r0P;var c3K=o3P;c3K+=g5x;c3K+=r0P;var f8K=l1B;f8K+=k2P;f8K+=F0P;f8K+=r0P;var N8K=I1x;N8K+=b5x;var W8K=I4B;W8K+=K4P;W8K+=O8P;W8K+=r0P;var j8K=k5x;j8K+=L899[567670];var e8K=O6P;e8K+=D2P;var h8K=L899[567670];h8K+=w9V;h8K+=P4P;conf[m4x]=$(H5x)[R1V]($[h8K](M5P,{id:Editor[W4x](conf[f1V]),type:u0x},conf[e8K]));if(!DataTable$2[o5x]){var m8K=S5x;m8K+=L5x;m8K+=Q0B;m8K+=Q5x;Editor[i8P](m8K,x1P);}conf[E5x]=new DataTable$2[j8K](conf[W8K],$[U7P]({format:conf[N8K] || conf[f8K],i18n:this[S3V][w5x]},conf[L1B]));conf[C5x]=function(){var q5x="icker";R9I.Q9I();var U3K=b7P;U3K+=w0P;U3K+=j8P;var J8K=j9B;J8K+=q5x;conf[J8K][U3K]();};if(conf[c3K] === K5P){var I3K=L899[643646];I3K+=K4P;conf[m4x][I3K](u7B,function(e){R9I.l9I();e[s3V]();});}this[y9P](z5P,conf[C5x]);return conf[p3K][V1P];},get:function(conf){var r5x="men";var z5x="wireFormat";var X5x="mentLoca";var d5x="wir";var l5x="eFo";var H3K=d5x;H3K+=l5x;H3K+=d7V;H3K+=O6P;R9I.l9I();var k3K=e7P;k3K+=r5x;k3K+=Z5x;k3K+=t5x;var b3K=e7P;b3K+=X5x;b3K+=U2P;var g3K=k2P;g3K+=U3V;g3K+=O6B;var i3K=O2x;i3K+=E0P;i3K+=b2P;i3K+=r0P;var val=conf[i3K][n1V]();var inst=conf[E5x][L899.E4P];var moment=window[g3K];return val && conf[z5x] && moment?moment(val,inst[R5x],inst[b3K],inst[k3K])[R5x](conf[H3K]):val;},set:function(conf,val){var M5x="moment";var P5x="wire";var K5x="Lo";var O5x="Form";var s5x="_pi";var n5x="mom";var T5x="cker";var V5x="wireFo";var A5x="cale";var F5x="mat";var r3K=G6P;r3K+=o2x;var l3K=l1B;l3K+=F5x;var d3K=n5x;d3K+=Z0P;d3K+=Z5x;d3K+=t5x;var q3K=M5x;q3K+=K5x;q3K+=A5x;var C3K=V5x;C3K+=D5x;var w3K=P5x;w3K+=O5x;w3K+=F0P;w3K+=r0P;var E3K=P1V;E3K+=P1V;var Q3K=m7P;Q3K+=F0P;Q3K+=G2P;var L3K=s5x;L3K+=x2V;L3K+=L899[567670];L3K+=R4P;var S3K=k2P;S3K+=U3V;S3K+=O6B;var o3K=j9B;o3K+=w0P;o3K+=T5x;var inst=conf[o3K][L899.E4P];var moment=window[S3K];conf[L3K][Q3K](typeof val === w7P && val && val[u2B](E3K) !== V1P && conf[w3K] && moment?moment(val,conf[C3K],inst[q3K],inst[d3K])[l3K](inst[R5x]):val);_triggerChange(conf[r3K]);},owns:function(conf,node){R9I.l9I();var Z3K=C8B;Z3K+=W6P;return conf[E5x][Z3K](node);},errorMessage:function(conf,msg){var B5x="errorMsg";var a5x="_pic";var t3K=a5x;t3K+=o3P;t3K+=E2P;conf[t3K][B5x](msg);},destroy:function(conf){var u5x="pick";var G5x="stro";var R3K=j8P;R3K+=G5x;R3K+=d2P;var z3K=G6P;z3K+=u5x;z3K+=E2P;var X3K=L899.E4P;X3K+=G2P;R9I.Q9I();X3K+=L899[643646];X3K+=h4P;this[O3P](X3K,conf[C5x]);conf[m4x][O3P](u7B);conf[z3K][R3K]();},minDate:function(conf,min){var x5x="min";conf[E5x][x5x](min);},maxDate:function(conf,max){var n3K=k2P;n3K+=F0P;n3K+=r2P;var F3K=G6P;F3K+=Y5x;F3K+=x2V;F3K+=E2P;conf[F3K][n3K](max);}});var upload=$[U7P](M5P,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var K3K=G6P;K3K+=w5B;var M3K=W6P;M3K+=s0V;upload[M3K][W3P](editor,conf,val[V1P]);editor[K3K](y5x,[conf[L8P],val[V1P]]);});R9I.l9I();return container;},get:function(conf){return conf[O0x];},set:function(conf,val){var U7x="fil";var v5x="_v";var f5x="/span>";var J5x="No ";var W5x="alue butto";var m5x="d.editor";var e5x="oa";var c7x='<span>';var p7x="clearText";var h5x="upl";var j5x="div.clearV";var g7x='noClear';var i7x="arText";var x3K=v5x;x3K+=F0P;x3K+=G2P;var u3K=h5x;u3K+=e5x;u3K+=m5x;var T3K=j5x;T3K+=W5x;T3K+=K4P;var s3K=L899.L4P;s3K+=q9P;s3K+=P4P;var V3K=F8P;V3K+=N5x;var A3K=I4B;A3K+=H4x;conf[O0x]=val;conf[A3K][n1V](C5P);var container=conf[m4x];if(conf[V3K]){var D3K=L899.L4P;D3K+=w0P;D3K+=K4P;D3K+=P4P;var rendered=container[D3K](Z0x);if(conf[O0x]){rendered[h1V](conf[G6V](conf[O0x]));}else {var O3K=M0P;O3K+=f5x;var P3K=J5x;P3K+=U7x;P3K+=L899[567670];rendered[L3V]()[C6V](c7x + (conf[I7x] || P3K) + O3K);}}var button=container[s3K](T3K);if(val && conf[p7x]){var G3K=T3P;G3K+=i4B;var B3K=L899.E4P;B3K+=G2P;B3K+=L899[567670];B3K+=i7x;var a3K=b7P;a3K+=r0P;a3K+=k2P;a3K+=G2P;button[a3K](conf[B3K]);container[G3K](g7x);}else {container[x7P](g7x);}conf[m4x][a5B](z0x)[o7B](u3K,[conf[x3K]]);},enable:function(conf){var Y3K=S3P;Y3K+=d0P;R9I.Q9I();conf[m4x][Y3K](z0x)[D0x](P0x,K5P);conf[w0x]=M5P;},disable:function(conf){var m3K=U4B;m3K+=K4P;m3K+=b7x;m3K+=D9P;var e3K=E0P;e3K+=S9P;e3K+=E0P;var h3K=w0P;h3K+=A0x;h3K+=B6P;var v3K=Y2x;v3K+=P4P;var y3K=G6P;y3K+=q9P;y3K+=E0P;y3K+=B6P;conf[y3K][v3K](h3K)[e3K](P0x,M5P);conf[m3K]=K5P;},canReturnSubmit:function(conf,node){return K5P;}});var uploadMany=$[j3K](M5P,{},baseFieldType,{_showHide:function(conf){var L7x='div.limitHide';var k7x="limi";var H7x="lim";var S7x="taine";var c9K=k7x;c9K+=r0P;var U9K=H7x;U9K+=G4P;var J3K=G6P;J3K+=m7P;J3K+=F0P;J3K+=G2P;var f3K=L899.L4P;f3K+=w0P;f3K+=K4P;f3K+=P4P;var N3K=o7x;N3K+=y9P;N3K+=S7x;N3K+=R4P;var W3K=u7V;W3K+=k2P;W3K+=w0P;W3K+=r0P;if(!conf[W3K]){return;}conf[N3K][f3K](L7x)[C2V](C3B,conf[J3K][V7P] >= conf[U9K]?G7P:u6V);conf[h6B]=conf[c9K] - conf[O0x][V7P];},create:function(conf){var C7x='button.remove';var Q7x="ontaine";var Q9K=o7x;Q9K+=Q7x;Q9K+=R4P;var g9K=L899.E4P;g9K+=G2P;g9K+=I2P;g9K+=o3P;var i9K=k2P;i9K+=E7x;i9K+=q3V;var p9K=H0V;p9K+=l0x;var editor=this;var container=_commonUpload(editor,conf,function(val){var w7x="concat";var I9K=n8V;I9K+=u0V;conf[O0x]=conf[O0x][w7x](val);uploadMany[j8V][W3P](editor,conf,conf[O0x]);editor[I9K](y5x,[conf[L8P],conf[O0x]]);},M5P);container[p9K](i9K)[y9P](g9K,C7x,function(e){var l7x='idx';var q7x="stopPropa";var d7x="gation";var k9K=G6P;k9K+=d1B;k9K+=P4P;var b9K=q7x;b9K+=d7x;e[b9K]();if(conf[k9K]){var L9K=W6P;L9K+=L899[567670];L9K+=r0P;var S9K=f3P;S9K+=G2P;S9K+=m4B;var o9K=G6P;o9K+=m7P;o9K+=X4V;var H9K=P4P;H9K+=O6P;H9K+=F0P;var idx=$(this)[H9K](l7x);conf[o9K][S9K](idx,D1P);uploadMany[L9K][W3P](editor,conf,conf[O0x]);}});conf[Q9K]=container;return container;},get:function(conf){var E9K=G6P;E9K+=n1V;return conf[E9K];},set:function(conf,val){var O7x="n>";var X7x=".r";R9I.Q9I();var T7x="an>";var t7x="pty";var G7x='upload.editor';var z7x="endered";var R7x='<ul></ul>';var Z7x='Upload collections must have an array as a value';var P7x="</spa";var s7x="<sp";var a7x='No files';var B7x="_showHide";var r7x="gerHandl";var K9K=r0P;K9K+=O8V;K9K+=r7x;K9K+=E2P;var M9K=I4B;M9K+=H4x;var q9K=m7P;q9K+=F0P;q9K+=G2P;var C9K=O2x;C9K+=E0P;C9K+=B6P;var w9K=s0x;w9K+=G2P;if(!val){val=[];}if(!Array[G3P](val)){throw Z7x;}conf[w9K]=val;conf[C9K][q9K](C5P);var that=this;var container=conf[m4x];if(conf[G6V]){var l9K=J1x;l9K+=t7x;var d9K=w4x;d9K+=X7x;d9K+=z7x;var rendered=container[a5B](d9K)[l9K]();if(val[V7P]){var r9K=L899[567670];r9K+=F0P;r9K+=L899.E4P;r9K+=b7P;var list=$(R7x)[d3P](rendered);$[r9K](val,function(i,file){var A7x="<l";var V7x=' <button class="';var M7x="move\" dat";var F7x="i>";var n7x=" re";var K7x="-idx=\"";var D7x='">&times;</button>';var R9K=F7V;R9K+=G2P;R9K+=F7x;var z9K=n7x;z9K+=M7x;z9K+=F0P;z9K+=K7x;var X9K=Q7V;X9K+=E8B;X9K+=K4P;var t9K=u8V;t9K+=S3B;var Z9K=A7x;Z9K+=F7x;list[C6V](Z9K + conf[t9K](file,i) + V7x + that[J7V][p9V][X9K] + z9K + i + D7x + R9K);});}else {var n9K=P7x;n9K+=O7x;var F9K=s7x;F9K+=T7x;rendered[C6V](F9K + (conf[I7x] || a7x) + n9K);}}uploadMany[B7x](conf);conf[M9K][a5B](z0x)[K9K](G7x,[conf[O0x]]);},enable:function(conf){var u7x="sab";var P9K=u8V;P9K+=u7x;R9I.Q9I();P9K+=D9P;var D9K=E0P;D9K+=R4P;D9K+=P6V;var V9K=Y2x;V9K+=P4P;var A9K=O2x;A9K+=E0P;A9K+=b2P;A9K+=r0P;conf[A9K][V9K](z0x)[D9K](P9K,K5P);conf[w0x]=M5P;},disable:function(conf){R9I.Q9I();var T9K=G6P;T9K+=x7x;T9K+=I0V;T9K+=P4P;var s9K=C2x;s9K+=B6P;var O9K=S3P;O9K+=d0P;conf[m4x][O9K](s9K)[D0x](P0x,M5P);conf[T9K]=K5P;},canReturnSubmit:function(conf,node){return K5P;}});var datatable=$[U7P](M5P,{},baseFieldType,{_addOptions:function(conf,options,append){var u9K=P4P;u9K+=R4P;u9K+=k4x;var G9K=H0V;G9K+=P4P;var B9K=R4P;R9I.Q9I();B9K+=L899[643646];B9K+=m0P;B9K+=W6P;if(append === void V1P){append=K5P;}var dt=conf[V6V];if(!append){var a9K=L899.E4P;a9K+=G2P;a9K+=L899[567670];a9K+=Y7x;dt[a9K]();}dt[B9K][G9K](options)[u9K]();},create:function(conf){var i8x="foote";var W7x="nf";var o8x="endTo";var U8x="fiBt";var b8x="nsPai";var N7x="ig";var J7x="tip";var V8x="bmitComplete";var I8x="ableCla";var e7x="use";var p8x="dCla";var g8x="opti";var Q8x="<tfoo";var C8x='init.dt';var L8x="<tr";var k8x='<table>';var m7x="r-";var H8x='<div class="DTE_Field_Type_datatable_info">';var X8x='Search';var c8x="Lab";var S8x="ote";var R8x='os';var h7x="ito";var v7x="io";var j7x="selec";var w8x='100%';var D1a=y7x;D1a+=v7x;D1a+=H8P;var V1a=P4P;V1a+=r0P;var l1a=a4P;l1a+=h7x;l1a+=R4P;var d1a=e7x;d1a+=m7x;d1a+=j7x;d1a+=r0P;var q1a=L899[643646];q1a+=K4P;var Q1a=L899[643646];Q1a+=K4P;var L1a=L899.E4P;L1a+=L899[643646];L1a+=W7x;L1a+=N7x;var S1a=W6P;S1a+=f7x;S1a+=G2P;S1a+=L899[567670];var o1a=V5V;o1a+=J7x;o1a+=U2P;var H1a=U8x;H1a+=E0P;var k1a=c8x;k1a+=L3P;var b1a=L899[567670];b1a+=X4P;b1a+=L899[567670];b1a+=d0P;var J9K=r0P;J9K+=I8x;J9K+=T0V;var f9K=F0P;f9K+=P4P;f9K+=p8x;f9K+=T0V;var y9K=i8x;y9K+=R4P;var Y9K=R9B;Y9K+=t2x;var x9K=g8x;x9K+=L899[643646];x9K+=b8x;x9K+=R4P;var _this=this;conf[x9K]=$[U7P]({label:V9V,value:Y9K},conf[y6x]);var table=$(k8x);var container=$(U2x)[C6V](table);var side=$(H8x);if(conf[y9K]){var N9K=F3P;N9K+=o8x;var W9K=L899.L4P;W9K+=L899[643646];W9K+=S8x;W9K+=R4P;var e9K=z9P;e9K+=E0P;e9K+=q0P;var h9K=L8x;h9K+=Q3P;var v9K=Q8x;v9K+=K4x;$(v9K)[C6V](Array[G3P](conf[j2B])?$(h9K)[e9K]($[t9P](conf[j2B],function(str){var E8x="tml";var j9K=b7P;j9K+=E8x;R9I.Q9I();var m9K=M0P;m9K+=r0P;m9K+=b7P;m9K+=Q3P;return $(m9K)[j9K](str);})):conf[W9K])[N9K](table);}var dt=table[f9K](datatable[J9K])[J8V](w8x)[y9P](C8x,function(e,settings){var t8x='div.dataTables_info';var r8x='div.dataTables_filter';var q8x="sel";var Z8x='div.dt-buttons';var l8x="aine";var g1a=L899.L4P;g1a+=w0P;g1a+=K4P;g1a+=P4P;var i1a=S3P;i1a+=d0P;var p1a=q9P;p1a+=G4P;var I1a=q8x;I1a+=L899[567670];I1a+=Y9V;var c1a=d8x;c1a+=l8x;c1a+=R4P;var U1a=Q0P;U1a+=E0P;U1a+=w0P;var api=new DataTable$2[U1a](settings);var container=$(api[K3P](undefined)[c1a]());DataTable$2[I1a][p1a](api);side[C6V](container[i1a](r8x))[C6V](container[a5B](Z8x))[C6V](container[g1a](t8x));})[u7P]($[b1a]({buttons:[],columns:[{title:k1a,data:conf[y6x][v1V]}],deferRender:M5P,dom:H1a,language:{search:C5P,searchPlaceholder:X8x,paginate:{next:a8B,previous:z8x}},lengthChange:K5P,select:{style:conf[o1a]?R8x:S1a}},conf[L1a]));this[Q1a](m3B,function(){var F8x="mns";var n8x="search";var M8x="dra";var K8x="adjust";var C1a=L899.E4P;C1a+=L899[643646];C1a+=u5V;C1a+=F8x;if(dt[n8x]()){var w1a=M8x;w1a+=m0P;var E1a=h4P;E1a+=F0P;E1a+=R4P;E1a+=y8P;dt[E1a](C5P)[w1a]();}dt[C1a][K8x]();});dt[q1a](d1a,function(){_triggerChange($(conf[V6V][K3P]()[A8x]()));});if(conf[l1a]){var z1a=z3V;z1a+=V8x;var X1a=L899[643646];X1a+=K4P;var t1a=L899[567670];t1a+=u8V;t1a+=l6x;var Z1a=r0P;Z1a+=b7x;Z1a+=G2P;Z1a+=L899[567670];var r1a=a4P;r1a+=G4P;r1a+=Z6V;conf[r1a][Z1a](dt);conf[t1a][X1a](z1a,function(e,json,data,action){var T8x='refresh';var O8x="ou";var P8x="_dataS";var K1a=R4P;R9I.l9I();K1a+=J1x;K1a+=l9P;var R1a=E9B;R1a+=r6V;if(action === R1a){var M1a=U2P;M1a+=R0B;M1a+=r0P;M1a+=b7P;var n1a=P4P;n1a+=U9P;var _loop_1=function(i){var D8x="ele";var F1a=W6P;F1a+=D8x;R9I.Q9I();F1a+=Y9V;dt[J7P](function(idx,d){R9I.Q9I();return d === json[J4P][i];})[F1a]();};for(var i=V1P;i < json[n1a][M1a];i++){_loop_1(i);}}else if(action === X9P || action === K1a){var A1a=P8x;A1a+=O8x;A1a+=s8x;_this[A1a](T8x);}datatable[a8x](conf);});}conf[V1a]=dt;datatable[D1a](conf,conf[b3B] || []);return {input:container,side:side};},get:function(conf){var B8x="oin";var G8x="luck";var u1a=h4P;u1a+=E0P;u1a+=F0P;u1a+=b2x;var G1a=L899[228964];G1a+=B8x;var B1a=W6P;B1a+=H2x;var a1a=N2V;a1a+=m3V;a1a+=O6x;var T1a=E0P;T1a+=G8x;var s1a=X0P;s1a+=p9P;R9I.l9I();var O1a=R4P;O1a+=L899[643646];O1a+=m0P;O1a+=W6P;var P1a=P4P;P1a+=r0P;var rows=conf[P1a][O1a]({selected:M5P})[s1a]()[T1a](conf[y6x][y0B])[a1a]();return conf[B1a] || !conf[A6x]?rows[G1a](conf[u1a] || t2B):rows;},set:function(conf,val,localUpdate){var y8x="sepa";var u8x="elec";var v8x="deselect";var Y8x="ple";var x8x="isA";var h8x="ainer";var W1a=W6P;R9I.l9I();W1a+=u8x;W1a+=r0P;var j1a=R4P;j1a+=L899[643646];j1a+=m0P;j1a+=W6P;var m1a=P4P;m1a+=r0P;var e1a=m7P;e1a+=F0P;e1a+=G2P;e1a+=j9V;var h1a=k7B;h1a+=C9P;var Y1a=x8x;Y1a+=R4P;Y1a+=O6x;var x1a=n5V;x1a+=O3V;x1a+=w0P;x1a+=Y8x;if(conf[x1a] && conf[V6x] && !Array[Y1a](val)){var v1a=y8x;v1a+=b2x;var y1a=W6P;y1a+=D2P;y1a+=w0P;y1a+=R0B;val=typeof val === y1a?val[r7B](conf[v1a]):[];}else if(!Array[h1a](val)){val=[val];}var valueFn=dataGet(conf[y6x][e1a]);conf[V6V][J7P]({selected:M5P})[v8x]();conf[m1a][j1a](function(idx,data,node){return val[u2B](valueFn(data)) !== -D1P;})[W1a]();datatable[a8x](conf);if(!localUpdate){var f1a=d8x;f1a+=h8x;var N1a=P4P;N1a+=r0P;_triggerChange($(conf[N1a][K3P]()[f1a]()));}},update:function(conf,options,append){var I4a=r0P;I4a+=g3P;I4a+=L899[567670];var c4a=P4P;c4a+=r0P;var J1a=y7x;J1a+=w0P;J1a+=m7V;datatable[J1a](conf,options,append);var lastSet=conf[T6x];if(lastSet !== undefined){var U4a=W6P;U4a+=L899[567670];U4a+=r0P;datatable[U4a](conf,lastSet,M5P);}_triggerChange($(conf[c4a][I4a]()[A8x]()));},dt:function(conf){var p4a=P4P;R9I.l9I();p4a+=r0P;return conf[p4a];},tableClass:C5P,_jumpToFirst:function(conf){var e8x="nde";var m8x="plied";var N8x="floor";var j8x="page";var S4a=E0P;S4a+=C7V;var k4a=w0P;k4a+=e8x;k4a+=r2P;var b4a=z9P;b4a+=p2B;b4a+=J8P;b4a+=P4P;var g4a=R4P;g4a+=l4V;var i4a=P4P;i4a+=r0P;var idx=conf[i4a][g4a]({selected:M5P,order:b4a})[k4a]();var page=V1P;if(typeof idx === N3V){var o4a=z9P;o4a+=m8x;var H4a=P4P;H4a+=r0P;var pageLen=conf[H4a][j8x][W8x]()[V7P];var pos=conf[V6V][J7P]({order:o4a})[r8P]()[u2B](idx);page=pageLen > V1P?Math[N8x](pos / pageLen):V1P;}conf[V6V][S4a](page)[U3P](K5P);}});var defaults={className:C5P,compare:F5P,data:C5P,def:C5P,entityDecode:M5P,fieldInfo:C5P,id:C5P,label:C5P,labelInfo:C5P,name:F5P,nullDefault:K5P,type:u0x,message:C5P,multiEditable:M5P,submit:M5P,getFormatter:F5P,setFormatter:F5P};var DataTable$1=$[L4a][r5P];var Field=(function(){var E3x="oy";var g13="cla";var h13="lues";var t3x="elInf";var r13="_msg";var r3x="ototype";var v13="multiVa";var i3x="prot";var l3x="mes";var S3x="nfoShow";var S13="has";var z3x="totype";var a9x="_typeFn";var x13="labelInfo";var F3x="typ";var H13="enabled";var z13="ntainer";var U13="sl";var X3x="be";var N13="_multiValueCheck";var n43="ner";var f8x="ers";var w3x="mpare";var b3x="_errorNod";var B13="host";var w13="conta";var K9x="multiInfo";var Z3x="lab";var R3x="yp";var I43="_format";var Q3x="destr";var e13="multiIds";var o3x="iI";var m9x="disabled";var J8x="aults";var q3x="tot";var d3x="protot";var m13="multiRestore";var g3x="otype";var U3x="_typ";var L3x="pro";var p3x="prototy";var H3x="ototy";var C3x="rototype";var k3x="oto";var L7a=q7V;L7a+=D5x;L7a+=r0P;L7a+=f8x;var S7a=C4B;S7a+=J8x;var k7a=U3x;k7a+=g3B;var b7a=j4B;b7a+=n6V;b7a+=E0P;b7a+=L899[567670];var D5a=E0P;D5a+=c3x;D5a+=I3x;var t5a=p3x;t5a+=m3P;var w5a=i3x;w5a+=g3x;var L5a=b3x;L5a+=L899[567670];var S5a=L8V;S5a+=k3x;S5a+=n6V;S5a+=m3P;var k5a=L8V;k5a+=H3x;k5a+=E0P;k5a+=L899[567670];var p5a=U7B;p5a+=o3x;p5a+=S3x;p5a+=K4P;var I5a=L3x;I5a+=N2V;I5a+=W4B;var N2a=Q3x;N2a+=E3x;var W2a=L3x;W2a+=r0P;W2a+=g3x;var v2a=p3P;v2a+=w3x;var y2a=E0P;y2a+=C3x;var u2a=i3x;u2a+=L899[643646];u2a+=W4B;var P2a=L3x;P2a+=q3x;P2a+=I3x;var C2a=E0P;C2a+=C3x;var E2a=d3x;E2a+=d2P;E2a+=m3P;var L2a=K4P;L2a+=L899[643646];L2a+=j8P;var S2a=i3x;S2a+=g3x;var H2a=K4P;H2a+=F0P;H2a+=k2P;H2a+=L899[567670];var c2a=E4B;c2a+=L899[567670];c2a+=r0P;var J6a=E0P;J6a+=C3x;var j6a=l3x;j6a+=O7B;j6a+=j2P;var m6a=L8V;m6a+=r3x;var h6a=Z3x;h6a+=t3x;h6a+=L899[643646];var v6a=L8V;v6a+=r3x;var u6a=G2P;u6a+=F0P;u6a+=X3x;u6a+=G2P;var G6a=L3x;G6a+=N2V;G6a+=W4B;var s6a=b7P;s6a+=p4x;var O6a=L3x;O6a+=z3x;var K6a=P8P;K6a+=L899[567670];K6a+=r0P;var M6a=L8V;M6a+=L899[643646];M6a+=r0P;M6a+=g3x;var C6a=G1B;C6a+=S9P;C6a+=R4P;var w6a=j4B;w6a+=r0P;w6a+=R3x;w6a+=L899[567670];var o6a=u1B;o6a+=P4P;o6a+=j8B;var W0a=L8V;W0a+=L899[643646];W0a+=q3x;W0a+=I3x;var v0a=x7x;v0a+=I0V;var y0a=E0P;y0a+=R4P;y0a+=r3x;var B0a=E0P;B0a+=c3x;B0a+=R3x;B0a+=L899[567670];var P0a=U5x;P0a+=M4P;P0a+=L899[567670];function Field(options,classes,host){var P3x="\">";var V3x="g-inf";var L9x="efix";var M3x="field-processi";var F9x='<div data-dte-e="msg-label" class="';var B9x="side";var f3x="iVal";var A3x="ms";var T9x='<div data-dte-e="field-processing" class="';var y9x='msg-multi';var W3x="e=\"multi-";var a3x="<div d";var J3x="<div data-dte-e=\"multi-value";var H9x="or=\"";var n3x="lick";var R9x='<label data-dte-e="label" class="';var z9x="ld_";var W9x="multiReturn";var O3x="<spa";var D9x='<div data-dte-e="msg-error" class="';var j3x=" data-dte-";var Q9x="lToDa";var P9x='msg-error';var V9x='<div data-dte-e="msg-multi" class="';var s9x="fieldInfo";var b9x="bel";var N3x="info\" class=\"";var h3x="store";var U9x="\" class=\"";var y3x="ge\" class=\"";var x9x="none";var x3x="<div da";var M9x='<div data-dte-e="input" class="';var c9x="Contr";var K3x="msg-";var v9x='multi-info';var C9x="ntern";var k9x="\" f";var o9x="namePr";var B3x="ata-dte-e=\"";var v3x="tiRe";var g9x="belInf";var m3x="<span";var S9x="eP";var I9x="ol";var T3x="msg-in";var w9x="ldT";var u3x="class=\"";var E9x="lFromData";var X9x="E_Fie";var G3x="msg-info\" ";var Y3x="a-dte-e=\"msg-messa";var i9x="dte-e=\"input-control\" class=\"";var q9x="alI";var r9x="rror adding field - unknown field type ";var Y9x='multi-value';var t9x="DT";var s3x="n></span></di";var O9x='msg-message';var u9x='input-control';var e3x="inf";var p9x="<div data-";var A9x='</span>';var n9x='msg-label';var G9x="repe";var z0a=F3x;z0a+=L899[567670];var t0a=L899.E4P;t0a+=n3x;var C0a=a2P;C0a+=w0P;C0a+=L899.E4P;C0a+=o3P;var w0a=k2P;w0a+=b2P;w0a+=G2P;w0a+=q3V;var E0a=M3x;E0a+=R0B;var Q0a=K3x;Q0a+=d0B;Q0a+=R4P;var L0a=A3x;L0a+=V3x;L0a+=L899[643646];var H0a=Z4B;H0a+=D3x;H0a+=L899[567670];var k0a=M0P;k0a+=T0P;k0a+=s0P;var b0a=P3x;b0a+=O3x;b0a+=s3x;b0a+=f0P;var g0a=F7V;g0a+=u8V;g0a+=f0P;var i0a=O0P;i0a+=s0P;var p0a=o1V;p0a+=Q3P;var I0a=T3x;I0a+=q7V;var c0a=a3x;c0a+=B3x;c0a+=G3x;c0a+=u3x;var U0a=x3x;U0a+=r0P;U0a+=Y3x;U0a+=y3x;var J4a=M0P;J4a+=T0P;J4a+=n7V;J4a+=Q3P;var f4a=s7P;f4a+=r0P;f4a+=Z6V;f4a+=L899[567670];var N4a=o1V;N4a+=Q3P;var W4a=n5V;W4a+=G2P;W4a+=v3x;W4a+=h3x;var j4a=M0P;j4a+=N0P;j4a+=f0P;var m4a=e3x;m4a+=L899[643646];var e4a=o1V;e4a+=Q3P;var h4a=m3x;h4a+=j3x;h4a+=W3x;h4a+=N3x;var v4a=o1V;v4a+=Q3P;var y4a=n5V;y4a+=O3V;y4a+=f3x;y4a+=j9V;var Y4a=J3x;Y4a+=U9x;var x4a=C2x;x4a+=B6P;x4a+=c9x;x4a+=I9x;var u4a=p9x;u4a+=i9x;var G4a=q9P;G4a+=E0P;G4a+=B6P;var B4a=C4x;B4a+=Q3P;var a4a=Z3P;a4a+=g9x;a4a+=L899[643646];var T4a=Z3P;T4a+=b9x;var s4a=o1V;s4a+=Q3P;var O4a=k9x;O4a+=H9x;var P4a=G2P;P4a+=b7x;P4a+=L899[567670];P4a+=G2P;var D4a=K4P;D4a+=F0P;D4a+=Y1V;var V4a=o9x;V4a+=L899[567670];V4a+=S3P;V4a+=r2P;var A4a=F3x;A4a+=S9x;A4a+=R4P;A4a+=L9x;var K4a=E2V;K4a+=E2P;var M4a=P4P;M4a+=F0P;M4a+=r0P;M4a+=F0P;var n4a=R9B;n4a+=Q9x;n4a+=p9P;var z4a=R9B;z4a+=E9x;var t4a=w0P;t4a+=P4P;var Z4a=r0P;Z4a+=d2P;Z4a+=m3P;var r4a=K4P;r4a+=F0P;r4a+=k2P;r4a+=L899[567670];var q4a=r0P;q4a+=d2P;q4a+=E0P;q4a+=L899[567670];var C4a=Q5V;C4a+=w9x;C4a+=I3x;C4a+=W6P;var w4a=L899[567670];w4a+=h4B;var E4a=k2P;E4a+=b2P;E4a+=O3V;E4a+=w0P;var Q4a=w0P;Q4a+=C9x;Q4a+=q9x;Q4a+=d9x;var that=this;var multiI18n=host[Q4a]()[E4a];var opts=$[w4a](M5P,{},Field[l9x],options);if(!Editor[C4a][opts[q4a]]){var l4a=r0P;l4a+=d2P;l4a+=m3P;var d4a=N6P;d4a+=r9x;throw new Error(d4a + opts[l4a]);}this[W6P]={classes:classes,host:host,multiIds:[],multiValue:K5P,multiValues:{},name:opts[r4a],opts:opts,processing:K5P,type:Editor[Z9x][opts[Z4a]]};if(!opts[t4a]){var X4a=t9x;X4a+=X9x;X4a+=z9x;opts[f1V]=X4a + opts[L8P];}if(opts[J4P] === C5P){opts[J4P]=opts[L8P];}this[z4a]=function(d){var F4a=L0P;F4a+=R4P;var R4a=P4P;R4a+=U9P;return dataGet(opts[R4a])(d,F4a);};this[n4a]=dataSet(opts[M4a]);var template=$(c8V + classes[K4a] + n3V + classes[A4a] + opts[W4B] + n3V + classes[V4a] + opts[D4a] + n3V + opts[F3V] + i8V + R9x + classes[P4a] + O4a + Editor[W4x](opts[f1V]) + s4a + opts[T4a] + F9x + classes[n9x] + i8V + opts[a4a] + B4a + I2x + M9x + classes[G4a] + i8V + u4a + classes[x4a] + g8V + Y4a + classes[y4a] + v4a + multiI18n[a7B] + h4a + classes[K9x] + e4a + multiI18n[m4a] + A9x + j4a + V9x + classes[W4a] + N4a + multiI18n[f4a] + J4a + D9x + classes[P9x] + g8V + U0a + classes[O9x] + i8V + opts[l4B] + Q2V + c0a + classes[I0a] + p0a + opts[s9x] + i0a + g0a + T9x + classes[F4V] + b0a + k0a);var input=this[a9x](H0a,opts);var side=F5P;if(input && input[B9x]){var o0a=w0P;o0a+=H4x;side=input[B9x];input=input[o0a];}if(input !== F5P){var S0a=E0P;S0a+=G9x;S0a+=K4P;S0a+=P4P;el(u9x,template)[S0a](input);}else {template[C2V](C3B,x9x);}this[H8V]={container:template,inputControl:el(u9x,template),label:el(V9V,template)[C6V](side),fieldInfo:el(L0a,template),labelInfo:el(n9x,template),fieldError:el(Q0a,template),fieldMessage:el(O9x,template),multi:el(Y9x,template),multiReturn:el(y9x,template),multiInfo:el(v9x,template),processing:el(E0a,template)};this[H8V][w0a][y9P](C0a,function(){var h9x="hasC";var j9x='readonly';var l0a=r0P;l0a+=d2P;l0a+=E0P;l0a+=L899[567670];var d0a=h9x;d0a+=G2P;d0a+=e9x;d0a+=W6P;var q0a=L899[643646];q0a+=E0P;q0a+=r0P;q0a+=W6P;if(that[W6P][q0a][d3B] && !template[d0a](classes[m9x]) && opts[l0a] !== j9x){var Z0a=L899.L4P;Z0a+=L899[643646];Z0a+=L899.E4P;Z0a+=T2P;var r0a=m7P;r0a+=F0P;r0a+=G2P;that[r0a](C5P);that[Z0a]();}});this[H8V][W9x][y9P](t0a,function(){var N9x="Restor";var X0a=U7B;X0a+=w0P;X0a+=N9x;X0a+=L899[567670];that[X0a]();});$[U8P](this[W6P][z0a],function(name,fn){var f9x="func";var R0a=f9x;R0a+=r0P;R0a+=w0P;R0a+=y9P;if(typeof fn === R0a && that[name] === undefined){that[name]=function(){var J9x="shif";var K0a=b2P;K0a+=K4P;K0a+=J9x;K0a+=r0P;var M0a=V2B;M0a+=G2P;M0a+=G2P;var n0a=U13;n0a+=w0P;n0a+=L899.E4P;n0a+=L899[567670];var F0a=L8V;F0a+=H3x;F0a+=E0P;F0a+=L899[567670];R9I.Q9I();var args=Array[F0a][n0a][M0a](arguments);args[K0a](name);var ret=that[a9x][Q9B](that,args);return ret === undefined?that:ret;};}});}Field[c13][C4B]=function(set){var I13="efa";var p13='default';R9I.l9I();var A0a=L899[643646];A0a+=E0P;A0a+=r0P;A0a+=W6P;var opts=this[W6P][A0a];if(set === undefined){var D0a=a9P;D0a+=L899.E4P;D0a+=q3V;D0a+=y9P;var V0a=P4P;V0a+=I13;V0a+=b2P;V0a+=O3V;var def=opts[p13] !== undefined?opts[V0a]:opts[C4B];return typeof def === D0a?def():def;}opts[C4B]=set;return this;};Field[c13][P0a]=function(){var i13="isa";var b13="Clas";var a0a=U5x;a0a+=M4P;a0a+=L899[567670];var T0a=P4P;T0a+=i13;T0a+=I0V;T0a+=P4P;var s0a=g13;s0a+=X8B;var O0a=Z1V;O0a+=b13;O0a+=W6P;this[H8V][A8x][O0a](this[W6P][s0a][T0a]);this[a9x](a0a);return this;};Field[B0a][E5B]=function(){var k13="rents";var Y0a=K4P;Y0a+=L899[643646];Y0a+=K4P;Y0a+=L899[567670];var x0a=u8V;x0a+=f3P;x0a+=N5x;var u0a=G2P;u0a+=Z0P;u0a+=H1V;u0a+=b7P;var G0a=E2B;G0a+=k13;var container=this[H8V][A8x];return container[G0a](e2V)[u0a] && container[C2V](x0a) != Y0a?M5P:K5P;};Field[y0a][v0a]=function(toggle){var e0a=g13;R9I.l9I();e0a+=X8B;var h0a=S0B;h0a+=k2P;if(toggle === void V1P){toggle=M5P;}if(toggle === K5P){return this[p1B]();}this[h0a][A8x][N7P](this[W6P][e0a][m9x]);this[a9x](s9V);return this;};Field[c13][H13]=function(){var o13="sse";var L13="C";var j0a=g13;j0a+=o13;j0a+=W6P;var m0a=S13;R9I.Q9I();m0a+=L13;m0a+=V8V;return this[H8V][A8x][m0a](this[W6P][j0a][m9x]) === K5P;};Field[W0a][i8P]=function(msg,fn){var Q13="Message";var E13="_t";var d13="fieldError";var q13="containe";var H6a=P4P;H6a+=L899[643646];R9I.l9I();H6a+=k2P;var k6a=G6P;k6a+=k2P;k6a+=W6P;k6a+=P8P;var b6a=i8P;b6a+=Q13;var g6a=E13;g6a+=I3x;g6a+=o2P;g6a+=K4P;var N0a=a2P;N0a+=b9B;N0a+=L899[567670];N0a+=W6P;var classes=this[W6P][N0a];if(msg){var U6a=L899[567670];U6a+=w9P;U6a+=L899[643646];U6a+=R4P;var J0a=w13;J0a+=w0P;J0a+=K4P;J0a+=E2P;var f0a=P4P;f0a+=L899[643646];f0a+=k2P;this[f0a][J0a][x7P](classes[U6a]);}else {var i6a=E2P;i6a+=R4P;i6a+=Z6V;var p6a=O4P;p6a+=C13;p6a+=j7P;var I6a=q13;I6a+=R4P;var c6a=S0B;c6a+=k2P;this[c6a][I6a][p6a](classes[i6a]);}this[g6a](b6a,msg);return this[k6a](this[H6a][d13],msg,fn);};Field[c13][o6a]=function(msg){var l13="eldInfo";var S6a=S3P;S6a+=l13;return this[r13](this[H8V][S6a],msg);};Field[c13][l3B]=function(){var Z13="tiId";var t13="multiVal";var E6a=U2P;E6a+=K4P;R9I.Q9I();E6a+=H1V;E6a+=b7P;var Q6a=k2P;Q6a+=E7x;Q6a+=Z13;Q6a+=W6P;var L6a=t13;L6a+=j9V;return this[W6P][L6a] && this[W6P][Q6a][E6a] !== D1P;};Field[w6a][C6a]=function(){var X13="Cla";var d6a=E2P;d6a+=T6P;var q6a=S13;q6a+=X13;R9I.Q9I();q6a+=W6P;q6a+=W6P;return this[H8V][A8x][q6a](this[W6P][J7V][d6a]);};Field[c13][o2x]=function(){var R13=", ";var n13=" textarea";var F13="select,";var M13="peFn";var z6a=p3P;R9I.l9I();z6a+=z13;var X6a=o2x;X6a+=R13;X6a+=F13;X6a+=n13;var t6a=w0P;t6a+=K4P;t6a+=x6x;var Z6a=i3B;Z6a+=M13;var r6a=w0P;r6a+=K4P;r6a+=E0P;r6a+=B6P;var l6a=r0P;l6a+=I3x;return this[W6P][l6a][r6a]?this[Z6a](t6a):$(X6a,this[H8V][z6a]);};Field[c13][A8V]=function(){var A13="typeFn";var V13='input, select, textarea';var K13="ocu";if(this[W6P][W4B][A8V]){var F6a=L899.L4P;F6a+=K13;F6a+=W6P;var R6a=G6P;R6a+=A13;this[R6a](F6a);}else {var n6a=P4P;n6a+=U3V;$(V13,this[n6a][A8x])[A8V]();}return this;};Field[M6a][K6a]=function(){var D13="pts";var s13='get';var O13="sMultiV";var T13="getFormatter";var P13="ypeFn";var P6a=L899[643646];P6a+=D13;var D6a=G6P;D6a+=r0P;D6a+=P13;var V6a=v7V;V6a+=t6V;V6a+=r0P;var A6a=w0P;A6a+=O13;A6a+=c5x;if(this[A6a]()){return undefined;}return this[V6a](this[D6a](s13),this[W6P][P6a][T13]);};Field[O6a][s6a]=function(animate){var a13="iner";var u13="deUp";R9I.Q9I();var G13="slideUp";var a6a=w13;a6a+=a13;var T6a=P4P;T6a+=L899[643646];T6a+=k2P;var el=this[T6a][a6a];if(animate === undefined){animate=M5P;}if(this[W6P][B13][G6V]() && animate && $[l5P][G13]){var B6a=U13;B6a+=w0P;B6a+=u13;el[B6a]();}else {el[C2V](C3B,G7P);}return this;};Field[G6a][u6a]=function(str){var y6a=F0P;y6a+=E0P;y6a+=m3P;y6a+=d0P;var Y6a=b7P;Y6a+=r0P;Y6a+=P0B;var x6a=P4P;x6a+=L899[643646];x6a+=k2P;var label=this[x6a][v1V];var labelInfo=this[H8V][x13][b2V]();if(str === undefined){return label[h1V]();}label[Y6a](str);label[y6a](labelInfo);return this;};Field[v6a][h6a]=function(msg){var e6a=P4P;e6a+=L899[643646];e6a+=k2P;return this[r13](this[e6a][x13],msg);};Field[m6a][j6a]=function(msg,fn){var Y13="sg";var y13="fieldMessage";var W6a=D3B;W6a+=Y13;return this[W6a](this[H8V][y13],msg,fn);};Field[c13][n4B]=function(id){var N6a=v13;N6a+=h13;R9I.l9I();var value;var multiValues=this[W6P][N6a];var multiIds=this[W6P][e13];var isMultiValue=this[l3B]();if(id === undefined){var f6a=G2P;f6a+=Z0P;f6a+=H1V;f6a+=b7P;var fieldVal=this[n1V]();value={};for(var i=V1P;i < multiIds[f6a];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {value=this[n1V]();}return value;};Field[J6a][m13]=function(){var W13="V";R9I.Q9I();var j13="multi";var U2a=j13;U2a+=W13;U2a+=c5x;this[W6P][U2a]=M5P;this[N13]();};Field[c13][c2a]=function(id,val){var J13="isPla";var f13="tiV";var U43="tiValu";var k2a=V5V;k2a+=f13;k2a+=F0P;k2a+=t2x;var i2a=J13;i2a+=w0P;i2a+=f0B;var I2a=n5V;I2a+=G2P;I2a+=U43;I2a+=T0B;var that=this;var multiValues=this[W6P][I2a];var multiIds=this[W6P][e13];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){var c43="pus";var p43="setFormatter";R9I.l9I();if($[c9P](idSrc,multiIds) === -D1P){var p2a=c43;p2a+=b7P;multiIds[p2a](idSrc);}multiValues[idSrc]=that[I43](val,that[W6P][L1B][p43]);};if($[i2a](val) && id === undefined){var g2a=L899[567670];g2a+=F0P;g2a+=L899.E4P;g2a+=b7P;$[g2a](val,function(idSrc,innerVal){set(idSrc,innerVal);});}else if(id === undefined){var b2a=L899[567670];b2a+=F0P;b2a+=L899.E4P;b2a+=b7P;$[b2a](multiIds,function(i,idSrc){R9I.Q9I();set(idSrc,val);});}else {set(id,val);}this[W6P][k2a]=M5P;this[N13]();return this;};Field[c13][H2a]=function(){var i43="ame";var o2a=K4P;o2a+=i43;return this[W6P][L1B][o2a];};Field[S2a][L2a]=function(){var Q2a=p3P;Q2a+=z13;return this[H8V][Q2a][V1P];};Field[E2a][j5B]=function(){var g43="ullDef";var b43="au";var w2a=K4P;w2a+=g43;w2a+=b43;w2a+=O3V;return this[W6P][L1B][w2a];};Field[C2a][F4V]=function(set){var k43="internal";var H43="process";var X2a=S9B;X2a+=f3V;var t2a=k43;t2a+=H7B;var Z2a=n6B;Z2a+=Z0B;R9I.l9I();var r2a=M8P;r2a+=K8P;var l2a=L899.E4P;l2a+=T0V;var d2a=H43;d2a+=f7x;if(set === undefined){var q2a=n6B;q2a+=w7V;q2a+=w0P;q2a+=R0B;return this[W6P][q2a];}this[H8V][d2a][l2a](r2a,set?u6V:G7P);this[W6P][Z2a]=set;this[W6P][B13][t2a](X2a,[set]);return this;};Field[c13][j8V]=function(val,multiCheck){var t43="etFo";var r43="_type";var X43="rmatter";var d43="_mu";var l43="ltiValueCheck";var Z43="Fn";var C43="multiValue";var z43='set';var q43="entityDecode";if(multiCheck === void V1P){multiCheck=M5P;}var decodeFn=function(d){var S43="lace";var o43="ace";var Q43='£';var w43='\n';var E43='\'';var L43='"';var M2a=R4P;M2a+=L7P;M2a+=Z3P;M2a+=q7P;var n2a=h7P;n2a+=p2B;n2a+=o43;var F2a=R4P;F2a+=L7P;F2a+=S43;var R2a=h7P;R9I.Q9I();R2a+=E0P;R2a+=Z3P;R2a+=q7P;var z2a=W6P;z2a+=D2P;z2a+=f7x;return typeof d !== z2a?d:d[R2a](/&gt;/g,a8B)[F2a](/&lt;/g,z8x)[n2a](/&amp;/g,Y2B)[D2B](/&quot;/g,L43)[M2a](/&#163;/g,Q43)[D2B](/&#39;/g,E43)[D2B](/&#10;/g,w43);};this[W6P][C43]=K5P;var decode=this[W6P][L1B][q43];if(decode === undefined || decode === M5P){if(Array[G3P](val)){var K2a=U2P;K2a+=R0B;K2a+=C8P;for(var i=V1P,ien=val[K2a];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}if(multiCheck === M5P){var D2a=d43;D2a+=l43;var V2a=r43;V2a+=Z43;var A2a=W6P;A2a+=t43;A2a+=X43;val=this[I43](val,this[W6P][L1B][A2a]);this[V2a](z43,val);this[D2a]();}else {this[a9x](z43,val);}return this;};Field[P2a][q0B]=function(animate,toggle){var R43="ideD";var K43="Down";var F43="wn";var M43="hide";var T2a=U13;T2a+=R43;T2a+=L899[643646];T2a+=F43;var s2a=F8P;s2a+=N5x;var O2a=d8x;O2a+=F0P;O2a+=w0P;O2a+=n43;if(animate === void V1P){animate=M5P;}if(toggle === void V1P){toggle=M5P;}if(toggle === K5P){return this[M43](animate);}var el=this[H8V][O2a];if(this[W6P][B13][s2a]() && animate && $[l5P][T2a]){var a2a=U13;a2a+=w0P;a2a+=j8P;a2a+=K43;el[a2a]();}else {var G2a=u8V;G2a+=W6P;G2a+=E0P;G2a+=N5x;var B2a=L899.E4P;B2a+=W6P;B2a+=W6P;el[B2a](G2a,C5P);;}return this;};Field[u2a][k3B]=function(options,append){var x2a=F3x;x2a+=L899[567670];if(append === void V1P){append=K5P;}R9I.l9I();if(this[W6P][x2a][k3B]){var Y2a=b2P;Y2a+=E0P;Y2a+=P4P;Y2a+=r6V;this[a9x](Y2a,options,append);}return this;};Field[y2a][n1V]=function(val){return val === undefined?this[c2V]():this[j8V](val);};Field[c13][v2a]=function(value,original){var V43="opt";var A43="com";var e2a=A43;e2a+=I3B;e2a+=L899[567670];var h2a=V43;h2a+=W6P;var compare=this[W6P][h2a][e2a] || deepCompare;return compare(value,original);};Field[c13][D1V]=function(){var j2a=X0P;j2a+=p9P;var m2a=L899[643646];m2a+=E0P;m2a+=I4V;return this[W6P][m2a][j2a];};Field[W2a][N2a]=function(){var P43="emove";var O43="tai";var D43="stroy";var c5a=P4P;c5a+=L899[567670];c5a+=D43;var U5a=R4P;U5a+=P43;var J2a=i2V;J2a+=O43;J2a+=n43;var f2a=P4P;f2a+=L899[643646];f2a+=k2P;this[f2a][J2a][U5a]();this[a9x](c5a);return this;};Field[c13][d3B]=function(){return this[W6P][L1B][d3B];};Field[c13][e13]=function(){R9I.l9I();return this[W6P][e13];};Field[I5a][p5a]=function(show){var s43="ock";var b5a=M4P;b5a+=s43;var g5a=L899.E4P;g5a+=W6P;g5a+=W6P;var i5a=P4P;i5a+=L899[643646];R9I.l9I();i5a+=k2P;this[i5a][K9x][g5a]({display:show?b5a:G7P});};Field[k5a][i9V]=function(){R9I.Q9I();var T43="ultiVa";var H5a=k2P;H5a+=T43;H5a+=h13;this[W6P][e13]=[];this[W6P][H5a]={};};Field[c13][r9B]=function(){var a43="ub";var o5a=W6P;o5a+=a43;o5a+=k2P;o5a+=G4P;return this[W6P][L1B][o5a];};Field[S5a][L5a]=function(){var E5a=V6B;E5a+=T6P;var Q5a=P4P;Q5a+=L899[643646];Q5a+=k2P;return this[Q5a][E5a];};Field[w5a][I43]=function(val,formatter){var G43="tters";var B43="ho";var u43="if";if(formatter){var Z5a=B43;Z5a+=W6P;Z5a+=r0P;var r5a=L899.E4P;r5a+=F0P;r5a+=h3P;if(Array[G3P](formatter)){var l5a=z9P;l5a+=E0P;l5a+=x7V;var d5a=q7V;d5a+=d7V;d5a+=F0P;d5a+=G43;var q5a=W6P;q5a+=b7P;q5a+=u43;q5a+=r0P;var C5a=W6P;C5a+=G2P;C5a+=m4B;var args=formatter[C5a]();var name=args[q5a]();formatter=Field[d5a][name][l5a](this,args);}return formatter[r5a](this[W6P][Z5a],val,this);}return val;};Field[t5a][r13]=function(el,msg,fn){var y43="fu";var h43="parent";var e43="slideDown";var x43=":";var Y43="visib";var j43="htm";var v43="internalSettings";var n5a=x43;R9I.l9I();n5a+=Y43;n5a+=U2P;var F5a=w0P;F5a+=W6P;var X5a=y43;X5a+=f2B;if(msg === undefined){return el[h1V]();}if(typeof msg === X5a){var R5a=Q0P;R5a+=Y5x;var z5a=b7P;z5a+=L899[643646];z5a+=D6V;var editor=this[W6P][z5a];msg=msg(editor,new DataTable$1[R5a](editor[v43]()[K3P]));}if(el[h43]()[F5a](n5a) && $[l5P][n0V]){el[h1V](msg);if(msg){el[e43](fn);;}else {var M5a=U13;M5a+=f1V;M5a+=L899[567670];M5a+=K2P;el[M5a](fn);}}else {var V5a=u8V;V5a+=W6P;V5a+=m43;V5a+=d2P;var A5a=L899.E4P;A5a+=W6P;A5a+=W6P;var K5a=j43;K5a+=G2P;el[K5a](msg || C5P)[A5a](V5a,msg?u6V:G7P);if(fn){fn();}}return this;};Field[D5a][N13]=function(){var b03="lti";var L03="internalMultiInfo";var p03="ltiI";var J43="ultiRet";var S03="noMulti";var g03="inputControl";var k03="bloc";var N43="ulti";var I03="tiValues";var c03="ultiValue";var i03="lock";var f43="In";var U03="isM";var o03="internalI18n";var H03="Control";var W43="NoEd";var g7a=b7P;g7a+=L899[643646];g7a+=W6P;g7a+=r0P;var i7a=V5V;i7a+=q3V;i7a+=W43;i7a+=G4P;var p7a=n5V;p7a+=G2P;p7a+=q3V;var I7a=S0B;I7a+=k2P;var c7a=w0P;c7a+=K4P;c7a+=q7V;var U7a=b7P;U7a+=r0P;U7a+=k2P;U7a+=G2P;var J5a=k2P;J5a+=N43;J5a+=f43;J5a+=q7V;var f5a=n5V;f5a+=G2P;f5a+=r0P;f5a+=w0P;var N5a=b7P;N5a+=L899[643646];N5a+=W6P;N5a+=r0P;var W5a=L899.E4P;W5a+=W6P;W5a+=W6P;var j5a=k2P;j5a+=J43;j5a+=U8B;var T5a=U03;T5a+=c03;var s5a=v13;s5a+=u5V;s5a+=L899[567670];var O5a=V5V;O5a+=I03;var P5a=k2P;P5a+=b2P;P5a+=p03;P5a+=x8P;var last;var ids=this[W6P][P5a];var values=this[W6P][O5a];var isMultiValue=this[W6P][s5a];var isMultiEditable=this[W6P][L1B][d3B];var val;var different=K5P;if(ids){for(var i=V1P;i < ids[V7P];i++){val=values[ids[i]];if(i > V1P && !deepCompare(val,last)){different=M5P;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[T5a]()){var x5a=L899[403715];x5a+=i03;var u5a=L899.E4P;u5a+=W6P;u5a+=W6P;var G5a=n5V;G5a+=G2P;G5a+=q3V;var B5a=K4P;B5a+=s6V;var a5a=P4P;a5a+=L899[643646];a5a+=k2P;this[a5a][g03][C2V]({display:B5a});this[H8V][G5a][u5a]({display:x5a});}else {var m5a=K4P;m5a+=L899[643646];m5a+=d6P;var e5a=L899.E4P;e5a+=W6P;e5a+=W6P;var h5a=n5V;h5a+=b03;var v5a=P4P;v5a+=L899[643646];v5a+=k2P;var y5a=k03;y5a+=o3P;var Y5a=o2x;Y5a+=H03;this[H8V][Y5a][C2V]({display:y5a});this[v5a][h5a][e5a]({display:m5a});if(isMultiValue && !different){this[j8V](last,K5P);}}this[H8V][j5a][W5a]({display:ids && ids[V7P] > D1P && different && !isMultiValue?u6V:G7P});var i18n=this[W6P][N5a][o03]()[f5a];this[H8V][J5a][U7a](isMultiEditable?i18n[c7a]:i18n[S03]);this[I7a][p7a][t1B](this[W6P][J7V][i7a],!isMultiEditable);this[W6P][g7a][L03]();return M5P;};Field[b7a][k7a]=function(name){var Q03="hift";var E03="ply";var H7a=L899.Q4P;H7a+=W6P;H7a+=Q03;var args=[];for(var _i=D1P;_i < arguments[V7P];_i++){args[_i - D1P]=arguments[_i];}args[H7a](this[W6P][L1B]);var fn=this[W6P][W4B][name];R9I.Q9I();if(fn){var o7a=F0P;o7a+=E0P;o7a+=E03;return fn[o7a](this[W6P][B13],args);}};Field[S7a]=defaults;Field[L7a]={};return Field;})();var button={action:F5P,className:F5P,tabIndex:V1P,text:F5P};var displayController={close:function(){},init:function(){},open:function(){},node:function(){}};var DataTable=$[Q7a][r5P];var apiRegister=DataTable[E7a][w03];function __getInst(api){var q03="oI";var C03="ditor";var l03="context";var d03="nit";var C7a=U4B;C7a+=C03;var w7a=q03;w7a+=d03;var ctx=api[l03][V1P];return ctx[w7a][O1V] || ctx[C7a];}function __setBasic(inst,opts,type,plural){var Z03="nfir";var r03="asic";var t03=/%d/;if(!opts){opts={};}if(opts[l5B] === undefined){var q7a=m5V;q7a+=r03;opts[l5B]=q7a;}if(opts[a7B] === undefined){var d7a=r0P;d7a+=w0P;d7a+=r0P;d7a+=U2P;opts[d7a]=inst[S3V][type][a7B];}if(opts[l4B] === undefined){if(type === r2B){var r7a=p3P;r7a+=Z03;r7a+=k2P;var l7a=w0P;l7a+=L899[137811];l7a+=H6V;l7a+=K4P;var confirm=inst[l7a][type][r7a];opts[l4B]=plural !== D1P?confirm[G6P][D2B](t03,plural):confirm[Y6V];}else {opts[l4B]=C5P;}}return opts;}apiRegister(Z7a,function(){R9I.Q9I();return __getInst(this);});apiRegister(X03,function(opts){var t7a=L899.E4P;t7a+=h7P;t7a+=r6V;var inst=__getInst(this);inst[c9V](__setBasic(inst,opts,t7a));return this;});apiRegister(X7a,function(opts){var inst=__getInst(this);R9I.l9I();inst[u4P](this[V1P][V1P],__setBasic(inst,opts,X9P));return this;});apiRegister(z7a,function(opts){var inst=__getInst(this);R9I.l9I();inst[u4P](this[V1P],__setBasic(inst,opts,X9P));return this;});apiRegister(R7a,function(opts){R9I.Q9I();var F7a=h7P;F7a+=A4P;var inst=__getInst(this);inst[T3P](this[V1P][V1P],__setBasic(inst,opts,F7a,D1P));return this;});apiRegister(z03,function(opts){var n7a=G2P;n7a+=Z0P;n7a+=H1V;R9I.l9I();n7a+=b7P;var inst=__getInst(this);inst[T3P](this[V1P],__setBasic(inst,opts,r2B,this[V1P][n7a]));return this;});apiRegister(M7a,function(type,opts){var R03="inl";var A7a=M4B;A7a+=r0P;if(!type){var K7a=R03;K7a+=J1B;type=K7a;}else if($[A7a](type)){var V7a=w0P;V7a+=q8B;opts=type;type=V7a;}__getInst(this)[type](this[V1P][V1P],opts);return this;});apiRegister(F03,function(opts){var D7a=Q7V;D7a+=L899[403715];D7a+=M4P;D7a+=L899[567670];__getInst(this)[D7a](this[V1P],opts);return this;});apiRegister(n03,file);apiRegister(P7a,files);$(document)[O7a](M03,function(e,ctx,json){var K03="namespace";var A03='dt';if(e[K03] !== A03){return;}R9I.l9I();if(json && json[n1B]){var s7a=L899[567670];s7a+=F0P;s7a+=L899.E4P;s7a+=b7P;$[s7a](json[n1B],function(name,files){var T7a=C0P;T7a+=q0P;if(!Editor[n1B][name]){Editor[n1B][name]={};}$[T7a](Editor[n1B][name],files);});}});var _buttons=$[a7a][B7a][C0P][l5B];$[G7a](_buttons,{create:{text:function(dt,node,config){var V03="buttons.cr";var Y7a=Z4B;Y7a+=V1x;var x7a=V03;x7a+=D3x;R9I.Q9I();x7a+=L899[567670];var u7a=w0P;u7a+=d9x;return dt[u7a](x7a,config[O1V][S3V][Y7a][D03]);},className:y7a,editor:F5P,formButtons:{text:function(editor){var h7a=L899.E4P;h7a+=R4P;R9I.Q9I();h7a+=L899[567670];h7a+=r6V;var v7a=k6V;v7a+=H6V;v7a+=K4P;return editor[v7a][h7a][e5V];},action:function(e){var e7a=W6P;e7a+=b2P;e7a+=x2P;this[e7a]();}},formMessage:F5P,formOptions:{},formTitle:F5P,action:function(e,dt,node,config){var T03="ces";var P03="formOption";var O03="itl";var a03="sing";var s03="mMessag";var I8a=P03;I8a+=W6P;var c8a=p9V;c8a+=Y6P;c8a+=O03;c8a+=L899[567670];var U8a=w0P;R9I.l9I();U8a+=L899[137811];U8a+=H6V;U8a+=K4P;var J7a=L899.L4P;J7a+=Z6V;J7a+=s03;J7a+=L899[567670];var f7a=t0P;f7a+=d0P;var W7a=l7V;W7a+=q9V;W7a+=l9V;var j7a=L899[643646];j7a+=K4P;j7a+=L899[567670];var m7a=L8V;m7a+=L899[643646];m7a+=T03;m7a+=a03;var that=this;var editor=config[O1V];this[m7a](M5P);editor[j7a](W7a,function(){var N7a=B03;N7a+=W6P;N7a+=q9P;N7a+=P8P;R9I.Q9I();that[N7a](K5P);})[c9V]($[f7a]({buttons:config[G03],message:config[J7a] || editor[U8a][c9V][l4B],title:config[c8a] || editor[S3V][c9V][a7B],nest:M5P},config[I8a]));}},createInline:{text:function(dt,node,config){var u03="buttons.";var g8a=j5V;g8a+=l6x;var i8a=u03;R9I.l9I();i8a+=Z4B;i8a+=N4P;i8a+=f4P;var p8a=k6V;p8a+=H6V;p8a+=K4P;return dt[p8a](i8a,config[g8a][S3V][c9V][D03]);},className:b8a,editor:F5P,formButtons:{text:function(editor){var x03="submi";var o8a=x03;o8a+=r0P;var H8a=E9B;H8a+=F0P;H8a+=f4P;var k8a=w0P;R9I.l9I();k8a+=L899[137811];k8a+=T7V;return editor[k8a][H8a][o8a];},action:function(e){var S8a=W6P;S8a+=b8B;S8a+=w0P;S8a+=r0P;this[S8a]();}},formOptions:{},action:function(e,dt,node,config){var Y03="formOp";var Q8a=Y03;Q8a+=x9P;Q8a+=H8P;var L8a=w0P;L8a+=q8B;R9I.Q9I();L8a+=O5P;config[O1V][L8a](config[L1x],config[Q8a]);},position:y03},edit:{extend:E8a,text:function(dt,node,config){var v03="tons.edit";var d8a=Q7V;d8a+=j6P;var q8a=k6V;q8a+=H6V;q8a+=K4P;var C8a=i3V;C8a+=v03;var w8a=k6V;w8a+=H6V;w8a+=K4P;return dt[w8a](C8a,config[O1V][q8a][u4P][d8a]);},className:h03,editor:F5P,formButtons:{text:function(editor){R9I.Q9I();var l8a=a4P;l8a+=w0P;l8a+=r0P;return editor[S3V][l8a][e5V];},action:function(e){R9I.Q9I();this[e5V]();}},formMessage:F5P,formOptions:{},formTitle:F5P,action:function(e,dt,node,config){var U63="formTitle";var j03="rmMessag";var W03="si";var m03="i18";var e03="rmOpt";var N03="ls";var P8a=q7V;P8a+=e03;P8a+=U0V;P8a+=W6P;var D8a=m03;D8a+=K4P;var V8a=L899[567670];V8a+=P4P;V8a+=G4P;var A8a=k6V;A8a+=H6V;A8a+=K4P;var K8a=L899.L4P;K8a+=L899[643646];K8a+=j03;K8a+=L899[567670];var M8a=L899[567670];M8a+=h4B;var n8a=L899[567670];n8a+=P4P;n8a+=w0P;n8a+=r0P;var R8a=L899[643646];R8a+=K4P;R8a+=L899[567670];var z8a=B03;z8a+=W03;z8a+=R0B;var X8a=U2P;X8a+=K4P;X8a+=H1V;X8a+=b7P;var t8a=U2P;t8a+=K4P;t8a+=v9P;var Z8a=L899.E4P;Z8a+=L3P;Z8a+=N03;var r8a=X2B;r8a+=W8P;var that=this;var editor=config[O1V];var rows=dt[J7P]({selected:M5P})[r8a]();var columns=dt[Y3P]({selected:M5P})[r8P]();var cells=dt[Z8a]({selected:M5P})[r8P]();var items=columns[t8a] || cells[X8a]?{rows:rows,columns:columns,cells:cells}:rows;this[z8a](M5P);editor[R8a](f3B,function(){var f03="roce";var F8a=E0P;R9I.l9I();F8a+=f03;F8a+=J03;that[F8a](K5P);})[n8a](items,$[M8a]({buttons:config[G03],message:config[K8a] || editor[A8a][V8a][l4B],title:config[U63] || editor[D8a][u4P][a7B],nest:M5P},config[P8a]));}},remove:{extend:c63,limitTo:[I63],text:function(dt,node,config){var p63='buttons.remove';var s8a=w0P;s8a+=L899[137811];s8a+=T7V;var O8a=w0P;O8a+=L899[137811];O8a+=T7V;return dt[O8a](p63,config[O1V][s8a][T3P][D03]);},className:T8a,editor:F5P,formButtons:{text:function(editor){var B8a=R4P;B8a+=J1x;B8a+=C13;B8a+=L899[567670];R9I.l9I();var a8a=w0P;a8a+=L899[137811];a8a+=H6V;a8a+=K4P;return editor[a8a][B8a][e5V];},action:function(e){this[e5V]();}},formMessage:function(editor,dt){var b63="confirm";var g63="emo";var i63="firm";var h8a=R4P;h8a+=L899[567670];h8a+=m43;h8a+=q7P;var v8a=L899.E4P;v8a+=y9P;v8a+=i63;var y8a=W6P;y8a+=a6x;var Y8a=R4P;Y8a+=g63;Y8a+=m0V;var x8a=w0P;x8a+=d9x;var u8a=q9P;u8a+=d9P;u8a+=L899[567670];u8a+=W6P;var G8a=S9P;G8a+=L9P;var rows=dt[G8a]({selected:M5P})[u8a]();var i18n=editor[x8a][Y8a];var question=typeof i18n[b63] === y8a?i18n[v8a]:i18n[b63][rows[V7P]]?i18n[b63][rows[V7P]]:i18n[b63][G6P];return question[h8a](/%d/g,rows[V7P]);},formOptions:{},formTitle:F5P,action:function(e,dt,node,config){var o63="formMessage";var k63="Title";var J8a=R4P;J8a+=J1x;J8a+=L899[643646];J8a+=m0V;var f8a=p9V;f8a+=k63;var N8a=L899[567670];N8a+=r2P;N8a+=r0P;N8a+=q0P;var W8a=q3P;W8a+=L899[567670];W8a+=W6P;var j8a=R4P;j8a+=v3P;var m8a=B03;m8a+=H63;m8a+=P8P;var e8a=j5V;e8a+=r0P;e8a+=Z6V;var that=this;var editor=config[e8a];this[m8a](M5P);editor[s6V](f3B,function(){that[F4V](K5P);})[T3P](dt[j8a]({selected:M5P})[W8a](),$[N8a]({buttons:config[G03],message:config[o63],title:config[f8a] || editor[S3V][J8a][a7B],nest:M5P},config[g7V]));}}});_buttons[U3a]=$[U7P]({},_buttons[c3a]);_buttons[I3a][U7P]=S63;_buttons[p3a]=$[i3a]({},_buttons[g3a]);_buttons[L63][U7P]=S63;var Editor=(function(){var R63="lE";var Q63="Dat";var r63="lMultiInfo";var X63="18";var l63="inter";var Z63="inte";var v23="models";var t63="rnalI";var E63="eTime";var F53='2.0.5';var w63="rsion";var a23="_multiInfo";var C63="eldTypes";var d63="tings";var q63="internalS";var z63="interna";var t1P=E0P;t1P+=F0P;t1P+=H6x;t1P+=W6P;var Z1P=Q63;Z1P+=E63;var r1P=w4V;r1P+=L899[567670];r1P+=G2P;r1P+=P4P;var l1P=m0V;l1P+=w63;var d1P=L899.L4P;d1P+=D1B;d1P+=T0B;var q1P=L899.L4P;q1P+=w0P;q1P+=C63;var C1P=q63;C1P+=s0V;C1P+=d63;var w1P=E0P;w1P+=c3x;w1P+=I3x;var E1P=l63;E1P+=x1V;E1P+=r63;var Q1P=Z63;Q1P+=t63;Q1P+=X63;Q1P+=K4P;var S1P=z63;S1P+=R63;S1P+=Y1x;function Editor(init){var Z23="nCl";var V23="uttons";var n23="disab";var R53='initEditor';var j63="e=\"body_content\" class=\"";var B63="e-e=";var y23=" as a 'new' instance";var J23='<form data-dte-e="form" class="';var Y63=" cl";var X23="plate";var W63="indic";var s23="_blur";var F23="ile";var I53='"><div class="';var D23="kg";var H23="oProce";var M63="iqu";var A23="cle";var t23="tem";var w23="mNo";var i23="tend";var L53="unique";var E53='i18n.dt.dte';var m23='<div data-dte-e="processing" class="';var B23="_submitTable";var l53='xhr.dt.dte';var s63="/div>";var V63="ontent";var R23="Cr";var j23='"><span></span></div>';var S53='init.dt.dte';var a63="<div data-dt";var L23="edOp";var o23="eo";var o53="ield";var u23="DataTables Editor must be init";var k23="_sub";var l23="Re";var C23="ataSo";var g53='foot';var Y23="ised";var f63="lass=\"";var y63="s=\"";var n63="que";var G63="\"form_";var g23="_weakI";var f23='<div data-dte-e="foot" class="';var p53='"></div></div>';var r23="_actio";var b23="nArray";var z53='initComplete';var M23="epe";var c23="temp";var O63="=\"head\" class=\"";var T63="/form>";var e63="\"></d";var N63="oces";var E23="eldFro";var h23="actionName";var P63="<div data-dte-e";var d23="_clos";var v63="foo";var D63="m_conte";var I23="lat";var G23="_submitError";var S23="topen";var x23="ial";var h63="ter";var O23="_ajax";var U53='<div data-dte-e="form_error" class="';var Q23="_fi";var F63="tri";var u63="content\" class=\"";var i53='<div data-dte-e="form_buttons" class="';var U23="del";var t53='Cannot find display controller ';var q23="_crudAr";var J63="nique";var x63="></di";var e23="domTable";var z23="ubmi";var c53='<div data-dte-e="form_info" class="';var Q53="nTable";var A63="body_";var K63="ents";var T23="_optionsUpdate";var X53="init";var N23="body";var P23="bubblePosition";var W23='<div data-dte-e="body" class="';var m63="<div data-dte-";var K23="nden";var p23="exten";var o1P=F63;o1P+=o8B;var H1P=u8V;H1P+=W6P;H1P+=m43;H1P+=d2P;var b1P=F8P;b1P+=Z3P;b1P+=d2P;var p1P=L899.Q4P;p1P+=w0P;p1P+=n63;var I1P=L899[643646];I1P+=K4P;var N9a=L899.Q4P;N9a+=M63;N9a+=L899[567670];var m9a=L899[643646];m9a+=K4P;var h9a=r0P;h9a+=g3P;h9a+=L899[567670];var x9a=t1x;x9a+=K63;var u9a=H9B;u9a+=J03;var G9a=A63;G9a+=L899.E4P;G9a+=V63;var B9a=l1B;B9a+=D63;B9a+=u0V;var a9a=L899.L4P;a9a+=L899[643646];a9a+=R4P;a9a+=k2P;var T9a=k0V;T9a+=F0P;T9a+=P4P;T9a+=E2P;var s9a=m0P;s9a+=S0V;var O9a=k0V;O9a+=F0P;O9a+=P4P;O9a+=E2P;var P9a=P63;P9a+=O63;var D9a=L899.L4P;D9a+=Z7V;R9I.Q9I();var V9a=F8B;V9a+=s63;var A9a=E2P;A9a+=R4P;A9a+=L899[643646];A9a+=R4P;var K9a=L899.L4P;K9a+=L899[643646];K9a+=R4P;K9a+=k2P;var M9a=M0P;M9a+=T63;var n9a=a63;n9a+=B63;n9a+=G63;n9a+=u63;var F9a=r0P;F9a+=F0P;F9a+=P8P;var R9a=L899.L4P;R9a+=L899[643646];R9a+=R4P;R9a+=k2P;var z9a=M0P;z9a+=Z3V;z9a+=P4P;z9a+=s0P;var X9a=o1V;X9a+=x63;X9a+=m7P;X9a+=Q3P;var t9a=d8x;t9a+=L899[567670];t9a+=K4P;t9a+=r0P;var Z9a=V8B;Z9a+=Y63;Z9a+=e9x;Z9a+=y63;var r9a=o1V;r9a+=Q3P;var l9a=v63;l9a+=h63;var d9a=e63;d9a+=s0P;var q9a=L899[403715];q9a+=L899[643646];q9a+=P4P;q9a+=d2P;var C9a=m63;C9a+=j63;var w9a=o1V;w9a+=Q3P;var E9a=d0V;E9a+=F0P;E9a+=w0V;var Q9a=W63;Q9a+=O6P;Q9a+=Z6V;var L9a=L8V;L9a+=N63;L9a+=H63;L9a+=P8P;var S9a=o1V;S9a+=Q3P;var o9a=d0V;o9a+=M3B;var H9a=V8B;H9a+=M1B;H9a+=L899.E4P;H9a+=f63;var k9a=b2P;k9a+=J63;var b9a=W6P;b9a+=s0V;b9a+=d63;var g9a=k2P;g9a+=L899[643646];g9a+=U23;g9a+=W6P;var i9a=k6V;i9a+=H6V;i9a+=K4P;var p9a=L899[567670];p9a+=r2P;p9a+=f4P;p9a+=d0P;var I9a=P4P;I9a+=L899[567670];I9a+=W1B;I9a+=b7P;var c9a=c23;c9a+=I23;c9a+=L899[567670];var U9a=c2B;U9a+=r2P;var J3a=p9P;J3a+=L899[403715];J3a+=G2P;J3a+=L899[567670];var f3a=p23;f3a+=P4P;var N3a=V4P;N3a+=i23;var j3a=g23;j3a+=b23;var m3a=k23;m3a+=l8B;var e3a=G6P;e3a+=K4P;e3a+=H23;e3a+=J03;var h3a=l0B;h3a+=o23;h3a+=m3P;h3a+=K4P;var v3a=j9B;v3a+=u2P;v3a+=S23;var y3a=G6P;y3a+=Y4B;y3a+=L23;y3a+=Z0P;var Y3a=D3B;Y3a+=L899[567670];Y3a+=M9V;var x3a=G6P;x3a+=q9P;x3a+=u7V;x3a+=d6P;var u3a=Q23;u3a+=E23;u3a+=w23;u3a+=j8P;var G3a=U4B;G3a+=P4P;G3a+=w0P;G3a+=r0P;var B3a=M1x;B3a+=C23;B3a+=b2P;B3a+=s8x;var a3a=q23;a3a+=j3V;var T3a=d23;T3a+=L899[567670];T3a+=l23;T3a+=P8P;var s3a=r23;s3a+=Z23;s3a+=b9B;var O3a=R9B;O3a+=G2P;var P3a=t23;P3a+=X23;var D3a=W6P;D3a+=z23;D3a+=r0P;var V3a=M0B;V3a+=l4V;var A3a=W6P;A3a+=L899[567670];A3a+=r0P;var K3a=h7P;K3a+=e7P;K3a+=m7P;K3a+=L899[567670];var M3a=L899[643646];M3a+=K4P;var n3a=L899[643646];n3a+=L899.L4P;n3a+=L899.L4P;var F3a=k2P;F3a+=D6P;var R3a=e1B;R3a+=R23;R3a+=V1x;var z3a=w0P;z3a+=P4P;z3a+=W6P;var X3a=b7P;X3a+=w0P;X3a+=P4P;X3a+=L899[567670];var t3a=P8P;t3a+=L899[567670];t3a+=r0P;var Z3a=L899.L4P;Z3a+=w0P;Z3a+=o4V;var r3a=L899.L4P;r3a+=F23;var l3a=S3P;l3a+=f3V;l3a+=W6P;var d3a=L899[567670];d3a+=R4P;d3a+=S9P;d3a+=R4P;var q3a=E4x;q3a+=U2P;var C3a=L899[567670];C3a+=P4P;C3a+=w0P;C3a+=r0P;var w3a=M8P;w3a+=K8P;w3a+=P2P;w3a+=j1V;var E3a=n23;E3a+=U2P;var Q3a=P4P;Q3a+=M23;Q3a+=K23;Q3a+=r0P;var L3a=L899.E4P;L3a+=h7P;L3a+=r6V;var S3a=A23;S3a+=Y7x;var o3a=L899[403715];o3a+=V23;var H3a=B2P;H3a+=R4P;var k3a=R6V;k3a+=D23;k3a+=D0V;var b3a=F0P;b3a+=L899[228964];b3a+=B5V;var _this=this;this[Z1V]=add;this[b3a]=ajax;this[k3a]=background;this[H3a]=blur;this[U8V]=bubble;this[P23]=bubblePosition;this[o3a]=buttons;this[S3a]=clear;this[W6V]=close;this[L3a]=create;this[Q9V]=undependent;this[Q3a]=dependent;this[B3V]=destroy;this[E3a]=disable;this[G6V]=display;this[E5B]=displayed;this[w3a]=displayNode;this[C3a]=edit;this[q3a]=enable;this[d3a]=error$1;this[P9V]=field;this[l3a]=fields;this[r3a]=file;this[Z3a]=files;this[t3a]=get;this[X3a]=hide;this[z3a]=ids;this[n0B]=inError;this[e1B]=inline;this[R3a]=inlineCreate;this[F3a]=message;this[F5V]=mode;this[I9V]=modifier;this[n4B]=multiGet;this[g9V]=multiSet;this[r3P]=node;this[n3a]=off;this[M3a]=on;this[s6V]=one;this[F8V]=open;this[O5V]=order;this[K3a]=remove;this[A3a]=set;this[V3a]=show;this[D3a]=submit;this[K3P]=table;this[P3a]=template;this[a7B]=title;this[O3a]=val;this[s3a]=_actionClass;this[O23]=_ajax;this[z2V]=_animate;this[H0B]=_assembleMain;this[s23]=_blur;this[d8V]=_clearDynamicInfo;this[t8V]=_close;this[T3a]=_closeReg;this[a3a]=_crudArgs;this[B3a]=_dataSource;this[l5V]=_displayReorder;this[G3a]=_edit;this[l8V]=_event;this[A4B]=_eventName;this[u3a]=_fieldFromNode;this[Y3V]=_fieldNames;this[x4B]=_focus;this[o0B]=_formOptions;this[x3a]=_inline;this[T23]=_optionsUpdate;this[Y3a]=_message;this[a23]=_multiInfo;this[T4B]=_nestedClose;this[y3a]=_nestedOpen;this[v3a]=_postopen;this[h3a]=_preopen;this[a9B]=_processing;this[e3a]=_noProcessing;this[m3a]=_submit;this[B23]=_submitTable;this[x9B]=_submitSuccess;this[G23]=_submitError;this[I7V]=_tidy;this[j3a]=_weakInArray;if(!(this instanceof Editor)){var W3a=u23;W3a+=x23;W3a+=Y23;W3a+=y23;alert(W3a);}init=$[N3a](M5P,{},Editor[l9x],init);this[W6P]=$[f3a](M5P,{},Editor[v23][T7P],{actionName:init[h23],table:init[e23] || init[J3a],ajax:init[U9a],idSrc:init[a3P],formOptions:init[g7V],template:init[c9a]?$(init[U1B])[I9a]():F5P});this[J7V]=$[p9a](M5P,{},Editor[J7V]);this[S3V]=init[i9a];Editor[g9a][b9a][k9a]++;var that=this;var classes=this[J7V];var wrapper=$(H9a + classes[o9a] + S9a + m23 + classes[L9a][Q9a] + j23 + W23 + classes[N23][E9a] + w9a + C9a + classes[q9a][M0V] + d9a + Q2V + f23 + classes[l9a][P0V] + r9a + Z9a + classes[j2B][t9a] + X9a + Q2V + z9a);var form=$(J23 + classes[R9a][F9a] + i8V + n9a + classes[p9V][M0V] + g8V + M9a);this[H8V]={wrapper:wrapper[V1P],form:form[V1P],formError:$(U53 + classes[K9a][A9a] + V9a)[V1P],formInfo:$(c53 + classes[D9a][W8x] + g8V)[V1P],header:$(P9a + classes[O9a][s9a] + I53 + classes[T9a][M0V] + p53)[V1P],buttons:$(i53 + classes[a9a][l5B] + g8V)[V1P],formContent:el(B9a,form)[V1P],footer:el(g53,wrapper)[V1P],body:el(e2V,wrapper)[V1P],bodyContent:el(G9a,wrapper)[V1P],processing:el(u9a,wrapper)[V1P]};$[U8P](init[x9a],function(evt,fn){that[y9P](evt,function(){var b53="appl";var H53="shift";var k53="sli";var v9a=b53;v9a+=d2P;var y9a=L899.E4P;y9a+=F0P;y9a+=G2P;y9a+=G2P;var Y9a=k53;Y9a+=q7P;var args=Array[c13][Y9a][y9a](arguments);args[H53]();fn[v9a](that,args);});});this[H8V];var table$1=this[W6P][h9a];if(init[B3P]){var e9a=L899.L4P;e9a+=o53;e9a+=W6P;this[Z1V](init[e9a]);}$(document)[m9a](S53 + this[W6P][L53],function(e,settings,json){var j9a=K0B;j9a+=U2P;if(_this[W6P][j9a] && settings[Q53] === $(table$1)[V1P]){var W9a=G6P;W9a+=L0P;W9a+=R4P;settings[W9a]=_this;}})[y9P](E53 + this[W6P][N9a],function(e,settings){var d53="angua";var C53="oLanguage";var q53="oL";var w53="nTabl";var f9a=w53;f9a+=L899[567670];if(_this[W6P][K3P] && settings[f9a] === $(table$1)[V1P]){var J9a=L899[567670];J9a+=u8V;J9a+=N2V;J9a+=R4P;if(settings[C53][J9a]){var c1P=a4P;c1P+=N1V;var U1P=q53;U1P+=d53;U1P+=j2P;$[U7P](M5P,_this[S3V],settings[U1P][c1P]);}}})[I1P](l53 + this[W6P][p1P],function(e,settings,json){var r53="_op";var Z53="tionsUp";var i1P=r0P;i1P+=F0P;R9I.l9I();i1P+=M4P;i1P+=L899[567670];if(json && _this[W6P][i1P] && settings[Q53] === $(table$1)[V1P]){var g1P=r53;g1P+=Z53;g1P+=X0P;g1P+=f4P;_this[g1P](json);}});if(!Editor[b1P][init[G6V]]){var k1P=P4P;k1P+=Q8P;k1P+=m43;k1P+=d2P;throw new Error(t53 + init[k1P]);}this[W6P][c1B]=Editor[G6V][init[H1P]][X53](this);this[l8V](z53,[]);$(document)[o1P](R53,[this]);}Editor[c13][S1P]=function(name,args){var L1P=G6P;L1P+=t1x;L1P+=Z0P;L1P+=r0P;this[L1P](name,args);};Editor[c13][Q1P]=function(){R9I.Q9I();return this[S3V];};Editor[c13][E1P]=function(){return this[a23]();};Editor[w1P][C1P]=function(){R9I.l9I();return this[W6P];};Editor[q1P]={checkbox:checkbox,datatable:datatable,datetime:datetime,hidden:hidden,password:password,radio:radio,readonly:readonly,select:select,text:text,textarea:textarea,upload:upload,uploadMany:uploadMany};Editor[d1P]={};Editor[l1P]=F53;Editor[J7V]=classNames;Editor[r1P]=Field;Editor[Z1P]=F5P;Editor[i8P]=error;Editor[t1P]=pairs;Editor[W4x]=function(id){R9I.l9I();return safeDomId(id,C5P);};Editor[g6B]=upload$1;Editor[l9x]=defaults$1;Editor[v23]={button:button,displayController:displayController,fieldType:fieldType,formOptions:formOptions,settings:settings};Editor[t5B]={dataTable:dataSource$1,html:dataSource};Editor[G6V]={envelope:envelope,lightbox:self};return Editor;})();DataTable[n53]=Editor;$[X1P][z1P][R1P]=Editor;if(DataTable[o5x]){var n1P=M53;n1P+=K53;n1P+=A53;var F1P=M53;F1P+=f4P;F1P+=V53;F1P+=L899[567670];Editor[F1P]=DataTable[n1P];}if(DataTable[M1P][K1P]){var A1P=D53;A1P+=m3P;A1P+=W6P;$[U7P](Editor[A1P],DataTable[C0P][P53]);}DataTable[C0P][P53]=Editor[Z9x];return Editor;});

/*! DataTables styling integration for DataTables' Editor
 * ©SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-dt', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-dt')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';

return $.fn.dataTable.Editor;

}));


