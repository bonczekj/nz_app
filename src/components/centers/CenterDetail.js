import React, {Component} from 'react';
import { Button, Modal, Form, Select} from 'semantic-ui-react';
import MyMessage from "../MyMessage";
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole} from "../validation";
import {optionDealType} from "../constants";

export default class CenterDetail extends Component {

    texts = {
        detail: 'Detail střediska',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {idcenter: '', person: ''},
            newItem: false,
            saved: false,
            errorText: ''
        };
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };

    componentWillReceiveProps(nextProps){
        console.log(nextProps.showData);
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
            },
        );
    }

    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    handleChangeDD = (e, { name, value }) => {
        const newState = {...this.state.showData, [name]: value};
        this.setState({ showData: newState });
    };

    onSubmit = (e) => {
        e.preventDefault(); // Stop form submit

        if (!checkSalesRole()) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }

        let fetchUrl = '';

        //Označení subdodávky
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/centers/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/centers/update';
        }

        fetch(fetchUrl, {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }else {
                throw new Error(response.body);
            }
        }).catch(err => {
            this.setState({ errorText: err.toString() });
            console.log(err.toString())
        });
    };


    closeEdit(){
        this.props.onClose(this.state.showData, this.state.saved);
    }

    render() {
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
                            <label>Středisko</label>
                            <input name='idcenter' value={this.state.showData.idcenter} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Osoba</label>
                            <input name='person' value={this.state.showData.person} onChange={ this.handleChange }/>
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



