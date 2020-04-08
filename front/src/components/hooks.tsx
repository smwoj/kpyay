import {useLayoutEffect, useState} from "react";

/** Allows components to be re-rendered upon window dimensions change. Based on https://stackoverflow.com/a/19014495 */
export function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}
