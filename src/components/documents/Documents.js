import React, {Component} from 'react';
import { Button, Icon, Table, Pagination, Header, Segment, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';
import DocumentDetail from './DocumentDetail';
import moment from 'moment';
import MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import {getFormatDate} from '../validation';
import {Redirect} from 'react-router-dom';
import {DelConfirm} from '../common/Confirmation';
import {getToken} from "../AuthService";

class Documents extends Component {

    texts = {
        newItem: 'Nový dokument',
        header: 'Dokumenty'
    };

    constructor(){
        super();
        this.state = {
            logged: false,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {type: '', description: '', expiration: '', filename: ''},
            tableData: [],
            isLoading: false,
            error: null,
            activePage: 1,
            rowsPerPage: 10,
            totalPages: 10,
            column: '',
            direction: 'ascending',
            saved: false,
            item:[],
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
        //fetch(PHP_url+'/nz_rest_api_slim/documents', {
        fetch(PHP_url+'/nz_rest_api_slim/docs', {
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

    deleteItem = () => {
        let item = this.state.item;
        this.setState({ showConf: false, errorText: "" });
        fetch(PHP_url+'/nz_rest_api_slim/documents/delete', {
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
                    tableData: _.reject(this.state.tableData, function(el) { return el.id === item.id; })}
                );
            }
        }).catch(err => {
            console.log(err.toString())
        });
    }

    deleteItemConf = (item) => {
        this.setState({
            showConf: true,
            item: item
        });
    }

    onSubmitDocument = (e, item) => {
        e.preventDefault(); // Stop form submit

        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/documents/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/documents/update';
        }

        fetch(fetchUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + getToken()
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
        /*this.fileUpload(this.state.file).then((response)=>{
            console.log(response.data);
        })*/
    };

    /*getFormatDate = (date) => {
        return ((date == null) ? '' : moment(date).format('DD.MM.YYYY'));
    };*/

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
            <Table.Row key={item.id}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.filename}</Table.Cell>
                <Table.Cell>{getFormatDate(item.expiration)}</Table.Cell>
                <Table.Cell>
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
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
                            <Table.HeaderCell width={2} sorted={column === 'id' && direction} onClick={this.handleSort('id')}>
                                ID</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'type' && direction} onClick={this.handleSort('type')}>
                                Typ</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'description' && direction} onClick={this.handleSort('description')}>
                                Popis</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'filename' && direction} onClick={this.handleSort('filename')}>
                                Soubor</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'expiration' && direction} onClick={this.handleSort('expiration')}>
                                Platnost</Table.HeaderCell>
                            <Table.HeaderCell width={1}/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.tableData.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell  colSpan='2'>
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem.bind(this)}>
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
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
                <DocumentDetail
                    showData={this.state.showData}
                    showModal={this.state.showModal}
                    shortVersion={false}
                    newItem={this.state.newItem}
                    onClose={this.closeEdit}
                    onSubmit={this.onSubmitDocument}/>
                <DelConfirm visible={this.state.showConf}
                            confText={'Chcete odstranit dokument?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConf: false});}}
                            onClose={() => {this.setState({showConf: false});}}
                />
            </div>
        )
    }
}

export default Documents;


