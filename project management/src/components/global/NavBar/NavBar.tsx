import React from 'react';
import './NavBar.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Button } from '../../ui/button';

const NavBar: React.FC = () => {
  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container className="flex justify-between items-center px-16 nav-container ">
          <LinkContainer to="/">
            <Navbar.Brand className="text-lime-50">Project Man</Navbar.Brand>
          </LinkContainer>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Contact Us</NavigationMenuTrigger>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Nav>
          </Navbar.Collapse>
          <button className="shadow-[inset_0_0_0_2px_#616467] text-lime-50 px-6 py-3 rounded-full text-xs font-medium tracking-wider bg-transparent hover:bg-lime-200/90 hover:text-zinc-950 dark:text-neutral-200 transition duration-200">
            Get Started
          </button>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavBar;
