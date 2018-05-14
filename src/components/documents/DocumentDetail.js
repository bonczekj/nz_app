import React, {Component} from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import 'react-datepicker/dist/react-datepicker.css';
import {checkSalesRole} from "../validation";

class DocumentDetail extends Component {

    texts = {
        detail: 'Detail dokumentu',
    };

    constructor(props){
        super(props);
        this.state = {
            file: null,
            files: [],
            showData: {type: '', description: '', expiration: '', filename: '', files: []},
            expirationNumber: '',
            types: [],
            newItem: false,
            saved: false,
            shortVersion: false,
        }
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        //this.handleChangeDate = this.handleChangeDate.bind(this);
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/doctype', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
                return response.json();
        }).then(json => {
            this.setState({types : json});

            this.setState({types : this.state.types.map(function(item) {
                    return { key: item['type'], value: item['type'], text: item['description'] };
                })
            });

            this.setState({ isLoading: false });
        }).catch(error => {
            this.setState({ error, isLoading: false })
            console.log("fetch error")
        });
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
                shortVersion: nextProps.shortVersion,
                expirationNumber: 0,
            },
        );
        if (nextProps.showData.expiration !== null){
            this.setState({ expirationNumber: moment(nextProps.showData.expiration) });
        }
    }

    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    }

//    handleChangeDate(date) {
    handleChangeDate = (date) => {
        //const selDate = moment(date).toJSON();
        const selDate = moment(date).format('YYYY-MM-DD');
        const newState = {...this.state.showData, ['expiration']: selDate};
        this.setState({ showData: newState });
//        const newStateNumber = {...this.state.showData, ['expirationNumber']: date};
        this.setState({ expirationNumber: date });
    }

    handleChangeDD = (e, { name, value }) => {
        const newState = {...this.state.showData, [name]: value};
        this.setState({ showData: newState });
    }

    onFileChange(e) {
        let newState = {...this.state.showData, filename: e.target.value};
        this.setState({ showData: newState });


        let newStateFiles = {...this.state.showData, files: Array.from(e.target.files)};
        this.setState({ showData: newStateFiles });

        this.setState({ file: e.target.files[0]});
        this.setState({ files: Array.from(e.target.files)});
    }

    onSubmit = (e) => {

        if (!checkSalesRole()) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }

        this.props.onSubmit(e, this.state.showData);
        /*
        e.preventDefault(); // Stop form submit

        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = 'http://localhost/nz_rest_api_slim/documentcreate';
        }else{
            fetchUrl = 'http://localhost/nz_rest_api_slim/document';
        }

        fetch(fetchUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 0){
                //console.log(res.toString());
                this.setState({ saved: true });
                //let item = res.json();
                let body = res.json();
                return body;
                //this.closeEdit();
            }
        }).then(json => {
            console.log('then data' + json);
            //this.setState({tableData : json});
            //this.setState({ isLoading: false });
            //this.setState({ totalPages: Math.ceil(this.state.tableData.length / this.state.rowsPerPage) });
            this.closeEdit();
        }).catch(err => {
            console.log(err.toString());
            this.closeEdit();
        });
        */
        /*this.fileUpload(this.state.file).then((response)=>{
            console.log(response.data);
        })*/
    }

    /*fileUpload(file){
        const url = 'http://example.com/file-upload';
        const formData = new FormData();
        formData.append('file',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return post(url, formData,config)
    }*/

    closeEdit(){
        this.props.onClose(this.state.showData);
    }

    render() {
        //const { detailData, showModal } = this.state;
        //const { showData } = this.props;
        if (this.state.shortVersion === true){
            return (
                <div>
                    <Modal size={'small'}
                           open={this.props.showModal}
                           onClose={this.closeEdit.bind(this)}
                           closeOnEscape={true}
                           closeOnRootNodeClick={false}>
                        <Modal.Header>{this.texts.detail}</Modal.Header>
                        <Modal.Content>
                            <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                            <Form>
                                <Form.Field required>
                                    <label>Dokumenty</label>
                                    <input type={"file"} onChange={this.onFileChange} multiple={true}/>
                                </Form.Field>
                                <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                                <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Modal size={'small'}
                           open={this.props.showModal}
                           onClose={this.closeEdit.bind(this)}
                           closeOnEscape={true}
                           closeOnRootNodeClick={false}>
                        <Modal.Header>{this.texts.detail}</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field required>
                                    <label>Typ</label>
                                    <Dropdown selection placeholder='Typ' name='type' options={this.state.types} value={this.state.showData.type} onChange={this.handleChangeDD }/>
                                </Form.Field>
                                <Form.Field required>
                                    <label>Popis</label>
                                    <input placeholder='Popis' name='description' value={this.state.showData.description} onChange={ this.handleChange }/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Platnost</label>
                                    <DatePicker
                                        dateFormat="DD.MM.YYYY"
                                        selected={this.state.expirationNumber}
                                        onChange={this.handleChangeDate}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Dokument</label>
                                    <input type={"file"} onChange={this.onFileChange}/>
                                </Form.Field>
                                <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                                <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </div>
            )
        }
    }
}

/*
                             <input placeholder='Typ' name='type' value={this.state.showData.type} onChange={ this.handleChange }/>

* */
export default DocumentDetail;


