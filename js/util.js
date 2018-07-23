
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
                try{
                document.getElementById(email.replace('@','').replace('.','')+ "OnlineStatus").style.visibility = "hidden";
            }
            catch(err)
            {
                console.log(email);
                console.log(err)
            }
            }
        }
    }
}

function getPlainEmailId(emailId)
{
    return emailId.replace('@','').replace('.','');
}

function messagesReadCompleted(sender,receiver,hasfocus)
{
    setTimeout(function(){
        if(hasfocus)
        {
            //now send a message to server saying that msg is viewed
            var senderPlainEmailId = getPlainEmailId(sender);
            $("#newMessagesCount"+senderPlainEmailId).text('0');
            $("#newMessagesCount"+senderPlainEmailId).css('visibility','hidden');
        }
        //send socket message to server
        socket.emit('msg-read-completed',{
            sender : sender,
            receiver : receiver,
            readCompletedTimestamp : new Date()
        })
    },3000);
}