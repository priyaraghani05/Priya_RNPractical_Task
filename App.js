import React, { useEffect, useRef, useState } from 'react';


import { StackNavigation } from './src/navigator';
import { persistor, store } from './src/reducer';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';


function App() {



    return (

        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <StackNavigation />
            </PersistGate>
        </Provider>

    );
}





export default App;
