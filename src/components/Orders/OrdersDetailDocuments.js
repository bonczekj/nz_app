import React, {Component} from 'react';
import { Button,Icon, List, Table} from 'semantic-ui-react'
import DocumentDetail from '../documents/DocumentDetail';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import { saveAs } from 'file-saver'
import {DelConfirm} from '../common/Confirmation';
import {getToken} from "../AuthService";

class OrdersDetailDocuments extends Component {

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        this.state = {
            isLoading: false,
            error: null,
            showModalD: false,
            showConf: false,
            newItem: false,
            showData: {idoffer: '', iddocument: '', id: '', type: '', description: '', expiration: '', filename: '', typeRS: '', name: '', ico: '', path:''},
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
        this.setState({showModalD: false});
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
            showModalD: true,
            newItem: false,
            showData: item
        });
    }

    newItem = () => {
        this.setState({
            showModalD: true,
            newItem: true,
            showData: []
        });
    }

    onSubmitDocument = (e, item) => {
        //e.preventDefault(); // Stop form submit
        this.props.onSubmitDocument(e, item, this.state.typeRS);
        this.setState({showModalD: false});
    }

    downloadDocument = (item) => {
        this.setState({ errorText: '', isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/filedownload', {
            //mode: 'no-cors',
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Authorization' : 'Bearer ' + getToken()
            }
        }).then(response => {
            this.setState({isLoading: false});
            if (response.status === 200) {
                return response.blob()
            }else {
                throw new Error(response.body());
            }
        }).then(blob => {
            saveAs(blob, item['filename'])
        }).catch(error => {
            this.setState({ errorText: error.toString(),
                            isLoading: false});
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
        let attName = item.path;
        if (attName != null && attName.length > 0){
            attName = attName.replace(new RegExp("/", "g"), "\\");
        }else {
            attName = item.filename;
        }
        if (this.state.shortVersion === true) {
            return(
                <Table.Row key={item.iddocument}>
                    <Table.Cell>
                        <Icon link name='cloud download' onClick={this.downloadDocument.bind(this, item)}/>
                    </Table.Cell>
                    <Table.Cell>{attName}</Table.Cell>
                    {this.props.typeRS ==='O' &&  <Table.Cell>{item.name}</Table.Cell>}
                    <Table.Cell>
                        <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return(
                <Table.Row key={item.iddocument}>
                    <Table.Cell>
                        <Icon link name='cloud download' onClick={this.downloadDocument.bind(this, item)}/>
                    </Table.Cell>
                    <Table.Cell>{item.filename}</Table.Cell>
                    <Table.Cell>
                        <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                    </Table.Cell>
                </Table.Row>
            )
        }
    }

    renderList(documents){
        let i;
        let docfiles = [];
        for(i=0; i < documents.length; i++){
            if(documents[i].path !== '' ){
                console.log(documents[i].path.split("/").length);
                docfiles.push([documents[i].path.substr(0, documents[i].path.lastIndexOf("/")), documents[i].path.split("/").length-1]);
            }else{
                docfiles.push(["",0]);
            }
        }
        let dirs = [...new Set(docfiles)];
        console.log(docfiles);
        console.log(dirs);

        return(
            <List divided>
                {dirs.map(function (dir) {
                    return(
                        <List.Item>
                            <List.Icon name='folder' />
                            <List.Content>
                                <List.Header>{dir[0]}</List.Header>
                                <List.Description></List.Description>
                                {documents.map(function (document){
                                    if (document.path.substr(0, document.path.lastIndexOf("/")) === dir[0] ){
                                        return(
                                            <List.Description>
                                                {document.filename}
                                            </List.Description>
                                        )
                                    }
                                })}
                            </List.Content>
                        </List.Item>
                    )
                })}
            </List>
        );
    }

    render() {
        if (this.state.shortVersion === true) {
            return (
                <div style={{paddingTop:'1em'}}>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <List divided>
                        <List.Item >
                            <List.Icon name='folder'  />
                            <List.Content>
                                <List.Header>src</List.Header>
                                <List.Description>Source files for project</List.Description>
                                <List.List celled={true}>
                                    <List.Item>
                                        <List.Icon name='folder' />
                                        <List.Content>
                                            <List.Header>site</List.Header>
                                            <List.Description>Your site's theme</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='folder' verticalAlign='middle'/>
                                        <List.Content>
                                            <List.Header>themes</List.Header>
                                            <List.Description>Packaged theme files</List.Description>
                                            <List.List>
                                                <List.Item>
                                                    <List.Icon name='folder' />
                                                    <List.Content>
                                                        <List.Header>default</List.Header>
                                                        <List.Description>Default packaged theme</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <List.Icon name='folder' />
                                                    <List.Content>
                                                        <List.Header>my_theme</List.Header>
                                                        <List.Description>
                                                            Packaged themes are also available in this folder
                                                        </List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            </List.List>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='file' />
                                        <List.Content>
                                            <List.Header>theme.config</List.Header>
                                            <List.Description>
                                                Config file for setting packaged themes
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List.List>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='folder' />
                            <List.Content>
                                <List.Header>dist</List.Header>
                                <List.Description>Compiled CSS and JS files</List.Description>
                                <List.List>
                                    <List.Item>
                                        <List.Icon name='folder' />
                                        <List.Content>
                                            <List.Header>components</List.Header>
                                            <List.Description>
                                                Individual component CSS and JS
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List.List>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='file' />
                            <List.Content>
                                <List.Header>semantic.json</List.Header>
                                <List.Description>Contains build settings for gulp</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>

                    {this.renderList(this.props.documents)}

                    <Table celled fixed={true} compact={true} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1} />
                                <Table.HeaderCell>Dokument</Table.HeaderCell>
                                {this.props.typeRS ==='O' &&  <Table.HeaderCell>Subdodavatel</Table.HeaderCell>}
                                <Table.HeaderCell width={1} />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.documents.map(this.tabItems)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell colSpan='3' >
                                    <Button icon labelPosition='left' positive size='small' onClick={this.newItem} disabled={this.props.showData.id === undefined}>
                                        <Icon name='file' /> {this.texts.newItem}
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <DocumentDetail
                        showData={this.state.showData}
                        showModal={this.state.showModalD}
                        shortVersion={this.state.shortVersion}
                        subContractors={this.props.subContractors}
                        typeRS={this.props.typeRS}
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
                                <Table.HeaderCell width={1} />
                                <Table.HeaderCell>Typ</Table.HeaderCell>
                                <Table.HeaderCell>Popis</Table.HeaderCell>
                                <Table.HeaderCell>Dokument</Table.HeaderCell>
                                <Table.HeaderCell width={1} />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.documents.map(this.tabItems)}
                        </Table.Body>

                        <Table.Footer fullWidth >
                            <Table.Row >
                                <Table.HeaderCell colSpan='5' >
                                    <Button icon labelPosition='left' positive size='small' onClick={this.newItem} disabled={this.props.showData.id === undefined}>
                                        <Icon name='file' /> {this.texts.newItem}
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <DocumentDetail
                        showData={this.state.showData}
                        showModal={this.state.showModalD}
                        shortVersion={this.state.shortVersion}
                        typeRS={this.props.typeRS}
                        subContractors={this.props.subContractors}
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

