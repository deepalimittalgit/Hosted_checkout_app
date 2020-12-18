import React, {Component} from 'react';
import './index.css';
import classNames from "classnames";
import {
    Button,
    Typography,
    Divider, Paper, Toolbar, AppBar,
} from '@material-ui/core';
import IframeApp from "../IframeApp";
import SDKApp from "../SDKApp"
import HomeIcon from '@material-ui/icons/Home';

class DonationApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframeapp: false,
            sdkapp: false,
            output: [],
        };
    }
    resetStates = () => {
        this.setState({iframeapp: false, sdkapp: false, output: []});
    };

    buttonHandler = e => {
        e.preventDefault();
        this.resetStates();

        switch (e.target.parentNode.id) {
            case 'iframe':
                this.setState({iframeapp: true});
                break;
            case 'sdk':
                this.setState({sdkapp: true});
                break;
            default:
                console.log('.');
        }
    };

    backFunctionHandler = () => {
        this.resetStates();
    };

    clearOutput = () => {
        this.setState({output: []});
        const outputConsole = document.getElementById('output-area');
        outputConsole.innerHTML= "";
    };

    outputHandler = (message, clear = false) => {
        if(clear) {
            this.clearOutput();
        }
        message && this.setState({ output: [...this.state.output, message]});
    };

    render() {
        return (
            <div className="App">
                <AppBar position="relative">
                    <Toolbar>
                        {/*<CameraIcon className={classes.icon} />*/}
                        <HomeIcon variant="filled" fontSize="large" onClick={() => this.props.homeHandler()}/>
                        &nbsp;&nbsp;
                        <Typography variant="h5" className="donationTitle" align="center" noWrap>
                            Donation App
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main>
                    <div id="page-container" className="full-bleed" role="main">
                        <div id="main-body-container">
                            <div className="leftSection">
                                <div className="introduction">
                                    <p className="title">&nbsp;&nbsp;Welcome to my Bookshop!</p>
                                    <ul>
                                        <li>
                                            <p>Right now, we are at crucial point in the fight against COVID 19.</p>
                                            <p>We’ll get right to the point. With the COVID-19 our business is impacted.
                                            We’re a small business that relies on support from people like you.</p>
                                            <p>Please help us running our business, your donation would make a big difference.</p>
                                        </li>
                                        <li>
                                            Thank you!
                                        </li>
                                    </ul>

                                </div>
                            </div>
                            <div className="rightSection">
                                {!this.state.iframeapp && !this.state.sdkapp && (
                                    <div className="App-header">
                                        <Button variant="contained" id="sdk" color="primary" size="large"
                                                onClick={this.buttonHandler}>
                                            Donate with Node SDK
                                        </Button>
                                        <Button variant="contained" id="iframe" color="primary" size="large"
                                                onClick={this.buttonHandler}>
                                            Donate with iFrame SDK
                                        </Button>
                                    </div>
                                )}
                                {this.state.iframeapp && <IframeApp backHandler={this.backFunctionHandler} outputHandler={this.outputHandler}/>}
                                {this.state.sdkapp && <SDKApp backHandler={this.backFunctionHandler} outputHandler={this.outputHandler}/>}
                            </div>
                        </div>
                        {(this.state.iframeapp || this.state.sdkapp) && (
                            <div id="console-header">
                                <Divider variant="middle" />
                                <h2>Console Output</h2>
                            </div>
                        )}
                        <div id="output-container" className={classNames({
                            blackColor: this.state.iframeapp || this.state.sdkapp,
                            mainColor: (!this.state.iframeapp && !this.state.sdkapp)
                        })}>
                            { (this.state.iframeapp || this.state.sdkapp) && (
                            <Paper elevation={3} id="output-area">
                                {this.state.output.map((item, key) =>
                                    <p key={key}>{item}</p>
                                )}
                            </Paper>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default DonationApp;
