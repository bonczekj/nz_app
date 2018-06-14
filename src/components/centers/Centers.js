import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import CenterDetail from './CenterDetail';
import  MyMessage from '../MyMessage';
import {PHP_url, myFetchAuth} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {DelConfirm} from '../common/Confirmation';

class Centers extends Component {

    texts = {
        newItem: 'Nové středisko',
        header: 'Střediska'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {idcenter: '', person: ''},
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
        myFetchAuth( 'GET', '/nz_rest_api_slim/centers').then(
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
                items = this.state.tableData[this.state.tableData.findIndex(el => el.idcenter === item.idcenter)] = item;
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
    }

    newItem(){
        this.setState({
            showModal: true,
            newItem: true,
            showData: []}
            );
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
        fetch(PHP_url+'/nz_rest_api_slim/centers/delete', {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    tableData: _.reject(this.state.tableData, function(el) { return el.idcenter === item.idcenter; })}
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
            <Table.Row key={item.idcenter}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.idcenter}</Table.Cell>
                <Table.Cell>{item.person}</Table.Cell>
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
                            <Table.HeaderCell width={2} sorted={column === 'idcenter' && direction} onClick={this.handleSort('idcenter')}>
                                Středisko</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'Person' && direction} onClick={this.handleSort('person')}>
                                Osoba</Table.HeaderCell>
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
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='2' style={{overflow: "visible"}}>
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
                <CenterDetail showData={this.state.showData}
                              showModal={this.state.showModal}
                              newItem={this.state.newItem}
                              onClose={this.closeEdit}
                              onSubmit={this.onSubmit}
                />
                <DelConfirm visible={this.state.showConf}
                            confText={'Chcete odstranit středisko?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConf: false});}}
                            onClose={() => {this.setState({showConf: false});}}
                />
            </div>
        )
    }
}
//onNo={}
//()=> {this.setState({ showConf: false})}
export default Centers;