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
    getCSV,
    authErrorHandler,
    escapeFilterValue
} from 'openstack-uicore-foundation/lib/methods';

export const REQUEST_PROMOCODES       = 'REQUEST_PROMOCODES';
export const RECEIVE_PROMOCODES       = 'RECEIVE_PROMOCODES';
export const RECEIVE_PROMOCODE        = 'RECEIVE_PROMOCODE';
export const RECEIVE_PROMOCODE_META   = 'RECEIVE_PROMOCODE_META';
export const RESET_PROMOCODE_FORM     = 'RESET_PROMOCODE_FORM';
export const UPDATE_PROMOCODE         = 'UPDATE_PROMOCODE';
export const PROMOCODE_UPDATED        = 'PROMOCODE_UPDATED';
export const PROMOCODE_ADDED          = 'PROMOCODE_ADDED';
export const PROMOCODE_DELETED        = 'PROMOCODE_DELETED';
export const EMAIL_SENT               = 'EMAIL_SENT';


export const DISCOUNT_TICKET_ADDED    = 'DISCOUNT_TICKET_ADDED';
export const DISCOUNT_TICKET_DELETED  = 'DISCOUNT_TICKET_DELETED';



export const BADGE_FEATURE_ADDED    = 'BADGE_FEATURE_ADDED';
export const BADGE_FEATURE_REMOVED  = 'BADGE_FEATURE_REMOVED';




export const getPromocodeMeta = () => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_PROMOCODE_META),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/metadata`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getPromocodes = ( term = null, page = 1, perPage = 10, order = 'code', orderDir = 1, type = 'ALL' ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;
    let filter = [];

    dispatch(startLoading());

    if(term){
        let escapedTerm = escapeFilterValue(term);
        filter.push(`code=@${escapedTerm},creator=@${escapedTerm},creator_email=@${escapedTerm},owner=@${escapedTerm},owner_email=@${escapedTerm},speaker=@${escapedTerm},speaker_email=@${escapedTerm},sponsor=@${escapedTerm}`);
    }

    if (type != 'ALL') {
        filter.push(`type==${type}`);
    }

    let params = {
        expand       : 'speaker,owner,sponsor,creator',
        page         : page,
        per_page     : perPage,
        access_token : accessToken,
    };

    if(filter.length > 0){
        params['filter[]']= filter;
    }

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_PROMOCODES),
        createAction(RECEIVE_PROMOCODES),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes`,
        authErrorHandler,
        {page, perPage, order, orderDir, type, term}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getPromocode = (promocodeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        expand       : 'owner,sponsor,sponsor.company,sponsor.sponsorship,speaker,tickets,ticket_type,ticket_types_rules',
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_PROMOCODE),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetPromocodeForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_PROMOCODE_FORM)({}));
};

export const savePromocode = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let normalizedEntity = normalizeEntity(entity);

    if (entity.id) {

        return putRequest(
            createAction(UPDATE_PROMOCODE),
            createAction(PROMOCODE_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${entity.id}?access_token=${accessToken}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )({})(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_promocode.promocode_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_promocode.promocode_created"),
            type: 'success'
        };

        return postRequest(
            createAction(UPDATE_PROMOCODE),
            createAction(PROMOCODE_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes?access_token=${accessToken}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )({})(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/promocodes/${payload.response.id}`) }
                ));
            });
    }
}

export const deletePromocode = (promocodeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(PROMOCODE_DELETED)({promocodeId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}`,
        null,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const sendEmail = (promocodeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return postRequest(
        null,
        createAction(EMAIL_SENT),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}/mail`,
        null,
        authErrorHandler
    )(params)(dispatch).then(
        (payload) => {
            dispatch(stopLoading());
            dispatch(showMessage(T.translate("general.done"), T.translate("general.mail_sent"), 'success'));
        });
};

export const exportPromocodes = ( term = null, order = 'code', orderDir = 1, type = 'ALL' ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;
    let filter = [];
    let filename = currentSummit.name + '-Promocodes.csv';

    let params = {
        access_token : accessToken,
        expand: 'owner_name,owner_email,sponsor_name',
        columns: 'code,type,owner_name,owner_email,sponsor_name,redeemed,email_sent'
    };

    if(term){
        let escapedTerm = escapeFilterValue(term);
        filter.push(`code=@${escapedTerm},creator=@${escapedTerm},creator_email=@${escapedTerm},owner=@${escapedTerm},owner_email=@${escapedTerm},speaker=@${escapedTerm},speaker_email=@${escapedTerm},sponsor=@${escapedTerm}`);
    }

    if (type != 'ALL') {
        filter.push(`type==${type}`);
    }

    if(filter.length > 0){
        params['filter[]']= filter;
    }

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }

    dispatch(getCSV(`${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/csv`, params, filename));

};


const normalizeEntity = (entity) => {
    let normalizedEntity = {...entity};

    if (entity.class_name.indexOf('MEMBER_') === 0) {
        if (entity.owner != null) {
            normalizedEntity.first_name = entity.owner.first_name;
            normalizedEntity.last_name = entity.owner.last_name;
            normalizedEntity.email = entity.owner.email;
        }
    } else if (entity.class_name.indexOf('SPEAKER_') === 0) {
        if (entity.speaker != null)
            normalizedEntity.speaker_id = entity.speaker.id;
    } else if (entity.class_name.indexOf('SPONSOR_') === 0) {
        if (entity.sponsor != null)
            normalizedEntity.sponsor_id = entity.sponsor.id;
        if (entity.owner != null) {
            normalizedEntity.first_name = entity.owner.first_name;
            normalizedEntity.last_name = entity.owner.last_name;
            normalizedEntity.email = entity.owner.email;
        }
    } else if (entity.class_name.indexOf('SUMMIT_') === 0) {

    }

    if (!entity.badge_type_id) {
        delete normalizedEntity['badge_type_id'];
    }

    // clear dates

    if (entity.valid_since_date === 0) {
        normalizedEntity.valid_since_date = "";
    }

    if (entity.valid_until_date === 0) {
        normalizedEntity.valid_until_date = "";
    }

    delete normalizedEntity['owner'];
    delete normalizedEntity['owner_id'];
    delete normalizedEntity['speaker'];
    delete normalizedEntity['sponsor'];

    return normalizedEntity;

}

/************************  BADGE FEATURES **********************************/

export const addBadgeFeatureToPromocode = (promocodeId, badgeFeature) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken
    };

    return putRequest(
        null,
        createAction(BADGE_FEATURE_ADDED)({badgeFeature}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}/badge-features/${badgeFeature.id}`,
        {},
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const removeBadgeFeatureFromPromocode = (promocodeId, badgeFeatureId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(BADGE_FEATURE_REMOVED)({badgeFeatureId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}/badge-features/${badgeFeatureId}`,
        null,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};



/************************  DICOUNT PROMOCODES **********************************/


export const addDiscountTicket = (ticket) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
        expand: 'ticket_types_rules'
    };

    return putRequest(
        null,
        createAction(DISCOUNT_TICKET_ADDED),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${ticket.owner_id}/ticket-types/${ticket.ticket_type_id}`,
        ticket,
        authErrorHandler
    )(params)(dispatch).then(
        (payload) => {
            dispatch(stopLoading());
        });

}


export const deleteDiscountTicket = (promocodeId, ticketId, ticketTypeId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(DISCOUNT_TICKET_DELETED)({ticketId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/promo-codes/${promocodeId}/ticket-types/${ticketTypeId}`,
        null,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};
