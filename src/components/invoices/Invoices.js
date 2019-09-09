import React, {Component} from 'react';
import { Select, Table, Pagination, Header, Segment, Dropdown, Form } from 'semantic-ui-react';
import _ from 'lodash';
import MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole, checkTechRole, decodeOptionValue, getFormatDate, getFormatDateMonth} from '../validation';
import {optionYesNo} from "../constants";
import {Redirect} from 'react-router-dom';

export default class Invoices extends Component {

    texts = {
        header: 'Přehled plánované fakturace'
    };

    constructor(props){
        super(props);
        let today = new Date();
        let actmonth = getFormatDateMonth(today);
        let months = [];
        let month = today.getMonth();
        let year = today.getFullYear();
        let kmonth = '';
            month--;
        if (month < 0) {
            month = 12;
            year--;
        }
        for(let i = 0; i <= 12; i++){
            month++;
            if (month > 12) {
                month = 1;
                year++;
            };
            kmonth = getFormatDateMonth(new Date(year, month, 1));
            months.push({ key: kmonth, text: kmonth, value: kmonth });
        };
        months.push({ key: 'Prázdné', text: 'Prázdné', value: '' });

        this.state = {
            logged: false,
            tableData: [],
            tableDataOrig: [],
            months: months,
            month: actmonth,
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
                    //let month = '';
                    //let invdate = '';
                    let counter = 0;
                    for (let i = 0; i < jsontasks.length; i++) {
                        let task = jsontasks[i];

                        //let invdate = new Date(task.planinvdate);
                        //let month = invdate.getMonth()+"/"+invdate.getFullYear();
                        let month = getFormatDateMonth(task.planinvdate);

                        counter++;
                        let inv = {
                            id: counter,
                            type: 'ST',
                            month: month,
                            date: task['planinvdate'],
                            idorder: task['idorder'],
                            desc: task['taskdesc'],
                            finished: task['invoice'],
                            price: task['price'],
                            name: task['name'],
                        };
                        plan.push(inv);

                        /*let pricej = task["price"] ? task["price"] : 0;
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
                        }*/
                    }
                    this.setState({tableData : _.orderBy(plan, 'date')});
                    this.setState({tableDataOrig : _.orderBy(plan, 'date')});
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
            let counter = 1000000;
            for (let i = 0; i < jsontasks.length; i++) {
                let task = jsontasks[i];

                //let invdate = new Date(task.planinvdate);
                //let month = invdate.getMonth()+"/"+invdate.getFullYear();
                let month = getFormatDateMonth(task.planinvdate);

                counter++;
                let inv = {
                    id: counter,
                    type: 'Su',
                    month: month,
                    idorder: task['idorder'],
                    date: task['planinvdate'],
                    desc: task['name'],
                    finished: task['invoice'],
                    center: task['idcenter'],
                    price: task['price'],
                    name: task['order_name'],
                };
                plan.push(inv);

                /*let pricej = task["price"] | 0;
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
                }*/
            }
            this.setState({tableData : _.orderBy(plan, 'date')});
            this.setState({tableDataOrig : _.orderBy(plan, 'date')});
            this.setState({ isLoading: false });
            this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            this.applyFilter(this.state.month);
        }).catch(error => {
            this.setState({ error, isLoading: false });
            console.log("error")
        });
    };

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

    handleChangeRowsPerPage = (e, { value }) => {
        this.setState({ rowsPerPage: value })
    };

    handleChangeDD = (e, { name, value }) => {
        this.setState({ [name]: value });
        this.applyFilter(value);
    }

    getSumPrice = () => {
        let sum = 0;
        for (let i in this.state.tableData){
            let item = this.state.tableData[i];
            if (item['type'] === 'Su'){
                sum = sum - parseInt(item['price']);
            }else {
                sum = sum + parseInt(item['price']);
            }
        }
        return sum;
    }

    applyFilter = (month) => {
        let td = this.state.tableDataOrig;
        let newTd = [];
        let i = 0;

        console.log(month);
        let filtTd = td.filter(c => c.month === month);

        this.setState({tableData: filtTd});
    }

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

        if (item.type === 'ST'){
            rowStyle = 'row_ST';
        }else if (item.type === 'Su'){
            rowStyle = 'row_Su';
        }else if (item.type === 'Uk'){
            rowStyle = 'row_Uk';
        };

        return(
            <Table.Row key={item.counter} className={rowStyle}>
                <Table.Cell>{getFormatDate(item.date)}</Table.Cell>
                <Table.Cell>{item.idorder}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.desc}</Table.Cell>
                <Table.Cell>{checkSalesRole() ? new Intl.NumberFormat('cs-CS').format(item.price) : 0}</Table.Cell>
                <Table.Cell>{item.center}</Table.Cell>
                <Table.Cell>{decodeOptionValue(item.finished, optionYesNo)}</Table.Cell>
            </Table.Row>
        )
    /*
            <Table.Row key={item.month} >
                <Table.Cell>{item.month}</Table.Cell>
                <Table.Cell>{item.price_t > 0 ? new Intl.NumberFormat('cs-CS').format(item.price_t) : 0}</Table.Cell>
                <Table.Cell>{item.price_s > 0 ? new Intl.NumberFormat('cs-CS').format(item.price_s) : 0}</Table.Cell>
            </Table.Row>

     */
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
                <Form>
                    <Form.Field width={2} control={Select} search options={this.state.months} label='Měsíc' name='month' value={this.state.month} onChange={this.handleChangeDD } />
                </Form>

                <Table sortable celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Datum</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Zakázka</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Typ</Table.HeaderCell>
                            <Table.HeaderCell>Název</Table.HeaderCell>
                            <Table.HeaderCell>Popis</Table.HeaderCell>
                            <Table.HeaderCell>Cena</Table.HeaderCell>
                            <Table.HeaderCell>Středisko</Table.HeaderCell>
                            <Table.HeaderCell>Dokončeno</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                        <Table.Row key={'XXXXXXXX'} >
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>Celkem</Table.Cell>
                            <Table.Cell>{checkSalesRole() ? new Intl.NumberFormat('cs-CS').format(this.getSumPrice()) : 0}</Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
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



