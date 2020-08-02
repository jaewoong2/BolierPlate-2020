import { useMemo } from 'react'

export default (initalValue) => {
    
    const stlyeMemo = useMemo(() => {
            if(initalValue !== undefined) {
                if(!initalValue){
                    return {
                       visibility : 'visible',
                       opacity : 1,                   
                       color : '#db0a0abd',
                       fontSize : '12px',
                       paddingLeft : '12px',
                       transition: 'visibility 0.3s, opacity 0.3s linear',
                       marginBottom : '7px',
    
                     }
                }
            } return {
                visibility: 'hidden',
                opacity: 0,
                transition: 'visibility 0.3s, opacity 0.3s linear',
                color : '#ad0303bd',
                paddingLeft : '12px', 
                fontSize : '12px',
                marginBottom : '7px',
            }
    },[initalValue])

    return stlyeMemo
}