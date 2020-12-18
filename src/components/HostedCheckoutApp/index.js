import React from 'react';
import './index.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import HomeIcon from '@material-ui/icons/Home';
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Button,
    Typography,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel, FormControl, FormLabel, FormHelperText, Checkbox, TextField,Switch
} from '@material-ui/core';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#280',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#280',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const TEST_ENV = ['dev', 'stage', 'sandbox'];
const DEFAULT_AMOUNT_DISPLAY_LIST = [
    {
        value: 2500,
        label: '$25',
    },
    {
        value: 5000,
        label: '$50',
    },
    {
        value: 7500,
        label: '$75',
    },
    {
        value: 10000,
        label: '$100',
    },
    {
        value: "custom",
        label: 'custom',
    },

];
const INITIAL_VALUES = {
    AMT_VALUE: DEFAULT_AMOUNT_DISPLAY_LIST[0].value,
    ANONYMOUS_CHECKED: false,
    TEST_TOGGLE_MODE: false,
    TEST_ENVIRONMENT: TEST_ENV[2]
}

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    root: {
        display: 'flex',
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    radio: {
        '&$checked': {
            color: '#fff'
        }
    },
}));

// const StyledToggleButtonGroup = withStyles((theme) => ({
//     grouped: {
//         margin: '10px',
//         minWidth: '120px',
//         border: '1px solid #fff',
//     },
// }))(ToggleButtonGroup);

function phoneMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
        />
    );
}

phoneMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

