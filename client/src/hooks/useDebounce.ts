import { useRef, useCallback } from 'react'

export const useDebounce = (callback: () => Promise<void>, delay: number) => {
    const timer = useRef<null | NodeJS.Timeout>(null)

    return useCallback( () => {
        if(timer.current) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout( async () => {            
            callback()
        }, delay )
    }, [callback, delay])
}