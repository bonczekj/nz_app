import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import UserDetail from './UserDetail';
import  MyMessage from '../MyMessage';
import {PHP_url, myFetchAuth} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {DelConfirm} from '../common/Confirmation';
import AuthService from "../AuthService";

class Users extends Component {

    texts = {
        newItem: 'Nový uživatel',
        header: 'Uživatelé'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {username: '', email: '', password: '', firstname: '', lastname: '', allowedIP: ''},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            errorText: '',
            item:[],
            counter: 0,
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
    }

    componentDidMount(){
        this.setState({
            isLoading: true,
            errorText: "",
            isLoading: true });
        myFetchAuth( 'GET', '/nz_rest_api_slim/users').then(
            result => this.fetchOK(result),
            error => this.fetchERR(error)
        )
    };

    fetchOK(result){
        this.setState({
            tableData : result,
            isLoading: false,
            errorText: '',
            totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage),
        });
    };
    fetchERR(error){
        this.setState({
            errorText: error.toString(),
            isLoading: false
        });
    }


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
                items = this.state.tableData[this.state.tableData.findIndex(el => el.email === item.email)] = item;
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
            counter: this.state.counter++,
        });
        console.log('Edit item '+ item.id + this.state.showModal+this.state.counter);
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: []}
            );
        console.log('New item '+ this.state.showModal);
    }


    deleteItemConf(item){
        this.setState({
            showConf: true,
            item: item
        });
    }

    deleteItem(){
        let item = this.state.item;
        this.setState({ showConf: false, errorText: "" });
        fetch(PHP_url+'/nz_rest_api_slim/users/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + AuthService.getToken()
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    tableData: _.reject(this.state.tableData, function(el) { return el.email === item.email; })}
                );
            }else {
                throw new Error(response.body);
            }
            console.log(response.toString());
        }).catch(err => {
            console.log(err.toString())
            this.setState({ errorText: err.toString() });
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

    items(item, i){
        return(
            <Table.Row key={item.email}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.username}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.firstname}</Table.Cell>
                <Table.Cell>{item.lastname}</Table.Cell>
                <Table.Cell>
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }

    render(){
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ];

        if (this.state.showModal){
            return (
                <UserDetail showData={this.state.showData} showModal={this.state.showModal} newItem={this.state.newItem} onClose={this.closeEdit} counter={this.state.counter}/>
            )
        }else {
            return (
                <div>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Segment textAlign='center'>
                        <Header as='h1'>{this.texts.header}</Header>
                    </Segment>
                    <Table sortable celled fixed={true} compact={true} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1}/>
                                <Table.HeaderCell sorted={column === 'username' && direction} onClick={this.handleSort('username')}>
                                    Zkratka</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'email' && direction} onClick={this.handleSort('email')}>
                                    E-mail</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'firstname' && direction} onClick={this.handleSort('firstname')}>
                                    Jméno</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'lastname' && direction} onClick={this.handleSort('lastname')}>
                                    Příjmení</Table.HeaderCell>
                                <Table.HeaderCell width={1}/>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell colSpan='2'>
                                    <Button icon labelPosition='left' positive size='small' onClick={this.newItem.bind(this)}>
                                        <Icon name='file' /> {this.texts.newItem}
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
                    <DelConfirm visible={this.state.showConf}
                                confText={'Chcete odstranit uživatele?'}
                                onYes={this.deleteItem}
                                onNo={() => {this.setState({showConf: false});}}
                                onClose={() => {this.setState({showConf: false});}}
                    />
                </div>
            )
        }
    }
}
//onNo={}
//()=> {this.setState({ showConf: false})}
export default Users;