export default function HostedCheckoutApp(props) {
    const [amountValue, setAmountValue] = React.useState(INITIAL_VALUES.AMT_VALUE);
    const [helperText, setHelperText] = React.useState('');
    const [anonymousCheckboxChecked, setAnonymousCheckboxChecked] = React.useState(INITIAL_VALUES.ANONYMOUS_CHECKED);
    const [customAmount, setCustomAmount] = React.useState('');
    const [customer, setCustomer] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '(   )    -    ',
    });
    const [testToggle, setTestToggle] = React.useState(INITIAL_VALUES.TEST_TOGGLE_MODE);

    const [testMode, setTestMode] = React.useState({
        environment: INITIAL_VALUES.TEST_ENVIRONMENT,
        merchantId: '',
        apiToken: '',
    });

    const setCustomAmountValue = (event) => {
        setCustomAmount(event.target.value);
    };

    const setTestModeValues = (event) => {
        setTestMode({
            ...testMode,
            [event.target.name]: event.target.value,
        });
    };

    const setCustomerInfo = (event) => {
        setCustomer({
            ...customer,
            [event.target.name]: event.target.value,
        });
    };

    const classes = useStyles();

    const handleTestToggleChange = (event) => {
        setTestToggle(event.target.checked);
    };
    const handleAnonymousCheckboxChange = (event) => {
        setAnonymousCheckboxChecked(event.target.checked);
    };

    const handleAmountButtonChange = (event, newValue) => {
        setAmountValue(newValue);
    };

    const callCreateCheckoutAPI = async () => {
        const data = {
            "customer": anonymousCheckboxChecked ? {} : customer,
            "shoppingCart": {
                "lineItems": [
                    {
                        "name": "Donation to Elementary school",
                        "unitQty": 1,
                        "price": amountValue === 'custom' ? (parseFloat(customAmount)) * 100 : amountValue
                    }
                ]
            }
        };
        if(testToggle) {
            data.testMode = testMode;
        }
        const response = await fetch('/api/createCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const resp = await response.json();
        if (response.status !== 200) {
            // TODO - Show the error on UI ??
            throw Error(resp.message);
        }
        return resp;
    };

    const setTestData = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        return callCreateCheckoutAPI()
            .then((checkoutObj) => {
                setHelperText(`Redirecting ...`)
                setTimeout(() =>{
                    window.open(checkoutObj.href, '_blank');
                    setHelperText('');
                }, 1000 );

            })
            .catch(err => console.log(err));
    };

    return (
        <React.Fragment id="page-container" className="full-bleed" role="main">
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    {/*<CameraIcon className={classes.icon} />*/}
                    <HomeIcon variant="filled" fontSize="large" onClick={() => props.homeHandler()}/>
                    &nbsp;&nbsp;
                    <Typography variant="h5" className={classes.title} align="center" noWrap>
                        Elementary School - San Jose
                    </Typography>
                    <FormControlLabel textAlign="right" control={<IOSSwitch
                        checked={testToggle}
                        onChange={handleTestToggleChange}
                        name="testToggle"
                        color="primary"
                    />} label="Test Mode"/>
                </Toolbar>
            </AppBar>
            <main>
                <div id="page-container" className="full-bleed" role="main">
                    <div id="main-body-container">
                        <div className="leftSection">
                            <div className="introduction">
                                <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
                                    Welcome to our school bookfair!
                                </Typography>
                                <Typography variant="h5" color="textSecondary" paragraph>
                                    <p>Please join us to add more books to our school library by donating to our school website.</p>
                                    <p>Your donation would make a big difference.</p>
                                    <p>Thank you!</p>
                                </Typography>
                            </div>
                        </div>
                        <div className="rightSection">
                            { testToggle && (
                                <form className={classes.root} id="test-form" onSubmit={setTestData} noValidate autoComplete="off">
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Environment:</FormLabel>
                                        <FormGroup>
                                            <RadioGroup row aria-label="environment" name="environment" value={testMode.environment} onChange={setTestModeValues}>
                                                {TEST_ENV.map((option) => (
                                                    <FormControlLabel key={option.index} value={option} control={<Radio className={classes.radio} />} label={option}/>
                                                ))}
                                            </RadioGroup>
                                            <div className="FormRow">
                                                <TextField id="test_api_token"
                                                           label="API Token"
                                                           variant="filled"
                                                           onChange={setTestModeValues}
                                                           value={testMode.apiToken}
                                                           name='apiToken'
                                                />
                                            </div>
                                            <div className="FormRow">
                                                <TextField id="test_merchant_id"
                                                           label="Merchant Id"
                                                           variant="filled"
                                                           onChange={setTestModeValues}
                                                           value={testMode.merchantId}
                                                           name='merchantId'
                                                />
                                            </div>
                                        </FormGroup>
                                        {/*<Button variant="contained" id="setTestInfo" color="primary" size="small" onClick={handleSubmit}>
                                            Set
                                        </Button>*/}
                                    </FormControl>
                                </form>
                            )}
                            <form className={classes.root} id="amount-form" onSubmit={handleSubmit} noValidate autoComplete="off">
                                <FormControl className={classes.formControl}>
                                    <FormLabel component="legend">Select Amount:</FormLabel>
                                    <FormGroup>
                                        <ToggleButtonGroup value={amountValue} onChange={handleAmountButtonChange} size='large' exclusive>
                                            {DEFAULT_AMOUNT_DISPLAY_LIST.map((option) => (
                                                <ToggleButton key={option.value} value={option.value}>
                                                    {option.label}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                        { amountValue === 'custom'  && (
                                            <div className="FormRow">
                                                <TextField id="custom-amount"
                                                           label="Enter Amount"
                                                           fullWidth
                                                           variant="filled"
                                                           onChange={setCustomAmountValue}
                                                           value={customAmount}
                                                           name='customAmount'
                                                />
                                            </div>
                                        )}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={anonymousCheckboxChecked}
                                                    onChange={handleAnonymousCheckboxChange}
                                                    name="anonymousCheckbox"
                                                    color="primary"
                                                />
                                            }
                                            label="Want to pay anonymously?"
                                        />
                                        { !anonymousCheckboxChecked && (
                                            <div>
                                                <div className="FormRow">
                                                    <TextField id="user-firstname"
                                                               label="First Name"
                                                               variant="filled"
                                                               onChange={setCustomerInfo}
                                                               value={customer.firstName}
                                                               name='firstName'
                                                    />
                                                    <TextField id="user-lastname"
                                                               label="Last Name"
                                                               variant="filled"
                                                               onChange={setCustomerInfo}
                                                               value={customer.lastName}
                                                               name='lastName'
                                                    />
                                                </div>
                                                <div className="FormRow">
                                                    <TextField id="user-email"
                                                               label="Email"
                                                               fullWidth
                                                               variant="filled"
                                                               onChange={setCustomerInfo}
                                                               value={customer.email}
                                                               name='email'
                                                    />
                                                </div>
                                                <div className="FormRow">
                                                    <TextField id="user-phone-number"
                                                               label="Phone Number"
                                                               fullWidth
                                                               variant="filled"
                                                               onChange={setCustomerInfo}
                                                               value={customer.phoneNumber}
                                                               name='phoneNumber'
                                                               inputComponent={phoneMaskCustom}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <Button variant="contained" id="payWithCloverBtn" color="primary" size="large" onClick={handleSubmit}>
                                            Proceed To Checkout
                                        </Button>
                                        <FormHelperText>{helperText}</FormHelperText>
                                    </FormGroup>
                                </FormControl>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            {/*<footer className={classes.footer}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    {new Date().getFullYear()}{' '}
                    <Link color="inherit" href="https://clover.com/">
                        Clover Network, Inc
                    </Link>
                    {'.'}
                </Typography>
            </footer>*/}
        </React.Fragment>
    );
}