/**
 * Determina se è presente la connerrione internet
 * Return:
 * 	 true, se la connessione è presente
 * 	 false, se la connessione è assente
 */
function Reachability(){
    this.IsNotConnected = function(){
        if(navigator.network.connection.type == Connection.NONE || navigator.network.connection.type == Connection.UNKNOWN){
            return true;
        }else{
            return false;
        }
    }
}