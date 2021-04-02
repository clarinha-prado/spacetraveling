import { useEffect, useRef } from "react";

export default function Utter() {
    const reference = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://utteranc.es/client.js';
        scriptElement.async = true;
        scriptElement.defer = true;
        scriptElement.setAttribute('repo', "clarinha-prado/spacetraveling-comments");
        scriptElement.setAttribute('crossorigin', 'annonymous');
        scriptElement.setAttribute('theme', "photon-dark");
        scriptElement.setAttribute('issue-term', "pathname");

        reference.current.appendChild(scriptElement);
    }, []);

    return (
        <div >
            <div ref={reference}>
            </div>
        </div>
    );
}
