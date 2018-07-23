
function updateAvailabilityStatus(Availability, loggedinEmailId) {
    //alert('checking');
    for (var email in Availability) {
        //alert(email+ ' : '+Availability[email]);
        if (email !== 'undefined' && email !== loggedinEmailId) {
            var onlineStatus = Availability[email];
            var element = document.getElementById(getPlainEmailId(email) + "OnlineStatus");
            if (element != null) {
                if (onlineStatus) {
                    element.style.visibility = "visible";
                }
                else {
                    element.style.visibility = "hidden";
                }
            }
        }
    }
}

function updateUnreadMsgsCount(UnreadMsgs, loggedinEmailId) {
    for (var email in UnreadMsgs) {
        if (email !== 'undefined' && email !== loggedinEmailId) {
            var unreadMsgCount = UnreadMsgs[email];
            var element = document.getElementById("newMessagesCount" +getPlainEmailId(email));
            if (element != null) {
                if (unreadMsgCount > 0) {
                    element.text = unreadMsgCount;
                    element.style.visibility = "visible";
                }
                else {
                    element.text = '0';
                    element.style.visibility = "hidden";
                }
            }
        }
    }
}

function getPlainEmailId(emailId) {
    return emailId.replace('@', '').replace('.', '');
}

function messagesReadCompleted(sender, receiver, hasfocus) {
    setTimeout(function () {
        if (hasfocus) {
            //now send a message to server saying that msg is viewed
            var senderPlainEmailId = getPlainEmailId(sender);
            $("#newMessagesCount" + senderPlainEmailId).text('0');
            $("#newMessagesCount" + senderPlainEmailId).css('visibility', 'hidden');

            document.title = 'MyChat - Home';
            console.log(intervalIds);
            clearInterval(intervalIds[sender]);
            intervalIds[sender] = null;
            //send socket message to server
            socket.emit('msg-read-completed', {
                sender: sender,
                receiver: receiver,
                readCompletedTimestamp: new Date()
            });
        }

    }, 3000);
}