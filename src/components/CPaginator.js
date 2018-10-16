import React, { Component } from 'react';
import { Pagination } from 'react-bootstrap';

class CPaginator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        }
    }

    countNumOfPages() {
        return Math.ceil(this.props.totalItems / this.props.recordsPerPage);
    }

    handleSelect(activePage) {
        this.setState({ activePage: activePage });
        this.props.onHandleSelect(activePage);
    }

    createItems(pages, active) {
        let items = [];
        for (let i = 1; i <= pages; i++) {
            items.push(
                <Pagination.Item key={i} active={i === active} onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>
            );
        }
        return items;
    }

    render() {
        const pages = this.countNumOfPages();
        return (
            <div id='paginator' className='text-center'>
                <Pagination>
                    <Pagination.First onClick={() => this.handleSelect(1)} />
                    <Pagination.Prev onClick={() => this.handleSelect(this.state.activePage - 1)} />
                    {this.createItems(pages, this.state.activePage)}
                    <Pagination.Next onClick={() => this.handleSelect(this.state.activePage + 1)} />
                    <Pagination.Last onClick={() => this.handleSelect(pages)} />
                </Pagination>
            </div>
        );
    }

}

export default CPaginator;