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
import { Breadcrumb } from 'react-breadcrumbs';
import {
    getEventCategoryQuestion,
    resetEventCategoryQuestionForm,
    saveEventCategoryQuestion,
    getEventCategoryQuestionMeta,
    saveEventCategoryQuestionValue,
    deleteEventCategoryQuestionValue
} from "../../actions/event-category-actions";
import EventCategoryQuestionForm from "../../components/forms/event-category-question-form";
//import '../../styles/edit-summit-attendee-page.less';

class EditEventCategoryQuestionPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleSaveValue = this.handleSaveValue.bind(this);
        this.handleDeleteValue = this.handleDeleteValue.bind(this);
    }

    componentWillMount () {
        let eventCategoryQuestionId = this.props.match.params.category_question_id;

        if (!eventCategoryQuestionId) {
            this.props.resetEventCategoryQuestionForm();
        } else {
            this.props.getEventCategoryQuestion(eventCategoryQuestionId);
        }

        this.props.getEventCategoryQuestionMeta();
    }

    componentWillReceiveProps(newProps) {
        let oldId = this.props.match.params.category_question_id;
        let newId = newProps.match.params.category_question_id;

        if (oldId != newId) {
            if (!newId) {
                this.props.resetEventCategoryQuestionForm();
            } else {
                this.props.getEventCategoryQuestion(newId);
            }
        }
    }

    handleSaveValue(value) {
        let {entity} = this.props;

        this.props.saveEventCategoryQuestionValue(entity.id, value);
    }

    handleDeleteValue(valueId) {
        let {entity} = this.props;

        this.props.deleteEventCategoryQuestionValue(entity.id, valueId);
    }

    render(){
        let {currentSummit, currentEventCategory, allClasses, entity, errors, match} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");
        let breadcrumb = (entity.id) ? entity.name : T.translate("general.new");

        if (!currentEventCategory.id) return (<div></div>);

        return(
            <div className="container">
                <Breadcrumb data={{ title: breadcrumb, pathname: match.url }} ></Breadcrumb>
                <h3>{title} {T.translate("edit_event_category_question.extra_question")}</h3>
                <hr/>
                {currentSummit &&
                <EventCategoryQuestionForm
                    entity={entity}
                    allClasses={allClasses}
                    errors={errors}
                    onSubmit={this.props.saveEventCategoryQuestion}
                    onSaveValue={this.handleSaveValue}
                    onDeleteValue={this.handleDeleteValue}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentEventCategoryState, currentEventCategoryQuestionState }) => ({
    currentSummit : currentSummitState.currentSummit,
    currentEventCategory: currentEventCategoryState.entity,
    ...currentEventCategoryQuestionState
})

export default connect (
    mapStateToProps,
    {
        resetEventCategoryQuestionForm,
        getEventCategoryQuestion,
        saveEventCategoryQuestion,
        getEventCategoryQuestionMeta,
        saveEventCategoryQuestionValue,
        deleteEventCategoryQuestionValue
    }
)(EditEventCategoryQuestionPage);
