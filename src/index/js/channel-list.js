{
    let view={
        el:'.page-1>.hot-song-list>ul',
        render(data){
            // <div>
            // </div>
            for(let key in data){
                let name=data[key].name
                let cover=data[key].cover
                let id=data[key].id
                console.log(id,'asdfghjj')
                let li=$(`
                <li> 
                <a href='./channel-list.html?id=${id}&name=${name}'>
                <img src='./index/song-list.jpg' alt="">
          
                 <span >${name}</span></a>
               
            </li>
                `)
                $(this.el).append(li)



            }

        }
    }
    let model={
        data:{
            songs:[]
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.bindEvents()

        },
        getChannels(value){
            var value={}
            $.ajax({
                url:'https://jirenguapi.applinzi.com/fm/getChannels.php',
                type:"get",
                // data:{id:value},
                dataType:"json",
                async:false, // 同步请求
                success:function(result){
                   
                    if(result != null && result != "" && result != undefined){
                        var data_ = result.channels[parseInt(Math.random()*20+1,10)];
                        value.cover=data_.cover_small
                        value.name=data_.name
                        value.id=data_.channel_id
                    
                    }
                }
            })
            this.model.data.songs.push(value)
             
           return value
        },
        bindEvents(){

            this.getChannels()
            this.getChannels()
            this.getChannels()
            this.getChannels()

            this.view.render( this.model.data.songs)      
        }
    }
    controller.init(view,model)

}