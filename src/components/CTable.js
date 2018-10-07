import React from 'react';
import { Table } from 'react-bootstrap';

const TR = (props) => {
    return (
        <tr>
            {Object.keys(props.value).map(k => <td>{props.value[k]}</td>)}
        </tr>
    );
}

const CTable = (props) => {
    return (
        <Table striped bordered condensed>
            <tbody>
                {props.rows.map(r => <TR key={r.id} value={r} />)}
            </tbody>
        </Table>
    );
}

export default CTable;