import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import UserDetail from './UserDetail';
import  MyMessage from '../MyMessage';
import {PHP_url, myFetchAuth} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';

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
            newItem: false,
            showData: {username: '', email: '', password: '', firstname: '', lastname: ''},
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

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({loggedf: false})
        }
    }

    componentDidMount(){
        this.setState({ isLoading: true });
        this.setState({ errorText: "" });
        /*fetch(PHP_url+'/nz_rest_api_slim/users', {
                //mode: 'no-cors',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
        })
            .then((response)  => {
                if (response.status === 200){
                    console.log('response');
                    return response.json();
                }else {
                    throw new Error(response.body);
                }
            }).then(json => {
                    this.setState({tableData : json});
                    this.setState({ isLoading: false });
                    this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            }).catch(error => {
                this.setState({ error, isLoading: false });
                this.setState({ errorText: error.toString() });
                console.log("error")
            });*/

        this.setState({ isLoading: true });
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
        console.log('FETCH response');
    };
    fetchERR(error){
        this.setState({
            errorText: error.toString(),
            isLoading: false
        });
        console.log("FETCH error")
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
        this.setState({ errorText: "" });
        fetch(PHP_url+'/nz_rest_api_slim/users/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
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
                <Table.Cell>{item.username}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.firstname}</Table.Cell>
                <Table.Cell>{item.lastname}</Table.Cell>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                    {'   '}
                    <Icon link name='trash' onClick={this.deleteItem.bind(this, item)}/>
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

        if (this.state.showModal === true){
            return (
                <UserDetail showData={this.state.showData} showModal={this.state.showModal} newItem={this.state.newItem} onClose={this.closeEdit}/>
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
                                <Table.HeaderCell sorted={column === 'username' && direction} onClick={this.handleSort('username')}>
                                    ID</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'email' && direction} onClick={this.handleSort('email')}>
                                    Typ</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'firstname' && direction} onClick={this.handleSort('firstname')}>
                                    Popis</Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'lastname' && direction} onClick={this.handleSort('lastname')}>
                                    Platnost</Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell >
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
                </div>
            )
        }
    }
}

export default Users;