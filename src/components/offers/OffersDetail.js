import React, {Component} from 'react';
import { Button, Modal, Tab } from 'semantic-ui-react'
//import {optionYesNo, optionDeliveryType} from "../constants";
import  MyMessage from '../MyMessage';
import _ from 'lodash';
import OffersDetailHeader from "./OffersDetailHeader";
import OffersDetailDocuments from "./OffersDetailDocuments";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import {arrToObject} from './../validation';
import {checkSalesRole, checkTechRole} from "../validation";

class OffersDetail extends Component {

    texts = {
        detail: 'Detail nabídky',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: '', idorder: '', nameorder: '', delivered: ''},
            processdateNumber: 0,
            newItem: false,
            saved: false,
            documentsR: [],
            documentsS: [],
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
            if (nextProps.showData.processdate !== null){
                //const newState = {...this.state.showData, ['processdateNumber']: moment(nextProps.showData.processdate)};
                //this.setState({ showData: newState });

                this.setState({ processdateNumber: moment(nextProps.showData.processdate) });
            };

            fetch(PHP_url+'/nz_rest_api_slim/offersdocuments', {
                //mode: 'no-cors',
                method: 'POST',
                body: JSON.stringify(nextProps.showData),
                headers: {
                    'Accept': 'application/json',
                }
            }).then((response)  => {
                    return response.json();
                }).then(json => {
                    this.setState({ errorText: '' });
                    const allDocuments = json;
                    this.setState({
                        documentsR: _.reject(allDocuments, function(el) { return el.typeRS !== 'R'; })}
                    );
                    this.setState({
                        documentsS: _.reject(allDocuments, function(el) { return el.typeRS !== 'S'; })}
                    );
            }).catch(error => {
                this.setState({ errorText: error.toString() });
            });
        }
    }


    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    handleChangeNum = (e) => {
        let value = e.target.value.replace(/\s+/g, '');
        const newState = {...this.state.showData, [e.target.name]: value};
        this.setState({ showData: newState });
    };

    handleChangeDate = (date) => {
        const selDate = moment(date).format('YYYY-MM-DD');
        const newState = {...this.state.showData, ['processdate']: selDate};
        this.setState({ showData: newState });
        this.setState({ processdateNumber: date });
        //const newStateNum = {...this.state.showData, ['processdateNumber']: date};
        //this.setState({ showData: newStateNum });
    }

    handleChangeDD = (e, { name, value }) => {
        const newState = {...this.state.showData, [name]: value};
        this.setState({ showData: newState });
    };

    onSubmit = (e) => {
        e.preventDefault(); // Stop form submit
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }
        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/offers/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/offers/update';
        }

        fetch(fetchUrl, {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }else {
                throw new Error(response.body);
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });

    };


    closeEdit(){
        this.props.onClose(this.state.showData, this.state.saved);
    }

    createOrder = () => {
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }
        if (this.state.showData.idorder) {
            this.setState({ errorText: 'Zakázka již existuje' });
            return;
        }
        if (this.state.showData.id === undefined) {
            this.setState({ errorText: 'Nabídku musíte nejdříve uložit' });
            return;
        }
        fetch(PHP_url+'/nz_rest_api_slim/offers/createorder', {
            method: 'POST',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                return response.json();
            }else {
                throw new Error(response.body);
            }
        }).then(json => {
            this.setState({ errorText: '' });
            let newState = {...this.state.showData, ['idorder']: json['id']};
            newState = {...newState, ['nameorder']: json['name']};
            this.setState({ showData: newState });
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });
    };

    deleteDocument = (item) => {
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }
        let fileDel = new Object( {idoffer: this.state.showData.id, iddocument: item["iddocument"]} );

        fetch(PHP_url+'/nz_rest_api_slim/offersdocuments/delete', {
            method: 'POST',
            body: JSON.stringify(fileDel),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                if (item["typeRS"] === "R"){
                    this.setState({documentsR: _.reject(this.state.documentsR, function(el) { return el.iddocument === item.iddocument; })});
                }
                if (item["typeRS"] === "S"){
                    this.setState({documentsS: _.reject(this.state.documentsS, function(el) { return el.iddocument === item.iddocument; })});
                }
            }else {
                throw new Error(response.body);
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });
    };

    addDocument = (documents, typeRS) => {
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }

        const items = (typeRS === "R") ? this.state.documentsR : this.state.documentsS;
        let fileList = new Array();
        let offerId = this.state.showData.id;
        for (var i = 0; i < documents.files.length; i++) {
            const file = documents.files[i];
            let item = [];

            const formData = new FormData();
            formData.append('document', file);

            fetch(PHP_url+'/nz_rest_api_slim/fileupload', {
                method: 'POST',
                body: formData,
                /*headers: {
                    'Content-Type': 'multipart/form-data'
                }*/
            }).then(response => {
                this.setState({ errorText: ''});
                if (response.status === 200){
                    return response.json();
                }else {
                    throw new Error(response.body);
                }
            }).then(json => {
                let docObj = {
                    idoffer: offerId,
                    documentId: json.docID,
                    typeRS: typeRS,
                };
                fetch(PHP_url+'/nz_rest_api_slim/offersdocuments/create', {
                    method: 'POST',
                    body: JSON.stringify(docObj),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    this.setState({ errorText: ''});
                    if (response.status === 200){
                        this.setState({ saved: true });
                        item.filename = file.name;
                        items.push(item);
                        if (typeRS === "R") {
                            this.setState({
                                documentsR: items
                            });
                        }else {
                            this.setState({
                                documentsS: items
                            });
                        }
                    }else {
                        throw new Error(response.body);
                    }
                }).catch(error => {
                    console.log(error.toString())
                    this.setState({ errorText: error.toString() });
                });

            }).catch(error => {
                console.log(error.toString())
                this.setState({ errorText: error.toString() });
            });

        }

    };

    onSubmitDocument = (e, item, typeRS) => {
        //e.preventDefault(); // Stop form submit
        if (!(checkSalesRole() || checkTechRole())) {
            this.setState({ errorText: 'Nemáte právo na změnu dat' });
            return;
        }
        this.addDocument(item, typeRS)

    };

    render() {
        const panes = [
            { menuItem: 'Parametry', render: () => <OffersDetailHeader
                            showData={this.state.showData}
                            Customers={this.props.Customers}
                            handleChange={this.handleChange}
                            handleChangeNum={this.handleChangeNum}
                            handleChangeDD={this.handleChangeDD}
                            handleChangeDate={this.handleChangeDate}
                            onSubmit={this.onSubmit}
                            createOrder={this.createOrder} /> },
            { menuItem: 'Nabídkové dokumenty', render: () => <OffersDetailDocuments showData={this.state.showData} shortVersion={true} documents={this.state.documentsR} typeRS={'R'} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
            { menuItem: 'Podklady nabídky', render: () => <OffersDetailDocuments showData={this.state.showData} shortVersion={true} documents={this.state.documentsS} typeRS={'S'} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
        ];

        return (
            <div>
            <Modal className="scrolling" size={'large'}
                   open={this.props.showModal}
                   onClose={this.closeEdit.bind(this)}
                   closeOnEscape={true}
                   closeOnRootNodeClick={false}>
                <Modal.Header>{this.texts.detail}</Modal.Header>
                <Modal.Content>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Tab menu={{ pointing: true }} panes={panes} renderActiveOnly={true} />
                </Modal.Content>
                <Modal.Actions>
                    <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                    <Button type='cancel' onClick={this.closeEdit}>Zavřít</Button>
                </Modal.Actions>
            </Modal>
            </div>
        )
    }
}

//                    <Button type='createOrder' onClick={this.createOrder} active={this.state.showData.idorder === 0}>Vytvořit zakázku</Button>
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


