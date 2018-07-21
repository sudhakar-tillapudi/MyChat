
    function updateAvailabilityStatus(Availability, loggedinEmailId)
{
    //alert('checking');
    for (var email in Availability) {
        //alert(email+ ' : '+Availability[email]);
        if (email !== 'undefined' && email !==  loggedinEmailId) {
            var onlineStatus = Availability[email];
            if (onlineStatus) {
                //alert(email.replace('@','').replace('.','').replace('_','')+ "OnlineStatus");
                //document.getElementById("sandhya" ).style.visibility = "visible";
                try{
                document.getElementById(email.replace('@','').replace('.','')+ "OnlineStatus").style.visibility = "visible";
                }
                catch(err)
                {
                    console.log(email);
                    console.log(err)
                }
                //$("\"#" + email + "_OnlineStatus" + "\"").hide();
            }
            else {
                //document.getElementById("sandhya" ).style.visibility = "hidden";
                //$("\"#"+email+"_OnlineStatus"+"\"").show();
                document.getElementById(email.replace('@','').replace('.','')+ "OnlineStatus").style.visibility = "hidden";
            }
        }
    }
}

