import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import SelectUnits from './SelectUnits';
import Axios from "axios";


export default class QuantityMeasurement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mainUnitsList: [],
            subUnitsList: [],
            firstTextFieldValue: "",
            secondTextFieldValue: "",
            selectedUnits: "",
            firstSubUnit: ""
        };
        this.secondSubUnit = "";
    }

    getMainUnits = () => {
        Axios.get("http://localhost:8080/unit").then((response) => {
                console.log(response)
                this.setState({mainUnitsList: response.data})
            }
        ).catch((error) => console.log(error))
    }

    getSubUnit = (event) => {
        this.selectedUnits = event.target.value;
        console.log("selected MainUnits " + this.firstSubUnit);
        Axios.get(`http://localhost:8080/unit/subunits/${this.selectedUnits}`).then(response => {
            this.setState({
                subUnitsList: response.data,
            })
        }).catch(error => {
            console.log(error);
        })
    }

    getFirstSubUnits = event => {
        this.firstSubUnit = event.target.value;
        console.log("selected First SubUnits " + this.firstSubUnit);
    }

    getSecondSubUnits = event => {
        this.secondSubUnit = event.target.value;
        console.log("selected Second SubUnits " + this.secondSubUnit);
    }

    getConversion = event => {
        this.setState({firstTextFieldValue: event.target.value});
        const myData = {
            value: event.target.value,
            firstUnitType: this.firstSubUnit,
            secondUnitType: this.secondSubUnit,
        }
        Axios.post(`http://localhost:8080/unit/conversion`, myData).then((response) => {
            console.log(response);
            this.setState({
                value2: response.data.value
            })
        })
    }

    getConversion2 = (event) => {
        this.setState({secondTextFieldValue: event.target.value});
        const myData = {
            value: event.target.value,
            firstUnitType: this.secondSubUnit,
            secondUnitType: this.firstSubUnit,
        }
        Axios.post(`http://localhost:8080/unit/converter`, myData).then((response) => {
            console.log(response);
            this.setState({
                value1: response.data.value
            })
        })
    }

    componentDidMount() {
        this.getMainUnits();
    }

    render() {
        return (
            <Card className="Root">
                <CardContent>
                    <div className="Component-Container">
                        <SelectUnits width="600px" labelName="Main Units" onChange={this.getSubUnit}
                                        listData={this.state.mainUnitsList}/>
                    </div>
                    <div className="Component-Container">
                        <TextField required id="outlined-required" variant="outlined"
                                   helperText="Value" onChange={this.getConversion}
                                   value={this.state.firstTextFieldValue}/>
                        <span className="InlineDiv">=</span>
                        <TextField required id="outlined-required" variant="outlined"
                                   value={this.state.secondTextFieldValue} onChange={this.getConversion2}
                                   helperText="Value"/>
                    </div>
                    <div className="Component-Container">
                        <SelectUnits labelName="Sub Units" onChange={this.getFirstSubUnits}
                                        listData={this.state.subUnitsList}/>
                        <SelectUnits labelName="Sub Units" onChange={this.getSecondSubUnits}
                                        listData={this.state.subUnitsList}/>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
