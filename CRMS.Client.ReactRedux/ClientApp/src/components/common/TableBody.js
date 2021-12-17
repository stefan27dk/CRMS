import React, { Component } from 'react';

class TableBody extends Component {

    render() {
        return (<tbody>
            {this.props.tableData.map((rowData, index) =>
            
                <tr key={index} onClick={() => typeof this.props.onRowClick === 'function'? this.props.onRowClick(rowData) : ''} >
                    {this.props.tableColumns.map((column, cindex) => {

                        if (column.content !== undefined && typeof column.content === 'function')
                        {
                            return <td key={cindex}>{column.content(rowData)}</td>;
                        }
                        else
                        {
                            return <td key={cindex}>{rowData[column.path]}</td>;
                        }
                    }
                    )}
                </tr>
            )}
        </tbody>);
    }
}

export default TableBody;



           