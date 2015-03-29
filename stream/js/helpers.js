/**
 * Created by vdidonato on 28/03/15.
 */
function lastByte (ip){
    var lastFour = ip.slice(-4);
    if (lastFour.indexOf(".") == 0) { return lastFour}
    if (lastFour.indexOf(".") == 1) { return lastFour.slice(-3) }
    if (lastFour.indexOf(".") == 2) { return lastFour.slice(-2)}
    return ip
}