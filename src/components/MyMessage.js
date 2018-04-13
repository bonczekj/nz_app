import React, {Component} from 'react';
import { Message, Icon} from 'semantic-ui-react';


class MyMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Message attached='header' negative hidden={this.props.msgText === ""}>
                <Icon name='warning circle' />
                {this.props.msgText}
            </Message>
        );
    }
}

export default MyMessage;

//  <p>{this.props.msgText}</p>
/*



 */