import React, {Component} from 'react';
import { Button,Icon, Table} from 'semantic-ui-react'
import DocumentDetail from '../documents/DocumentDetail';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import { saveAs } from 'file-saver'
import {DelConfirm} from '../common/Confirmation';

class OrdersDetailDocuments extends Component {

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        this.state = {
            isLoading: false,
            error: null,
            showModal: false,
            showConf: false,
            newItem: false,
            showData: {idoffer: '', iddocument: '', id: '', type: '', description: '', expiration: '', filename: '', typeRS: ''},
            saved: false,
            shortVersion: true,
            typeRS: '',
            item:[],
        }
    };

    texts = {
        newItem: 'Nový dokument',
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                typeRS: nextProps.typeRS,
                shortVersion: nextProps.shortVersion,
            },
        );
    }

    componentWillMount(){
        this.setState({
                typeRS: this.props.typeRS,
                shortVersion: this.props.shortVersion,
            },
        );
    }


    /*deleteDocument = (item) => {
        this.props.deleteDocument(item)
    }*/

    closeEdit = (item, saved) => {
        this.setState({showModal: false});
        /*if (saved === true){
            let items = [];
            if (this.state.newItem === true){
                items = this.state.tableData.push(item);
            }else{
                items = this.state.tableData[this.state.tableData.findIndex(el => el.id === item.id)] = item;
            }
            this.setState({
                showData: items
            });
        }*/
    }

    editItem = (item) => {
        this.setState({
            showModal: true,
            newItem: false,
            showData: item
        });
    }

    newItem = () => {
        this.setState({
            showModal: true,
            newItem: true,
            showData: []
        });
    }

    onSubmitDocument = (e, item) => {
        //e.preventDefault(); // Stop form submit
        this.props.onSubmitDocument(e, item, this.state.typeRS);
        this.setState({showModal: false});
    }

    downloadDocument = (item) => {
        this.setState({ errorText: '' });
        fetch(PHP_url+'/nz_rest_api_slim/filedownload', {
            //mode: 'no-cors',
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                return response.blob()
            }else {
                throw new Error(response.body());
            }
        }).then(blob => {
            saveAs(blob, item['filename'])
        }).catch(error => {
            this.setState({ errorText: error.toString() });
        });

    }

    deleteItem = () => {
        let item = this.state.item;
        this.setState({ showConf: false, errorText: "" });
        this.props.deleteDocument(item);
    }

    deleteItemConf = (item) => {
        this.setState({
            showConf: true,
            item: item
        });
    }

    /*closeEditDocument(item){
        this.setState({showModal: false});
        if (this.state.saved === true){
            let items = [];
            if (this.state.newItem === true){
                this.props.addDocument(item);
            }else{
            }
            this.setState({
                showData: items
            });
        }
    }*/


    /*
    handleChange = (e) => {
        this.props.handleChange(e);
    };

    handleChangeDD = (e, { name, value }) => {
        this.props.handleChange(e, { name, value });
    }
    */
    tabItems(item, i){
        if (this.state.shortVersion === true) {
            return(
                <Table.Row key={item.iddocument}>
                    <Table.Cell>{item.filename}</Table.Cell>
                    <Table.Cell>
                        <Icon link name='cloud download' onClick={this.downloadDocument.bind(this, item)}/>
                        <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return(
                <Table.Row key={item.iddocument}>
                    <Table.Cell>{item.filename}</Table.Cell>
                    <Table.Cell>
                        <Icon link name='cloud download' onClick={this.downloadDocument.bind(this, item)}/>
                        <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                    </Table.Cell>
                </Table.Row>
            )
        }
    }

    render() {
        if (this.state.shortVersion === true) {
            return (
                <div style={{paddingTop:'1em'}}>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Table celled fixed={true} compact={true} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Dokument</Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.documents.map(this.tabItems)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell colSpan='2' >
                                    <Button icon labelPosition='left' positive size='small' onClick={this.newItem}>
                                        <Icon name='file' /> {this.texts.newItem}
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <DocumentDetail
                        showData={this.state.showData}
                        showModal={this.state.showModal}
                        shortVersion={this.state.shortVersion}
                        newItem={this.state.newItem}
                        onSubmit={this.onSubmitDocument}
                        onClose={this.closeEdit}/>
                    <DelConfirm visible={this.state.showConf}
                                confText={'Chcete odstranit dokument?'}
                                onYes={this.deleteItem}
                                onNo={() => {this.setState({showConf: false});}}
                                onClose={() => {this.setState({showConf: false});}}
                    />
                </div>
            )
        }else {
            return (
                <div style={{paddingTop:'1em'}}>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Table celled fixed={true} compact={true} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Typ</Table.HeaderCell>
                                <Table.HeaderCell>Popis</Table.HeaderCell>
                                <Table.HeaderCell>Dokument</Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.documents.map(this.tabItems)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell colSpan='4' >
                                    <Button icon labelPosition='left' positive size='small' onClick={this.newItem}>
                                        <Icon name='file' /> {this.texts.newItem}
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <DocumentDetail
                        showData={this.state.showData}
                        showModal={this.state.showModal}
                        shortVersion={this.state.shortVersion}
                        newItem={this.state.newItem}
                        onSubmit={this.onSubmitDocument}
                        onClose={this.closeEdit}/>
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
}

export default OrdersDetailDocuments;

/*
                        {this.state.documents.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}


                <Form.Group inline>
                    <Form.Field control={Input} label='Nabídka' placeholder='Nabídka' name='id' value={this.props.showData.id} width={3} onChange={this.props.handleChange} />
                    <Form.Field control={Input} label='Název' placeholder='Název akce' name='name' value={this.state.showData.name} width={10} onChange={this.handleChange }/>
                </Form.Group>
                <Form.Field control={Input} label='Investor' placeholder='Investor' name= 'customer' value={this.state.showData.customer} onChange={this.handleChange}/>
                <Form.Group inline >
                    <Form.Field control={Input} label='Termín podání' placeholder='Termín podání' name='processdate' value={this.state.showData.processdate} onChange={this.handleChange}/>
                    <Form.Field control={Input} label='Hodina' placeholder='Hodina' name='processtime' value={this.state.showData.processtime} onChange={this.handleChange}/>
                    <Form.Field control={Select} options={optionDeliveryType} label='Způsob podání' placeholder='Způsob podání' name = 'deliverytype' value={this.state.showData.deliverytype} onChange={this.handleChangeDD}/>
                    <Form.Field control={Select} options={optionYesNo} label='Pochůzka' placeholder='Pochůzka' name='errand' value={this.state.showData.errand} onChange={this.handleChangeDD }/>
                </Form.Group>
                <Form.Group inline >
                    <Form.Field control={Input} label='Cena' placeholder='Cena' name='price' value={this.state.showData.price} onChange={this.handleChange}/>
                    <Form.Field control={Input} label='Výtězná cena' placeholder='Vítězní cena' name='winprice' value={this.state.showData.winprice} onChange={this.handleChange}/>
                </Form.Group>



                <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>

 */

