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

import
{
    RECEIVE_EVENT_CATEGORY,
    RESET_EVENT_CATEGORY_FORM,
    UPDATE_EVENT_CATEGORY
} from '../../actions/event-category-actions';

import { LOGOUT_USER } from '../../actions/auth-actions';
import { VALIDATE } from '../../actions/base-actions';
import { SET_CURRENT_SUMMIT } from '../../actions/summit-actions';

export const DEFAULT_ENTITY = {
    id                          : 0,
    name                        : '',
    code                        : '',
    description                 : '',
    sessions_count              : 0,
    alternate_count             : 0,
    lightning_count             : 0,
    lightning_alternate_count   : 0,
    voting_visible              : false,
    chair_visible               : false,
    tags                        : [],
    track_groups                : []
}

const DEFAULT_STATE = {
    entity      : DEFAULT_ENTITY,
    errors      : {}
};

const eventCategoryReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case LOGOUT_USER: {
            // we need this in case the token expired while editing the form
            if (payload.hasOwnProperty('persistStore')) {
                return state;
            } else {
                return {...state,  entity: {...DEFAULT_ENTITY}, errors: {} };
            }
        }
        break;
        case SET_CURRENT_SUMMIT:
        case RESET_EVENT_CATEGORY_FORM: {
            return {...state,  entity: {...DEFAULT_ENTITY}, errors: {} };
        }
        break;
        case UPDATE_EVENT_CATEGORY: {
            return {...state,  entity: {...payload}, errors: {} };
        }
        break;
        case RECEIVE_EVENT_CATEGORY: {
            let entity = {...payload.response};

            for(var key in entity) {
                if(entity.hasOwnProperty(key)) {
                    entity[key] = (entity[key] == null) ? '' : entity[key] ;
                }
            }

            return {...state, entity: {...DEFAULT_ENTITY, ...entity} };
        }
        break;
        case VALIDATE: {
            return {...state,  errors: payload.errors };
        }
        break;
        default:
            return state;
    }
};

export default eventCategoryReducer;