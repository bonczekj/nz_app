import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown, Input, Form, Accordion } from 'semantic-ui-react'
import _ from 'lodash';
import OrdersDetail from './OrdersDetail';
import {optionYesNo, optionDeliveryType, optionOrdStatus} from "../constants";
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import moment from "moment/moment";
import {getFormatDate, decodeOptionValue, checkSalesRole} from '../validation';
import  SearchBox from '../common/SearchBox';
import OrdersExcel from "./OrdersExcel";
import {Redirect} from 'react-router-dom';
import {DelConfirm} from '../common/Confirmation';

export default class Orders extends Component {

    texts = {
        newItem: 'Nová zakázka',
        header: 'Zakázky',
        headerArch: 'Archív zakázek'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: '', archive: '', idcenter: '', status: ''},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            errorText: '',
            hasSalesRole: false,
            search: '',
            subContractors: [],
            Customers: [],
            Centers: [],
            Orders: [],
            item:[],
            showFilter: false,
        };
        this.items = this.items.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({loggedf: false})
        }
        let hasSalesRole = checkSalesRole();
        let is_archive = (this.props.match.path === "/ordersarchive") ? true : false;
        this.setState({
            hasSalesRole: hasSalesRole,
            is_archive: is_archive,
        });
    }

    componentDidMount(){
        this.readCustomers()
        this.readData();
    };

    readCustomers() {
        let CustOptions = [];
        let CentOptions = [];
        let SubContOptions = [];
        fetch(PHP_url+'/nz_rest_api_slim/subcontractors', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
            if (response.status === 200){
                return response.json();
            }
        }).then(json => {
            let index;
            for (index = 0; index < json.length; ++index) {
                let SubContOption = {
                    key: json[index].ico,
                    text: json[index].name,
                    value: json[index].ico,
                };
                SubContOptions.push(SubContOption);
            }
            this.setState({
                subContractors: SubContOptions
            })
        }).catch(error => {
        });

        fetch(PHP_url+'/nz_rest_api_slim/customers', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
            if (response.status === 200){
                return response.json();
            }
        }).then(json => {
            let index;
            for (index = 0; index < json.length; ++index) {
                let CustOption = {
                    key: json[index].ico,
                    text: json[index].name,
                    value: json[index].ico,
                };
                CustOptions.push(CustOption);
            }
            //console.log(CustOptions);
            this.setState({
                Customers: CustOptions
            })
        }).catch(error => {
        });

        fetch(PHP_url+'/nz_rest_api_slim/centers', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
            if (response.status === 200){
                return response.json();
            }
        }).then(json => {
            let index;
            for (index = 0; index < json.length; ++index) {
                let CentOption = {
                    key: json[index].idcenter,
                    text: json[index].idcenter + " - " + json[index].person,
                    value: json[index].idcenter,
                };
                CentOptions.push(CentOption);
            }
            //console.log(CentOptions);
            this.setState({
                Centers: CentOptions
            })
        }).catch(error => {
        });
    };

    readData(){

        this.setState({ isLoading: true });
        //console.log(PHP_url);
        //let url = this.state.is_archive ? '/nz_rest_api_slim/ordersarchive' : '/nz_rest_api_slim/orders';
        let urlSuffix = (this.state.is_archive) ? 'ordersarchive' : 'orders';

        //fetch(PHP_url+/nz_rest_api_slim/+urlSuffix, {

        /*var url = new URL(PHP_url+'/nz_rest_api_slim/'+urlSuffix)
        var params = {search: this.state.search} // or:
        //var params = [['lat', '35.696233'], ['long', '139.570431']]
        url.search = new URLSearchParams(params)
        */

        var url = PHP_url+'/nz_rest_api_slim/'+urlSuffix;
        if (this.state.search){
            //let params = {search: this.state.search};
            //let urlParams = new URLSearchParams(Object.entries(params));
            //url = url+'?'+urlParams;
            url = url+'?search='+this.state.search;
        }


        fetch(url, {
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
            this.setState({Orders : json});
            this.setState({ isLoading: false });
            this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            this.setState({ errorText: '' });
        }).catch(error => {
            this.setState({ error, isLoading: false });
            this.setState({ errorText: error.toString() });
            console.log("error")
        });
    }

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    handleChangeRowsPerPage = (e, { value }) => {
        this.setState({ rowsPerPage: value })
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    closeEdit(item, saved){
        this.setState({showModal: false});
        if (saved === true){
            let items = [];

            let myCusts = this.state.Customers;
            let myCust = myCusts.filter(c => c.key == item["ico"]);
            let myCust0 = myCust[0];
            if (myCust0){
                item.customer = myCust0["text"];

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
    }

    //editItem(item){
    editItem = (item) => {
        this.setState({
            showModal: true,
            newItem: false,
            showData: item
        });
        //console.log('Edit item '+ item.id + this.state.showModal);
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: []}
            );
        //console.log('New item '+ this.state.showModal);
    }

    deleteItem = () => {
        let item = this.state.item;
        this.setState({ showConf: false, errorText: "" });
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
            //console.log(error.toString())
        });
    }

    deleteItemConf = (item) => {
        this.setState({
            showConf: true,
            item: item
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
        return(
            <Table.Row key={item.id}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{item.idcenter}</Table.Cell>
                <Table.Cell>{getFormatDate(item.processdate)}</Table.Cell>
                <Table.Cell>
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }


/*
                <Table.Cell>{decodeOptionValue(item.errand, optionYesNo)}</Table.Cell>
                <Table.Cell>{new Intl.NumberFormat('cs-CS').format(item.price)}</Table.Cell>

 */
    // Capturing redux form values from redux form store (pay attention to the name we defined in the previous component)
    // <Table.Cell>{item.processtime}</Table.Cell>
    /*onSubmit = values => {(
            values.id
    )};

                <Table.Cell>{this.decodeOptionValue(item.deliverytype, optionDeliveryType)}</Table.Cell>
                <Table.Cell>{item.winprice}</Table.Cell>

    */

    handleSearch = () => {
        this.readData();
    };

    handleFilter = () => {
        this.setState({showFilter: this.state.showFilter === true ? false : true})
    };

    applyFilter = (items) => {
      let orders = this.state.Orders;
      if (items === undefined){
          this.setState({tableData: orders});
          return;
      }
      let newOrders = [];
      let i = 0;
        for (i in items){
            if (items[i].filter){
                let filtOrders = orders.filter(c => c.status == items[i]["value"]);
                if (filtOrders.length > 0){
                    let j = 0;
                    for (j in filtOrders){
                        newOrders.push(filtOrders[j]);
                    }
                }

            }
        }
      this.setState({tableData: newOrders});
      //  this.setState({showFilter: this.state.showFilter === true ? false : true})
    };

    render(){
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        if (this.state.tableData != undefined){
            const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        }
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
                    <Header as='h1'>{this.state.is_archive ? this.texts.headerArch : this.texts.header}</Header>
                </Segment>
                <Form>
                    <Form.Group>
                        <SearchBox search={this.state.search} handleChange={this.handleChange} handleSearch={this.handleSearch}/>
                        &nbsp;&nbsp;&nbsp;
                        <Button icon={'filter'} size='mini' onClick={this.handleFilter}>
                        </Button>
                    </Form.Group>
                </Form>
                <Filter showFilter={this.state.showFilter} applyFilter={this.applyFilter}/>
                <Table sortable padded celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}/>
                            <Table.HeaderCell width={2} sorted={column === 'id' && direction} onClick={this.handleSort('id')}>Zakázka</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'status' && direction} onClick={this.handleSort('status')}>Status</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'name' && direction} onClick={this.handleSort('name')}>Název akce</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'customer' && direction} onClick={this.handleSort('customer')}>Investor</Table.HeaderCell>
                            <Table.HeaderCell width={1} sorted={column === 'idcenter' && direction} onClick={this.handleSort('idcenter')}>Středisko</Table.HeaderCell>
                            <Table.HeaderCell width={2}sorted={column === 'processdate' && direction} onClick={this.handleSort('processdate')}>Termín dokončení</Table.HeaderCell>
                            <Table.HeaderCell width={1}/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.state.tableData != undefined && this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='3' >
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem.bind(this)}>
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
                                <OrdersExcel tableData={this.state.tableData} />
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
                              hasSalesRole={this.state.hasSalesRole}
                              newItem={this.state.newItem}
                              Customers={this.state.Customers}
                              Centers={this.state.Centers}
                              subContractors={this.state.subContractors}
                              onClose={this.closeEdit}
                              onSubmit={this.onSubmit}
                />
                <DelConfirm visible={this.state.showConf}
                            confText={'Chcete odstranit zakázku?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConf: false});}}
                            onClose={() => {this.setState({showConf: false});}}
                />
            </div>
        )
    }
}


