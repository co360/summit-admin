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
import { Dropdown, Input, UploadInput, TextEditor} from 'openstack-uicore-foundation/lib/components'
import { findElementPos } from 'openstack-uicore-foundation/lib/methods'


class EventMaterialForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entity: {...props.entity},
            file: null,
            errors: props.errors
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMUType = this.handleChangeMUType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        let name = nextProps.entity.id ? nextProps.entity.name : nextProps.event.title;
        let description = nextProps.entity.id ? nextProps.entity.description : nextProps.event.description;

        this.setState({
            entity: {...nextProps.entity, name, description},
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

        if (ev.target.type == 'number') {
            value = parseInt(ev.target.value);
        }

        errors[id] = '';
        entity[id] = value;
        this.setState({entity: entity, errors: errors});
    }

    handleChangeMUType(ev) {
        let entity = {...this.state.entity};
        let errors = {...this.state.errors};
        let {value} = ev.target;

        let type = this.props.event.type.allowed_media_upload_types.find(mu => mu.id === value);

        errors.media_upload_type_id = '';
        entity.media_upload_type_id = value;
        entity.name = type.name;

        this.setState({entity: entity, errors: errors});
    }

    handleUploadFile(file) {
        this.setState({file: file});
    }

    handleRemoveFile(ev) {
        let entity = {...this.state.entity};
        entity.file_link = '';
        this.setState({entity: entity, file: null});
    }

    handleSubmit(ev) {
        let {entity, file} = this.state;
        ev.preventDefault();

        if (file || entity.class_name === 'PresentationMediaUpload') {
            this.props.onSubmitWithFile(entity, file, entity.class_name);
        } else {
            this.props.onSubmit(entity);
        }
    }

    hasErrors(field) {
        let {errors} = this.state;
        if(field in errors) {
            return errors[field];
        }

        return '';
    }

    render() {
        let {entity, file} = this.state;
        let filePreview = file ? file.preview : (entity.file_link || entity.private_url || entity.public_url);

        let event_materials_ddl = [
            {label: 'Link', value: 'PresentationLink'},
            {label: 'Slide', value: 'PresentationSlide'},
            {label: 'Video', value: 'PresentationVideo'},
            {label: 'Media Upload', value: 'PresentationMediaUpload'}
        ];

        let media_uploads_ddl = this.props.event.type.allowed_media_upload_types.map(mu => ({label: mu.name, value: mu.id}));

        const disableInputs = entity.class_name === 'PresentationMediaUpload';

        return (
            <form className="event-material-form">
                <input type="hidden" id="id" value={entity.id} />
                <div className="row form-group">
                    <div className="col-md-4">
                        <label> {T.translate("edit_event_material.type")} *</label>
                        <Dropdown
                            id="class_name"
                            key="class_name_ddl"
                            value={entity.class_name}
                            placeholder={T.translate("edit_event_material.placeholders.select_type")}
                            options={event_materials_ddl}
                            onChange={this.handleChange}
                            disabled={entity.id !== 0}
                        />
                    </div>
                    {entity.class_name === 'PresentationMediaUpload' &&
                    <div className="col-md-4">
                        <label> {T.translate("edit_event_material.media_upload_type")} *</label>
                        <Dropdown
                            id="media_upload_type_id"
                            value={entity.media_upload_type_id}
                            placeholder={T.translate("edit_event_material.placeholders.select_type")}
                            options={media_uploads_ddl}
                            onChange={this.handleChangeMUType}
                            disabled={entity.id !== 0}
                        />
                    </div>
                    }
                </div>
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("edit_event_material.name")} *</label>
                        <Input
                            id="name"
                            value={entity.name}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('name')}
                            disabled={disableInputs}
                        />
                    </div>
                    <div className="col-md-6 checkboxes-div">
                        <div className="form-check abc-checkbox">
                            <input type="checkbox" id="display_on_site" checked={entity.display_on_site}
                                   onChange={this.handleChange} className="form-check-input" disabled={disableInputs}/>
                            <label className="form-check-label" htmlFor="display_on_site">
                                {T.translate("edit_event_material.display_on_site")}
                            </label>
                        </div>
                    </div>
                </div>

                {!disableInputs &&
                <div className="row form-group">
                    <div className="col-md-12">
                        <label> {T.translate("edit_event_material.description")} *</label>
                        <TextEditor
                            id="description"
                            value={entity.description}
                            onChange={this.handleChange}
                            error={this.hasErrors('description')}
                        />
                    </div>
                </div>
                }
                {entity.class_name === 'PresentationLink' &&
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("edit_event_material.link")} *</label>
                        <Input
                            id="link"
                            value={entity.link}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('link')}
                        />
                    </div>
                </div>
                }

                {entity.class_name === 'PresentationSlide' &&
                <div className="row form-group">
                    <div className="col-md-12">
                        <label> {T.translate("edit_event_material.slide")} </label>
                        <UploadInput
                            value={filePreview}
                            handleUpload={this.handleUploadFile}
                            handleRemove={this.handleRemoveFile}
                            className="dropzone col-md-6"
                            multiple={false}
                            maxSize={60 * 1024 * 1024}
                        />
                    </div>
                    <div className="col-md-7 text-center">
                        <br/>
                        <label> OR </label>
                    </div>
                    <div className="col-md-6">
                        <label> {T.translate("edit_event_material.link")}</label>
                        <Input
                            id="link"
                            value={entity.link}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('link')}
                        />
                    </div>
                </div>
                }

                {entity.class_name === 'PresentationVideo' &&
                <div className="row form-group">
                    <div className="col-md-6">
                        <label> {T.translate("edit_event_material.youtube_id")} *</label>
                        <Input
                            id="youtube_id"
                            value={entity.youtube_id}
                            onChange={this.handleChange}
                            className="form-control"
                            error={this.hasErrors('youtube_id')}
                        />
                    </div>
                </div>
                }

                {entity.class_name === 'PresentationMediaUpload' && entity.media_upload_type_id !== 0 &&
                <div className="row form-group">
                    <div className="col-md-12">
                        <label> {T.translate("edit_event_material.media_upload_file")} </label>
                        <UploadInput
                            value={filePreview}
                            handleUpload={this.handleUploadFile}
                            handleRemove={this.handleRemoveFile}
                            className="dropzone col-md-6"
                            multiple={false}
                            maxSize={60 * 1024 * 1024}
                        />
                    </div>
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

export default EventMaterialForm;
