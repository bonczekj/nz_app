import React, {Component} from 'react';
import { Button, Modal, Tab } from 'semantic-ui-react'
//import {optionYesNo, optionDeliveryType} from "../constants";
import _ from 'lodash';
import OffersDetailHeader from "./OffersDetailHeader";
import OffersDetailDocuments from "./OffersDetailDocuments";

class OffersDetail extends Component {

    texts = {
        detail: 'Detail nabídky',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: ''},
            newItem: false,
            saved: false,
            documents: [],
            documentsOffer: [],
        };
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
            },
        );
        if (nextProps.showData.id > 0){
            fetch('http://localhost/nz_rest_api_slim/offersdocuments', {
                //mode: 'no-cors',
                method: 'POST',
                body: JSON.stringify(nextProps.showData),
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then((response)  => {
                    return response.json();
                }).then(json => {
                    //this.setState({documents : json});
                const allDocuments = json;
                this.setState({
                    documents: _.reject(allDocuments, function(el) { return el.type === ''; })}
                );
                this.setState({
                    documentsOffer: _.reject(allDocuments, function(el) { return el.type != ''; })}
                );

            }).catch(error => {
            });
        }
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
        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = 'http://localhost/nz_rest_api_slim/offers/create';
        }else{
            fetchUrl = 'http://localhost/nz_rest_api_slim/offers';
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
            }
        }).catch(err => {
            console.log(err.toString())
        });
    };


    closeEdit(){
        this.props.onClose(this.state.showData, this.state.saved);
    }

    deleteDocument = (item) => {
//    deleteDocument(item){
        this.setState({
            documents: _.reject(this.state.documents, function(el) { return el.iddocument === item.iddocument; })}
        );
        /*fetch('http://localhost/nz_rest_api_slim/offers/delete', {
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
        });*/
    };

    addDocument = (documents) => {
        let items = [];
        let item = [];
        let file = '';

        items = this.state.documents;
        for (var i = 0; i < documents.files.length; i++) {
            file = documents.files[i];
            item.filename = file.name;
            items.push(item);
        }

        if (documents.hasOwnProperty("type")) {
            this.setState({
                documents: items
            });
        }else {
            this.setState({
                documentsOffer: items
            });

        }
    };

    onSubmitDocument = (e, item) => {
        //e.preventDefault(); // Stop form submit
        this.addDocument(item)

    };

    render() {
        const panes = [
            { menuItem: 'Parametry', render: () => <OffersDetailHeader showData={this.state.showData} handleChange={this.handleChange} handleChangeDD={this.handleChangeDD}/> },
            { menuItem: 'Podklady nabídky', render: () => <OffersDetailDocuments shortVersion={false} documents={this.state.documents} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
            { menuItem: 'Nabídkové dokumenty', render: () => <OffersDetailDocuments shortVersion={true} documents={this.state.documentsOffer} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
//            { menuItem: 'Nabídkové dokumenty', pane: 'Tab 3333 Content' },
            { menuItem: 'Termíny', pane: 'Tab 3333 Content' },
        ];

        return (
            <div>
            <Modal size={'large'}
                   open={this.props.showModal}
                   onClose={this.closeEdit.bind(this)}
                   closeOnEscape={true}
                   closeOnRootNodeClick={false}>
                <Modal.Header>{this.texts.detail}</Modal.Header>
                <Modal.Content>
                    <Tab menu={{ pointing: true }} panes={panes} renderActiveOnly={true} />
                </Modal.Content>
                <Modal.Actions>
                    <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                    <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                </Modal.Actions>
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

/*
                    <Form>
                        <Form.Group inline>
                            <Form.Field control={Input} label='Nabídka' placeholder='Nabídka' name='id' value={this.state.showData.id} width={3} onChange={this.handleChange} />
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
                    </Form>


 */


export default OffersDetail;


