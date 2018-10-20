import React, { Component } from 'react';


class LosDetail extends Component {

    render() {
        return(
            <div id='detail'>
                {this.props.match.params.id}
            </div>
        );
    }

}

export default LosDetail;