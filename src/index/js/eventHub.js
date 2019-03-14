window.eventHub={
    events:{

    },
    emit(eventHubName,data){
        for(let key in this.events){
            if(key===eventHubName){
                let fnList=this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventHubName,fn){
        if(this.events[eventHubName]===undefined){
            this.events[eventHubName]=[]
        }
        this.events[eventHubName].push(fn)

    }
}