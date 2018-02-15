import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Modal, Header, Input, Form, Segment, Select, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import DocumentDetail from './DocumentDetail';

class Documents extends Component {

    texts = {
        newItem: 'Nový dokument',
        header: 'Dokumenty'
    };

    constructor(){
        super();
        this.state = {
            showModal: false,
            newItem: false,
            showData: {type: '', description: '', expiration: '', filename: ''},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending'
        }
        this.items = this.items.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        fetch('http://localhost/nz_rest_api_slim/documents', {
                //mode: 'no-cors',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
        })
            .then((response)  => {
                console.log('response');
                return response.json();
            }).then(json => {
                //console.log('then data' + json);
                this.setState({tableData : json});
                this.setState({ isLoading: false });
                this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            }).catch(error => {
                this.setState({ error, isLoading: false })
                console.log("error")
            });
    };

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    handleChangeRowsPerPage = (e, { value }) => {
        this.setState({ rowsPerPage: value })
    }

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
            showData: []
        });
        console.log('New item '+ this.state.showModal);
    }

    deleteItem(item){
        fetch('http://localhost/nz_rest_api_slim/documentdelete', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 0){
            };
            this.setState({
                tableData: _.reject(this.state.tableData, function(el) { return el.id == item.id; })}
            );
            console.log(res.toString());
        }).catch(err => {
            console.log(err.toString())
        });
    }

    handleSort = clickedColumn => () => {
        const { column, tableData, direction } = this.state;
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                //tableData: _.sortBy(tableData, clickedColumn),
                direction: 'ascending',
            })
            if ((typeof tableData[0][clickedColumn]) == 'string'){
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
    }

    items(item, i){
        return(
            <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.expiration}</Table.Cell>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                    {'   '}
                    <Icon link name='trash' onClick={this.deleteItem.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }
/*
                    <Button.Group>
                        <Button basic compact={true} icon={'edit'} size='mini' onClick={this.editItem.bind(this, item)}></Button>
                        <Button basic compact={true} icon={'trash'} size='mini' onClick={this.deleteItem.bind(this, item.id)}></Button>
                    </Button.Group>
 */
    render(){
        const { rowsPerPage, activePage, showModal, column, direction } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.tableData.length - activePage* rowsPerPage);
        const pageSize = [
            { key: 5, text: '5', value: 5 },
            { key: 10, text: '10', value: 10 },
            { key: 20, text: '20', value: 20 },
        ]

        return (
            <div>
                <Segment textAlign='center'>
                    <Header as='h1'>{this.texts.header}</Header>
                </Segment>
                <Table sortable celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell sorted={column === 'id' && direction} onClick={this.handleSort('id')}>
                                ID</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'type' && direction} onClick={this.handleSort('type')}>
                                Typ</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'description' && direction} onClick={this.handleSort('description')}>
                                Popis</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'expiration' && direction} onClick={this.handleSort('expiration')}>
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
                                <Button icon labelPosition='left' pozitive size='small' onClick={this.newItem.bind(this)}>
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
                <DocumentDetail showData={this.state.showData} showModal={this.state.showModal} newItem={this.state.newItem} onClose={this.closeEdit}/>
            </div>
        )
    }
}

export default Documents;


