import React, {Component} from 'react';
import { Message, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class MyMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.errText !== ""){
            return (
                <Message attached='header' negative hidden={this.props.errText === ""}>
                    <Icon name='warning circle' />
                    {this.props.errText}
                </Message>
            );
        }else if (this.props.infoText !== ""){
            return (
                <Message attached='header' positive>
                    <Icon name='info circle' />
                    {this.props.infoText}
                </Message>
            );
        }else if (this.props.isLoading === true){
            return (
                <Message icon>
                    <Icon name='spinner' loading />
                    <Message.Content>
                        <Message.Header>Načítání dat</Message.Header>
                    </Message.Content>
                </Message>
            );
        }else return null;
    }
}

MyMessage.propTypes = {
    errText:    PropTypes.string,
    infoText:   PropTypes.string,
    isLoading:  PropTypes.bool,
};
MyMessage.defaultProps = {
    errText:    '',
    infoText:   '',
    isLoading:  false,
};

export default MyMessage;

