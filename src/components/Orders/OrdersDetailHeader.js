import React, {Component} from 'react';
import { Input, Form, Select, Checkbox, Button } from 'semantic-ui-react'
import {optionOrdStatus} from "../constants";
import DatePicker from 'react-datepicker';
import  MyMessage from '../MyMessage';
import {PHP_url} from './../../PHP_Connector';
import moment from "moment/moment";

class OrdersDetailHeader extends Component {

    constructor(props){
        super(props);
        this.state = {processdateNumber: 0}
    };

    componentWillReceiveProps(nextProps){
        if (nextProps.showData.processdate !== null){
            this.setState({ processdateNumber: moment(nextProps.showData.processdate) });
        }
    }
// readOnly
    render() {
        return (
            <div style={{paddingTop:'1em'}}>
                <Form>
                    <Form.Group>
                        <Form.Field control={Input} label='Zakázka' placeholder='Zakázka' name='id' value={this.props.showData.id} width={3} onChange={this.props.handleChange}/>
                        <Form.Field control={Input} label='Název' placeholder='Název akce' name='name' value={this.props.showData.name} width={10} onChange={this.props.handleChange }/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Select} width={8} required search options={this.props.Customers} label='Investor' name='ico' value={this.props.showData.ico} onChange={this.props.handleChangeDD } />
                        <Form.Field control={Select} search options={this.props.Centers} label='Střediko' name='idcenter' value={this.props.showData.idcenter} onChange={this.props.handleChangeDD } />
                    </Form.Group>
                    <Form.Group>
                        <Form.Field>
                            <label>Termín dle SOD</label>
                            <DatePicker
                                dateFormat="DD.MM.YYYY"
                                selected={this.state.processdateNumber}
                                onChange={this.props.handleChangeDate}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field control={Input} readOnly label='Nabídka' name='idoffer' value={this.props.showData.idoffer} width={3}/>
                        <Form.Field control={Input} readOnly label='Název' name='idofferdesc' value={this.props.showData.idofferdesc} width={10}/>
                    </Form.Group>
                    <Form.Field width={4} control={Select} options={optionOrdStatus} label='Status' name='status' value={this.props.showData.status} onChange={this.props.handleChangeDD}/>
                    <Form.Field control={Input} label='Umístění' placeholder='Umístění v archívu' name='archiveloc' value={this.props.showData.archiveloc} onChange={this.props.handleChange}/>
                    <Button type='submit' onClick={this.props.onSubmit}>Uložit</Button>
                </Form>
            </div>
        )
    }
}

export default OrdersDetailHeader;

/*

                    <Form.Field>

                        <Checkbox label='Archív'
                                  name={'archive'}
                                  checked={this.props.showData.archive === '1' ? true : false}
                                  onChange={ this.props.handleChangeCheckbox }/>
                    </Form.Field>


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

