import React, {Component} from 'react';
import ReactExport from "react-data-export";
import {Button, Icon} from 'semantic-ui-react'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class OrdersExcel extends Component {

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: '', archive: ''},
            tableData: [],
            isLoading: false,
            error: null,
            errorText: '',
            hasSalesRole: false,
        };
    }

    render() {
        return (
            <ExcelFile element={
                <Button icon labelPosition='left' positive size='small'>
                <Icon name='file excel outline' /> Export do excelu</Button>
            } filename={'Zakázky'}
            >
                <ExcelSheet data={this.props.tableData} name="Zakázky">
                    <ExcelColumn label="Zakázka" value="id"/>
                    <ExcelColumn label="Název" value="name"/>
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

/*



                    <ExcelColumn label="Marital Status" value={(col) => col.is_married ? "Married" : "Single"}/>

 */