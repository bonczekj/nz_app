import React, {Component} from 'react';
import { Input, Form, Select } from 'semantic-ui-react'
import {optionYesNo, optionDeliveryType} from "../constants";
import DatePicker from 'react-datepicker';
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import moment from "moment/moment";
import AuthService from "../AuthService";

export default class OrdersDetailHeaderPrices extends Component {

    constructor(props){
        super(props);
        this.state = {
            processdateNumber: 0,
            showData: {id: '', name: '', customer: '', processdate: '', processtime: '', deliverytype: '', errand: '', winprice: '', price: '',
                idoffer: '', idofferdesc: '', status: '',
                price_w: 0, price_d: 0, price_r: 0, price_s: 0, price_s_pl: 0, price_c: 0, price_c_pl: 0,
                archive: '', archiveloc: '', idcenter: ''},
        }

    };

    componentWillReceiveProps(nextProps){
        if (nextProps.showData.processdate !== null){
            this.setState({ processdateNumber: moment(nextProps.showData.processdate) });
        }

    }

    componentWillMount(){
        this.setState({ isLoading: true });
        var url = PHP_url+'/nz_rest_api_slim/orders/read/'+this.props.showData.id;
        fetch(url, {
            //mode: 'no-cors',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization' : 'Bearer ' + AuthService.getToken()
            }
        })
            .then((response)  => {
                if (response.status === 200){
                    return response.json();
                }
            }).then(json => {
            this.setState({ showData : json[0]});
            this.setState({ isLoading: false });
            this.setState({ errorText: '' });
        }).catch(error => {
            this.setState({ error, isLoading: false });
            this.setState({ errorText: error.toString() });
            console.log("error")
        });
    }


    render() {
        let cost_pl = 0;
        let cost = 0;
        let inv_pl = 0;
        let inv = 0;
        let hv_pl = 0;
        let hv = 0;
        cost_pl = this.state.showData.price_s_pl*1 + this.state.showData.price_w*1 + this.state.showData.price_r*1;
        cost = this.state.showData.price_s*1 + this.state.showData.price_w*1 + this.state.showData.price_r*1;
        inv_pl = this.state.showData.price_c_pl*1;
        inv = this.state.showData.price_c*1;
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
        return (
            <div style={{paddingTop:'1em'}}>
                <Form>
                    <Form.Field control={Input} label='Mzdy'   name='price_w' value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_w)} width={4} onChange={this.props.handleChangeNum}/>
                    <Form.Field control={Input} label='Režie'  name='price_r' value={new Intl.NumberFormat('cs-CS').format(this.props.showData.price_r)} width={4} onChange={this.props.handleChangeNum}/>
                    <Form.Group>
                        <Form.Field control={Input} label='Dohody - plán' name='price_s_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.state.showData.price_s_pl)}/>
                        <Form.Field control={Input} label='Dohody' name='price_s' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.state.showData.price_s)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Input} label='Fakturace - plán' name='price_c_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.state.showData.price_c_pl)}/>
                        <Form.Field control={Input} label='Fakturace' name='price_c' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(this.state.showData.price_c)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Input} label='HV - plán' name='hv_pl' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(hv_pl)}/>
                        <Form.Field control={Input} label='HV' name='hv' readOnly width={4} value={new Intl.NumberFormat('cs-CS').format(hv)}/>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

