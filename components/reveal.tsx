import type { CSSProperties, ElementType, ReactNode } from 'react';
/** Content is visible in server HTML without waiting for JavaScript or a scroll observer. */
export function Reveal({children,animation='fade-up',delay=0,duration=160,className='',as:Tag='div',threshold: _threshold,...rest}: {
 children: ReactNode;animation?: 'fade-up'|'fade-down'|'fade-right'|'fade-left'|'zoom-in'|'flip-up';
 delay?: number;duration?: number;className?: string;as?: ElementType;threshold?: number;[key:string]: any;
}) {
 const style:CSSProperties={transitionDuration:`${duration}ms`,transitionDelay:`${Math.min(delay,80)}ms`,...rest.style};
 return <Tag {...rest} className={`reveal reveal-${animation} reveal-visible ${className}`} style={style}>{children}</Tag>;
}
