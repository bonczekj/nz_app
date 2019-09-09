import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown} from 'semantic-ui-react'
import _ from 'lodash';
import CustomerDetail from './CustomerDetail';
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {DelConfirm} from '../common/Confirmation';
import {checkSalesRole} from "../validation";
import {getToken} from "../AuthService";

class Customers extends Component {

    texts = {
        newItem: 'Nový zákazník',
        header: 'Zákazníci',
        newItemSub: 'Nový subdodavatel',
        headerSub: 'Subdodavatelé',
    };

    constructor(props){
        super(props);
        this.state = {
            logged: false,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {ico: '', name: '', profession: '', address: '', sub: '', dealtype: '', mobil: '', email: ''},
            tableData: new Array(),
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            errorText: '',
            is_sub: false,
            item:[],
        };
        this.items = this.items.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    };

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({loggedf: false})
        }
        let is_sub = (this.props.match.path === "/subcontractors") ? true : false;
        this.setState({
            is_sub: is_sub,
        });
    }


    componentDidMount(){
        this.setState({
            isLoading: true,
        });
        let urlSuffix = (this.state.is_sub === false) ? 'customers' : 'subcontractors';
        fetch(PHP_url+'/nz_rest_api_slim/'+urlSuffix, {
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


    handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

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
                //items = this.state.tableData[this.state.tableData.findIndex(el => el.ico === item.ico)] = item;
                items = this.state.tableData[this.state.tableData.findIndex(el => el.ico === item.ico)];
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
        console.log('Edit item '+ item.ico + this.state.showModal);
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: []}
            );
        console.log('New item '+ this.state.showModal);
    }

    deleteItem(){
        let item = this.state.item;
        this.setState({ showConf: false, errorText: "" });
        fetch(PHP_url+'/nz_rest_api_slim/customers/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Authorization' : 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    tableData: _.reject(this.state.tableData, function(el) { return el.ico === item.ico; })}
                );
                this.setState({ errorText: '' });
            }
        }).catch(err => {
            console.log(err.toString())
            this.setState({ errorText: err.toString() });
        });
    }

    deleteItemConf(item){
        this.setState({
            showConf: true,
            item: item
        });
    }

    handleSort = clickedColumn => (e) => {
        e.preventDefault();

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

    items(item, i){
        return(
            <Table.Row key={item.ico}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.ico}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.profession}</Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }

    // Capturing redux form values from redux form store (pay attention to the name we defined in the previous component)
    onSubmit = values => {(
            values.ico
    )};

    render(){
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        const { rowsPerPage, activePage, column, direction } = this.state;
        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ];

        console.log(this.state.tableData);
        return (

            <div>
                <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                <Segment textAlign='center'>
                    <Header as='h1'>{(this.state.is_sub === false) ? this.texts.header : this.texts.headerSub}</Header>
                </Segment>
                <Table sortable celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}/>
                            <Table.HeaderCell width={2} sorted={column === 'ico' && direction} onClick={this.handleSort('ico')}>
                                IČO</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'name' && direction} onClick={this.handleSort('name')}>
                                Název</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'profession' && direction} onClick={this.handleSort('profession')}>
                                Profese</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'address' && direction} onClick={this.handleSort('address')}>
                                Adresa</Table.HeaderCell>
                            <Table.HeaderCell width={1}/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='2' >
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem.bind(this)}>
                                    <Icon name='file' /> {(this.state.is_sub === false) ? this.texts.newItem : this.texts.newItemSub}
                                </Button>
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='4' style={{overflow: "visible"}}>
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
                <CustomerDetail showData={this.state.showData}
                                showModal={this.state.showModal}
                                is_sub={this.state.is_sub}
                                newItem={this.state.newItem}
                                onClose={this.closeEdit}
                                onSubmit={this.onSubmit}
                />
                <DelConfirm visible={this.state.showConf}
                            confText={'Chcete odstranit subjekt?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConf: false});}}
                            onClose={() => {this.setState({showConf: false});}}
                />
            </div>
        )
    }
}

export default Customers;


