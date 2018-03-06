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

import React from 'react'
import T from 'i18n-react/dist/i18n-react'
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
import MemberInput from '../../inputs/member-input'
import CompanyInput from '../../inputs/company-input'
import DateTimePicker from '../../inputs/datetimepicker/index'
import Input from '../../inputs/text-input'
import TicketComponent from './ticket-component'
import RsvpComponent from './rsvp-component'
import {epochToMoment} from '../../../utils/methods'


class AttendeeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entity: {...props.entity},
            errors: props.errors
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            entity: {...nextProps.entity},
            errors: {...nextProps.errors}
        });

        //scroll to first error
        if(Object.keys(nextProps.errors).length > 0) {
            let firstError = Object.keys(nextProps.errors)[0]
            let firstNode = document.getElementById(firstError);
            if (firstNode) window.scrollTo(0, findElementPos(firstNode));
        }
    }

    handleChange(ev) {
        let entity = {...this.state.entity};
        let errors = {...this.state.errors};
        let {value, id} = ev.target;

        if (ev.target.type == 'checkbox') {
            value = ev.target.checked;
        }

        if (ev.target.type == 'memberinput') {
            this.props.onMemberChange(value);
        }

        errors[id] = '';
        entity[id] = value;
        this.setState({entity: entity, errors: errors});
    }

    handleSubmit(ev) {
        let entity = {...this.state.entity};
        ev.preventDefault();

        this.props.onSubmit(this.state.entity, this.props.history);
    }

    handlePresentationLink(event_id, ev) {
        let {currentSummit} = this.props;
        ev.preventDefault();
        let event_detail_url = currentSummit.schedule_event_detail_url.replace(':event_id',event_id).replace(':event_title','');
        window.open(event_detail_url, '_blank');
    }

    handleSpeakerLink(speaker_id, ev) {
        let {history} = this.props;
        ev.preventDefault();

        history.push(`/app/speakers/${speaker_id}`);
    }

    hasErrors(field) {
        let {errors} = this.state;
        if(field in errors) {
            return errors[field];
        }

        return '';
    }

    render() {
        let {entity} = this.state;
        let { currentSummit } = this.props;

        return (
            <form className="summit-attendee-form">
                <input type="hidden" id="id" value={entity.id} />
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("general.member")} *</label>
                        <MemberInput
                            id="member"
                            value={entity.member}
                            onChange={this.handleChange}
                            multi={false}
                        />
                    </div>
                    {entity.speaker != null &&
                    <div className="col-md-4">
                        <label> {T.translate("general.speaker")} </label><br/>
                        <a href="" onClick={this.handleSpeakerLink.bind(this, entity.speaker.id)}>
                            {entity.speaker.first_name} {entity.speaker.last_name}
                        </a>
                    </div>
                    }
                </div>
                {entity.member != null &&
                <div>
                    {entity.member.affiliations && entity.member.affiliations.length > 0 &&
                        <div className="row form-group">
                            <legend>{T.translate("edit_attendee.current_affiliation")}</legend>
                            <div className="col-md-3">
                                <label> {T.translate("edit_attendee.affiliation_title")} </label>
                                <Input
                                    className="form-control"
                                    id="affiliation_title"
                                    value={entity.affiliation_title}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label> {T.translate("edit_attendee.company")} </label>
                                <CompanyInput
                                    id="affiliation_organization"
                                    value={{name: entity.affiliation_organization_name, value: entity.affiliation_organization_id}}
                                    onChange={this.handleChange}
                                    summitId={currentSummit.id}
                                    multi={true}
                                />
                            </div>
                            <div className="col-md-2" style={{paddingTop: '24px'}}>
                                <DateTimePicker
                                    id="affiliation_start_date"
                                    onChange={this.handleChange}
                                    format={{date:"YYYY-MM-DD", time: "HH:mm"}}
                                    value={epochToMoment(entity.affiliation_start_date)}
                                    inputProps={{placeholder: T.translate("edit_attendee.placeholders.start_date")}}
                                />
                            </div>
                            <div className="col-md-2" style={{paddingTop: '24px'}}>
                                <DateTimePicker
                                    id="affiliation_end_date"
                                    onChange={this.handleChange}
                                    format={{date:"YYYY-MM-DD", time: "HH:mm"}}
                                    value={epochToMoment(entity.affiliation_end_date)}
                                    inputProps={{placeholder: T.translate("edit_attendee.placeholders.end_date")}}
                                />
                            </div>
                            <div className="col-md-2">
                                <div className="form-check abc-checkbox current_affiliation">
                                    <input type="checkbox" id="affiliation_current" checked={entity.affiliation_current}
                                           onChange={this.handleChange} className="form-check-input"/>
                                    <label className="form-check-label"
                                           htmlFor="affiliation_current"> {T.translate("edit_attendee.affiliation_current")} </label>
                                </div>
                            </div>
                        </div>

                    }
                    <div className="row form-group">
                        <legend>{T.translate("general.attendee")}</legend>
                        <div className="col-md-3">
                            <div className="form-check abc-checkbox">
                                <input type="checkbox" id="shared_contact_info" checked={entity.shared_contact_info}
                                       onChange={this.handleChange} className="form-check-input"/>
                                <label className="form-check-label" htmlFor="shared_contact_info">
                                    {T.translate("edit_attendee.shared_contact_info")}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-check abc-checkbox">
                                <input type="checkbox" id="summit_hall_checked_in" checked={entity.summit_hall_checked_in}
                                       onChange={this.handleChange} className="form-check-input"/>
                                <label className="form-check-label" htmlFor="summit_hall_checked_in">
                                    {T.translate("edit_attendee.checked_in")}
                                </label>
                            </div>
                        </div>
                    </div>
                    {entity.hasOwnProperty('tickets') &&
                    <TicketComponent
                        attendeeId={entity.id}
                        tickets={entity.tickets}
                        summit={currentSummit}
                        onSave={this.props.onSaveTicket}
                        onDelete={this.props.onDeleteTicket}
                    />
                    }

                    {entity.member.hasOwnProperty('rsvp') && entity.member.rsvp.length > 0 &&
                    <RsvpComponent member={entity.member} onDelete={this.props.onDeleteRsvp} />
                    }

                </div>
                }

                <div className="row">
                    <div className="col-md-12 submit-buttons">
                        <input type="button" onClick={this.handleSubmit}
                               className="btn btn-primary pull-right" value={T.translate("general.save")}/>
                    </div>
                </div>
            </form>
        );
    }
}

export default AttendeeForm;