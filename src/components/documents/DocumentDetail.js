import React, {Component} from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import 'react-datepicker/dist/react-datepicker.css';
import {checkSalesRole, checkTechRole} from "../validation";
import {Select} from "semantic-ui-react";
import {getToken} from "../AuthService";

class DocumentDetail extends Component {

    texts = {
        detail: 'Detail dokumentu',
    };

    constructor(props){
        super(props);
        this.state = {
            file: null,
            files: [],
            showData: {type: '', description: '', expiration: '', filename: '', files: [], fullpath: [], ico: ''},
            expirationNumber: '',
            types: [],
            newItem: false,
            saved: false,
            shortVersion: false,
        }
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onDirChange = this.onDirChange.bind(this);
        //this.handleChangeDate = this.handleChangeDate.bind(this);
    };

    componentDidMount(){
        this.setState({ isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/doctype', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization' : 'Bearer ' + getToken()
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

    onDirChange(e) {
        let files = e.target.files;
        let file;
        for (var i = 0; i < files.length; i++) {
            file = files[i];
            console.log(file.webkitRelativePath + " " +file.name);
        }

        let newState = {...this.state.showData, filename: e.target.value};
        this.setState({ showData: newState });

        let newStateFiles = {...this.state.showData, files: Array.from(e.target.files)};
        this.setState({ showData: newStateFiles });

        this.setState({ file: e.target.files[0]});
        this.setState({ files: Array.from(e.target.files)});
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }
        this.props.onSubmit(e, this.state.showData);
    }



    closeEdit = (e) => {
        e.preventDefault();
        console.log("before closeEdit");
        this.props.onClose(this.state.showData);
        console.log("after closeEdit");
    }

    render() {
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
                                    <label>Výběr dokumentu</label>
                                    <input type="file" id="files" name="files[]" multiple onChange={this.onFileChange}/>
                                </Form.Field>
                                <Form.Field required>
                                    <label>Výběr adresáře</label>
                                    <input type="file" directory="" webkitdirectory="" onChange={this.onDirChange}/>
                                </Form.Field>
                                {this.props.typeRS ==='O' &&  <Form.Field control={Select} width={8} search options={this.props.subContractors} label='Subdodavatel' name='ico' value={this.state.showData.ico} onChange={this.handleChangeDD } />}
                                <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                                <Button type='cancel' onClick={this.closeEdit.bind(this)}>Zrušit</Button>
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

                                    <DatePicker
                                        dateFormat="DD.MM.YYYY"
                                        selected={this.state.expirationNumber}
                                        onChange={this.handleChangeDate}
                                    />

                             <input placeholder='Typ' name='type' value={this.state.showData.type} onChange={ this.handleChange }/>

* */
export default DocumentDetail;


