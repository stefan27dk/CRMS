import React, { Component } from 'react';
//import PropTypes from 'prop-types';
//import { Tab } from 'bootstrap';
import TableHead from './TableHead';
import TableBoddy from './TableBody';
//import sortBy from "lodash/sortBy";
import _ from 'lodash';



// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faUserEdit, faPen, faUserPlus, faTimesCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { excelButton } from '../../Definitions/commonDefinitions';
import { searchArray } from '../../Logic/commonLogic';




// Class #################################################################################################################################
class Table extends Component {


    // State =============================================================================================================================
    state = {
        path: null,
        orderBy: 'asc',
        Search: ''
    }



    // Handle on Sort ======================================================================================================================
    // Usage: Set Sorting order ASC & DECS
    handleSort = (path) => {
        const { orderBy } = this.state;
        let order = '';

        // Toggle   - ASC & DESC
        if (orderBy === 'asc') {
            order = 'desc';
        }
        else {
            order = 'asc';
        }

        this.setState({ path, orderBy: order });
    }



    // HandleSearch =======================================================================================================================
    // Usage: Search field get Value and Name and set to state
    handleSearch = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }




    // OrderItems ============================================================================================================================
    //Usage: Ordering the items from the table / Sorting
    orderItems = () => {
        let { tableData } = this.props;
        const { path, orderBy, Search } = this.state;

        //// Search ----------------
        //if (Search !== '')
        //{
        //    //tableData = _.filter(tableData, (item) => {
        //    //    //return _.includes(item.name.toLowerCase(), Search.toLowerCase())
        //    //})

        //    const text = _.toLower(Search);

        //   return _.filter(tableData, function (object) {
        //        return _(object).some(function (string) {
        //            return _(string).toLower().includes(text);
        //        });
        //    });
        //}


        // Search ----------------
        if (Search !== '') {
            let text = Search.toLocaleLowerCase()
            return searchArray(tableData, text);
        }



        // Sort ASC & DESC --------
        if (path != null) {
            tableData = _.orderBy(tableData, [path],
                [orderBy]);
        }
        return tableData;
    }




    // Render ===================================================================================================================
    render() {
        const { path, orderBy } = this.state;
        const tableData = this.orderItems();
        const { tableTitle, tableIcon, tableContainerClass, tableId, excelFilter, html } = this.props;
        return (
            <>
                <div>

                    <div className="inline-lr">
                        <span className="h2 p-2 fit-content-w autoResizeFont-big no-wrap">{tableIcon}</span>
                        <sub><span className="inline h5">{tableData.length}</span></sub>
                        {excelButton(tableTitle, tableData.length, tableId !== undefined ? tableId : 'commonTable', excelFilter)}
                        {html}

                        <div className="m-l-auto m-t-b-auto mr-2 no-wrap inline-row">
                            <FontAwesomeIcon className="fa-lg mr-1 ml-3 inline-row" icon={faSearch} />
                            <input placeholder="Søg..." className="form-control input-default inline-row" name="Search" value={this.state.Search} onChange={this.handleSearch} type="text" />
                            <span onClick={() => this.setState({ Search: '' })} className="red-t no-select m-t-b-auto inline-row"><FontAwesomeIcon className="fa-lg mr-2" icon={faTimesCircle} /></span>
                        </div>
                    </div>

                    <div className={tableContainerClass !== undefined ? tableContainerClass : "table-holder"}>
                        <table id={tableId !== undefined ? tableId : 'commonTable'} className="table table-hover">
                            {/*<table className="table table-striped table-itl">*/}
                            <TableHead sortPath={path} getSortOrder={orderBy} tableColumns={this.props.tableColumns} handleSort={this.handleSort} tableTitle={this.props.tableTitle} />
                            <TableBoddy onRowClick={this.props.onRowClick} tableColumns={this.props.tableColumns} tableData={tableData} tableTitle={this.props.tableTitle} />
                        </table>
                    </div>
                </div>
            </>
        );
    }
}
export default Table;


