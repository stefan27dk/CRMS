import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import Table from '../common/Table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { updateSubscription } from '../../actions/subscriptionsActions';

// Class #################################################################################################################################
class SubscriptionsPeriodOverview extends Component {
    componentWillReceiveProps() {
        const { data } = this.props;
        this.filterData(data);
    }


    jan = [];
    feb = [];
    mar = [];
    apr = [];
    maj = [];
    jun = [];
    jul = [];
    aug = [];
    sep = [];
    oct = [];
    nov = [];
    dec = [];



    filterData = (data) => {
        this.jan = [];
        this.feb = [];
        this.mar = [];
        this.apr = [];
        this.maj = [];
        this.jun = [];
        this.jul = [];
        this.aug = [];
        this.sep = [];
        this.oct = [];
        this.nov = [];
        this.dec = [];

        let sortedData = _.orderBy(data, ['periodStartDate'], ['asc']);

        for (let i = 0; i < sortedData.length; i++) {
            if (!moment(sortedData[i].periodStartDate).isSame(new Date(), 'year')) // Check if startDate is same year as now
            {
                sortedData.splice(i, 1);
                continue;
            }
            this.populateMonthsArrays(sortedData[i]);
        }
    }



    populateMonthsArrays = (sub) => {
        if (sub.periodStartDate.slice(5, 7) == '01') {
            this.jan.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '02') {
            this.feb.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '03') {
            this.mar.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '04') {
            this.apr.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '05') {
            this.maj.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '06') {
            this.jun.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '07') {
            this.jul.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '08') {
            this.aug.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '09') {
            this.sep.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '10') {
            this.oct.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '11') {
            this.nov.push(sub);
        }
        else if (sub.periodStartDate.slice(5, 7) == '12') {
            this.dec.push(sub);
        }
    }



    calculateTableTotalValue = (data) => {
        let monthSubsValues = { yearlyValue: 0, monthly: 0 };
        for (let i = 0; i < data.length; i++) {
            monthSubsValues.yearlyValue += data[i].yearPrice;
            monthSubsValues.monthly += data[i].monthPrice;
        }
        return monthSubsValues;
    }



    generateTableValueHtml = (data) => {
        let values = this.calculateTableTotalValue(data);

        return (<div className="center-text"><span className="ml-3 font-weight-bold">Årlig: {values.yearlyValue} kr.</span> <span className="ml-3 font-weight-bold">Mdl: {values.monthly} kr.</span></div>);
    }


    render() {
        const { overviewModalIsOpen, toggleOverViewModal, columns, totalValues } = this.props;

        // Return HTML
        return (
            <>
                {/*Modal - Overview ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal className="modal-w90p" backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={overviewModalIsOpen} size="xl" toggle={toggleOverViewModal}>
                    <ModalHeader toggle={toggleOverViewModal}><span className="title">Periode Oversigt:</span><p className="h6 font-weight-bold">{totalValues}</p></ModalHeader>
                    <ModalBody>

                        {/*January*/}
                        {this.jan.length !== 0 ?
                            <Table className="my-5" tableColumns={columns} tableData={this.jan} tableTitle={"JANUAR"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableJan'} html={this.generateTableValueHtml(this.jan)} excelFilter={'removeLastColumn'} />
                            : ''}


                        {/*February*/}
                        {this.feb.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.feb} tableTitle={"FEBRUAR"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableFeb'} html={this.generateTableValueHtml(this.feb)} excelFilter={'removeLastColumn'} />
                            : ''}



                        {/*March*/}
                        {this.mar.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.mar} tableTitle={"MARTS"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableMar'} html={this.generateTableValueHtml(this.mar)} excelFilter={'removeLastColumn'} />
                            : ''}


                        {/*April*/}
                        {this.apr.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.apr} tableTitle={"APRIL"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableApr'} html={this.generateTableValueHtml(this.apr)} excelFilter={'removeLastColumn'} />
                            : ''}



                        {/*Maj*/}
                        {this.maj.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.maj} tableTitle={"MAJ"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableMaj'} html={this.generateTableValueHtml(this.maj)} excelFilter={'removeLastColumn'} />
                            : ''}



                        {/*JUNE*/}
                        {this.jun.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.jun} tableTitle={"JUNI"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableJun'} html={this.generateTableValueHtml(this.jun)} excelFilter={'removeLastColumn'} />
                            : ''}


                        {/*JULY*/}
                        {this.jul.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.jul} tableTitle={"JULI"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableJul'} html={this.generateTableValueHtml(this.jul)} excelFilter={'removeLastColumn'} />
                            : ''}


                        {/*AUGUST*/}
                        {this.aug.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.aug} tableTitle={"AUGUST"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableAug'} html={this.generateTableValueHtml(this.aug)} excelFilter={'removeLastColumn'} />
                            : ''}


                        {/*SEPTEMBER*/}
                        {this.sep.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.sep} tableTitle={"SEPTEMBER"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableSep'} html={this.generateTableValueHtml(this.sep)} excelFilter={'removeLastColumn'} />

                            : ''}



                        {/*OCTOBER*/}
                        {this.oct.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.oct} tableTitle={"OKTOBER"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableOct'} html={this.generateTableValueHtml(this.oct)} excelFilter={'removeLastColumn'} />
                            : ''}



                        {/*NOVEMBER*/}
                        {this.nov.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.nov} tableTitle={"NOVEMBER"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableNov'} html={this.generateTableValueHtml(this.nov)} excelFilter={'removeLastColumn'} />
                            : ''}



                        {/*DECEMBER*/}
                        {this.dec.length !== 0 ?
                            <Table tableColumns={columns} tableData={this.dec} tableTitle={"DECEMBER"} tableContainerClass={'table-holder-h-fit'} tableId={'overViewTableDec'} html={this.generateTableValueHtml(this.dec)} excelFilter={'removeLastColumn'} />
                            : ''}

                    </ModalBody>
                    <ModalFooter>
                        {/*<Button color="primary" onClick={this.toggle}>Gem</Button>{' '}*/}
                    </ModalFooter>
                </Modal>

            </>

        );
    }

}



// Map STATE to Props ==============================================================================================================================
const mapStateToProps = state => ({
    products: state.products.list,
    Users: state.users
});

export default connect(mapStateToProps, {
    updateSubscription
})(SubscriptionsPeriodOverview);










