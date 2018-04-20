import React, {Component} from 'react';
import { Button, Modal, Tab } from 'semantic-ui-react'
//import {optionYesNo, optionDeliveryType} from "../constants";
import  MyMessage from '../MyMessage';
import _ from 'lodash';
import OrdersDetailHeader from "./OrdersDetailHeader";
import OrdersDetailDocuments from "./OrdersDetailDocuments";
import OrdersDetailTasks from "./OrdersDetailTasks";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';

class OrdersDetail extends Component {

    texts = {
        detail: 'Detail zakázky',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: ''},
            processdateNumber: 0,
            newItem: false,
            saved: false,
            documentsR: [],
            documentsS: [],
            tasks: [],
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

            fetch(PHP_url+'/nz_rest_api_slim/ordersdocuments', {
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

            fetch(PHP_url+'/nz_rest_api_slim/orderstasks', {
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
                this.setState({tasks: json});
                this.setState({ errorText: '' });
            }).catch(error => {
                this.setState({ errorText: error.toString() });
            });

        }
    }


    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
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
        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/orders/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/orders';
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
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });

        fetch(PHP_url+'/nz_rest_api_slim/ordersdocuments/create', {
            method: 'POST',
            body: JSON.stringify(this.state.documentsR),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });

        fetch(PHP_url+'/nz_rest_api_slim/ordersdocuments/create', {
            method: 'POST',
            body: JSON.stringify(this.state.documentsS),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });

        fetch(PHP_url+'/nz_rest_api_slim/orderstasks/create', {
            method: 'POST',
            body: JSON.stringify(this.state.tasks),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({ errorText: ''});
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }
        }).catch(error => {
            console.log(error.toString())
            this.setState({ errorText: error.toString() });
        });
    };


    closeEdit(){
        this.props.onClose(this.state.showData, this.state.saved);
    }

    deleteDocument = (item) => {
        this.setState({
            documents: _.reject(this.state.documents, function(el) { return el.iddocument === item.iddocument; })}
        );
    };

    deleteTask = (item) => {
        this.setState({
            tasks: _.reject(this.state.tasks, function(el) { return el.idtask === item.idtask; })}
        );
    };

    addDocument = (documents, typeRS) => {
        const items = (typeRS === "R") ? this.state.documentsR : this.state.documentsS;
        for (var i = 0; i < documents.files.length; i++) {
            const file = documents.files[i];
            let item = [];
            item.filename = file.name;
            items.push(item);
        }

        if (typeRS === "R") {
            this.setState({
                documentsR: items
            });
        }else {
            this.setState({
                documentsS: items
            });

        }
    };

    addTask = (task) => {
        const items = this.state.tasks;
        items.push(task);
        this.setState({
            tasks: items
        });
    };


    onSubmitDocument = (e, item, typeRS) => {
        //e.preventDefault(); // Stop form submit
        this.addDocument(item, typeRS)
    };

    onSubmitTask = (e, item) => {
        //e.preventDefault(); // Stop form submit
        this.addTask(item)
    };

    render() {
        const panes = [
            { menuItem: 'Parametry', render: () => <OrdersDetailHeader showData={this.state.showData} handleChange={this.handleChange} handleChangeDD={this.handleChangeDD} handleChangeDate={this.handleChangeDate}/> },
            { menuItem: 'Zakázkové dokumenty', render: () => <OrdersDetailDocuments shortVersion={true} documents={this.state.documentsR} typeRS={'R'} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
            { menuItem: 'Podklady zakázky', render: () => <OrdersDetailDocuments shortVersion={true} documents={this.state.documentsS} typeRS={'S'} deleteDocument={this.deleteDocument} addDocument={this.addDocument} onSubmitDocument={this.onSubmitDocument} /> },
            { menuItem: 'Termíny', render: () => <OrdersDetailTasks tasks={this.state.tasks} deleteTasks={this.deleteTask} addTask={this.addTask} onSubmitTask={this.onSubmitTask} /> },
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
                    <Button type='createOrder' onClick={this.createOrder}>Vytvořit zakázku</Button>
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


export default OrdersDetail;


