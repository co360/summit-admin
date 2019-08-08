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

import T from "i18n-react/dist/i18n-react";
import history from '../history'
import {
    getRequest,
    putRequest,
    postRequest,
    deleteRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    showSuccessMessage,
    authErrorHandler
} from 'openstack-uicore-foundation/lib/methods';


export const REQUEST_BADGE_FEATURES       = 'REQUEST_BADGE_FEATURES';
export const RECEIVE_BADGE_FEATURES       = 'RECEIVE_BADGE_FEATURES';
export const RECEIVE_BADGE_FEATURE        = 'RECEIVE_BADGE_FEATURE';
export const RESET_BADGE_FEATURE_FORM     = 'RESET_BADGE_FEATURE_FORM';
export const UPDATE_BADGE_FEATURE         = 'UPDATE_BADGE_FEATURE';
export const BADGE_FEATURE_UPDATED        = 'BADGE_FEATURE_UPDATED';
export const BADGE_FEATURE_ADDED          = 'BADGE_FEATURE_ADDED';
export const BADGE_FEATURE_DELETED        = 'BADGE_FEATURE_DELETED';

export const REQUEST_ACCESS_LEVELS       = 'REQUEST_ACCESS_LEVELS';
export const RECEIVE_ACCESS_LEVELS       = 'RECEIVE_ACCESS_LEVELS';
export const RECEIVE_ACCESS_LEVEL        = 'RECEIVE_ACCESS_LEVEL';
export const RESET_ACCESS_LEVEL_FORM     = 'RESET_ACCESS_LEVEL_FORM';
export const UPDATE_ACCESS_LEVEL         = 'UPDATE_BADGE_TYPE';
export const ACCESS_LEVEL_UPDATED        = 'ACCESS_LEVEL_UPDATED';
export const ACCESS_LEVEL_ADDED          = 'ACCESS_LEVEL_ADDED';
export const ACCESS_LEVEL_DELETED        = 'ACCESS_LEVEL_DELETED';

export const REQUEST_BADGE_TYPES       = 'REQUEST_BADGE_TYPES';
export const RECEIVE_BADGE_TYPES       = 'RECEIVE_BADGE_TYPES';
export const RECEIVE_BADGE_TYPE        = 'RECEIVE_BADGE_TYPE';
export const RESET_BADGE_TYPE_FORM     = 'RESET_BADGE_TYPE_FORM';
export const UPDATE_BADGE_TYPE         = 'UPDATE_BADGE_TYPE';
export const BADGE_TYPE_UPDATED        = 'BADGE_TYPE_UPDATED';
export const BADGE_TYPE_ADDED          = 'BADGE_TYPE_ADDED';
export const BADGE_TYPE_DELETED        = 'BADGE_TYPE_DELETED';
export const BADGE_ACCESS_LEVEL_ADDED        = 'BADGE_ACCESS_LEVEL_ADDED';
export const BADGE_ACCESS_LEVEL_REMOVED      = 'BADGE_ACCESS_LEVEL_REMOVED';




/***********************  BADGE TYPE  ************************************************/


export const getBadgeTypes = ( order = 'name', orderDir = 1 ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        page         : 1,
        per_page     : 100,
        access_token : accessToken,
    };

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_BADGE_TYPES),
        createAction(RECEIVE_BADGE_TYPES),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/tax-types`,
        authErrorHandler,
        {order, orderDir}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getBadgeType = (taxTypeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_BADGE_TYPE),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/tax-types/${taxTypeId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetBadgeTypeForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_BADGE_TYPE_FORM)({}));
};

export const saveBadgeType = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    dispatch(startLoading());

    let normalizedEntity = normalizeEntity(entity);

    if (entity.id) {

        putRequest(
            createAction(UPDATE_BADGE_TYPE),
            createAction(BADGE_TYPE_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/tax-types/${entity.id}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_tax_type.tax_type_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_tax_type.tax_type_created"),
            type: 'success'
        };

        postRequest(
            createAction(UPDATE_BADGE_TYPE),
            createAction(BADGE_TYPE_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/tax-types`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/tax-types/${payload.response.id}`) }
                ));
            });
    }
}

export const deleteBadgeType = (taxTypeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(BADGE_TYPE_DELETED)({taxTypeId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/tax-types/${taxTypeId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const addTicketToBadgeType = (taxTypeId, ticket) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken
    };

    return putRequest(
        null,
        createAction(BADGE_ACCESS_LEVEL_ADDED)({ticket}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/taxes/${taxTypeId}/tickets/${ticket.id}`,
        {},
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const removeTicketFromBadgeType = (taxTypeId, ticketId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(BADGE_ACCESS_LEVEL_REMOVED)({ticketId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/taxes/${taxTypeId}/tickets/${ticketId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};


const normalizeEntity = (entity) => {
    let normalizedEntity = {...entity};

    return normalizedEntity;

}



/***********************  BADGE FEATURE  ************************************************/


export const getBadgeFeatures = ( order = 'name', orderDir = 1 ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        page         : 1,
        per_page     : 100,
        access_token : accessToken,
    };

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_BADGE_FEATURES),
        createAction(RECEIVE_BADGE_FEATURES),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/badge-features`,
        authErrorHandler,
        {order, orderDir}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getBadgeFeature = (badgeFeatureId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_BADGE_FEATURE),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/badge-features/${badgeFeatureId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetBadgeFeatureForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_BADGE_FEATURE_FORM)({}));
};

export const saveBadgeFeature = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    dispatch(startLoading());

    let normalizedEntity = normalizeEntity(entity);

    if (entity.id) {

        putRequest(
            createAction(UPDATE_BADGE_FEATURE),
            createAction(BADGE_FEATURE_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/badge-features/${entity.id}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_badge_feature.badge_feature_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_badge_feature.badge_feature_created"),
            type: 'success'
        };

        postRequest(
            createAction(UPDATE_BADGE_FEATURE),
            createAction(BADGE_FEATURE_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/badge-features`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/badge-features/${payload.response.id}`) }
                ));
            });
    }
}

export const deleteBadgeFeature = (badgeFeatureId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(BADGE_FEATURE_DELETED)({badgeFeatureId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/badge-features/${badgeFeatureId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};



/***********************  ACCESS LEVEL  ************************************************/


export const getAccessLevels = ( order = 'name', orderDir = 1 ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        page         : 1,
        per_page     : 100,
        access_token : accessToken,
    };

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_ACCESS_LEVELS),
        createAction(RECEIVE_ACCESS_LEVELS),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/access-levels`,
        authErrorHandler,
        {order, orderDir}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getAccessLevel = (accessLevelId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_ACCESS_LEVEL),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/access-levels/${accessLevelId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetAccessLevelForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_ACCESS_LEVEL_FORM)({}));
};

export const saveAccessLevel = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    dispatch(startLoading());

    let normalizedEntity = normalizeEntity(entity);

    if (entity.id) {

        putRequest(
            createAction(UPDATE_ACCESS_LEVEL),
            createAction(ACCESS_LEVEL_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/access-levels/${entity.id}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_access_level.access_level_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_access_level.access_level_created"),
            type: 'success'
        };

        postRequest(
            createAction(UPDATE_ACCESS_LEVEL),
            createAction(ACCESS_LEVEL_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/access-levels`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/access-levels/${payload.response.id}`) }
                ));
            });
    }
}

export const deleteAccessLevel = (accessLevelId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(ACCESS_LEVEL_DELETED)({accessLevelId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/access-levels/${accessLevelId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};