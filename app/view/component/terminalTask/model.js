import { queryGetData, queryPOSTData, queryPUTData, removeRule, addRule } from '../../common/api';

export default {
  namespace: 'terminalTask',
  state: {
    list: [],
    pagination: {},
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    findAllReducer(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        pagination: payload.pagination,
      }
    },
  },
  effects: {
    *findAll({ payload }, { call, put }) {
      const response = yield call(queryGetData, payload)
      let list = []
      for(var i in response['[]']) {
        let heart_connect = response['[]'][i]['image_upload']
        if (heart_connect && heart_connect['gmt_create']) {
          response['[]'][i]['task']['image_url'] = heart_connect['image_url']
        }
        list.push(response['[]'][i]['task'])
      }

      const result = {
        list,
        pagination: {
          total: response.total,
          pageSize: payload['[]']['count'],
          current: payload['[]']['page'] + 1,
        },
      }
      yield put({
        type: 'findAllReducer',
        payload: result,
      })
    },
    *create({ payload }, { call, put }) {
      const data = yield call(queryPOSTData, payload)
      yield put({
        type: 'findAll',
        payload: {},
      })
    },
    *update({ payload }, { call, put }) {
      const data = yield call(queryPUTData, payload)
      yield put({
        type: 'findAll',
        payload: {},
      })
    },
    *remove({ payload }, { call, put }) {
      const data = yield call(queryPUTData, payload)
      yield put({
        type: 'findAll',
        payload: {},
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(a => {
        // if (pathname === '/users') {
        //   dispatch({ type: 'fetch', payload: query })
        // }
      })
    },
  },
}
