import React, {Component} from 'react';
import { Button,Icon, List, Table} from 'semantic-ui-react'
import DocumentDetail from '../documents/DocumentDetail';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import { saveAs } from 'file-saver'
import {DelConfirm} from '../common/Confirmation';
import {getToken} from "../AuthService";

export default class OrdersDetailDocuments extends Component {

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
            dirStruct: [],
            docfiles: [],
        }
    };

    texts = {
        newItem: 'Nový dokument',
    };

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps");

        this.setState({
                typeRS: nextProps.typeRS,
                shortVersion: nextProps.shortVersion,
            },
        );
        this.prepareStructure(nextProps.documents);
    }

    componentWillMount(){
        console.log("componentWillMount");

        this.setState({
                typeRS: this.props.typeRS,
                shortVersion: this.props.shortVersion,
            },
        );
        this.prepareStructure(this.props.documents);
    }

    prepareStructure = (documents) => {
        let dirStructTmp = [];
        let dirStructTmp1 = [];
        //let docfiles = [];
        for(let i=0; i < documents.length; i++){
            if(documents[i].path !== null ){
                let splitDirs = documents[i].folder.split("/");
                let prefix = "";
                let j;
                for(let j=0; j < splitDirs.length; j++){
                    let actDir = prefix+splitDirs[j];
                    if(dirStructTmp.indexOf(actDir) === -1  ){
                        dirStructTmp.push(actDir);
                    }else{
                    }
                    prefix = actDir+"/";
                }
                //docfiles.push([nextProps.documents[i].folder, nextProps.documents[i].level]);
            }else{
                //docfiles.push(["",0]);
            }
        }
        //let dirs = [...new Set(docfiles)];

        for(let i=0; i < dirStructTmp.length; i++){
            dirStructTmp1.push([dirStructTmp[i], dirStructTmp[i].split("/").length, true]);
        }
        console.log("dirstruct fill");
        this.setState({
                dirStruct: dirStructTmp1,
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

    toggleDir = (dir) => {
        let i;
        console.log("toggle "+dir);
        let dirStruct = this.state.dirStruct;
        for(i=0; i < dirStruct.length; i++){
            if(dirStruct[i][0] === dir[0] ){
                if (dirStruct[i][2] === true){
                    dirStruct[i][2] = false
                }else {dirStruct[i][2] = true}
            }
        }
        this.setState({ dirStruct: dirStruct });
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
        //return;
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

    tabItemsList(documents){
        return;
        let i;
        let docfiles = [];
        for(i=0; i < documents.length; i++){
            if(documents[i].path !== null ){
                docfiles.push([documents[i].path.substr(0, documents[i].path.lastIndexOf("/")), documents[i].path.split("/").length-1]);
            }else{
                docfiles.push(["",0]);
            }
        }
        let dirs = [...new Set(docfiles)];
        //console.log(docfiles);
        console.log(dirs);
        return(
            <a>
            {dirs.map(function (dir) {
                return(
                    <Table.Row key={dir[0]}>
                        <Table.Cell>
                            <Icon link name='folder' />
                        </Table.Cell>
                        <Table.Cell>{dir[0]}</Table.Cell>
                        <Table.Cell>
                        </Table.Cell>
                        <Table attached='bottom'>
                        {
                            documents.map(function (document){
                                if (document.path !== null){
                                    if (document.path.substr(0, document.path.lastIndexOf("/")) === dir[0] ){
                                        return(
                                            <Table.Row key={dir[0]}>
                                                <Table.Cell>
                                                    <Icon link name='file outline' />
                                                </Table.Cell>
                                                <Table.Cell>{document.filename}</Table.Cell>
                                                <Table.Cell>
                                                    <Icon link name='trash' />
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                }
                            })
                        }
                        </Table>
                    </Table.Row>
                )
            })}
            </a>
        );
    }

    renderList(documents, startLevel, startDirectory, locThis){
        console.log("------renderList startdir="+startDirectory+" startlevel="+startLevel);
        //console.log(documents);
        let i;
        /*let docfiles = [];
        let dirStruct = [];
        let dirStructTmp = [];
        for(i=0; i < documents.length; i++){
            if(documents[i].path !== null ){
                let splitDirs = documents[i].folder.split("/");
                let prefix = "";
                let j;
                for(j=0; j < splitDirs.length; j++){
                    let actDir = prefix+splitDirs[j];
                    if(dirStructTmp.indexOf(actDir) === -1  ){
                        dirStructTmp.push(actDir);
                    }else{
                    }
                    prefix = actDir+"/";
                }
                docfiles.push([documents[i].folder, documents[i].level]);
            }else{
                docfiles.push(["",0]);
            }
        }
        let dirs = [...new Set(docfiles)];

        for(i=0; i < dirStructTmp.length; i++){
            dirStruct.push([dirStructTmp[i], dirStructTmp[i].split("/").length]);
        }*/
        let dirStruct = this.state.dirStruct;

        if (startLevel === 0){
            console.log("dirStruct");
            console.log(dirStruct);
            console.log(documents);
            return(
                <List>
                    {documents.map(function (document){
                            if (document.level === 0){
                                console.log("show: fn:"+document.filename);
                                return(
                                    <List.Item onClick={locThis.downloadDocument.bind(locThis, document)}>
                                        <List.Icon name='file outline'/>
                                        {document.filename}
                                    </List.Item>
                                )
                            }
                        })
                    }
                    {dirStruct.map(function (dir) {
                        if (dir[1] === startLevel+1){
                            return(
                                <List.Item>
                                    <List.Icon name='folder' />
                                    <List.Content>
                                        <List.Item onClick={locThis.toggleDir.bind(locThis, dir)}>
                                            <b>{dir[0]}</b>
                                        </List.Item>
                                        {locThis.renderList(documents, startLevel+1, dir[0], locThis)}
                                    </List.Content>
                                </List.Item>
                            )
                        }
                    })}
                </List>
            );
        }else {
            return(
                <List.List>
                    {dirStruct.map(function (dir) {
                        if (dir[1] === startLevel){
                            return(
                                <List.Item>
                                    {
                                        documents.map(function (document){
                                            if (document.path !== null){
                                                if (document.path.substr(0, document.path.lastIndexOf("/")) === dir[0] ){
                                                    console.log("show:"+dir[0]+" path:"+document.path+" fn:"+document.filename);
                                                    return(
                                                        <List.Item onClick={locThis.downloadDocument.bind(locThis, document)}>
                                                            <List.Icon name='file outline'/>
                                                            {document.filename}
                                                            <Icon link name='trash' />
                                                        </List.Item>
                                                    )
                                                }else {/*console.log("skip:"+dir[0]+" path:"+document.path);*/}
                                            }
                                        })
                                    }
                                </List.Item>
                            )
                        }
                        if (dir[1] === startLevel+1){
                            if (dir[0].substr(0, dir[0].lastIndexOf("/")) === startDirectory){
                                return(
                                    <List.Item>
                                        <List.Icon name='folder' />
                                        <List.Content>
                                            <List.Item onClick={locThis.toggleDir.bind(locThis, dir)}>
                                                <b>{dir[0]}</b>
                                            </List.Item>
                                            {dir[2] === true && locThis.renderList(documents, startLevel+1, dir[0], locThis)}
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        }
                    })}
                </List.List>
            );
        }
    }

    render() {
        if (this.state.shortVersion === true) {
            return (
                <div style={{paddingTop:'1em'}}>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>

                    {this.renderList(this.props.documents, 0, '', this)}

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



/*


        /*if (this.state.shortVersion === true) {
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
        }*/


/*

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

*/

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

