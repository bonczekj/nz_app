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
        let cost_pl = 0;
        let cost = 0;
        let inv_pl = 0;
        let inv = 0;
        let hv_pl = 0;
        let hv = 0;
        cost_pl = this.props.showData.price_s_pl*1 + this.props.showData.price_w*1 + this.props.showData.price_r*1;
        cost = this.props.showData.price_s*1 + this.props.showData.price_w*1 + this.props.showData.price_r*1;
        inv_pl = this.props.showData.price_c_pl*1;
        inv = this.props.showData.price_c*1;
        if (cost_pl === null){
            cost_pl = 0;
        }
        if (cost === null){
            cost = 0;
        }
        if (inv_pl === null){
            inv_pl = 0;
        }
        if (inv === null){
            inv = 0;
        }
        hv_pl = inv_pl*1 - cost_pl*1;
        hv = inv*1 - cost*1;
        console.log("CPL:"+cost_pl + " C:"+cost + " IPL:"+inv_pl + " I:"+inv + " HVPL:"+hv_pl + " HV:"+hv);
        return (
            <div style={{paddingTop:'1em'}}>
                <Form>
                    <Form.Field control={Input} label='Mzdy'   name='price_w' value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_w)} width={4} onChange={this.props.handleChangeNum}/>
                    <Form.Field control={Input} label='Režie'  name='price_r' value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_r)} width={4} onChange={this.props.handleChangeNum}/>
                    <Form.Group>
                        <Form.Field control={Input} label='Dohody - pl.' name='price_s_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_s_pl)}/>
                        <Form.Field control={Input} label='Dohody - sk.' name='price_s' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_s)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Input} label='Fakturace - pl.' name='price_c_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_c_pl)}/>
                        <Form.Field control={Input} label='Fakturace - sk.' name='price_c' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_c)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Input} label='HV - pl.' name='hv_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(hv_pl)}/>
                        <Form.Field control={Input} label='HV - sk.' name='hv' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(hv)}/>
                    </Form.Group>
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

