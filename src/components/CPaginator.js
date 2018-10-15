import React, { Component } from 'react';
import { Pagination } from 'react-bootstrap';

class CPaginator extends Component {

    onHandleSelect = null;

    constructor(props) {
        super(props);
        this.onHandleSelect = props.onHandleSelect;
        this.state = {
            activePage: 1
        }
    }

    countNumOfPages = (total, recordsPerPage) => {
        const pages = total / recordsPerPage;
    }

    handleSelect(activePage) {
        // const newState = Object.assign({}, this.state, {
        //     activePage: eventKey
        // });

        // this.setState(newState);
        this.onHandleSelect(activePage);
    }

    render() {
        return (
            <div id='paginator' className='text-center'>
                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item onClick={() => this.handleSelect(1)}>{1}</Pagination.Item>
                    <Pagination.Item onClick={() => this.handleSelect(2)}>{2}</Pagination.Item>
                    {/* <Pagination.Ellipsis /> */}

                    {/* <Pagination.Item>{10}</Pagination.Item> */}
                    {/* <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis /> */}
                    {/* <Pagination.Item>{20}</Pagination.Item> */}
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>
        );
    }

}

export default CPaginator;