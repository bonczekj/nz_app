import React, {Component} from 'react';
import { Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
//import DocumentDetail from './DocumentDetail';
import MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole, checkTechRole, decodeOptionValue, getFormatDate, getFormatDate2} from '../validation';
import {optionYesNo} from "../constants";
import {Redirect} from 'react-router-dom';
import {getToken} from "../AuthService";

export default class Tasks extends Component {

    texts = {
        newItem: 'Nový termín',
        header: 'Termíny'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
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
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({loggedf: false})
        }
        let role = checkSalesRole() || checkTechRole();
        this.setState({
            errorText: '',
            hasSalesRole: role,
        });
        /*if(role === false){
            this.setState({
                    errorText: 'Nemáte oprávnění k prohlížení',
            })
        }*/
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/tasks', {
                //mode: 'no-cors',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization' : 'Bearer ' + getToken()
                }
        })
            .then((response)  => {
                if (response.status === 200){
                    return response.json();
                }
            }).then(json => {
                    let jsontasks = json;
                    let tasks = [];
                    for (let i = 0; i < jsontasks.length; i++) {
                        let task = jsontasks[i];
                        let pricej = task["price"] ? task["price"] : 0;
                        let price = "000000000" + pricej;
                        price = price.substr(price.length - 9);
                        task["price_s"] = price;
                        tasks.push(task);
                    }
                    //this.setState({tableData : json});
                    this.setState({tableData : tasks});
                    console.log("tasks: " +tasks);
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
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + getToken()
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
            this.setState({tableData: _.orderBy(tableData, clickedColumn)})
            /*if ((typeof tableData[0][clickedColumn]) === 'string'){
                this.setState({tableData: _.orderBy(tableData, [row => row[clickedColumn].toLowerCase()])})
            }
            else {
                this.setState({tableData: _.orderBy(tableData, clickedColumn)})
            }*/
        return
        }
        this.setState({
            tableData: tableData.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    items(item, i){
        if (item.status === 'Dokončená v projekci') {
            return null;
        }
        let today = new Date();
        let todayW = new Date();
        todayW.setDate(todayW.getDate() + 7);
        let taskDate = new Date(item.taskdate);
        let flg_warning = false;
        let flg_negative = false;
        let rowStyle = '';

        if (item.invoice !== 'true') {
            if (taskDate  < today){
                flg_negative = true;
                rowStyle = 'bg-danger text-white';
            }else if (taskDate < todayW){
                flg_warning = true;
                rowStyle = 'bg-warning';
            };
        }
        if (checkSalesRole()){
            return(
                <Table.Row key={item.idtask} className={rowStyle}>
                    <Table.Cell>{item.idorder}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
                    <Table.Cell>{item.taskdesc}</Table.Cell>
                    <Table.Cell>{new Intl.NumberFormat('cs-CS').format(item.price)}</Table.Cell>
                    <Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
                    <Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>
                </Table.Row>
            )
        }else {//if (checkTechRole()){
            return(
                <Table.Row key={item.idtask} className={rowStyle}>
                    <Table.Cell>{item.idorder}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
                    <Table.Cell>{item.taskdesc}</Table.Cell>
                    <Table.Cell/>
                    <Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
                    <Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>
                </Table.Row>
            )
        }
    }
/*
            <Table.Row key={item.idtask} negative={flg_negative} warning={flg_warning} inverted={true} className="bg-danger">
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
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ];

        if (this.state.hasSalesRole === false){
            /*return(
                <div>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                </div>
            )*/
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
                                Zakázka
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'name' && direction} onClick={this.handleSort('name')}>
                                Název
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'taskdate' && direction} onClick={this.handleSort('taskdate')}>
                                Termín
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'taskdesc' && direction} onClick={this.handleSort('taskdesc')}>
                                Popis
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'price_s' && direction} onClick={this.handleSort('price_s')}>
                                Cena
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'finished' && direction} onClick={this.handleSort('finished')}>
                                Dokončeno
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'invoice' && direction} onClick={this.handleSort('invoice')}>
                                Fakturace
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='7' style={{overflow: "visible"}}>
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


