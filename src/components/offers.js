import React, {Component} from 'react';

class Offers extends Component {
    render() {
        return (
            <div className="container" >
                <p>Nabídky</p>
            </div>
        );
    }
}

export default Offers;

/*

import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

<BootstrapTable keyField='id' data={ products } columns={ columns } />

 */