import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
//import DocumentDetail from './DocumentDetail';
import moment from 'moment';
import MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole, decodeOptionValue, getFormatDate} from '../validation';
import {optionYesNo} from "../constants";

class Tasks extends Component {

    texts = {
        newItem: 'Nový dokument',
        header: 'Termíny'
    };

    constructor(){
        super();
        this.state = {
            showModal: false,
            newItem: false,
            showData: {idorder: '', name: '', idtask: '', taskdate: '', taskdesc: '', finished: '', invoice: false},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            saved: false,
            hasSalesRole: false,
        };
        this.items = this.items.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    componentWillMount(){
        let role = checkSalesRole();
        this.setState({
            errorText: '',
            hasSalesRole: role,
        });
        if(role === false){
            this.setState({
                    errorText: 'Nemáte oprávnění k prohlížení',
            })
        }
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/tasks', {
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
            }).catch(error => {
                this.setState({ error, isLoading: false });
                console.log("error")
            });
    };

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

    handleChangeRowsPerPage = (e, { value }) => {
        this.setState({ rowsPerPage: value })
    };

    closeEdit(item){
        this.setState({showModal: false});
        if (this.state.saved === true){
            let items = [];
            if (this.state.newItem === true){
                items = this.state.tableData.push(item);
            }else{
                items = this.state.tableData;
                items = items[items.findIndex(el => el.id === item.id)] = item;
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
            showData: item,
            saved: false,
        });
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: [],
            saved: false,
        });
    }

    deleteItem(item){
        fetch(PHP_url+'/nz_rest_api_slim/tasks/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    tableData: _.reject(this.state.tableData, function(el) { return el.idtask === item.idtask; })}
                );
            }
        }).catch(error => {
            console.log(error.toString())
        });
    }

    /*onSubmitDocument = (e, item) => {
        e.preventDefault(); // Stop form submit

        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/documents/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/documents';
        }

        fetch(fetchUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status === 200){
                this.setState({ saved: true });
                let body = response.json();
                return body;
            }
        }).then(json => {
            console.log('then data' + json);
            //this.setState({tableData : json});
            //this.setState({ isLoading: false });
            //this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            this.closeEdit();
        }).catch(err => {
            console.log(err.toString());
            this.closeEdit(item);
        });
    };*/

    /*getFormatDate = (date) => {
        return ((date == null) ? '' : moment(date).format('DD.MM.YYYY'));
    };*/

    handleSort = clickedColumn => () => {
        const { column, tableData, direction } = this.state;
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
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

    items(item, i){
        let today = new Date();
        let todayW = new Date();
        todayW.setDate(todayW.getDate() + 7);
        let taskDate = new Date(item.taskdate);
        let flg_warning = false;
        let flg_negative = false;

        console.log(taskDate - today);
        if (taskDate  < today){
            flg_negative = true;
        }else if (taskDate < todayW){
            flg_warning = true;
        };
        return(
            <Table.Row key={item.idtask} negative={flg_negative} warning={flg_warning} >
                <Table.Cell>{item.idorder}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
                <Table.Cell>{item.taskdesc}</Table.Cell>
                <Table.Cell>{new Intl.NumberFormat('cs-CS').format(item.price)}</Table.Cell>
                <Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
                <Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>
            </Table.Row>
        )
    }
/*
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                    {'   '}
                    <Icon link name='trash' onClick={this.deleteItem.bind(this, item)}/>
                </Table.Cell>


                    <Button.Group>
                        <Button basic compact={true} icon={'edit'} size='mini' onClick={this.editItem.bind(this, item)}></Button>
                        <Button basic compact={true} icon={'trash'} size='mini' onClick={this.deleteItem.bind(this, item.id)}></Button>
                    </Button.Group>
 */
    render(){
        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ];

        if (this.state.hasSalesRole === false){
            return(
                <div>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                </div>
            )
        }

        return (
            <div>
                <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                <Segment textAlign='center'>
                    <Header as='h1'>{this.texts.header}</Header>
                </Segment>
                <Table sortable celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell sorted={column === 'idorder' && direction} onClick={this.handleSort('idorder')}>
                                Zakázka</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'orderdesc' && direction} onClick={this.handleSort('orderdesc')}>
                                Název</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'taskdate' && direction} onClick={this.handleSort('taskdate')}>
                                Termín</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'taskdescr' && direction} onClick={this.handleSort('taskdescr')}>
                                Popis</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'price' && direction} onClick={this.handleSort('price')}>
                                Cena</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'finished' && direction} onClick={this.handleSort('finished')}>
                                Dokončeno</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'invoice' && direction} onClick={this.handleSort('invoice')}>
                                Fakturace</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='6' style={{overflow: "visible"}}>
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
            </div>
        )
    }
}

export default Tasks;
/*
                <DocumentDetail
                    showData={this.state.showData}
                    showModal={this.state.showModal}
                    shortVersion={false}
                    newItem={this.state.newItem}
                    onClose={this.closeEdit}
                    onSubmit={this.onSubmitDocument}/>

* */

