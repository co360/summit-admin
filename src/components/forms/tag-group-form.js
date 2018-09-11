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
import {findElementPos, queryTags} from 'openstack-uicore-foundation/lib/methods'
import { Input, SimpleLinkList } from 'openstack-uicore-foundation/lib/components'


class TagGroupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entity: {...props.entity},
            errors: props.errors
        };

        this.handleAllowedTagLink = this.handleAllowedTagLink.bind(this);
        this.handleAllowedTagUnLink = this.handleAllowedTagUnLink.bind(this);
        this.getTags = this.getTags.bind(this);
        this.handleCopyToCategory = this.handleCopyToCategory.bind(this);
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

        errors[id] = '';
        entity[id] = value;
        this.setState({entity: entity, errors: errors});
    }

    handleSubmit(ev) {
        let entity = {...this.state.entity};

        ev.preventDefault();

        this.props.onSubmit(entity, this.props.history);
    }

    hasErrors(field) {
        let {errors} = this.state;
        if(field in errors) {
            return errors[field];
        }

        return '';
    }

    handleAllowedTagLink(value) {
        let {entity} = this.state;
        entity.allowed_tags = [...entity.allowed_tags, value];
        //this.props.onSubmit(entity, this.props.history);

        this.setState({entity: entity});
    }

    handleAllowedTagUnLink(valueId, ev) {
        let {entity} = this.state;
        ev.preventDefault();

        entity.allowed_tags = entity.allowed_tags.map(at => at.id != valueId);
        //this.props.onSubmit(entity, this.props.history);

        this.setState({entity: entity});
    }

    getTags(input, callback) {
        queryTags(null, input, callback);
    }

    handleCopyToCategory(tagId, ev) {
        ev.preventDefault();

        alert('WIP');

        // TODO
    }

    render() {
        let {entity} = this.state;

        let allowedTagsColumns = [
            { columnKey: 'tag', value: T.translate("edit_tag_group.tag") }
        ];

        let allowedTagsOptions = {
            title: T.translate("edit_tag_group.allowed_tags"),
            sortCol: "tag",
            valueKey: "id",
            labelKey: "tag",
            actions: {
                search: this.getTags,
                delete: { onClick: this.handleAllowedTagUnLink },
                add: { onClick: this.handleAllowedTagLink },
                custom: [
                    {
                        name: 'copy_to_category',
                        icon: <i className="fa fa-files-o"></i>,
                        onClick: this.handleCopyToCategory
                    }
                ]
            }
        };

        return (
            <form className="tag-group-form">
                <input type="hidden" id="id" value={entity.id} />
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("edit_tag_group.name")} *</label>
                        <Input
                            id="name"
                            value={entity.name}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('name')}
                        />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("edit_tag_group.label")}</label>
                        <Input
                            id="label"
                            value={entity.label}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('label')}
                        />
                    </div>
                </div>

                {entity.id != 0 &&
                <SimpleLinkList
                    values={entity.allowed_tags}
                    columns={allowedTagsColumns}
                    options={allowedTagsOptions}
                />
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

export default TagGroupForm;