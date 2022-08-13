exports.deal_with = function (msg) {
    const message = msg

    if( typeof(msg) === "string" ) {
        
        return "OK!!! Your type is String"
    }
    else {
        
        return "OK!!! Your type is Number"
    }
}