import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import OrdersDetail from './OrdersDetail';
import {optionYesNo, optionDeliveryType} from "../constants";
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import moment from "moment/moment";

class Orders extends Component {

    texts = {
        newItem: 'Nová zakázka',
        header: 'Zakázka'
    };

    constructor(){
        super();
        this.state = {
            showModal: false,
            newItem: false,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: ''},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            errorText: ''
        };
        this.items = this.items.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        console.log(PHP_url);
        fetch(PHP_url+'/nz_rest_api_slim/orders', {
                //mode: 'no-cors',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
        })
            .then((response)  => {
                if (response.status === 200){
                    return response.json();
                }
            }).then(json => {
                    this.setState({tableData : json});
                    this.setState({ isLoading: false });
                    this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
                    this.setState({ errorText: '' });
            }).catch(error => {
                this.setState({ error, isLoading: false });
                this.setState({ errorText: error.toString() });
                console.log("error")
            });
    };

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    handleChangeRowsPerPage = (e, { value }) => {
        this.setState({ rowsPerPage: value })
    };

    closeEdit(item, saved){
        this.setState({showModal: false});
        if (saved === true){
            let items = [];
            if (this.state.newItem === true){
                items = this.state.tableData.push(item);
            }else{
                items = this.state.tableData[this.state.tableData.findIndex(el => el.id === item.id)] = item;
            }
            this.setState({
                showData: items
            });
        }
    }

    editItem(item){
        this.setState({
            showModal: true,
            newItem: false,
            showData: item
        });
        console.log('Edit item '+ item.id + this.state.showModal);
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: []}
            );
        console.log('New item '+ this.state.showModal);
    }

    deleteItem(item){
        fetch(PHP_url+'/nz_rest_api_slim/orders/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    tableData: _.reject(this.state.tableData, function(el) { return el.id === item.id; })}
                );
            }
            this.setState({ errorText: '' });
        }).catch(error => {
            this.setState({ errorText: error.toString() });
            console.log(error.toString())
        });
    }

    handleSort = clickedColumn => () => {
        const { column, tableData, direction } = this.state;
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                //tableData: _.sortBy(tableData, clickedColumn),
                direction: 'ascending',
            });
            if ((typeof tableData[0][clickedColumn]) === 'string'){
                this.setState({tableData: _.orderBy(tableData, [row => row[clickedColumn].toLowerCase()])})
            }
            else {
                this.setState({tableData: _.orderBy(tableData, clickedColumn)})
            }
        return
        }
        this.setState({
            tableData: tableData.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    decodeOptionValue(value, optionArray) {
        if (value === null) {
            return ''
        }else {
            let optionItem = optionArray.find(item => item.value === value);
            return optionItem.text;
        }
    }

    getFormatDate = (date) => {
        return ((date == null) ? '' : moment(date).format('DD.MM.YYYY'));
    };


    items(item, i){
        return(
            <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{this.getFormatDate(item.processdate)}</Table.Cell>
                <Table.Cell>{this.decodeOptionValue(item.errand, optionYesNo)}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                    {'   '}
                    <Icon link name='trash' onClick={this.deleteItem.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }

    // Capturing redux form values from redux form store (pay attention to the name we defined in the previous component)
    // <Table.Cell>{item.processtime}</Table.Cell>
    /*onSubmit = values => {(
            values.id
    )};

                <Table.Cell>{this.decodeOptionValue(item.deliverytype, optionDeliveryType)}</Table.Cell>
                <Table.Cell>{item.winprice}</Table.Cell>

    */

    render(){
        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ];

        //id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: ''
        //                            <Table.HeaderCell sorted={column === 'processtime' && direction} onClick={this.handleSort('processtime')}>Hodina</Table.HeaderCell>

        return (
            <div>
                <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                <Segment textAlign='center'>
                    <Header as='h1'>{this.texts.header}</Header>
                </Segment>
                <Table sortable celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell sorted={column === 'id' && direction} onClick={this.handleSort('ico')}>Nabídka</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'name' && direction} onClick={this.handleSort('name')}>Název akce</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'customer' && direction} onClick={this.handleSort('customer')}>Investor</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'processdate' && direction} onClick={this.handleSort('processdate')}>Termín dokončení</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'errand' && direction} onClick={this.handleSort('errand')}>Pochůzka</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'price' && direction} onClick={this.handleSort('price')}>Cena</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='2' >
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem.bind(this)}>
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='5' style={{overflow: "visible"}}>
                                <Dropdown  placeholder='Záznamů/str' options={pageSize} selection value={this.state.rowsPerPage} onChange={this.handleChangeRowsPerPage}/>
                                <Pagination
                                    floated='right'
                                    activePage={this.state.activePage}
                                    onPageChange={this.handlePaginationChange}
                                    totalPages={this.state.totalPages} />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <OrdersDetail showData={this.state.showData}
                                showModal={this.state.showModal}
                                newItem={this.state.newItem}
                                onClose={this.closeEdit}
                                onSubmit={this.onSubmit}
                />
            </div>
        )
    }
}

export default Orders;

/*
                            <Table.HeaderCell sorted={column === 'deliverytype' && direction} onClick={this.handleSort('deliverytype')}>Způsob podání</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'winprice' && direction} onClick={this.handleSort('winprice')}>Vítězná cena</Table.HeaderCell>

*
* */
