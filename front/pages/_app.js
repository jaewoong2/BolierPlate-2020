import React from 'react'
import Head from 'next/head'
import 'antd/dist/antd.css'
import wrapper from '../store/configureStore'
import withReduxSaga from 'next-redux-saga';

const booilerPlate = ({Component, pageProps}) => {
    return (
        <div>
        <Head>
            <meta charSet="utf-8"></meta>
            <title>Woong'S-page</title>
        </Head>
        <main>
            <Component {...pageProps}/>
        </main>
      
        </div>
    )
}

export default wrapper.withRedux(withReduxSaga(booilerPlate));