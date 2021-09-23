export function throttle(fn,delay=100){
    let flag=true;
    //let args=arguments
    return function(...args){
        if(!flag) return
        
        flag=false
        setTimeout(() => {
            fn.apply(fn,args)
            //this[fn](args);
            flag=true
            
        }, delay);
    }
}