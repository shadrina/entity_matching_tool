import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import { browserHistory } from 'react-router';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import axios from 'axios';
    
    
class ListJobs extends Component {

    constructor(props) {
        super();
        this.state = {
            isChanged: false,
            metrics: null,
            activeKey: '1',
            listJobs: null,
            url: localStorage.getItem('loginToken') ? 'http://' + localStorage.getItem('loginToken') + ':@localhost:5000' : null
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.changeMetric = this.changeMetric.bind(this);
    };

    componentWillMount() {
        let self = this;
        axios.get('/metrics/')
            .then(function(response) {
                self.setState({
                    metrics: response.data
                                .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            });
        if(localStorage.getItem('loginToken')){
            axios.get(this.state.url + '/joblist/')
                .then(function(response) {
                    self.setState({
                        listJobs: response.data != null ?
                                    response.data
                                        .map((job) => 
                                            <Panel key={job.id} header={job.name} eventKey={job.id}>
                                                {"Status"}
                                                <Well bsSize='sm'>
                                                    {}
                                                </Well>
                                                {"Source 1"}
                                                <Well bsSize='sm'>
                                                    {job.source1}
                                                </Well>
                                                {"Selected field"}
                                                <Well bsSize='sm'>
                                                    {job.selectedFields.source1}
                                                </Well>
                                            
                                                {"Source 2"}
                                                <Well bsSize='sm'>
                                                    {job.source2}
                                                </Well>

                                                {"Selected field"}
                                                <Well bsSize='sm'>
                                                    {job.selectedFields.source2}
                                                </Well>
                                                {"SelectedMetric"}
                                                <Well bsSize='sm'>
                                                    {job.metric}
                                                </Well>
                                                <FormGroup controlId="metric">
                                                    <FormControl  componentClass="select" onChange={() => self.setState({ isChanged: true })}>
                                                        <option value={"..."}> {"..."} </option>
                                                        {self.state.metrics}
                                                    </FormControl>
                                                    <HelpBlock> Change the metric if necessary </HelpBlock>
                                                </FormGroup>
                                                <ButtonToolbar>
                                                    <Button onClick={() => browserHistory.push('/options/' + job.id)}> Matching options </Button>
                                                    <Button bsStyle="danger" onClick={() => self.deleteJob(job.id)}> Delete job </Button>
                                                    <Button 
                                                        bsStyle='success' 
                                                        onClick={() => self.changeMetric(job.id)}
                                                        >  
                                                        Change metric
                                                    </Button>
                                                </ButtonToolbar>
                                            </Panel>
                                        ) 
                                    : null
                    });
                });
        }
    };

    deleteJob(id) {
        axios.delete(this.state.url + '/jobs/?jobId=' + id)
            .then(function(response) {
                console.log(response);
            })
    }

    changeMetric(id) {
        let self = this;
        const metric = document.getElementById('metric').value
        if (metric != "...") {
            axios.post(this.state.url + '/changemetric/', {
                jobId: id,
                metric: metric
            }).then(function(response) {
                self.setState({
                    isChanged: false  
                });
                console.log(response);
                self.forceUpdate();
            });
        }   
    }

    handleSelect(activeKey) {
        console.log('Kek');
        this.setState({
            isChanged: false 
        });
        this.state.activeKey === activeKey ? 
            this.setState({ activeKey: null}) : this.setState({ activeKey: activeKey });
    };

    render() {
        console.log(this.state.isChanged);
        return (
            <PanelGroup activeKey={this.state.activeKey} 
                onSelect={this.handleSelect} accordion>
                {this.state.listJobs}
            </PanelGroup>
        );
    };
};

export default ListJobs;