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
import { connect } from 'react-redux';
import T from 'i18n-react/dist/i18n-react';
import swal from "sweetalert2";
import { loadSummits, setCurrentSummit, deleteSummit } from '../../actions/summit-actions';
import { formatEpoch } from 'openstack-uicore-foundation/lib/methods';
import Member from '../../models/member'

import '../../styles/summit-directory-page.less';

class SummitDirectoryPage extends React.Component {

    constructor(props){
        super(props);
    }

    componentWillMount () {
        this.props.setCurrentSummit(null);
        this.props.loadSummits();
    }

    onSelectedSummit(event, summit){
        event.preventDefault();
        this.props.setCurrentSummit(summit, this.props.history);
        return false;
    }

    onEditSummit(summit, ev){
        let {history} = this.props;
        ev.preventDefault();

        history.push(`/app/summits/${summit.id}`);
    }

    onNewSummit(ev){
        let {history} = this.props;
        ev.preventDefault();

        history.push(`/app/summits/new`);
    }

    onDeleteSummit(summit, ev){
        let {deleteSummit} = this.props;

        ev.preventDefault();

        swal({
            title: T.translate("general.are_you_sure"),
            text: T.translate("directory.remove_warning") + ' ' + summit.name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: T.translate("general.yes_delete")
        }).then(function(result){
            if (result.value) {
                deleteSummit(summit.id);
            }
        }).catch(swal.noop);
    }

    render() {
        let { summits, member } = this.props;
        let memberObj = new Member(member);
        let orderedSummits = summits.sort(
            (a, b) => (a.start_date < b.start_date ? 1 : (a.start_date > b.start_date ? -1 : 0))
        );
        let canEditSummit =  memberObj.canEditSummit();

        return (
            <div className="container">
                <h3> {T.translate("directory.summits")}</h3>
                {canEditSummit &&
                <div className={'row'}>
                    <div className="col-md-6 col-md-offset-6 text-right">
                        <button className="btn btn-primary right-space" onClick={this.onNewSummit.bind(this)}>
                            {T.translate("directory.add_summit")}
                        </button>
                    </div>
                </div>
                }
                <div>
                    <table className="table" id="summit_table">
                        <tbody>
                        {summits && orderedSummits.map((summit,i) => (
                            <tr key={"summit_"+summit.id}>
                                <td className="summit_name"> {summit.name} </td>
                                <td> {formatEpoch(summit.start_date, 'MMMM Do YYYY')} </td>
                                <td> {formatEpoch(summit.end_date, 'MMMM Do YYYY')} </td>
                                <td className="center_text actions">
                                    <a href="" onClick={ (e) => { return this.onSelectedSummit(e, summit) }} className="btn btn-default btn-sm">
                                        {T.translate("directory.select")}
                                    </a>
                                    {canEditSummit &&
                                    <a href="" onClick={this.onEditSummit.bind(this, summit)}
                                       className="btn btn-default btn-sm">
                                        {T.translate("general.edit")}
                                    </a>
                                    }
                                    {canEditSummit &&
                                    <a href="" onClick={this.onDeleteSummit.bind(this, summit)}
                                       className="btn btn-danger btn-sm">
                                        {T.translate("general.delete")}
                                    </a>
                                    }
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ directoryState, loggedUserState }) => ({
    summits : directoryState.items,
    member: loggedUserState.member
})

export default connect (
    mapStateToProps,
    {
        loadSummits,
        setCurrentSummit,
        deleteSummit
    }
)(SummitDirectoryPage);
