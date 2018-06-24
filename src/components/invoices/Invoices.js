import React, {Component} from 'react';
import { Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole, checkTechRole, decodeOptionValue, getFormatDate} from '../validation';
import {optionYesNo} from "../constants";
import {Redirect} from 'react-router-dom';

export default class Invoices extends Component {

    texts = {
        header: 'Přehled plánované fakturace'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            hasSalesRole: false,
        };
        this.items = this.items.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({logged: false})
        }
        let role = checkSalesRole() || checkTechRole();
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
                    let jsontasks = json;
                    let tasks = [];

                    let plan = [];
                    let price_t = 0;
                    let month = '';
                    let invdate = '';
                    for (let i = 0; i < jsontasks.length; i++) {
                        let task = jsontasks[i];

                        let pricej = task["price"] ? task["price"] : 0;
                        let price = "000000000" + pricej;
                        price = price.substr(price.length - 9);
                        task["price_s"] = price;

                        invdate = new Date(task.taskdate);
                        invdate = new Date(invdate.getFullYear(), invdate.getMonth(), 1);
                        let inv = {
                            month: invdate.getMonth()+"/"+invdate.getFullYear(),
                            date: invdate,
                            price_t: task["price"],
                            price_ts: task["price_s"],
                        };
                        let found = false;
                        for (let j in plan){
                            if (plan[j]['month'] === inv.month){
                                let sum = parseInt(plan[j]['price_t'] | 0) + parseInt(task["price"] | 0)
                                plan[j]['price_t'] = sum;

                                pricej = plan[j]['price_t'];
                                price = "000000000" + pricej;
                                price = price.substr(price.length - 9);
                                plan[j]['price_ts'] = price;
                                found = true;
                            }
                        }
                        if (found === false){
                            plan.push(inv);
                        }
                    }
                    this.setState({tableData : _.orderBy(plan, 'date')});
                    this.setState({ isLoading: false });
                    this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            }).catch(error => {
                this.setState({ error, isLoading: false });
                console.log("error")
            });

        fetch(PHP_url+'/nz_rest_api_slim/orderssubsdetailall', {
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
            let jsontasks = json;
            let tasks = [];

            let plan = this.state.tableData;
            let price_t = 0;
            let month = '';
            let invdate = '';
            for (let i = 0; i < jsontasks.length; i++) {
                let task = jsontasks[i];

                let pricej = task["price"] | 0;
                let price = "000000000" + pricej;
                price = price.substr(price.length - 9);
                task["price_s"] = price;

                invdate = new Date(task.taskdate);
                invdate = new Date(invdate.getFullYear(), invdate.getMonth(), 1);
                let inv = {
                    month: invdate.getMonth()+"/"+invdate.getFullYear(),
                    date: invdate,
                    price_s: task["price"],
                    price_ss: task["price_s"],
                };
                let found = false;
                for (let j in plan){
                    if (plan[j]['month'] === inv.month){
                        let sum = parseInt(plan[j]['price_s'] | 0) + parseInt(task["price"])
                        plan[j]['price_s'] = sum;

                        pricej = plan[j]['price_s'];
                        price = "000000000" + pricej;
                        price = price.substr(price.length - 9);
                        plan[j]['price_ss'] = price;
                        found = true;
                    }
                }
                if (found === false){
                    plan.push(inv);
                }
            }
            this.setState({tableData : _.orderBy(plan, 'date')});
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
        //if (item.status === 'Dokončená v projekci') {
        //    return null;
        //}
        let today = new Date();
        let todayW = new Date();
        todayW.setDate(todayW.getDate() + 7);
        let taskDate = new Date(item.taskdate);
        let flg_warning = false;
        let flg_negative = false;
        let rowStyle = '';
        return(
            <Table.Row key={item.month} >
                <Table.Cell>{item.month}</Table.Cell>
                <Table.Cell>{item.price_t > 0 ? new Intl.NumberFormat('cs-CS').format(item.price_t) : 0}</Table.Cell>
                <Table.Cell>{item.price_s > 0 ? new Intl.NumberFormat('cs-CS').format(item.price_s) : 0}</Table.Cell>
            </Table.Row>
        )
    }

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
                            <Table.HeaderCell sorted={column === 'month' && direction} onClick={this.handleSort('date')} width={2}>
                                Měsíc
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'price_t' && direction} onClick={this.handleSort('price_ts')}>
                                Plánovaná smluvní fakturace
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'price_s' && direction} onClick={this.handleSort('price_ss')}>
                                Plánovaná fakturace subdodávek
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='3' style={{overflow: "visible"}}>
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



