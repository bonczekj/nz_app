import React, {Component} from 'react';
import { Button, Modal, Form, Select} from 'semantic-ui-react';
import MyMessage from "../MyMessage";
import {PHP_url} from './../../PHP_Connector';
import {checkSalesRole} from "../validation";
import {optionDealType} from "../constants";

class CustomerDetail extends Component {
//class CustomerDetail extends MyComponent {

    texts = {
        detail: 'Detail zákazníka',
        detailSub: 'Detail subdodavatele',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {ico: '', name: '', profession: '', address: '', sub: '', dealtype: ''},
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
            if (this.props.is_sub === true){
                this.state.showData.sub = 1;
            }
            fetchUrl = PHP_url+'/nz_rest_api_slim/customers/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/customers/update';
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

    readAres = () => {
        this.setState({ isLoading: true });
        fetch(PHP_url+'/nz_rest_api_slim/customers/ares', {
            method: 'POST',
            body: JSON.stringify({ico: this.state.showData.ico}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(response => {
            this.setState({ isLoading: false });
            if (response.status === 200){
                return response.json();
            }else {
                //throw new Error(response.statusText);
                return response.text().then(text => {
                    if (text === ""){
                        throw new Error(response.statusText);
                    }else {
                        throw new Error(text);
                    }
                })
            }
        }).then(json => {
            this.setState({ errorText: '' });
            const newState1 = {...this.state.showData, name: json.name};
            this.setState({ showData: newState1 });
            const newState2 = {...this.state.showData, address: json.address};
            this.setState({ showData: newState2 });
        }).catch(err => {
            this.setState({ isLoading: false });
            this.setState({ errorText: err.toString() });
            console.log(err.toString());
        });
    };

    render() {
        return (
            <div>
            <Modal size={'small'}
                   open={this.props.showModal}
                   onClose={this.closeEdit.bind(this)}
                   closeOnEscape={true}
                   closeOnRootNodeClick={false}>
                <Modal.Header>{(this.props.is_sub === false) ? this.texts.detail : this.texts.detailSub}</Modal.Header>
                <Modal.Content>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Form>
                        <Form.Field required>
                            <label>IČO</label>
                            <input placeholder='IČO' name='ico' value={this.state.showData.ico} onChange={ this.handleChange }/>
                            <Button onClick={this.readAres.bind(this)}>ARES</Button>

                        </Form.Field>
                        <Form.Field required>
                            <label>Název</label>
                            <input placeholder='Název' name='name' value={this.state.showData.name} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Adresa</label>
                            <input placeholder='Adresa' name='address' value={this.state.showData.address} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field>
                            <label>Profese</label>
                            <input placeholder='Profese' name = 'profession' value={this.state.showData.profession} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field control={Select} options={optionDealType} label='Typ dohody' placeholder='Typ dohody' name = 'dealtype' value={this.state.showData.deliverytype} onChange={this.handleChangeDD}/>
                        <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                        <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                    </Form>

                </Modal.Content>
            </Modal>
            </div>
        )
    }
}

//                        <Field name="ico" component={semanticFormField} as={Form.Input} type="text" label="IČO" placeholder="IČO" validate={required} />

/*
CustomerDetail.propTypes = {
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool
};

export default compose(
    reduxForm({
        form: 'CustomerDetail',
        enableReinitialize: true
    })
)(CustomerDetail);
*/

export default CustomerDetail;


