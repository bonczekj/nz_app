import React, {Component} from 'react';
import { Input, Form, Select } from 'semantic-ui-react'
import {optionYesNo, optionDeliveryType} from "../constants";
import DatePicker from 'react-datepicker';
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import moment from "moment/moment";

class OrdersDetailHeaderPrices extends Component {

    constructor(props){
        super(props);
        this.state = {processdateNumber: 0}
    };

    componentWillReceiveProps(nextProps){
        if (nextProps.showData.processdate !== null){
            this.setState({ processdateNumber: moment(nextProps.showData.processdate) });
        }
    }

    render() {
        return (
            <div style={{paddingTop:'1em'}}>
                <Form>
                    <Form.Field control={Input} label='Mzdy'   name='price_w' value={this.props.showData.price_w} width={4} onChange={this.props.handleChange}/>
                    <Form.Field control={Input} label='Dohody' name='price_d' value={this.props.showData.price_d} width={4} onChange={this.props.handleChange }/>
                    <Form.Field control={Input} label='Režie'  name='price_r' value={this.props.showData.price_r} width={4} onChange={this.props.handleChange}/>
                </Form>
            </div>
        )
    }
}

export default OrdersDetailHeaderPrices;

/*

                        <Form.Field control={Select} options={optionYesNo} label='Pochůzka' placeholder='Pochůzka' name='errand' value={this.props.showData.errand} onChange={this.props.handleChangeDD }/>
                    <Form.Group>
                        <Form.Field control={Input} label='Cena' placeholder='Cena' name='price' value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price)} onChange={this.props.handleChangeNum}/>
                    </Form.Group>



                        <Form.Field control={Input} label='Termín podání' placeholder='Termín podání' name='processdate' value={this.props.showData.processdate} onChange={this.props.handleChange}/>
                        <Form.Field control={Input} label='Hodina' placeholder='Hodina' name='processtime' value={this.props.showData.processtime} onChange={this.props.handleChange}/>
                        <Form.Field control={Select} options={optionDeliveryType} label='Způsob podání' placeholder='Způsob podání' name = 'deliverytype' value={this.props.showData.deliverytype} onChange={this.props.handleChangeDD}/>
                        <Form.Field control={Input} label='Výtězná cena' placeholder='Vítězní cena' name='winprice' value={this.props.showData.winprice} onChange={this.props.handleChange}/>


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

