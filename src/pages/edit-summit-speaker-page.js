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
import { connect } from 'react-redux';
import T from "i18n-react/dist/i18n-react";
import SpeakerForm from '../components/speaker-form/speaker-form';
import { getSummitById }  from '../actions/summit-actions';
import { getSpeaker, resetSpeakerForm, saveSpeaker, attachPicture } from "../actions/speaker-actions";

class EditSummitSpeakerPage extends React.Component {

    constructor(props) {
        super(props);

        //this.handleEdit = this.handleEdit.bind(this);

        this.state = {
            speakerId: props.match.params.speaker_id
        }
    }

    componentWillReceiveProps(nextProps) {
        let {speakerId} = this.state;
        let new_speaker_id = nextProps.match.params.speaker_id;

        if(speakerId != new_speaker_id) {

            this.setState({speakerId: new_speaker_id});

            if(new_speaker_id) {
                this.props.getSpeaker(new_speaker_id);
            } else {
                this.props.resetSpeakerForm();
            }
        }
    }

    componentWillMount () {
        let summitId = this.props.match.params.summit_id;
        let {currentSummit} = this.props;

        if(currentSummit == null){
            this.props.getSummitById(summitId);
        }
    }

    componentDidMount () {
        let {currentSummit, entity, errors} = this.props;
        let speakerId = this.props.match.params.speaker_id;

        if(currentSummit != null) {
            if (speakerId != null) {
                this.props.getSpeaker(speakerId);
            } else {
                this.props.resetSpeakerForm();
            }
        }
    }

    render(){
        let {currentSummit, entity, errors} = this.props;
        let title = (entity.id) ? 'Edit' : 'Add';

        return(
            <div className="container">
                <h3>{title} {T.translate("general.speaker")}</h3>
                <hr/>
                {currentSummit &&
                <SpeakerForm
                    history={this.props.history}
                    currentSummit={currentSummit}
                    entity={entity}
                    errors={errors}
                    onSubmit={this.props.saveSpeaker}
                    onAttach={this.props.attachPicture}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentSpeakerState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...currentSpeakerState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getSpeaker,
        resetSpeakerForm,
        saveSpeaker,
        attachPicture
    }
)(EditSummitSpeakerPage);