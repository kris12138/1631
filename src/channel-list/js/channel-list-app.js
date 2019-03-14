{
    let view={
        el:'.wapper>.new-song-list>ul',
        render(data){
            console.log(data)
            for(let key in data){
                // console.log(key)
                let name=data[key].name
                // console.log('hhhh')
                let singer=data[key].singer
                let url=data[key].url
                let id=data[key].id
                // console.log('urllll')
                // console.log(url)
                let search=window.location.search
                console.log(search.split('='))
                var channel_name=decodeURI( search.split('=')[2])
                $('.new-song-list>.name').text(channel_name+'专辑')




                let li=$(`
                <li>
                <a href='./song.html?id=${id}&name=${name}&singer=${singer}&url=${url}'>
                <h3>${name}</h3>
              
                <svg class="icon" aria-hidden="true" id="hot">
                
                        <use xlink:href="#icon-hot"></use>
                </svg>
                    <svg class="icon" aria-hidden="true" id="play">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                <span>${singer}</span>
                </a>
            </li>
                `)
                // console.log(li)
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
        getSong(channel_id){
            var value={}
            
            console.log(channel_id,'ll')
            $.ajax({
                url:'https://jirenguapi.applinzi.com/fm/getSong.php',
                type:"get",
                data:{channel: channel_id},
                dataType:"json",
                async:false, // 同步请求
                success:function(result){
                    if(result != null && result != "" && result != undefined){
                        var data_ = result.data;
                        value=result.song[0]
                        value.name=result.song[0].title
                        value.singer=result.song[0].artist
                        value.url=result.song[0].url
                        value.id=result.song[0].sid
                        // console.log(result.song[0])
                    }
                }
            })
            this.model.data.songs.push(value)
           return value
        },
        bindEvents(){ 
            let search=window.location.search
            var channel_id=search.split('=')[1]
          this.getSong("public_shiguang_lvxing")
            this.getSong("public_tuijian_wangluo")
            this.getSong("public_tuijian_chengmingqu")
            this.getSong("public_fengge_liuxing")
         



            this.view.render( this.model.data.songs)
            
         
        }
    }
    //     bindEvents(){
    //         var query = new AV.Query('Sing');
    //         query.find().then((sings)=>{
    //             console.log(sings,'ddddddddd')
    //             for(let key in sings){
    //                 let name=sings[key].attributes.name
    //                 let singer=sings[key].attributes.singer
    //                 let url=sings[key].attributes.url
    //                 let id=sings[key].id
    //                 this.model.data.songs.push({name:name,singer:singer,url:url,id:id})
    //             }
    //             this.view.render( this.model.data.songs)
    //             // console.log(this.model.data)
    //         }).then(function(todos) {
    //           // 更新成功
    //         }, function (error) {
    //           // 异常处理
    //         });
    //     }
    // }
    controller.init(view,model)

}