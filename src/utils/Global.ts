export const Global = {
    renderer: null,
    scene:null,
    camera:null,
    loopCallBacks:[],
    addCbToFrame:(callback)=>{
        Global.loopCallBacks.push(callback)
    },
    updateCallBacks:() => {
        Global.loopCallBacks.map(callback => {
            callback();
        })
    }
}