class Filter extends Component {
    constructor(props){
        super(props);
        this.status = this.status.bind(this);
        this.addStatus = this.addStatus.bind(this);
        this.state = {
            statuses: []
        }
        optionOrdStatus.map(this.addStatus);
    };

    addStatus(item, i){
        let statuses = this.state.statuses;
        statuses.push({ id: i, key: item.key, value: item.value, filter: true});
        this.setState({statuses : statuses});
    };

    statusClick = (item, i) => {
        let statuses = this.state.statuses;
        statuses[i]['filter'] = !statuses[i]['filter'];
        this.setState({statuses: statuses});
    };

    status(item, i){
        return(
            <Form.Checkbox label={item.text} name={item.key} value='red' checked={this.state.statuses[i]['filter']} onChange={this.statusClick.bind(this, item, i)}/>
        )
    };


    applyFilter = () => {
        this.props.applyFilter(this.state.statuses);
    };

    clearFilter = () => {
        this.props.applyFilter();
    };
    //optionOrdStatus
    render(){
        if (this.props.showFilter === true){
            return(
                <Form>
                    <Form.Group>
                        { optionOrdStatus != undefined && optionOrdStatus.map(this.status)}
                    </Form.Group>
                    <Button onClick={this.applyFilter.bind(this)}>Filtrovat</Button>

                    <Button onClick={this.clearFilter.bind(this)}>Zrušit filtrN</Button>
                </Form>
            )
        }else {
            return null
        }
    }
}


