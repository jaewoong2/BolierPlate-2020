import React from 'react'
import Head from 'next/head'
import 'react-quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css';
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
        <main style={{ backgroundColor : '#6868dac0'}}>
            <Component {...pageProps}/>
        </main>
      
        </div>
    )
}

// export default wrapper.withRedux(withReduxSaga(booilerPlate));
export default wrapper.withRedux(booilerPlate)