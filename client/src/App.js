import React from 'react';
import 'react-bootstrap';
import { Container, Accordion, Card, Navbar, Button, Form, Col, Row } from 'react-bootstrap';

import getWeb3 from './getWeb3';
import SupplyChainContract from './contracts/SupplyChainContract.json';



class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      price: 0,
      status: 0,
      trackingId: 0,
      address: "",
      web3: null,
      account: null,
      contract: null,
      data: null
    }
  }

  componentDidMount = async () => {

    try {
      // Get web3 instance
      const web3 = await getWeb3();

      // Using web3 to get user's account
      const accounts = await web3.eth.getAccounts();

      // Using web3 to get contract instnce
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SupplyChainContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        web3: web3,
        accounts: accounts,
        contract: instance
      });
    }
    catch (error) {
      alert("Unable to load web3");
      console.log(error);
    }
  }

  handleChange = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  handleAddItem = async (event) => {

    try {
      const contract = this.state.contract;
      const accounts = this.state.accounts;

      const result = await contract.methods.addItem(this.state.name, this.state.price).send({ from: accounts[0] });

      if (result) {
        alert("Item Added");
      }
    }
    catch (error) {
      console.log(error);
      alert("Transaction Failed")
    }

    this.setState({
      name: "",
      price: 0,
      status: 0,
      trackingId: 0,
      address: ""
    });
  }

  handleTransferOwnership = async (event) => {

    try {

      const contract = this.state.contract;
      const accounts = this.state.accounts;
      console.log(accounts[0]);
      const result = await contract.methods.transferOwnership(this.state.address, this.state.trackingId, this.state.status).send({
        from: accounts[0]
      });

      if (result) {
        alert("Transfer Done");
      }
    }
    catch (error) {
      console.log(error.message);
    }

    this.setState({
      name: "",
      price: 0,
      status: 0,
      trackingId: 0,
      address: ""
    });
  }

  handlePriceChange = async (event) => {

    try {

      const contract = this.state.contract;
      const accounts = this.state.accounts;
      console.log(accounts[0]);
      const result = await contract.methods.editPrice(this.state.trackingId, this.state.price).send({ from: accounts[0] });

      if (result) {
        alert("Price Changed");
      }

    }
    catch (error) {
      console.log(error.message);
    }

    this.setState({
      name: "",
      price: 0,
      status: 0,
      trackingId: 0,
      address: ""
    });
  }

  loadItem = async () => {

    const contract = this.state.contract;
    const counter = await contract.methods.itemCounter().call();
    const items = [];

    for (let i = 0; i < counter; i++) {

      const data = await contract.methods.items(i).call();
      items.push(data);
    }
    console.log(counter);
    console.log(items);
    this.setState({
      data: items
    });
    this.forceUpdate()
    return items;
  }

  status(a){

    switch(a){
      case "0":
        return "Farmer";
      case "1":
        return "Distributor";
      case "2":
        return "Retailer";
      case "4": 
        return "Sold";
      default:
        return "Invalid";
    }
  }

  render() {
    var data = this.state.data;
    var sv;
    if (data) {
      sv = data.map((d, index) => {
        return (
          <li key={index}>
            <Container>
              <Card>
                <Card.Body>
                  <Row>
                    Name: {d.name}
                  </Row>
                  <Row>
                    Tracking ID : {d.trackingId}
                  </Row>
                  <Row>
                    Price : {d.price}
                  </Row>
                  <Row>
                    Owner : {d.owner}
                  </Row>
                  <Row>
                    Status : {this.status(d.currentStatus)}
                  </Row>
                </Card.Body>
              </Card>
            </Container>
          </li>
        );
      });
    }
    return (
      <Container>
        <Navbar>
          <Navbar.Brand href="#home"><h1><b>Supply Chain Management</b></h1></Navbar.Brand>
          <Navbar.Toggle />
        </Navbar>
        <Card>
          <Card.Body>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Add Item
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Item Name</Form.Label>
                          <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Item Name"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Price</Form.Label>
                          <Form.Control type="number" name="price" value={this.state.price} onChange={this.handleChange} placeholder="Item Name"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Button variant="primary" size="lg" onClick={this.handleAddItem}>Add Item</Button>
                      </Form.Row>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Transfer Ownership
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <Form>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Address of New Owner</Form.Label>
                          <Form.Control type="text" name="address" value={this.state.address} onChange={this.handleChange} placeholder="Address"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Tracking Id</Form.Label>
                          <Form.Control type="number" name="trackingId" value={this.state.trackingId} onChange={this.handleChange} placeholder="Tracking Id"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Status</Form.Label>
                          <Form.Control as="select" name="status" value={this.state.status} onChange={this.handleChange}>
                            <option value={0}>Farmer</option>
                            <option value={1}>Distributor</option>
                            <option value={2}>Retailer</option>
                            <option value={3}>Consumer</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Button variant="primary" size="lg" onClick={this.handleTransferOwnership}>Transfer</Button>
                      </Form.Row>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="2">
                    Edit Price
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <Form>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Tracking ID</Form.Label>
                          <Form.Control type="number" name="trackingId" value={this.state.trackingId} onChange={this.handleChange} placeholder="Tracking Id"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Form.Group as={Col} lg={8}>
                          <Form.Label>Price</Form.Label>
                          <Form.Control type="number" name="price" value={this.state.price} onChange={this.handleChange} placeholder="Price"></Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row className="justify-content-md-center">
                        <Button variant="primary" size="lg" onClick={this.handlePriceChange}>Change Price</Button>
                      </Form.Row>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <Row className="justify-content-md-center">
              <Button varient="primary" size="lg" onClick={this.loadItem}>Load Items</Button>
            </Row>

            <ol>
              {sv}
            </ol>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default App;