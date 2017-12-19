/**
 * Copyright 2017 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import {queryMembers} from '../../actions/speaker-actions';

export default class MemberInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
        this.getMembers = this.getMembers.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.hasOwnProperty('value') && this.state.value != nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    handleChange(value) {
        let ev = {target: {
            id: this.props.id,
            value: value,
            type: 'memberinput'
        }};

        this.props.onChange(ev);
    }

    getMembers (input) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        return queryMembers(this.props.summitId, input);
    }

    processTagValues(new_values) {
        if (this.props.multi) {
            if (!new_values) return [];
            new_values = Array.isArray(new_values) ? new_values : [new_values];

            return new_values.map(v => {
                if (v.hasOwnProperty('name'))
                    return {id: v.id, name: v.name};
                else
                    return {id: v.id, name: v.first_name + ' ' + v.last_name + ' (' + v.id + ')'};
            });

        } else {
            let value = {};
            if (!new_values || !new_values.hasOwnProperty('id')) return value;

            let label = new_values.hasOwnProperty('name') ? new_values.name : new_values.first_name + ' ' + new_values.last_name + ' (' + new_values.id + ')';

            return {id: new_values.id, name: label};
        }

    }

    render() {

        return (
            <Select.Async
                multi={this.props.multi}
                value={this.processTagValues(this.state.value)}
                onChange={this.handleChange}
                loadOptions={this.getMembers}
                backspaceRemoves={true}
                valueKey="id"
                labelKey="name"
            />
        );

    }
}
