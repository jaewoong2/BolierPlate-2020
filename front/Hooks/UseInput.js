import { useState, useCallback } from 'react'

export default (initalValue) => {
    const [value, setValue] = useState(initalValue);
    const changer = useCallback((e) => {
        setValue(e.target.value)
    },[])

    return [value, setValue, changer]
}