import React, {Component} from 'react';
import './index.css';
import {
    Button,
    Typography,
} from '@material-ui/core';
import DonationApp from "../DonationApp";
import HostedCheckoutApp from "../HostedCheckoutApp"

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            donationApp: false,
            hostedCheckoutApp: false,
        };
    }
    resetStates = () => {
        this.setState({donationApp: false, hostedCheckoutApp: false});
    };

    buttonHandler = e => {
        e.preventDefault();
        this.resetStates();

        switch (e.target.parentNode.id) {
            case 'donationApp':
                this.setState({donationApp: true});
                break;
            case 'hostedCheckoutApp':
                this.setState({hostedCheckoutApp: true});
                break;
            default:
                console.log('.');
        }
    };

    homeButtonHandler = () => {
        this.resetStates();
    };

    render() {
        return (
            <>
                {!this.state.donationApp && !this.state.hostedCheckoutApp && (
                    <div className="App">
                        <div id="page-container" className="full-bleed" role="main">
                            <div id="top-header-container">
                                <Typography variant="h4" gutterBottom>
                                    Clover Merchant's Demo App
                                </Typography>
                            </div>
                            <div id="main-body-container">
                                <div className="App-header">
                                    <Button variant="contained" id="hostedCheckoutApp" color="primary" size="large"
                                            onClick={this.buttonHandler}>
                                        Hosted Checkout App
                                    </Button>
                                    <Button variant="contained" id="donationApp" color="primary" size="large"
                                            onClick={this.buttonHandler}>
                                        Donation App
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.donationApp && <DonationApp homeHandler={this.homeButtonHandler}  />}
                {this.state.hostedCheckoutApp && <HostedCheckoutApp homeHandler={this.homeButtonHandler} />}
            </>
        );
    }
}

export default Home;
