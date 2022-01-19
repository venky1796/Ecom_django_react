import React from 'react'
import SearchBox from './SearchBox'
import { Navbar, Nav, Container, NavDropdown, Dropdown } from 'react-bootstrap'
import {LinkContainer } from 'react-router-bootstrap'
import {useDispatch , useSelector } from 'react-redux'
import { logout } from '../actions/userLoginActions'


function Header() {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo } = userLogin

  const logoutHandler =() => {
    dispatch(logout())
  }
    return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect >
        <Container>
          <LinkContainer to='/'>
  <Navbar.Brand>Ecart</Navbar.Brand>

  </LinkContainer>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
  <SearchBox />
  
    <Nav className="mr-auto">
      <LinkContainer to='/cart' >
      <Nav.Link> <i className="fas fa-shopping-cart" ></i> Cart</Nav.Link>
      </LinkContainer>

      { userInfo ? (
        <NavDropdown title={userInfo.name} id='username' >
          <LinkContainer to='/profile'>
           <Dropdown.Item> profile </Dropdown.Item>
          </LinkContainer>
          
           <Dropdown.Item onClick={logoutHandler} >  logout </Dropdown.Item>
         
        </NavDropdown>
      ) : (

      <LinkContainer to='/login' >
      <Nav.Link > <i className="fas fa-user" ></i> Login</Nav.Link>
      </LinkContainer>
      )}
      {userInfo && userInfo.isAdmin && (
        <NavDropdown title='Admin' >
          <LinkContainer to={`/admin/usersList`} >
          <NavDropdown.Item> Users </NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to={`/admin/productlist`} >
          <NavDropdown.Item> products </NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to={`/admin/orderlist`} >
          <NavDropdown.Item> Orders </NavDropdown.Item>
          </LinkContainer>


        </NavDropdown>
      )}

    </Nav>
     </Navbar.Collapse>
    </Container>
</Navbar>
    )
}

export default Header
