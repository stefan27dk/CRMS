////import { data } from 'jquery';
import React, { Component } from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltUp, faLongArrowAltDown, faArrowsAltV } from '@fortawesome/free-solid-svg-icons'



class TableHead extends Component {


    // Customers Sorting State - Icons  =========================================================================================================================
    columnSortingState = (column) => {
        const { sortPath, getSortOrder } = this.props;
        // DESC
        if (sortPath === column.path && getSortOrder === 'desc') {
            return <p className="column-content"><FontAwesomeIcon className="column-icon" icon={faLongArrowAltUp} />{column.title}</p>;
        }
        else if (sortPath === column.path && getSortOrder === 'asc') // ASC
        {
            return <p><FontAwesomeIcon className="column-icon" icon={faLongArrowAltDown} />{column.title}</p>;
        }
        else  // Default
        {
            return <p><FontAwesomeIcon className="column-icon" icon={faArrowsAltV} />{column.title}</p>;
        }
    }




    // Render ===================================================================================================================================================
    render() {
        const { tableColumns, handleSort } = this.props;
        return (
            <thead className="no-select">
                <tr>
                    {tableColumns.map((column, index) =>
                        //<th key={index} onClick={() => this.props.handleSort(column.path)}>{this.props.sortPath === column.path && getSortOrder === "desc" ? <p className="column-content"><FontAwesomeIcon className="column-icon" icon={faLongArrowAltDown} />{column.title}</p> : <p><FontAwesomeIcon className="column-icon" icon={faLongArrowAltUp} />{column.title}</p>}</th>
                        <th key={index} onClick={() => handleSort(column.path)}>{this.columnSortingState(column)}</th>
                    )}
                </tr>
            </thead>
        );
    }
}
export default TableHead;


