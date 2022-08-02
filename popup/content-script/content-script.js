
(function() {
    /*
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    function sendBrowserContent(){
      var data = getTeamwworkDataFromSingleTicketPage(); 
      var content = formatTeamWorkData(data);
      return content; 
    }

    function formatTeamWorkData(data){
      return data.ticketSubject + ' (' + data.ticketId + ') ' + data.ticketCustomerFullname; 
    }

    function getTeamwworkDataFromSingleTicketPage(){

      var ticketId = document.getElementsByClassName("ticket-id")[0].innerHTML;
      var ticketCustomerFullname = document.getElementsByClassName("customer-fullname")[0].innerHTML;
      var ticketSubject = document.getElementsByClassName("title__subject-text")[0].textContent;

      var data = {
        ticketId: ticketId.trim(),
        ticketCustomerFullname: ticketCustomerFullname.trim(),
        ticketSubject: ticketSubject.trim(),
      }

      return data; 

    }


    function sendContentToPopup(){

        var extensionId = null;
        var message = {
            command: 'SEND_BROWSER_CONTENT',
            data: sendBrowserContent()
        }
        var options = {}

        browser.runtime.sendMessage(extensionId, message, options)
        .catch((error) => {
          console.log(error);
        });
  
    }
  
    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
    */

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "POPUP_FETCH_CONTENT") {
          sendContentToPopup();
        }
    });
  
  })();