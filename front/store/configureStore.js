import { createWrapper } from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from '../reducer'
import rootSaga from '../sagas';
import createSagaMiddleware from 'redux-saga'


const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middleWares = [sagaMiddleware];

    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middleWares))
    // production 일 때는, DevTools를 사용하지 않는다.
    : composeWithDevTools(applyMiddleware(...middleWares))
    // applyMiddleware는 미들웨어(saga) 를 적용시켜준다
    // middleWare는 스프레드를 사용해서 넣어줘야한다 (배열이 들어가면 안됨)
    // development 일 때는, DevTools를 사용한다.

    const store = createStore(reducer, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

const wrapper = createWrapper(configureStore, 
    { debug : process.env.NODE_ENV === 'development',}// 옵션설정
    )

export default wrapper;