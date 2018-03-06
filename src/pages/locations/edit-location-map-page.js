/**
 * Copyright 2018 OpenStack Foundation
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
import ImageForm from '../../components/forms/image-form';
import { getSummitById }  from '../../actions/summit-actions';
import { getLocationMap, resetLocationMapForm, saveLocationMap, attachLocationMap } from "../../actions/location-actions";

class EditLocationMapPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mapId: props.match.params.map_id,
            locationId: props.match.params.location_id
        }
    }

    componentWillReceiveProps(nextProps) {
        let {mapId, locationId} = this.state;

        let new_map_id = nextProps.match.params.map_id;
        let new_location_id = this.props.match.params.location_id;

        if(mapId != new_map_id || locationId != new_location_id) {

            this.setState({
                mapId: new_map_id,
                locationId: new_location_id
            });

            if(new_map_id && new_location_id) {
                this.props.getLocationMap(new_location_id, new_map_id);
            } else {
                this.props.resetLocationMapForm();
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
        let {currentSummit, allTypes, errors} = this.props;
        let mapId = this.props.match.params.map_id;
        let locationId = this.props.match.params.location_id;

        if(currentSummit != null) {
            if (mapId != null  && locationId != null) {
                this.props.getLocationMap(locationId, mapId);
            } else {
                this.props.resetLocationMapForm();
            }
        }
    }

    render(){
        let {currentSummit, entity, errors} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");

        return(
            <div className="container">
                <h3>{title} {T.translate("edit_location.map")}</h3>
                <hr/>
                {currentSummit &&
                <ImageForm
                    history={this.props.history}
                    currentSummit={currentSummit}
                    locationId={this.state.locationId}
                    entity={entity}
                    errors={errors}
                    onSubmit={this.props.saveLocationMap}
                    onAttach={attachLocationMap}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentLocationMapState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...currentLocationMapState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getLocationMap,
        resetLocationMapForm,
        saveLocationMap,
    }
)(EditLocationMapPage);