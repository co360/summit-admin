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
import {BulkActionEdit, BulkActionUnPublish} from "../../../constants";
import T from "i18n-react/dist/i18n-react";
import './styles.less';

class ScheduleAdminsBulkActionsSelector extends React.Component {

    onPerformBulkAction(){
        let selectedBulkAction = this.actionTypeSelect.value;
        if(selectedBulkAction == '') return;
        this.props.onSelectedBulkAction(selectedBulkAction);
    }

    render(){
        let {onSelectAll} = this.props;
        return (
            <div className="row bulk-actions-selector-container">
                <div className="col-md-6">
                    <input type="checkbox" onClick={onSelectAll}/>
                    <select ref={(select) => { this.actionTypeSelect = select; }}>
                        <option value="">{T.translate("published_bulk_actions_selector.options.default")}</option>
                        <option value={BulkActionEdit}>{T.translate("published_bulk_actions_selector.options.edit")}</option>
                        <option value={BulkActionUnPublish}>{T.translate("published_bulk_actions_selector.options.unpublish")}</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <button onClick={this.onPerformBulkAction.bind(this)} title={ T.translate("published_bulk_actions_selector.titles.go")} className="btn btn-default btn-sm">
                        <i className="fa fa-play">&nbsp;{T.translate("published_bulk_actions_selector.buttons.go")}</i>
                    </button>
                </div>
            </div>
        )
    }
}

export default ScheduleAdminsBulkActionsSelector;