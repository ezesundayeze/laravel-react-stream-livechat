import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Chart from './Chart/Chart';
import AdminChart from './Admin/AdminChart';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path='/' component={Chart} />
                    <Route exact path='/admin' component={AdminChart} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}


ReactDOM.render(<App />, document.getElementById('app'));

