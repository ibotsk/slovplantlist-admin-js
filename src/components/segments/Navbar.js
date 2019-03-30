import React from "react";
import { Nav, Navbar, NavItem, Glyphicon } from 'react-bootstrap';

const CNavbar = (props) => {

    return (
        <div id="navigation">
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        SlovPlantList Admin
                </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/checklist">
                            Checklist
                        </NavItem>
                        <NavItem eventKey={2} href="/genera">
                            Genera
                        </NavItem>
                        <NavItem eventKey={3} href="families-apg">
                            Families APG4
                        </NavItem>
                        <NavItem eventKey={4} href="/families">
                            Families
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            Users
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            <Glyphicon glyph="log-out" /> Logout
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );

}

export default CNavbar;